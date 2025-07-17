/**
 * TypeScript type definitions for batch initialization features
 * Generated for conversion from JavaScript to TypeScript
 */

// ============================================================================
// BATCH PROGRESS TRACKING TYPES
// ============================================================================

export interface BatchProgressReport {
  total: number;
  completed: number;
  failed: number;
  elapsedTime: number;
  successRate: string;
}

export interface BatchProgressTracker {
  totalProjects: number;
  completed: number;
  failed: number;
  inProgress: Map<string, number>;
  startTime: number;
  
  startProject(projectName: string): void;
  completeProject(projectName: string, success?: boolean): void;
  updateDisplay(): void;
  getProgressBar(progress: number): string;
  getReport(): BatchProgressReport;
}

// ============================================================================
// RESOURCE MANAGEMENT TYPES
// ============================================================================

export interface ResourceManager {
  maxConcurrency: number;
  maxMemoryMB: number;
  activeTasks: Set<string>;
  memoryUsage: number;
  
  canStartTask(): boolean;
  startTask(taskId: string): void;
  completeTask(taskId: string): void;
  getMemoryUsage(): number;
  cleanup(): void;
}

export interface ResourceLimits {
  maxConcurrency: number;
  maxMemoryMB: number;
  maxDiskGB?: number;
  maxCpuPercent?: number;
}

// ============================================================================
// PROJECT TEMPLATE TYPES
// ============================================================================

export interface ProjectTemplate {
  name: string;
  description: string;
  extraDirs?: string[];
  extraFiles?: { [filename: string]: ProjectTemplateFile };
}

export interface ProjectTemplateFile {
  name?: string;
  version?: string;
  type?: string;
  scripts?: { [scriptName: string]: string };
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  content?: string;
  [key: string]: any;
}

export interface ProjectTemplates {
  'web-api': ProjectTemplate;
  'react-app': ProjectTemplate;
  'node-cli': ProjectTemplate;
  'express-server': ProjectTemplate;
  'next-app': ProjectTemplate;
  'vue-app': ProjectTemplate;
  'python-api': ProjectTemplate;
  'go-service': ProjectTemplate;
  'rust-cli': ProjectTemplate;
  'minimal': ProjectTemplate;
  [templateName: string]: ProjectTemplate;
}

// ============================================================================
// ENVIRONMENT CONFIGURATION TYPES
// ============================================================================

export interface EnvironmentConfig {
  name: string;
  features: string[];
  config: { [configKey: string]: string };
}

export interface EnvironmentConfigs {
  dev: EnvironmentConfig;
  staging: EnvironmentConfig;
  prod: EnvironmentConfig;
  test: EnvironmentConfig;
  [environmentName: string]: EnvironmentConfig;
}

// ============================================================================
// BATCH INITIALIZATION TYPES
// ============================================================================

export interface BatchInitOptions {
  projects: string[] | BatchProjectConfig[];
  baseOptions: BatchBaseOptions;
  parallel?: boolean;
  maxConcurrency?: number;
  progressTracking?: boolean;
  resourceLimits?: ResourceLimits;
  outputFormat?: 'text' | 'json';
  dryRun?: boolean;
}

export interface BatchBaseOptions {
  sparc?: boolean;
  parallel?: boolean;
  maxConcurrency?: number;
  force?: boolean;
  minimal?: boolean;
  progressTracking?: boolean;
  template?: string;
  environments?: string[];
}

export interface BatchProjectConfig {
  name: string;
  template?: string;
  environment?: string;
  customConfig?: { [key: string]: any };
  outputDir?: string;
}

// ============================================================================
// BATCH EXECUTION TYPES
// ============================================================================

export interface BatchExecutionContext {
  totalProjects: number;
  progressTracker: BatchProgressTracker;
  resourceManager: ResourceManager;
  performanceMonitor?: PerformanceMonitor;
  options: BatchInitOptions;
}

export interface BatchExecutionResult {
  success: boolean;
  projectName: string;
  template: string;
  environment: string;
  outputPath: string;
  duration: number;
  error?: string;
  warnings?: string[];
}

export interface BatchExecutionSummary {
  totalProjects: number;
  successful: number;
  failed: number;
  totalDuration: number;
  results: BatchExecutionResult[];
  report: BatchProgressReport;
  resourceUsage: BatchResourceUsage;
}

// ============================================================================
// PERFORMANCE MONITORING TYPES
// ============================================================================

export interface PerformanceMonitor {
  startMonitoring(): void;
  stopMonitoring(): PerformanceReport;
  getCurrentMetrics(): PerformanceMetrics;
  recordOperation(operation: string, duration: number): void;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage?: number;
  timestamp: number;
}

export interface PerformanceReport {
  startTime: number;
  endTime: number;
  totalDuration: number;
  averageCpuUsage: number;
  peakMemoryUsage: number;
  totalDiskUsage: number;
  operations: PerformanceOperation[];
}

export interface PerformanceOperation {
  name: string;
  duration: number;
  timestamp: number;
  memoryUsed: number;
}

