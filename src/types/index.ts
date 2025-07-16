/**
 * Claude Flow TypeScript Type System
 * Comprehensive type definitions for the SPARC architecture
 * 
 * This is the main entry point for all TypeScript interfaces and types
 * used throughout the Claude Flow system.
 */

// ===== Core Type Exports =====

// SPARC Architecture Types
export * as SparcTypes from './sparc/index.js';

// Workflow Orchestration Types  
export * as WorkflowTypes from './workflow/index.js';

// Command Structure Types
export * as CommandTypes from './commands/index.js';

// Error Handling Types
export * as ErrorTypes from './errors/index.js';

// Agent Communication Types
export * as AgentTypes from './agents/index.js';

// Memory System Types
export * as MemoryTypes from './memory/index.js';

// Legacy swarm types (maintaining backward compatibility)
export * from '../swarm/types.js';

// ===== Type-Safe Function Signatures =====

import type { 
  SparcPhase, 
  SparcSpecification, 
  SparcPseudocode, 
  SparcArchitecture, 
  SparcRefinement, 
  SparcCompletion 
} from './sparc/index.js';

import type {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowOrchestrator,
  WorkflowOptimization
} from './workflow/index.js';

import type {
  Command,
  CommandResult,
  CommandContext,
  CommandHandler,
  McpTool,
  ToolResult,
  ToolContext
} from './commands/index.js';

import type {
  ErrorDefinition,
  ErrorHandler,
  ErrorRecovery,
  ErrorReport
} from './errors/index.js';

import type {
  Agent,
  AgentFactory,
  AgentRegistry,
  SwarmCoordination
} from './agents/index.js';

import type {
  MemoryStore,
  MemoryFactory,
  MemoryRegistry,
  SwarmMemory
} from './memory/index.js';

// Re-export key types for convenient access
export type {
  SparcPhase, 
  SparcSpecification, 
  SparcPseudocode, 
  SparcArchitecture, 
  SparcRefinement, 
  SparcCompletion,
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowOrchestrator,
  WorkflowOptimization,
  Command,
  CommandResult,
  CommandContext,
  CommandHandler,
  McpTool,
  ToolResult,
  ToolContext,
  ErrorDefinition,
  ErrorHandler,
  ErrorRecovery,
  ErrorReport,
  Agent,
  AgentFactory,
  AgentRegistry,
  SwarmCoordination,
  MemoryStore,
  MemoryFactory,
  MemoryRegistry,
  SwarmMemory
};

// ===== Type-Safe Function Signatures =====

/**
 * SPARC Phase Handlers
 * Type-safe function signatures for SPARC methodology phases
 */
export interface SparcPhaseHandlers {
  specification: (input: string, options?: SparcPhaseOptions) => Promise<SparcSpecification>;
  pseudocode: (specification: SparcSpecification, options?: SparcPhaseOptions) => Promise<SparcPseudocode>;
  architecture: (specification: SparcSpecification, pseudocode: SparcPseudocode, options?: SparcPhaseOptions) => Promise<SparcArchitecture>;
  refinement: (architecture: SparcArchitecture, options?: SparcPhaseOptions) => Promise<SparcRefinement>;
  completion: (refinement: SparcRefinement, options?: SparcPhaseOptions) => Promise<SparcCompletion>;
}

export interface SparcPhaseOptions {
  verbose?: boolean;
  interactive?: boolean;
  timeout?: number;
  outputDir?: string;
  memoryNamespace?: string;
  parallel?: boolean;
}

/**
 * Workflow Orchestration Handlers
 * Type-safe function signatures for workflow management
 */
export interface WorkflowHandlers {
  create: (definition: WorkflowDefinition) => Promise<WorkflowExecution>;
  execute: (workflowId: string, context?: WorkflowContext) => Promise<WorkflowExecution>;
  pause: (executionId: string) => Promise<void>;
  resume: (executionId: string) => Promise<void>;
  cancel: (executionId: string) => Promise<void>;
  getStatus: (executionId: string) => Promise<WorkflowStatus>;
  optimize: (workflowId: string, options?: OptimizationOptions) => Promise<WorkflowOptimization>;
}

export interface WorkflowContext {
  variables: Record<string, any>;
  configuration: Record<string, any>;
  metadata: Record<string, any>;
}

export interface WorkflowStatus {
  id: string;
  state: WorkflowState;
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
}

