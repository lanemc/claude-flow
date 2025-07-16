/**
 * Migration type definitions
 */

export type MigrationStrategy = 'full' | 'selective' | 'merge';

export interface MigrationOptions {
  projectPath: string;
  strategy: MigrationStrategy;
  backupDir?: string;
  force?: boolean;
  dryRun?: boolean;
  preserveCustom?: boolean;
  skipValidation?: boolean;
}

export interface MigrationAnalysis {
  projectPath: string;
  hasClaudeFolder: boolean;
  hasOptimizedPrompts: boolean;
  customCommands: string[];
  customConfigurations: Record<string, any>;
  conflictingFiles: string[];
  migrationRisks: MigrationRisk[];
  recommendations: string[];
  timestamp: Date;
}

export interface MigrationRisk {
  level: 'low' | 'medium' | 'high';
  description: string;
  file?: string;
  mitigation?: string;
}

export interface MigrationBackup {
  timestamp: Date;
  version: string;
  files: BackupFile[];
  metadata: Record<string, any>;
}

export interface BackupFile {
  path: string;
  content: string;
  checksum: string;
  permissions?: string;
}

export interface MigrationResult {
  success: boolean;
  filesModified: string[];
  filesCreated: string[];
  filesBackedUp: string[];
  errors: MigrationError[];
  warnings: string[];
  rollbackPath?: string;
}

export interface MigrationError {
  file?: string;
  error: string;
  stack?: string;
}

export interface ValidationResult {
  valid: boolean;
  checks: ValidationCheck[];
  errors: string[];
  warnings: string[];
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  message?: string;
  details?: any;
}

export interface MigrationManifest {
  version: string;
  files: {
    commands: Record<string, CommandMigration>;
    configurations: Record<string, ConfigMigration>;
    templates: Record<string, TemplateMigration>;
  };
  dependencies?: string[];
}

export interface CommandMigration {
  source: string;
  target: string;
  transform?: 'copy' | 'merge' | 'replace';
  priority?: number;
}

export interface ConfigMigration {
  source: string;
  target: string;
  merge?: boolean;
  transform?: (config: any) => any;
}

export interface TemplateMigration {
  source: string;
  target: string;
  variables?: Record<string, string>;
}

export interface MigrationProgress {
  total: number;
  completed: number;
  current: string;
  phase: 'analyzing' | 'backing-up' | 'migrating' | 'validating' | 'complete';
  errors: number;
  warnings: number;
}

// Rollback type definitions
export type RollbackPhase = 
  | 'sparc-init' 
  | 'claude-commands' 
  | 'memory-setup' 
  | 'coordination-setup' 
  | 'executable-creation'
  | string; // Allow custom phases

export interface RollbackResult {
  success: boolean;
  phase: RollbackPhase;
  actions: RollbackAction[];
  errors: string[];
  warnings: string[];
  timestamp: Date;
  rollbackId: string;
}

export interface RollbackAction {
  type: 'file_removed' | 'directory_removed' | 'file_restored' | 'permission_restored';
  path: string;
  description: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface RollbackCheckpoint {
  id: string;
  phase: RollbackPhase;
  timestamp: Date;
  data: {
    actions?: any[];
    state?: Record<string, any>;
    metadata?: Record<string, any>;
  };
}

export interface RollbackStrategy {
  type: 'full' | 'partial' | 'selective';
  phases: RollbackPhase[];
  preserveUserData: boolean;
  createBackup: boolean;
}

// Validation type definitions for schemas and rules
export interface ValidationSchema<T = any> {
  name: string;
  version: string;
  rules: ValidationRule<T>[];
  metadata?: Record<string, any>;
}

export interface ValidationRule<T = any> {
  name: string;
  type: 'required' | 'format' | 'range' | 'custom';
  field: keyof T | string;
  validator: ValidationValidator<T>;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationValidator<T = any> {
  validate: (value: any, context?: T) => ValidationRuleResult;
}

export interface ValidationRuleResult {
  valid: boolean;
  message?: string;
  details?: any;
}

export interface TypedValidationResult<T = any> {
  valid: boolean;
  data?: T;
  checks: ValidationCheck[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata: {
    timestamp: Date;
    schema: string;
    version: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  rule: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
  rule: string;
  severity: 'warning' | 'info';
}

// Health check interfaces
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  message?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemHealthStatus {
  overall: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
  summary: {
    total: number;
    healthy: number;
    warning: number;
    critical: number;
    unknown: number;
  };
  timestamp: Date;
}

// State management types for validation and rollback
export interface ValidationState {
  schemas: Record<string, ValidationSchema>;
  activeValidations: Record<string, TypedValidationResult>;
  cache: Record<string, any>;
  config: {
    strictMode: boolean;
    validateOnSave: boolean;
    autoCorrect: boolean;
  };
}

export interface RollbackState {
  availableBackups: MigrationBackup[];
  activeRollbacks: Record<string, RollbackResult>;
  checkpoints: Record<string, RollbackCheckpoint>;
  config: {
    autoBackup: boolean;
    maxBackups: number;
    retentionDays: number;
  };
}