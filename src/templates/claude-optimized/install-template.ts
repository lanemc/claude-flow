#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';
import type { 
  TemplateManifest, 
  InstallationResult, 
  InstallationOptions 
} from '../../types/template.js';

// Use __dirname directly for Node.js compatibility
const __dirname = path.resolve(path.dirname(''));

/**
 * Install Claude optimized template files
 * This script copies all template files from the source .claude directory
 * to the template directory for packaging and distribution
 */

const SOURCE_DIR = path.join(__dirname, '../../../.claude');
const DEST_DIR = path.join(__dirname, '.claude');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');

interface InstallationStats {
  successCount: number;
  errorCount: number;
  errors: string[];
  warnings: string[];
}

class TemplateInstaller {
  private manifest: TemplateManifest;
  private options: InstallationOptions;
  private stats: InstallationStats;

  constructor(options: InstallationOptions = {}) {
    this.manifest = this.loadManifest();
    this.options = {
      sourceDir: SOURCE_DIR,
      destinationDir: DEST_DIR,
      validate: true,
      createDirectories: true,
      skipExisting: false,
      ...options
    };
    this.stats = {
      successCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
  }

  private loadManifest(): TemplateManifest {
    try {
      const manifestContent = readFileSync(MANIFEST_PATH, 'utf8');
      return JSON.parse(manifestContent) as TemplateManifest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to read manifest.json:', errorMessage);
      process.exit(1);
    }
  }

  private createDestinationDirectory(): void {
    if (!existsSync(this.options.destinationDir!)) {
      mkdirSync(this.options.destinationDir!, { recursive: true });
    }
  }

  private createDirectoryStructure(): void {
    console.log('Creating directory structure...');
    
    for (const [dirName, dirInfo] of Object.entries(this.manifest.directories)) {
      const destPath = path.join(this.options.destinationDir!, dirInfo.path);
      
      if (!existsSync(destPath)) {
        try {
          mkdirSync(destPath, { recursive: true });
          console.log(`  ✓ Created ${dirInfo.path}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.stats.errors.push(`Failed to create directory ${dirInfo.path}: ${errorMessage}`);
          console.error(`  ✗ ${dirInfo.path} - Error: ${errorMessage}`);
          continue;
        }
      }
      
      // Create README for empty directories
      if (dirInfo.createEmpty) {
        const readmePath = path.join(destPath, 'README.md');
        if (!existsSync(readmePath)) {
          try {
            const readmeContent = `# ${dirName}\n\nThis directory is intentionally empty and will be populated during usage.\n`;
            writeFileSync(readmePath, readmeContent);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.stats.warnings.push(`Failed to create README for ${dirName}: ${errorMessage}`);
          }
        }
      }
    }
  }

  private copyTemplateFiles(): void {
    console.log('\nCopying template files...');
    
    for (const file of this.manifest.files) {
      const sourcePath = path.join(this.options.sourceDir!, file.source);
      const destPath = path.join(this.options.destinationDir!, file.destination);
      
      try {
        if (existsSync(sourcePath)) {
          // Check if file already exists and skipExisting is enabled
          if (this.options.skipExisting && existsSync(destPath)) {
            console.log(`  ~ ${file.destination} (skipped - already exists)`);
            continue;
          }
          
          // Ensure destination directory exists
          const destDir = path.dirname(destPath);
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          
          // Copy file
          copyFileSync(sourcePath, destPath);
          console.log(`  ✓ ${file.destination} (${file.category})`);
          this.stats.successCount++;
        } else {
          console.error(`  ✗ ${file.source} - File not found`);
          this.stats.errorCount++;
          this.stats.errors.push(`Source file not found: ${file.source}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`  ✗ ${file.destination} - Error: ${errorMessage}`);
        this.stats.errorCount++;
        this.stats.errors.push(`Failed to copy ${file.destination}: ${errorMessage}`);
      }
    }
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('Installation Summary:');
    console.log(`  Files copied: ${this.stats.successCount}`);
    console.log(`  Errors: ${this.stats.errorCount}`);
    console.log(`  Total files in manifest: ${this.manifest.files.length}`);
  }

  private printCategorySummary(): void {
    console.log('\nFiles by category:');
    for (const [category, info] of Object.entries(this.manifest.categories)) {
      const copied = this.manifest.files.filter(f => 
        f.category === category && 
        existsSync(path.join(this.options.destinationDir!, f.destination))
      ).length;
      console.log(`  ${category}: ${copied}/${info.count} files`);
    }
  }

  private createInstallationTimestamp(): void {
    if (this.stats.errorCount === 0) {
      console.log('\n✅ Template installation completed successfully!');
      
      // Create a timestamp file
      const timestamp = new Date().toISOString();
      const timestampContent = `Installed: ${timestamp}\nVersion: ${this.manifest.version}\n`;
      
      try {
        writeFileSync(
          path.join(__dirname, '.installed'), 
          timestampContent
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.stats.warnings.push(`Failed to create timestamp file: ${errorMessage}`);
      }
    } else {
      console.log('\n⚠️  Template installation completed with errors.');
      console.log('Please check the error messages above and ensure source files exist.');
    }
  }

  private printNextSteps(): void {
    console.log('\nNext steps:');
    console.log('1. Review the installed files in the .claude directory');
    console.log('2. Run tests to verify functionality: npm test');
    console.log('3. Package for distribution if needed');
    console.log('\nFor more information, see README.md');
  }

  public install(): InstallationResult {
    this.createDestinationDirectory();
    this.createDirectoryStructure();
    this.copyTemplateFiles();
    this.printSummary();
    this.printCategorySummary();
    this.createInstallationTimestamp();
    this.printNextSteps();

    const categorySummary: Record<string, number> = {};
    for (const [category, info] of Object.entries(this.manifest.categories)) {
      const copied = this.manifest.files.filter(f => 
        f.category === category && 
        existsSync(path.join(this.options.destinationDir!, f.destination))
      ).length;
      categorySummary[category] = copied;
    }

    const result: InstallationResult = {
      success: this.stats.errorCount === 0,
      filesInstalled: this.stats.successCount,
      errors: this.stats.errors,
      warnings: this.stats.warnings,
      summary: {
        totalFiles: this.manifest.files.length,
        successCount: this.stats.successCount,
        errorCount: this.stats.errorCount,
        categorySummary
      }
    };

    return result;
  }
}

// Main execution
function main(): void {
  const installer = new TemplateInstaller();
  const result = installer.install();
  
  process.exit(result.success ? 0 : 1);
}

// Export main for external usage
export { main };

export { TemplateInstaller };
export type { InstallationResult, InstallationOptions };