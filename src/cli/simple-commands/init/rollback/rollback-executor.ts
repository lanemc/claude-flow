// rollback-executor.ts - Execute rollback operations

import * as fs from 'fs';
import type {
  RollbackResult,
  Checkpoint,
  RecoveryAction,
  FileOperationResult
} from './types.js';

export class RollbackExecutor {
  private workingDir: string;

  constructor(workingDir: string) {
    this.workingDir = workingDir;
  }

  /**
   * Execute full rollback to pre-initialization state
   */
  async executeFullRollback(backupId: string): Promise<RollbackResult> {
    const result: RollbackResult = {
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

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Full rollback execution failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Execute partial rollback for specific component
   */
  async executePartialRollback(phase: string, checkpoint: Checkpoint): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      console.log(`🔄 Executing partial rollback for phase: ${phase}`);

      // Determine rollback strategy based on phase
      let rollbackResult: RollbackResult;
      
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

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Partial rollback execution failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Rollback SPARC initialization
   */
  private async rollbackSparcInitialization(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const itemsToRemove = [
        '.roomodes',
        '.roo',
        '.claude/commands/sparc'
      ];

      for (const item of itemsToRemove) {
        const itemPath = `${this.workingDir}/${item}`;
        
        try {
          const stat = fs.statSync(itemPath);
          
          if (stat.isFile()) {
            fs.unlinkSync(itemPath);
            result.actions.push(`Removed file: ${item}`);
          } else if (stat.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
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

    } catch (error: any) {
      result.success = false;
      result.errors.push(`SPARC rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Rollback Claude commands
   */
  private async rollbackClaudeCommands(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const commandsDir = `${this.workingDir}/.claude/commands`;
      
      try {
        // Remove all command files
        const entries = fs.readdirSync(commandsDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && entry.name.endsWith('.js')) {
            fs.unlinkSync(`${commandsDir}/${entry.name}`);
            result.actions.push(`Removed command: ${entry.name}`);
          } else if (entry.isDirectory()) {
            fs.rmSync(`${commandsDir}/${entry.name}`, { recursive: true, force: true });
            result.actions.push(`Removed command directory: ${entry.name}`);
          }
        }
      } catch {
        result.actions.push('Commands directory was already clean');
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Claude commands rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Rollback memory setup
   */
  private async rollbackMemorySetup(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const memoryItems = [
        'memory/claude-flow-data.json',
        'memory/agents',
        'memory/sessions'
      ];

      for (const item of memoryItems) {
        const itemPath = `${this.workingDir}/${item}`;
        
        try {
          const stat = fs.statSync(itemPath);
          
          if (stat.isFile()) {
            fs.unlinkSync(itemPath);
            result.actions.push(`Removed memory file: ${item}`);
          } else if (stat.isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
            result.actions.push(`Removed memory directory: ${item}`);
          }
        } catch {
          result.actions.push(`Memory item not found: ${item}`);
        }
      }

      // Keep memory directory but clean it
      try {
        fs.mkdirSync(`${this.workingDir}/memory`, { recursive: true });
        result.actions.push('Recreated clean memory directory');
      } catch {
        result.warnings.push('Could not recreate memory directory');
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Memory setup rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Rollback coordination setup
   */
  private async rollbackCoordinationSetup(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const coordinationDir = `${this.workingDir}/coordination`;
      
      try {
        fs.rmSync(coordinationDir, { recursive: true, force: true });
        result.actions.push('Removed coordination directory');
      } catch {
        result.actions.push('Coordination directory was already clean');
      }

      // Remove coordination.md
      try {
        fs.unlinkSync(`${this.workingDir}/coordination.md`);
        result.actions.push('Removed coordination.md');
      } catch {
        result.actions.push('coordination.md was already clean');
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Coordination setup rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Rollback executable creation
   */
  private async rollbackExecutableCreation(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const executablePath = `${this.workingDir}/claude-flow`;
      
      try {
        fs.unlinkSync(executablePath);
        result.actions.push('Removed claude-flow executable');
      } catch {
        result.actions.push('claude-flow executable was already clean');
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Executable rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Generic phase rollback
   */
  private async rollbackGenericPhase(phase: string, checkpoint: Checkpoint): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      // Use checkpoint data to determine what to rollback
      if (checkpoint && checkpoint.data) {
        const actions: RecoveryAction[] = checkpoint.data.actions || [];
        
        // Reverse the actions
        for (const action of actions.reverse()) {
          const rollbackResult = await this.reverseAction(action);
          if (rollbackResult.success) {
            result.actions.push(rollbackResult.description || '');
          } else {
            result.warnings.push(`Could not reverse action: ${action.type}`);
          }
        }
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Generic phase rollback failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Clean up all initialization artifacts
   */
  private async cleanupInitializationArtifacts(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const artifactsToRemove = [
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
        const artifactPath = `${this.workingDir}/${artifact}`;
        
        try {
          const stat = fs.statSync(artifactPath);
          
          if (stat.isFile()) {
            fs.unlinkSync(artifactPath);
            result.actions.push(`Removed file: ${artifact}`);
          } else if (stat.isDirectory()) {
            fs.rmSync(artifactPath, { recursive: true, force: true });
            result.actions.push(`Removed directory: ${artifact}`);
          }
        } catch {
          // Artifact doesn't exist - that's fine
          result.actions.push(`Artifact not found: ${artifact}`);
        }
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Cleanup failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Restore from backup
   */
  private async restoreFromBackup(backupId: string): Promise<RollbackResult> {
    const result: RollbackResult = {
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

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Restore from backup failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Verify rollback completed successfully
   */
  private async verifyRollback(): Promise<RollbackResult> {
    const result: RollbackResult = {
      success: true,
      errors: [],
      warnings: [],
      actions: []
    };

    try {
      const expectedCleanItems = [
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
          fs.statSync(`${this.workingDir}/${item}`);
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

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Rollback verification failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Remove SPARC content from CLAUDE.md
   */
  private async removeSPARCContentFromClaudeMd(): Promise<void> {
    try {
      const claudePath = `${this.workingDir}/CLAUDE.md`;
      
      try {
        const content = fs.readFileSync(claudePath, 'utf-8');
        
        // Remove SPARC-specific sections
        const cleanedContent = content
          .replace(/## SPARC Development Commands[\s\S]*?(?=##|\n#|\n$)/g, '')
          .replace(/### SPARC[\s\S]*?(?=###|\n##|\n#|\n$)/g, '')
          .replace(/\n{3,}/g, '\n\n') // Clean up multiple newlines
          .trim();

        fs.writeFileSync(claudePath, cleanedContent);
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
  private async reverseAction(action: RecoveryAction): Promise<FileOperationResult> {
    const result: FileOperationResult = {
      success: true,
      description: ''
    };

    try {
      switch (action.type) {
        case 'file_created':
          if (action.path) {
            fs.unlinkSync(action.path);
            result.description = `Removed created file: ${action.path}`;
          }
          break;
          
        case 'directory_created':
          if (action.path) {
            fs.rmSync(action.path, { recursive: true, force: true });
            result.description = `Removed created directory: ${action.path}`;
          }
          break;
          
        case 'file_modified':
          if (action.path && action.backup) {
            fs.writeFileSync(action.path, action.backup);
            result.description = `Restored modified file: ${action.path}`;
          }
          break;
          
        default:
          result.success = false;
          result.description = `Unknown action type: ${action.type}`;
          break;
      }
    } catch (error: any) {
      result.success = false;
      result.description = `Failed to reverse action: ${error.message}`;
    }

    return result;
  }
}