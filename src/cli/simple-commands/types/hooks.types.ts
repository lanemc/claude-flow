/**
 * @fileoverview Comprehensive TypeScript type definitions for the Claude Flow hook system
 * @author Claude TypeScript Architect Agent
 * @version 1.0.0
 */

// ================================
// BASE TYPES AND INTERFACES
// ================================

/**
 * Unique identifier for various entities in the system
 */
export type Id = string;

/**
 * ISO 8601 date string
 */
export type ISODateString = string;

/**
 * Generic key-value metadata object
 */
export type Metadata = Record<string, unknown>;

/**
 * File path string
 */
export type FilePath = string;

/**
 * Command string for execution
 */
export type Command = string;

// ================================
// ENUMS
// ================================

/**
 * Types of hooks supported by the system
 */
export enum HookType {
  // Pre-operation hooks
  PRE_TASK = 'pre-task',
  PRE_EDIT = 'pre-edit',
  PRE_BASH = 'pre-bash',
  PRE_COMMAND = 'pre-command',
  PRE_SEARCH = 'pre-search',
  
  // Post-operation hooks
  POST_TASK = 'post-task',
  POST_EDIT = 'post-edit',
  POST_BASH = 'post-bash',
  POST_COMMAND = 'post-command',
  POST_SEARCH = 'post-search',
  
  // MCP integration hooks
  MCP_INITIALIZED = 'mcp-initialized',
  AGENT_SPAWNED = 'agent-spawned',
  TASK_ORCHESTRATED = 'task-orchestrated',
  NEURAL_TRAINED = 'neural-trained',
  
  // Session hooks
  SESSION_START = 'session-start',
  SESSION_END = 'session-end',
  SESSION_RESTORE = 'session-restore',
  NOTIFICATION = 'notification',
  
  // Special hooks
  STOP = 'Stop',
  SUBAGENT_STOP = 'SubagentStop',
  POST_TOOL_USE = 'PostToolUse'
}

/**
 * Safety validation levels for hooks
 */
export enum SafetyLevel {
  SAFE = 'safe',
  WARNING = 'warning',
  DANGEROUS = 'dangerous',
  CRITICAL = 'critical',
  BLOCKED = 'blocked'
}

/**
 * Task/Project complexity levels
 */
export enum ComplexityLevel {
  LOW = 'low',
  SIMPLE = 'simple',
  MEDIUM = 'medium',
  MODERATE = 'moderate',
  HIGH = 'high',
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise',
  MASSIVE = 'massive'
}

/**
 * Project types for workflow selection
 */
export enum ProjectType {
  WEB_APP = 'web-app',
  API = 'api',
  DATA_ANALYSIS = 'data-analysis',
  ENTERPRISE = 'enterprise',
  GENERAL = 'general',
  MOBILE_APP = 'mobile-app',
  DESKTOP_APP = 'desktop-app',
  MICROSERVICE = 'microservice',
  LIBRARY = 'library',
  TOOL = 'tool'
}

/**
 * Agent types in the swarm system
 */
export enum AgentType {
  COORDINATOR = 'coordinator',
  CODER = 'coder',
  DEVELOPER = 'developer',
  RESEARCHER = 'researcher',
  ANALYST = 'analyst',
  TESTER = 'tester',
  REVIEWER = 'reviewer',
  ARCHITECT = 'architect',
  OPTIMIZER = 'optimizer',
  GENERIC = 'generic',
  JAVASCRIPT_DEVELOPER = 'javascript-developer',
  TYPESCRIPT_DEVELOPER = 'typescript-developer',
  PYTHON_DEVELOPER = 'python-developer',
  GOLANG_DEVELOPER = 'golang-developer',
  RUST_DEVELOPER = 'rust-developer',
  JAVA_DEVELOPER = 'java-developer',
  CPP_DEVELOPER = 'cpp-developer',
  C_DEVELOPER = 'c-developer',
  FRONTEND_DEVELOPER = 'frontend-developer',
  BACKEND_DEVELOPER = 'backend-developer',
  FULLSTACK_DEVELOPER = 'fullstack-developer',
  TECHNICAL_WRITER = 'technical-writer',
  DEVOPS_ENGINEER = 'devops-engineer',
  CONFIG_SPECIALIST = 'config-specialist',
  DATABASE_EXPERT = 'database-expert',
  SYSTEM_ADMIN = 'system-admin',
  GENERAL_DEVELOPER = 'general-developer'
}

/**
 * Status of various entities in the system
 */
