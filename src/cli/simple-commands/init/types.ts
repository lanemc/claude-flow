/**
 * TypeScript Interface Definitions for Claude Flow CLI Initialization System
 * 
 * Comprehensive type definitions for configuration objects, parameters, and data structures
 * used throughout the CLI initialization subsystem.
 */

// ============================================================================
// Core Configuration Interfaces
// ============================================================================

/**
 * Main initialization options interface
 */
export interface InitOptions {
  /** Force overwrite existing files */
  force?: boolean;
  /** Create minimal configuration */
  minimal?: boolean;
  /** Enable SPARC development environment */
  sparc?: boolean;
  /** Dry run - show what would be done without executing */
  dryRun?: boolean;
  /** Use optimized templates with parallel processing */
  optimized?: boolean;
  /** Selective SPARC modes to initialize */
  modes?: string[];
  /** Skip MCP server setup */
  skipMcp?: boolean;
  /** Skip backup creation */
  skipBackup?: boolean;
  /** Skip pre-validation */
  skipPreValidation?: boolean;
  /** Validation only mode */
  validateOnly?: boolean;
  /** Help flag */
  help?: boolean;
  /** Basic initialization flag */
  basic?: boolean;
}

/**
 * Enhanced initialization flags for Claude Flow v2.0.0
 */
export interface EnhancedInitFlags extends InitOptions {
  /** Enhanced initialization with validation and rollback */
  enhanced?: boolean;
  /** Safe initialization with extra validation */
  safe?: boolean;
  /** Template to use for initialization */
  template?: string;
  /** Target environments */
  environments?: string[];
}

/**
 * Batch initialization options
 */
export interface BatchInitOptions {
  /** Enable parallel processing */
  parallel?: boolean;
  /** Disable parallel processing */
  'no-parallel'?: boolean;
  /** Maximum concurrent operations */
  'max-concurrent'?: number;
  /** Maximum concurrency */
  maxConcurrency?: number;
  /** Enable progress tracking */
  progressTracking?: boolean;
  /** Enable performance monitoring */
  performanceMonitoring?: boolean;
  /** Project template to use */
  template?: string;
  /** Target environments */
  environments?: string[];
  /** Batch initialization projects */
  'batch-init'?: string;
  /** Configuration file */
  config?: string;
}

// ============================================================================
// File System and Template Interfaces
// ============================================================================

/**
 * File creation result
 */
export interface FileCreationResult {
  /** Whether the operation was successful */
  success: boolean;
  /** File path that was created */
  filePath?: string;
  /** Error message if failed */
  error?: string;
  /** Size of created file */
  size?: number;
  /** File permissions */
  permissions?: number;
}

/**
 * Directory structure configuration
 */
export interface DirectoryStructure {
  /** Base directories to create */
  directories: string[];
  /** SPARC-specific directories */
  sparcDirectories?: string[];
  /** Template-specific directories */
  templateDirectories?: string[];
  /** Swarm memory directories */
  swarmDirectories?: string[];
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Additional directories to create */
  extraDirs?: string[];
  /** Template-specific files */
  extraFiles?: Record<string, any>;
  /** Template variables */
  variables?: Record<string, string>;
  /** Dependencies required by template */
  dependencies?: string[];
}

/**
 * Project template definitions
 */
export interface ProjectTemplate extends TemplateConfig {
  /** Template type */
  type: 'web-api' | 'react-app' | 'microservice' | 'cli-tool' | 'basic';
  /** Configuration overrides */
  config?: Record<string, any>;
  /** Build scripts */
  scripts?: Record<string, string>;
}

// ============================================================================
// SPARC Configuration Interfaces
// ============================================================================

/**
 * SPARC mode configuration
 */
export interface SparcModeConfig {
  /** Mode name */
  name: string;
  /** Mode description */
  description: string;
  /** Agent persona */
  persona: string;
  /** Available tools */
  tools: string[];
  /** Mode-specific settings */
  settings?: Record<string, any>;
  /** Dependencies on other modes */
  dependencies?: string[];
}

/**
 * Complete SPARC configuration
 */
export interface SparcConfig {
  /** SPARC version */
  version: string;
  /** Enabled status */
  enabled: boolean;
  /** Available modes */
  modes: Record<string, SparcModeConfig>;
  /** Default mode */
  defaultMode?: string;
  /** Global SPARC settings */
  globalSettings?: Record<string, any>;
}

/**
 * Roomodes configuration (.roomodes file)
 */
