#!/usr/bin/env node

import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import https from 'node:https';
import { spawn } from 'node:child_process';

console.log('Installing Claude-Flow...');

// Check SQLite bindings and rebuild if necessary
async function checkSQLiteBindings() {
  try {
    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');
    db.close();
    console.log('✅ SQLite bindings working correctly');
    return true;
  } catch (error) {
    console.log('❌ SQLite bindings failed:', error.message);
    
    if (error.message.includes('Could not locate the bindings file')) {
      console.log('🔧 Attempting to rebuild better-sqlite3...');
      return rebuildSQLite();
    }
    return false;
  }
}

// Rebuild SQLite bindings
function rebuildSQLite() {
  return new Promise((resolve) => {
    console.log('Running: npm rebuild better-sqlite3');
    const rebuild = spawn('npm', ['rebuild', 'better-sqlite3'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    rebuild.on('close', (code) => {
      if (code === 0) {
        console.log('✅ SQLite rebuild successful');
        resolve(true);
      } else {
        console.log('❌ SQLite rebuild failed');
        console.log('Manual steps to fix:');
        console.log('1. rm -rf node_modules package-lock.json');
        console.log('2. npm install');
        console.log('3. Or try: npm install better-sqlite3 --build-from-source');
        resolve(false);
      }
    });
    
    rebuild.on('error', (error) => {
      console.log('❌ Rebuild error:', error.message);
      resolve(false);
    });
  });
}

// Check if Deno is available
function checkDeno() {
  return new Promise((resolve) => {
    const deno = spawn('deno', ['--version'], { stdio: 'pipe' });
    deno.on('close', (code) => {
      resolve(code === 0);
    });
    deno.on('error', () => {
      resolve(false);
    });
  });
}

// Install Deno if not available
async function installDeno() {
  console.log('Deno not found. Installing Deno...');
  
  const platform = os.platform();
  const arch = os.arch();
  
  if (platform === 'win32') {
    console.log('Please install Deno manually from https://deno.land/');
    process.exit(1);
  }
  
  return new Promise((resolve, reject) => {
    const installScript = spawn('curl', ['-fsSL', 'https://deno.land/x/install/install.sh'], { stdio: 'pipe' });
    const sh = spawn('sh', [], { stdio: ['pipe', 'inherit', 'inherit'] });
    
    installScript.stdout.pipe(sh.stdin);
    
    sh.on('close', (code) => {
      if (code === 0) {
        console.log('Deno installed successfully!');
        resolve();
      } else {
        reject(new Error('Failed to install Deno'));
      }
    });
  });
}

// Main installation process
async function main() {
  try {
    // Check SQLite bindings first
    console.log('🔍 Checking SQLite bindings...');
    await checkSQLiteBindings();
    
    const denoAvailable = await checkDeno();
    
    if (!denoAvailable) {
      await installDeno();
    }
    
    console.log('Claude-Flow installation completed!');
    console.log('You can now use: npx claude-flow or claude-flow (if installed globally)');
    
  } catch (error) {
    console.error('Installation failed:', error.message);
    console.log('Please install Deno manually from https://deno.land/ and try again.');
    process.exit(1);
  }
}

main();