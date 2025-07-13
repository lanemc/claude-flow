// Global test setup
const path = require('path');
const fs = require('fs');

// Mock better-sqlite3 if not available
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => {
    throw new Error('SQLite not available in test environment');
  });
}, { virtual: true });

// Setup test environment
beforeAll(() => {
  // Ensure test directories exist
  const testDirs = ['test/fixtures', 'test/output'];
  testDirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
});

afterAll(() => {
  // Cleanup test output
  const testOutput = path.join(__dirname, 'output');
  if (fs.existsSync(testOutput)) {
    fs.rmSync(testOutput, { recursive: true, force: true });
  }
});

// Global test timeout
jest.setTimeout(30000);