export interface RoomodesConfig {
  /** Configuration version */
  version: string;
  /** SPARC modes configuration */
  modes: Record<string, SparcModeConfig>;
  /** Global settings */
  settings?: Record<string, any>;
  /** Workflow configurations */
  workflows?: Record<string, WorkflowConfig>;
}

/**
 * Workflow configuration
 */
export interface WorkflowConfig {
  /** Workflow name */
  name: string;
  /** Workflow description */
  description: string;
  /** Workflow steps */
  steps: WorkflowStep[];
  /** Workflow triggers */
  triggers?: string[];
  /** Workflow variables */
  variables?: Record<string, any>;
}

/**
 * Individual workflow step
 */
export interface WorkflowStep {
  /** Step name */
  name: string;
  /** Step type */
  type: 'command' | 'script' | 'template' | 'validation';
  /** Step configuration */
  config: Record<string, any>;
  /** Dependencies on other steps */
  dependencies?: string[];
  /** Continue on error */
  continueOnError?: boolean;
}

// ============================================================================
// Memory and Persistence Interfaces
// ============================================================================

/**
 * Memory data structure
 */
export interface MemoryData {
  /** Active agents */
  agents: AgentData[];
  /** Current tasks */
  tasks: TaskData[];
  /** Last update timestamp */
  lastUpdated: number;
  /** Environment configuration */
  environment?: string;
  /** Template used */
  template?: string;
  /** Custom configuration */
  customConfig?: Record<string, any>;
  /** Session data */
  sessionData?: SessionData;
}

/**
 * Agent data structure
 */
export interface AgentData {
  /** Agent unique identifier */
  id: string;
  /** Agent name */
  name: string;
  /** Agent type */
  type: 'coder' | 'researcher' | 'analyst' | 'tester' | 'coordinator' | 'architect' | 'reviewer';
  /** Agent status */
  status: 'active' | 'idle' | 'busy' | 'error' | 'stopped';
  /** Agent skills */
  skills: string[];
  /** Agent metrics */
  metrics?: AgentMetrics;
  /** Agent configuration */
  config?: Record<string, any>;
  /** Creation timestamp */
  created: number;
  /** Last activity timestamp */
  lastActivity: number;
}

/**
 * Task data structure
 */
export interface TaskData {
  /** Task unique identifier */
  id: string;
  /** Task description */
  description: string;
  /** Task status */
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  /** Task priority */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Assigned agent */
  assignedAgent?: string;
  /** Task dependencies */
  dependencies?: string[];
  /** Task result */
  result?: TaskResult;
  /** Creation timestamp */
  created: number;
  /** Updated timestamp */
  updated: number;
  /** Completion timestamp */
  completed?: number;
}

/**
 * Agent performance metrics
 */
export interface AgentMetrics {
  /** Tasks completed */
  tasksCompleted: number;
  /** Tasks failed */
  tasksFailed: number;
  /** Average completion time */
  averageCompletionTime: number;
  /** Success rate */
  successRate: number;
  /** Total execution time */
  totalExecutionTime: number;
  /** Error count */
  errorCount: number;
  /** Last performance update */
  lastUpdate: number;
}

/**
 * Task execution result
 */
export interface TaskResult {
  /** Success status */
  success: boolean;
  /** Output data */
  output?: any;
  /** Error information */
  error?: string;
  /** Execution time in milliseconds */
  executionTime: number;
  /** Resource usage */
  resourceUsage?: ResourceUsage;
  /** Generated files */
  generatedFiles?: string[];
  /** Modified files */
  modifiedFiles?: string[];
}

/**
 * Session data
 */
export interface SessionData {
  /** Session ID */
  id: string;
  /** Session start time */
  startTime: number;
  /** Session end time */
  endTime?: number;
  /** Session context */
  context: Record<string, any>;
  /** Session metrics */
  metrics?: SessionMetrics;
  /** Session state */
  state: 'active' | 'completed' | 'aborted';
}

/**
 * Session performance metrics
 */
export interface SessionMetrics {
  /** Total execution time */
  totalExecutionTime: number;
  /** Peak memory usage */
  peakMemoryUsage: number;
  /** Average memory usage */
  averageMemoryUsage: number;
  /** Total operations */
  totalOperations: number;
  /** Successful operations */
  successfulOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Resource efficiency score */
  efficiencyScore: number;
}

