/**
 * Main type definitions index for Claude Flow CLI commands
 * Exports all TypeScript types for the CLI command conversion
 */

// ============================================================================
// CLI COMMAND TYPES
// ============================================================================

export * from './cli-commands.js';
export * from './cli-utils.js';
export * from './sparc-modes.js';
export * from './batch-init.js';

// ============================================================================
// RE-EXPORT COMMON TYPES FOR CONVENIENCE
// ============================================================================

export type {
  CommandFlags,
  CommandArgs,
  CommandContext,
  CommandResult,
} from './cli-commands.js';

export type {
  CliUtilities,
  PrintFunction,
  CommandExecutionResult,
  CommandExecutionOptions,
} from './cli-utils.js';

export type {
  OrchestrationFunction,
  SparcModeSystem,
  SparcExecutionContext,
  SparcBatchExecution,
} from './sparc-modes.js';

export type {
  BatchInitOptions,
  BatchExecutionResult,
  BatchExecutionSummary,
  ProjectTemplate,
  EnvironmentConfig,
} from './batch-init.js';

// ============================================================================
// AGGREGATE TYPES FOR COMMAND SYSTEMS
// ============================================================================

export interface CommandSystem {
  swarm: {
    command: import('./cli-commands.js').SwarmCommandFunction;
    flags: import('./cli-commands.js').SwarmFlags;
    config: import('./cli-commands.js').SwarmConfig;
    coordinator: import('./cli-commands.js').SwarmCoordinatorInterface;
  };
  config: {
    command: import('./cli-commands.js').ConfigCommandFunction;
    flags: import('./cli-commands.js').ConfigFlags;
    config: import('./cli-commands.js').DefaultConfig;
  };
  sparc: {
    command: import('./cli-commands.js').SparcCommandFunction;
    flags: import('./cli-commands.js').SparcFlags;
    modes: import('./sparc-modes.js').SparcModeSystem;
  };
  monitor: {
    command: import('./cli-commands.js').MonitorCommandFunction;
    flags: import('./cli-commands.js').MonitorFlags;
    metrics: import('./cli-commands.js').MonitoringMetrics;
  };
  batchManager: {
    command: import('./cli-commands.js').BatchManagerCommandFunction;
    flags: import('./cli-commands.js').BatchManagerFlags;
    config: import('./batch-init.js').BatchInitOptions;
  };
}

export interface UtilitySystem {
  fileSystem: import('./cli-utils.js').FileSystemUtilities;
  configuration: import('./cli-utils.js').ConfigurationUtilities;
  strings: import('./cli-utils.js').StringUtilities;
  arrays: import('./cli-utils.js').ArrayUtilities;
  environment: import('./cli-utils.js').EnvironmentUtilities;
  validation: import('./cli-utils.js').ValidationUtilities;
  progress: import('./cli-utils.js').ProgressUtilities;
  async: import('./cli-utils.js').AsyncUtilities;
  ruvSwarm: import('./cli-utils.js').RuvSwarmUtilities;
}

// ============================================================================
// COMMON ERROR TYPES
// ============================================================================

export interface CliError extends Error {
  code?: string;
  command?: string;
  phase?: string;
  details?: Record<string, any>;
}

export interface CliValidationError extends CliError {
  field?: string;
  expectedType?: string;
  actualValue?: any;
}

export interface CliExecutionError extends CliError {
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  signal?: string;
}

// ============================================================================
// COMMON RESPONSE TYPES
// ============================================================================

export interface CliResponse<T = any> {
  success: boolean;
  data?: T;
  error?: CliError;
  warnings?: string[];
  metadata?: {
    executionTime?: number;
    timestamp?: number;
    version?: string;
    environment?: string;
  };
}

export interface CliCommandResponse<T = any> extends CliResponse<T> {
  command: string;
  args: string[];
  flags: Record<string, any>;
}

// ============================================================================
// PLUGIN AND EXTENSION TYPES
// ============================================================================

export interface CliPlugin {
  name: string;
  version: string;
  description: string;
  commands?: Record<string, Function>;
  hooks?: {
    beforeCommand?: (context: CommandContext) => Promise<void>;
    afterCommand?: (context: CommandContext, result: CliResponse) => Promise<void>;
    onError?: (context: CommandContext, error: CliError) => Promise<void>;
  };
  dependencies?: string[];
  configuration?: Record<string, any>;
}

export interface CliExtension {
  name: string;
  version: string;
  type: 'command' | 'utility' | 'integration';
  exports: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// CONFIGURATION SCHEMA TYPES
// ============================================================================

export interface CliConfigSchema {
  version: string;
  commands: {
    [commandName: string]: {
      description: string;
      flags: Record<string, {
        type: 'string' | 'number' | 'boolean';
        description: string;
        required?: boolean;
        default?: any;
      }>;
      subcommands?: Record<string, any>;
    };
  };
  utilities: Record<string, any>;
  plugins: CliPlugin[];
  extensions: CliExtension[];
}

// ============================================================================
// TESTING TYPES
// ============================================================================

export interface CliTestContext {
  command: string;
  args: string[];
  flags: Record<string, any>;
  expectedResult?: any;
  expectedError?: string;
  timeout?: number;
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface CliTestResult {
  success: boolean;
  actualResult?: any;
  actualError?: CliError;
  executionTime: number;
  output?: {
    stdout: string;
    stderr: string;
  };
}

// ============================================================================
// MIGRATION TYPES
// ============================================================================

export interface CliMigrationContext {
  fromVersion: string;
  toVersion: string;
  configPath: string;
  backupPath?: string;
  dryRun?: boolean;
}

export interface CliMigrationStep {
  name: string;
  description: string;
  execute: (context: CliMigrationContext) => Promise<void>;
  rollback?: (context: CliMigrationContext) => Promise<void>;
  validate?: (context: CliMigrationContext) => Promise<boolean>;
}

export interface CliMigrationResult {
  success: boolean;
  executedSteps: string[];
  failedStep?: string;
  error?: CliError;
  backupCreated?: string;
}

// ============================================================================
// EXPORT DEFAULT INTERFACE
// ============================================================================

export default interface ClaudeFlowCli {
  commands: CommandSystem;
  utilities: UtilitySystem;
  config: CliConfigSchema;
  version: string;
  
  execute(command: string, args: string[], flags: Record<string, any>): Promise<CliCommandResponse>;
  validate(context: CommandContext): Promise<CliResponse<boolean>>;
  migrate(context: CliMigrationContext): Promise<CliMigrationResult>;
  
  // Plugin system
  loadPlugin(plugin: CliPlugin): Promise<void>;
  unloadPlugin(name: string): Promise<void>;
  listPlugins(): CliPlugin[];
  
  // Extension system
  registerExtension(extension: CliExtension): void;
  unregisterExtension(name: string): void;
  listExtensions(): CliExtension[];
};