/**
 * CLI-specific type definitions
 */

// CLI command options
export interface CLIOptions {
  verbose?: boolean;
  debug?: boolean;
  config?: string;
  output?: 'json' | 'yaml' | 'table' | 'raw';
  format?: 'pretty' | 'compact' | 'json';
  timeout?: number;
  maxRetries?: number;
  force?: boolean;
  dryRun?: boolean;
}

// CLI command context
export interface CLIContext {
  workingDirectory: string;
  configPath?: string;
  options: CLIOptions;
  logger: any;
  startTime: Date;
}

// CLI command result
export interface CLIResult {
  success: boolean;
  data?: unknown;
  error?: string;
  exitCode: number;
  duration: number;
  metadata?: Record<string, unknown>;
}

// CLI command definition
export interface CLICommand {
  name: string;
  description: string;
  usage?: string;
  options?: CLICommandOption[];
  examples?: string[];
  handler: (args: string[], context: CLIContext) => Promise<CLIResult>;
}

// CLI command option
export interface CLICommandOption {
  name: string;
  alias?: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  default?: unknown;
  choices?: string[];
}

// Agent types for CLI
export type CLIAgentType = 
  | 'coordinator'
  | 'researcher' 
  | 'coder'
  | 'analyst'
  | 'architect'
  | 'tester'
  | 'reviewer'
  | 'optimizer'
  | 'documenter'
  | 'monitor'
  | 'specialist';

// CLI swarm configuration
export interface CLISwarmConfig {
  topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
  maxAgents: number;
  strategy: 'parallel' | 'sequential' | 'adaptive' | 'balanced';
  agents?: {
    type: CLIAgentType;
    name?: string;
    capabilities?: string[];
  }[];
}

// CLI task status
export type CLITaskStatus = 
  | 'pending'
  | 'queued'
  | 'assigned'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

// CLI progress indicator
export interface CLIProgress {
  current: number;
  total: number;
  percentage: number;
  message?: string;
  eta?: number; // estimated time remaining in ms
}

// CLI table column
export interface CLITableColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  formatter?: (value: unknown) => string;
}

// CLI output formatter
export interface CLIFormatter {
  format: (data: unknown, options?: CLIOptions) => string;
  supportsColor: boolean;
}

// Environment detection result
export interface EnvironmentInfo {
  platform: string;
  nodeVersion: string;
  npmVersion: string;
  isCI: boolean;
  isDebug: boolean;
  terminalColumns: number;
  terminalRows: number;
  colorSupport: boolean;
}