#!/usr/bin/env node

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import type { TemplateManifest } from '../../types/template.js';

// Use __dirname directly for Node.js compatibility
const __dirname = path.resolve(path.dirname(''));

/**
 * Claude Optimized Template Manager
 * Unified interface for template operations with TypeScript support
 */

interface CommandFunction {
  (...args: string[]): void;
}

interface Commands {
  [key: string]: CommandFunction;
}

interface ManifestWithVersion extends TemplateManifest {
  version: string;
}

function executeCommand(command: string, options: { stdio: 'inherit' } = { stdio: 'inherit' }): void {
  try {
    execSync(command, options);
  } catch (error) {
    console.error(`Command failed: ${command}`);
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function readManifest(): ManifestWithVersion {
  try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf8');
    return JSON.parse(manifestContent) as ManifestWithVersion;
  } catch (error) {
    console.error('Failed to read manifest.json');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

function readVersion(): string {
  try {
    const versionPath = path.join(__dirname, 'VERSION');
    return readFileSync(versionPath, 'utf8').trim();
  } catch (error) {
    console.error('Failed to read VERSION file');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

const commands: Commands = {
  install: (): void => {
    executeCommand('tsx install-template.ts');
  },
  
  validate: (): void => {
    executeCommand('tsx validate-template.ts');
  },
  
  deploy: (targetPath?: string): void => {
    if (!targetPath) {
      console.error('Usage: template-manager deploy <target-project-path>');
      process.exit(1);
    }
    executeCommand(`tsx deploy-to-project.ts "${targetPath}"`);
  },
  
  info: (): void => {
    const manifest = readManifest();
    const version = readVersion();
    
    console.log('Claude Optimized Template');
    console.log('========================');
    console.log(`Version: ${version}`);
    console.log(`Files: ${manifest.files.length}`);
    console.log(`Categories: ${Object.keys(manifest.categories).join(', ')}`);
    console.log('\nFile breakdown:');
    
    for (const [category, info] of Object.entries(manifest.categories)) {
      const count = manifest.files.filter(f => f.category === category).length;
      console.log(`  ${category}: ${count} files`);
    }
    
    console.log('\nAvailable commands:');
    console.log('  install  - Install template files from source');
    console.log('  validate - Validate template installation');
    console.log('  deploy   - Deploy template to project');
    console.log('  info     - Show template information');
    console.log('  update   - Update template version');
    console.log('  test     - Run test suite');
  },
  
  update: (): void => {
    console.log('Updating template...');
    
    // Run install to get latest files
    console.log('1. Refreshing template files...');
    executeCommand('tsx install-template.ts');
    
    // Validate
    console.log('2. Validating installation...');
    executeCommand('tsx validate-template.ts');
    
    console.log('3. Template updated successfully!');
  },
  
  test: (): void => {
    console.log('Running template test suite...');
    const testHarnessPath = path.join(__dirname, '.claude', 'tests', 'test-harness.js');
    
    try {
      if (readFileSync(testHarnessPath, 'utf8')) {
        executeCommand('cd .claude && tsx tests/test-harness.ts');
      }
    } catch (error) {
      console.log('Test harness not found. Run "install" first.');
    }
  }
};

function printUsage(): void {
  console.log('Claude Optimized Template Manager');
  console.log('Usage: node template-manager.js <command> [args]');
  console.log('\nCommands:');
  console.log('  install  - Install template files from source');
  console.log('  validate - Validate template installation');
  console.log('  deploy   - Deploy template to project');
  console.log('  info     - Show template information');
  console.log('  update   - Update template version');
  console.log('  test     - Run test suite');
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }
  
  const command = args[0];
  
  if (commands[command]) {
    try {
      commands[command](...args.slice(1));
    } catch (error) {
      console.error(`Error executing ${command}:`, error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    console.log('Available commands: ' + Object.keys(commands).join(', '));
    process.exit(1);
  }
}

// Export main for external usage
export { main };