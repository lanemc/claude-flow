/**
 * TypeScript type definitions for CLI utility functions
 * Generated for conversion from JavaScript to TypeScript
 */

// ============================================================================
// PRINT UTILITY TYPES
// ============================================================================

export type PrintFunction = (message: string) => void;

// ============================================================================
// FILE SYSTEM UTILITY TYPES
// ============================================================================

export interface FileSystemUtilities {
  ensureDirectory(path: string): Promise<boolean>;
  fileExists(path: string): Promise<boolean>;
  readJsonFile<T = any>(path: string, defaultValue?: T): Promise<T>;
  writeJsonFile(path: string, data: any): Promise<void>;
}

// ============================================================================
// COMMAND PARSING TYPES
// ============================================================================

export interface ParsedCommand {
  flags: { [key: string]: string | boolean };
  args: string[];
}

export interface FlagParsingOptions {
  allowUnknownFlags?: boolean;
  booleanFlags?: string[];
  stringFlags?: string[];
}

// ============================================================================
// COMMAND EXECUTION TYPES
// ============================================================================

export interface CommandExecutionResult {
  success: boolean;
  code: number;
  stdout: string;
  stderr: string;
}

export interface CommandExecutionOptions {
  stdio?: 'inherit' | 'pipe' | 'ignore';
  shell?: boolean;
  cwd?: string;
  env?: { [key: string]: string };
  timeout?: number;
}

// ============================================================================
// CONFIGURATION UTILITY TYPES
// ============================================================================

export interface ConfigurationUtilities {
  loadConfig(path?: string): Promise<any>;
  saveConfig(config: any, path?: string): Promise<void>;
}

export interface DefaultCliConfig {
  terminal: {
    poolSize: number;
    recycleAfter: number;
    healthCheckInterval: number;
    type: string;
  };
  orchestrator: {
    maxConcurrentTasks: number;
    taskTimeout: number;
  };
  memory: {
    backend: string;
    path: string;
  };
}

// ============================================================================
// STRING UTILITY TYPES
// ============================================================================

export interface StringUtilities {
  formatTimestamp(timestamp: number): string;
  truncateString(str: string, length?: number): string;
  formatBytes(bytes: number): string;
}

// ============================================================================
// ARRAY UTILITY TYPES
// ============================================================================

export interface ArrayUtilities {
  chunk<T>(array: T[], size: number): T[][];
}

// ============================================================================
// ENVIRONMENT UTILITY TYPES
// ============================================================================

export interface EnvironmentUtilities {
  getEnvVar(name: string, defaultValue?: string | null): string | null;
  setEnvVar(name: string, value: string): void;
}

// ============================================================================
// VALIDATION UTILITY TYPES
// ============================================================================

export interface ValidationUtilities {
  validateArgs(args: string[], minLength: number, usage: string): boolean;
  isValidJson(str: string): boolean;
  isValidUrl(str: string): boolean;
}

// ============================================================================
// PROGRESS UTILITY TYPES
// ============================================================================

export interface ProgressUtilities {
  showProgress(current: number, total: number, message?: string): void;
  clearLine(): void;
}

// ============================================================================
// ASYNC UTILITY TYPES
// ============================================================================

export interface AsyncUtilities {
  sleep(ms: number): Promise<void>;
  retry<T>(fn: () => Promise<T>, maxAttempts?: number, delay?: number): Promise<T>;
}

// ============================================================================
// RUV-SWARM INTEGRATION TYPES
// ============================================================================

export interface RuvSwarmMCPResult {
  success: boolean;
  adaptation_results?: {
    model_version: string;
    performance_delta: string;
    training_samples: number;
    accuracy_improvement: string;
    confidence_increase: string;
  };
  learned_patterns?: string[];
  modelId?: string;
  epochs?: number;
  accuracy?: number;
  training_time?: number;
  status?: string;
  improvement_rate?: string;
  data_source?: string;
  wasm_accelerated?: boolean;
  real_training?: boolean;
  final_loss?: number;
  learning_rate?: number;
  training_file?: string;
  timestamp?: string;
  ruv_swarm_executed?: boolean;
}

export interface RuvSwarmMCPParams {
  model?: string;
  data?: string;
  epochs?: number;
  timestamp?: number;
  action?: string;
  operation?: string;
  outcome?: string;
  metadata?: any;
  swarmId?: string | null;
  type?: string;
  config?: any;
}

export interface RuvSwarmHookResult {
  success: boolean;
  output: string;
  stderr: string;
}

