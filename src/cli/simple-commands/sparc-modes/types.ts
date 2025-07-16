// types.ts - TypeScript interfaces and types for SPARC modes

/**
 * Function type for SPARC mode orchestration functions
 * Each mode exports a function that returns an orchestration template string
 */
export type OrchestrationFunction = (
  taskDescription: string,
  memoryNamespace: string
) => string;

/**
 * SPARC mode configuration interface
 */
export interface SparcModeConfig {
  name: string;
  description: string;
  orchestrationFunction: OrchestrationFunction;
}

/**
 * Memory store operation types
 */
export type MemoryOperation = 'store' | 'query' | 'list';

/**
 * Memory entry interface
 */
export interface MemoryEntry {
  key: string;
  value: string;
  timestamp: number;
  namespace?: string;
}

/**
 * Command execution result interface
 */
export interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

/**
 * Project setup configuration
 */
export interface ProjectSetup {
  directory: string;
  structure: {
    src?: string[];
    tests?: string[];
    config?: string[];
    docs?: string[];
  };
  dependencies?: string[];
  envVariables?: string[];
}

/**
 * Architecture design components
 */
export interface ArchitectureDesign {
  components: string[];
  services: string[];
  dependencies: string[];
  integrations: string[];
  security: {
    authentication?: string;
    authorization?: string;
    secrets?: string[];
  };
}

/**
 * Debug issue analysis
 */
export interface DebugIssue {
  description: string;
  reproduction: string[];
  stackTrace?: string;
  affectedComponents: string[];
  rootCause?: string;
  solution?: string;
}

/**
 * Task orchestration strategy
 */
export type OrchestrationStrategy = 
  | 'sequential' 
  | 'parallel' 
  | 'background' 
  | 'swarm'
  | 'hybrid';

/**
 * SPARC workflow phase
 */
export interface WorkflowPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables?: string[];
  nextSteps?: string[];
}

/**
 * Error handling for SPARC modes
 */
export class SparcModeError extends Error {
  constructor(
    message: string,
    public mode: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SparcModeError';
  }
}

/**
 * Validation utilities
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Common SPARC mode constants
 */
export const SPARC_CONSTANTS = {
  MAX_FILE_LINES: 500,
  DEFAULT_TIMEOUT: 300000, // 5 minutes
  MEMORY_NAMESPACE_PREFIX: 'sparc_',
  SUPPORTED_MODES: [
    'architect',
    'ask',
    'code',
    'debug',
    'devops',
    'docs-writer',
    'integration',
    'mcp',
    'monitoring',
    'optimization',
    'security-review',
    'spec-pseudocode',
    'supabase-admin',
    'swarm',
    'tdd',
    'tutorial'
  ]
} as const;

/**
 * Type guard for SPARC mode validation
 */
export function isValidSparcMode(mode: string): mode is typeof SPARC_CONSTANTS.SUPPORTED_MODES[number] {
  return SPARC_CONSTANTS.SUPPORTED_MODES.includes(mode as any);
}