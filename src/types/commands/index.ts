/**
 * Command Structure TypeScript Interfaces
 * For CLI commands, MCP tools, and system operations
 */

import { WorkflowDefinition, WorkflowExecution, RollbackPolicy } from '../workflow/index.js';
import { SparcPhase } from '../sparc/index.js';

// ===== Core Command Types =====

export interface Command {
  name: string;
  description: string;
  usage: string;
  handler: CommandHandler;
  options: CommandOption[];
  examples: CommandExample[];
  category: CommandCategory;
  aliases?: string[];
  hidden?: boolean;
  experimental?: boolean;
  deprecated?: boolean;
  since?: string;
  permissions?: Permission[];
}

export type CommandHandler = (
  args: string[],
  flags: Record<string, any>,
  context: CommandContext
) => Promise<CommandResult>;

export interface CommandOption {
  name: string;
  alias?: string;
  type: OptionType;
  description: string;
  required?: boolean;
  default?: any;
  choices?: string[];
  validation?: ValidationRule;
  hidden?: boolean;
  experimental?: boolean;
}

export type OptionType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'choice'
  | 'file'
  | 'directory'
  | 'url'
  | 'email'
  | 'json'
  | 'regex';

export interface ValidationRule {
  type: ValidationType;
  pattern?: string;
  min?: number;
  max?: number;
  message?: string;
  custom?: (value: any) => boolean | string;
}

export type ValidationType = 
  | 'required'
  | 'pattern'
  | 'range'
  | 'length'
  | 'format'
  | 'exists'
  | 'custom';

export interface CommandExample {
  description: string;
  command: string;
  output?: string;
  notes?: string;
}

export type CommandCategory = 
  | 'core'
  | 'sparc'
  | 'workflow'
  | 'agent'
  | 'memory'
  | 'monitoring'
  | 'config'
  | 'dev'
  | 'admin'
  | 'experimental';

export interface Permission {
  type: PermissionType;
  level: PermissionLevel;
  resource?: string;
  condition?: string;
}

export type PermissionType = 
  | 'read'
  | 'write'
  | 'execute'
  | 'admin'
  | 'system';

export type PermissionLevel = 
  | 'none'
  | 'read'
  | 'write'
  | 'admin'
  | 'root';

export interface CommandContext {
  user: string;
  workingDirectory: string;
  environment: string;
  session: SessionInfo;
  configuration: Configuration;
  permissions: Permission[];
  logger: Logger;
  memory: MemoryContext;
}

export interface SessionInfo {
  id: string;
  startTime: Date;
  user: string;
  ip?: string;
  userAgent?: string;
  environment: string;
  capabilities: string[];
}

export interface Configuration {
  system: SystemConfig;
  user: UserConfig;
  project: ProjectConfig;
  environment: EnvironmentConfig;
}

export interface SystemConfig {
  version: string;
  build: string;
  platform: string;
  nodeVersion: string;
  paths: SystemPaths;
  limits: SystemLimits;
  features: FeatureFlags;
}

export interface SystemPaths {
  home: string;
  config: string;
  data: string;
  cache: string;
  logs: string;
  temp: string;
}

export interface SystemLimits {
  memory: number;
  processes: number;
  timeout: number;
  fileSize: number;
  concurrent: number;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface UserConfig {
  name: string;
  email: string;
  preferences: UserPreferences;
  permissions: Permission[];
  quotas: UserQuotas;
}

export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  format: FormatPreferences;
  notifications: NotificationPreferences;
}

export interface FormatPreferences {
  date: string;
  time: string;
  number: string;
  currency: string;
}

export interface NotificationPreferences {
  email: boolean;
  slack: boolean;
  webhook: boolean;
  levels: NotificationLevel[];
}

export type NotificationLevel = 
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';

export interface UserQuotas {
  storage: number;
  bandwidth: number;
  requests: number;
  concurrency: number;
  duration: number;
}

