/**
 * Runtime Environment Detection
 * Cross-platform detection and compatibility layer for Node.js and Deno
 */

// Type declarations
interface PlatformInfo {
  os: string;
  arch: string;
  target: string;
}

interface TerminalIOOptions {
  runtime: string;
  decoder: TextDecoder;
  encoder: TextEncoder;
}

type RuntimeType = 'node' | 'deno';
type APIName = 'deno' | 'node' | 'fs' | 'process';

// Global declarations for Deno types
declare global {
  var Deno: any;
}

// Runtime detection
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isDeno = typeof Deno !== 'undefined';

// Environment-specific imports
let runtime: RuntimeType;
let stdin: any, stdout: any, stderr: any;
let TextEncoderConstructor: typeof globalThis.TextEncoder, TextDecoderConstructor: typeof globalThis.TextDecoder;
let exit: (code?: number) => never, pid: number, addSignalListener: (signal: string, handler: () => void) => void;

if (isDeno) {
  // Deno environment
  runtime = 'deno';
  stdin = Deno.stdin;
  stdout = Deno.stdout;
  stderr = Deno.stderr;
  TextEncoderConstructor = globalThis.TextEncoder;
  TextDecoderConstructor = globalThis.TextDecoder;
  exit = Deno.exit;
  pid = Deno.pid;
  addSignalListener = Deno.addSignalListener;
} else if (isNode) {
  // Node.js environment
  runtime = 'node';
  stdin = process.stdin;
  stdout = process.stdout;
  stderr = process.stderr;
  TextEncoderConstructor = globalThis.TextEncoder || require('util').TextEncoder;
  TextDecoderConstructor = globalThis.TextDecoder || require('util').TextDecoder;
  exit = process.exit;
  pid = process.pid;
  addSignalListener = (signal: string, handler: () => void) => {
    process.on(signal as NodeJS.Signals, handler);
  };
} else {
  throw new Error('Unsupported runtime environment');
}

/**
 * Cross-platform terminal I/O layer
 */
export class UnifiedTerminalIO {
  decoder: InstanceType<typeof TextDecoder>;
  encoder: InstanceType<typeof TextEncoder>;
  runtime: string;

  constructor() {
    this.decoder = new TextDecoderConstructor();
    this.encoder = new TextEncoderConstructor();
    this.runtime = runtime;
  }

  /**
   * Write to stdout
   */
  async write(data: string | Uint8Array): Promise<void> {
    if (typeof data === 'string') {
      data = this.encoder.encode(data);
    }
    
    if (runtime === 'deno') {
      await stdout.write(data);
    } else {
      return new Promise((resolve) => {
        stdout.write(data, resolve);
      });
    }
  }

  /**
   * Read from stdin
   */
  async read(buffer: Uint8Array): Promise<number | null> {
    if (runtime === 'deno') {
      return await stdin.read(buffer);
    } else {
      return new Promise((resolve) => {
        let data = '';
        const onData = (chunk: any) => {
          data += chunk;
          if (data.includes('\n')) {
            stdin.removeListener('data', onData);
            const encoded = this.encoder.encode(data);
            const bytesToCopy = Math.min(encoded.length, buffer.length);
            buffer.set(encoded.slice(0, bytesToCopy));
            resolve(bytesToCopy);
          }
        };
        
        // Only set raw mode if available (terminal environments)
        if (stdin.setRawMode && typeof stdin.setRawMode === 'function') {
          try {
            stdin.setRawMode(true);
          } catch (err) {
            // Ignore errors if not in a TTY
          }
        }
        
        if (stdin.resume && typeof stdin.resume === 'function') {
          stdin.resume();
        }
        
        stdin.on('data', onData);
      });
    }
  }

  /**
   * Set up signal handlers
   */
  onSignal(signal: string, handler: () => void): void {
    if (runtime === 'deno') {
      addSignalListener(signal, handler);
    } else {
      process.on(signal as NodeJS.Signals, handler);
    }
  }

  /**
   * Exit the process
   */
  exit(code = 0): never {
    exit(code);
  }

  /**
   * Get process ID
   */
  getPid(): number {
    return pid;
  }

  /**
   * Set raw mode for stdin (Node.js only)
   */
  setRawMode(enabled: boolean): void {
    if (runtime === 'node' && stdin.setRawMode && typeof stdin.setRawMode === 'function') {
      try {
        stdin.setRawMode(enabled);
      } catch (err) {
        // Ignore errors if not in a TTY
      }
    }
  }

  /**
   * Resume stdin (Node.js only)
   */
  resume(): void {
    if (runtime === 'node' && stdin.resume) {
      stdin.resume();
    }
  }

  /**
   * Pause stdin (Node.js only)
   */
  pause(): void {
    if (runtime === 'node' && stdin.pause) {
      stdin.pause();
    }
  }
}

/**
 * Environment detection utilities
 */
export const RuntimeDetector = {
  isNode: (): boolean => !!isNode,
  isDeno: (): boolean => !!isDeno,
  getRuntime: (): RuntimeType => runtime,
  
  /**
   * Get platform-specific information
   */
  getPlatform: (): PlatformInfo => {
    if (runtime === 'deno') {
      return {
        os: Deno.build.os,
        arch: Deno.build.arch,
        target: Deno.build.target
      };
    } else {
      return {
        os: process.platform === 'win32' ? 'windows' : 
            process.platform === 'darwin' ? 'darwin' :
            process.platform === 'linux' ? 'linux' : process.platform,
        arch: process.arch,
        target: `${process.arch}-${process.platform}`
      };
    }
  },

  /**
   * Check if API is available
   */
  hasAPI: (apiName: APIName): boolean => {
    switch (apiName) {
      case 'deno':
        return !!isDeno;
      case 'node':
        return !!isNode;
      case 'fs':
        return runtime === 'node' || (runtime === 'deno' && typeof Deno.readFile !== 'undefined');
      case 'process':
        return runtime === 'node' || (runtime === 'deno' && typeof Deno.run !== 'undefined');
      default:
        return false;
    }
  },

  /**
   * Get environment variables
   */
  getEnv: (key: string): string | undefined => {
    if (runtime === 'deno') {
      return Deno.env.get(key);
    } else {
      return process.env[key];
    }
  },

  /**
   * Set environment variables
   */
  setEnv: (key: string, value: string): void => {
    if (runtime === 'deno') {
      Deno.env.set(key, value);
    } else {
      process.env[key] = value;
    }
  }
};

/**
 * Cross-platform compatibility layer
 */
export const createCompatibilityLayer = () => {
  return {
    runtime,
    terminal: new UnifiedTerminalIO(),
    detector: RuntimeDetector,
    
    // Unified APIs
    TextEncoder: TextEncoderConstructor,
    TextDecoder: TextDecoderConstructor,
    
    // Platform info
    platform: RuntimeDetector.getPlatform(),
    
    // Environment
    getEnv: RuntimeDetector.getEnv,
    setEnv: RuntimeDetector.setEnv,
    
    // Process control
    exit,
    pid,
    
    // Graceful degradation helpers
    safeCall: async <T>(fn: () => Promise<T>, fallback: T | null = null): Promise<T | null> => {
      try {
        return await fn();
      } catch (error: any) {
        console.warn(`Runtime compatibility warning: ${error.message}`);
        return fallback;
      }
    },
    
    // Feature detection
    hasFeature: (feature: APIName): boolean => {
      return RuntimeDetector.hasAPI(feature);
    }
  };
};

// Export the compatibility layer instance
export const compat = createCompatibilityLayer();

// Export runtime detection results
export { runtime, isNode, isDeno };