// sparc-types.ts - Comprehensive TypeScript types for SPARC system

/**
 * Base SPARC configuration interface
 */
export interface SparcConfig {
  version: string;
  modes: SparcMode[];
  workflows: SparcWorkflow[];
  settings: SparcSettings;
  templates?: SparcTemplate[];
}

/**
 * SPARC mode definition
 */
export interface SparcMode {
  slug: string;
  name: string;
  description?: string;
  roleDefinition: string;
  customInstructions: string;
  category: SparcModeCategory;
  priority: SparcPriority;
  tags: string[];
  groups?: SparcToolGroup[];
  dependencies?: string[];
  orchestrationFunction?: string;
  metadata?: SparcModeMetadata;
}

/**
 * SPARC mode categories
 */
export type SparcModeCategory = 
  | 'core'
  | 'development'
  | 'testing'
  | 'deployment'
  | 'monitoring'
  | 'security'
  | 'documentation'
  | 'integration'
  | 'optimization'
  | 'research'
  | 'orchestration';

/**
 * Priority levels for SPARC operations
 */
export type SparcPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * SPARC mode metadata
 */
export interface SparcModeMetadata {
  version?: string;
  author?: string;
  created?: string;
  lastModified?: string;
  estimatedDuration?: string;
  complexity?: 'simple' | 'moderate' | 'complex' | 'expert';
  prerequisites?: string[];
  outputs?: string[];
}

/**
 * Tool group configuration
 */
export type SparcToolGroup = string | [string, SparcToolConfig?];

/**
 * Tool configuration for SPARC modes
 */
export interface SparcToolConfig {
  description?: string;
  fileRegex?: string;
  enabled?: boolean;
  parameters?: Record<string, any>;
  restrictions?: string[];
  timeout?: number;
}

/**
 * SPARC workflow definition
 */
export interface SparcWorkflow {
  id: string;
  name: string;
  description: string;
  phases: SparcWorkflowPhase[];
  metadata?: SparcWorkflowMetadata;
}

/**
 * SPARC workflow phase
 */
export interface SparcWorkflowPhase {
  id: string;
  name: string;
  description: string;
  mode: string;
  tasks: SparcTask[];
  dependencies?: string[];
  parallel?: boolean;
  optional?: boolean;
  timeout?: number;
}

/**
 * SPARC task definition
 */
export interface SparcTask {
  id: string;
  name: string;
  description: string;
  command?: string;
  mode?: string;
  priority: SparcPriority;
  estimatedTime?: string;
  dependencies?: string[];
  deliverables?: string[];
  validation?: SparcTaskValidation;
}

/**
 * Task validation criteria
 */
export interface SparcTaskValidation {
  criteria: string[];
  fileChecks?: SparcFileCheck[];
  commandChecks?: string[];
  qualityGates?: SparcQualityGate[];
}

/**
 * File validation check
 */
export interface SparcFileCheck {
  path: string;
  exists: boolean;
  maxLines?: number;
  contains?: string[];
  excludes?: string[];
}

/**
 * Quality gate definition
 */
export interface SparcQualityGate {
  name: string;
  type: 'file_size' | 'test_coverage' | 'security_scan' | 'code_quality' | 'custom';
  threshold?: number;
  command?: string;
  required: boolean;
}

/**
 * SPARC workflow metadata
 */
export interface SparcWorkflowMetadata {
  version?: string;
  author?: string;
  created?: string;
  lastModified?: string;
  estimatedDuration?: string;
  complexity?: 'simple' | 'moderate' | 'complex' | 'expert';
  tags?: string[];
}

/**
 * SPARC settings configuration
 */
export interface SparcSettings {
  defaultMode?: string;
  memoryNamespace?: string;
  parallelExecution: boolean;
  maxConcurrentTasks: number;
  timeouts: SparcTimeouts;
  qualityChecks: SparcQualityChecks;
  notifications: SparcNotificationSettings;
  paths: SparcPathSettings;
}

/**
 * Timeout configurations
 */
export interface SparcTimeouts {
  defaultTask: number;
  orchestration: number;
  batchTool: number;
  memoryOperation: number;
}