export interface ProjectConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repository: string;
  dependencies: Dependency[];
  scripts: Record<string, string>;
  settings: ProjectSettings;
}

export interface Dependency {
  name: string;
  version: string;
  type: DependencyType;
  required: boolean;
  development: boolean;
}

export type DependencyType = 
  | 'npm'
  | 'system'
  | 'binary'
  | 'service'
  | 'plugin';

export interface ProjectSettings {
  sparc: SparcSettings;
  workflow: WorkflowSettings;
  agents: AgentSettings;
  memory: MemorySettings;
  monitoring: MonitoringSettings;
}

export interface SparcSettings {
  enabled: boolean;
  defaultMode: string;
  timeout: number;
  outputDir: string;
  template: string;
  validation: ValidationSettings;
}

export interface ValidationSettings {
  enabled: boolean;
  strict: boolean;
  rules: ValidationRule[];
}

export interface WorkflowSettings {
  enabled: boolean;
  maxConcurrent: number;
  timeout: number;
  retryPolicy: RetryPolicy;
  monitoring: boolean;
}

export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: BackoffStrategy;
  retryableErrors: string[];
}

export type BackoffStrategy = 
  | 'fixed'
  | 'exponential'
  | 'linear'
  | 'custom';

export interface AgentSettings {
  enabled: boolean;
  maxAgents: number;
  defaultType: string;
  timeout: number;
  isolation: IsolationSettings;
}

export interface IsolationSettings {
  enabled: boolean;
  level: IsolationLevel;
  networking: boolean;
  filesystem: boolean;
}

export type IsolationLevel = 
  | 'none'
  | 'process'
  | 'container'
  | 'vm';

export interface MemorySettings {
  enabled: boolean;
  namespace: string;
  ttl: number;
  compression: boolean;
  encryption: boolean;
}

export interface MonitoringSettings {
  enabled: boolean;
  interval: number;
  metrics: string[];
  alerts: AlertSettings[];
  retention: number;
}

export interface AlertSettings {
  name: string;
  condition: string;
  threshold: number;
  action: AlertAction;
  cooldown: number;
}

export interface AlertAction {
  type: AlertActionType;
  parameters: Record<string, any>;
}

export type AlertActionType = 
  | 'log'
  | 'email'
  | 'webhook'
  | 'slack'
  | 'sms';

export interface EnvironmentConfig {
  name: string;
  type: EnvironmentType;
  variables: Record<string, string>;
  secrets: Record<string, string>;
  services: ServiceConfig[];
}

export type EnvironmentType = 
  | 'development'
  | 'testing'
  | 'staging'
  | 'production'
  | 'custom';

export interface ServiceConfig {
  name: string;
  type: ServiceType;
  url: string;
  credentials: ServiceCredentials;
  timeout: number;
  retries: number;
}

export type ServiceType = 
  | 'database'
  | 'cache'
  | 'message_queue'
  | 'api'
  | 'monitoring'
  | 'logging'
  | 'custom';

export interface ServiceCredentials {
  type: CredentialType;
  username?: string;
  password?: string;
  token?: string;
  certificate?: string;
  keyFile?: string;
}

export type CredentialType = 
  | 'none'
  | 'basic'
  | 'bearer'
  | 'oauth'
  | 'certificate'
  | 'key'
  | 'custom';

export interface Logger {
  trace: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  fatal: (message: string, data?: any) => void;
}

export interface MemoryContext {
  namespace: string;
  ttl: number;
  compression: boolean;
  encryption: boolean;
}

export interface CommandResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: CommandError;
  metadata?: ResultMetadata;
}

export interface CommandError {
  code: string;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  details?: Record<string, any>;
  stackTrace?: string;
  suggestions?: string[];
}

export type ErrorType = 
  | 'validation'
  | 'permission'
  | 'not_found'
  | 'conflict'
  | 'timeout'
  | 'network'
  | 'system'
  | 'user'
  | 'internal';

