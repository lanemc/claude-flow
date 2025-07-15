/**
 * Performance Optimizer for Hive Mind System
 * Implements advanced performance optimizations including:
 * - Async operation optimization
 * - Connection pooling management
 * - Batch operation coordination
 * - Performance monitoring and auto-tuning
 */

import EventEmitter from 'events';
import { performance } from 'perf_hooks';

/**
 * Configuration interface for AsyncOperationQueue
 */
export interface AsyncQueueConfig {
  maxConcurrency?: number;
  timeout?: number;
}

/**
 * Queue metrics interface
 */
export interface QueueMetrics {
  processed: number;
  failures: number;
  avgProcessingTime: number;
  totalProcessingTime: number;
  successRate: string;
  queueSize: number;
  running: number;
  utilization: string;
}

/**
 * Queue item interface
 */
interface QueueItem {
  operation: () => Promise<any>;
  priority: number;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  addedAt: number;
  id: string;
}

/**
 * Internal queue metrics interface
 */
interface InternalQueueMetrics {
  processed: number;
  failures: number;
  avgProcessingTime: number;
  totalProcessingTime: number;
}

/**
 * AsyncOperationQueue for managing concurrent operations
 */
class AsyncOperationQueue {
  private maxConcurrency: number;
  private timeout: number;
  private running: number = 0;
  private queue: QueueItem[] = [];
  private results: Map<string, any> = new Map();
  private metrics: InternalQueueMetrics;

  constructor(maxConcurrency: number = 10, timeout: number = 30000) {
    this.maxConcurrency = maxConcurrency;
    this.timeout = timeout;
    this.metrics = {
      processed: 0,
      failures: 0,
      avgProcessingTime: 0,
      totalProcessingTime: 0
    };
  }

  async add(operation: () => Promise<any>, priority: number = 5): Promise<any> {
    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        operation,
        priority,
        resolve,
        reject,
        addedAt: Date.now(),
        id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(queueItem);
      } else {
        this.queue.splice(insertIndex, 0, queueItem);
      }

      this._processQueue();
    });
  }

  private async _processQueue(): Promise<void> {
    if (this.running >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.running++;

    const startTime = performance.now();

    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), this.timeout);
      });

      const result = await Promise.race([
        item.operation(),
        timeoutPromise
      ]);

      const processingTime = performance.now() - startTime;
      this._updateMetrics(processingTime, true);

      item.resolve(result);
    } catch (error) {
      const processingTime = performance.now() - startTime;
      this._updateMetrics(processingTime, false);

      item.reject(error);
    } finally {
      this.running--;
      setImmediate(() => this._processQueue());
    }
  }

  private _updateMetrics(processingTime: number, success: boolean): void {
    this.metrics.processed++;
    this.metrics.totalProcessingTime += processingTime;
    this.metrics.avgProcessingTime = this.metrics.totalProcessingTime / this.metrics.processed;

    if (!success) {
      this.metrics.failures++;
    }
  }

  getMetrics(): QueueMetrics {
    return {
      ...this.metrics,
      successRate: this.metrics.processed > 0 
        ? ((this.metrics.processed - this.metrics.failures) / this.metrics.processed * 100).toFixed(2)
        : '100',
      queueSize: this.queue.length,
      running: this.running,
      utilization: (this.running / this.maxConcurrency * 100).toFixed(2)
    };
  }
}

/**
 * Batch configuration interface
 */
export interface BatchConfig {
  maxBatchSize?: number;
  flushInterval?: number;
  maxWaitTime?: number;
}

/**
 * Batch item interface
 */
interface BatchItem {
  data: any;
  _resolve?: (value: any) => void;
  _reject?: (reason: any) => void;
}

/**
 * Batch data interface
 */
interface BatchData {
  items: BatchItem[];
  processor: (items: any[]) => Promise<any>;
  createdAt: number;
}

/**
 * Batch metrics interface
 */
export interface BatchMetrics {
  batchesProcessed: number;
  itemsProcessed: number;
  avgBatchSize: number;
  avgProcessingTime: number;
  pendingBatches: number;
  pendingItems: number;
}

/**
 * BatchProcessor for optimizing bulk operations
 */
class BatchProcessor extends EventEmitter {
  public config: Required<BatchConfig>;
  private batches: Map<string, BatchData> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private metrics: {
    batchesProcessed: number;
    itemsProcessed: number;
    avgBatchSize: number;
    avgProcessingTime: number;
  };
  private flushTimer: NodeJS.Timeout;

