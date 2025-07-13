class MemoryStorage {
  constructor() {
    this.storage = null;
    this.fallbackMode = false;
    this.initializeStorage();
  }

  initializeStorage() {
    try {
      // Try SQLite first
      const Database = require('better-sqlite3');
      this.storage = new Database(':memory:');
      this.setupSQLiteTables();
      console.log('✓ SQLite memory storage initialized');
    } catch (error) {
      console.warn('⚠ SQLite unavailable, using in-memory fallback:', error.message);
      this.fallbackMode = true;
      this.storage = {
        data: new Map(),
        metadata: new Map(),
        sessions: new Map()
      };
      console.log('✓ In-memory fallback storage initialized');
    }
  }

  setupSQLiteTables() {
    if (this.fallbackMode) return;
    
    this.storage.exec(`
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

  store(key, value, metadata = {}) {
    if (this.fallbackMode) {
      this.storage.data.set(key, {
        value: JSON.stringify(value),
        timestamp: Date.now(),
        metadata: JSON.stringify(metadata)
      });
      return;
    }

    const stmt = this.storage.prepare(`
      INSERT OR REPLACE INTO memory_store (key, value, timestamp, metadata)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(key, JSON.stringify(value), Date.now(), JSON.stringify(metadata));
  }

  retrieve(key) {
    if (this.fallbackMode) {
      const entry = this.storage.data.get(key);
      return entry ? JSON.parse(entry.value) : null;
    }

    const stmt = this.storage.prepare('SELECT value FROM memory_store WHERE key = ?');
    const row = stmt.get(key);
    return row ? JSON.parse(row.value) : null;
  }

  list(pattern = '*') {
    if (this.fallbackMode) {
      const results = [];
      for (const [key, entry] of this.storage.data.entries()) {
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

    const sql = pattern === '*' 
      ? 'SELECT * FROM memory_store ORDER BY timestamp DESC'
      : 'SELECT * FROM memory_store WHERE key LIKE ? ORDER BY timestamp DESC';
    
    const stmt = this.storage.prepare(sql);
    const rows = pattern === '*' ? stmt.all() : stmt.all(`%${pattern.replace('*', '')}%`);
    
    return rows.map(row => ({
      key: row.key,
      value: JSON.parse(row.value),
      timestamp: row.timestamp,
      metadata: JSON.parse(row.metadata)
    }));
  }

  clear() {
    if (this.fallbackMode) {
      this.storage.data.clear();
      this.storage.metadata.clear();
      this.storage.sessions.clear();
      return;
    }

    this.storage.exec('DELETE FROM memory_store; DELETE FROM sessions;');
  }

  close() {
    if (!this.fallbackMode && this.storage) {
      this.storage.close();
    }
  }
}

module.exports = MemoryStorage;