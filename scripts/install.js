#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const path = require('path');

function detectEnvironment() {
  const env = {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    isCI: !!(process.env.CI || process.env.GITHUB_ACTIONS),
    isNPX: process.env.npm_config_user_config?.includes('.npx'),
    isCodespaces: !!process.env.CODESPACES,
    isDocker: fs.existsSync('/.dockerenv')
  };
  
  console.log('Environment detected:', env);
  return env;
}

function validateSQLiteBinding() {
  try {
    require('better-sqlite3');
    console.log('✓ SQLite bindings available');
    return true;
  } catch (error) {
    console.log('⚠ SQLite bindings unavailable:', error.message);
    return false;
  }
}

function createFallbackConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'runtime.json');
  const config = {
    storage: {
      type: 'memory',
      fallback: true,
      reason: 'SQLite bindings unavailable'
    },
    features: {
      memory: true,
      persistence: false,
      neural: true
    },
    timestamp: Date.now()
  };
  
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✓ Fallback configuration created');
}

function main() {
  console.log('Claude Flow post-install setup...');
  
  const env = detectEnvironment();
  const sqliteAvailable = validateSQLiteBinding();
  
  if (!sqliteAvailable) {
    console.log('Setting up fallback configuration...');
    createFallbackConfig();
  }
  
  console.log('✓ Installation complete');
}

if (require.main === module) {
  main();
}

module.exports = { detectEnvironment, validateSQLiteBinding, createFallbackConfig };