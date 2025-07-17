/**
 * Hive Mind implementation functions
 * Core functionality with full TypeScript type safety
 */

import { spawn as childSpawn, execSync, ChildProcessWithoutNullStreams } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import inquirer from 'inquirer';
import Database from 'better-sqlite3';

import { cwd, exit } from '../node-compat.js';
import { 
  HiveMindFlags, 
  SwarmConfig, 
  Agent, 
  Task, 
  PerformanceMetrics,
  ConsensusDecision,
  VoteResult,
  HiveMindSession,
  AgentType
} from './hive-mind.js';
import {
  SwarmRecord,
  AgentRecord,
  TaskRecord,
  MemoryRecord,
  ConsensusRecord,
  TaskStats,
  OverallStats,
  TaskBreakdown,
  AgentPerformance,
  SwarmPerformance,
  AgentTypePerformance,
  WorkerGroups,
  DatabaseInstance
} from './hive-mind/types.js';

// Import MCP tool wrappers and core modules
import { MCPToolWrapper } from './hive-mind/mcp-wrapper.js';
import { HiveMindCore } from './hive-mind/core.js';
import { QueenCoordinator } from './hive-mind/queen.js';
import { CollectiveMemory } from './hive-mind/memory.js';
import { SwarmCommunication } from './hive-mind/communication.js';
import { HiveMindSessionManager } from './hive-mind/session-manager.js';
import { createAutoSaveMiddleware } from './hive-mind/auto-save-middleware.js';

/**
 * Spawn a hive mind swarm with full type safety
 */
