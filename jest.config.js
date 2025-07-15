module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.{js,ts}',
    '**/*.(test|spec).{js,ts}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      useESM: false,
      isolatedModules: true,
      tsconfig: {
        allowJs: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        moduleResolution: 'node',
        target: 'es2021',
        module: 'commonjs'
      }
    }],
    // Simplified JS transform using ts-jest for consistency
    '^.+\\.(js|jsx)$': ['ts-jest', {
      useESM: false,
      isolatedModules: true,
      tsconfig: {
        allowJs: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        moduleResolution: 'node',
        target: 'es2021',
        module: 'commonjs'
      }
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@ruv-swarm|@claude-code)/)'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1'
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
  globals: {
    'ts-jest': {
      useESM: false,
      isolatedModules: true
    }
  },
  maxWorkers: process.env.CI ? 2 : '50%',
  verbose: !!process.env.CI,
  bail: !!process.env.CI,
  cache: !process.env.CI,
  watchman: false, // Disable watchman for stability
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};