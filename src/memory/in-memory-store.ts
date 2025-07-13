/**
 * In-memory store for environments where SQLite is not available
 * Provides the same API as SQLite store but data is not persistent
 */

import type {
  InMemoryEntry,
  MemoryStoreOptions,
  MemoryEntry,
  MemoryListOptions,
  MemorySearchOptions,
  MemorySearchResult,
  IMemoryStore
} from './types.js';

class InMemoryStore implements IMemoryStore {
  private options: any;
  private data = new Map<string, Map<string, InMemoryEntry>>(); // namespace -> Map(key -> entry)
  private isInitialized = false;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(options: any = {}) {
    this.options = options;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize default namespace
    this.data.set('default', new Map<string, InMemoryEntry>());
    
    // Start cleanup interval for expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch(err => 
        console.error(`[${new Date().toISOString()}] ERROR [in-memory-store] Cleanup failed:`, err)
      );
    }, 60000); // Run cleanup every minute

    this.isInitialized = true;
    console.error(`[${new Date().toISOString()}] INFO [in-memory-store] Initialized in-memory store`);
  }

  private _getNamespaceMap(namespace: string): Map<string, InMemoryEntry> {
    if (!this.data.has(namespace)) {
      this.data.set(namespace, new Map<string, InMemoryEntry>());
    }
    return this.data.get(namespace)!;
  }

  async store(key: string, value: any, options: MemoryStoreOptions = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const namespaceMap = this._getNamespaceMap(namespace);
    
    const now = Date.now();
    const ttl = options.ttl || null;
    const expiresAt = ttl ? now + (ttl * 1000) : null;
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    const entry: InMemoryEntry = {
      key,
      value: valueStr,
      namespace,
      metadata: options.metadata || null,
      createdAt: namespaceMap.has(key) ? namespaceMap.get(key)!.createdAt : now,
      updatedAt: now,
      accessedAt: now,
      accessCount: namespaceMap.has(key) ? namespaceMap.get(key)!.accessCount + 1 : 1,
      ttl,
      expiresAt
    };

    namespaceMap.set(key, entry);

    return {
      success: true,
      id: `${namespace}:${key}`,
      size: valueStr.length
    };
  }

  async retrieve(key: string, options: { namespace?: string } = {}): Promise<any> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const namespaceMap = this._getNamespaceMap(namespace);
    
    const entry = namespaceMap.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      namespaceMap.delete(key);
      return null;
    }

    // Update access stats
    entry.accessedAt = Date.now();
    entry.accessCount++;

    // Try to parse as JSON, fall back to raw string
    try {
      return JSON.parse(entry.value);
    } catch {
      return entry.value;
    }
  }

  async list(options: MemoryListOptions = {}): Promise<MemoryEntry[]> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const limit = options.limit || 100;
    const namespaceMap = this._getNamespaceMap(namespace);
    
    const entries = Array.from(namespaceMap.values())
      .filter(entry => !entry.expiresAt || entry.expiresAt > Date.now())
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);

    return entries.map(entry => ({
      key: entry.key,
      value: this._tryParseJson(entry.value),
      namespace: entry.namespace,
      metadata: entry.metadata,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
      accessedAt: new Date(entry.accessedAt),
      accessCount: entry.accessCount,
      ttl: entry.ttl,
      expiresAt: entry.expiresAt ? new Date(entry.expiresAt) : null
    }));
  }

  async delete(key: string, options: { namespace?: string } = {}): Promise<boolean> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const namespaceMap = this._getNamespaceMap(namespace);
    
    return namespaceMap.delete(key);
  }

  async search(pattern: string, options: MemorySearchOptions = {}): Promise<MemorySearchResult[]> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const limit = options.limit || 50;
    const namespaceMap = this._getNamespaceMap(namespace);
    
    const searchLower = pattern.toLowerCase();
    const results: MemorySearchResult[] = [];

    for (const [key, entry] of namespaceMap.entries()) {
      // Skip expired entries
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        continue;
      }

      // Search in key and value
      if (key.toLowerCase().includes(searchLower) || 
          entry.value.toLowerCase().includes(searchLower)) {
        results.push({
          key: entry.key,
          value: this._tryParseJson(entry.value),
          namespace: entry.namespace,
          score: entry.accessCount,
          updatedAt: new Date(entry.updatedAt),
          metadata: entry.metadata
        });
      }

      if (results.length >= limit) {
        break;
      }
    }

    // Sort by score (access count) and updated time
    return results.sort((a, b) => {
      if (a.score !== b.score) return (b.score || 0) - (a.score || 0);
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }

  async cleanup(): Promise<number> {
    await this.initialize();
    
    let cleaned = 0;
    const now = Date.now();

    for (const [namespace, namespaceMap] of this.data.entries()) {
      for (const [key, entry] of namespaceMap.entries()) {
        if (entry.expiresAt && entry.expiresAt <= now) {
          namespaceMap.delete(key);
          cleaned++;
        }
      }
    }

    return cleaned;
  }

  private _tryParseJson(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  close(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.data.clear();
    this.isInitialized = false;
  }
}

export { InMemoryStore };
export default InMemoryStore;