export enum Status {
  PENDING = 'pending',
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ORCHESTRATED = 'orchestrated',
  BLOCKED = 'blocked'
}

/**
 * Log levels for notifications and messages
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Priority levels for tasks and configurations
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  SPEED = 'speed',
  QUALITY = 'quality',
  COST = 'cost',
  BALANCED = 'balanced'
}

/**
 * Strategy types for execution and orchestration
 */
export enum Strategy {
  PARALLEL = 'parallel',
  SEQUENTIAL = 'sequential',
  ADAPTIVE = 'adaptive',
  BALANCED = 'balanced',
  SPECIALIZED = 'specialized'
}

// ================================
// CORE INTERFACES
// ================================

/**
 * Basic hook configuration interface
 */
export interface HookConfiguration {
  /** Unique identifier for the hook */
  id: Id;
  /** Type of hook */
  type: HookType;
  /** Whether the hook is enabled */
  enabled: boolean;
  /** Priority level for execution order */
  priority: Priority;
  /** Command or script to execute */
  command?: Command;
  /** Working directory for execution */
  workingDirectory?: FilePath;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Environment variables */
  environment?: Record<string, string>;
  /** Metadata for the hook */
  metadata?: Metadata;
  /** Conditions for hook execution */
  conditions?: HookCondition[];
  /** Safety settings */
  safety?: SafetyConfiguration;
}

/**
 * Conditions for hook execution
 */
export interface HookCondition {
  /** Type of condition */
  type: 'file-pattern' | 'command-pattern' | 'environment' | 'flag' | 'custom';
  /** Pattern to match */
  pattern?: string;
  /** Value to compare */
  value?: unknown;
  /** Whether condition should be negated */
  negate?: boolean;
}

/**
 * Safety configuration for hooks
 */
export interface SafetyConfiguration {
  /** Enable safety validation */
  enabled: boolean;
  /** Maximum execution depth to prevent recursion */
  maxDepth: number;
  /** Dangerous patterns to block */
  blockedPatterns: string[];
  /** Warning patterns */
  warningPatterns: string[];
  /** Allow override with flags */
  allowOverride: boolean;
}

/**
 * Result of hook execution
 */
export interface HookExecutionResult {
  /** Whether execution was successful */
  success: boolean;
  /** Hook that was executed */
  hookId: Id;
  /** Hook type */
  hookType: HookType;
  /** Exit code (for command hooks) */
  exitCode?: number;
  /** Standard output */
  stdout?: string;
  /** Standard error */
  stderr?: string;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp of execution */
  timestamp: ISODateString;
  /** Error message if failed */
  error?: string;
  /** Whether execution was skipped */
  skipped?: boolean;
  /** Reason for skipping */
  skipReason?: string;
  /** Safety validation result */
  safetyResult?: SafetyValidationResult;
  /** Additional metadata */
  metadata?: Metadata;
}

/**
 * Context information for hook execution
 */
export interface HookContext {
  /** Current hook type being executed */
  currentHookType?: HookType;
  /** Execution depth for recursion detection */
  depth: number;
  /** Session identifier */
  sessionId: Id;
  /** Whether hooks should be skipped */
  skipHooks: boolean;
  /** Whether safe mode is enabled */
  safeMode: boolean;
  /** Environment variables */
  environment: Record<string, string>;
  /** Working directory */
  workingDirectory: FilePath;
  /** Parent process information */
  parentProcess?: ProcessInfo;
  /** Metadata */
  metadata?: Metadata;
}

/**
 * Process information
 */
export interface ProcessInfo {
  /** Process ID */
  pid: number;
  /** Parent process ID */
  ppid: number;
  /** Command line */
  command: string;
  /** Arguments */
  args: string[];
}

/**
 * Safety validation result
 */
export interface SafetyValidationResult {
  /** Whether the operation is safe */
  safe: boolean;
  /** Safety level assessment */
  level: SafetyLevel;
  /** Warning messages */
  warnings: SafetyMessage[];
  /** Error messages (blocking) */
  errors: SafetyMessage[];
  /** Recommendations */
  recommendations?: string[];
}

/**
 * Safety message interface
 */
export interface SafetyMessage {
  /** Type of safety issue */
  type: string;
  /** Human-readable message */
  message: string;
  /** Severity level */
  severity: LogLevel;
  /** Pattern that triggered the message */
  pattern?: string;
  /** Suggested fix */
  suggestion?: string;
}

// ================================
// AGENT CONFIGURATION INTERFACES
// ================================