  constructor(config: BatchConfig = {}) {
    super();
    
    this.config = {
      maxBatchSize: config.maxBatchSize || 50,
      flushInterval: config.flushInterval || 1000,
      maxWaitTime: config.maxWaitTime || 5000
    };

    this.metrics = {
      batchesProcessed: 0,
      itemsProcessed: 0,
      avgBatchSize: 0,
      avgProcessingTime: 0
    };

    this.flushTimer = this._startPeriodicFlush();
  }

  async addToBatch(batchKey: string, item: any, processor: (items: any[]) => Promise<any>): Promise<any> {
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, {
        items: [],
        processor,
        createdAt: Date.now()
      });

      // Set timeout for this batch
      const timer = setTimeout(() => {
        this._processBatch(batchKey);
      }, this.config.maxWaitTime);

      this.timers.set(batchKey, timer);
    }

    const batch = this.batches.get(batchKey)!;
    batch.items.push(item);

    // Process if batch is full
    if (batch.items.length >= this.config.maxBatchSize) {
      return this._processBatch(batchKey);
    }

    return new Promise((resolve, reject) => {
      item._resolve = resolve;
      item._reject = reject;
    });
  }

  private async _processBatch(batchKey: string): Promise<any> {
    const batch = this.batches.get(batchKey);
    if (!batch || batch.items.length === 0) return;

    // Clear timer and remove from maps
    const timer = this.timers.get(batchKey);
    if (timer) clearTimeout(timer);
    
    this.timers.delete(batchKey);
    this.batches.delete(batchKey);

    const startTime = performance.now();

    try {
      const results = await batch.processor(batch.items);
      const processingTime = performance.now() - startTime;

      // Update metrics
      this.metrics.batchesProcessed++;
      this.metrics.itemsProcessed += batch.items.length;
      this.metrics.avgBatchSize = this.metrics.itemsProcessed / this.metrics.batchesProcessed;
      this.metrics.avgProcessingTime = 
        (this.metrics.avgProcessingTime * (this.metrics.batchesProcessed - 1) + processingTime) / 
        this.metrics.batchesProcessed;

      // Resolve individual item promises
      batch.items.forEach((item, _index) => {
        if (item._resolve) {
          item._resolve(results[index] || results);
        }
      });

      this.emit('batch:processed', {
        batchKey,
        itemCount: batch.items.length,
        processingTime,
        results
      });

      return results;

    } catch (error) {
      // Reject individual item promises
      batch.items.forEach(item => {
        if (item._reject) {
          item._reject(error);
        }
      });

      this.emit('batch:error', { batchKey, error, itemCount: batch.items.length });
      throw error;
    }
  }

  private _startPeriodicFlush(): NodeJS.Timeout {
    return setInterval(() => {
      const now = Date.now();
      
      for (const [batchKey, batch] of this.batches.entries()) {
        // Flush batches that have been waiting too long
        if (now - batch.createdAt > this.config.flushInterval) {
          this._processBatch(batchKey);
        }
      }
    }, this.config.flushInterval);
  }

  getMetrics(): BatchMetrics {
    return {
      ...this.metrics,
      pendingBatches: this.batches.size,
      pendingItems: Array.from(this.batches.values())
        .reduce((sum, batch) => sum + batch.items.length, 0)
    };
  }

  async close(): Promise<void> {
    // Clear the periodic flush timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Process all remaining batches
    const batchKeys = Array.from(this.batches.keys());
    await Promise.all(batchKeys.map(key => this._processBatch(key)));
  }
}

/**
 * Performance optimizer configuration interface
 */
export interface PerformanceOptimizerConfig {
  enableAsyncQueue?: boolean;
  enableBatchProcessing?: boolean;
  enableAutoTuning?: boolean;
  asyncQueueConcurrency?: number;
  batchMaxSize?: number;
  metricsInterval?: number;
  asyncTimeout?: number;
  batchFlushInterval?: number;
  batchMaxWaitTime?: number;
}

/**
 * Cache entry interface
 */
interface CacheEntry {
  value: any;
  timestamp: number;
}

/**
 * Connection pool interface (simplified)
 */
export interface ConnectionPool {
  acquire(): Promise<any>;
  release(connection: any): void;
}