// ============================================================================
// RESOURCE THRESHOLD MONITORING TYPES
// ============================================================================

export interface ResourceThresholdMonitor {
  cpuThreshold: number;
  memoryThreshold: number;
  diskThreshold: number;
  
  checkThresholds(): ThresholdStatus;
  setThresholds(cpu: number, memory: number, disk: number): void;
  enableAlerts(enabled: boolean): void;
}

export interface ThresholdStatus {
  cpu: ThresholdCheck;
  memory: ThresholdCheck;
  disk: ThresholdCheck;
  overall: 'ok' | 'warning' | 'critical';
}

export interface ThresholdCheck {
  current: number;
  threshold: number;
  status: 'ok' | 'warning' | 'critical';
  message?: string;
}

// ============================================================================
// BATCH OPTIMIZER TYPES
// ============================================================================

export interface BatchOptimizer {
  optimizeExecutionOrder(projects: BatchProjectConfig[]): BatchProjectConfig[];
  calculateOptimalConcurrency(resourceLimits: ResourceLimits): number;
  predictExecutionTime(projects: BatchProjectConfig[], concurrency: number): number;
  suggestResourceAllocation(totalProjects: number): ResourceLimits;
}

export interface BatchOptimization {
  originalOrder: string[];
  optimizedOrder: string[];
  estimatedTimeSavings: number;
  recommendedConcurrency: number;
  resourceRecommendations: ResourceLimits;
}

// ============================================================================
// BATCH RESOURCE USAGE TYPES
// ============================================================================

export interface BatchResourceUsage {
  peakMemoryMB: number;
  averageMemoryMB: number;
  peakCpuPercent: number;
  averageCpuPercent: number;
  totalDiskGB: number;
  networkIO?: number;
  processCount: number;
  fileHandles: number;
}

// ============================================================================
// TEMPLATE CREATION TYPES
// ============================================================================

export interface TemplateCreationOptions {
  sparc?: boolean;
  minimal?: boolean;
  environment?: string;
  customConfig?: { [key: string]: any };
  projectName?: string;
  outputDir?: string;
}

export interface SparcStructureOptions {
  createDotRoo?: boolean;
  createRoomodes?: boolean;
  createClaudeMd?: boolean;
  createMemoryBank?: boolean;
  createCoordination?: boolean;
  createAgentsReadme?: boolean;
  createSessionsReadme?: boolean;
}

export interface ClaudeCommandOptions {
  enableSlashCommands?: boolean;
  customCommands?: string[];
  integrationMode?: boolean;
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface BatchInitError extends Error {
  projectName?: string;
  template?: string;
  phase?: 'initialization' | 'creation' | 'configuration' | 'finalization';
  recoverable?: boolean;
}

export interface BatchErrorRecovery {
  retryCount: number;
  maxRetries: number;
  backoffMs: number;
  skipOnFailure: boolean;
}

// ============================================================================
// CONFIGURATION VALIDATION TYPES
// ============================================================================

export interface BatchConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface BatchConfigValidator {
  validateProjects(projects: string[] | BatchProjectConfig[]): BatchConfigValidation;
  validateBaseOptions(options: BatchBaseOptions): BatchConfigValidation;
  validateResourceLimits(limits: ResourceLimits): BatchConfigValidation;
  validateTemplates(templateNames: string[]): BatchConfigValidation;
  validateEnvironments(environmentNames: string[]): BatchConfigValidation;
}

// ============================================================================
// PARALLEL EXECUTION TYPES
// ============================================================================

export interface ParallelExecutionPool {
  maxWorkers: number;
  activeWorkers: number;
  pendingTasks: BatchTask[];
  completedTasks: BatchTask[];
  failedTasks: BatchTask[];
  
  addTask(task: BatchTask): void;
  executeNext(): Promise<void>;
  waitForCompletion(): Promise<BatchTask[]>;
  terminate(): void;
}

export interface BatchTask {
  id: string;
  projectName: string;
  template: string;
  environment: string;
  options: TemplateCreationOptions;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: number;
  endTime?: number;
  result?: BatchExecutionResult;
  error?: Error;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export {
  BatchProgressReport,
  BatchProgressTracker,
  ResourceManager,
  ResourceLimits,
  ProjectTemplate,
  ProjectTemplateFile,
  ProjectTemplates,
  EnvironmentConfig,
  EnvironmentConfigs,
  BatchInitOptions,
  BatchBaseOptions,
  BatchProjectConfig,
  BatchExecutionContext,
  BatchExecutionResult,
  BatchExecutionSummary,
  PerformanceMonitor,
  PerformanceMetrics,
  PerformanceReport,
  PerformanceOperation,
  ResourceThresholdMonitor,
  ThresholdStatus,
  ThresholdCheck,
  BatchOptimizer,
  BatchOptimization,
  BatchResourceUsage,
  TemplateCreationOptions,
  SparcStructureOptions,
  ClaudeCommandOptions,
  BatchInitError,
  BatchErrorRecovery,
  BatchConfigValidation,
  BatchConfigValidator,
  ParallelExecutionPool,
  BatchTask,
};