/**
 * Agent configuration interface
 */
export interface AgentConfiguration {
  /** Unique agent identifier */
  id: Id;
  /** Display name */
  name: string;
  /** Agent type */
  type: AgentType;
  /** Capabilities list */
  capabilities: string[];
  /** Status */
  status: Status;
  /** Swarm identifier */
  swarmId: Id;
  /** Spawn timestamp */
  spawnedAt: ISODateString;
  /** Configuration options */
  options?: AgentOptions;
  /** Performance metrics */
  metrics?: AgentMetrics;
  /** Memory configuration */
  memory?: MemoryConfiguration;
}

/**
 * Agent options
 */
export interface AgentOptions {
  /** Enable autonomous learning */
  enableLearning?: boolean;
  /** Learning rate (0-1) */
  learningRate?: number;
  /** Cognitive pattern */
  cognitivePattern?: CognitivePattern;
  /** Enable persistent memory */
  enableMemory?: boolean;
  /** Maximum parallel tasks */
  maxParallelTasks?: number;
  /** Timeout for tasks */
  taskTimeout?: number;
}

/**
 * Cognitive patterns for agents
 */
export type CognitivePattern = 
  | 'convergent'
  | 'divergent'
  | 'lateral'
  | 'systems'
  | 'critical'
  | 'adaptive'
  | 'analytical'
  | 'creative'
  | 'structured';

/**
 * Agent performance metrics
 */
export interface AgentMetrics {
  /** Total tasks completed */
  tasksCompleted: number;
  /** Success rate (0-1) */
  successRate: number;
  /** Average task duration */
  averageDuration: number;
  /** Total execution time */
  totalExecutionTime: number;
  /** Error count */
  errorCount: number;
  /** Last active timestamp */
  lastActive: ISODateString;
  /** Performance score (0-1) */
  performanceScore?: number;
}

/**
 * Memory configuration for agents
 */
export interface MemoryConfiguration {
  /** Enable persistent memory */
  persistent: boolean;
  /** Memory store type */
  storeType: 'sqlite' | 'redis' | 'memory' | 'file';
  /** Maximum memory size */
  maxSize?: number;
  /** TTL for temporary entries */
  defaultTTL?: number;
  /** Namespace for memory entries */
  namespace?: string;
}

// ================================
// AUTOMATION WORKFLOW INTERFACES
// ================================

/**
 * Automation workflow configuration
 */
export interface AutomationWorkflow {
  /** Workflow identifier */
  id: Id;
  /** Workflow name */
  name: string;
  /** Description */
  description: string;
  /** Project type */
  projectType: ProjectType;
  /** Execution strategy */
  strategy: Strategy;
  /** Workflow phases */
  phases: WorkflowPhase[];
  /** Agent requirements */
  agentRequirements: AgentRequirement[];
  /** Dependencies between phases */
  dependencies?: WorkflowDependency[];
  /** Estimated duration */
  estimatedDuration?: string;
  /** Priority optimization */
  priority: Priority;
  /** Configuration options */
  options?: WorkflowOptions;
}

/**
 * Workflow phase definition
 */
export interface WorkflowPhase {
  /** Phase identifier */
  id: Id;
  /** Phase name */
  name: string;
  /** Description */
  description: string;
  /** Order in workflow */
  order: number;
  /** Required agent types */
  requiredAgents: AgentType[];
  /** Tasks in this phase */
  tasks: WorkflowTask[];
  /** Prerequisites */
  prerequisites?: string[];
  /** Deliverables */
  deliverables?: string[];
  /** Estimated duration */
  estimatedDuration?: string;
}

/**
 * Workflow task definition
 */
export interface WorkflowTask {
  /** Task identifier */
  id: Id;
  /** Task name */
  name: string;
  /** Description */
  description: string;
  /** Agent type responsible */
  assignedAgentType: AgentType;
  /** Status */
  status: Status;
  /** Dependencies */
  dependencies?: Id[];
  /** Estimated effort */
  estimatedEffort?: number;
  /** Actual effort */
  actualEffort?: number;
}

/**
 * Agent requirement specification
 */
export interface AgentRequirement {
  /** Agent type */
  type: AgentType;
  /** Number required */
  count: number;
  /** Reason for requirement */
  reason: string;
  /** Required capabilities */
  capabilities?: string[];
  /** Minimum performance score */
  minPerformanceScore?: number;
}

/**
 * Workflow dependency definition
 */
