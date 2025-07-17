/**
 * TypeScript type definitions for CLI command files
 * Merged version combining both type definition sets
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface CommandFlags {
  [key: string]: string | boolean | number | undefined;
  // Common flags
  help?: boolean;
  h?: boolean;
  verbose?: boolean;
  v?: boolean;
  dryRun?: boolean;
  'dry-run'?: boolean;
  d?: boolean;
  config?: string;
  c?: string;
}

export interface CommandArgs extends Array<string> {}

export interface CommandContext {
  args: CommandArgs;
  flags: CommandFlags;
  command: string;
}

export interface CommandResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: Error | string;
}

// ============================================================================
// SWARM COMMAND TYPES
// ============================================================================

export interface SwarmFlags extends CommandFlags {
  strategy?: 'auto' | 'research' | 'development' | 'analysis' | 'testing' | 'optimization' | 'maintenance';
  mode?: 'centralized' | 'distributed' | 'hierarchical' | 'mesh' | 'hybrid';
  'max-agents'?: number;
  maxAgents?: number;
  timeout?: number;
  'task-timeout-minutes'?: number;
  taskTimeoutMinutes?: number;
  parallel?: boolean;
  distributed?: boolean;
  monitor?: boolean;
  ui?: boolean;
  background?: boolean;
  review?: boolean;
  testing?: boolean;
  encryption?: boolean;
  verbose?: boolean;
  'dry-run'?: boolean;
  dryRun?: boolean;
  executor?: boolean;
  'output-format'?: 'json' | 'text';
  outputFormat?: 'json' | 'text';
  'output-file'?: string;
  outputFile?: string;
  'no-interactive'?: boolean;
  noInteractive?: boolean;
  'no-auto-permissions'?: boolean;
  noAutoPermissions?: boolean;
  analysis?: boolean;
  'read-only'?: boolean;
  readOnly?: boolean;
  'quality-threshold'?: number;
  qualityThreshold?: number;
  'memory-namespace'?: string;
  memoryNamespace?: string;
  'agent-selection'?: string;
  agentSelection?: string;
  'task-scheduling'?: string;
  taskScheduling?: string;
  'load-balancing'?: string;
  loadBalancing?: string;
  'fault-tolerance'?: string;
  faultTolerance?: string;
  sparc?: boolean;
  'dangerously-skip-permissions'?: boolean;
  dangerouslySkipPermissions?: boolean;
}

export interface SwarmConfig {
  name?: string;
  description: string;
  mode: string;
  strategy: string;
  maxAgents: number;
  maxTasks: number;
  timeout: number;
  taskTimeoutMinutes: number;
  qualityThreshold: number;
  reviewRequired: boolean;
  testingRequired: boolean;
  monitoring: {
    enabled: boolean;
  };
  memory: {
    namespace: string;
    persistent: boolean;
  };
  security: {
    encryptionEnabled: boolean;
  };
}

export interface SwarmAgent {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  tasks: string[];
}

export interface SwarmTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
}

export interface SwarmCommandResult extends CommandResult {
  swarmId?: string;
  objective?: string;
  strategy?: string;
  agents?: SwarmAgent[];
  tasks?: SwarmTask[];
  summary?: {
    totalAgents: number;
    completedTasks: number;
    failedTasks: number;
    executionTime: number;
  };
}

// ============================================================================
// CONFIG COMMAND TYPES
// ============================================================================

export interface ConfigFlags extends CommandFlags {
  global?: boolean;
  g?: boolean;
  local?: boolean;
  l?: boolean;
  set?: string;
  get?: string;
  unset?: string;
  list?: boolean;
  init?: boolean;
  validate?: boolean;
  reset?: boolean;
  export?: boolean;
  import?: string;
}

export interface ConfigData {
  version: string;
  created: string;
  modified: string;
  settings: {
    [key: string]: any;
  };
}

export interface ConfigCommandResult extends CommandResult {
  config?: ConfigData;
  key?: string;
  value?: any;
  validated?: boolean;
}

// ============================================================================
// SPARC COMMAND TYPES  
// ============================================================================

export interface SparcFlags extends CommandFlags {
  mode?: 'architect' | 'code' | 'review' | 'plan' | 'specify';
  interactive?: boolean;
  i?: boolean;
  force?: boolean;
  f?: boolean;
  template?: string;
  t?: string;
  output?: string;
  o?: string;
}

export interface SparcCommandResult extends CommandResult {
  mode?: string;
  generated?: {
    specification?: string;
    pseudocode?: string;
    architecture?: string;
    review?: string;
    code?: string;
  };
}

// ============================================================================
// MONITOR COMMAND TYPES
// ============================================================================

export interface MonitorFlags extends CommandFlags {
  interval?: number;
  metrics?: string[];
  'output-format'?: 'json' | 'table' | 'graph';
  outputFormat?: 'json' | 'table' | 'graph';
  realtime?: boolean;
  r?: boolean;
}

export interface MonitorCommandResult extends CommandResult {
  metrics?: {
    [key: string]: any;
  };
  history?: Array<{
    timestamp: number;
    metrics: { [key: string]: any };
  }>;
}

// ============================================================================
// BATCH MANAGER COMMAND TYPES
// ============================================================================

export interface BatchManagerFlags extends CommandFlags {
  batch?: boolean;
  b?: boolean;
  parallel?: boolean;
  p?: boolean;
  'max-concurrent'?: number;
  maxConcurrent?: number;
  'retry-failed'?: boolean;
  retryFailed?: boolean;
  'continue-on-error'?: boolean;
  continueOnError?: boolean;
}

export interface BatchTask {
  id: string;
  command: string;
  args: string[];
  flags: CommandFlags;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: CommandResult;
  error?: Error | string;
  startTime?: number;
  endTime?: number;
  retries?: number;
}

export interface BatchManagerCommandResult extends CommandResult {
  batchId?: string;
  tasks?: BatchTask[];
  summary?: {
    total: number;
    completed: number;
    failed: number;
    pending: number;
    running: number;
    executionTime: number;
  };
}

// ============================================================================
// INIT COMMAND TYPES
// ============================================================================

export interface InitCommandOptions {
  force?: boolean;
  minimal?: boolean;
  verbose?: boolean;
  interactive?: boolean;
  noColor?: boolean;
  dryRun?: boolean;
  skipGitCheck?: boolean;
  outputDir?: string;
  features?: string[];
  'interactive-mode'?: 'sparc' | 'standard' | 'minimal';
  claude?: boolean;
  memory?: boolean;
  hooks?: boolean;
  templates?: boolean;
  examples?: boolean;
  all?: boolean;
  dangerouslySkipPermissions?: boolean;
}

export interface InitCommandContext {
  options: InitCommandOptions;
  targetDir: string;
  isGitRepo: boolean;
  existingFiles: string[];
}

export interface InitResult {
  success: boolean;
  filesCreated: string[];
  filesSkipped: string[];
  errors: string[];
  warnings: string[];
  rollbackAvailable: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// EXPORTED TYPE MAP
// ============================================================================

export {
  CommandContext,
  CommandFlags,
  CommandArgs,
  CommandResult,
  SwarmCommandResult,
  ConfigCommandResult,
  SparcCommandResult,
  MonitorCommandResult,
  BatchManagerCommandResult,
};