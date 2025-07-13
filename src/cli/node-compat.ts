/**
 * Node.js compatibility layer for Deno APIs
 * This module provides Node.js equivalents for Deno-specific APIs
 */

import { readdir, stat, mkdir, readFile, writeFile, unlink, rmdir } from 'fs/promises';
import { existsSync as fsExistsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';
import { spawn } from 'child_process';

// Type definitions
export interface DirEntry {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

export interface FileStat {
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtime: Date | null;
  atime: Date | null;
  birthtime: Date | null;
}

export interface CommandOutput {
  success: boolean;
  code: number;
  stdout: Uint8Array;
  stderr: Uint8Array;
}

// Process arguments (remove first two: node executable and script path)
export const args = process.argv.slice(2);

// Current working directory
export const cwd = (): string => process.cwd();

// Exit process
export const exit = (code?: number): never => {
  process.exit(code);
};

// File system operations
export const readDir = async (path: string): Promise<DirEntry[]> => {
  const entries = await readdir(path, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isFile: entry.isFile(),
    isDirectory: entry.isDirectory(),
    isSymlink: entry.isSymbolicLink()
  }));
};

export const statFile = async (path: string): Promise<FileStat> => {
  const stats = await stat(path);
  return {
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    size: stats.size,
    mtime: stats.mtime,
    atime: stats.atime,
    birthtime: stats.birthtime
  };
};

export const readTextFile = async (path: string): Promise<string> => {
  return await readFile(path, 'utf-8');
};

export const writeTextFile = async (path: string, content: string): Promise<void> => {
  await writeFile(path, content, 'utf-8');
};

export const remove = async (path: string): Promise<void> => {
  const stats = await stat(path);
  if (stats.isDirectory()) {
    await rmdir(path, { recursive: true });
  } else {
    await unlink(path);
  }
};

// Deno namespace mock for Node.js
export const Deno = {
  args,
  cwd,
  exit,
  readDir,
  stat: statFile,
  readTextFile,
  writeTextFile,
  remove,
  mkdir: async (path: string, options?: { recursive?: boolean }) => {
    await mkdir(path, options);
  },
  env: {
    get: (key: string): string | undefined => process.env[key],
    set: (key: string, value: string): void => { process.env[key] = value; },
    delete: (key: string): void => { delete process.env[key]; },
    toObject: (): NodeJS.ProcessEnv => ({ ...process.env })
  },
  Command: class Command {
    public command: string;
    public options: any;

    constructor(command: string, options: any) {
      this.command = command;
      this.options = options;
    }

    spawn() {
      const child = spawn(this.command, this.options.args || [], {
        cwd: this.options.cwd,
        env: this.options.env,
        stdio: this.options.stdin === 'inherit' ? 'inherit' : 'pipe'
      });

      return {
        status: new Promise<{ success: boolean; code: number | null }>((resolve) => {
          child.on('exit', (code) => {
            resolve({ success: code === 0, code });
          });
        })
      };
    }

    async output(): Promise<CommandOutput> {
      return new Promise((resolve, reject) => {
        const child = spawn(this.command, this.options.args || [], {
          cwd: this.options.cwd,
          env: this.options.env
        });

        let stdout = Buffer.alloc(0);
        let stderr = Buffer.alloc(0);

        if (child.stdout) {
          child.stdout.on('data', (data) => {
            stdout = Buffer.concat([stdout, data]);
          });
        }

        if (child.stderr) {
          child.stderr.on('data', (data) => {
            stderr = Buffer.concat([stderr, data]);
          });
        }

        child.on('exit', (code) => {
          resolve({
            success: code === 0,
            code: code || 0,
            stdout: new Uint8Array(stdout),
            stderr: new Uint8Array(stderr)
          });
        });

        child.on('error', reject);
      });
    }
  }
};

// Export existsSync
export { fsExistsSync as existsSync };

// Get directory of current module
export function getCurrentModuleDir(): string {
  // @ts-ignore - import.meta.url is valid in ES modules
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
}