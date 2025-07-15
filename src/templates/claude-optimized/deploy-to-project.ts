#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TemplateManifest, DeploymentInfo, TemplateValidationResult } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Deploy Claude optimized template to a target project
 * Usage: node deploy-to-project.ts <target-project-path>
 */

interface DeploymentConfig {
  targetProject: string;
  sourceDir: string;
  targetDir: string;
  manifestPath: string;
}

interface DeploymentResult {
  successCount: number;
  errorCount: number;
  deploymentInfo: DeploymentInfo;
}

function validateTargetProject(targetProject: string): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(targetProject)) {
    errors.push(`Target project directory does not exist: ${targetProject}`);
    return { valid: false, errors, warnings };
  }

  // Check if it's a valid project (has package.json or similar)
  const projectFiles = ['package.json', 'tsconfig.json', 'deno.json', 'go.mod', 'Cargo.toml', 'setup.py'];
  const hasProjectFile = projectFiles.some(file => existsSync(join(targetProject, file)));

  if (!hasProjectFile) {
    warnings.push('Target directory does not appear to be a project root (no package.json, etc.)');
  }

  return { valid: true, errors, warnings };
}

function loadManifest(manifestPath: string): TemplateManifest {
  try {
    const manifestContent = readFileSync(manifestPath, 'utf8');
    return JSON.parse(manifestContent) as TemplateManifest;
  } catch (error) {
    throw new Error(`Failed to load manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function createDirectoryStructure(targetDir: string, manifest: TemplateManifest): void {
  console.log('\nCreating directory structure...');
  
  for (const [dirName, dirInfo] of Object.entries(manifest.directories)) {
    const targetPath = join(targetDir, dirInfo.path);
    if (!existsSync(targetPath)) {
      mkdirSync(targetPath, { recursive: true });
      console.log(`  ✓ ${dirInfo.path}`);
    }
    
    // Create README for empty directories
    if (dirInfo.createEmpty) {
      const readmePath = join(targetPath, 'README.md');
      if (!existsSync(readmePath)) {
        writeFileSync(readmePath, `# ${dirName}\n\nThis directory will be populated during usage.\n`);
      }
    }
  }
}

function deployFiles(config: DeploymentConfig, manifest: TemplateManifest): DeploymentResult {
  console.log('\nDeploying template files...');
  let successCount = 0;
  let errorCount = 0;

  for (const file of manifest.files) {
    const sourcePath = join(config.sourceDir, file.destination);
    const targetPath = join(config.targetDir, file.destination);
    
    try {
      if (existsSync(sourcePath)) {
        // Ensure target directory exists
        const targetDir = dirname(targetPath);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }
        
        // Copy file
        copyFileSync(sourcePath, targetPath);
        console.log(`  ✓ ${file.destination}`);
        successCount++;
      } else {
        console.error(`  ✗ ${file.destination} - Source file not found`);
        errorCount++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`  ✗ ${file.destination} - Error: ${errorMessage}`);
      errorCount++;
    }
  }

  // Create deployment info
  const deploymentInfo: DeploymentInfo = {
    deployed: new Date().toISOString(),
    version: manifest.version,
    targetProject: config.targetProject,
    filesDeployed: successCount,
    errors: errorCount
  };

  return { successCount, errorCount, deploymentInfo };
}

function writeDeploymentInfo(targetDir: string, deploymentInfo: DeploymentInfo): void {
  writeFileSync(
    join(targetDir, '.deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

function printSummary(result: DeploymentResult, manifest: TemplateManifest): void {
  console.log('\n' + '='.repeat(50));
  console.log('Deployment Summary:');
  console.log(`  Files deployed: ${result.successCount}`);
  console.log(`  Errors: ${result.errorCount}`);
  console.log(`  Target project: ${result.deploymentInfo.targetProject}`);
  console.log(`  Template version: ${manifest.version}`);

  if (result.errorCount === 0) {
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

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node deploy-to-project.ts <target-project-path>');
    console.error('Example: node deploy-to-project.ts /path/to/my-project');
    process.exit(1);
  }

  const targetProject = args[0];
  const config: DeploymentConfig = {
    targetProject,
    sourceDir: join(__dirname, '.claude'),
    targetDir: join(targetProject, '.claude'),
    manifestPath: join(__dirname, 'manifest.json')
  };

  console.log('Claude Optimized Template Deployment');
  console.log('====================================');
  console.log(`Source: ${config.sourceDir}`);
  console.log(`Target: ${config.targetDir}`);

  // Validate target project
  const validation = validateTargetProject(targetProject);
  if (!validation.valid) {
    console.error(`Error: ${validation.errors.join(', ')}`);
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn(`Warning: ${validation.warnings.join(', ')}`);
  }

  try {
    // Load manifest
    const manifest = loadManifest(config.manifestPath);

    // Create target .claude directory
    if (!existsSync(config.targetDir)) {
      mkdirSync(config.targetDir, { recursive: true });
      console.log('✓ Created .claude directory');
    } else {
      console.log('⚠️  .claude directory already exists - files will be overwritten');
    }

    // Create directory structure
    createDirectoryStructure(config.targetDir, manifest);

    // Deploy files
    const result = deployFiles(config, manifest);

    // Write deployment info
    writeDeploymentInfo(config.targetDir, result.deploymentInfo);

    // Print summary
    printSummary(result, manifest);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Deployment failed: ${errorMessage}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateTargetProject, loadManifest, createDirectoryStructure, deployFiles };