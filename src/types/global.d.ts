// import { getErrorMessage } from '../utils/error-handler';
// Global type definitions and environment compatibility

// Node.js global augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      DEBUG?: string;
      CLAUDE_FLOW_HOME?: string;
      [key: string]: string | undefined;
    }
  }

  // PKG bundler injected globals
  var __filename: string | undefined;
  var __dirname: string | undefined;
}

// Node.js only environment - no Deno types needed

// Commander.js types extension
import type { Command as CommanderCommand } from 'commander';

declare module 'commander' {
  interface Command {
    showHelp(): void;
  }
}

// Jest global types
declare global {
  namespace jest {
    interface SpyInstance<T = any, Y extends any[] = any[]> {
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: any): this;
      mockReturnValue(value: T): this;
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
    }
  }
}

// Re-export module declarations
/// <reference path="./modules.d.ts" />
/// <reference path="./mcp.ts" />
/// <reference path="./test-utils.ts" />

export {};