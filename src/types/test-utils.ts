/**
 * Test utility type definitions
 * Types for testing infrastructure and utilities
 */

// Jest SpyInstance type re-export for convenience
export type SpyInstance<T = any, Y extends any[] = any[]> = jest.SpyInstance<T, Y>;

// Mock function type
export type MockFunction<T extends (...args: unknown[]) => unknown> = jest.MockedFunction<T>;

// Test context interface
export interface TestContext {
  testId: string;
  testName: string;
  suiteName: string;
  timeout?: number;
  metadata?: Record<string, unknown>;
}

// Test fixture interface
export interface TestFixture<T = any> {
  setup: () => Promise<T> | T;
  teardown: (fixture: T) => Promise<void> | void;
}

// Test helper function types
export interface TestHelpers {
  waitFor: (condition: () => boolean | Promise<boolean>, timeout?: number) => Promise<void>;
  delay: (ms: number) => Promise<void>;
  createMockLogger: () => MockLogger;
  createTestContext: (overrides?: Partial<TestContext>) => TestContext;
}

// Mock logger interface
export interface MockLogger {
  debug: jest.Mock;
  info: jest.Mock;
  warn: jest.Mock;
  error: jest.Mock;
  log: jest.Mock;
  child: jest.Mock;
}

// Test validation functions
export interface ValidationFunctions {
  isValidAgentType: (type: string) => boolean;
  isValidTaskStatus: (status: string) => boolean;
  isValidTopology: (topology: string) => boolean;
  isValidPriority: (priority: string) => boolean;
}

// Performance test utilities
export interface PerformanceTestUtils {
  measureExecutionTime: <T>(fn: () => Promise<T> | T) => Promise<{ result: T; duration: number }>;
  benchmarkFunction: <T>(
    fn: () => Promise<T> | T,
    iterations: number
  ) => Promise<{ average: number; min: number; max: number; results: T[] }>;
  assertPerformance: (duration: number, maxDuration: number, testName?: string) => void;
}

// Mock data generators
export interface MockDataGenerators {
  generateAgent: (overrides?: Partial<unknown>) => unknown;
  generateTask: (overrides?: Partial<unknown>) => unknown;
  generateMemoryEntry: (overrides?: Partial<unknown>) => unknown;
  generateSwarmConfig: (overrides?: Partial<unknown>) => unknown;
}

// Test environment utilities
export interface TestEnvironment {
  isCI: boolean;
  isDebug: boolean;
  platform: 'win32' | 'darwin' | 'linux' | string;
  nodeVersion: string;
  testTimeout: number;
}

// Assertion helpers
export interface AssertionHelpers {
  assertEventEmitted: (
    emitter: unknown,
    eventName: string,
    timeout?: number
  ) => Promise<unknown>;
  assertNoErrors: (fn: () => Promise<unknown> | any) => Promise<void>;
  assertThrowsAsync: (
    fn: () => Promise<unknown>,
    expectedError?: string | RegExp | Error
  ) => Promise<void>;
}

// Export commonly used test types
export type TestFunction = () => Promise<void> | void;
export type SetupFunction = () => Promise<void> | void;
export type TeardownFunction = () => Promise<void> | void;

// Test suite configuration
export interface TestSuiteConfig {
  name: string;
  timeout?: number;
  parallel?: boolean;
  retries?: number;
  environment?: Partial<TestEnvironment>;
  fixtures?: TestFixture[];
}