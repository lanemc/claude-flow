module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Allow console.log for now (can be tightened later)
    'no-console': 'warn',
    // Allow unused variables starting with _
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // Common JS/TS compatibility issues
    'no-undef': 'error',
  },
  ignorePatterns: [
    'dist/',
    'bin/',
    'node_modules/',
    'coverage/',
    'examples/',
    '.claude/',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      globals: {
        NodeJS: 'readonly'
      },
      rules: {
        // Override for TypeScript files
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
      }
    }
  ]
};