export type ErrorSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface ResultMetadata {
  timestamp: Date;
  duration: number;
  resources: ResourceUsage[];
  warnings: string[];
  debugInfo?: Record<string, any>;
}

export interface ResourceUsage {
  type: ResourceType;
  used: number;
  unit: string;
  peak?: number;
}

export type ResourceType = 
  | 'memory'
  | 'cpu'
  | 'disk'
  | 'network'
  | 'time'
  | 'custom';

// ===== Command Registry Types =====

export interface CommandRegistry {
  commands: Map<string, Command>;
  aliases: Map<string, string>;
  categories: Map<CommandCategory, Command[]>;
  middleware: CommandMiddleware[];
  hooks: CommandHook[];
}

export interface CommandMiddleware {
  name: string;
  order: number;
  handler: MiddlewareHandler;
  enabled: boolean;
}

export type MiddlewareHandler = (
  command: Command,
  args: string[],
  flags: Record<string, any>,
  context: CommandContext,
  next: () => Promise<CommandResult>
) => Promise<CommandResult>;

export interface CommandHook {
  name: string;
  type: HookType;
  handler: HookHandler;
  enabled: boolean;
  order?: number;
}

export type HookType = 
  | 'before_command'
  | 'after_command'
  | 'before_parse'
  | 'after_parse'
  | 'on_error'
  | 'on_success';

export type HookHandler = (
  event: HookEvent
) => Promise<void>;

export interface HookEvent {
  type: HookType;
  command: Command;
  args: string[];
  flags: Record<string, any>;
  context: CommandContext;
  result?: CommandResult;
  error?: CommandError;
  timestamp: Date;
}

// ===== Specific Command Types =====

export interface InitCommand extends Command {
  name: 'init';
  handler: InitCommandHandler;
  options: InitCommandOptions[];
}

export type InitCommandHandler = (
  args: string[],
  flags: InitCommandFlags,
  context: CommandContext
) => Promise<InitCommandResult>;

export interface InitCommandOptions extends CommandOption {
  name: 'force' | 'minimal' | 'sparc' | 'template' | 'output';
}

export interface InitCommandFlags {
  force?: boolean;
  minimal?: boolean;
  sparc?: boolean;
  template?: string;
  output?: string;
}

export interface InitCommandResult extends CommandResult {
  data: InitResult;
}

export interface InitResult {
  filesCreated: string[];
  filesUpdated: string[];
  configuration: Configuration;
  recommendations: string[];
}

export interface SparcCommand extends Command {
  name: 'sparc';
  handler: SparcCommandHandler;
  options: SparcCommandOptions[];
}

export type SparcCommandHandler = (
  args: string[],
  flags: SparcCommandFlags,
  context: CommandContext
) => Promise<SparcCommandResult>;

export interface SparcCommandOptions extends CommandOption {
  name: 'mode' | 'output' | 'verbose' | 'interactive' | 'timeout';
}

export interface SparcCommandFlags {
  mode?: string;
  output?: string;
  verbose?: boolean;
  interactive?: boolean;
  timeout?: number;
}

export interface SparcCommandResult extends CommandResult {
  data: SparcResult;
}

export interface SparcResult {
  phase: SparcPhase;
  artifacts: string[];
  metrics: SparcMetrics;
  recommendations: string[];
}

export interface SparcMetrics {
  duration: number;
  phases: PhaseMetrics[];
  quality: QualityMetrics;
  performance: PerformanceMetrics;
}

export interface PhaseMetrics {
  phase: string;
  duration: number;
  artifacts: number;
  errors: number;
  warnings: number;
}

export interface QualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  maintainability: number;
}

export interface PerformanceMetrics {
  throughput: number;
  latency: number;
  resourceUsage: ResourceUsage[];
  efficiency: number;
}

