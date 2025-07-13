/**
 * Swarm Optimizations
 * Export all optimization components
 */

import { ClaudeConnectionPool } from './connection-pool';
import { AsyncFileManager } from './async-file-manager';
import { OptimizedExecutor } from './optimized-executor';

export { ClaudeConnectionPool } from './connection-pool';
export type { PoolConfig, PooledConnection } from './connection-pool';

export { AsyncFileManager } from './async-file-manager';
export type { FileOperationResult } from './async-file-manager';

export { CircularBuffer } from './circular-buffer';

export { TTLMap } from './ttl-map';
export type { TTLMapOptions } from './ttl-map';

export { OptimizedExecutor } from './optimized-executor';
export type { ExecutorConfig, ExecutionMetrics } from './optimized-executor';

// Re-export commonly used together
export const createOptimizedSwarmStack = (config?: {
  connectionPool?: any;
  executor?: any;
  fileManager?: any;
}) => {
  const connectionPool = new ClaudeConnectionPool(config?.connectionPool);
  const fileManager = new AsyncFileManager(config?.fileManager);
  const executor = new OptimizedExecutor({
    ...config?.executor,
    connectionPool: config?.connectionPool,
    fileOperations: config?.fileManager
  });
  
  return {
    connectionPool,
    fileManager,
    executor,
    shutdown: async () => {
      await executor.shutdown();
      await fileManager.waitForPendingOperations();
      await connectionPool.drain();
    }
  };
};