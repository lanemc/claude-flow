// types.ts - TypeScript type definitions for command files

/**
 * Configuration for basic command options
 */
export interface CommandOptions {
  workingDir: string;
}

/**
 * Configuration for optimized command options with batchtools
 */
export interface OptimizedCommandOptions {
  workingDir: string;
  enableBatchtools?: boolean;
  maxConcurrency?: number;
  batchSize?: number;
}

/**
 * SPARC mode configuration
 */
export interface SparcMode {
  slug: string;
  name: string;
  roleDefinition: string;
  customInstructions: string;
  groups?: (string | [string, { description?: string; fileRegex?: string }])[];
}

/**
 * Tool descriptions mapping
 */
export interface ToolDescriptions {
  [key: string]: string;
}

/**
 * Example tasks mapping
 */
export interface ExampleTasks {
  [key: string]: string;
}

/**
 * Batchtools practices configuration
 */
export interface BatchtoolsPractices {
  parallel: string[];
  optimization: string[];
  performance: string[];
}

/**
 * Batchtools practices mapping by mode
 */
export interface BatchtoolsPracticesMap {
  [key: string]: BatchtoolsPractices;
}

/**
 * Performance metrics for SPARC modes
 */
export interface PerformanceMetrics {
  parallelCapability: number;
  batchOptimization: number;
  concurrentProcessing: number;
}

/**
 * Command validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Command file generation result
 */
export interface GenerationResult {
  success: boolean;
  filesCreated: string[];
  errors: string[];
}

/**
 * Error types for command generation
 */
export enum CommandError {
  INVALID_CONFIG = 'INVALID_CONFIG',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  DIRECTORY_NOT_FOUND = 'DIRECTORY_NOT_FOUND',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Custom error class for command operations
 */
export class CommandGenerationError extends Error {
  constructor(
    public type: CommandError,
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'CommandGenerationError';
  }
}

/**
 * Available tool types
 */
export type ToolType = 'read' | 'edit' | 'browser' | 'mcp' | 'command';

/**
 * Command file types
 */
export type CommandFileType = 'claude-flow' | 'sparc' | 'optimized';

/**
 * Namespace types for memory operations
 */
export type MemoryNamespace = 
  | 'default'
  | 'agents'
  | 'tasks'
  | 'sessions'
  | 'swarm'
  | 'project'
  | 'spec'
  | 'arch'
  | 'impl'
  | 'test'
  | 'debug'
  | 'performance'
  | 'batchtools';

/**
 * Swarm strategies
 */
export type SwarmStrategy = 
  | 'auto'
  | 'development'
  | 'research'
  | 'analysis'
  | 'testing'
  | 'optimization'
  | 'maintenance';

/**
 * Agent types
 */
export type AgentType = 
  | 'coordinator'
  | 'developer'
  | 'researcher'
  | 'analyzer'
  | 'tester'
  | 'reviewer'
  | 'documenter'
  | 'monitor'
  | 'specialist'
  | 'batch-processor';

/**
 * Coordination modes
 */
export type CoordinationMode = 
  | 'centralized'
  | 'distributed'
  | 'hierarchical'
  | 'mesh'
  | 'hybrid';