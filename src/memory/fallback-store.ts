/**
 * Fallback memory store that tries SQLite first, then falls back to in-memory storage
 * Designed to handle npx environments where native modules may fail to load
 */

import { SqliteMemoryStore } from './sqlite-store';
import { InMemoryStore } from './in-memory-store';
import type {
  FallbackMemoryStoreOptions,
  MemoryStoreOptions,
  MemoryEntry,
  MemoryListOptions,
  MemorySearchOptions,
  MemorySearchResult,
  IFallbackStore
} from './types';

class FallbackMemoryStore implements IFallbackStore {
  protected primaryStore: SqliteMemoryStore | null = null;
  protected fallbackStore: InMemoryStore | null = null;
  private useFallback = false;
  private initializationAttempted = false;
  protected options: FallbackMemoryStoreOptions;

  constructor(options: FallbackMemoryStoreOptions = {}) {
    this.options = options;
  }

  async initialize(): Promise<void> {
    if (this.initializationAttempted) return;
    this.initializationAttempted = true;

    // First, try to initialize SQLite store
    try {
      this.primaryStore = new SqliteMemoryStore(this.options);
      await this.primaryStore.initialize();
      console.error(`[${new Date().toISOString()}] INFO [fallback-store] Successfully initialized SQLite store`);
      this.useFallback = false;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] WARN [fallback-store] SQLite initialization failed, falling back to in-memory store:`, 
        error instanceof Error ? error.message : 'Unknown error');
      
      // Fall back to in-memory store
      this.fallbackStore = new InMemoryStore(this.options);
      await this.fallbackStore.initialize();
      this.useFallback = true;
      
      console.error(`[${new Date().toISOString()}] INFO [fallback-store] Using in-memory store (data will not persist across sessions)`);
      console.error(`[${new Date().toISOString()}] INFO [fallback-store] To enable persistent storage, install the package locally: npm install claude-flow@alpha`);
    }
  }

  get activeStore(): SqliteMemoryStore | InMemoryStore {
    if (!this.primaryStore && !this.fallbackStore) {
      throw new Error('No store available - call initialize() first');
    }
    return this.useFallback ? this.fallbackStore! : this.primaryStore!;
  }

  async store(key: string, value: unknown, options: MemoryStoreOptions = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    await this.initialize();
    return this.activeStore.store(key, value, options);
  }

  async retrieve(key: string, options: { namespace?: string } = {}): Promise<unknown> {
    await this.initialize();
    return this.activeStore.retrieve(key, options);
  }

  async list(options: MemoryListOptions = {}): Promise<MemoryEntry[]> {
    await this.initialize();
    return this.activeStore.list(options);
  }

  async delete(key: string, options: { namespace?: string } = {}): Promise<boolean> {
    await this.initialize();
    return this.activeStore.delete(key, options);
  }

  async search(pattern: string, options: MemorySearchOptions = {}): Promise<MemorySearchResult[]> {
    await this.initialize();
    return this.activeStore.search(pattern, options);
  }

  async cleanup(): Promise<number> {
    await this.initialize();
    return this.activeStore.cleanup();
  }

  close(): void {
    if (this.primaryStore) {
      this.primaryStore.close();
    }
    if (this.fallbackStore) {
      this.fallbackStore.close();
    }
  }

  isUsingFallback(): boolean {
    return this.useFallback;
  }
}

// Export a singleton instance for MCP server
export const memoryStore = new FallbackMemoryStore();

export { FallbackMemoryStore };
export default FallbackMemoryStore;