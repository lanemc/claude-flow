/**
 * Type definitions for CLI components
 */

import { SwarmStrategy, SwarmMode, AgentType } from '../swarm/types.js';

// Common CLI flag types
export interface BaseFlags {
  help?: boolean;
  version?: boolean;
  verbose?: boolean;
  [key: string]: any;
}

// Swarm-specific flags
export interface SwarmFlags extends BaseFlags {
  strategy?: SwarmStrategy;
  mode?: SwarmMode;
  'max-agents'?: number;
  'max-tasks'?: number;
  timeout?: number;
  parallel?: boolean;
  distributed?: boolean;
  monitor?: boolean;
  review?: boolean;
  testing?: boolean;
  'memory-namespace'?: string;
  persistence?: boolean;
  encryption?: boolean;
  'quality-threshold'?: number;
  'agent-selection'?: string;
  'task-scheduling'?: string;
  'load-balancing'?: string;
  'fault-tolerance'?: string;
  communication?: string;
  'dry-run'?: boolean;
  auto?: boolean;
  'dangerously-skip-permissions'?: boolean;
}

// Task creation flags
export interface TaskFlags extends BaseFlags {
  mode?: 'full' | 'backend-only' | 'frontend-only' | 'api-only';
  coverage?: number;
  commit?: 'phase' | 'feature' | 'manual';
  config?: string;
  tools?: string;
  parallel?: boolean;
  research?: boolean;
  noPermissions?: boolean;
}

// Agent spawn flags
export interface AgentFlags extends BaseFlags {
  name?: string;
  type?: AgentType;
  capabilities?: string[];
  resources?: Record<string, any>;
  'max-concurrent-tasks'?: number;
  'memory-namespace'?: string;
  'auto-assign'?: boolean;
}

// Memory flags
export interface MemoryFlags extends BaseFlags {
  namespace?: string;
  ttl?: number;
  key?: string;
  value?: string;
  action?: 'store' | 'retrieve' | 'list' | 'delete' | 'search';
  pattern?: string;
  limit?: number;
  export?: string;
  import?: string;
  backup?: boolean;
  compress?: boolean;
}

// Neural network flags
export interface NeuralFlags extends BaseFlags {
  'model-id'?: string;
  'pattern-type'?: 'coordination' | 'optimization' | 'prediction';
  'training-data'?: string;
  epochs?: number;
  input?: string;
  'load-model'?: string;
  'save-model'?: string;
  ratio?: number;
  models?: string[];
  'source-model'?: string;
  'target-domain'?: string;
}

// GitHub integration flags
export interface GitHubFlags extends BaseFlags {
  repo?: string;
  'pr-number'?: number;
  action?: 'review' | 'merge' | 'close' | 'track' | 'coord';
  'analysis-type'?: 'code_quality' | 'performance' | 'security';
  version?: string;
  workflow?: Record<string, any>;
  repos?: string[];
}

// Configuration flags
export interface ConfigFlags extends BaseFlags {
  show?: boolean;
  get?: string;
  set?: string;
  'config-file'?: string;
  'mcp-config'?: string;
  reset?: boolean;
  'list-servers'?: boolean;
  'add-server'?: boolean;
  'remove-server'?: boolean;
}

// Command execution result
export interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
  code?: number;
  data?: any;
}

// CLI command definition
export interface CLICommand {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  flags: Record<string, {
    description: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    default?: any;
    required?: boolean;
  }>;
  handler: (flags: any, args: string[]) => Promise<CommandResult>;
}

// CLI context
export interface CLIContext {
  command: string;
  flags: BaseFlags;
  args: string[];
  workingDirectory: string;
  configPath?: string;
  verbose: boolean;
  interactive: boolean;
}

// Hook types
export interface HookContext {
  type: 'pre' | 'post';
  operation: string;
  file?: string;
  command?: string;
  memoryKey?: string;
  data?: any;
}

// Progress tracking
export interface ProgressInfo {
  current: number;
  total: number;
  message: string;
  percentage: number;
  eta?: number;
}

// Error types
export interface CLIError extends Error {
  code?: string | number;
  command?: string;
  context?: any;
  suggestions?: string[];
}

// Utility types
export type FlagValue = string | number | boolean | string[] | undefined;
export type FlagParser = (value: string) => FlagValue;
export type CommandHandler = (flags: any, args: string[]) => Promise<CommandResult>;

// Export all types
export type {
  BaseFlags,
  SwarmFlags,
  TaskFlags,
  AgentFlags,
  MemoryFlags,
  NeuralFlags,
  GitHubFlags,
  ConfigFlags,
  CommandResult,
  CLICommand,
  CLIContext,
  HookContext,
  ProgressInfo,
  CLIError,
  FlagValue,
  FlagParser,
  CommandHandler,
};