// ============================================================================
// Validation and Error Handling Interfaces
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  success: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Additional validation data */
  data?: any;
  /** Validation checks performed */
  checks?: Record<string, ValidationCheck>;
}

/**
 * Individual validation check
 */
export interface ValidationCheck {
  /** Check name */
  name: string;
  /** Check success status */
  success: boolean;
  /** Check message */
  message?: string;
  /** Check details */
  details?: any;
  /** Check execution time */
  executionTime?: number;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /** Skip pre-initialization validation */
  skipPreInit?: boolean;
  /** Skip configuration validation */
  skipConfig?: boolean;
  /** Skip mode testing */
  skipModeTest?: boolean;
  /** Post-initialization validation */
  postInit?: boolean;
  /** Force validation despite errors */
  force?: boolean;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult extends ValidationResult {
  /** Configuration object if valid */
  config?: any;
  /** Schema version */
  schemaVersion?: string;
  /** Migration required */
  migrationRequired?: boolean;
}

// ============================================================================
// Performance Monitoring Interfaces
// ============================================================================

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Start time */
  startTime: number;
  /** End time */
  endTime?: number;
  /** Peak memory usage in MB */
  peakMemoryMB: number;
  /** Average memory usage in MB */
  averageMemoryMB: number;
  /** Total operations */
  operationCount: number;
  /** Memory readings */
  memoryReadings: MemoryReading[];
  /** Recorded errors */
  errors: ErrorRecord[];
  /** Recorded warnings */
  warnings: WarningRecord[];
  /** Total duration */
  duration?: number;
  /** Operations per second */
  operationsPerSecond?: number;
  /** Memory efficiency rating */
  memoryEfficiency?: 'good' | 'warning' | 'critical';
}

/**
 * Memory usage reading
 */
export interface MemoryReading {
  /** Reading timestamp */
  timestamp: number;
  /** Memory usage in MB */
  memoryMB: number;
}

/**
 * Error record
 */