export interface RuvSwarmUtilities {
  callRuvSwarmMCP(tool: string, params?: RuvSwarmMCPParams): Promise<RuvSwarmMCPResult>;
  callRuvSwarmDirectNeural(params?: RuvSwarmMCPParams): Promise<RuvSwarmMCPResult>;
  execRuvSwarmHook(hookName: string, params?: RuvSwarmMCPParams): Promise<RuvSwarmHookResult>;
  checkRuvSwarmAvailable(): Promise<boolean>;
  trainNeuralModel(modelName: string, dataSource: string, epochs?: number): Promise<RuvSwarmMCPResult>;
  updateNeuralPattern(operation: string, outcome: string, metadata?: any): Promise<RuvSwarmMCPResult>;
  getSwarmStatus(swarmId?: string | null): Promise<RuvSwarmMCPResult>;
  spawnSwarmAgent(agentType: string, config?: any): Promise<RuvSwarmMCPResult>;
}

// ============================================================================
// NODE-COMPAT TYPES
// ============================================================================

export interface NodeCompatError {
  name: string;
  message: string;
}

export interface NodeCompatErrors {
  NotFound: new (message: string) => NodeCompatError;
  AlreadyExists: new (message: string) => NodeCompatError;
  PermissionDenied: new (message: string) => NodeCompatError;
}

export interface NodeCompatFileInfo {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

export interface NodeCompatStatInfo {
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtime: Date;
  atime: Date;
  birthtime: Date;
}

export interface NodeCompatStdinOptions {
  read(buffer: Uint8Array): Promise<number>;
}

export interface NodeCompatStdoutOptions {
  write(data: string | Uint8Array): Promise<number>;
}

export interface NodeCompatBuildInfo {
  os: string;
  arch: string;
  target: string;
}

export interface NodeCompatEnv {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  toObject(): { [key: string]: string | undefined };
}

export interface NodeCompatCommandResult {
  code: number;
  success: boolean;
  stdout: Uint8Array;
  stderr: Uint8Array;
}

export interface NodeCompatSpawnResult {
  status: Promise<{ code: number; success: boolean }>;
  stdout: any;
  stderr: any;
  kill: (signal?: string) => void;
}

export interface NodeCompatCommandOptions {
  args?: string[];
  cwd?: string;
  env?: { [key: string]: string };
  stdio?: string;
}

export interface NodeCompatCommand {
  new (command: string, options?: NodeCompatCommandOptions): NodeCompatCommand;
  output(): Promise<NodeCompatCommandResult>;
  spawn(): NodeCompatSpawnResult;
}

export interface NodeCompatDeno {
  args: string[];
  cwd(): string;
  readDir(path: string): Promise<NodeCompatFileInfo[]>;
  stat(path: string): Promise<NodeCompatStatInfo>;
  readTextFile(path: string): Promise<string>;
  writeTextFile(path: string, content: string): Promise<void>;
  remove(path: string): Promise<void>;
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  pid: number;
  kill(pid: number, signal?: string): void;
  exit(code?: number): never;
  execPath(): string;
  errors: NodeCompatErrors;
  build: NodeCompatBuildInfo;
  stdin: NodeCompatStdinOptions;
  stdout: NodeCompatStdoutOptions;
  stderr: NodeCompatStdoutOptions;
  env: NodeCompatEnv;
  Command: NodeCompatCommand;
}

// ============================================================================
// COMBINED UTILITY INTERFACE
// ============================================================================

export interface CliUtilities extends
  FileSystemUtilities,
  ConfigurationUtilities,
  StringUtilities,
  ArrayUtilities,
  EnvironmentUtilities,
  ValidationUtilities,
  ProgressUtilities,
  AsyncUtilities,
  RuvSwarmUtilities {
  
  // Print functions
  printSuccess: PrintFunction;
  printError: PrintFunction;
  printWarning: PrintFunction;
  printInfo: PrintFunction;
  
  // Command parsing
  parseFlags(args: string[]): ParsedCommand;
  
  // Command execution
  runCommand(
    command: string, 
    args?: string[], 
    options?: CommandExecutionOptions
  ): Promise<CommandExecutionResult>;
  
  // ID generation
  generateId(prefix?: string): string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export {
  PrintFunction,
  FileSystemUtilities,
  ParsedCommand,
  FlagParsingOptions,
  CommandExecutionResult,
  CommandExecutionOptions,
  ConfigurationUtilities,
  DefaultCliConfig,
  StringUtilities,
  ArrayUtilities,
  EnvironmentUtilities,
  ValidationUtilities,
  ProgressUtilities,
  AsyncUtilities,
  RuvSwarmMCPResult,
  RuvSwarmMCPParams,
  RuvSwarmHookResult,
  RuvSwarmUtilities,
  NodeCompatError,
  NodeCompatErrors,
  NodeCompatFileInfo,
  NodeCompatStatInfo,
  NodeCompatStdinOptions,
  NodeCompatStdoutOptions,
  NodeCompatBuildInfo,
  NodeCompatEnv,
  NodeCompatCommandResult,
  NodeCompatSpawnResult,
  NodeCompatCommandOptions,
  NodeCompatCommand,
  NodeCompatDeno,
  CliUtilities,
};