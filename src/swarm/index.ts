import { getErrorMessage } from '../utils/error-handler';
// Main exports for the swarm system

// Coordinator exports
export { SwarmCoordinator } from './coordinator';

// Executor exports
export { TaskExecutor } from './executor';
export type {
  ExecutionContext,
  ExecutionResources,
  ExecutionResult,
  ResourceUsage,
  ExecutionConfig,
  ClaudeExecutionOptions,
  ClaudeCommand,
  ExecutionMetrics
} from './executor';

// Type exports - safe to use export * for type-only files
export * from './types';

// Strategy exports
export { BaseStrategy } from './strategies/base';
export { AutoStrategy } from './strategies/auto';
export { ResearchStrategy } from './strategies/research';

// Memory exports
export { SwarmMemoryManager } from './memory';
export type { MemoryConfig, MemoryQuery, MemorySearchOptions, MemoryStatistics, MemoryBackup } from './memory';

// Prompt copying system exports
export { PromptCopier, copyPrompts } from './prompt-copier';
export type { CopyOptions, CopyResult, CopyProgress, CopyError, FileInfo } from './prompt-copier';
export { EnhancedPromptCopier, copyPromptsEnhanced } from './prompt-copier-enhanced';
export * from './prompt-utils';
export { PromptManager } from './prompt-manager';

// Optimizations - explicit exports to avoid conflicts
export {
  ClaudeConnectionPool,
  AsyncFileManager,
  CircularBuffer,
  TTLMap,
  OptimizedExecutor,
  createOptimizedSwarmStack
} from './optimizations/index';
export type {
  PoolConfig,
  PooledConnection,
  FileOperationResult,
  TTLMapOptions,
  ExecutorConfig as OptimizedExecutorConfig,
  ExecutionMetrics as OptimizedExecutionMetrics
} from './optimizations/index';

// Utility function to get all exports
export function getSwarmComponents() {
  return {
    // Core components
    coordinator: () => import('./coordinator'),
    executor: () => import('./executor'),
    types: () => import('./types'),
    
    // Strategies
    strategies: {
      base: () => import('./strategies/base'),
      auto: () => import('./strategies/auto'),
      research: () => import('./strategies/research')
    },
    
    // Memory
    memory: () => import('./memory'),
    
    // Prompt system
    promptCopier: () => import('./prompt-copier'),
    promptCopierEnhanced: () => import('./prompt-copier-enhanced'),
    promptUtils: () => import('./prompt-utils'),
    promptManager: () => import('./prompt-manager'),
    promptCli: () => import('./prompt-cli'),
    
    // Optimizations
    optimizations: () => import('./optimizations/index')
  };
}