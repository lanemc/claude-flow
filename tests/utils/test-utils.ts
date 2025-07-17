/**
 * Test utilities for coordination tests
 */

// Re-export Jest functions
export {
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
  jest
} from '@jest/globals';

/**
 * Spy function wrapper for Jest
 */
export function spy(target?: any, method?: string) {
  if (target && method) {
    return jest.spyOn(target, method);
  }
  return jest.fn();
}

/**
 * Stub function wrapper for Jest
 */
export function stub(target: any, method: string, implementation?: any) {
  const spyInstance = jest.spyOn(target, method);
  if (implementation) {
    spyInstance.mockImplementation(implementation);
  }
  return spyInstance;
}

/**
 * Mock timer utilities
 */
export const FakeTime = {
  start: () => jest.useFakeTimers(),
  stop: () => jest.useRealTimers(),
  tick: (ms: number) => jest.advanceTimersByTime(ms),
  tickAll: () => jest.runAllTimers()
};

/**
 * Test environment setup and cleanup
 */
export function setupTestEnv() {
  return {
    cleanup: () => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    }
  };
}

export function cleanupTestEnv() {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.useRealTimers();
}