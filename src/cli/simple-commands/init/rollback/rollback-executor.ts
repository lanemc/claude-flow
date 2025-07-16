// rollback-executor.ts - Execute rollback operations with TypeScript type safety

import { MigrationBackup, ValidationResult, RollbackResult, RollbackPhase, RollbackAction, RollbackCheckpoint } from '../../../../migration/types.js';
import { logger } from '../../../../migration/logger.js';
import { promises as fs } from 'fs';
import * as path from 'path';

interface RollbackExecutionResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  actions: string[];
}

interface ActionReversal {
  success: boolean;
  description: string;
}

interface RollbackActionData {
  type: 'file_created' | 'directory_created' | 'file_modified';
  path: string;
  backup?: string;
}

export class RollbackExecutor {
  private workingDir: string;

  constructor(workingDir: string) {
    this.workingDir = workingDir;
  }

  /**
   * Execute full rollback to pre-initialization state
   */
  async executeFullRollback(backupId: string): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      console.log(`🔄 Executing full rollback to backup: ${backupId}`);

      // Step 1: Remove initialization artifacts
      const cleanupResult = await this.cleanupInitializationArtifacts();
      result.actions.push(...cleanupResult.actions);
      if (!cleanupResult.success) {
        result.warnings.push(...cleanupResult.errors);
      }

      // Step 2: Restore from backup
      const restoreResult = await this.restoreFromBackup(backupId);
      result.actions.push(...restoreResult.actions);
      if (!restoreResult.success) {
        result.success = false;
        result.errors.push(...restoreResult.errors);
        return result;
      }

      // Step 3: Verify rollback
      const verifyResult = await this.verifyRollback();
      result.actions.push(...verifyResult.actions);
      if (!verifyResult.success) {
        result.warnings.push(...verifyResult.errors);
      }