export interface SwarmCommand extends Command {
  name: 'swarm';
  handler: SwarmCommandHandler;
  options: SwarmCommandOptions[];
}

export type SwarmCommandHandler = (
  args: string[],
  flags: SwarmCommandFlags,
  context: CommandContext
) => Promise<SwarmCommandResult>;

export interface SwarmCommandOptions extends CommandOption {
  name: 'strategy' | 'mode' | 'max-agents' | 'timeout' | 'parallel' | 'monitor';
}

export interface SwarmCommandFlags {
  strategy?: string;
  mode?: string;
  'max-agents'?: number;
  timeout?: number;
  parallel?: boolean;
  monitor?: boolean;
}

export interface SwarmCommandResult extends CommandResult {
  data: SwarmResult;
}

export interface SwarmResult {
  swarmId: string;
  agents: AgentInfo[];
  execution: WorkflowExecution;
  metrics: SwarmMetrics;
}

export interface AgentInfo {
  id: string;
  type: string;
  name: string;
  status: string;
  capabilities: string[];
  tasks: TaskInfo[];
}

export interface TaskInfo {
  id: string;
  name: string;
  status: string;
  duration: number;
  result?: any;
  error?: string;
}

export interface SwarmMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskDuration: number;
  throughput: number;
  efficiency: number;
}

export interface MemoryCommand extends Command {
  name: 'memory';
  handler: MemoryCommandHandler;
  options: MemoryCommandOptions[];
}

export type MemoryCommandHandler = (
  args: string[],
  flags: MemoryCommandFlags,
  context: CommandContext
) => Promise<MemoryCommandResult>;

export interface MemoryCommandOptions extends CommandOption {
  name: 'namespace' | 'ttl' | 'format' | 'compression' | 'encryption';
}

export interface MemoryCommandFlags {
  namespace?: string;
  ttl?: number;
  format?: string;
  compression?: boolean;
  encryption?: boolean;
}

export interface MemoryCommandResult extends CommandResult {
  data: MemoryResult;
}

export interface MemoryResult {
  action: MemoryAction;
  key?: string;
  value?: any;
  results?: MemoryEntry[];
  stats?: MemoryStats;
}

export type MemoryAction = 
  | 'store'
  | 'retrieve'
  | 'delete'
  | 'list'
  | 'search'
  | 'stats'
  | 'export'
  | 'import';

export interface MemoryEntry {
  key: string;
  value: any;
  timestamp: Date;
  ttl?: number;
  size: number;
  namespace: string;
}

export interface MemoryStats {
  totalKeys: number;
  totalSize: number;
  namespaces: Record<string, NamespaceStats>;
  cacheHitRate: number;
  averageKeySize: number;
}

export interface NamespaceStats {
  keys: number;
  size: number;
  hitRate: number;
  avgTtl: number;
}

export interface StatusCommand extends Command {
  name: 'status';
  handler: StatusCommandHandler;
  options: StatusCommandOptions[];
}

export type StatusCommandHandler = (
  args: string[],
  flags: StatusCommandFlags,
  context: CommandContext
) => Promise<StatusCommandResult>;

export interface StatusCommandOptions extends CommandOption {
  name: 'verbose' | 'json' | 'watch' | 'components';
}

export interface StatusCommandFlags {
  verbose?: boolean;
  json?: boolean;
  watch?: boolean;
  components?: string[];
}

export interface StatusCommandResult extends CommandResult {
  data: StatusResult;
}

export interface StatusResult {
  system: SystemStatus;
  services: ServiceStatus[];
  agents: AgentStatus[];
  workflows: WorkflowStatus[];
  memory: MemoryStatus;
  metrics: SystemMetrics;
}

export interface SystemStatus {
  version: string;
  uptime: number;
  platform: string;
  nodeVersion: string;
  memory: MemoryInfo;
  cpu: CpuInfo;
  disk: DiskInfo;
  network: NetworkInfo;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  cached: number;
  buffers: number;
  unit: string;
}