export interface WorkflowDependency {
  /** Source phase/task ID */
  sourceId: Id;
  /** Target phase/task ID */
  targetId: Id;
  /** Dependency type */
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
  /** Lag time */
  lag?: number;
}

/**
 * Workflow options
 */
export interface WorkflowOptions {
  /** Enable parallel execution where possible */
  parallelExecution: boolean;
  /** Auto-assign agents */
  autoAssignAgents: boolean;
  /** Progress tracking */
  trackProgress: boolean;
  /** Performance monitoring */
  monitorPerformance: boolean;
  /** Auto-recovery on failure */
  autoRecovery: boolean;
  /** Notification settings */
  notifications?: NotificationSettings;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  /** Enable notifications */
  enabled: boolean;
  /** Notification levels to send */
  levels: LogLevel[];
  /** Channels to send to */
  channels: string[];
  /** Format for notifications */
  format?: 'text' | 'json' | 'markdown';
}

// ================================
// FLAGS AND OPTIONS INTERFACES
// ================================

/**
 * Common CLI flags and options
 */
export interface BaseFlags {
  /** Show help */
  help?: boolean;
  /** Short help flag */
  h?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Short verbose flag */
  v?: boolean;
  /** Dry run mode */
  'dry-run'?: boolean;
  /** Force execution */
  force?: boolean;
  /** Quiet mode */
  quiet?: boolean;
  /** Skip confirmations */
  'skip-confirm'?: boolean;
}

/**
 * Hook-specific flags
 */
export interface HookFlags extends BaseFlags {
  /** Task description */
  description?: string;
  /** Task ID */
  'task-id'?: string;
  /** Agent ID */
  'agent-id'?: string;
  /** Auto-spawn agents */
  'auto-spawn-agents'?: boolean | string;
  /** File path */
  file?: FilePath;
  /** Operation type */
  operation?: string;
  /** Auto-assign agents */
  'auto-assign-agents'?: boolean;
  /** Load context */
  'load-context'?: boolean;
  /** Command to execute */
  command?: Command;
  /** Working directory */
  cwd?: FilePath;
  /** Validate safety */
  'validate-safety'?: boolean;
  /** Prepare resources */
  'prepare-resources'?: boolean;
  /** Memory key */
  'memory-key'?: string;
  /** Auto-format */
  format?: boolean;
  /** Update memory */
  'update-memory'?: boolean;
  /** Train neural patterns */
  'train-neural'?: boolean;
  /** Exit code */
  'exit-code'?: string;
  /** Command output */
  output?: string;
  /** Track metrics */
  'track-metrics'?: boolean;
  /** Store results */
  'store-results'?: boolean;
  /** Duration */
  duration?: number;
  /** Generate summary */
  'generate-summary'?: boolean | string;
  /** Persist state */
  'persist-state'?: boolean | string;
  /** Export metrics */
  'export-metrics'?: boolean;
  /** Session ID */
  'session-id'?: string;
  /** Load memory */
  'load-memory'?: boolean;
  /** Message */
  message?: string;
  /** Log level */
  level?: LogLevel;
  /** Swarm status */
  'swarm-status'?: string;
  /** Telemetry */
  telemetry?: boolean;
  /** Analyze performance */
  'analyze-performance'?: boolean | string;
  /** Cache results */
  'cache-results'?: boolean;
  /** Skip hooks */
  'skip-hooks'?: boolean;
  /** Safe mode */
  'safe-mode'?: boolean;
  /** Reset circuit breaker */
  'reset-circuit-breaker'?: boolean;
}

/**
 * Automation flags
 */
export interface AutomationFlags extends BaseFlags {
  /** Task complexity */
  'task-complexity'?: ComplexityLevel;
  /** Swarm ID */
  'swarm-id'?: string;
  /** Requirement description */
  requirement?: string;
  /** Maximum agents */
  'max-agents'?: number;
  /** Project type */
  'project-type'?: ProjectType;
  /** Priority */
  priority?: Priority;
}

/**
 * Swarm configuration flags
 */
export interface SwarmFlags extends BaseFlags {
  /** Topology type */
  topology?: 'mesh' | 'hierarchical' | 'ring' | 'star';
  /** Maximum agents */
  'max-agents'?: number;
  /** Strategy */
  strategy?: Strategy;
  /** Agent type */
  type?: AgentType;
  /** Agent name */
  name?: string;
  /** Capabilities */
  capabilities?: string[];
  /** Enable coordination */
  'enable-coordination'?: boolean;
  /** Enable learning */
  'enable-learning'?: boolean;
  /** Persistence mode */
  'persistence-mode'?: 'auto' | 'memory' | 'disk';
}

