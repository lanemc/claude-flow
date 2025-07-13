/**
 * Jest Setup File - ES Module Compatible
 * Configure test environment and global settings
 */

// Set test environment flags
process.env.CLAUDE_FLOW_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.CLAUDE_FLOW_LOG_LEVEL = 'error';

// Suppress console output during tests unless explicitly needed
const originalConsole = { ...console };

// Store original console for restoration
global.originalConsole = originalConsole;

// Setup global test logger configuration
global.testLoggerConfig = {
  level: 'error',
  format: 'text',
  destination: 'console',
};

// Handle unhandled rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  // Only log in test environment if needed
  if (process.env.DEBUG_TESTS) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  if (process.env.DEBUG_TESTS) {
    console.error('Uncaught Exception:', error);
  }
});

// Enhanced memory management for tests
if (typeof global.gc === 'function' && process.env.FORCE_GC_TESTS) {
  afterEach(() => {
    global.gc();
  });
}

// Set up Jest timeout globally
if (typeof jest !== 'undefined') {
  jest.setTimeout(30000); // 30 second timeout for all tests
}

// Enhanced cleanup between tests
if (typeof afterEach !== 'undefined') {
  afterEach(() => {
    if (typeof jest !== 'undefined') {
      jest.clearAllTimers();
      jest.clearAllMocks();
    }
  });
}

// Better ES module support
if (typeof global !== 'undefined') {
  global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
  global.clearImmediate = global.clearImmediate || clearTimeout;
}