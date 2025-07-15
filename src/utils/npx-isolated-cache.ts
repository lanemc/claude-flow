#!/usr/bin/env node

/**
 * NPX Isolated Cache
 * 
 * Provides isolated NPX cache directories per process to prevent
 * concurrent cache conflicts when multiple claude-flow instances
 * run simultaneously.
 * 
 * This simple solution gives each process its own cache directory,
 * eliminating ENOTEMPTY errors without the complexity of locks.
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Type declarations
interface EnvironmentVariables {
  [key: string]: string | undefined;
}

interface IsolatedEnvironment extends EnvironmentVariables {
  NPM_CONFIG_CACHE: string;
  npm_config_cache: string;
}

// Module resolution for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Track cache directories for cleanup
const cacheDirectories = new Set<string>();
let cleanupRegistered = false;

/**
 * Creates an isolated NPX cache environment
 * @returns {IsolatedEnvironment} Environment variables with isolated cache
 */
export function createIsolatedCache(): IsolatedEnvironment {
  // Create unique cache directory for this process
  const timestamp = Date.now();
  const pid = process.pid;
  const random = Math.random().toString(36).substring(2, 8);
  const cacheName = `claude-flow-${pid}-${timestamp}-${random}`;
  const cacheDir = path.join(os.tmpdir(), '.npm-cache', cacheName);
  
  // Track for cleanup
  cacheDirectories.add(cacheDir);
  
  // Register cleanup on first use
  if (!cleanupRegistered) {
    registerCleanup();
    cleanupRegistered = true;
  }
  
  // Return environment with isolated cache
  // Use Deno.env if available (Deno environment), otherwise use process.env (Node.js environment)
  const baseEnv: EnvironmentVariables = typeof Deno !== 'undefined' && (Deno as any).env 
    ? (Deno as any).env.toObject() 
    : process.env;
  
  return {
    ...baseEnv,
    NPM_CONFIG_CACHE: cacheDir,
    // Also set npm cache for older npm versions
    npm_config_cache: cacheDir
  };
}

/**
 * Gets environment variables for isolated NPX execution
 * @param {EnvironmentVariables} additionalEnv - Additional environment variables
 * @returns {IsolatedEnvironment} Merged environment with isolated cache
 */
export function getIsolatedNpxEnv(additionalEnv: EnvironmentVariables = {}): IsolatedEnvironment {
  const isolatedEnv = createIsolatedCache();
  return {
    ...isolatedEnv,
    ...additionalEnv
  };
}

/**
 * Cleans up cache directories
 */
async function cleanupCaches(): Promise<void> {
  const cleanupPromises = Array.from(cacheDirectories).map(async (cacheDir) => {
    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
    } catch (error: any) {
      // Ignore errors during cleanup - cache might already be gone
      if (error.code !== 'ENOENT') {
        console.debug(`Failed to cleanup cache ${cacheDir}:`, error.message);
      }
    }
  });
  
  await Promise.all(cleanupPromises);
  cacheDirectories.clear();
}

/**
 * Registers cleanup handlers
 */
function registerCleanup(): void {
  // Cleanup on normal exit
  process.on('exit', () => {
    // Attempt synchronous cleanup on exit
    for (const cacheDir of cacheDirectories) {
      try {
        require('fs').rmSync(cacheDir, { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
  
  // Cleanup on signals
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'];
  signals.forEach(signal => {
    process.on(signal, async () => {
      await cleanupCaches();
      process.exit();
    });
  });
  
  // Cleanup on uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught exception:', error);
    await cleanupCaches();
    process.exit(1);
  });
  
  // Cleanup on unhandled rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    await cleanupCaches();
    process.exit(1);
  });
}

/**
 * Manually cleanup all caches (useful for testing)
 */
export async function cleanupAllCaches(): Promise<void> {
  await cleanupCaches();
}

// For direct CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'test') {
    console.log('Testing isolated cache creation...');
    const env = createIsolatedCache();
    console.log('Cache directory:', env.NPM_CONFIG_CACHE);
    console.log('Environment configured successfully');
    
    // Cleanup
    cleanupAllCaches().then(() => {
      console.log('Cleanup completed');
    });
  } else {
    console.log('NPX Isolated Cache Utility');
    console.log('Usage: node npx-isolated-cache.js test');
  }
}