/**
 * Test configuration and setup
 */

export interface TestConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
  coverage: boolean;
  verbose: boolean;
  environment: 'node' | 'jsdom';
  setupFiles: string[];
  testMatch: string[];
}

/**
 * Default test configuration
 */
export const defaultTestConfig: TestConfig = {
  timeout: 10000,
  retries: 0,
  parallel: false,
  coverage: true,
  verbose: false,
  environment: 'node',
  setupFiles: [],
  testMatch: [
    '**/__tests__/**/*.(js|ts)',
    '**/*.(test|spec).(js|ts)'
  ]
};

/**
 * Test environment setup
 */
export function setupTestConfig(overrides: Partial<TestConfig> = {}): TestConfig {
  return {
    ...defaultTestConfig,
    ...overrides
  };
}

/**
 * Mock implementations for common modules
 */
export const mocks = {
  fs: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn()
  },
  path: {
    join: jest.fn((...args: string[]) => args.join('/')),
    resolve: jest.fn((...args: string[]) => args.join('/')),
    dirname: jest.fn((p: string) => p.split('/').slice(0, -1).join('/')),
    basename: jest.fn((p: string) => p.split('/').pop() || '')
  },
  os: {
    platform: jest.fn(() => 'linux'),
    tmpdir: jest.fn(() => '/tmp'),
    homedir: jest.fn(() => '/home/user')
  }
};

/**
 * Global test setup function
 */
export function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.CI = 'true';
  
  // Mock global objects if needed
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };
}

/**
 * Global test teardown function
 */
export function globalTeardown() {
  // Clean up any global mocks or resources
  jest.clearAllMocks();
  jest.restoreAllMocks();
}

/**
 * Test environment cleanup function
 */
export function cleanupTestEnv() {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.useRealTimers();
}

/**
 * Assert equals function for tests
 */
export function assertEquals(actual: any, expected: any) {
  expect(actual).toEqual(expected);
}

/**
 * Test environment setup function
 */
export function setupTestEnv() {
  return {
    cleanup: () => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    }
  };
}

/**
 * Test configuration constant
 */
export const TEST_CONFIG = {
  timeout: 10000,
  maxRetries: 3,
  parallel: false
};