/**
 * Quality check settings
 */
export interface SparcQualityChecks {
  enforceFileSize: boolean;
  maxFileLines: number;
  requireTests: boolean;
  securityScan: boolean;
  codeFormatting: boolean;
  documentation: boolean;
}

/**
 * Notification settings
 */
export interface SparcNotificationSettings {
  enabled: boolean;
  levels: ('info' | 'warning' | 'error' | 'success')[];
  channels: SparcNotificationChannel[];
}

/**
 * Notification channel configuration
 */
export interface SparcNotificationChannel {
  type: 'console' | 'file' | 'webhook' | 'email';
  config: Record<string, any>;
  filters?: string[];
}

/**
 * Path settings for SPARC operations
 */
export interface SparcPathSettings {
  workingDirectory: string;
  tempDirectory: string;
  outputDirectory: string;
  templatesDirectory: string;
  modesDirectory: string;
  workflowsDirectory: string;
}

/**
 * SPARC template definition
 */
export interface SparcTemplate {
  id: string;
  name: string;
  description: string;
  type: SparcTemplateType;
  content: string;
  variables?: SparcTemplateVariable[];
  metadata?: SparcTemplateMetadata;
}

/**
 * Template types
 */
export type SparcTemplateType = 
  | 'mode'
  | 'workflow'
  | 'command'
  | 'documentation'
  | 'configuration'
  | 'script';

/**
 * Template variable definition
 */
export interface SparcTemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  validation?: string;
}

/**
 * Template metadata
 */
export interface SparcTemplateMetadata {
  version?: string;
  author?: string;
  created?: string;
  lastModified?: string;
  category?: string;
  tags?: string[];
  usage?: string;
}

/**
 * SPARC execution context
 */
export interface SparcExecutionContext {
  sessionId: string;
  workingDirectory: string;
  taskDescription: string;
  memoryNamespace: string;
  mode: SparcMode;
  workflow?: SparcWorkflow;
  startTime: string;
  settings: SparcSettings;
  environment: Record<string, string>;
}

/**
 * SPARC execution result
 */
export interface SparcExecutionResult {
  success: boolean;
  sessionId: string;
  mode: string;
  taskDescription: string;
  startTime: string;
  endTime: string;
  duration: number;
  deliverables: SparcDeliverable[];
  errors?: SparcError[];
  warnings?: SparcWarning[];
  metrics: SparcExecutionMetrics;
}

/**
 * SPARC deliverable
 */
export interface SparcDeliverable {
  type: 'file' | 'directory' | 'command_output' | 'documentation' | 'test_result';
  path: string;
  description: string;
  size?: number;
  checksum?: string;
  metadata?: Record<string, any>;
}

/**
 * SPARC error
 */
export interface SparcError {
  code: string;
  message: string;
  phase?: string;
  task?: string;
  timestamp: string;
  details?: Record<string, any>;
}

/**
 * SPARC warning
 */
export interface SparcWarning {
  code: string;
  message: string;
  phase?: string;
  task?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Execution metrics
 */
export interface SparcExecutionMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  skippedTasks: number;
  linesOfCode: number;
  filesCreated: number;
  testsRun: number;
  testsPassed: number;
  securityIssues: number;
  qualityScore: number;
  memoryOperations: number;
  parallelExecutions: number;
}

/**
 * BatchTool configuration for SPARC
 */
export interface SparcBatchToolConfig {
  name: string;
  pattern: 'boomerang' | 'parallel' | 'sequential' | 'hybrid';
  phases: SparcBatchToolPhase[];
  monitoring: boolean;
  dashboard: boolean;
  retryPolicy?: SparcRetryPolicy;
}

/**
 * BatchTool phase configuration
 */
export interface SparcBatchToolPhase {
  id: string;
  name: string;
  type: 'parallel' | 'sequential';
  commands: SparcBatchToolCommand[];
  dependencies?: string[];
  timeout?: number;
  retryCount?: number;
}

/**
 * BatchTool command configuration
 */
