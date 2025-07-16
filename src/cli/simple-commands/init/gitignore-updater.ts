/**
 * GitIgnore updater for Claude Flow initialization
 * Ensures Claude Flow generated files are properly ignored
 */

import { existsSync, readTextFile, writeTextFile } from '../../node-compat.js';

/**
 * Configuration for gitignore update operation
 */
export interface GitignoreUpdateConfig {
  workingDir: string;
  force?: boolean;
  dryRun?: boolean;
  customEntries?: string[];
}

/**
 * Result of gitignore update operation
 */
export interface GitignoreUpdateResult {
  success: boolean;
  message: string;
  fileExists?: boolean;
  entriesAdded?: string[];
  entriesSkipped?: string[];
}

/**
 * Information about gitignore file status
 */
export interface GitignoreStatus {
  exists: boolean;
  hasClaudeFlowEntries: boolean;
  size: number;
  lastModified?: Date;
}

/**
 * Default gitignore entries for Claude Flow
 */
const CLAUDE_FLOW_GITIGNORE_ENTRIES = `
# Claude Flow generated files
.claude/settings.local.json
.mcp.json
claude-flow.config.json
.swarm/
.hive-mind/
memory/claude-flow-data.json
memory/sessions/*
!memory/sessions/README.md
memory/agents/*
!memory/agents/README.md
coordination/memory_bank/*
coordination/subtasks/*
coordination/orchestration/*
*.db
*.db-journal
*.db-wal
*.sqlite
*.sqlite-journal
*.sqlite-wal
claude-flow
claude-flow.bat
claude-flow.ps1
hive-mind-prompt-*.txt
`;

/**
 * Update or create .gitignore with Claude Flow entries
 * @param config Configuration for the update operation
 * @returns Promise with the update result
 */