export interface CpuInfo {
  model: string;
  cores: number;
  usage: number;
  loadAverage: number[];
  frequency: number;
}

export interface DiskInfo {
  total: number;
  used: number;
  free: number;
  usage: number;
  unit: string;
}

export interface NetworkInfo {
  interfaces: NetworkInterface[];
  connections: number;
  bytesIn: number;
  bytesOut: number;
}

export interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
}

export interface ServiceStatus {
  name: string;
  type: ServiceType;
  status: ServiceStatusType;
  url?: string;
  health: HealthStatus;
  metrics: ServiceMetrics;
}

export type ServiceStatusType = 
  | 'running'
  | 'stopped'
  | 'starting'
  | 'stopping'
  | 'error'
  | 'unknown';

export interface HealthStatus {
  status: HealthStatusType;
  checks: HealthCheck[];
  lastCheck: Date;
  uptime: number;
}

export type HealthStatusType = 
  | 'healthy'
  | 'unhealthy'
  | 'degraded'
  | 'unknown';

export interface HealthCheck {
  name: string;
  status: HealthStatusType;
  duration: number;
  message?: string;
  timestamp: Date;
}

export interface ServiceMetrics {
  requests: number;
  errors: number;
  averageResponseTime: number;
  throughput: number;
  availability: number;
}

export interface AgentStatus {
  id: string;
  type: string;
  name: string;
  status: AgentStatusType;
  capabilities: string[];
  currentTask?: string;
  metrics: AgentMetrics;
}

export type AgentStatusType = 
  | 'idle'
  | 'busy'
  | 'waiting'
  | 'error'
  | 'terminated';

export interface AgentMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  averageTaskDuration: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  status: WorkflowStatusType;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  progress: number;
  phases: PhaseStatus[];
  metrics: WorkflowMetrics;
}

export type WorkflowStatusType = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface PhaseStatus {
  id: string;
  name: string;
  status: PhaseStatusType;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  tasks: TaskStatus[];
}

export type PhaseStatusType = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

export interface TaskStatus {
  id: string;
  name: string;
  status: TaskStatusType;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  agent?: string;
  error?: string;
}

export type TaskStatusType = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export interface WorkflowMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskDuration: number;
  throughput: number;
  efficiency: number;
}

export interface MemoryStatus {
  enabled: boolean;
  namespace: string;
  totalKeys: number;
  totalSize: number;
  cacheHitRate: number;
  connections: number;
  health: HealthStatus;
}

export interface SystemMetrics {
  uptime: number;
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  averageCommandDuration: number;
  resourceUsage: ResourceUsage[];
  performance: PerformanceMetrics;
}

// ===== MCP Tool Types =====

export interface McpTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  handler: ToolHandler;
  metadata: ToolMetadata;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, PropertySchema>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface PropertySchema {
  type: PropertyType;
  description: string;
  enum?: any[];
  default?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
}

export type PropertyType = 
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null';

export type ToolHandler = (
  params: Record<string, any>,
  context: ToolContext
) => Promise<ToolResult>;

export interface ToolContext {
  sessionId: string;
  userId: string;
  permissions: Permission[];
  memory: MemoryContext;
  logger: Logger;
  configuration: Configuration;
}

export interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
  metadata?: ToolResultMetadata;
}

export interface ToolContent {
  type: ContentType;
  text?: string;
  data?: any;
  mimeType?: string;
  encoding?: string;
}

export type ContentType = 
  | 'text'
  | 'json'
  | 'xml'
  | 'html'
  | 'markdown'
  | 'csv'
  | 'binary'
  | 'image'
  | 'audio'
  | 'video';

export interface ToolResultMetadata {
  timestamp: Date;
  duration: number;
  resources: ResourceUsage[];
  cacheHit?: boolean;
  warnings?: string[];
}