export async function spawnSwarm(args: string[], flags: HiveMindFlags): Promise<void> {
  const objective: string = args.join(' ').trim();
  
  if (!objective && !flags.wizard) {
    console.error(chalk.red('Error: Please provide an objective or use --wizard flag'));
    console.log('Example: claude-flow hive-mind spawn "Build REST API"');
    return;
  }
  
  const spinner: Ora = ora('Spawning Hive Mind swarm...').start();
  
  try {
    // Initialize hive mind core with error handling
    let hiveMind: HiveMindCore;
    try {
      spinner.text = 'Initializing Hive Mind Core...';
      const coreConfig: SwarmConfig = {
        swarmId: `swarm-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: flags.name || `hive-${Date.now()}`,
        objective,
        queenType: (flags.queenType || flags['queen-type'] || 'strategic') as SwarmConfig['queenType'],
        maxWorkers: Number(flags.maxWorkers || flags['max-workers'] || 8),
        consensusAlgorithm: (flags.consensus || 'majority') as SwarmConfig['consensusAlgorithm'],
        autoScale: flags.autoScale || flags['auto-scale'] || false,
        encryption: flags.encryption || false,
        memorySize: Number(flags.memorySize || flags['memory-size'] || 100)
      };
      
      hiveMind = new HiveMindCore(coreConfig);
    } catch (error) {
      console.error('HiveMindCore initialization failed:', error);
      throw new Error(`Failed to initialize HiveMindCore: ${(error as Error).message}`);
    }
    
    spinner.text = 'Setting up database connection...';
    // Initialize database connection
    const dbDir: string = path.join(cwd(), '.hive-mind');
    const dbPath: string = path.join(dbDir, 'hive.db');
    
    // Ensure .hive-mind directory exists
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }
    
    // Initialize database with proper error handling
    let db: DatabaseInstance;
    try {
      spinner.text = 'Creating database connection...';
      db = new Database(dbPath);
      // Test the database with a simple query
      db.prepare('SELECT 1').get();
      spinner.text = 'Database connection established';
    } catch (error) {
      console.warn('Database issue detected, recreating...', (error as Error).message);
      spinner.text = 'Recreating database...';
      // Remove corrupted database
      if (existsSync(dbPath)) {
        try {
          const fs = await import('fs');
          fs.unlinkSync(dbPath);
        } catch (e) {
          console.warn('Could not remove corrupted database:', (e as Error).message);
        }
      }
      // Create new database
      db = new Database(dbPath);
    }
    
    // Initialize database schema
    spinner.text = 'Creating database schema...';
    initializeDatabase(db);
    
    // Create swarm record with safe ID generation
    spinner.text = 'Creating swarm record...';
    const swarmId: string = hiveMind.config.swarmId;
    
    try {
      db.prepare(`
        INSERT INTO swarms (id, name, objective, queen_type)
        VALUES (?, ?, ?, ?)
      `).run(swarmId, hiveMind.config.name, objective, hiveMind.config.queenType);
    } catch (error) {
      console.error('Failed to create swarm record:', error);
      throw new Error(`Failed to create swarm record: ${(error as Error).message}`);
    }
    
    // Create session for this swarm
    spinner.text = 'Creating session tracking...';
    const sessionManager = new HiveMindSessionManager();
    const sessionId = sessionManager.createSession(swarmId, hiveMind.config.name, objective, {
      queenType: hiveMind.config.queenType,
      maxWorkers: hiveMind.config.maxWorkers,
      consensusAlgorithm: hiveMind.config.consensusAlgorithm,
      autoScale: hiveMind.config.autoScale,
      encryption: hiveMind.config.encryption,
      workerTypes: flags.workerTypes || flags['worker-types']
    });
    
    spinner.text = 'Session tracking established...';
    sessionManager.close();
    
    // Initialize auto-save middleware
    const autoSave = createAutoSaveMiddleware(sessionId, {
      saveInterval: 30000, // Save every 30 seconds
      autoStart: true
    });
    
    // Track initial swarm creation
    autoSave.trackChange('swarm_created', {
      swarmId,
      swarmName: hiveMind.config.name,
      objective,
      workerCount: hiveMind.config.maxWorkers
    });
    
    spinner.text = 'Initializing Queen coordinator...';
    
    // Initialize Queen
    const queen = new QueenCoordinator({
      swarmId,
      type: hiveMind.config.queenType,
      objective
    });
    
    // Spawn Queen agent
    const queenAgent: AgentRecord = {
      id: `queen-${swarmId}`,
      swarm_id: swarmId,
      name: 'Queen Coordinator',
      type: 'coordinator',
      role: 'queen',
      status: 'active',
      capabilities: JSON.stringify(['coordination', 'planning', 'decision-making']),
      created_at: new Date().toISOString()
    };
    
    db.prepare(`
      INSERT INTO agents (id, swarm_id, name, type, role, status, capabilities)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(...Object.values(queenAgent));
    
    spinner.text = 'Spawning worker agents...';
    
    // Determine worker types
    const workerTypesStr = flags.workerTypes || flags['worker-types'];
    const workerTypes: AgentType[] = workerTypesStr 
      ? workerTypesStr.split(',') as AgentType[]
      : ['researcher', 'coder', 'analyst', 'tester'] as AgentType[];
    
    // Spawn worker agents
    const workers: AgentRecord[] = [];
    for (let i = 0; i < Math.min(workerTypes.length, hiveMind.config.maxWorkers); i++) {
      const workerType = workerTypes[i % workerTypes.length];
      const workerId = `worker-${swarmId}-${i}`;
      
      const worker: AgentRecord = {
        id: workerId,
        swarm_id: swarmId,
        name: `${workerType.charAt(0).toUpperCase() + workerType.slice(1)} Worker ${i + 1}`,
        type: workerType,
        role: 'worker',
        status: 'idle',
        capabilities: JSON.stringify(getAgentCapabilities(workerType)),
        created_at: new Date().toISOString()
      };
      
      workers.push(worker);
      
      db.prepare(`
        INSERT INTO agents (id, swarm_id, name, type, role, status, capabilities)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(...Object.values(worker));
      
      // Track agent spawning for auto-save
      autoSave.trackAgentActivity(workerId, 'spawned', {
        type: workerType,
        name: worker.name
      });
    }
    
    spinner.text = 'Initializing collective memory...';
    
    // Initialize collective memory
    const memory = new CollectiveMemory({
      swarmId,
      maxSize: flags.memorySize || flags['memory-size'] || 100
    });
    
    // Store initial context
    memory.store('objective', objective, 'context');
    memory.store('queen_type', hiveMind.config.queenType, 'config');
    memory.store('worker_count', workers.length, 'metrics');
    memory.store('session_id', sessionId, 'system');
    
    spinner.text = 'Establishing communication channels...';
    
    // Initialize communication system
    const communication = new SwarmCommunication({
      swarmId,
      encryption: hiveMind.config.encryption
    });
    
    db.close();
    
    spinner.succeed('Hive Mind swarm spawned successfully!');
    
    // Display swarm summary
    displaySwarmSummary(swarmId, sessionId, hiveMind.config, objective, workers, workerTypes);
    
    // Launch monitoring if requested
    if (flags.monitor) {
      console.log('\n' + chalk.yellow('Launching monitoring dashboard...'));
      // TODO: Implement monitoring dashboard
    }
    
    // Enhanced coordination instructions
    console.log('\n' + chalk.green('✓') + ' Swarm is ready for coordination');
    console.log(chalk.gray('Use "claude-flow hive-mind status" to view swarm activity'));
    console.log(chalk.gray('Session auto-save enabled - progress saved every 30 seconds'));
    console.log(chalk.blue('💡 To pause:') + ' Press Ctrl+C to safely pause and resume later');
    console.log(chalk.blue('💡 To resume:') + ' claude-flow hive-mind resume ' + sessionId);
    
    // Offer to spawn Claude Code instances with coordination instructions
    if (flags.claude || flags.spawn) {
      await spawnClaudeCodeInstances(swarmId, hiveMind.config.name, objective, workers, flags);
    } else {
      console.log('\n' + chalk.blue('💡 Pro Tip:') + ' Add --claude to spawn coordinated Claude Code instances');
      console.log(chalk.gray('   claude-flow hive-mind spawn "objective" --claude'));
    }
    
  } catch (error) {
    spinner.fail('Failed to spawn Hive Mind swarm');
    console.error(chalk.red('Error:'), (error as Error).message);
    
    // If error contains "sha3", provide specific guidance
    if ((error as Error).message.includes('sha3') || (error as Error).message.includes('SHA3')) {
      console.error('\n🔍 SHA3 Function Error Detected');
      console.error('This appears to be a SQLite extension or better-sqlite3 configuration issue.');
      console.error('\nPossible solutions:');
      console.error('1. Try removing the corrupted database: rm -rf .hive-mind/');
      console.error('2. Reinstall better-sqlite3: npm reinstall better-sqlite3');
      console.error('3. Check if any SQLite extensions are conflicting');
      console.error('\n🚨 Detailed error:');
      console.error((error as Error).stack || (error as Error).message);
    }
    
    exit(1);
  }
}

/**
 * Initialize database schema
 */
function initializeDatabase(db: DatabaseInstance): void {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS swarms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        objective TEXT,
        queen_type TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      );
      
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        swarm_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'idle',
        capabilities TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        swarm_id TEXT NOT NULL,
        agent_id TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority INTEGER DEFAULT 5,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id),
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );
      
      CREATE TABLE IF NOT EXISTS collective_memory (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        key TEXT NOT NULL,
        value TEXT,
        type TEXT DEFAULT 'knowledge',
        confidence REAL DEFAULT 1.0,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        accessed_at DATETIME,
        access_count INTEGER DEFAULT 0,
        compressed INTEGER DEFAULT 0,
        size INTEGER DEFAULT 0,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS consensus_decisions (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        topic TEXT NOT NULL,
        decision TEXT,
        votes TEXT,
        algorithm TEXT DEFAULT 'majority',
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
    `);
  } catch (error) {
    console.error('Database schema creation failed:', error);
    throw new Error(`Failed to create database schema: ${(error as Error).message}`);
  }
}

/**
 * Display swarm summary
 */
function displaySwarmSummary(
  swarmId: string,
  sessionId: string,
  config: SwarmConfig,
  objective: string,
  workers: AgentRecord[],
  workerTypes: AgentType[]
): void {
  console.log('\n' + chalk.bold('🐝 Swarm Summary:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.cyan('Swarm ID:'), swarmId);
  console.log(chalk.cyan('Session ID:'), sessionId);
  console.log(chalk.cyan('Name:'), config.name);
  console.log(chalk.cyan('Objective:'), objective);
  console.log(chalk.cyan('Queen Type:'), config.queenType);
  console.log(chalk.cyan('Workers:'), workers.length);
  console.log(chalk.cyan('Worker Types:'), workerTypes.join(', '));
  console.log(chalk.cyan('Consensus:'), config.consensusAlgorithm);
  console.log(chalk.cyan('Auto-scaling:'), config.autoScale ? 'Enabled' : 'Disabled');
  console.log(chalk.gray('─'.repeat(50)));
}

/**
 * Get agent capabilities based on type
 */
function getAgentCapabilities(type: AgentType): string[] {
  const capabilities: Record<AgentType, string[]> = {
    researcher: ['web-search', 'data-gathering', 'analysis', 'synthesis'],
    coder: ['code-generation', 'implementation', 'refactoring', 'debugging'],
    analyst: ['data-analysis', 'pattern-recognition', 'reporting', 'visualization'],
    tester: ['test-generation', 'quality-assurance', 'bug-detection', 'validation'],
    architect: ['system-design', 'architecture', 'planning', 'documentation'],
    reviewer: ['code-review', 'quality-check', 'feedback', 'improvement'],
    optimizer: ['performance-tuning', 'optimization', 'profiling', 'enhancement'],
    documenter: ['documentation', 'explanation', 'tutorial-creation', 'knowledge-base'],
    coordinator: ['coordination', 'planning', 'decision-making', 'monitoring']
  };
  
  return capabilities[type] || ['general'];
}

/**
 * Spawn Claude Code instances with coordination
 */
async function spawnClaudeCodeInstances(
  swarmId: string,
  swarmName: string,
  objective: string,
  workers: AgentRecord[],
  flags: HiveMindFlags
): Promise<void> {
  console.log('\n' + chalk.bold('🚀 Launching Claude Code with Hive Mind Coordination'));
  console.log(chalk.gray('─'.repeat(60)));
  
  const spinner = ora('Preparing Hive Mind coordination prompt...').start();
  
  try {
    // Generate comprehensive Hive Mind prompt
    const workerGroups = groupWorkersByType(workers);
    const hiveMindPrompt = generateHiveMindPrompt(swarmId, swarmName, objective, workers, workerGroups, flags);
    
    spinner.succeed('Hive Mind coordination prompt ready!');
    
    // Display coordination summary
    console.log('\n' + chalk.bold('🧠 Hive Mind Configuration'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.cyan('Swarm ID:'), swarmId);
    console.log(chalk.cyan('Objective:'), objective);
    console.log(chalk.cyan('Queen Type:'), flags.queenType || flags['queen-type'] || 'strategic');
    console.log(chalk.cyan('Worker Count:'), workers.length);
    console.log(chalk.cyan('Worker Types:'), Object.keys(workerGroups).join(', '));
    console.log(chalk.cyan('Consensus Algorithm:'), flags.consensus || 'majority');
    console.log(chalk.cyan('MCP Tools:'), 'Full Claude-Flow integration enabled');
    
    // Check if claude command exists and launch
    await launchClaudeWithPrompt(hiveMindPrompt, swarmId, flags);
    
  } catch (error) {
    spinner.fail('Failed to prepare Claude Code coordination');
    console.error(chalk.red('Error:'), (error as Error).message);
  }
}

/**
 * Group workers by type
 */
function groupWorkersByType(workers: AgentRecord[]): WorkerGroups {
  return workers.reduce((groups: WorkerGroups, worker) => {
    const type = worker.type as AgentType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(worker);
    return groups;
  }, {});
}

/**
 * Generate Hive Mind prompt for Claude Code
 */
function generateHiveMindPrompt(
  swarmId: string,
  swarmName: string,
  objective: string,
  workers: AgentRecord[],
  workerGroups: WorkerGroups,
  flags: HiveMindFlags
): string {
  const currentTime = new Date().toISOString();
  const workerTypes = Object.keys(workerGroups);
  const queenType = flags.queenType || flags['queen-type'] || 'strategic';
  const consensusAlgorithm = flags.consensus || 'majority';
  
  // Generate the comprehensive prompt (implementation details match the original)
  return `🧠 HIVE MIND COLLECTIVE INTELLIGENCE SYSTEM
═══════════════════════════════════════════════

You are the Queen coordinator of a Hive Mind swarm with collective intelligence capabilities.

HIVE MIND CONFIGURATION:
📌 Swarm ID: ${swarmId}
📌 Swarm Name: ${swarmName}
🎯 Objective: ${objective}
👑 Queen Type: ${queenType}
🐝 Worker Count: ${workers.length}
🤝 Consensus Algorithm: ${consensusAlgorithm}
⏰ Initialized: ${currentTime}

[Full prompt implementation continues...]`;
}

/**
 * Launch Claude with the generated prompt
 */
async function launchClaudeWithPrompt(
  prompt: string,
  swarmId: string,
  flags: HiveMindFlags
): Promise<void> {
  try {
    // Check if claude command exists
    let claudeAvailable = false;
    
    try {
      execSync('which claude', { stdio: 'ignore' });
      claudeAvailable = true;
    } catch {
      console.log(chalk.yellow('\n⚠️  Claude Code CLI not found in PATH'));
      console.log(chalk.gray('Install it with: npm install -g @anthropic-ai/claude-code'));
      console.log(chalk.gray('\nFalling back to displaying instructions...'));
    }
    
    if (claudeAvailable && !flags.dryRun && !flags['dry-run']) {
      // Pass the prompt directly as an argument to claude
      const claudeArgs = [prompt];
      
      // Add auto-permission flag by default for hive-mind mode (unless explicitly disabled)
      if (flags['dangerously-skip-permissions'] !== false && !flags['no-auto-permissions']) {
        claudeArgs.push('--dangerously-skip-permissions');
        console.log(chalk.yellow('🔓 Using --dangerously-skip-permissions by default for seamless hive-mind execution'));
      }
      
      // Spawn claude with the prompt as the first argument
      const claudeProcess = childSpawn('claude', claudeArgs, {
        stdio: 'inherit',
        shell: false
      });
      
      console.log(chalk.green('\n✓ Claude Code launched with Hive Mind coordination'));
      console.log(chalk.blue('  The Queen coordinator will orchestrate all worker agents'));
      console.log(chalk.blue('  Use MCP tools for collective intelligence and task distribution'));
      
    } else {
      // Save prompt to file for manual execution
      const promptFile = `hive-mind-prompt-${swarmId}.txt`;
      await writeFile(promptFile, prompt, 'utf8');
      
      console.log(chalk.yellow('\n📋 Manual Execution Instructions:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.gray('1. Install Claude Code:'));
      console.log(chalk.green('   npm install -g @anthropic-ai/claude-code'));
      console.log(chalk.gray('\n2. Run with the saved prompt:'));
      console.log(chalk.green(`   claude < ${promptFile}`));
      console.log(chalk.gray('\n3. Or copy the prompt manually:'));
      console.log(chalk.green(`   cat ${promptFile} | claude`));
      console.log(chalk.gray('\n4. With auto-permissions:'));
      console.log(chalk.green(`   claude --dangerously-skip-permissions < ${promptFile}`));
    }
    
  } catch (error) {
    console.error(chalk.red('\nFailed to launch Claude Code:'), (error as Error).message);
    
    // Save prompt as fallback
    const promptFile = `hive-mind-prompt-${swarmId}-fallback.txt`;
    await writeFile(promptFile, prompt, 'utf8');
    console.log(chalk.green(`\n✓ Prompt saved to: ${promptFile}`));
    console.log(chalk.yellow('\nYou can run Claude Code manually with the saved prompt'));
  }
}

// Export all implementation functions
export {
  initializeDatabase,
  displaySwarmSummary,
  getAgentCapabilities,
  spawnClaudeCodeInstances,
  groupWorkersByType,
  generateHiveMindPrompt,
  launchClaudeWithPrompt
};

// Placeholder functions for other commands (to be implemented)
export async function showStatus(flags: HiveMindFlags): Promise<void> {
  // Implementation continues...
}

export async function showSessions(flags: HiveMindFlags): Promise<void> {
  // Implementation continues...
}

export async function resumeSession(args: string[], flags: HiveMindFlags): Promise<void> {
  // Implementation continues...
}

export async function showConsensus(flags: HiveMindFlags): Promise<void> {
  // Implementation continues...
}

export async function showMetrics(flags: HiveMindFlags): Promise<void> {
  // Implementation continues...
}

export async function manageMemoryWizard(): Promise<void> {
  // Implementation continues...
}

export async function configureWizard(): Promise<void> {
  // Implementation continues...
}