/**
 * Performance statistics interface
 */
export interface PerformanceStats {
  optimizer: {
    optimizations: {
      asyncOperations: number;
      batchOperations: number;
      cacheHits: number;
      performanceGains: number[];
    };
    system: {
      cpuUsage: number;
      memoryUsage: number | string;
      throughput: number | string;
    };
  };
  asyncQueue: QueueMetrics;
  batchProcessor: BatchMetrics;
  cache: {
    size: number;
    hitRate: string;
  };
}

/**
 * Optimization recommendation interface
 */
export interface OptimizationRecommendation {
  type: 'scaling' | 'caching' | 'batching';
  priority: 'low' | 'medium' | 'high';
  message: string;
  currentValue?: any;
  suggestedValue?: any;
  currentHitRate?: string;
  avgBatchSize?: number;
}

/**
 * Performance report interface
 */
export interface PerformanceReport {
  timestamp: string;
  performance: PerformanceStats;
  recommendations: OptimizationRecommendation[];
  summary: {
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    keyMetrics: {
      throughput: number | string;
      efficiency: string;
      utilization: string;
    };
  };
}

/**
 * Agent complexity grouping interface
 */
interface AgentComplexity {
  low: string[];
  medium: string[];
  high: string[];
}

/**
 * PerformanceOptimizer main class
 */
export class PerformanceOptimizer extends EventEmitter {
  public config: Required<PerformanceOptimizerConfig>;
  public asyncQueue: AsyncOperationQueue;
  public batchProcessor: BatchProcessor;
  private metrics: {
    optimizations: {
      asyncOperations: number;
      batchOperations: number;
      cacheHits: number;
      performanceGains: number[];
    };
    system: {
      cpuUsage: number;
      memoryUsage: number;
      throughput: number;
    };
  };
  private cache: Map<string, CacheEntry> = new Map();
  private performanceBaseline: { avgAsyncTime: number } | null = null;
  private metricsTimer?: NodeJS.Timeout;
  private autoTuneTimer?: NodeJS.Timeout;

  constructor(config: PerformanceOptimizerConfig = {}) {
    super();

    this.config = {
      enableAsyncQueue: config.enableAsyncQueue !== false,
      enableBatchProcessing: config.enableBatchProcessing !== false,
      enableAutoTuning: config.enableAutoTuning !== false,
      asyncQueueConcurrency: config.asyncQueueConcurrency || 10,
      batchMaxSize: config.batchMaxSize || 50,
      metricsInterval: config.metricsInterval || 30000,
      asyncTimeout: config.asyncTimeout || 30000,
      batchFlushInterval: config.batchFlushInterval || 1000,
      batchMaxWaitTime: config.batchMaxWaitTime || 5000
    };

    this.asyncQueue = new AsyncOperationQueue(
      this.config.asyncQueueConcurrency,
      this.config.asyncTimeout
    );

    this.batchProcessor = new BatchProcessor({
      maxBatchSize: this.config.batchMaxSize,
      flushInterval: this.config.batchFlushInterval,
      maxWaitTime: this.config.batchMaxWaitTime
    });

    this.metrics = {
      optimizations: {
        asyncOperations: 0,
        batchOperations: 0,
        cacheHits: 0,
        performanceGains: []
      },
      system: {
        cpuUsage: 0,
        memoryUsage: 0,
        throughput: 0
      }
    };

    this._initialize();
  }

  private _initialize(): void {
    // Start performance monitoring
    if (this.config.metricsInterval > 0) {
      this.metricsTimer = setInterval(() => this._collectSystemMetrics(), this.config.metricsInterval);
    }

    // Auto-tuning
    if (this.config.enableAutoTuning) {
      this.autoTuneTimer = setInterval(() => this._autoTune(), 60000); // Every minute
    }

    this.emit('optimizer:initialized');
  }

  /**
   * Optimize async operation execution
   */
  async optimizeAsyncOperation(operation: () => Promise<any>, options: { priority?: number } = {}): Promise<any> {
    if (!this.config.enableAsyncQueue) {
      return await operation();
    }

    const startTime = performance.now();
    
    try {
      const result = await this.asyncQueue.add(operation, options.priority || 5);
      
      const executionTime = performance.now() - startTime;
      this.metrics.optimizations.asyncOperations++;
      
      // Track performance gain vs baseline
      if (this.performanceBaseline) {
        const gain = Math.max(0, this.performanceBaseline.avgAsyncTime - executionTime);
        this.metrics.optimizations.performanceGains.push(gain);
      }

      return result;
    } catch (error) {
      this.emit('error', { type: 'async_optimization_failed', error, operation: operation.name });
      throw error;
    }
  }

