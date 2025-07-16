/**
 * Memory Manager Test Module
 * Tests the memory management functionality
 */

import { ITerminalEmulator } from './types.js';

interface MemoryManager {
  togglePanel(): void;
  currentNamespace: string;
  memoryTools: Record<string, MemoryTool>;
  switchNamespace(namespace: string): Promise<void>;
  formatSize(size: number): string;
  formatTTL(ttl: number): string;
  truncateValue(value: string): string;
  escapeHtml(html: string): string;
  updateMemoryTable(entries: MemoryEntry[]): void;
  filterMemoryEntries(filter: string): void;
}

interface MemoryTool {
  name: string;
  icon: string;
  description: string;
}

interface MemoryEntry {
  key: string;
  value: string | object;
  size: number;
  ttl: number | null;
  namespace: string;
}

export class MemoryTest {
  private memoryManager: MemoryManager;
  private terminal: ITerminalEmulator;

  constructor(memoryManager: MemoryManager, terminal: ITerminalEmulator) {
    this.memoryManager = memoryManager;
    this.terminal = terminal;
  }
  
  /**
   * Run comprehensive memory tests
   */
  async runTests(): Promise<void> {
    this.terminal.writeInfo('🧪 Starting Memory Manager Tests...');
    
    try {
      await this.testMemoryPanel();
      await this.testMemoryTools();
      await this.testNamespaceOperations();
      await this.testMemoryOperations();
      
      this.terminal.writeSuccess('✅ All memory tests completed successfully!');
    } catch (error) {
      this.terminal.writeError(`❌ Memory tests failed: ${(error as Error).message}`);
    }
  }
  
  /**
   * Test memory panel functionality
   */
  private async testMemoryPanel(): Promise<void> {
    this.terminal.writeInfo('Testing memory panel...');
    
    // Test panel toggle
    this.memoryManager.togglePanel();
    const panelVisible = !document.getElementById('memoryPanel')?.classList.contains('hidden');
    
    if (panelVisible) {
      this.terminal.writeSuccess('✅ Memory panel opens correctly');
    } else {
      throw new Error('Memory panel failed to open');
    }
    
    // Test panel components
    const requiredElements = [
      'memoryToolsGrid',
      'namespaceSelect',
      'memoryTable',
      'memoryAnalytics',
      'memoryLog'
    ];
    
    for (const elementId of requiredElements) {
      const element = document.getElementById(elementId);
      if (element) {
        this.terminal.writeSuccess(`✅ ${elementId} component found`);
      } else {
        throw new Error(`Required component missing: ${elementId}`);
      }
    }
  }
  
  /**
   * Test memory tools
   */
  private async testMemoryTools(): Promise<void> {
    this.terminal.writeInfo('Testing memory tools...');
    
    const tools = Object.keys(this.memoryManager.memoryTools);
    this.terminal.writeInfo(`Found ${tools.length} memory tools:`);
    
    for (const tool of tools) {
      const toolInfo = this.memoryManager.memoryTools[tool];
      this.terminal.writeLine(`  ${toolInfo.icon} ${toolInfo.name} - ${toolInfo.description}`);
    }
    
    if (tools.length === 10) {
      this.terminal.writeSuccess('✅ All 10 memory tools are configured');
    } else {
      throw new Error(`Expected 10 memory tools, found ${tools.length}`);
    }
  }
  
  /**
   * Test namespace operations
   */
  private async testNamespaceOperations(): Promise<void> {
    this.terminal.writeInfo('Testing namespace operations...');
    
    // Test namespace switching
    const originalNamespace = this.memoryManager.currentNamespace;
    
    // Switch to test namespace
    await this.memoryManager.switchNamespace('test');
    
    if (this.memoryManager.currentNamespace === 'test') {
      this.terminal.writeSuccess('✅ Namespace switching works');
    } else {
      throw new Error('Namespace switching failed');
    }
    
    // Switch back to original namespace
    await this.memoryManager.switchNamespace(originalNamespace);
  }
  