export interface SparcBatchToolCommand {
  id: string;
  command: string;
  mode?: string;
  timeout?: number;
  retryCount?: number;
  environment?: Record<string, string>;
  workingDirectory?: string;
}

/**
 * Retry policy configuration
 */
export interface SparcRetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  baseDelay: number;
  maxDelay: number;
  retryConditions: string[];
}

/**
 * Memory operation types for SPARC
 */
export interface SparcMemoryOperation {
  type: 'store' | 'retrieve' | 'query' | 'list' | 'delete' | 'backup' | 'restore';
  namespace: string;
  key?: string;
  value?: any;
  query?: string;
  limit?: number;
  filters?: Record<string, any>;
  timestamp: string;
}

/**
 * Memory entry structure
 */
export interface SparcMemoryEntry {
  id: string;
  namespace: string;
  key: string;
  value: any;
  created: string;
  lastModified: string;
  tags?: string[];
  metadata?: Record<string, any>;
  expiresAt?: string;
}

/**
 * Performance monitoring data
 */
export interface SparcPerformanceMetrics {
  sessionId: string;
  mode: string;
  phase?: string;
  task?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  memoryUsage: number;
  cpuUsage: number;
  diskIO: number;
  networkIO: number;
  tokenUsage?: number;
  apiCalls?: number;
}

/**
 * SPARC system status
 */
export interface SparcSystemStatus {
  version: string;
  uptime: string;
  activeSessions: number;
  totalModes: number;
  totalWorkflows: number;
  memoryUsage: SparcMemoryUsage;
  performance: SparcSystemPerformance;
  health: SparcHealthStatus;
}

/**
 * Memory usage statistics
 */
export interface SparcMemoryUsage {
  totalEntries: number;
  totalSize: number;
  namespaces: Record<string, number>;
  oldestEntry?: string;
  newestEntry?: string;
}

/**
 * System performance metrics
 */
export interface SparcSystemPerformance {
  averageTaskDuration: number;
  successRate: number;
  parallelEfficiency: number;
  memoryEfficiency: number;
  throughput: number;
}

/**
 * Health status
 */
export interface SparcHealthStatus {
  overall: 'healthy' | 'warning' | 'critical' | 'unknown';
  components: Record<string, 'healthy' | 'warning' | 'critical' | 'unknown'>;
  lastCheck: string;
  issues?: string[];
}

/**
 * Configuration validation result
 */
export interface SparcValidationResult {
  valid: boolean;
  errors: SparcError[];
  warnings: SparcWarning[];
  suggestions?: string[];
}

/**
 * Export configuration for external tools
 */
export interface SparcExportConfig {
  format: 'json' | 'yaml' | 'toml' | 'env';
  includeMetadata: boolean;
  includeSecrets: boolean;
  filterModes?: string[];
  filterWorkflows?: string[];
}

/**
 * Import configuration for external tools
 */
export interface SparcImportConfig {
  format: 'json' | 'yaml' | 'toml' | 'env';
  merge: boolean;
  overwrite: boolean;
  validate: boolean;
  backup: boolean;
}

/**
 * Plugin interface for extending SPARC
 */
export interface SparcPlugin {
  name: string;
  version: string;
  description: string;
  hooks: SparcPluginHooks;
  commands?: SparcPluginCommand[];
  modes?: SparcMode[];
  workflows?: SparcWorkflow[];
}

/**
 * Plugin hooks
 */
export interface SparcPluginHooks {
  beforeExecution?: (context: SparcExecutionContext) => Promise<void>;
  afterExecution?: (result: SparcExecutionResult) => Promise<void>;
  beforePhase?: (phase: SparcWorkflowPhase, context: SparcExecutionContext) => Promise<void>;
  afterPhase?: (phase: SparcWorkflowPhase, result: any) => Promise<void>;
  onError?: (error: SparcError, context: SparcExecutionContext) => Promise<void>;
}

/**
 * Plugin command
 */
export interface SparcPluginCommand {
  name: string;
  description: string;
  handler: (args: string[], context: SparcExecutionContext) => Promise<any>;
  options?: SparcPluginCommandOption[];
}

/**
 * Plugin command option
 */
export interface SparcPluginCommandOption {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
}