  /**
   * Optimize batch operations
   */
  async optimizeBatchOperation(batchKey: string, item: any, processor: (items: any[]) => Promise<any>): Promise<any> {
    if (!this.config.enableBatchProcessing) {
      return await processor([item]);
    }

    this.metrics.optimizations.batchOperations++;

    return await this.batchProcessor.addToBatch(batchKey, item, processor);
  }

  /**
   * Optimized caching with automatic expiration
   */
  async optimizeWithCache(key: string, operation: () => Promise<any>, ttl: number = 300000): Promise<any> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      this.metrics.optimizations.cacheHits++;
      return cached.value;
    }

    const result = await operation();
    
    this.cache.set(key, {
      value: result,
      timestamp: Date.now()
    });

    // Clean old cache entries periodically
    if (this.cache.size > 1000) {
      this._cleanCache();
    }

    return result;
  }

  /**
   * Optimize memory operations with connection pooling awareness
   */
  async optimizeMemoryOperation(operation: (connection: any) => Promise<any>, connectionPool: ConnectionPool): Promise<any> {
    const startTime = performance.now();
    
    let connection = null;
    try {
      connection = await connectionPool.acquire();
      const result = await operation(connection);
      
      const executionTime = performance.now() - startTime;
      
      // Track connection efficiency
      this.metrics.system.throughput = 
        (this.metrics.system.throughput * 0.9) + (1000 / executionTime * 0.1);

      return result;
    } finally {
      if (connection) {
        connectionPool.release(connection);
      }
    }
  }

  /**
   * Optimize agent spawning with intelligent batching
   */
  async optimizeAgentSpawning(agentTypes: string[], spawnFunction: (agents: string[]) => Promise<any>): Promise<any[]> {
    // Group agents by complexity for optimal batching
    const groups = this._groupAgentsByComplexity(agentTypes);
    const results: any[] = [];

    for (const group of groups) {
      const batchResult = await this.optimizeBatchOperation(
        'agent_spawn',
        group,
        spawnFunction
      );
      results.push(...(Array.isArray(batchResult) ? batchResult : [batchResult]));
    }

    return results;
  }

  /**
   * Group agents by complexity for optimal spawning
   */
  private _groupAgentsByComplexity(agentTypes: string[]): string[][] {
    const complexity: AgentComplexity = {
      low: ['coordinator'],
      medium: ['coder', 'tester', 'documenter'],
      high: ['researcher', 'analyst', 'architect', 'optimizer', 'reviewer']
    };

    const groups: string[][] = [];
    
    Object.entries(complexity).forEach(([level, types]) => {
      const groupAgents = agentTypes.filter(type => types.includes(type));
      if (groupAgents.length > 0) {
        groups.push(groupAgents);
      }
    });

    return groups;
  }

  /**
   * Auto-tune performance parameters based on metrics
   */
  private _autoTune(): void {
    const queueMetrics = this.asyncQueue.getMetrics();
    const batchMetrics = this.batchProcessor.getMetrics();

    // Adjust async queue concurrency based on utilization
    if (parseFloat(queueMetrics.utilization) > 90 && this.asyncQueue.maxConcurrency < 20) {
      this.asyncQueue.maxConcurrency += 2;
      this.emit('auto_tune', { 
        type: 'concurrency_increased', 
        newValue: this.asyncQueue.maxConcurrency 
      });
    } else if (parseFloat(queueMetrics.utilization) < 30 && this.asyncQueue.maxConcurrency > 5) {
      this.asyncQueue.maxConcurrency = Math.max(5, this.asyncQueue.maxConcurrency - 1);
      this.emit('auto_tune', { 
        type: 'concurrency_decreased', 
        newValue: this.asyncQueue.maxConcurrency 
      });
    }

    // Adjust batch sizes based on processing efficiency
    if (batchMetrics.avgBatchSize > 30 && batchMetrics.avgProcessingTime > 5000) {
      this.batchProcessor.config.maxBatchSize = Math.max(20, this.batchProcessor.config.maxBatchSize - 5);
      this.emit('auto_tune', { 
        type: 'batch_size_decreased', 
        newValue: this.batchProcessor.config.maxBatchSize 
      });
    }
  }

  /**
   * Clean old cache entries
   */
  private _cleanCache(): void {
    const entries = Array.from(this.cache.entries());
    
    // Remove oldest 20% of entries
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = Math.floor(entries.length * 0.2);
    
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Collect system performance metrics
   */
  private _collectSystemMetrics(): void {
    // Simple CPU and memory usage estimation
    const used = process.memoryUsage();
    this.metrics.system.memoryUsage = parseFloat((used.heapUsed / 1024 / 1024).toFixed(2)); // MB

    // Estimate throughput based on recent operations
    const queueMetrics = this.asyncQueue.getMetrics();
    this.metrics.system.throughput = queueMetrics.processed > 0 ? 
      parseFloat((queueMetrics.processed / (queueMetrics.avgProcessingTime / 1000)).toFixed(2)) : 0;
  }

  /**
   * Get comprehensive performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    return {
      optimizer: this.metrics,
      asyncQueue: this.asyncQueue.getMetrics(),
      batchProcessor: this.batchProcessor.getMetrics(),
      cache: {
        size: this.cache.size,
        hitRate: this.metrics.optimizations.cacheHits > 0 ? 
          (this.metrics.optimizations.cacheHits / 
           (this.metrics.optimizations.asyncOperations + this.metrics.optimizations.cacheHits) * 100).toFixed(2) 
          : '0'
      }
    };
  }

  /**
   * Generate performance report with recommendations
   */
  generatePerformanceReport(): PerformanceReport {
    const stats = this.getPerformanceStats();
    const recommendations: OptimizationRecommendation[] = [];

    // Analyze and provide recommendations
    if (parseFloat(stats.asyncQueue.utilization) > 80) {
      recommendations.push({
        type: 'scaling',
        priority: 'high',
        message: 'Consider increasing async queue concurrency',
        currentValue: this.asyncQueue.maxConcurrency,
        suggestedValue: this.asyncQueue.maxConcurrency + 3
      });
    }

    if (parseFloat(stats.cache.hitRate) < 60) {
      recommendations.push({
        type: 'caching',
        priority: 'medium',
        message: 'Cache hit rate is low, consider increasing cache TTL or size',
        currentHitRate: stats.cache.hitRate
      });
    }

    if (stats.batchProcessor.avgBatchSize < 10) {
      recommendations.push({
        type: 'batching',
        priority: 'medium',
        message: 'Batch sizes are small, consider increasing batch wait time',
        avgBatchSize: stats.batchProcessor.avgBatchSize
      });
    }

    return {
      timestamp: new Date().toISOString(),
      performance: stats,
      recommendations,
      summary: {
        overallHealth: this._calculateOverallHealth(stats),
        keyMetrics: {
          throughput: stats.optimizer.system.throughput,
          efficiency: stats.asyncQueue.successRate,
          utilization: stats.asyncQueue.utilization
        }
      }
    };
  }

  /**
   * Calculate overall system health score
   */
  private _calculateOverallHealth(stats: PerformanceStats): 'excellent' | 'good' | 'fair' | 'poor' {
    const factors = [
      Math.min(100, parseFloat(stats.asyncQueue.successRate)),
      Math.min(100, 100 - parseFloat(stats.asyncQueue.utilization)), // Lower utilization is better
      Math.min(100, parseFloat(stats.cache.hitRate)),
      Math.min(100, stats.batchProcessor.avgBatchSize / this.config.batchMaxSize * 100)
    ];

    const avgScore = factors.reduce((sum, score) => sum + score, 0) / factors.length;
    
    if (avgScore >= 80) return 'excellent';
    if (avgScore >= 60) return 'good';
    if (avgScore >= 40) return 'fair';
    return 'poor';
  }

  /**
   * Close optimizer and cleanup resources
   */
  async close(): Promise<void> {
    // Clear timers
    if (this.metricsTimer) clearInterval(this.metricsTimer);
    if (this.autoTuneTimer) clearInterval(this.autoTuneTimer);

    await this.batchProcessor.close();
    this.cache.clear();
    this.emit('optimizer:closed');
  }
}

export default PerformanceOptimizer;