export interface ErrorRecord {
  /** Error timestamp */
  timestamp: number;
  /** Error message */
  error: string;
  /** Error context */
  context: Record<string, any>;
  /** Error stack trace */
  stackTrace?: string;
  /** Error severity */
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Warning record
 */
export interface WarningRecord {
  /** Warning timestamp */
  timestamp: number;
  /** Warning type */
  type: string;
  /** Warning message */
  message: string;
  /** Warning context */
  context: Record<string, any>;
}

/**
 * Resource usage information
 */
export interface ResourceUsage {
  /** CPU usage percentage */
  cpuPercent?: number;
  /** Memory usage in MB */
  memoryMB: number;
  /** Disk I/O operations */
  diskIO?: number;
  /** Network usage */
  networkUsage?: number;
}

/**
 * Performance monitoring options
 */
export interface PerformanceMonitorOptions {
  /** Enable monitoring */
  enabled?: boolean;
  /** Logging level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Memory check interval in ms */
  memoryCheckInterval?: number;
  /** Maximum memory limit in MB */
  maxMemoryMB?: number;
}

// ============================================================================
// Batch Processing Interfaces
// ============================================================================

/**
 * Batch initialization configuration
 */
export interface BatchConfig {
  /** Projects to initialize */
  projects: string[];
  /** Base options for all projects */
  baseOptions: BatchInitOptions;
  /** Project-specific configurations */
  projectConfigs?: Record<string, ProjectConfig>;
  /** Global settings */
  globalSettings?: Record<string, any>;
}

/**
 * Project-specific configuration
 */
export interface ProjectConfig extends InitOptions {
  /** Project name */
  name?: string;
  /** Project path */
  path?: string;
  /** Project template */
  template?: string;
  /** Project environment */
  environment?: string;
  /** Custom configuration */
  customConfig?: Record<string, any>;
}

/**
 * Batch operation result
 */
export interface BatchResult {
  /** Overall success status */
  success: boolean;
  /** Project path */
  projectPath: string;
  /** Error message if failed */
  error?: string;
  /** Execution time */
  executionTime?: number;
  /** Created files */
  createdFiles?: string[];
  /** Result details */
  details?: Record<string, any>;
}

/**
 * Batch progress tracking
 */
export interface BatchProgress {
  /** Total projects */
  totalProjects: number;
  /** Completed projects */
  completed: number;
  /** Failed projects */
  failed: number;
  /** Currently in progress */
  inProgress: number;
  /** Start time */
  startTime: number;
  /** Elapsed time */
  elapsedTime: number;
  /** Estimated completion time */
  estimatedCompletion?: number;
  /** Progress percentage */
  progressPercent: number;
}

// ============================================================================
// Rollback and Recovery Interfaces
// ============================================================================

/**
 * Rollback system configuration
 */
export interface RollbackConfig {
  /** Enable automatic backup */
  autoBackup?: boolean;
  /** Maximum backups to keep */
  maxBackups?: number;
  /** Backup compression */
  compression?: boolean;
  /** Backup location */
  backupLocation?: string;
}

/**
 * Backup information
 */
export interface BackupInfo {
  /** Backup unique identifier */
  id: string;
  /** Backup timestamp */
  timestamp: number;
  /** Backup type */
  type: 'pre-init' | 'checkpoint' | 'manual';
  /** Backup location */
  location: string;
  /** Backup size in bytes */
  size: number;
  /** Files included in backup */
  files: string[];
  /** Backup metadata */
  metadata?: Record<string, any>;
}

/**
 * Rollback point
 */
export interface RollbackPoint {
  /** Point unique identifier */
  id: string;
  /** Point timestamp */
  timestamp: number;
  /** Point type */
  type: 'pre-init' | 'post-init' | 'checkpoint' | 'manual';
  /** Associated backup ID */
  backupId?: string;
  /** Point description */
  description?: string;
  /** Point state */
  state: Record<string, any>;
}

/**
 * Checkpoint information
 */
export interface Checkpoint {
  /** Checkpoint unique identifier */
  id: string;
  /** Checkpoint timestamp */
  timestamp: number;
  /** Checkpoint phase */
  phase: string;
  /** Checkpoint status */
  status: 'created' | 'committed' | 'rolled_back';
  /** Checkpoint data */
  data: Record<string, any>;
  /** Files modified since checkpoint */
  modifiedFiles?: string[];
}

/**
 * Recovery operation result
 */
export interface RecoveryResult {
  /** Recovery success status */
  success: boolean;
  /** Recovery actions performed */
  actions: string[];
  /** Recovery errors */
  errors: string[];
  /** Recovery warnings */
  warnings: string[];
  /** Time taken for recovery */
  recoveryTime: number;
  /** Recovered files */
  recoveredFiles?: string[];
}

// ============================================================================
// MCP and Integration Interfaces
// ============================================================================

/**
 * MCP server configuration
 */
export interface McpServerConfig {
  /** Server name */
  name: string;
  /** Server command */
  command: string;
  /** Server arguments */
  args?: string[];
  /** Server type */
  type: 'stdio' | 'http' | 'websocket';
  /** Server description */
  description: string;
  /** Server environment variables */
  env?: Record<string, string>;
  /** Server timeout */
  timeout?: number;
}

/**
 * Claude Code settings configuration
 */
export interface ClaudeCodeSettings {
  /** Environment variables */
  env: Record<string, string>;
  /** Permissions configuration */
  permissions: {
    allow: string[];
    deny: string[];
  };
  /** Enabled MCP servers */
  enabledMcpjsonServers: string[];
  /** Hook configurations */
  hooks: {
    PreToolUse?: HookConfig[];
    PostToolUse?: HookConfig[];
    Stop?: HookConfig[];
  };
  /** Include co-authored by */
  includeCoAuthoredBy: boolean;
}

/**
 * Hook configuration
 */
export interface HookConfig {
  /** Hook matcher pattern */
  matcher?: string;
  /** Hook definitions */
  hooks: Hook[];
}

/**
 * Individual hook definition
 */
export interface Hook {
  /** Hook type */
  type: 'command' | 'script' | 'function';
  /** Hook command */
  command?: string;
  /** Hook script */
  script?: string;
  /** Hook function */
  function?: (...args: any[]) => any;
  /** Hook options */
  options?: Record<string, any>;
}

// ============================================================================
// Environment and System Interfaces
// ============================================================================

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  /** Environment name */
  name: string;
  /** Environment features */
  features: string[];
  /** Environment configuration */
  config: Record<string, string>;
  /** Environment variables */
  variables?: Record<string, string>;
  /** Environment dependencies */
  dependencies?: string[];
}

/**
 * System requirements
 */
export interface SystemRequirements {
  /** Minimum Node.js version */
  nodeVersion?: string;
  /** Required commands */
  requiredCommands?: string[];
  /** Minimum disk space in MB */
  minDiskSpaceMB?: number;
  /** Minimum RAM in MB */
  minRamMB?: number;
  /** Operating system requirements */
  os?: string[];
}

