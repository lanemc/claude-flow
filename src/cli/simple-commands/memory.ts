// memory.ts - Memory management commands
import { printSuccess, printError, printWarning } from '../utils';
import { Deno, cwd, exit, existsSync } from '../node-compat';

interface MemoryFlags {
  help?: boolean;
  h?: boolean;
  namespace?: string;
  ns?: string;
}

interface MemoryEntry {
  key: string;
  value: string;
  namespace: string;
  timestamp: number;
}

interface MemoryData {
  [namespace: string]: MemoryEntry[];
}

type LoadMemoryFunction = () => Promise<MemoryData>;
type SaveMemoryFunction = (data: MemoryData) => Promise<void>;

export async function memoryCommand(subArgs: string[], flags: MemoryFlags): Promise<void> {
  const memorySubcommand = subArgs[0];
  const memoryStore = './memory/memory-store.json';
  
  // Helper to load memory data
  async function loadMemory(): Promise<MemoryData> {
    try {
      const content = await (Deno as any).readTextFile(memoryStore);
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
  
  // Helper to save memory data
  async function saveMemory(data: MemoryData): Promise<void> {
    await (Deno as any).mkdir('./memory', { recursive: true });
    await (Deno as any).writeTextFile(memoryStore, JSON.stringify(data, null, 2));
  }
  
  switch (memorySubcommand) {
    case 'store':
      await storeMemory(subArgs, flags, loadMemory, saveMemory);
      break;
      
    case 'query':
      await queryMemory(subArgs, flags, loadMemory);
      break;
      
    case 'stats':
      await showMemoryStats(loadMemory);
      break;
      
    case 'export':
      await exportMemory(subArgs, flags, loadMemory);
      break;
      
    case 'import':
      await importMemory(subArgs, flags, saveMemory, loadMemory);
      break;
      
    case 'clear':
      await clearMemory(subArgs, flags, saveMemory, loadMemory);
      break;
      
    case 'list':
      await listNamespaces(loadMemory);
      break;
      
    default:
      showMemoryHelp();
  }
}

async function storeMemory(
  subArgs: string[], 
  flags: MemoryFlags,
  loadMemory: LoadMemoryFunction, 
  saveMemory: SaveMemoryFunction
): Promise<void> {
  const key = subArgs[1];
  const value = subArgs.slice(2).join(' ');
  
  if (!key || !value) {
    printError('Usage: memory store <key> <value>');
    return;
  }
  
  try {
    const data = await loadMemory();
    const namespace = getNamespaceFromArgs(subArgs, flags) || 'default';
    
    if (!data[namespace]) {
      data[namespace] = [];
    }
    
    // Remove existing entry with same key
    data[namespace] = data[namespace].filter(e => e.key !== key);
    
    // Add new entry
    data[namespace].push({
      key,
      value,
      namespace,
      timestamp: Date.now()
    });
    
    await saveMemory(data);
    printSuccess('Stored successfully');
    console.log(`📝 Key: ${key}`);
    console.log(`📦 Namespace: ${namespace}`);
    console.log(`💾 Size: ${new TextEncoder().encode(value).length} bytes`);
  } catch (err) {
    printError(`Failed to store: ${(err as Error).message}`);
  }
}

async function queryMemory(
  subArgs: string[], 
  flags: MemoryFlags,
  loadMemory: LoadMemoryFunction
): Promise<void> {
  const search = subArgs.slice(1).join(' ');
  
  if (!search) {
    printError('Usage: memory query <search>');
    return;
  }
  
  try {
    const data = await loadMemory();
    const namespace = getNamespaceFromArgs(subArgs, flags);
    const results: MemoryEntry[] = [];
    
    for (const [ns, entries] of Object.entries(data)) {
      if (namespace && ns !== namespace) continue;
      
      for (const entry of entries) {
        if (entry.key.includes(search) || entry.value.includes(search)) {
          results.push(entry);
        }
      }
    }
    
    if (results.length === 0) {
      printWarning('No results found');
      return;
    }
    
    printSuccess(`Found ${results.length} results:`);
    
    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);
    
    for (const entry of results.slice(0, 10)) {
      console.log(`\n📌 ${entry.key}`);
      console.log(`   Namespace: ${entry.namespace}`);
      console.log(`   Value: ${entry.value.substring(0, 100)}${entry.value.length > 100 ? '...' : ''}`);
      console.log(`   Stored: ${new Date(entry.timestamp).toLocaleString()}`);
    }
    
    if (results.length > 10) {
      console.log(`\n... and ${results.length - 10} more results`);
    }
  } catch (err) {
    printError(`Failed to query: ${(err as Error).message}`);
  }
}

async function showMemoryStats(loadMemory: LoadMemoryFunction): Promise<void> {
  try {
    const data = await loadMemory();
    let totalEntries = 0;
    const namespaceStats: Record<string, number> = {};
    
    for (const [namespace, entries] of Object.entries(data)) {
      namespaceStats[namespace] = entries.length;
      totalEntries += entries.length;
    }
    
    printSuccess('Memory Bank Statistics:');
    console.log(`   Total Entries: ${totalEntries}`);
    console.log(`   Namespaces: ${Object.keys(data).length}`);
    console.log(`   Size: ${(new TextEncoder().encode(JSON.stringify(data)).length / 1024).toFixed(2)} KB`);
    
    if (Object.keys(data).length > 0) {
      console.log('\n📁 Namespace Breakdown:');
      for (const [namespace, count] of Object.entries(namespaceStats)) {
        console.log(`   ${namespace}: ${count} entries`);
      }
    }
  } catch (err) {
    printError(`Failed to get stats: ${(err as Error).message}`);
  }
}

async function exportMemory(
  subArgs: string[], 
  flags: MemoryFlags,
  loadMemory: LoadMemoryFunction
): Promise<void> {
  const filename = subArgs[1] || `memory-export-${Date.now()}.json`;
  
  try {
    const data = await loadMemory();
    const namespace = getNamespaceFromArgs(subArgs, flags);
    
    let exportData = data;
    if (namespace) {
      exportData = { [namespace]: data[namespace] || [] };
    }
    
    await (Deno as any).writeTextFile(filename, JSON.stringify(exportData, null, 2));
    printSuccess(`Memory exported to ${filename}`);
    
    let totalEntries = 0;
    for (const entries of Object.values(exportData)) {
      totalEntries += entries.length;
    }
    console.log(`📦 Exported ${totalEntries} entries from ${Object.keys(exportData).length} namespace(s)`);
  } catch (err) {
    printError(`Failed to export memory: ${(err as Error).message}`);
  }
}

async function importMemory(
  subArgs: string[], 
  flags: MemoryFlags,
  saveMemory: SaveMemoryFunction,
  loadMemory: LoadMemoryFunction
): Promise<void> {
  const filename = subArgs[1];
  
  if (!filename) {
    printError('Usage: memory import <filename>');
    return;
  }
  
  try {
    const importContent = await (Deno as any).readTextFile(filename);
    const importData: MemoryData = JSON.parse(importContent);
    
    // Load existing memory
    const existingData = await loadMemory();
    
    // Merge imported data
    let totalImported = 0;
    for (const [namespace, entries] of Object.entries(importData)) {
      if (!existingData[namespace]) {
        existingData[namespace] = [];
      }
      
      // Add entries that don't already exist (by key)
      const existingKeys = new Set(existingData[namespace].map(e => e.key));
      const newEntries = entries.filter(e => !existingKeys.has(e.key));
      
      existingData[namespace].push(...newEntries);
      totalImported += newEntries.length;
    }
    
    await saveMemory(existingData);
    printSuccess(`Imported ${totalImported} new entries from ${filename}`);
  } catch (err) {
    printError(`Failed to import memory: ${(err as Error).message}`);
  }
}

async function clearMemory(
  subArgs: string[], 
  flags: MemoryFlags,
  saveMemory: SaveMemoryFunction,
  loadMemory: LoadMemoryFunction
): Promise<void> {
  const namespace = getNamespaceFromArgs(subArgs, flags);
  
  if (!namespace) {
    printError('Usage: memory clear --namespace <namespace>');
    printWarning('This will clear all entries in the specified namespace');
    return;
  }
  
  try {
    const data = await loadMemory();
    
    if (!data[namespace]) {
      printWarning(`Namespace '${namespace}' does not exist`);
      return;
    }
    
    const entryCount = data[namespace].length;
    delete data[namespace];
    
    await saveMemory(data);
    printSuccess(`Cleared ${entryCount} entries from namespace '${namespace}'`);
  } catch (err) {
    printError(`Failed to clear memory: ${(err as Error).message}`);
  }
}

async function listNamespaces(loadMemory: LoadMemoryFunction): Promise<void> {
  try {
    const data = await loadMemory();
    const namespaces = Object.keys(data);
    
    if (namespaces.length === 0) {
      printWarning('No namespaces found');
      return;
    }
    
    printSuccess('Available namespaces:');
    for (const namespace of namespaces) {
      const count = data[namespace].length;
      console.log(`  ${namespace} (${count} entries)`);
    }
  } catch (err) {
    printError(`Failed to list namespaces: ${(err as Error).message}`);
  }
}

function getNamespaceFromArgs(subArgs: string[], flags: MemoryFlags): string | null {
  // Check flags first
  if (flags.namespace) return flags.namespace;
  if (flags.ns) return flags.ns;
  
  // Check subArgs
  const namespaceIndex = subArgs.indexOf('--namespace');
  if (namespaceIndex !== -1 && namespaceIndex + 1 < subArgs.length) {
    return subArgs[namespaceIndex + 1];
  }
  
  const nsIndex = subArgs.indexOf('--ns');
  if (nsIndex !== -1 && nsIndex + 1 < subArgs.length) {
    return subArgs[nsIndex + 1];
  }
  
  return null;
}

function showMemoryHelp(): void {
  console.log('Memory commands:');
  console.log('  store <key> <value>    Store a key-value pair');
  console.log('  query <search>         Search for entries');
  console.log('  stats                  Show memory statistics');
  console.log('  export [filename]      Export memory to file');
  console.log('  import <filename>      Import memory from file');
  console.log('  clear --namespace <ns> Clear a namespace');
  console.log('  list                   List all namespaces');
  console.log();
  console.log('Options:');
  console.log('  --namespace <ns>       Specify namespace for operations');
  console.log('  --ns <ns>              Short form of --namespace');
  console.log();
  console.log('Examples:');
  console.log('  memory store previous_work "Research findings from yesterday"');
  console.log('  memory query research --namespace sparc');
  console.log('  memory export backup.json --namespace default');
  console.log('  memory import project-memory.json');
  console.log('  memory stats');
}