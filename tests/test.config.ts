/**
 * Test configuration and setup utilities
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let testTempDir: string;

/**
 * Setup test environment
 */
export function setupTestEnv(): void {
  // Create temporary directory for test files
  testTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-flow-test-'));
  
  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.CLAUDE_FLOW_TEST_MODE = 'true';
  process.env.CLAUDE_FLOW_DATA_DIR = testTempDir;
  
  // Mock Date.now for consistent testing
  const originalDateNow = Date.now;
  Date.now = jest.fn(() => 1640995200000); // 2022-01-01T00:00:00.000Z
}

/**
 * Cleanup test environment
 */
export async function cleanupTestEnv(): Promise<void> {
  // Restore original Date.now
  (Date.now as jest.Mock).mockRestore?.();
  
  // Clean up temporary directory
  if (testTempDir && fs.existsSync(testTempDir)) {
    fs.rmSync(testTempDir, { recursive: true, force: true });
  }
  
  // Clear environment variables
  delete process.env.CLAUDE_FLOW_TEST_MODE;
  delete process.env.CLAUDE_FLOW_DATA_DIR;
}

/**
 * Get test temporary directory
 */
export function getTestTempDir(): string {
  return testTempDir;
}

/**
 * Create a test file in the temporary directory
 */
export function createTestFile(fileName: string, content: string): string {
  const filePath = path.join(testTempDir, fileName);
  const dir = path.dirname(filePath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  return filePath;
}

/**
 * Read a test file from the temporary directory
 */
export function readTestFile(fileName: string): string {
  const filePath = path.join(testTempDir, fileName);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Check if a test file exists
 */
export function testFileExists(fileName: string): boolean {
  const filePath = path.join(testTempDir, fileName);
  return fs.existsSync(filePath);
}

/**
 * Remove a test file
 */
export function removeTestFile(fileName: string): void {
  const filePath = path.join(testTempDir, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Mock console methods for testing
 */
export function mockConsole(): {
  restore: () => void;
  getOutput: () => string[];
  getErrors: () => string[];
} {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  const output: string[] = [];
  const errors: string[] = [];
  
  console.log = jest.fn((...args: any[]) => {
    output.push(args.join(' '));
  });
  
  console.error = jest.fn((...args: any[]) => {
    errors.push(args.join(' '));
  });
  
  console.warn = jest.fn((...args: any[]) => {
    output.push(args.join(' '));
  });
  
  return {
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    },
    getOutput: () => [...output],
    getErrors: () => [...errors],
  };
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Timeout waiting for condition');
}

/**
 * Create a deferred promise for testing
 */
export function createTestDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
} {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve: resolve!, reject: reject! };
}