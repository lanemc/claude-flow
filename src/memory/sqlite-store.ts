/**
 * SQLite-based memory store for MCP server
 * Provides persistent storage that works with both local and remote npx execution
 */

import Database, { Statement } from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import * as os from 'os';
import type { 
  SQLiteMemoryStoreOptions, 
  SQLiteRow, 
  MemoryStoreOptions, 
  MemoryEntry,
  MemoryListOptions,
  MemorySearchOptions,
  MemorySearchResult,
  IMemoryStore
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SqliteMemoryStore implements IMemoryStore {
  private db: Database.Database | null = null;
  private statements = new Map<string, Statement>();
  private isInitialized = false;
  private options: Required<SQLiteMemoryStoreOptions>;

  constructor(options: SQLiteMemoryStoreOptions = {}) {
    this.options = {
      dbName: options.dbName || 'memory.db',
      directory: options.directory || this._getMemoryDirectory(),
      ...options
    };
  }

  /**
   * Determine the best directory for memory storage
   * Uses .swarm directory in current working directory (consistent with hive-mind approach)
   */
  private _getMemoryDirectory(): string {
    // Always use .swarm directory in the current working directory
    // This ensures consistency whether running locally or via npx
    return path.join(process.cwd(), '.swarm');
  }

  private _directoryExists(dir: string): boolean {
    try {
      const stats = require('fs').statSync(dir);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Ensure directory exists
      await fs.mkdir(this.options.directory, { recursive: true });
      
      // Open database
      const dbPath = path.join(this.options.directory, this.options.dbName);
      this.db = new Database(dbPath);
      
      // Enable WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      
      // Create tables
      this._createTables();
      
      // Prepare statements
      this._prepareStatements();
      
      this.isInitialized = true;
      
      console.error(`[${new Date().toISOString()}] INFO [memory-store] Initialized SQLite at: ${dbPath}`);
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Failed to initialize:`, error);
      throw error;
    }
  }

  private _createTables(): void {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        namespace TEXT NOT NULL DEFAULT 'default',
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        accessed_at INTEGER DEFAULT (strftime('%s', 'now')),
        access_count INTEGER DEFAULT 0,
        ttl INTEGER,
        expires_at INTEGER,
        UNIQUE(key, namespace)
      );

      CREATE INDEX IF NOT EXISTS idx_memory_namespace ON memory_entries(namespace);
      CREATE INDEX IF NOT EXISTS idx_memory_expires ON memory_entries(expires_at) WHERE expires_at IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_memory_accessed ON memory_entries(accessed_at);
    `);
  }

  private _prepareStatements(): void {
    if (!this.db) throw new Error('Database not initialized');

    // Store/update statement
    this.statements.set('upsert', this.db.prepare(`
      INSERT INTO memory_entries (key, value, namespace, metadata, ttl, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(key, namespace) DO UPDATE SET
        value = excluded.value,
        metadata = excluded.metadata,
        ttl = excluded.ttl,
        expires_at = excluded.expires_at,
        updated_at = strftime('%s', 'now'),
        access_count = memory_entries.access_count + 1
    `));

    // Retrieve statement
    this.statements.set('get', this.db.prepare(`
      SELECT * FROM memory_entries 
      WHERE key = ? AND namespace = ? AND (expires_at IS NULL OR expires_at > strftime('%s', 'now'))
    `));

    // List statement
    this.statements.set('list', this.db.prepare(`
      SELECT * FROM memory_entries 
      WHERE namespace = ? AND (expires_at IS NULL OR expires_at > strftime('%s', 'now'))
      ORDER BY updated_at DESC
      LIMIT ?
    `));

    // Delete statement
    this.statements.set('delete', this.db.prepare(`
      DELETE FROM memory_entries WHERE key = ? AND namespace = ?
    `));

    // Search statement
    this.statements.set('search', this.db.prepare(`
      SELECT * FROM memory_entries 
      WHERE namespace = ? AND (key LIKE ? OR value LIKE ?) 
      AND (expires_at IS NULL OR expires_at > strftime('%s', 'now'))
      ORDER BY access_count DESC, updated_at DESC
      LIMIT ?
    `));

    // Cleanup statement
    this.statements.set('cleanup', this.db.prepare(`
      DELETE FROM memory_entries WHERE expires_at IS NOT NULL AND expires_at <= strftime('%s', 'now')
    `));

    // Update access statement
    this.statements.set('updateAccess', this.db.prepare(`
      UPDATE memory_entries 
      SET accessed_at = strftime('%s', 'now'), access_count = access_count + 1
      WHERE key = ? AND namespace = ?
    `));
  }

  async store(key: string, value: any, options: MemoryStoreOptions = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const metadata = options.metadata ? JSON.stringify(options.metadata) : null;
    const ttl = options.ttl || null;
    const expiresAt = ttl ? Math.floor(Date.now() / 1000) + ttl : null;
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    try {
      const stmt = this.statements.get('upsert');
      if (!stmt) throw new Error('Upsert statement not prepared');
      
      const result = stmt.run(
        key,
        valueStr,
        namespace,
        metadata,
        ttl,
        expiresAt
      );

      return {
        success: true,
        id: typeof result.lastInsertRowid === 'bigint' ? Number(result.lastInsertRowid) : result.lastInsertRowid,
        size: valueStr.length
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Store failed:`, error);
      throw error;
    }
  }

  async retrieve(key: string, options: { namespace?: string } = {}): Promise<any> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    
    try {
      const stmt = this.statements.get('get');
      if (!stmt) throw new Error('Get statement not prepared');
      
      const row = stmt.get(key, namespace) as SQLiteRow | undefined;
      
      if (!row) {
        return null;
      }

      // Update access stats
      const updateStmt = this.statements.get('updateAccess');
      if (updateStmt) {
        updateStmt.run(key, namespace);
      }

      // Try to parse as JSON, fall back to raw string
      try {
        return JSON.parse(row.value);
      } catch {
        return row.value;
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Retrieve failed:`, error);
      throw error;
    }
  }

  async list(options: MemoryListOptions = {}): Promise<MemoryEntry[]> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const limit = options.limit || 100;
    
    try {
      const stmt = this.statements.get('list');
      if (!stmt) throw new Error('List statement not prepared');
      
      const rows = stmt.all(namespace, limit) as SQLiteRow[];
      
      return rows.map(row => ({
        key: row.key,
        value: this._tryParseJson(row.value),
        namespace: row.namespace,
        metadata: row.metadata ? JSON.parse(row.metadata) : null,
        createdAt: new Date(row.created_at * 1000),
        updatedAt: new Date(row.updated_at * 1000),
        accessedAt: new Date(row.accessed_at * 1000),
        accessCount: row.access_count,
        ttl: row.ttl,
        expiresAt: row.expires_at ? new Date(row.expires_at * 1000) : null
      }));
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] List failed:`, error);
      throw error;
    }
  }

  async delete(key: string, options: { namespace?: string } = {}): Promise<boolean> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    
    try {
      const stmt = this.statements.get('delete');
      if (!stmt) throw new Error('Delete statement not prepared');
      
      const result = stmt.run(key, namespace);
      return result.changes > 0;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Delete failed:`, error);
      throw error;
    }
  }

  async search(pattern: string, options: MemorySearchOptions = {}): Promise<MemorySearchResult[]> {
    await this.initialize();
    
    const namespace = options.namespace || 'default';
    const limit = options.limit || 50;
    const searchPattern = `%${pattern}%`;
    
    try {
      const stmt = this.statements.get('search');
      if (!stmt) throw new Error('Search statement not prepared');
      
      const rows = stmt.all(
        namespace,
        searchPattern,
        searchPattern,
        limit
      ) as SQLiteRow[];
      
      return rows.map(row => ({
        key: row.key,
        value: this._tryParseJson(row.value),
        namespace: row.namespace,
        score: row.access_count,
        updatedAt: new Date(row.updated_at * 1000),
        metadata: row.metadata ? JSON.parse(row.metadata) : null
      }));
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Search failed:`, error);
      throw error;
    }
  }

  async cleanup(): Promise<number> {
    await this.initialize();
    
    try {
      const stmt = this.statements.get('cleanup');
      if (!stmt) throw new Error('Cleanup statement not prepared');
      
      const result = stmt.run();
      return result.changes;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ERROR [memory-store] Cleanup failed:`, error);
      throw error;
    }
  }

  private _tryParseJson(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

// Export a singleton instance for MCP server
export const memoryStore = new SqliteMemoryStore();

export { SqliteMemoryStore };
export default SqliteMemoryStore;