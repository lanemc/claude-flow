// types.ts - TypeScript interfaces for template data structures

export interface TemplateManifest {
  version: string;
  description: string;
  created: string;
  directories: Record<string, DirectoryConfig>;
  files: TemplateFile[];
  categories: Record<string, CategoryConfig>;
  installation?: InstallationConfig;
  maintenance?: MaintenanceConfig;
}

export interface DirectoryConfig {
  description: string;
  path: string;
  createEmpty?: boolean;
}

export interface TemplateFile {
  source: string;
  destination: string;
  description: string;
  category: string;
}

export interface CategoryConfig {
  description: string;
  count: number;
}

export interface InstallationConfig {
  steps: string[];
  requirements: string[];
}

export interface MaintenanceConfig {
  version_tracking: {
    description: string;
    format: string;
    changelog: string;
  };
  updates: {
    description: string;
    process: string[];
  };
}

export interface DeploymentInfo {
  deployed: string;
  version: string;
  targetProject: string;
  filesDeployed: number;
  errors: number;
}

export interface CommandDocumentation {
  name: string;
  description: string;
  usage: string;
  options?: CommandOption[];
  examples?: string[];
}

export interface CommandOption {
  name: string;
  description: string;
  type?: 'string' | 'number' | 'boolean';
  default?: string | number | boolean;
  required?: boolean;
}

export interface CommandStructure {
  [category: string]: string[];
}

export interface SafeHookPattern {
  name: string;
  description: string;
  pattern: any;
  benefits: string[];
  usage?: string[];
  additionalSetup?: {
    cronJob?: string;
    updateScript?: string;
  };
  processor?: string;
  problems?: string[];
}

export interface WrapperScriptConfig {
  type: 'unix' | 'windows' | 'powershell';
  content: string;
}

export interface TemplateOptions {
  type?: 'minimal' | 'full' | 'sparc' | 'optimized';
  features?: string[];
  includeTests?: boolean;
  includeDocs?: boolean;
  batchOptimized?: boolean;
}

export interface TemplateGenerationResult {
  success: boolean;
  content?: string;
  error?: string;
  warnings?: string[];
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SparcMode {
  name: string;
  description: string;
  purpose: string;
  activation: string;
  capabilities: string[];
  features?: string[];
  workflow?: string[];
  integrations?: string[];
}

export interface SwarmStrategy {
  name: string;
  purpose: string;
  activation: string;
  agentRoles: string[];
  coordinationModes?: string[];
  bestPractices?: string[];
  safetyFeatures?: string[];
}

export interface EnhancedSettingsConfig {
  env: Record<string, string>;
  permissions: {
    allow: string[];
    deny: string[];
  };
  enabledMcpjsonServers: string[];
  hooks: {
    PreToolUse?: HookConfig[];
    PostToolUse?: HookConfig[];
    Stop?: HookConfig[];
  };
  includeCoAuthoredBy: boolean;
}

export interface HookConfig {
  matcher?: string;
  hooks: HookAction[];
}

export interface HookAction {
  type: 'command';
  command: string;
}

export interface MemoryConfig {
  backend: 'json' | 'sqlite';
  path: string;
  cacheSize: number;
  indexing: boolean;
  namespaces: string[];
  retentionPolicy: Record<string, string>;
  batchtools?: {
    enabled: boolean;
    maxConcurrent: number;
    batchSize: number;
    parallelIndexing: boolean;
    concurrentBackups: boolean;
  };
  performance?: {
    enableParallelAccess: boolean;
    concurrentQueries: number;
    batchWriteSize: number;
    parallelIndexUpdate: boolean;
  };
}

export interface ProjectInfo {
  name: string;
  description: string;
  type: 'web' | 'api' | 'library' | 'cli' | 'other';
  language: string;
  frameworks: string[];
  hasTests: boolean;
  hasDocs: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

export interface ErrorContext {
  operation: string;
  file?: string;
  line?: number;
  details?: any;
}

export type ValidationFunction<T> = (data: T) => TemplateValidationResult;
export type TemplateGenerator<T> = (options: T) => Promise<TemplateGenerationResult>;
export type TemplateTransformer<T, U> = (input: T) => U;