// ================================
// MEMORY AND STORAGE INTERFACES
// ================================

/**
 * Memory store entry
 */
export interface MemoryEntry<T = unknown> {
  /** Entry key */
  key: string;
  /** Entry value */
  value: T;
  /** Namespace */
  namespace?: string;
  /** Time-to-live in seconds */
  ttl?: number;
  /** Creation timestamp */
  createdAt: ISODateString;
  /** Last updated timestamp */
  updatedAt: ISODateString;
  /** Metadata */
  metadata?: Metadata;
}

/**
 * Memory store configuration
 */
export interface MemoryStoreConfiguration {
  /** Store type */
  type: 'sqlite' | 'redis' | 'memory' | 'file';
  /** Connection string or file path */
  connection?: string;
  /** Default TTL */
  defaultTTL?: number;
  /** Maximum entries */
  maxEntries?: number;
  /** Enable compression */
  compression?: boolean;
  /** Enable encryption */
  encryption?: boolean;
}

// ================================
// VALIDATION AND ERROR INTERFACES
// ================================

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error messages */
  errors: ValidationError[];
  /** Warning messages */
  warnings: ValidationWarning[];
  /** Info messages */
  info?: string[];
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Field that caused error */
  field?: string;
  /** Actual value */
  value?: unknown;
  /** Expected value or format */
  expected?: unknown;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;
  /** Warning message */
  message: string;
  /** Field that caused warning */
  field?: string;
  /** Suggestion */
  suggestion?: string;
}

// ================================
// UTILITY TYPE HELPERS
// ================================

/**
 * Make all properties optional
 */
export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Omit multiple properties
 */
export type OmitFields<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick multiple properties
 */
export type PickFields<T, K extends keyof T> = Pick<T, K>;

/**
 * Create a type with all string values
 */
export type StringKeys<T> = {
  [K in keyof T]: string;
};

/**
 * Event emitter interface for hooks
 */
export interface HookEventEmitter {
  /** Subscribe to hook events */
  on(event: HookType | 'error' | 'complete', listener: (...args: unknown[]) => void): void;
  /** Unsubscribe from hook events */
  off(event: HookType | 'error' | 'complete', listener: (...args: unknown[]) => void): void;
  /** Emit hook event */
  emit(event: HookType | 'error' | 'complete', ...args: unknown[]): boolean;
  /** One-time event listener */
  once(event: HookType | 'error' | 'complete', listener: (...args: unknown[]) => void): void;
}

// ================================
// EXPORTED TYPE UNIONS
// ================================

/**
 * All possible flag types
 */
export type AllFlags = BaseFlags & HookFlags & AutomationFlags & SwarmFlags;

/**
 * All configuration types
 */
export type Configuration = 
  | HookConfiguration 
  | AgentConfiguration 
  | AutomationWorkflow 
  | MemoryStoreConfiguration;

/**
 * All result types
 */
export type Result = 
  | HookExecutionResult 
  | SafetyValidationResult 
  | ValidationResult;

/**
 * All message types
 */
export type Message = SafetyMessage | ValidationError | ValidationWarning;

// ================================
// DEFAULT EXPORT
// ================================

/**
 * Main interface aggregating all hook system types
 */
export interface HookSystemTypes {
  // Enums
  HookType: typeof HookType;
  SafetyLevel: typeof SafetyLevel;
  ComplexityLevel: typeof ComplexityLevel;
  ProjectType: typeof ProjectType;
  AgentType: typeof AgentType;
  Status: typeof Status;
  LogLevel: typeof LogLevel;
  Priority: typeof Priority;
  Strategy: typeof Strategy;
  
  // Core interfaces
  HookConfiguration: HookConfiguration;
  HookExecutionResult: HookExecutionResult;
  HookContext: HookContext;
  SafetyValidationResult: SafetyValidationResult;
  
  // Agent interfaces
  AgentConfiguration: AgentConfiguration;
  AgentOptions: AgentOptions;
  AgentMetrics: AgentMetrics;
  
  // Workflow interfaces
  AutomationWorkflow: AutomationWorkflow;
  WorkflowPhase: WorkflowPhase;
  WorkflowTask: WorkflowTask;
  
  // Flags and options
  BaseFlags: BaseFlags;
  HookFlags: HookFlags;
  AutomationFlags: AutomationFlags;
  SwarmFlags: SwarmFlags;
  AllFlags: AllFlags;
}

export default HookSystemTypes;