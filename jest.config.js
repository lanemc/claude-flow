module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.{js,ts}',
    '**/*.(test|spec).{js,ts}'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: false }],
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 30000,
  maxWorkers: process.env.CI ? 2 : '50%',
  verbose: !!process.env.CI,
  bail: !!process.env.CI,
  cache: !process.env.CI,
  watchman: false, // Disable watchman for stability
  moduleFileExtensions: ['js', 'ts', 'json', 'node']
};