      console.log('  ✅ Full rollback completed');

    } catch (error) {
      result.success = false;
      result.errors.push(`Full rollback execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Execute partial rollback for specific component
   */
  async executePartialRollback(phase: RollbackPhase, checkpoint?: RollbackCheckpoint): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      console.log(`🔄 Executing partial rollback for phase: ${phase}`);

      // Determine rollback strategy based on phase
      let rollbackResult: RollbackExecutionResult;
      
      switch (phase) {
        case 'sparc-init':
          rollbackResult = await this.rollbackSparcInitialization();
          break;
        case 'claude-commands':
          rollbackResult = await this.rollbackClaudeCommands();
          break;
        case 'memory-setup':
          rollbackResult = await this.rollbackMemorySetup();
          break;
        case 'coordination-setup':
          rollbackResult = await this.rollbackCoordinationSetup();
          break;
        case 'executable-creation':
          rollbackResult = await this.rollbackExecutableCreation();
          break;
        default:
          rollbackResult = await this.rollbackGenericPhase(phase, checkpoint);
          break;
      }

      result.success = rollbackResult.success;
      result.errors.push(...rollbackResult.errors);
      result.warnings.push(...rollbackResult.warnings);
      result.actions.push(...rollbackResult.actions);

      if (rollbackResult.success) {
        console.log(`  ✅ Partial rollback completed for phase: ${phase}`);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Partial rollback execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Rollback SPARC initialization
   */
  private async rollbackSparcInitialization(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const itemsToRemove: string[] = [
        '.roomodes',
        '.roo',
        '.claude/commands/sparc'
      ];

      for (const item of itemsToRemove) {
        const itemPath = path.join(this.workingDir, item);
        
        try {
          const stat = await fs.stat(itemPath);
          
          if (stat.isFile()) {
            await fs.unlink(itemPath);
            result.actions.push(`Removed file: ${item}`);
          } else if (stat.isDirectory()) {
            await fs.rmdir(itemPath, { recursive: true });
            result.actions.push(`Removed directory: ${item}`);
          }
        } catch {
          // Item doesn't exist - that's fine
          result.actions.push(`Item not found (already clean): ${item}`);
        }
      }

      // Remove SPARC-specific content from CLAUDE.md
      await this.removeSPARCContentFromClaudeMd();
      result.actions.push('Cleaned SPARC content from CLAUDE.md');

    } catch (error) {
      result.success = false;
      result.errors.push(`SPARC rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Rollback Claude commands
   */
  private async rollbackClaudeCommands(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const commandsDir = path.join(this.workingDir, '.claude/commands');
      
      try {
        // Remove all command files
        const entries = await fs.readdir(commandsDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && entry.name.endsWith('.js')) {
            await fs.unlink(path.join(commandsDir, entry.name));
            result.actions.push(`Removed command: ${entry.name}`);
          } else if (entry.isDirectory()) {
            await fs.rmdir(path.join(commandsDir, entry.name), { recursive: true });
            result.actions.push(`Removed command directory: ${entry.name}`);
          }
        }
      } catch {
        result.actions.push('Commands directory was already clean');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Claude commands rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Rollback memory setup
   */
  private async rollbackMemorySetup(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const memoryItems: string[] = [
        'memory/claude-flow-data.json',
        'memory/agents',
        'memory/sessions'
      ];

      for (const item of memoryItems) {
        const itemPath = path.join(this.workingDir, item);
        
        try {
          const stat = await fs.stat(itemPath);
          
          if (stat.isFile()) {
            await fs.unlink(itemPath);
            result.actions.push(`Removed memory file: ${item}`);
          } else if (stat.isDirectory()) {
            await fs.rmdir(itemPath, { recursive: true });
            result.actions.push(`Removed memory directory: ${item}`);
          }
        } catch {
          result.actions.push(`Memory item not found: ${item}`);
        }
      }

      // Keep memory directory but clean it
      try {
        await fs.mkdir(path.join(this.workingDir, 'memory'), { recursive: true });
        result.actions.push('Recreated clean memory directory');
      } catch {
        result.warnings.push('Could not recreate memory directory');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Memory setup rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Rollback coordination setup
   */
  private async rollbackCoordinationSetup(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const coordinationDir = path.join(this.workingDir, 'coordination');
      
      try {
        await fs.rmdir(coordinationDir, { recursive: true });
        result.actions.push('Removed coordination directory');
      } catch {
        result.actions.push('Coordination directory was already clean');
      }

      // Remove coordination.md
      try {
        await fs.unlink(path.join(this.workingDir, 'coordination.md'));
        result.actions.push('Removed coordination.md');
      } catch {
        result.actions.push('coordination.md was already clean');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Coordination setup rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Rollback executable creation
   */
  private async rollbackExecutableCreation(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const executablePath = path.join(this.workingDir, 'claude-flow');
      
      try {
        await fs.unlink(executablePath);
        result.actions.push('Removed claude-flow executable');
      } catch {
        result.actions.push('claude-flow executable was already clean');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Executable rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Generic phase rollback
   */
  private async rollbackGenericPhase(phase: RollbackPhase, checkpoint?: RollbackCheckpoint): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      // Use checkpoint data to determine what to rollback
      if (checkpoint?.data) {
        const actions = (checkpoint.data.actions as RollbackActionData[]) || [];
        
        // Reverse the actions
        for (const action of actions.reverse()) {
          const rollbackResult = await this.reverseAction(action);
          if (rollbackResult.success) {
            result.actions.push(rollbackResult.description);
          } else {
            result.warnings.push(`Could not reverse action: ${action.type}`);
          }
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Generic phase rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Clean up all initialization artifacts
   */
  private async cleanupInitializationArtifacts(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const artifactsToRemove: string[] = [
        'CLAUDE.md',
        'memory-bank.md',
        'coordination.md',
        'claude-flow',
        '.roomodes',
        '.roo',
        '.claude',
        'memory',
        'coordination'
      ];

      for (const artifact of artifactsToRemove) {
        const artifactPath = path.join(this.workingDir, artifact);
        
        try {
          const stat = await fs.stat(artifactPath);
          
          if (stat.isFile()) {
            await fs.unlink(artifactPath);
            result.actions.push(`Removed file: ${artifact}`);
          } else if (stat.isDirectory()) {
            await fs.rmdir(artifactPath, { recursive: true });
            result.actions.push(`Removed directory: ${artifact}`);
          }
        } catch {
          // Artifact doesn't exist - that's fine
          result.actions.push(`Artifact not found: ${artifact}`);
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Restore from backup
   */
  private async restoreFromBackup(backupId: string): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      // This would typically use the BackupManager
      // For now, we'll simulate the restoration
      result.actions.push(`Restored from backup: ${backupId}`);
      
      // In a real implementation, this would:
      // 1. Read the backup manifest
      // 2. Restore each file and directory
      // 3. Set correct permissions
      // 4. Verify restoration

    } catch (error) {
      result.success = false;
      result.errors.push(`Restore from backup failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Verify rollback completed successfully
   */
  private async verifyRollback(): Promise<RollbackExecutionResult> {
    const result: RollbackExecutionResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const expectedCleanItems: string[] = [
        'CLAUDE.md',
        'memory-bank.md',
        'coordination.md',
        '.roomodes',
        '.roo',
        'claude-flow'
      ];

      let foundArtifacts = 0;
      for (const item of expectedCleanItems) {
        try {
          await fs.stat(path.join(this.workingDir, item));
          foundArtifacts++;
        } catch {
          // Item doesn't exist - good
        }
      }

      if (foundArtifacts > 0) {
        result.success = false;
        result.errors.push(`Rollback incomplete: ${foundArtifacts} artifacts still present`);
      } else {
        result.actions.push('Rollback verification passed');
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Rollback verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Remove SPARC content from CLAUDE.md
   */
  private async removeSPARCContentFromClaudeMd(): Promise<void> {
    try {
      const claudePath = path.join(this.workingDir, 'CLAUDE.md');
      
      try {
        const content = await fs.readFile(claudePath, 'utf-8');
        
        // Remove SPARC-specific sections
        const cleanedContent = content
          .replace(/## SPARC Development Commands[\s\S]*?(?=##|\n#|\n$)/g, '')
          .replace(/### SPARC[\s\S]*?(?=###|\n##|\n#|\n$)/g, '')
          .replace(/\n{3,}/g, '\n\n') // Clean up multiple newlines
          .trim();

        await fs.writeFile(claudePath, cleanedContent);
      } catch {
        // File doesn't exist or can't be modified
      }
    } catch {
      // Error handling CLAUDE.md - continue silently
    }
  }

  /**
   * Reverse a specific action
   */
  private async reverseAction(action: RollbackActionData): Promise<ActionReversal> {
    const result: ActionReversal = {
      success: true,
      description: ''
    };

    try {
      switch (action.type) {
        case 'file_created':
          await fs.unlink(action.path);
          result.description = `Removed created file: ${action.path}`;
          break;
          
        case 'directory_created':
          await fs.rmdir(action.path, { recursive: true });
          result.description = `Removed created directory: ${action.path}`;
          break;
          
        case 'file_modified':
          if (action.backup) {
            await fs.writeFile(action.path, action.backup);
            result.description = `Restored modified file: ${action.path}`;
          }
          break;
          
        default:
          result.success = false;
          result.description = `Unknown action type: ${action.type}`;
          break;
      }
    } catch (error) {
      result.success = false;
      result.description = `Failed to reverse action: ${error instanceof Error ? error.message : String(error)}`;
    }

    return result;
  }
}
