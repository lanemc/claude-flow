/**
 * Shared CLI utility functions with TypeScript support
 */

import { Deno, existsSync } from './node-compat.js';
import { FlagValue, CLIError, ProgressInfo } from './types.js';

// Color formatting functions
export function printSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

export function printError(message: string): void {
  console.log(`❌ ${message}`);
}

export function printWarning(message: string): void {
  console.log(`⚠️  ${message}`);
}

export function printInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

// Command validation helpers
export function validateArgs(args: string[], minLength: number, usage: string): boolean {
  if (args.length < minLength) {
    printError(`Usage: ${usage}`);
    return false;
  }
  return true;
}

// Flag parsing helpers
export function parseFlags(args: string[]): Record<string, FlagValue> {
  const flags: Record<string, FlagValue> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const flagName = arg.substring(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('--')) {
        // Parse different types of values
        if (nextArg === 'true') {
          flags[flagName] = true;
        } else if (nextArg === 'false') {
          flags[flagName] = false;
        } else if (/^\\d+$/.test(nextArg)) {
          flags[flagName] = parseInt(nextArg, 10);
        } else if (/^\\d+\\.\\d+$/.test(nextArg)) {
          flags[flagName] = parseFloat(nextArg);
        } else if (nextArg.includes(',')) {
          flags[flagName] = nextArg.split(',').map(s => s.trim());
        } else {
          flags[flagName] = nextArg;
        }
        i++; // Skip the next argument
      } else {
        flags[flagName] = true;
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      // Handle short flags
      const shortFlag = arg.substring(1);
      flags[shortFlag] = true;
    }
  }
  
  return flags;
}

// Path utilities
export function resolvePath(path: string): string {
  if (path.startsWith('~/')) {
    return path.replace('~', process.env.HOME || '');
  }
  return path;
}

export function validatePath(path: string): boolean {
  try {
    const resolvedPath = resolvePath(path);
    return existsSync(resolvedPath);
  } catch {
    return false;
  }
}

// Configuration helpers
export function loadConfig(configPath?: string): Record<string, any> {
  const defaultConfig = {
    version: '2.0.0-alpha.56',
    verbose: false,
    maxConcurrentTasks: 10,
    timeout: 5000,
    retryCount: 3,
  };
  
  if (!configPath) {
    return defaultConfig;
  }
  
  try {
    const resolvedPath = resolvePath(configPath);
    if (!existsSync(resolvedPath)) {
      printWarning(`Config file not found: ${configPath}`);
      return defaultConfig;
    }
    
    // Would need to implement JSON loading here
    return defaultConfig;
  } catch (error) {
    printError(`Failed to load config: ${error}`);
    return defaultConfig;
  }
}

// Progress tracking
export function printProgress(info: ProgressInfo): void {
  const progressBar = '█'.repeat(Math.floor(info.percentage / 10)) + 
                     '░'.repeat(10 - Math.floor(info.percentage / 10));
  
  const eta = info.eta ? ` ETA: ${Math.round(info.eta / 1000)}s` : '';
  console.log(`\\r[${progressBar}] ${info.percentage.toFixed(1)}% ${info.message}${eta}`);
}

// Error handling
export function createCLIError(message: string, code?: string | number, command?: string): CLIError {
  const error = new Error(message) as CLIError;
  error.code = code;
  error.command = command;
  return error;
}

export function handleError(error: CLIError | Error, verbose: boolean = false): void {
  if (error instanceof Error && 'code' in error) {
    const cliError = error as CLIError;
    printError(`${cliError.message} (${cliError.code})`);
    
    if (cliError.command) {
      printInfo(`Command: ${cliError.command}`);
    }
    
    if (cliError.suggestions) {
      console.log('\\nSuggestions:');
      cliError.suggestions.forEach(suggestion => {
        console.log(`  • ${suggestion}`);
      });
    }
  } else {
    printError(error.message);
  }
  
  if (verbose && error.stack) {
    console.log('\\nStack trace:');
    console.log(error.stack);
  }
}

// String utilities
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePort(port: string | number): boolean {
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
}

// System utilities
export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function getOSInfo(): { platform: string; arch: string; version: string } {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version
  };
}

// Export utility functions
// All functions are exported inline above