import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Get the current module URL in a way that works with both ESM and pkg bundler
 */
export function getImportMetaUrl(): string {
  // Check if we're in a pkg bundled environment
  // @ts-ignore - __filename might be injected by pkg
  if (typeof __filename !== "undefined") {
    // In pkg bundled environment, use the injected __filename
    // @ts-ignore
    return `file://${__filename.replace(/\\/g, "/")}`;
  }

  // In CommonJS, we don't have import.meta
  // Skip this check entirely

  // Fallback to current working directory
  return `file://${process.cwd().replace(/\\/g, "/")}`;
}

/**
 * Get the directory name of the current module
 */
export function getDirname(): string {
  // Check if we're in a pkg bundled environment
  // @ts-ignore - __dirname might be injected by pkg
  if (typeof __dirname !== "undefined") {
    // @ts-ignore
    return __dirname;
  }

  const url = getImportMetaUrl();
  if (url.startsWith("file://")) {
    return dirname(fileURLToPath(url));
  }

  return process.cwd();
}

/**
 * Get the filename of the current module
 */
export function getFilename(): string {
  // Check if we're in a pkg bundled environment
  // @ts-ignore - __filename might be injected by pkg
  if (typeof __filename !== "undefined") {
    // @ts-ignore
    return __filename;
  }

  const url = getImportMetaUrl();
  if (url.startsWith("file://")) {
    return fileURLToPath(url);
  }

  return "";
}

/**
 * Create a dirname from a URL (for replacing fileURLToPath + dirname pattern)
 */
export function urlToDirname(url: string): string {
  // @ts-ignore - __dirname might be injected by pkg
  if (typeof __dirname !== "undefined") {
    // @ts-ignore
    return __dirname;
  }
  return dirname(fileURLToPath(url));
}
