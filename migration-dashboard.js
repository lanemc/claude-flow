#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 TypeScript Migration Dashboard\n');

// Helper to run commands safely
function runCommand(cmd, defaultValue = '0') {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (e) {
    return defaultValue;
  }
}

// Metrics collection
const metrics = {
  jsFiles: runCommand('find src -name "*.js" | grep -v node_modules | wc -l').trim(),
  tsErrors: runCommand('npx tsc --noEmit 2>&1 | grep -c "error TS"'),
  modifiedFiles: runCommand('git status --porcelain | grep -E "\\.ts$|\\.js$" | wc -l').trim(),
  testFiles: runCommand('find src -name "*.test.ts" -o -name "*.test.js" | wc -l').trim()
};

// Progress calculation
const totalFiles = 250; // Approximate original JS file count
const migrated = totalFiles - parseInt(metrics.jsFiles);
const progress = Math.round((migrated / totalFiles) * 100);

// Display dashboard
console.log('📊 Migration Progress');
console.log(`${'█'.repeat(Math.floor(progress/5))}${'░'.repeat(20-Math.floor(progress/5))} ${progress}%`);
console.log(`Files migrated: ${migrated}/${totalFiles}\n`);

console.log('📈 Current Metrics:');
console.log(`├── JS files remaining: ${metrics.jsFiles}`);
console.log(`├── TypeScript errors: ${metrics.tsErrors}`);
console.log(`├── Modified files: ${metrics.modifiedFiles}`);
console.log(`└── Test files: ${metrics.testFiles}\n`);

// Critical directories
console.log('🎯 Priority Targets:');
const priorityDirs = runCommand('find src -name "*.js" -type f | grep -v node_modules | xargs dirname | sort | uniq -c | sort -nr | head -5');
console.log(priorityDirs);

// Recent activity
console.log('\n⏰ Recent Changes:');
const recentFiles = runCommand('git status --porcelain | grep -E "^[AM].*\\.(ts|js)$" | head -5');
console.log(recentFiles || 'No recent changes');

// Recommendations
console.log('\n💡 Recommendations:');
if (parseInt(metrics.tsErrors) > 100) {
  console.log('⚠️  High TypeScript error count - focus on type fixes');
}
if (parseInt(metrics.jsFiles) > 150) {
  console.log('📁 Many JS files remain - accelerate migration');
}
console.log('✅ Continue with parallel agent migration\n');