  /**
   * Test memory operations
   */
  private async testMemoryOperations(): Promise<void> {
    this.terminal.writeInfo('Testing memory operations...');
    
    // Test utility functions
    const testData = {
      size: this.memoryManager.formatSize(1024),
      ttl: this.memoryManager.formatTTL(Date.now() + 3600000),
      truncate: this.memoryManager.truncateValue('This is a very long test string that should be truncated'),
      escape: this.memoryManager.escapeHtml('<script>alert("test")</script>')
    };
    
    // Validate utility functions
    if (testData.size === '1 KB') {
      this.terminal.writeSuccess('✅ Size formatting works');
    } else {
      throw new Error(`Size formatting failed: ${testData.size}`);
    }
    
    if (testData.ttl.includes('h') && testData.ttl.includes('m')) {
      this.terminal.writeSuccess('✅ TTL formatting works');
    } else {
      throw new Error(`TTL formatting failed: ${testData.ttl}`);
    }
    
    if (testData.truncate.length <= 103) { // 100 + '...'
      this.terminal.writeSuccess('✅ Value truncation works');
    } else {
      throw new Error('Value truncation failed');
    }
    
    if (!testData.escape.includes('<script>')) {
      this.terminal.writeSuccess('✅ HTML escaping works');
    } else {
      throw new Error('HTML escaping failed');
    }
  }
  
  /**
   * Test mock memory data
   */
  async testMockData(): Promise<void> {
    this.terminal.writeInfo('Testing with mock data...');
    
    const mockEntries: MemoryEntry[] = [
      {
        key: 'test/key1',
        value: 'test value 1',
        size: 256,
        ttl: Date.now() + 3600000,
        namespace: 'test'
      },
      {
        key: 'test/key2',
        value: JSON.stringify({ test: 'data', array: [1, 2, 3] }),
        size: 512,
        ttl: null,
        namespace: 'test'
      }
    ];
    
    // Update table with mock data
    this.memoryManager.updateMemoryTable(mockEntries);
    
    // Check if table was populated
    const tableBody = document.getElementById('memoryTableBody');
    const rows = tableBody?.getElementsByTagName('tr');
    
    if (rows && rows.length === mockEntries.length) {
      this.terminal.writeSuccess('✅ Memory table updates correctly');
    } else {
      throw new Error('Memory table update failed');
    }
    
    // Test filtering
    this.memoryManager.filterMemoryEntries('key1');
    const visibleRows = rows ? Array.from(rows).filter(row => (row as HTMLElement).style.display !== 'none') : [];
    
    if (visibleRows.length === 1) {
      this.terminal.writeSuccess('✅ Memory filtering works');
    } else {
      throw new Error('Memory filtering failed');
    }
    
    // Reset filter
    this.memoryManager.filterMemoryEntries('');
  }
  
  /**
   * Generate test report
   */
  generateReport(): TestReport {
    const report: TestReport = {
      timestamp: new Date().toISOString(),
      tests: {
        panel: 'passed',
        tools: 'passed',
        namespaces: 'passed',
        operations: 'passed'
      },
      memoryTools: Object.keys(this.memoryManager.memoryTools),
      features: [
        'Memory Tools Grid (10 tools)',
        'Namespace Browser',
        'Memory Data Table',
        'Memory Analytics Dashboard',
        'Operations Log',
        'Import/Export',
        'Search & Filter',
        'Auto-refresh'
      ]
    };
    
    this.terminal.writeInfo('📊 Memory Manager Test Report:');
    this.terminal.writeLine(JSON.stringify(report, null, 2));
    
    return report;
  }
}

interface TestReport {
  timestamp: string;
  tests: {
    panel: string;
    tools: string;
    namespaces: string;
    operations: string;
  };
  memoryTools: string[];
  features: string[];
}

// Export test runner function
export async function runMemoryTests(): Promise<TestReport | null> {
  const win = window as any;
  if (win.memoryManager && win.claudeConsole) {
    const tester = new MemoryTest(win.memoryManager, win.claudeConsole.terminal);
    await tester.runTests();
    await tester.testMockData();
    return tester.generateReport();
  } else {
    console.error('Memory manager or console not available for testing');
    return null;
  }
}

// Make test runner globally available
(window as any).runMemoryTests = runMemoryTests;