// backup-manager.ts - Backup creation and management

// Node.js compatible import
import * as fs from 'fs';
import * as path from 'path';
import type {
  BackupMetadata,
  BackupManifest,
  BackupResult,
  RestoreResult,
  BackupListItem,
  DiskSpaceResult,
  FileInfo,
  DirectoryInfo,
  FileOperationResult,
  GenericResult,
  CleanupResult
} from './types.js';

// Polyfill for Deno's ensureDirSync
function ensureDirSync(dirPath: string): void {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error;
  }
}

export class BackupManager {
  private workingDir: string;
  private backupDir: string;

  constructor(workingDir: string) {
    this.workingDir = workingDir;
    this.backupDir = `${workingDir}/.claude-flow-backups`;
  }

  /**
   * Create a backup of the current state
   */
  async createBackup(type: string = 'manual', description: string = ''): Promise<BackupResult> {
    const result: BackupResult = {
      success: true,
      id: null,
      location: null,
      errors: [],
      warnings: [],
      files: []
    };

    try {
      // Generate backup ID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `${type}-${timestamp}`;
      result.id = backupId;

      // Create backup directory
      const backupPath = `${this.backupDir}/${backupId}`;
      result.location = backupPath;

      await this.ensureBackupDir();
      fs.mkdirSync(backupPath, { recursive: true });

      // Create backup manifest
      const manifest: BackupManifest = {
        id: backupId,
        type,
        description,
        timestamp: Date.now(),
        workingDir: this.workingDir,
        files: [],
        directories: []
      };

      // Backup critical files
      const criticalFiles = await this.getCriticalFiles();
      for (const file of criticalFiles) {
        const backupResult = await this.backupFile(file, backupPath);
        if (backupResult.success && backupResult.fileInfo) {
          manifest.files.push(backupResult.fileInfo);
          result.files.push(file);
        } else {
          result.warnings.push(`Failed to backup file: ${file}`);
        }
      }

      // Backup critical directories
      const criticalDirs = await this.getCriticalDirectories();
      for (const dir of criticalDirs) {
        const backupResult = await this.backupDirectory(dir, backupPath);
        if (backupResult.success && backupResult.dirInfo) {
          manifest.directories.push(backupResult.dirInfo);
        } else {
          result.warnings.push(`Failed to backup directory: ${dir}`);
        }
      }

      // Save manifest
      fs.writeFileSync(
        `${backupPath}/manifest.json`,
        JSON.stringify(manifest, null, 2)
      );

      // Create backup metadata
      const metadata: BackupMetadata = {
        created: Date.now(),
        size: await this.calculateBackupSize(backupPath),
        fileCount: manifest.files.length,
        dirCount: manifest.directories.length
      };

      fs.writeFileSync(
        `${backupPath}/metadata.json`,
        JSON.stringify(metadata, null, 2)
      );

      console.log(`  ✓ Backup created: ${backupId}`);
      console.log(`  📁 Files backed up: ${result.files.length}`);

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Backup creation failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupId: string): Promise<RestoreResult> {
    const result: RestoreResult = {
      success: true,
      errors: [],
      warnings: [],
      restored: []
    };

    try {
      const backupPath = `${this.backupDir}/${backupId}`;
      
      // Check if backup exists
      if (!fs.existsSync(backupPath)) {
        result.success = false;
        result.errors.push(`Backup not found: ${backupId}`);
        return result;
      }

      // Read manifest
      const manifestPath = `${backupPath}/manifest.json`;
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      const manifest: BackupManifest = JSON.parse(manifestContent);

      // Restore files
      for (const fileInfo of manifest.files) {
        const restoreResult = await this.restoreFile(fileInfo, backupPath);
        if (restoreResult.success) {
          result.restored.push(fileInfo.originalPath);
        } else {
          result.warnings.push(`Failed to restore file: ${fileInfo.originalPath}`);
        }
      }

      // Restore directories
      for (const dirInfo of manifest.directories) {
        const restoreResult = await this.restoreDirectory(dirInfo, backupPath);
        if (restoreResult.success) {
          result.restored.push(dirInfo.originalPath);
        } else {
          result.warnings.push(`Failed to restore directory: ${dirInfo.originalPath}`);
        }
      }

      console.log(`  ✓ Backup restored: ${backupId}`);
      console.log(`  📁 Items restored: ${result.restored.length}`);

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Backup restoration failed: ${error.message}`);
    }

    return result;
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<BackupListItem[]> {
    const backups: BackupListItem[] = [];

    try {
      await this.ensureBackupDir();
      
      const entries = fs.readdirSync(this.backupDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory) {
          try {
            const metadataPath = `${this.backupDir}/${entry.name}/metadata.json`;
            const manifestPath = `${this.backupDir}/${entry.name}/manifest.json`;
            
            const metadata: BackupMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            const manifest: BackupManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            
            backups.push({
              id: entry.name,
              type: manifest.type,
              description: manifest.description,
              created: metadata.created,
              size: metadata.size,
              fileCount: metadata.fileCount,
              dirCount: metadata.dirCount
            });
          } catch {
            // Skip invalid backup directories
          }
        }
      }
    } catch {
      // Backup directory doesn't exist or can't be read
    }

    return backups.sort((a, b) => b.created - a.created);
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<GenericResult> {
    const result: GenericResult = {
      success: true,
      errors: []
    };

    try {
      const backupPath = `${this.backupDir}/${backupId}`;
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`  🗑️  Deleted backup: ${backupId}`);
    } catch (error: any) {
      result.success = false;
      result.errors.push(`Failed to delete backup: ${error.message}`);
    }

    return result;
  }

  /**
   * Clean up old backups
   */
  async cleanupOldBackups(keepCount: number = 5): Promise<CleanupResult> {
    const result: CleanupResult = {
      success: true,
      cleaned: [],
      errors: []
    };

    try {
      const backups = await this.listBackups();
      
      if (backups.length > keepCount) {
        const toDelete = backups.slice(keepCount);
        
        for (const backup of toDelete) {
          const deleteResult = await this.deleteBackup(backup.id);
          if (deleteResult.success) {
            result.cleaned.push(backup.id);
          } else {
            result.errors.push(...deleteResult.errors);
          }
        }
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Cleanup failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Validate backup system
   */
  async validateBackupSystem(): Promise<GenericResult> {
    const result: GenericResult = {
      success: true,
      errors: [],
      warnings: []
    };

    try {
      // Check backup directory
      await this.ensureBackupDir();
      
      // Test backup creation
      const testBackup = await this.createTestBackup();
      if (!testBackup.success) {
        result.success = false;
        result.errors.push('Cannot create test backup');
      } else if (testBackup.id) {
        // Clean up test backup
        await this.deleteBackup(testBackup.id);
      }

      // Check disk space
      const spaceCheck = await this.checkBackupDiskSpace();
      if (!spaceCheck.adequate) {
        result.warnings!.push('Low disk space for backups');
      }

    } catch (error: any) {
      result.success = false;
      result.errors.push(`Backup system validation failed: ${error.message}`);
    }

    return result;
  }

  // Helper methods

  private async ensureBackupDir(): Promise<void> {
    fs.mkdirSync(this.backupDir, { recursive: true });
  }

  private async getCriticalFiles(): Promise<string[]> {
    const files: string[] = [];
    const potentialFiles = [
      'CLAUDE.md',
      'memory-bank.md',
      'coordination.md',
      'package.json',
      'package-lock.json',
      '.roomodes',
      'claude-flow',
      'memory/claude-flow-data.json'
    ];

    for (const file of potentialFiles) {
      try {
        const stat = fs.statSync(`${this.workingDir}/${file}`);
        if (stat.isFile()) {
          files.push(file);
        }
      } catch {
        // File doesn't exist
      }
    }

    return files;
  }

  private async getCriticalDirectories(): Promise<string[]> {
    const dirs: string[] = [];
    const potentialDirs = [
      '.claude',
      '.roo',
      'memory/agents',
      'memory/sessions',
      'coordination'
    ];

    for (const dir of potentialDirs) {
      try {
        const stat = fs.statSync(`${this.workingDir}/${dir}`);
        if (stat.isDirectory) {
          dirs.push(dir);
        }
      } catch {
        // Directory doesn't exist
      }
    }

    return dirs;
  }

  private async backupFile(relativePath: string, backupPath: string): Promise<FileOperationResult> {
    const result: FileOperationResult = {
      success: true,
      fileInfo: null
    };

    try {
      const sourcePath = `${this.workingDir}/${relativePath}`;
      const destPath = `${backupPath}/${relativePath}`;
      
      // Ensure destination directory exists
      const destDir = destPath.split('/').slice(0, -1).join('/');
      fs.mkdirSync(destDir, { recursive: true });
      
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
      
      // Get file info
      const stat = fs.statSync(sourcePath);
      result.fileInfo = {
        originalPath: relativePath,
        backupPath: destPath,
        size: stat.size,
        modified: stat.mtime?.getTime() || 0
      };

    } catch (error: any) {
      result.success = false;
      result.error = error.message;
    }

    return result;
  }

  private async backupDirectory(relativePath: string, backupPath: string): Promise<FileOperationResult> {
    const result: FileOperationResult = {
      success: true,
      dirInfo: null
    };

    try {
      const sourcePath = `${this.workingDir}/${relativePath}`;
      const destPath = `${backupPath}/${relativePath}`;
      
      // Create destination directory
      fs.mkdirSync(destPath, { recursive: true });
      
      // Copy directory contents recursively
      await this.copyDirectoryRecursive(sourcePath, destPath);
      
      result.dirInfo = {
        originalPath: relativePath,
        backupPath: destPath
      };

    } catch (error: any) {
      result.success = false;
      result.error = error.message;
    }

    return result;
  }

  private async copyDirectoryRecursive(source: string, dest: string): Promise<void> {
    const entries = fs.readdirSync(source, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = `${source}/${entry.name}`;
      const destPath = `${dest}/${entry.name}`;
      
      if (entry.isFile()) {
        fs.copyFileSync(sourcePath, destPath);
      } else if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        await this.copyDirectoryRecursive(sourcePath, destPath);
      }
    }
  }

  private async restoreFile(fileInfo: FileInfo, backupPath: string): Promise<FileOperationResult> {
    const result: FileOperationResult = {
      success: true
    };

    try {
      const sourcePath = fileInfo.backupPath;
      const destPath = `${this.workingDir}/${fileInfo.originalPath}`;
      
      // Ensure destination directory exists
      const destDir = destPath.split('/').slice(0, -1).join('/');
      fs.mkdirSync(destDir, { recursive: true });
      
      // Copy file back
      fs.copyFileSync(sourcePath, destPath);

    } catch (error: any) {
      result.success = false;
      result.error = error.message;
    }

    return result;
  }

  private async restoreDirectory(dirInfo: DirectoryInfo, backupPath: string): Promise<FileOperationResult> {
    const result: FileOperationResult = {
      success: true
    };

    try {
      const sourcePath = dirInfo.backupPath;
      const destPath = `${this.workingDir}/${dirInfo.originalPath}`;
      
      // Remove existing directory if it exists
      try {
        fs.rmSync(destPath, { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }
      
      // Create destination directory
      fs.mkdirSync(destPath, { recursive: true });
      
      // Copy directory contents back
      await this.copyDirectoryRecursive(sourcePath, destPath);

    } catch (error: any) {
      result.success = false;
      result.error = error.message;
    }

    return result;
  }

  private async calculateBackupSize(backupPath: string): Promise<number> {
    let totalSize = 0;

    try {
      const entries = fs.readdirSync(backupPath, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = `${backupPath}/${entry.name}`;
        const stat = fs.statSync(entryPath);
        
        if (stat.isFile()) {
          totalSize += stat.size;
        } else if (stat.isDirectory()) {
          totalSize += await this.calculateBackupSize(entryPath);
        }
      }
    } catch {
      // Error calculating size
    }

    return totalSize;
  }

  private async createTestBackup(): Promise<BackupResult> {
    try {
      return await this.createBackup('test', 'System validation test');
    } catch (error: any) {
      return {
        success: false,
        id: null,
        location: null,
        errors: [error.message],
        warnings: [],
        files: []
      };
    }
  }

  private async checkBackupDiskSpace(): Promise<DiskSpaceResult> {
    const result: DiskSpaceResult = {
      adequate: true,
      available: 0
    };

    try {
      const { execSync } = await import('child_process');
      try {
        const output = execSync(`df -k "${this.backupDir}"`, { encoding: 'utf-8' });
        const lines = output.trim().split('\n');
        
        if (lines.length >= 2) {
          const parts = lines[1].split(/\s+/);
          if (parts.length >= 4) {
            result.available = parseInt(parts[3]) / 1024; // MB
            result.adequate = result.available > 500; // At least 500MB for backups
          }
        }
      } catch {
        // Can't check - assume adequate
        result.adequate = true;
      }
    } catch {
      // Can't check - assume adequate
      result.adequate = true;
    }

    return result;
  }
}