/**
 * Hive Mind command for Claude-Flow v2.0.0
 * Advanced swarm intelligence with collective decision-making
 * TypeScript implementation with full type safety
 */

import { spawn, ChildProcessWithoutNullStreams, execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import readline from 'readline';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { args, cwd, exit, writeTextFile, readTextFile, mkdirAsync } from '../node-compat.js';
import { isInteractive, isRawModeSupported, warnNonInteractive, checkNonInteractiveAuth } from '../utils/interactive-detector.js';
import { safeInteractive, nonInteractiveProgress, nonInteractiveSelect } from '../utils/safe-interactive.js';

// Import SQLite for persistence
import Database from 'better-sqlite3';

// Import MCP tool wrappers
import { MCPToolWrapper } from './hive-mind/mcp-wrapper.js';
import { HiveMindCore } from './hive-mind/core.js';
import { QueenCoordinator } from './hive-mind/queen.js';
import { CollectiveMemory } from './hive-mind/memory.js';
import { SwarmCommunication } from './hive-mind/communication.js';
import { HiveMindSessionManager } from './hive-mind/session-manager.js';
import { createAutoSaveMiddleware } from './hive-mind/auto-save-middleware.js';

// TypeScript Interfaces for Hive Mind

/**
 * Agent communication protocol interfaces
 */
export interface AgentMessage {
  id: string;
  swarmId: string;
  agentId: string;
  type: 'task' | 'status' | 'result' | 'consensus' | 'memory' | 'heartbeat';
  payload: any;
  timestamp: number;
  encrypted?: boolean;
}

export interface AgentCommunicationProtocol {
  sendMessage(message: AgentMessage): Promise<void>;
  receiveMessage(handler: (message: AgentMessage) => void): void;
  broadcast(message: Omit<AgentMessage, 'agentId'>): Promise<void>;
  subscribe(topic: string, handler: (message: AgentMessage) => void): void;
  unsubscribe(topic: string): void;
}

/**
 * Swarm coordination interfaces
 */
export interface SwarmConfig {
  swarmId: string;
  name: string;
  objective: string;
  queenType: 'strategic' | 'tactical' | 'adaptive';
  maxWorkers: number;
  consensusAlgorithm: 'majority' | 'weighted' | 'byzantine' | 'unanimous' | 'quorum';
  autoScale: boolean;
  encryption: boolean;
  memorySize: number;
}

export interface SwarmStatus {
  swarmId: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  activeAgents: number;
  totalAgents: number;
  tasksCompleted: number;
  tasksPending: number;
  tasksInProgress: number;
  memoryUsage: number;
  consensusDecisions: number;
  lastUpdate: string;
}

/**
 * Agent type definitions
 */
export type AgentType = 'researcher' | 'coder' | 'analyst' | 'tester' | 'architect' | 'reviewer' | 'optimizer' | 'documenter' | 'coordinator';
export type AgentRole = 'queen' | 'worker';
export type AgentStatus = 'idle' | 'active' | 'busy' | 'failed' | 'terminated';

export interface Agent {
  id: string;
  swarmId: string;
  name: string;
  type: AgentType;
  role: AgentRole;
  status: AgentStatus;
  capabilities: string[];
  created_at: string;
}

export interface WorkerAgent extends Agent {
  role: 'worker';
  taskQueue: Task[];
  currentTask?: Task;
  performanceMetrics: PerformanceMetrics;
}

export interface QueenAgent extends Agent {
  role: 'queen';
  coordinationType: 'strategic' | 'tactical' | 'adaptive';
  swarmManagement: SwarmManagementCapabilities;
}

/**
 * Task management interfaces
 */
export interface Task {
  id: string;
  swarmId: string;
  agentId?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  result?: any;
  created_at: string;
  completed_at?: string;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface TaskDistributionStrategy {
  distribute(tasks: Task[], agents: Agent[]): Map<string, Task[]>;
  rebalance(currentDistribution: Map<string, Task[]>, agents: Agent[]): Map<string, Task[]>;
  getPriority(task: Task, agent: Agent): number;
}

/**
 * Performance metrics and optimization interfaces
 */
export interface PerformanceMetrics {
  tasksCompleted: number;
  averageCompletionTime: number;
  successRate: number;
  resourceUtilization: number;
  communicationOverhead: number;
  lastUpdated: string;
}

export interface SwarmOptimization {
  analyzePerformance(metrics: PerformanceMetrics[]): OptimizationRecommendations;
  optimizeTopology(currentTopology: SwarmTopology): SwarmTopology;
  balanceWorkload(agents: Agent[], tasks: Task[]): WorkloadDistribution;
}

export interface OptimizationRecommendations {
  topologyChanges?: SwarmTopology;
  agentScaling?: { add: number; remove: string[] };
  taskReallocation?: Map<string, Task[]>;
  performanceImprovements?: string[];
}

export interface WorkloadDistribution {
  agentWorkloads: Map<string, number>;
  recommendedRebalancing?: Map<string, Task[]>;
  efficiency: number;
}

/**
 * Thread management and parallel processing
 */
export interface ThreadPool {
  maxThreads: number;
  activeThreads: number;
  queuedTasks: number;
  execute<T>(task: () => Promise<T>): Promise<T>;
  executeMany<T>(tasks: (() => Promise<T>)[]): Promise<T[]>;
  shutdown(): Promise<void>;
}

export interface ParallelExecutionConfig {
  maxConcurrency: number;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  errorHandling?: 'fail-fast' | 'continue-on-error';
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

/**
 * Collective memory interfaces
 */
export interface MemoryEntry {
  id: string;
  swarmId: string;
  key: string;
  value: any;
  type: 'knowledge' | 'decision' | 'pattern' | 'learning' | 'coordination' | 'performance' | 'configuration' | 'general';
  confidence: number;
  created_by: string;
  created_at: string;
  accessed_at?: string;
  access_count: number;
  compressed: boolean;
  size: number;
}

export interface CollectiveMemoryStore {
  store(key: string, value: any, type: MemoryEntry['type'], confidence?: number): Promise<void>;
  retrieve(key: string): Promise<MemoryEntry | null>;
  search(pattern: string): Promise<MemoryEntry[]>;
  update(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  getStats(): Promise<MemoryStats>;
}

export interface MemoryStats {
  totalEntries: number;
  totalSize: number;
  categoryCounts: Record<string, number>;
  oldestEntry?: string;
  newestEntry?: string;
  compressionRatio: number;
}

/**
 * Consensus decision interfaces
 */
export interface ConsensusDecision {
  id: string;
  swarmId: string;
  topic: string;
  decision: string;
  votes: VoteResult;
  algorithm: SwarmConfig['consensusAlgorithm'];
  confidence: number;
  created_at: string;
}

export interface VoteResult {
  for: number;
  against: number;
  abstain: number;
  details: VoteDetail[];
}

export interface VoteDetail {
  agentId: string;
  vote: 'for' | 'against' | 'abstain';
  reason?: string;
  weight?: number;
}

export interface ConsensusEngine {
  propose(topic: string, options: string[]): Promise<string>;
  vote(agentId: string, topic: string, choice: string, reason?: string): Promise<void>;
  getDecision(topic: string): Promise<ConsensusDecision | null>;
  getVoteStatus(topic: string): Promise<VoteResult>;
}

/**
 * Swarm topology and management
 */
export type SwarmTopology = 'mesh' | 'hierarchical' | 'ring' | 'star' | 'hybrid';

export interface SwarmManagementCapabilities {
  spawnAgent(type: AgentType): Promise<Agent>;
  terminateAgent(agentId: string): Promise<void>;
  reassignTask(taskId: string, newAgentId: string): Promise<void>;
  updateTopology(newTopology: SwarmTopology): Promise<void>;
  scaleSwarm(targetSize: number): Promise<void>;
}

/**
 * Session management interfaces
 */
export interface HiveMindSession {
  id: string;
  swarmId: string;
  swarm_name: string;
  objective: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  paused_at?: string;
  completion_percentage: number;
  agent_count: number;
  task_count: number;
  completed_tasks: number;
  checkpoint_data?: any;
  agents: Agent[];
  tasks: Task[];
  statistics: SessionStatistics;
  recentLogs: LogEntry[];
}

export interface SessionStatistics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionPercentage: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  agentId?: string;
  metadata?: any;
}

/**
 * MCP integration interfaces
 */
export interface MCPIntegration {
  enabled: boolean;
  parallel: boolean;
  timeout: number;
  tools: string[];
}

export interface MCPToolCall {
  tool: string;
  parameters: Record<string, any>;
  timeout?: number;
}

export interface MCPToolResult {
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
}

/**
 * Command flags interface
 */
export interface HiveMindFlags {
  wizard?: boolean;
  name?: string;
  queenType?: SwarmConfig['queenType'];
  'queen-type'?: SwarmConfig['queenType'];
  maxWorkers?: number;
  'max-workers'?: number;
  consensus?: SwarmConfig['consensusAlgorithm'];
  memorySize?: number;
  'memory-size'?: number;
  autoScale?: boolean;
  'auto-scale'?: boolean;
  encryption?: boolean;
  monitor?: boolean;
  verbose?: boolean;
  claude?: boolean;
  spawn?: boolean;
  'auto-spawn'?: boolean;
  execute?: boolean;
  auto?: boolean;
  'no-auto-permissions'?: boolean;
  'dangerously-skip-permissions'?: boolean;
  dryRun?: boolean;
  'dry-run'?: boolean;
  workerTypes?: string;
  'worker-types'?: string;
  nonInteractive?: boolean;
  objective?: string;
}

// Function to show help
function showHiveMindHelp(): void {
  console.log(`
${chalk.yellow('🧠 Claude Flow Hive Mind System')}

${chalk.bold('USAGE:')}
  claude-flow hive-mind [subcommand] [options]

${chalk.bold('SUBCOMMANDS:')}
  ${chalk.green('init')}         Initialize hive mind system
  ${chalk.green('spawn')}        Spawn hive mind swarm for a task
  ${chalk.green('status')}       Show hive mind status
  ${chalk.green('resume')}       Resume a paused hive mind session
  ${chalk.green('sessions')}     List all hive mind sessions
  ${chalk.green('consensus')}    View consensus decisions
  ${chalk.green('memory')}       Manage collective memory
  ${chalk.green('metrics')}      View performance metrics
  ${chalk.green('wizard')}       Interactive hive mind wizard

${chalk.bold('EXAMPLES:')}
  ${chalk.gray('# Initialize hive mind')}
  claude-flow hive-mind init

  ${chalk.gray('# Spawn swarm with interactive wizard')}
  claude-flow hive-mind spawn

  ${chalk.gray('# Quick spawn with objective')}
  claude-flow hive-mind spawn "Build microservices architecture"

  ${chalk.gray('# View current status')}
  claude-flow hive-mind status

  ${chalk.gray('# Interactive wizard')}
  claude-flow hive-mind wizard

  ${chalk.gray('# Spawn with Claude Code coordination')}
  claude-flow hive-mind spawn "Build REST API" --claude

  ${chalk.gray('# Auto-spawn coordinated Claude Code instances')}
  claude-flow hive-mind spawn "Research AI trends" --auto-spawn --verbose

  ${chalk.gray('# List all sessions')}
  claude-flow hive-mind sessions

  ${chalk.gray('# Resume a paused session')}
  claude-flow hive-mind resume session-1234567890-abc123

${chalk.bold('KEY FEATURES:')}
  ${chalk.cyan('🐝')} Queen-led coordination with worker specialization
  ${chalk.cyan('🧠')} Collective memory and knowledge sharing
  ${chalk.cyan('🤝')} Consensus building for critical decisions
  ${chalk.cyan('⚡')} Parallel task execution with auto-scaling
  ${chalk.cyan('🔄')} Work stealing and load balancing
  ${chalk.cyan('📊')} Real-time metrics and performance tracking
  ${chalk.cyan('🛡️')} Fault tolerance and self-healing
  ${chalk.cyan('🔒')} Secure communication between agents

${chalk.bold('OPTIONS:')}
  --queen-type <type>    Queen coordinator type (strategic, tactical, adaptive)
  --max-workers <n>      Maximum worker agents (default: 8)
  --consensus <type>     Consensus algorithm (majority, weighted, byzantine)
  --memory-size <mb>     Collective memory size in MB (default: 100)
  --auto-scale           Enable auto-scaling based on workload
  --encryption           Enable encrypted communication
  --monitor              Real-time monitoring dashboard
  --verbose              Detailed logging
  --claude               Generate Claude Code spawn commands with coordination
  --spawn                Alias for --claude
  --auto-spawn           Automatically spawn Claude Code instances
  --execute              Execute Claude Code spawn commands immediately
  --auto                 (Deprecated: auto-permissions enabled by default)
  --no-auto-permissions  Disable automatic --dangerously-skip-permissions

${chalk.bold('For more information:')}
${chalk.blue('https://github.com/ruvnet/claude-flow/tree/main/docs/hive-mind')}
`);
}

// Continue with the rest of the implementation...
// (This is a large file, so I'll implement the key functions with proper TypeScript types)

/**
 * Initialize hive mind system
 */
async function initHiveMind(flags: HiveMindFlags): Promise<void> {
  const spinner: Ora = ora('Initializing Hive Mind system...').start();
  
  try {
    // Create hive mind directory structure
    const hiveMindDir: string = path.join(cwd(), '.hive-mind');
    if (!existsSync(hiveMindDir)) {
      mkdirSync(hiveMindDir, { recursive: true });
    }
    
    // Initialize SQLite database
    const dbPath: string = path.join(hiveMindDir, 'hive.db');
    const db: Database.Database = new Database(dbPath);
    
    // Create tables with proper schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS swarms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        objective TEXT,
        status TEXT DEFAULT 'active',
        queen_type TEXT DEFAULT 'strategic',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        role TEXT,
        status TEXT DEFAULT 'idle',
        capabilities TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (swarm_id) REFERENCES swarms(id)
      );
      
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
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
    
    db.close();
    
    // Create configuration file
    interface HiveMindConfig {
      version: string;
      initialized: string;
      defaults: {
        queenType: SwarmConfig['queenType'];
        maxWorkers: number;
        consensusAlgorithm: SwarmConfig['consensusAlgorithm'];
        memorySize: number;
        autoScale: boolean;
        encryption: boolean;
      };
      mcpTools: MCPIntegration;
    }
    
    const config: HiveMindConfig = {
      version: '2.0.0',
      initialized: new Date().toISOString(),
      defaults: {
        queenType: 'strategic',
        maxWorkers: 8,
        consensusAlgorithm: 'majority',
        memorySize: 100,
        autoScale: true,
        encryption: false
      },
      mcpTools: {
        enabled: true,
        parallel: true,
        timeout: 60000,
        tools: []
      }
    };
    
    await writeFile(
      path.join(hiveMindDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );
    
    spinner.succeed('Hive Mind system initialized successfully!');
    
    console.log('\n' + chalk.green('✓') + ' Created .hive-mind directory');
    console.log(chalk.green('✓') + ' Initialized SQLite database');
    console.log(chalk.green('✓') + ' Created configuration file');
    console.log('\n' + chalk.yellow('Next steps:'));
    console.log('  1. Run ' + chalk.cyan('claude-flow hive-mind spawn') + ' to create your first swarm');
    console.log('  2. Use ' + chalk.cyan('claude-flow hive-mind wizard') + ' for interactive setup');
    
  } catch (error) {
    spinner.fail('Failed to initialize Hive Mind system');
    console.error(chalk.red('Error:'), (error as Error).message);
    exit(1);
  }
}

// Import implementation functions
import {
  spawnSwarm,
  showStatus,
  showSessions,
  resumeSession,
  showConsensus,
  showMetrics,
  manageMemoryWizard,
  configureWizard
} from './hive-mind-implementation';

// Export main functions and types
export {
  showHiveMindHelp,
  initHiveMind,
  spawnSwarm,
  showStatus,
  showSessions,
  resumeSession,
  showConsensus,
  showMetrics,
  manageMemoryWizard,
  configureWizard,
  hiveMindWizard,
  hiveMindCommand
};

// Export as default for convenience
export default hiveMindCommand;

// Re-export all types
export * from './hive-mind/types';

// Interactive wizard wrapped with safe interactive handler
const hiveMindWizard = safeInteractive(
  // Interactive version
  async function(flags: HiveMindFlags = {}): Promise<void> {
    console.log(chalk.yellow('\n🧙 Hive Mind Interactive Wizard\n'));
    
    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🐝 Create new swarm', value: 'spawn' },
          { name: '📊 View swarm status', value: 'status' },
          { name: '🧠 Manage collective memory', value: 'memory' },
          { name: '🤝 View consensus decisions', value: 'consensus' },
          { name: '📈 Performance metrics', value: 'metrics' },
          { name: '🔧 Configure hive mind', value: 'config' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);
    
    switch (action) {
      case 'spawn':
        await spawnSwarmWizard();
        break;
      case 'status':
        await showStatus({});
        break;
      case 'memory':
        await manageMemoryWizard();
        break;
      case 'consensus':
        await showConsensus({});
        break;
      case 'metrics':
        await showMetrics({});
        break;
      case 'config':
        await configureWizard();
        break;
      case 'exit':
        console.log(chalk.gray('Exiting wizard...'));
        break;
    }
  },
  // Non-interactive fallback
  async function(flags: HiveMindFlags = {}): Promise<void> {
    console.log(chalk.yellow('\n🧙 Hive Mind - Non-Interactive Mode\n'));
    
    const objective = flags.objective || 'General task coordination';
    const config = {
      name: flags.name || `swarm-${Date.now()}`,
      queenType: flags.queenType || flags['queen-type'] || 'strategic',
      maxWorkers: parseInt(String(flags.maxWorkers || flags['max-workers'] || '8')),
      consensusAlgorithm: flags.consensus || 'majority',
      autoScale: flags.autoScale || flags['auto-scale'] || false,
      encryption: flags.encryption || false
    };
    
    await spawnSwarm([objective], {
      ...flags,
      name: config.name,
      queenType: config.queenType as SwarmConfig['queenType'],
      maxWorkers: config.maxWorkers,
      consensus: config.consensusAlgorithm as SwarmConfig['consensusAlgorithm'],
      autoScale: config.autoScale,
      encryption: config.encryption,
      nonInteractive: true
    });
  }
);

/**
 * Spawn swarm wizard
 */
async function spawnSwarmWizard(): Promise<void> {
  interface SpawnAnswers {
    objective: string;
    name: string;
    queenType: SwarmConfig['queenType'];
    maxWorkers: number;
    workerTypes: AgentType[];
    consensusAlgorithm: SwarmConfig['consensusAlgorithm'];
    autoScale: boolean;
    monitor: boolean;
  }
  
  const answers = await inquirer.prompt<SpawnAnswers>([
    {
      type: 'input',
      name: 'objective',
      message: 'What is the swarm objective?',
      validate: (input: string) => input.trim().length > 0 || 'Please enter an objective'
    },
    {
      type: 'input',
      name: 'name',
      message: 'Swarm name (optional):',
      default: () => `swarm-${Date.now()}`
    },
    {
      type: 'list',
      name: 'queenType',
      message: 'Select queen coordinator type:',
      choices: [
        { name: 'Strategic - High-level planning and coordination', value: 'strategic' },
        { name: 'Tactical - Detailed task management', value: 'tactical' },
        { name: 'Adaptive - Learns and adapts strategies', value: 'adaptive' }
      ],
      default: 'strategic'
    },
    {
      type: 'number',
      name: 'maxWorkers',
      message: 'Maximum number of worker agents:',
      default: 8,
      validate: (input: number) => (input > 0 && input <= 20) || 'Please enter a number between 1 and 20'
    },
    {
      type: 'checkbox',
      name: 'workerTypes',
      message: 'Select worker agent types:',
      choices: [
        { name: 'Researcher', value: 'researcher', checked: true },
        { name: 'Coder', value: 'coder', checked: true },
        { name: 'Analyst', value: 'analyst', checked: true },
        { name: 'Tester', value: 'tester', checked: true },
        { name: 'Architect', value: 'architect' },
        { name: 'Reviewer', value: 'reviewer' },
        { name: 'Optimizer', value: 'optimizer' },
        { name: 'Documenter', value: 'documenter' }
      ]
    },
    {
      type: 'list',
      name: 'consensusAlgorithm',
      message: 'Consensus algorithm for decisions:',
      choices: [
        { name: 'Majority - Simple majority voting', value: 'majority' },
        { name: 'Weighted - Expertise-weighted voting', value: 'weighted' },
        { name: 'Byzantine - Fault-tolerant consensus', value: 'byzantine' }
      ],
      default: 'majority'
    },
    {
      type: 'confirm',
      name: 'autoScale',
      message: 'Enable auto-scaling?',
      default: true
    },
    {
      type: 'confirm',
      name: 'monitor',
      message: 'Launch monitoring dashboard?',
      default: true
    }
  ]);
  
  // Spawn the swarm with collected parameters
  await spawnSwarm([answers.objective], {
    name: answers.name,
    queenType: answers.queenType,
    maxWorkers: answers.maxWorkers,
    workerTypes: answers.workerTypes.join(','),
    consensus: answers.consensusAlgorithm,
    autoScale: answers.autoScale,
    monitor: answers.monitor
  });
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

// Main command handler (declared only once)
async function hiveMindCommand(args: string[], flags: HiveMindFlags): Promise<void> {
  const subcommand = args[0];
  const subArgs = args.slice(1);
  
  // If no subcommand, show help
  if (!subcommand) {
    showHiveMindHelp();
    return;
  }
  
  // Warn about non-interactive environments for certain commands
  if ((subcommand === 'spawn' && (flags.claude || flags.spawn)) || subcommand === 'wizard') {
    warnNonInteractive('hive-mind ' + subcommand);
  }
  
  switch (subcommand) {
    case 'init':
      await initHiveMind(flags);
      break;
      
    case 'spawn':
      if (flags.wizard || subArgs.length === 0) {
        await spawnSwarmWizard();
      } else {
        await spawnSwarm(subArgs, flags);
      }
      break;
      
    case 'status':
      await showStatus(flags);
      break;
      
    case 'sessions':
      await showSessions(flags);
      break;
      
    case 'resume':
      await resumeSession(subArgs, flags);
      break;
      
    case 'consensus':
      await showConsensus(flags);
      break;
      
    case 'memory':
      await manageMemoryWizard();
      break;
      
    case 'metrics':
      await showMetrics(flags);
      break;
      
    case 'wizard':
      await hiveMindWizard(flags);
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHiveMindHelp();
      break;
      
    default:
      console.error(chalk.red(`Unknown subcommand: ${subcommand}`));
      console.log('Run "claude-flow hive-mind help" for usage information');
      exit(1);
  }
}