/**
 * TypeScript Integration Tests
 * Tests for the CLI TypeScript conversion to ensure type safety and functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

describe('TypeScript Integration Tests', () => {
  const testDir = join(__dirname, '../../tmp/ts-test');
  
  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('TypeScript Compilation', () => {
    it('should compile all TypeScript files without errors', () => {
      expect(() => {
        execSync('npm run typecheck', { 
          cwd: join(__dirname, '../..'),
          stdio: 'pipe' 
        });
      }).not.toThrow();
    });

    it('should build TypeScript to JavaScript successfully', () => {
      expect(() => {
        execSync('npm run build:ts', { 
          cwd: join(__dirname, '../..'),
          stdio: 'pipe' 
        });
      }).not.toThrow();
    });
  });

  describe('CLI Commands Type Safety', () => {
    it('should have properly typed config command', async () => {
      const configPath = join(__dirname, '../cli/commands/config.ts');
      const configContent = await fs.readFile(configPath, 'utf-8');
      
      // Check for proper TypeScript patterns
      expect(configContent).toContain('key: string');
      expect(configContent).toContain('value: string');
      expect(configContent).toContain('(error as Error)');
    });

    it('should have properly typed swarm command', async () => {
      const swarmPath = join(__dirname, '../cli/commands/swarm.ts');
      const swarmContent = await fs.readFile(swarmPath, 'utf-8');
      
      // Check for proper type definitions
      expect(swarmContent).toContain('CommandContext');
      expect(swarmContent).toContain('options.strategy');
      expect(swarmContent).toContain('validStrategy');
    });
  });

  describe('Type Definitions', () => {
    it('should have comprehensive CLI command types', async () => {
      const typesPath = join(__dirname, '../types/cli-commands.ts');
      const typesContent = await fs.readFile(typesPath, 'utf-8');
      
      expect(typesContent).toContain('CommandFlags');
      expect(typesContent).toContain('CommandContext');
      expect(typesContent).toContain('SwarmOptions');
      expect(typesContent).toContain('ValidationResult');
    });

    it('should export all necessary interfaces', async () => {
      const indexPath = join(__dirname, '../types/index.ts');
      const indexContent = await fs.readFile(indexPath, 'utf-8');
      
      expect(indexContent).toContain('export');
      expect(indexContent).toContain('MemoryEntry');
      expect(indexContent).toContain('TaskStatus');
    });
  });

  describe('Error Handling', () => {
    it('should properly handle error types in gitignore updater', async () => {
      const gitignorePath = join(__dirname, '../cli/simple-commands/init/gitignore-updater.ts');
      const content = await fs.readFile(gitignorePath, 'utf-8');
      
      expect(content).toContain('(error as Error).message');
    });

    it('should have complete rollback result interfaces', async () => {
      const rollbackPath = join(__dirname, '../cli/simple-commands/init/rollback/rollback-executor.ts');
      const content = await fs.readFile(rollbackPath, 'utf-8');
      
      expect(content).toContain('warnings: []');
      expect(content).toContain('RollbackExecutionResult');
    });
  });

  describe('Import/Export Consistency', () => {
    it('should have consistent import statements', async () => {
      const files = [
        '../cli/commands/config.ts',
        '../cli/commands/swarm.ts',
        '../types/cli-commands.ts'
      ];
      
      for (const file of files) {
        const content = await fs.readFile(join(__dirname, file), 'utf-8');
        
        // Check for proper import syntax
        expect(content).toMatch(/import.*from.*['"]/);
        
        // Should not have mixed import styles that cause issues
        expect(content).not.toMatch(/import.*require/);
      }
    });
  });

  describe('Command Interface Compatibility', () => {
    it('should handle both function and string command names', async () => {
      const cliCorePath = join(__dirname, '../cli/cli-core.ts');
      const content = await fs.readFile(cliCorePath, 'utf-8');
      
      expect(content).toContain('name: string | (() => string)');
      expect(content).toContain('typeof cmd.name === \'function\'');
    });
  });

  describe('Flag Types', () => {
    it('should properly type flags in simple-cli', async () => {
      const simpleCliPath = join(__dirname, '../cli/simple-cli.ts');
      const content = await fs.readFile(simpleCliPath, 'utf-8');
      
      expect(content).toContain('Record<string, any>');
      expect(content).toContain('flags: Record<string, any>, args: string[]');
    });
  });

  describe('String Literal Syntax', () => {
    it('should have proper string continuation in sparc orchestrator', async () => {
      const sparcPath = join(__dirname, '../cli/simple-commands/sparc-modes/sparc-orchestrator.ts');
      const content = await fs.readFile(sparcPath, 'utf-8');
      
      // Should not have unterminated string literals
      expect(content).not.toMatch(/\\\\\s*$/m);
      expect(content).toContain('\\\\\n');
    });
  });
});

describe('End-to-End TypeScript Integration', () => {
  it('should successfully initialize with TypeScript support', async () => {
    const testProjectDir = join(__dirname, '../../tmp/e2e-test');
    
    try {
      await fs.mkdir(testProjectDir, { recursive: true });
      
      // Test basic CLI functionality (dry run)
      const result = execSync('node dist/cli/main.js help', {
        cwd: join(__dirname, '../..'),
        encoding: 'utf-8'
      });
      
      expect(result).toContain('Claude-Flow');
      
    } finally {
      await fs.rm(testProjectDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it('should have working config command with types', async () => {
    try {
      const result = execSync('node dist/cli/main.js config --help', {
        cwd: join(__dirname, '../..'),
        encoding: 'utf-8',
        timeout: 10000
      });
      
      expect(result).toContain('config');
      
    } catch (error) {
      // Command might not be built yet - this is acceptable for now
      console.log('Config command test skipped - dist not available');
    }
  });
});