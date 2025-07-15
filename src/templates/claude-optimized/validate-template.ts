#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import type { 
  TemplateManifest, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning 
} from '../../types/template.js';

// Use __dirname directly for Node.js compatibility
const __dirname = path.resolve(path.dirname(''));

/**
 * Validate Claude optimized template installation
 * This script verifies that all required files are present and properly formatted
 */

const TEMPLATE_DIR = path.join(__dirname, '.claude');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
} as const;

type ColorKey = keyof typeof colors;

function log(message: string, color: ColorKey = 'reset'): void {
  console.log(colors[color] + message + colors.reset);
}

class TemplateValidator {
  private manifest: TemplateManifest;
  private totalTests: number = 0;
  private passedTests: number = 0;
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  constructor() {
    this.manifest = this.loadManifest();
  }

  private loadManifest(): TemplateManifest {
    try {
      const manifestContent = readFileSync(MANIFEST_PATH, 'utf8');
      const manifest = JSON.parse(manifestContent) as TemplateManifest;
      log('✓ Manifest loaded successfully', 'green');
      return manifest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log('✗ Failed to load manifest: ' + errorMessage, 'red');
      process.exit(1);
    }
  }

  private test(description: string, condition: boolean): void {
    this.totalTests++;
    if (condition) {
      log(`  ✓ ${description}`, 'green');
      this.passedTests++;
    } else {
      log(`  ✗ ${description}`, 'red');
      this.errors.push({
        type: 'file_missing',
        message: description,
        severity: 'error'
      });
    }
  }

  private validateDirectoryStructure(): void {
    log('\n1. Checking template directory...', 'blue');
    this.test('Template directory exists', existsSync(TEMPLATE_DIR));

    log('\n2. Validating directory structure...', 'blue');
    for (const [dirName, dirInfo] of Object.entries(this.manifest.directories)) {
      const dirPath = path.join(TEMPLATE_DIR, dirInfo.path);
      this.test(`Directory ${dirInfo.path} exists`, existsSync(dirPath));
    }
  }

  private validateFilePresence(): void {
    log('\n3. Checking file presence...', 'blue');
    for (const file of this.manifest.files) {
      const filePath = path.join(TEMPLATE_DIR, file.destination);
      this.test(`File ${file.destination} exists`, existsSync(filePath));
    }
  }

