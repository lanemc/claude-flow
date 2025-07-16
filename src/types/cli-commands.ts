/**
 * TypeScript type definitions for CLI command files
 * Generated for conversion from JavaScript to TypeScript
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface CommandFlags {
  [key: string]: string | boolean | number | undefined;
}

export interface CommandArgs extends Array<string> {}

export interface CommandContext {
  args: CommandArgs;
  flags: CommandFlags;
  command: string;
}

// ============================================================================
// SWARM COMMAND TYPES
// ============================================================================

export interface SwarmFlags extends CommandFlags {
  strategy?: 'auto' | 'research' | 'development' | 'analysis' | 'testing' | 'optimization' | 'maintenance';
  mode?: 'centralized' | 'distributed' | 'hierarchical' | 'mesh' | 'hybrid';
  'max-agents'?: number;
  timeout?: number;
  'task-timeout-minutes'?: number;
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
  executor?: boolean;
  'output-format'?: 'json' | 'text';
  'output-file'?: string;
  'no-interactive'?: boolean;
  'no-auto-permissions'?: boolean;
  analysis?: boolean;
  'read-only'?: boolean;
  'quality-threshold'?: number;
  'memory-namespace'?: string;
  'agent-selection'?: string;
  'task-scheduling'?: string;
  'load-balancing'?: string;
  'fault-tolerance'?: string;
  sparc?: boolean;
  'dangerously-skip-permissions'?: boolean;
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

export interface SwarmCoordinatorInterface {
  config: SwarmConfig;
  id: string;
  agents: SwarmAgent[];
  tasks: SwarmTask[];
  status: 'initializing' | 'active' | 'completed' | 'error';
  startTime: number;
  
  initialize(): Promise<SwarmCoordinatorInterface>;
  addAgent(type: string, name?: string): Promise<SwarmAgent>;
  executeTask(task: string): Promise<SwarmTask>;
  getStatus(): Promise<SwarmStatus>;
  complete(): Promise<SwarmSummary>;
}

export interface SwarmStatus {
  id: string;
  status: string;
  agents: number;
  tasks: {
    total: number;
    completed: number;
    in_progress: number;
  };
  runtime: number;
}

export interface SwarmSummary {
  id: string;
  status: string;
  agents: number;
  tasks: {
    completed: number;
  };
  runtime: number;
}

export interface SwarmExecutionResult {
  success: boolean;
  summary?: SwarmSummary;
  error?: string;
}

// ============================================================================
// CONFIG COMMAND TYPES
// ============================================================================

export interface ConfigFlags extends CommandFlags {
  format?: 'json' | 'pretty';
  force?: boolean;
}

export interface DefaultConfig {
  version: string;
  terminal: {
    poolSize: number;
    recycleAfter: number;
    healthCheckInterval: number;
    type: string;
  };
  orchestrator: {
    maxConcurrentTasks: number;
    taskTimeout: number;
    defaultPriority: number;
  };
  memory: {
    backend: string;
    path: string;
    cacheSize: number;
    indexing: boolean;
  };
  agents: {
    maxAgents: number;
    defaultCapabilities: string[];
    resourceLimits: {
      memory: string;
      cpu: string;
    };
  };
  mcp: {
    port: number;
    host: string;
    timeout: number;
  };
  logging: {
    level: string;
    file: string;
    maxSize: string;
    maxFiles: number;
  };
}

export type ConfigKey = string;
export type ConfigValue = string | number | boolean | object;

// ============================================================================
// SPARC COMMAND TYPES
// ============================================================================

export interface SparcFlags extends CommandFlags {
  help?: boolean;
  h?: boolean;
  'non-interactive'?: boolean;
  n?: boolean;
  'dry-run'?: boolean;
  d?: boolean;
  verbose?: boolean;
  v?: boolean;
  'no-permissions'?: boolean;
  'enable-permissions'?: boolean;
  namespace?: string;
  config?: string;
  interactive?: boolean;
  i?: boolean;
}

export interface SparcMode {
  name: string;
  slug: string;
  roleDefinition: string;
  customInstructions: string;
  groups: string[];
  source: string;
}

export interface SparcConfig {
  customModes: SparcMode[];
}

export interface SparcPromptOptions {
  mode: SparcMode;
  taskDescription: string;
  memoryNamespace: string;
}

export interface SparcTddPhase {
  name: string;
  description: string;
  mode: string;
}

// ============================================================================
// SWARM EXECUTOR TYPES
// ============================================================================

export interface SwarmExecutorConfig extends SwarmConfig {
  // Additional executor-specific properties can be added here
}

// ============================================================================
// START COMMAND TYPES
// ============================================================================

export interface StartFlags extends CommandFlags {
  // Re-exports from start-wrapper.js
}

// ============================================================================
// MONITOR COMMAND TYPES
// ============================================================================

export interface MonitorFlags extends CommandFlags {
  interval?: number;
  format?: 'pretty' | 'json';
  watch?: boolean;
}

export interface SystemMetrics {
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  memory_total: number;
  memory_percentage: number;
  disk_usage: number;
  disk_used: number;
  disk_total: number;
  load_average: number[];
  cpu_count: number;
  platform: string;
  node_version: string;
}

export interface OrchestratorMetrics {
  status: 'running' | 'stopped' | 'starting' | 'error';
  active_agents: number;
  queued_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  errors: number;
  uptime: number;
}

export interface PerformanceMetrics {
  avg_task_duration: number;
  throughput: number;
  success_rate: number;
  memory_heap_used: number;
  memory_heap_total: number;
  memory_external: number;
  cpu_user: number;
  cpu_system: number;
}

export interface ResourceMetrics {
  memory_entries: number | string;
  terminal_sessions: number;
  mcp_connections: number;
  open_files: number;
  open_requests: number;
}

export interface MonitoringMetrics {
  timestamp: number;
  system: SystemMetrics;
  orchestrator: OrchestratorMetrics;
  performance: PerformanceMetrics;
  resources: ResourceMetrics;
}

// ============================================================================
// BATCH MANAGER TYPES
// ============================================================================

export interface BatchManagerFlags extends CommandFlags {
  interactive?: boolean;
  i?: boolean;
}

export interface ProjectTemplate {
  name: string;
  description: string;
  extraDirs?: string[];
  extraFiles?: { [key: string]: string };
}

export interface EnvironmentConfig {
  name: string;
  features: string[];
  config: { [key: string]: any };
}

export interface BatchConfig {
  _comment?: string;
  _templates?: string[];
  _environments?: string[];
  baseOptions: {
    sparc: boolean;
    parallel: boolean;
    maxConcurrency: number;
    force?: boolean;
    minimal?: boolean;
    progressTracking?: boolean;
    template?: string;
    environments?: string[];
  };
  projects?: string[];
  projectConfigs?: {
    [projectName: string]: {
      template: string;
      environment: string;
      customConfig?: { [key: string]: any };
    };
  };
}

export interface BatchValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

export interface BatchEstimation {
  projectCount: number;
  totalEnvironments: number;
  parallel: boolean;
  maxConcurrency: number;
  sequentialTime: number;
  parallelTime: number;
  estimatedDiskUsage: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface UtilityResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// ============================================================================
// COMMAND FUNCTION SIGNATURES
// ============================================================================

export type SwarmCommandFunction = (args: CommandArgs, flags: SwarmFlags) => Promise<void>;
export type ConfigCommandFunction = (subArgs: CommandArgs, flags: ConfigFlags) => Promise<void>;
export type SparcCommandFunction = (subArgs: CommandArgs, flags: SparcFlags) => Promise<void>;
export type MonitorCommandFunction = (subArgs: CommandArgs, flags: MonitorFlags) => Promise<void>;
export type BatchManagerCommandFunction = (subArgs: CommandArgs, flags: BatchManagerFlags) => Promise<void>;

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface CommandError extends Error {
  code?: string;
  command?: string;
  args?: CommandArgs;
  flags?: CommandFlags;
}

export interface SwarmExecutionError extends CommandError {
  swarmId?: string;
  phase?: string;
}

export interface ConfigValidationError extends CommandError {
  configPath?: string;
  validationErrors?: string[];
}

export interface SparcExecutionError extends CommandError {
  mode?: string;
  instanceId?: string;
}

// ============================================================================
// RESULT TYPES
// ============================================================================

export interface CommandResult<T = any> {
  success: boolean;
  data?: T;
  error?: CommandError;
  warnings?: string[];
}

export interface SwarmCommandResult extends CommandResult<SwarmExecutionResult> {}
export interface ConfigCommandResult extends CommandResult<DefaultConfig> {}
export interface SparcCommandResult extends CommandResult<string> {}
export interface MonitorCommandResult extends CommandResult<MonitoringMetrics> {}
export interface BatchManagerCommandResult extends CommandResult<BatchConfig> {}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export {
  // Common
  CommandFlags,
  CommandArgs,
  CommandContext,
  
  // Swarm
  SwarmFlags,
  SwarmConfig,
  SwarmAgent,
  SwarmTask,
  SwarmCoordinatorInterface,
  SwarmStatus,
  SwarmSummary,
  SwarmExecutionResult,
  
  // Config
  ConfigFlags,
  DefaultConfig,
  ConfigKey,
  ConfigValue,
  
  // SPARC
  SparcFlags,
  SparcMode,
  SparcConfig,
  SparcPromptOptions,
  SparcTddPhase,
  
  // Monitor
  MonitorFlags,
  SystemMetrics,
  OrchestratorMetrics,
  PerformanceMetrics,
  ResourceMetrics,
  MonitoringMetrics,
  
  // Batch Manager
  BatchManagerFlags,
  ProjectTemplate,
  EnvironmentConfig,
  BatchConfig,
  BatchValidationIssue,
  BatchEstimation,
  
  // Utility
  UtilityResponse,
  
  // Functions
  SwarmCommandFunction,
  ConfigCommandFunction,
  SparcCommandFunction,
  MonitorCommandFunction,
  BatchManagerCommandFunction,
  
  // Errors
  CommandError,
  SwarmExecutionError,
  ConfigValidationError,
  SparcExecutionError,
  
  // Results
  CommandResult,
  SwarmCommandResult,
  ConfigCommandResult,
  SparcCommandResult,
  MonitorCommandResult,
  BatchManagerCommandResult,
};