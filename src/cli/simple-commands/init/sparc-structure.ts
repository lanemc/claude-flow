// sparc-structure.ts - Create SPARC development structure with TypeScript types

import { createBasicRoomodesConfig } from './sparc/roomodes-config.js';
import { createBasicSparcWorkflow } from './sparc/workflows.js';
import { createRooReadme } from './sparc/roo-readme.js';
import { createClaudeSlashCommands } from './claude-commands/slash-commands.js';
import { Deno, cwd } from '../../node-compat.js';
import * as process from 'process';

/**
 * Configuration for SPARC structure creation
 */
export interface SparcStructureConfig {
  workingDir: string;
  createRooDirectory: boolean;
  createSlashCommands: boolean;
  preserveExistingRoomodes: boolean;
}

/**
 * Result of SPARC structure creation operation
 */
export interface SparcStructureResult {
  success: boolean;
  message: string;
  createdPaths?: string[];
  errors?: string[];
}

/**
 * Directory information for SPARC structure
 */
export interface SparcDirectoryInfo {
  path: string;
  created: boolean;
  exists: boolean;
}

// Helper function to create SPARC structure manually
export async function createSparcStructureManually(
  config?: Partial<SparcStructureConfig>
): Promise<SparcStructureResult> {
  const defaultConfig: SparcStructureConfig = {
    workingDir: process.env.PWD || cwd(),
    createRooDirectory: true,
    createSlashCommands: true,
    preserveExistingRoomodes: true,
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  const createdPaths: string[] = [];
  const errors: string[] = [];
  
  try {
    // Create .roo directory structure in working directory (legacy support)
    const rooDirectories = [
      `${finalConfig.workingDir}/.roo`,
      `${finalConfig.workingDir}/.roo/templates`,
      `${finalConfig.workingDir}/.roo/workflows`,
      `${finalConfig.workingDir}/.roo/modes`,
      `${finalConfig.workingDir}/.roo/configs`
    ];
    
    if (finalConfig.createRooDirectory) {
      for (const dir of rooDirectories) {
        try {
          await Deno.mkdir(dir, { recursive: true });
          console.log(`  ✓ Created ${dir}/`);
          createdPaths.push(dir);
        } catch (err) {
          if (!(err instanceof Deno.errors.AlreadyExists)) {
            const errorMsg = `Failed to create directory ${dir}: ${err.message}`;
            errors.push(errorMsg);
            console.error(`  ❌ ${errorMsg}`);
          }
        }
      }
    }
    
    // Create .roomodes file (copy from existing if available, or create basic version)
    let roomodesContent: string;
    const roomodesPath = `${finalConfig.workingDir}/.roomodes`;
    
    try {
      if (finalConfig.preserveExistingRoomodes) {
        // Check if .roomodes already exists and read it
        roomodesContent = await Deno.readTextFile(roomodesPath);
        console.log('  ✓ Using existing .roomodes configuration');
      } else {
        throw new Error('Creating new roomodes configuration');
      }
    } catch {
      // Create basic .roomodes configuration
      roomodesContent = createBasicRoomodesConfig();
      await Deno.writeTextFile(roomodesPath, roomodesContent);
      console.log('  ✓ Created .roomodes configuration');
      createdPaths.push(roomodesPath);
    }
    
    // Create basic workflow templates
    const basicWorkflow = createBasicSparcWorkflow();
    const workflowPath = `${finalConfig.workingDir}/.roo/workflows/basic-tdd.json`;
    await Deno.writeTextFile(workflowPath, basicWorkflow);
    console.log('  ✓ Created .roo/workflows/basic-tdd.json');
    createdPaths.push(workflowPath);
    
    // Create README for .roo directory
    const rooReadme = createRooReadme();
    const readmePath = `${finalConfig.workingDir}/.roo/README.md`;
    await Deno.writeTextFile(readmePath, rooReadme);
    console.log('  ✓ Created .roo/README.md');
    createdPaths.push(readmePath);
    
    // Create Claude Code slash commands for SPARC modes
    if (finalConfig.createSlashCommands) {
      await createClaudeSlashCommands(finalConfig.workingDir);
    }
    
    console.log('  ✅ Basic SPARC structure created successfully');
    
    return {
      success: true,
      message: 'SPARC structure created successfully',
      createdPaths,
      errors: errors.length > 0 ? errors : undefined
    };
    
  } catch (err) {
    const errorMessage = `Failed to create SPARC structure: ${err.message}`;
    console.log(`  ❌ ${errorMessage}`);
    
    return {
      success: false,
      message: errorMessage,
      createdPaths: createdPaths.length > 0 ? createdPaths : undefined,
      errors: [...errors, err.message]
    };
  }
}

/**
 * Check if SPARC structure exists in the given directory
 * @param workingDir The directory to check
 * @returns Promise with directory information
 */
export async function checkSparcStructure(
  workingDir: string = process.env.PWD || cwd()
): Promise<SparcDirectoryInfo[]> {
  const paths = [
    `${workingDir}/.roo`,
    `${workingDir}/.roo/templates`,
    `${workingDir}/.roo/workflows`,
    `${workingDir}/.roo/modes`,
    `${workingDir}/.roo/configs`,
    `${workingDir}/.roomodes`
  ];
  
  const results: SparcDirectoryInfo[] = [];
  
  for (const path of paths) {
    try {
      const stat = await Deno.stat(path);
      results.push({
        path,
        created: false, // This indicates if it was just created, not if it exists
        exists: true
      });
    } catch {
      results.push({
        path,
        created: false,
        exists: false
      });
    }
  }
  
  return results;
}

/**
 * Clean up SPARC structure (for testing or removal)
 * @param workingDir The directory to clean
 * @param force Force removal even if files exist
 * @returns Promise with cleanup result
 */
export async function cleanupSparcStructure(
  workingDir: string = process.env.PWD || cwd(),
  force: boolean = false
): Promise<SparcStructureResult> {
  const paths = [
    `${workingDir}/.roo`,
    `${workingDir}/.roomodes`
  ];
  
  const removedPaths: string[] = [];
  const errors: string[] = [];
  
  for (const path of paths) {
    try {
      await Deno.remove(path, { recursive: true });
      removedPaths.push(path);
      console.log(`  ✓ Removed ${path}`);
    } catch (err) {
      if (force || !(err instanceof Deno.errors.NotFound)) {
        const errorMsg = `Failed to remove ${path}: ${err.message}`;
        errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}`);
      }
    }
  }
  
  return {
    success: errors.length === 0,
    message: errors.length === 0 
      ? 'SPARC structure cleaned up successfully'
      : 'SPARC structure cleanup completed with errors',
    createdPaths: removedPaths,
    errors: errors.length > 0 ? errors : undefined
  };
}
