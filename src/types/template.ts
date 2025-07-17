/**
 * TypeScript interfaces for Claude Flow template system
 * 
 * These interfaces define the structure and types for template data,
 * configuration objects, and template generation functions.
 */

export interface TemplateManifest {
  version: string;
  files: TemplateFile[];
  directories: Record<string, DirectoryInfo>;
  categories: Record<string, CategoryInfo>;
}

export interface TemplateFile {
  source: string;
  destination: string;
  category: string;
  description?: string;
  size?: number;
  checksum?: string;
}

export interface DirectoryInfo {
  path: string;
  createEmpty?: boolean;
  description?: string;
}

export interface CategoryInfo {
  count: number;
  description?: string;
}

export interface TemplateOptions {
  type?: 'minimal' | 'full' | 'sparc' | 'optimized';
  features?: string[];
  hooks?: boolean;
  memory?: boolean;
  github?: boolean;
  batchtools?: boolean;
}

export interface ClaudeSettings {
  env?: Record<string, string>;
  permissions?: {
    allow?: string[];
    deny?: string[];
  };
  enabledMcpjsonServers?: string[];
  hooks?: HookConfiguration;
  includeCoAuthoredBy?: boolean;
}

export interface HookConfiguration {
  PreToolUse?: Hook[];
  PostToolUse?: Hook[];
  Stop?: Hook[];
}

export interface Hook {
  matcher?: string;
  hooks: HookAction[];
}

export interface HookAction {
  type: 'command' | 'function' | 'webhook';
  command?: string;
  function?: string;
  url?: string;
  timeout?: number;
}

export interface WrapperScriptOptions {
  type: 'unix' | 'windows' | 'powershell';
  useUniversal?: boolean;
  fallbackCommand?: string;
}

export interface CommandDocOptions {
  category: string;
  command: string;
  description?: string;
  usage?: string;
  examples?: string[];
  options?: CommandOption[];
}

export interface CommandOption {
  name: string;
  description: string;
  type?: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  default?: any;
}

export interface CommandStructure {
  [category: string]: string[];
}

export interface SparcMode {
  name: string;
  description: string;
  capabilities: string[];
  workflow: string[];
  dependencies?: string[];
  examples?: string[];
}

export interface SafeHookPattern {
  name: string;
  description: string;
  pattern: HookConfiguration;
  benefits?: string[];
  usage?: string[];
  problems?: string[];
}

export interface MemoryConfiguration {
  backend: 'json' | 'sqlite' | 'memory';
  path?: string;
  cacheSize?: number;
  indexing?: boolean;
  namespaces?: string[];
  retentionPolicy?: Record<string, string>;
  batchtools?: {
    enabled: boolean;
    maxConcurrentOperations: number;
    batchSize: number;
    parallelProcessing: boolean;
  };
}

export interface AgentConfiguration {
  type: 'researcher' | 'coder' | 'analyst' | 'coordinator' | 'general' | 'batch' | 'parallel';
  name?: string;
  capabilities?: string[];
  resourceLimits?: {
    memory?: string;
    cpu?: string;
  };
  batchProcessing?: {
    enabled: boolean;
    maxConcurrentTasks: number;
    queueSize: number;
  };
}