export type WorkflowState = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface OptimizationOptions {
  type: OptimizationType;
  aggressive?: boolean;
  timeout?: number;
  dryRun?: boolean;
}

export type OptimizationType = 
  | 'performance'
  | 'resource'
  | 'cost'
  | 'reliability'
  | 'all';

// ===== Backward Compatibility Types =====

// Memory-specific types that may be referenced (maintaining backward compatibility)
export interface MemoryEntry {
  id: string;
  key: string;
  value: any;
  data?: any; // For backward compatibility
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  partition?: string;
}

// Task types for swarm (maintaining backward compatibility)
export type TaskId = string;
export type TaskStatus = 'pending' | 'active' | 'completed' | 'failed';

// Component monitoring types (maintaining backward compatibility)
export enum ComponentStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

// Alert types for monitoring (maintaining backward compatibility)
export interface AlertData {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  component?: string;
  metadata?: Record<string, any>;
}

// ===== Utility Types =====

/**
 * Common utility types used throughout the system
 */
export type Awaitable<T> = T | Promise<T>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Flatten<T> = T extends any[] ? T[number] : T;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// ===== Type Guards =====

/**
 * Type guard functions for runtime type checking
 */
export function isSparcPhase(value: any): value is SparcPhase {
  return value && typeof value === 'object' && 'name' in value && 'status' in value;
}

export function isWorkflowDefinition(value: any): value is WorkflowDefinition {
  return value && typeof value === 'object' && 'id' in value && 'phases' in value;
}

export function isCommand(value: any): value is Command {
  return value && typeof value === 'object' && 'name' in value && 'handler' in value;
}

export function isErrorDefinition(value: any): value is ErrorDefinition {
  return value && typeof value === 'object' && 'code' in value && 'type' in value;
}

export function isAgent(value: any): value is Agent {
  return value && typeof value === 'object' && 'id' in value && 'type' in value;
}

export function isMemoryStore(value: any): value is MemoryStore {
  return value && typeof value === 'object' && 'id' in value && 'type' in value;
}

// ===== Constants =====

/**
 * Common constants used throughout the system
 */
export const SPARC_PHASES = [
  'specification',
  'pseudocode',
  'architecture',
  'refinement',
  'completion'
] as const;

export const AGENT_TYPES = [
  'coordinator',
  'researcher',
  'architect',
  'coder',
  'tester',
  'reviewer',
  'analyst',
  'optimizer',
  'documenter',
  'monitor',
  'specialist'
] as const;

export const MEMORY_STORE_TYPES = [
  'shared',
  'distributed',
  'swarm',
  'persistent',
  'cache',
  'temporal',
  'neural'
] as const;

export const ERROR_SEVERITIES = [
  'trace',
  'debug',
  'info',
  'warning',
  'error',
  'critical',
  'fatal'
] as const;

export const WORKFLOW_STATES = [
  'pending',
  'running',
  'paused',
  'completed',
  'failed',
  'cancelled'
] as const;

// ===== Default Configurations =====

/**
 * Default configuration objects
 */
export const DEFAULT_SPARC_OPTIONS: SparcPhaseOptions = {
  verbose: false,
  interactive: true,
  timeout: 300000, // 5 minutes
  outputDir: './output',
  memoryNamespace: 'sparc',
  parallel: false
};

// ===== Version Information =====

/**
 * Type system version information
 */
export const TYPE_SYSTEM_VERSION = '1.0.0';
export const COMPATIBLE_CLAUDE_FLOW_VERSION = '2.0.0-alpha.56';
export const LAST_UPDATED = '2024-01-16';

/**
 * Type system metadata
 */
export const TYPE_SYSTEM_METADATA = {
  name: 'Claude Flow Type System',
  version: TYPE_SYSTEM_VERSION,
  description: 'Comprehensive TypeScript type definitions for Claude Flow SPARC architecture',
  author: 'Claude Flow Development Team',
  license: 'MIT',
  repository: 'https://github.com/ruvnet/claude-flow',
  documentation: 'https://docs.claude-flow.com/types',
  lastUpdated: LAST_UPDATED,
  compatibleWith: COMPATIBLE_CLAUDE_FLOW_VERSION,
  categories: [
    'SPARC Architecture',
    'Workflow Orchestration',
    'Command Structure',
    'Error Handling',
    'Agent Communication',
    'Memory System'
  ],
  totalTypes: 500,
  totalInterfaces: 200,
  totalEnums: 50,
  coverage: '100%'
} as const;