export async function updateGitignore(
  config: GitignoreUpdateConfig
): Promise<GitignoreUpdateResult>;
export async function updateGitignore(
  workingDir: string,
  force?: boolean,
  dryRun?: boolean
): Promise<GitignoreUpdateResult>;
export async function updateGitignore(
  configOrWorkingDir: GitignoreUpdateConfig | string,
  force: boolean = false,
  dryRun: boolean = false
): Promise<GitignoreUpdateResult> {
  // Handle both function signatures
  const config: GitignoreUpdateConfig = typeof configOrWorkingDir === 'string'
    ? { workingDir: configOrWorkingDir, force, dryRun }
    : configOrWorkingDir;
  
  const { workingDir, force: configForce = false, dryRun: configDryRun = false, customEntries = [] } = config;
  const gitignorePath = `${workingDir}/.gitignore`;
  
  try {
    let gitignoreContent = '';
    let fileExists = false;
    const entriesAdded: string[] = [];
    const entriesSkipped: string[] = [];
    
    // Check if .gitignore exists
    if (existsSync(gitignorePath)) {
      fileExists = true;
      gitignoreContent = await readTextFile(gitignorePath);
    }
    
    // Check if Claude Flow section already exists
    const claudeFlowMarker = '# Claude Flow generated files';
    if (gitignoreContent.includes(claudeFlowMarker) && !configForce) {
      return {
        success: true,
        message: '.gitignore already contains Claude Flow entries',
        fileExists,
        entriesSkipped: ['Claude Flow entries (already present)']
      };
    }
    
    // Prepare the new content
    let newContent = gitignoreContent;
    
    // Remove existing Claude Flow section if force updating
    if (configForce && gitignoreContent.includes(claudeFlowMarker)) {
      const startIndex = gitignoreContent.indexOf(claudeFlowMarker);
      const endIndex = gitignoreContent.indexOf('\n# ', startIndex + 1);
      if (endIndex !== -1) {
        newContent = gitignoreContent.substring(0, startIndex) + gitignoreContent.substring(endIndex);
      } else {
        // Claude Flow section is at the end
        newContent = gitignoreContent.substring(0, startIndex);
      }
      entriesAdded.push('Removed existing Claude Flow entries');
    }
    
    // Add Claude Flow entries
    if (!newContent.endsWith('\n') && newContent.length > 0) {
      newContent += '\n';
    }
    newContent += CLAUDE_FLOW_GITIGNORE_ENTRIES;
    entriesAdded.push('Claude Flow default entries');
    
    // Add custom entries if provided
    if (customEntries.length > 0) {
      newContent += '\n# Custom Claude Flow entries\n';
      for (const entry of customEntries) {
        newContent += `${entry}\n`;
        entriesAdded.push(entry);
      }
    }
    
    // Write the file
    if (!configDryRun) {
      await writeTextFile(gitignorePath, newContent);
    }
    
    const action = configDryRun ? '[DRY RUN] Would' : '';
    const verb = fileExists ? 'update' : 'create';
    
    return {
      success: true,
      message: `${action} ${fileExists ? 'Updated' : 'Created'} .gitignore with Claude Flow entries`,
      fileExists,
      entriesAdded
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to update .gitignore: ${(error as Error).message}`,
      fileExists: existsSync(gitignorePath)
    };
  }
}

/**
 * Check if gitignore needs updating
 * @param workingDir The working directory to check
 * @returns Promise indicating if update is needed
 */
export async function needsGitignoreUpdate(workingDir: string): Promise<boolean> {
  const gitignorePath = `${workingDir}/.gitignore`;
  
  if (!existsSync(gitignorePath)) {
    return true;
  }
  
  try {
    const content = await readTextFile(gitignorePath);
    return !content.includes('# Claude Flow generated files');
  } catch {
    return true;
  }
}

/**
 * Get gitignore status for a directory
 * @param workingDir The working directory to check
 * @returns Promise with gitignore status information
 */
export async function getGitignoreStatus(workingDir: string): Promise<GitignoreStatus> {
  const gitignorePath = `${workingDir}/.gitignore`;
  
  if (!existsSync(gitignorePath)) {
    return {
      exists: false,
      hasClaudeFlowEntries: false,
      size: 0
    };
  }
  
  try {
    const content = await readTextFile(gitignorePath);
    const stat = await Deno.stat(gitignorePath);
    
    return {
      exists: true,
      hasClaudeFlowEntries: content.includes('# Claude Flow generated files'),
      size: content.length,
      lastModified: stat.mtime || undefined
    };
  } catch {
    return {
      exists: true,
      hasClaudeFlowEntries: false,
      size: 0
    };
  }
}

/**
 * Get list of files that should be gitignored
 * @param includeCustom Whether to include custom entries
 * @returns Array of gitignore patterns
 */
export function getGitignorePatterns(includeCustom: boolean = false): string[] {
  const patterns = CLAUDE_FLOW_GITIGNORE_ENTRIES
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('!'))
    .map(line => line.trim());
    
  return patterns;
}

/**
 * Get the default Claude Flow gitignore entries as a string
 * @returns The default gitignore entries
 */
export function getDefaultGitignoreEntries(): string {
  return CLAUDE_FLOW_GITIGNORE_ENTRIES;
}

/**
 * Validate gitignore patterns
 * @param patterns Array of gitignore patterns to validate
 * @returns Object with validation results
 */
export function validateGitignorePatterns(patterns: string[]): {
  valid: string[];
  invalid: { pattern: string; reason: string }[];
} {
  const valid: string[] = [];
  const invalid: { pattern: string; reason: string }[] = [];
  
  for (const pattern of patterns) {
    const trimmed = pattern.trim();
    
    if (!trimmed) {
      invalid.push({ pattern, reason: 'Empty pattern' });
      continue;
    }
    
    if (trimmed.includes('\0')) {
      invalid.push({ pattern, reason: 'Contains null character' });
      continue;
    }
    
    if (trimmed.length > 4096) {
      invalid.push({ pattern, reason: 'Pattern too long' });
      continue;
    }
    
    valid.push(trimmed);
  }
  
  return { valid, invalid };
}