  private validateFileContent(): void {
    log('\n4. Validating file content...', 'blue');
    const sampleFiles = [
      'commands/sparc.md',
      'commands/sparc/architect.md',
      'BATCHTOOLS_GUIDE.md'
    ];

    for (const fileName of sampleFiles) {
      const filePath = path.join(TEMPLATE_DIR, fileName);
      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf8');
          this.test(`${fileName} has content`, content.length > 100);
          this.test(`${fileName} contains frontmatter`, content.startsWith('---'));
        } catch (error) {
          this.test(`${fileName} is readable`, false);
        }
      }
    }
  }

  private validateCommandStructure(): void {
    log('\n5. Validating command structure...', 'blue');
    const sparcCommands = this.manifest.files.filter(f => f.category === 'sparc-mode');
    
    for (const cmd of sparcCommands.slice(0, 3)) { // Test first 3 commands
      const filePath = path.join(TEMPLATE_DIR, cmd.destination);
      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf8');
          this.test(`${cmd.destination} has proper structure`, 
            content.includes('## Instructions') || content.includes('You are'));
        } catch (error) {
          this.test(`${cmd.destination} is readable`, false);
        }
      }
    }
  }

  private validateTestFiles(): void {
    log('\n6. Validating test files...', 'blue');
    const testFiles = this.manifest.files.filter(f => f.category === 'test');
    
    for (const testFile of testFiles.slice(0, 3)) { // Test first 3 test files
      const filePath = path.join(TEMPLATE_DIR, testFile.destination);
      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf8');
          this.test(`${testFile.destination} has test structure`, 
            content.includes('describe') || content.includes('test') || content.includes('it'));
        } catch (error) {
          this.test(`${testFile.destination} is readable`, false);
        }
      }
    }
  }

  private validateVersionConsistency(): void {
    log('\n7. Checking version consistency...', 'blue');
    const versionFile = path.join(__dirname, 'VERSION');
    if (existsSync(versionFile)) {
      try {
        const fileVersion = readFileSync(versionFile, 'utf8').trim();
        this.test('Version file matches manifest', fileVersion === this.manifest.version);
      } catch (error) {
        this.test('Version file is readable', false);
      }
    }
  }

  private validateFileCounts(): void {
    log('\n8. Validating file counts...', 'blue');
    for (const [category, info] of Object.entries(this.manifest.categories)) {
      const actualCount = this.manifest.files.filter(f => f.category === category).length;
      // Allow some flexibility in counts as they might have been updated
      const countMatches = Math.abs(actualCount - info.count) <= 2;
      this.test(`${category} file count approximately correct (${actualCount} vs ${info.count})`, countMatches);
    }
  }

  private validateInstallationStatus(): void {
    log('\n9. Checking installation status...', 'blue');
    const installFile = path.join(__dirname, '.installed');
    this.test('Installation timestamp exists', existsSync(installFile));
  }

  private printSummary(): void {
    log('\n' + '='.repeat(60), 'blue');
    log('Validation Summary:', 'blue');
    log(`  Total tests: ${this.totalTests}`);
    log(`  Passed: ${this.passedTests}`, this.passedTests === this.totalTests ? 'green' : 'yellow');
    log(`  Failed: ${this.totalTests - this.passedTests}`, this.totalTests - this.passedTests === 0 ? 'green' : 'red');

    const percentage = Math.round((this.passedTests / this.totalTests) * 100);
    log(`  Success rate: ${percentage}%`, percentage >= 90 ? 'green' : percentage >= 70 ? 'yellow' : 'red');

    if (this.passedTests === this.totalTests) {
      log('\n🎉 Template validation passed! All files are properly installed.', 'green');
    } else if (percentage >= 90) {
      log('\n⚠️  Template validation mostly passed with minor issues.', 'yellow');
    } else {
      log('\n❌ Template validation failed. Please check the issues above.', 'red');
    }
  }

  private printTemplateInfo(): void {
    log('\nTemplate Information:', 'blue');
    log(`  Version: ${this.manifest.version}`);
    log(`  Total files: ${this.manifest.files.length}`);
    log(`  Documentation files: ${this.manifest.files.filter(f => f.category === 'documentation').length}`);
    log(`  Command files: ${this.manifest.files.filter(f => f.category === 'command').length}`);
    log(`  SPARC mode files: ${this.manifest.files.filter(f => f.category === 'sparc-mode').length}`);
    log(`  Test files: ${this.manifest.files.filter(f => f.category === 'test').length}`);
  }

  public validate(): ValidationResult {
    this.validateDirectoryStructure();
    this.validateFilePresence();
    this.validateFileContent();
    this.validateCommandStructure();
    this.validateTestFiles();
    this.validateVersionConsistency();
    this.validateFileCounts();
    this.validateInstallationStatus();
    
    this.printSummary();
    this.printTemplateInfo();

    const result: ValidationResult = {
      valid: this.passedTests === this.totalTests,
      errors: this.errors,
      warnings: this.warnings,
      statistics: {
        totalFiles: this.manifest.files.length,
        passedTests: this.passedTests,
        failedTests: this.totalTests - this.passedTests,
        successRate: Math.round((this.passedTests / this.totalTests) * 100)
      }
    };

    return result;
  }
}

// Main execution
function main(): void {
  const validator = new TemplateValidator();
  const result = validator.validate();
  
  process.exit(result.valid ? 0 : 1);
}

// Export main for external usage
export { main };

export { TemplateValidator };
export type { ValidationResult, ValidationError, ValidationWarning };