export interface ToolMetadata {
  category: ToolCategory;
  version: string;
  author: string;
  created: Date;
  modified: Date;
  tags: string[];
  experimental?: boolean;
  deprecated?: boolean;
  permissions?: Permission[];
}

export type ToolCategory = 
  | 'swarm'
  | 'neural'
  | 'memory'
  | 'analysis'
  | 'workflow'
  | 'system'
  | 'utility'
  | 'custom';

// ===== Batch Operations =====

export interface BatchOperation {
  id: string;
  name: string;
  description: string;
  operations: Operation[];
  strategy: BatchStrategy;
  configuration: BatchConfiguration;
  status: BatchStatus;
  results: BatchResult[];
  metrics: BatchMetrics;
}

export interface Operation {
  id: string;
  type: OperationType;
  name: string;
  description: string;
  parameters: Record<string, any>;
  dependencies: string[];
  timeout: number;
  retryPolicy: RetryPolicy;
  rollbackPolicy: RollbackPolicy;
}

export type OperationType = 
  | 'command'
  | 'tool'
  | 'workflow'
  | 'agent'
  | 'memory'
  | 'file'
  | 'network'
  | 'custom';

export interface BatchStrategy {
  type: BatchStrategyType;
  maxConcurrency: number;
  failureHandling: FailureHandling;
  ordering: OrderingStrategy;
  timeout: number;
}

export type BatchStrategyType = 
  | 'sequential'
  | 'parallel'
  | 'pipeline'
  | 'adaptive'
  | 'custom';

export interface FailureHandling {
  strategy: FailureStrategy;
  maxFailures: number;
  rollbackOnFailure: boolean;
  continueOnError: boolean;
}

export type FailureStrategy = 
  | 'fail_fast'
  | 'fail_after_threshold'
  | 'continue_all'
  | 'retry_failed'
  | 'manual';

export interface OrderingStrategy {
  type: OrderingType;
  dependencies: boolean;
  priority: boolean;
  resourceOptimization: boolean;
}

export type OrderingType = 
  | 'sequential'
  | 'dependency'
  | 'priority'
  | 'resource'
  | 'custom';

export interface BatchConfiguration {
  timeout: number;
  retryAttempts: number;
  backoffStrategy: BackoffStrategy;
  resourceLimits: ResourceLimits;
  monitoring: BatchMonitoring;
}

export interface ResourceLimits {
  memory: number;
  cpu: number;
  concurrency: number;
  duration: number;
}

export interface BatchMonitoring {
  enabled: boolean;
  interval: number;
  metrics: string[];
  notifications: NotificationConfig[];
}

export interface NotificationConfig {
  type: NotificationType;
  events: NotificationEvent[];
  destinations: string[];
  template: string;
}

export type NotificationType = 
  | 'email'
  | 'slack'
  | 'webhook'
  | 'sms'
  | 'desktop';

export type NotificationEvent = 
  | 'started'
  | 'completed'
  | 'failed'
  | 'progress'
  | 'warning'
  | 'error';

export interface BatchStatus {
  status: BatchStatusType;
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  totalOperations: number;
  completedOperations: number;
  failedOperations: number;
  skippedOperations: number;
}

export type BatchStatusType = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface BatchResult {
  operationId: string;
  status: OperationStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: CommandError;
  metrics: OperationMetrics;
}

export interface OperationStatus {
  status: OperationStatusType;
  progress: number;
  message?: string;
  retryCount: number;
}

export type OperationStatusType = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled'
  | 'retrying';

export interface OperationMetrics {
  executionTime: number;
  waitTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkUsage: number;
  cacheHits: number;
  cacheMisses: number;
}

export interface BatchMetrics {
  totalDuration: number;
  totalWaitTime: number;
  totalExecutionTime: number;
  averageOperationDuration: number;
  throughput: number;
  efficiency: number;
  resourceUtilization: ResourceUsage[];
  errorRate: number;
  successRate: number;
}