/**
 * System status
 */
export interface SystemStatus {
  /** Available disk space in MB */
  availableDiskSpaceMB: number;
  /** Available RAM in MB */
  availableRamMB: number;
  /** CPU cores */
  cpuCores: number;
  /** Operating system */
  operatingSystem: string;
  /** Node.js version */
  nodeVersion: string;
  /** Available commands */
  availableCommands: string[];
  /** System health */
  health: 'good' | 'warning' | 'critical';
}

// ============================================================================
// Command and CLI Interfaces
// ============================================================================

/**
 * CLI command structure
 */
export interface CommandStructure {
  /** Command categories */
  [category: string]: string[];
}

/**
 * Command documentation
 */
export interface CommandDoc {
  /** Command name */
  name: string;
  /** Command category */
  category: string;
  /** Command description */
  description: string;
  /** Command usage */
  usage: string;
  /** Command options */
  options: CommandOption[];
  /** Command examples */
  examples: CommandExample[];
}

/**
 * Command option
 */
export interface CommandOption {
  /** Option name */
  name: string;
  /** Option description */
  description: string;
  /** Option type */
  type: 'string' | 'number' | 'boolean' | 'array';
  /** Option is required */
  required?: boolean;
  /** Option default value */
  default?: any;
  /** Option aliases */
  aliases?: string[];
}

/**
 * Command example
 */
export interface CommandExample {
  /** Example description */
  description: string;
  /** Example command */
  command: string;
  /** Example output */
  output?: string;
}

// ============================================================================
// Utility Types and Helpers
// ============================================================================

/**
 * Generic operation result
 */
export interface OperationResult<T = any> {
  /** Operation success status */
  success: boolean;
  /** Operation data */
  data?: T;
  /** Error message */
  error?: string;
  /** Warning messages */
  warnings?: string[];
  /** Operation metadata */
  metadata?: Record<string, any>;
}

/**
 * Async operation result with progress
 */
export interface AsyncOperationResult<T = any> extends OperationResult<T> {
  /** Operation progress */
  progress?: number;
  /** Estimated completion time */
  estimatedCompletion?: number;
  /** Operation status */
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

/**
 * File system operation options
 */
export interface FileSystemOptions {
  /** Create intermediate directories */
  recursive?: boolean;
  /** File permissions mode */
  mode?: number;
  /** Overwrite existing files */
  overwrite?: boolean;
  /** Backup existing files */
  backup?: boolean;
  /** Dry run mode */
  dryRun?: boolean;
}

/**
 * Generic configuration with validation
 */
export interface ValidatedConfig<T = any> {
  /** Configuration data */
  config: T;
  /** Validation result */
  validation: ValidationResult;
  /** Configuration source */
  source: string;
  /** Configuration version */
  version: string;
  /** Last updated timestamp */
  lastUpdated: number;
}

// ============================================================================
// Type Guards and Validators
// ============================================================================

/**
 * Type guard for checking if object has required properties
 */
export function hasRequiredProperties<T>(
  obj: any,
  properties: (keyof T)[]
): obj is T {
  return properties.every(prop => prop in obj);
}

/**
 * Validation schema for configuration objects
 */
export interface ValidationSchema {
  /** Required properties */
  required: string[];
  /** Optional properties */
  optional?: string[];
  /** Property type definitions */
  properties: Record<string, {
    type: string;
    validation?: (value: any) => boolean;
    default?: any;
  }>;
}

// ============================================================================
// Export Configuration
// ============================================================================

/**
 * Main module exports interface
 */
export interface ModuleExports {
  /** Initialization function */
  initCommand: (subArgs: string[], flags: InitOptions) => Promise<void>;
  /** Batch initialization function */
  batchInitCommand: (projects: string[], options: BatchInitOptions) => Promise<BatchResult[]>;
  /** Enhanced initialization function */
  enhancedClaudeFlowInit: (flags: EnhancedInitFlags, subArgs: string[]) => Promise<void>;
  /** Validation function */
  runFullValidation: (workingDir: string, options: ValidationOptions) => Promise<ValidationResult>;
  /** Configuration validation */
  validateBatchOptions: (options: BatchInitOptions) => string[];
  /** Template definitions */
  PROJECT_TEMPLATES: Record<string, ProjectTemplate>;
  /** Environment configurations */
  ENVIRONMENT_CONFIGS: Record<string, EnvironmentConfig>;
}