#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';
import type { 
  TemplateManifest, 
  DeploymentResult, 
  DeploymentOptions 
} from '../../types/template.js';

// Use __dirname directly for Node.js compatibility
const __dirname = path.resolve(path.dirname(''));

/**
 * Deploy Claude optimized template to a target project
 * Usage: node deploy-to-project.js <target-project-path>
 */

const SOURCE_DIR = path.join(__dirname, '.claude');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');

interface DeploymentStats {
  successCount: number;
  errorCount: number;
  errors: string[];
  warnings: string[];
}

class TemplateDeployer {
  private manifest: TemplateManifest;
  private options: DeploymentOptions;
  private stats: DeploymentStats;

  constructor(options: DeploymentOptions) {
    this.manifest = this.loadManifest();
    this.options = {
      overwrite: true,
      validate: true,
      backup: false,
      skipDependencies: false,
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

  private validateTargetProject(): boolean {
    if (!existsSync(this.options.targetPath)) {
      console.error(`Error: Target project directory does not exist: ${this.options.targetPath}`);
      return false;
    }

    if (this.options.validate) {
      // Check if it's a valid project (has package.json or similar)
      const projectFiles = ['package.json', 'tsconfig.json', 'deno.json', 'go.mod', 'Cargo.toml', 'setup.py'];
      const hasProjectFile = projectFiles.some(file => 
        existsSync(path.join(this.options.targetPath, file))
      );

      if (!hasProjectFile) {
        console.warn('Warning: Target directory does not appear to be a project root (no package.json, etc.)');
        this.stats.warnings.push('Target directory may not be a valid project root');
      }
    }

    return true;
  }

  private printDeploymentHeader(): void {
    console.log('Claude Optimized Template Deployment');
    console.log('====================================');
    console.log(`Source: ${SOURCE_DIR}`);
    console.log(`Target: ${path.join(this.options.targetPath, '.claude')}`);
  }

  private createTargetDirectory(): void {
    const targetDir = path.join(this.options.targetPath, '.claude');
    
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
      console.log('✓ Created .claude directory');
    } else {
      if (this.options.overwrite) {
        console.log('⚠️  .claude directory already exists - files will be overwritten');
      } else {
        console.error('Error: .claude directory already exists and overwrite is disabled');
        process.exit(1);
      }
    }
  }

  private createDirectoryStructure(): void {
    console.log('\nCreating directory structure...');
    const targetDir = path.join(this.options.targetPath, '.claude');
    
    for (const [dirName, dirInfo] of Object.entries(this.manifest.directories)) {
      const targetPath = path.join(targetDir, dirInfo.path);
      
      if (!existsSync(targetPath)) {
        try {
          mkdirSync(targetPath, { recursive: true });
          console.log(`  ✓ ${dirInfo.path}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.stats.errors.push(`Failed to create directory ${dirInfo.path}: ${errorMessage}`);
          console.error(`  ✗ ${dirInfo.path} - Error: ${errorMessage}`);
          continue;
        }
      }
      
      // Create README for empty directories
      if (dirInfo.createEmpty) {
        const readmePath = path.join(targetPath, 'README.md');
        if (!existsSync(readmePath)) {
          try {
            const readmeContent = `# ${dirName}\n\nThis directory will be populated during usage.\n`;
            writeFileSync(readmePath, readmeContent);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.stats.warnings.push(`Failed to create README for ${dirName}: ${errorMessage}`);
          }
        }
      }
    }
  }

  private deployTemplateFiles(): void {
    console.log('\nDeploying template files...');
    const targetDir = path.join(this.options.targetPath, '.claude');
    
    for (const file of this.manifest.files) {
      const sourcePath = path.join(SOURCE_DIR, file.destination);
      const targetPath = path.join(targetDir, file.destination);
      
      try {
        if (existsSync(sourcePath)) {
          // Create backup if requested
          if (this.options.backup && existsSync(targetPath)) {
            const backupPath = `${targetPath}.backup`;
            copyFileSync(targetPath, backupPath);
          }
          
          // Ensure target directory exists
          const targetFileDir = path.dirname(targetPath);
          if (!existsSync(targetFileDir)) {
            mkdirSync(targetFileDir, { recursive: true });
          }
          
          // Copy file
          copyFileSync(sourcePath, targetPath);
          console.log(`  ✓ ${file.destination}`);
          this.stats.successCount++;
        } else {
          console.error(`  ✗ ${file.destination} - Source file not found`);
          this.stats.errorCount++;
          this.stats.errors.push(`Source file not found: ${file.destination}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`  ✗ ${file.destination} - Error: ${errorMessage}`);
        this.stats.errorCount++;
        this.stats.errors.push(`Failed to deploy ${file.destination}: ${errorMessage}`);
      }
    }
  }

  private createDeploymentInfo(): void {
    const deploymentInfo = {
      deployed: new Date().toISOString(),
      version: this.manifest.version,
      targetProject: this.options.targetPath,
      filesDeployed: this.stats.successCount,
      errors: this.stats.errorCount
    };

    try {
      const deploymentInfoPath = path.join(this.options.targetPath, '.claude', '.deployment-info.json');
      writeFileSync(deploymentInfoPath, JSON.stringify(deploymentInfo, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.stats.warnings.push(`Failed to create deployment info: ${errorMessage}`);
    }
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(50));
    console.log('Deployment Summary:');
    console.log(`  Files deployed: ${this.stats.successCount}`);
    console.log(`  Errors: ${this.stats.errorCount}`);
    console.log(`  Target project: ${this.options.targetPath}`);
    console.log(`  Template version: ${this.manifest.version}`);
  }

  private printNextSteps(): void {
    if (this.stats.errorCount === 0) {
      console.log('\n🎉 Template deployed successfully!');
      console.log('\nNext steps:');
      console.log('1. Open Claude Code in your project');
      console.log('2. Type / to see available commands');
      console.log('3. Use /sparc for SPARC methodology');
      console.log('4. Use /claude-flow-* for Claude Flow features');
      console.log('\nFor help, see the documentation files in .claude/');
    } else {
      console.log('\n⚠️  Template deployed with errors. Please check the messages above.');
    }
  }

  public deploy(): DeploymentResult {
    this.printDeploymentHeader();
    
    if (!this.validateTargetProject()) {
      return {
        success: false,
        filesDeployed: 0,
        errors: ['Target project validation failed'],
        warnings: [],
        deploymentInfo: {
          deployed: new Date().toISOString(),
          version: this.manifest.version,
          targetProject: this.options.targetPath,
          filesDeployed: 0,
          errors: 1
        }
      };
    }

    this.createTargetDirectory();
    this.createDirectoryStructure();
    this.deployTemplateFiles();
    this.createDeploymentInfo();
    this.printSummary();
    this.printNextSteps();

    const result: DeploymentResult = {
      success: this.stats.errorCount === 0,
      filesDeployed: this.stats.successCount,
      errors: this.stats.errors,
      warnings: this.stats.warnings,
      deploymentInfo: {
        deployed: new Date().toISOString(),
        version: this.manifest.version,
        targetProject: this.options.targetPath,
        filesDeployed: this.stats.successCount,
        errors: this.stats.errorCount
      }
    };

    return result;
  }
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node deploy-to-project.js <target-project-path>');
    console.error('Example: node deploy-to-project.js /path/to/my-project');
    process.exit(1);
  }

  const targetPath = args[0];
  const deployer = new TemplateDeployer({ targetPath });
  const result = deployer.deploy();
  
  process.exit(result.success ? 0 : 1);
}

// Export main for external usage
export { main };

export { TemplateDeployer };
export type { DeploymentResult, DeploymentOptions };