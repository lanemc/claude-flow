/**
 * @jest-environment node
 */

describe('SQLite Bindings', () => {
  test('better-sqlite3 can be imported', () => {
    expect(() => {
      require('better-sqlite3');
    }).not.toThrow();
  });

  test('can create in-memory database', () => {
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    expect(db).toBeDefined();
    db.close();
  });

  test('can perform basic operations', () => {
    const Database = require('better-sqlite3');
    const db = new Database(':memory:');
    
    // Create table
    db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
    
    // Insert data
    const insert = db.prepare('INSERT INTO test (name) VALUES (?)');
    insert.run('test-value');
    
    // Query data
    const select = db.prepare('SELECT * FROM test WHERE name = ?');
    const result = select.get('test-value');
    
    expect(result).toEqual({ id: 1, name: 'test-value' });
    
    db.close();
  });

  test('handles Node.js version compatibility', () => {
    // This test verifies that the current Node.js version is supported
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
    
    // better-sqlite3 requires Node.js 14.21.1 or later
    expect(majorVersion).toBeGreaterThanOrEqual(14);
    
    console.log(`✅ Node.js ${nodeVersion} is compatible with better-sqlite3`);
  });
});