export interface CoordinationConfiguration {
  orchestrator: {
    maxConcurrentTasks: number;
    taskTimeout: number;
    defaultPriority: number;
    batchtools?: {
      enabled: boolean;
      maxParallelTasks: number;
      batchSize: number;
      concurrentAgents: number;
    };
  };
  agents: {
    maxAgents: number;
    defaultCapabilities: string[];
    resourceLimits: {
      memory: string;
      cpu: string;
    };
    batchProcessing?: {
      maxConcurrentOperations: number;
      batchQueueSize: number;
      parallelSpawning: boolean;
    };
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  statistics?: {
    totalFiles: number;
    passedTests: number;
    failedTests: number;
    successRate: number;
  };
}

export interface ValidationError {
  type: 'file_missing' | 'directory_missing' | 'content_invalid' | 'dependency_missing';
  message: string;
  file?: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  type: 'file_empty' | 'permission_issue' | 'deprecated_feature';
  message: string;
  file?: string;
  suggestion?: string;
}

export interface DeploymentOptions {
  targetPath: string;
  overwrite?: boolean;
  validate?: boolean;
  backup?: boolean;
  skipDependencies?: boolean;
}

export interface DeploymentResult {
  success: boolean;
  filesDeployed: number;
  errors: string[];
  warnings: string[];
  deploymentInfo: {
    deployed: string;
    version: string;
    targetProject: string;
    filesDeployed: number;
    errors: number;
  };
}

export interface InstallationOptions {
  sourceDir?: string;
  destinationDir?: string;
  validate?: boolean;
  createDirectories?: boolean;
  skipExisting?: boolean;
}

export interface InstallationResult {
  success: boolean;
  filesInstalled: number;
  errors: string[];
  warnings: string[];
  summary: {
    totalFiles: number;
    successCount: number;
    errorCount: number;
    categorySummary: Record<string, number>;
  };
}

// Template generation function types
export type TemplateGenerator<T = any> = (options?: T) => string;
export type AsyncTemplateGenerator<T = any> = (options?: T) => Promise<string>;

// Common template generators
export interface TemplateGenerators {
  createMinimalClaudeMd: TemplateGenerator<void>;
  createFullClaudeMd: TemplateGenerator<void>;
  createSparcClaudeMd: TemplateGenerator<void>;
  createOptimizedSparcClaudeMd: AsyncTemplateGenerator<void>;
  createEnhancedClaudeMd: TemplateGenerator<void>;
  createEnhancedSettingsJson: TemplateGenerator<void>;
  createWrapperScript: TemplateGenerator<WrapperScriptOptions>;
  createCommandDoc: TemplateGenerator<CommandDocOptions>;
  createHelperScript: TemplateGenerator<string>;
  createMinimalCoordinationMd: TemplateGenerator<void>;
  createFullCoordinationMd: TemplateGenerator<void>;
  createOptimizedCoordinationMd: AsyncTemplateGenerator<void>;
  createMinimalMemoryBankMd: TemplateGenerator<void>;
  createFullMemoryBankMd: TemplateGenerator<void>;
  createOptimizedMemoryBankMd: AsyncTemplateGenerator<void>;
  createAgentsReadme: TemplateGenerator<void>;
  createSessionsReadme: TemplateGenerator<void>;
  createSparcModesOverview: TemplateGenerator<void>;
  createSwarmStrategyTemplates: TemplateGenerator<Record<string, string>>;
}

// Error types for template system
export class TemplateError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'TemplateError';
  }
}

export class TemplateValidationError extends TemplateError {
  constructor(message: string, public validationResults: ValidationResult) {
    super(message, 'VALIDATION_ERROR', validationResults);
    this.name = 'TemplateValidationError';
  }
}

export class TemplateInstallationError extends TemplateError {
  constructor(message: string, public installationResults: InstallationResult) {
    super(message, 'INSTALLATION_ERROR', installationResults);
    this.name = 'TemplateInstallationError';
  }
}

export class TemplateDeploymentError extends TemplateError {
  constructor(message: string, public deploymentResults: DeploymentResult) {
    super(message, 'DEPLOYMENT_ERROR', deploymentResults);
    this.name = 'TemplateDeploymentError';
  }
}

// Utility types
export type TemplateType = 'minimal' | 'full' | 'sparc' | 'optimized';
export type ScriptType = 'unix' | 'windows' | 'powershell';
export type BackendType = 'json' | 'sqlite' | 'memory';
export type AgentType = 'researcher' | 'coder' | 'analyst' | 'coordinator' | 'general' | 'batch' | 'parallel';
export type HookType = 'PreToolUse' | 'PostToolUse' | 'Stop';
export type ActionType = 'command' | 'function' | 'webhook';
export type SeverityType = 'error' | 'warning' | 'info';

// Constants for template system
export const TEMPLATE_TYPES = ['minimal', 'full', 'sparc', 'optimized'] as const;
export const SCRIPT_TYPES = ['unix', 'windows', 'powershell'] as const;
export const BACKEND_TYPES = ['json', 'sqlite', 'memory'] as const;
export const AGENT_TYPES = ['researcher', 'coder', 'analyst', 'coordinator', 'general', 'batch', 'parallel'] as const;
export const HOOK_TYPES = ['PreToolUse', 'PostToolUse', 'Stop'] as const;
export const ACTION_TYPES = ['command', 'function', 'webhook'] as const;
export const SEVERITY_TYPES = ['error', 'warning', 'info'] as const;

// Default configurations
export const DEFAULT_TEMPLATE_OPTIONS: TemplateOptions = {
  type: 'minimal',
  features: [],
  hooks: true,
  memory: true,
  github: false,
  batchtools: false
};

export const DEFAULT_MEMORY_CONFIG: MemoryConfiguration = {
  backend: 'json',
  path: './memory/claude-flow-data.json',
  cacheSize: 1000,
  indexing: true,
  namespaces: ['default', 'agents', 'tasks', 'sessions'],
  retentionPolicy: {
    sessions: '30d',
    tasks: '90d',
    agents: 'permanent'
  }
};

export const DEFAULT_AGENT_CONFIG: AgentConfiguration = {
  type: 'general',
  capabilities: ['research', 'code', 'terminal'],
  resourceLimits: {
    memory: '1GB',
    cpu: '50%'
  }
};