/**
 * Memory Storage System
 * Provides SQLite-based persistent storage with fallback to in-memory storage
 */

import type { Database } from 'better-sqlite3';

/**
 * Storage entry interface
 */
interface StorageEntry {
  value: string;
  timestamp: number;
  metadata: string;
}

/**
 * Fallback storage interface
 */
interface FallbackStorage {
  data: Map<string, StorageEntry>;
  metadata: Map<string, any>;
  sessions: Map<string, any>;
}

/**
 * List result interface
 */
export interface ListResult {
  key: string;
  value: any;
  timestamp: number;
  metadata: any;
}

/**
 * Memory storage class with SQLite backend and fallback support
 */
class MemoryStorage {
  private storage: Database | FallbackStorage | null = null;
  private fallbackMode: boolean = false;

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage system (SQLite or fallback)
   */
  async initializeStorage(): Promise<void> {
    try {
      // Try SQLite first
      const { default: Database } = await import('better-sqlite3');
      this.storage = new Database(':memory:');
      this.setupSQLiteTables();
      console.log('✓ SQLite memory storage initialized');
    } catch (error) {
      console.warn('⚠ SQLite unavailable, using in-memory fallback:', (error as Error).message);
      this.fallbackMode = true;
      this.storage = {
        data: new Map<string, StorageEntry>(),
        metadata: new Map<string, any>(),
        sessions: new Map<string, any>()
      };
      console.log('✓ In-memory fallback storage initialized');
    }
  }

  /**
   * Set up SQLite tables
   */
  private setupSQLiteTables(): void {
    if (this.fallbackMode || !this.storage) return;
    
    const db = this.storage as Database;
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_store (
        key TEXT PRIMARY KEY,
        value TEXT,
        timestamp INTEGER,
        metadata TEXT
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        data TEXT,
        created INTEGER,
        updated INTEGER
      );
    `);
  }

  /**
   * Store data with metadata
   */
  store(key: string, value: any, metadata: Record<string, any> = {}): void {
    if (this.fallbackMode) {
      const storage = this.storage as FallbackStorage;
      storage.data.set(key, {
        value: JSON.stringify(value),
        timestamp: Date.now(),
        metadata: JSON.stringify(metadata)
      });
      return;
    }

    const db = this.storage as Database;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_store (key, value, timestamp, metadata)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(key, JSON.stringify(value), Date.now(), JSON.stringify(metadata));
  }

  /**
   * Retrieve data by key
   */
  retrieve(key: string): any {
    if (this.fallbackMode) {
      const storage = this.storage as FallbackStorage;
      const entry = storage.data.get(key);
      return entry ? JSON.parse(entry.value) : null;
    }

    const db = this.storage as Database;
    const stmt = db.prepare('SELECT value FROM memory_store WHERE key = ?');
    const row = stmt.get(key) as { value: string } | undefined;
    return row ? JSON.parse(row.value) : null;
  }

  /**
   * List entries matching pattern
   */
  list(pattern: string = '*'): ListResult[] {
    if (this.fallbackMode) {
      const storage = this.storage as FallbackStorage;
      const results: ListResult[] = [];
      for (const [key, entry] of storage.data.entries()) {
        if (pattern === '*' || key.includes(pattern.replace('*', ''))) {
          results.push({
            key,
            value: JSON.parse(entry.value),
            timestamp: entry.timestamp,
            metadata: JSON.parse(entry.metadata)
          });
        }
      }
      return results;
    }

    const db = this.storage as Database;
    const sql = pattern === '*' 
      ? 'SELECT * FROM memory_store ORDER BY timestamp DESC'
      : 'SELECT * FROM memory_store WHERE key LIKE ? ORDER BY timestamp DESC';
    
    const stmt = db.prepare(sql);
    const rows = pattern === '*' 
      ? stmt.all() 
      : stmt.all(`%${pattern.replace('*', '')}%`);
    
    return (rows as any[]).map(row => ({
      key: row.key,
      value: JSON.parse(row.value),
      timestamp: row.timestamp,
      metadata: JSON.parse(row.metadata)
    }));
  }

  /**
   * Clear all data
   */
  clear(): void {
    if (this.fallbackMode) {
      const storage = this.storage as FallbackStorage;
      storage.data.clear();
      storage.metadata.clear();
      storage.sessions.clear();
      return;
    }

    const db = this.storage as Database;
    db.exec('DELETE FROM memory_store; DELETE FROM sessions;');
  }

  /**
   * Close storage connection
   */
  close(): void {
    if (!this.fallbackMode && this.storage) {
      const db = this.storage as Database;
      db.close();
    }
  }
}

export default MemoryStorage;