#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TemplateManifest, DirectoryConfig, TemplateFile } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Install Claude optimized template files
 * This script copies all template files from the source .claude directory
 * to the template directory for packaging and distribution
 */

interface InstallationConfig {
  sourceDir: string;
  destDir: string;
  manifestPath: string;
}

interface InstallationResult {
  successCount: number;
  errorCount: number;
  categoryStats: Map<string, { copied: number; total: number }>;
}

function loadManifest(manifestPath: string): TemplateManifest {
  try {
    const manifestContent = readFileSync(manifestPath, 'utf8');
    return JSON.parse(manifestContent) as TemplateManifest;
  } catch (error) {
    throw new Error(`Failed to load manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function createDirectoryStructure(destDir: string, directories: Record<string, DirectoryConfig>): void {
  console.log('Creating directory structure...');
  
  for (const [dirName, dirInfo] of Object.entries(directories)) {
    const destPath = join(destDir, dirInfo.path);
    if (!existsSync(destPath)) {
      mkdirSync(destPath, { recursive: true });
      console.log(`  ✓ Created ${dirInfo.path}`);
    }
    
    // Create README for empty directories
    if (dirInfo.createEmpty) {
      const readmePath = join(destPath, 'README.md');
      if (!existsSync(readmePath)) {
        writeFileSync(readmePath, `# ${dirName}\n\nThis directory is intentionally empty and will be populated during usage.\n`);
      }
    }
  }
}

function copyTemplateFiles(config: InstallationConfig, files: TemplateFile[]): InstallationResult {
  console.log('\nCopying template files...');
  let successCount = 0;
  let errorCount = 0;
  const categoryStats = new Map<string, { copied: number; total: number }>();

  for (const file of files) {
    const sourcePath = join(config.sourceDir, file.source);
    const destPath = join(config.destDir, file.destination);
    
    // Initialize category stats
    if (!categoryStats.has(file.category)) {
      categoryStats.set(file.category, { copied: 0, total: 0 });
    }
    const stats = categoryStats.get(file.category)!;
    stats.total++;
    
    try {
      if (existsSync(sourcePath)) {
        // Ensure destination directory exists
        const destDir = dirname(destPath);
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        
        // Copy file
        copyFileSync(sourcePath, destPath);
        console.log(`  ✓ ${file.destination} (${file.category})`);
        successCount++;
        stats.copied++;
      } else {
        console.error(`  ✗ ${file.source} - File not found`);
        errorCount++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`  ✗ ${file.destination} - Error: ${errorMessage}`);
      errorCount++;
    }
  }

  return { successCount, errorCount, categoryStats };
}

function printSummary(result: InstallationResult, manifest: TemplateManifest): void {
  console.log('\n' + '='.repeat(50));
  console.log('Installation Summary:');
  console.log(`  Files copied: ${result.successCount}`);
  console.log(`  Errors: ${result.errorCount}`);
  console.log(`  Total files in manifest: ${manifest.files.length}`);

  // Category summary
  console.log('\nFiles by category:');
  for (const [category, stats] of result.categoryStats) {
    console.log(`  ${category}: ${stats.copied}/${stats.total} files`);
  }
}

function createInstallationTimestamp(destDir: string, version: string): void {
  const timestamp = new Date().toISOString();
  writeFileSync(
    join(destDir, '.installed'), 
    `Installed: ${timestamp}\nVersion: ${version}\n`
  );
}

function printNextSteps(): void {
  console.log('\nNext steps:');
  console.log('1. Review the installed files in the .claude directory');
  console.log('2. Run tests to verify functionality: npm test');
  console.log('3. Package for distribution if needed');
  console.log('\nFor more information, see README.md');
}

function main(): void {
  const config: InstallationConfig = {
    sourceDir: join(__dirname, '../../../.claude'),
    destDir: join(__dirname, '.claude'),
    manifestPath: join(__dirname, 'manifest.json')
  };

  try {
    // Read manifest
    const manifest = loadManifest(config.manifestPath);

    // Create destination directory
    if (!existsSync(config.destDir)) {
      mkdirSync(config.destDir, { recursive: true });
    }

    // Create directory structure
    createDirectoryStructure(config.destDir, manifest.directories);

    // Copy files
    const result = copyTemplateFiles(config, manifest.files);

    // Print summary
    printSummary(result, manifest);

    // Create installation timestamp
    if (result.errorCount === 0) {
      createInstallationTimestamp(__dirname, manifest.version);
      console.log('\n✅ Template installation completed successfully!');
    } else {
      console.log('\n⚠️  Template installation completed with errors.');
      console.log('Please check the error messages above and ensure source files exist.');
    }

    // Print next steps
    printNextSteps();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Installation failed: ${errorMessage}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { loadManifest, createDirectoryStructure, copyTemplateFiles, InstallationResult };