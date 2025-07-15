
// Global type declarations
declare global {
  var global: typeof globalThis;
  var process: typeof import('process');
  var Buffer: typeof import('buffer').Buffer;
  var __dirname: string;
  var __filename: string;
}
