import { getErrorMessage } from '../utils/error-handler.js';
// Main exports for the swarm system

// Coordinator exports
export { SwarmCoordinator } from './coordinator.js';

// Executor exports
export { TaskExecutor } from './executor.js';
export type {
  ExecutionContext,
  ExecutionResources,
  ExecutionResult,
  ResourceUsage,
  ExecutionConfig,
  ClaudeExecutionOptions,
  ClaudeCommand,
  ExecutionMetrics
} from './executor.js';

// Type exports - safe to use export * for type-only files
export * from './types.js';

// Strategy exports
export { BaseStrategy } from './strategies/base.js';
export { AutoStrategy } from './strategies/auto.js';
export { ResearchStrategy } from './strategies/research.js';

// Memory exports
export { SwarmMemoryManager } from './memory.js';
export type { MemoryConfig, MemoryQuery, MemorySearchOptions, MemoryStatistics, MemoryBackup } from './memory.js';

// Prompt copying system exports
export { PromptCopier, copyPrompts } from './prompt-copier.js';
export type { CopyOptions, CopyResult, CopyProgress, CopyError, FileInfo } from './prompt-copier.js';
export { EnhancedPromptCopier, copyPromptsEnhanced } from './prompt-copier-enhanced.js';
export * from './prompt-utils.js';
export { PromptManager } from './prompt-manager.js';

// Optimizations - explicit exports to avoid conflicts
export {
  ClaudeConnectionPool,
  AsyncFileManager,
  CircularBuffer,
  TTLMap,
  OptimizedExecutor,
  createOptimizedSwarmStack
} from './optimizations/index.js';
export type {
  PoolConfig,
  PooledConnection,
  FileOperationResult,
  TTLMapOptions,
  ExecutorConfig as OptimizedExecutorConfig,
  ExecutionMetrics as OptimizedExecutionMetrics
} from './optimizations/index.js';

// Utility function to get all exports
export function getSwarmComponents() {
  return {
    // Core components
    coordinator: () => import('./coordinator.js'),
    executor: () => import('./executor.js'),
    types: () => import('./types.js'),
    
    // Strategies
    strategies: {
      base: () => import('./strategies/base.js'),
      auto: () => import('./strategies/auto.js'),
      research: () => import('./strategies/research.js')
    },
    
    // Memory
    memory: () => import('./memory.js'),
    
    // Prompt system
    promptCopier: () => import('./prompt-copier.js'),
    promptCopierEnhanced: () => import('./prompt-copier-enhanced.js'),
    promptUtils: () => import('./prompt-utils.js'),
    promptManager: () => import('./prompt-manager.js'),
    promptCli: () => import('./prompt-cli.js'),
    
    // Optimizations
    optimizations: () => import('./optimizations/index.js')
  };
}