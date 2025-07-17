/**
 * Test utilities for unit tests
 */

export interface MockConfig {
  [key: string]: any;
}

export interface TestEnvironment {
  cleanup: () => void;
  mockConfig: MockConfig;
}

/**
 * Creates a mock configuration for testing
 */
export function createMockConfig(overrides: Partial<MockConfig> = {}): MockConfig {
  return {
    mode: 'development',
    debug: true,
    logLevel: 'info',
    ...overrides
  };
}

/**
 * Sets up a test environment with common mocks
 */
export function setupTestEnvironment(config: Partial<MockConfig> = {}): TestEnvironment {
  const mockConfig = createMockConfig(config);
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  // Mock console methods during tests if needed
  if (config.silentConsole) {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
  }

  const cleanup = () => {
    // Restore original console methods
    if (config.silentConsole) {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    }
  };

  return {
    cleanup,
    mockConfig
  };
}

/**
 * Creates a mock logger for testing
 */
export function createMockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  };
}

/**
 * Creates a mock process object for testing
 */
export function createMockProcess(overrides: any = {}) {
  return {
    env: { NODE_ENV: 'test' },
    argv: ['node', 'test'],
    cwd: jest.fn(() => '/test'),
    exit: jest.fn(),
    ...overrides
  };
}

/**
 * Waits for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a promise that can be resolved externally
 */
export function createDeferredPromise<T>() {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!
  };
}