/**
 * Real-time Update System for Claude-Flow Web UI
 * Provides event-driven architecture for live data updates
 * Supports WebSocket-like functionality and progressive loading
 */

import type { EventEmitter } from 'node:events';

// ===== CORE REALTIME TYPES =====

export type EventType = 
  | 'tool_start'
  | 'tool_complete'
  | 'tool_error'
  | 'swarm_status_change'
  | 'memory_change'
  | 'performance_metrics'
  | string; // Allow custom event types

export type ViewName = 
  | 'neural'
  | 'analysis'
  | 'workflow'
  | 'github'
  | 'daa'
  | 'system'
  | 'tools'
  | 'orchestration'
  | 'memory'
  | string; // Allow custom view names

export type UpdateType = 
  | 'training_progress'
  | 'model_update'
  | 'performance_report'
  | 'metrics_update'
  | 'execution_start'
  | 'execution_complete'
  | 'execution_error'
  | 'swarm_update'
  | 'memory_update'
  | 'tool_result'
  | 'data_loaded'
  | 'data_chunk'
  | 'data_error'
  | string; // Allow custom update types

// ===== EVENT INTERFACES =====

export interface EventCallback {
  (data: any, timestamp?: number): void;
}

export interface EventHistoryEntry {
  type: EventType;
  data: any;
  timestamp: number;
}

export interface EventSubscription {
  eventType: EventType;
  callback: EventCallback;
  unsubscribe: () => void;
}

// ===== UPDATE INTERFACES =====

export interface UpdateData {
  type: UpdateType;
  id?: string;
  timestamp: number;
  [key: string]: any;
}

export interface QueuedUpdate extends UpdateData {
  id: string; // Required for queued updates
}

export interface GroupedUpdates extends Map<UpdateType, QueuedUpdate[]> {}

// ===== PERFORMANCE MONITORING =====

export interface UpdateMetrics {
  totalUpdates: number;
  updateLatency: number[];
  batchedUpdates: number;
  droppedUpdates: number;
}

export interface PerformanceMetricsData {
  totalUpdates: number;
  averageLatency: number;
  batchedUpdates: number;
  droppedUpdates: number;
  totalQueueSize: number;
  eventHistorySize: number;
}

// ===== PROGRESSIVE LOADING =====

export interface ProgressiveLoadOptions {
  chunkSize?: number;
  delay?: number;
  onProgress?: (progress: ProgressInfo) => void;
  onComplete?: (data: any) => void;
}

export interface ProgressInfo {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DataChunkUpdate extends UpdateData {
  type: 'data_chunk';
  chunk: any[];
  progress: ProgressInfo;
}

export interface DataErrorUpdate extends UpdateData {
  type: 'data_error';
  error: string;
}

// ===== SYSTEM STATUS =====

export interface SystemStatus {
  subscribers: number;
  queueSizes: Record<ViewName, number>;
  metrics: UpdateMetrics;
  eventHistorySize: number;
  activeTimers: number;
}

// ===== UI INTEGRATION =====

export interface UIInstance {
  currentView?: ViewName;
  enhancedViews?: {
    viewData?: Map<ViewName, any>;
  };
  swarmIntegration?: {
    updateSwarmStatus(): void;
  };
  memoryStats?: {
    namespaces: Array<{
      name: string;
      entries: number;
    }>;
  };
  addLog(level: 'success' | 'info' | 'error' | 'warning', message: string): void;
  render?(): void;
}

// ===== VIEW-SPECIFIC DATA INTERFACES =====

export interface NeuralViewData {
  trainingJobs: Array<{
    id: string;
    startTime?: number;
    [key: string]: any;
  }>;
  models: Array<{
    id: string;
    createdAt?: number;
    [key: string]: any;
  }>;
}

export interface AnalysisViewData {
  reports: Array<{
    id: string;
    timestamp: number;
    [key: string]: any;
  }>;
  metrics: Array<{
    timestamp: number;
    [key: string]: any;
  }>;
}

// ===== TOOL-SPECIFIC EVENT DATA =====

export interface ToolStartData {
  toolName: string;
  executionId: string;
  timestamp?: number;
}

export interface ToolCompleteData {
  toolName: string;
  executionId: string;
  result: any;
  timestamp?: number;
}

export interface ToolErrorData {
  toolName: string;
  executionId: string;
  error: string | Error;
  timestamp?: number;
}

export interface SwarmStatusData {
  swarmId: string;
  status: string;
  timestamp?: number;
}

export interface MemoryChangeData {
  namespace: string;
  operation: 'store' | 'retrieve' | 'delete' | 'search';
  timestamp?: number;
}

// ===== MAIN CLASS IMPLEMENTATION =====

export class RealtimeUpdateSystem {
  private ui: UIInstance;
  private subscribers: Map<EventType, Set<EventCallback>>;
  private updateQueues: Map<ViewName, QueuedUpdate[]>;
  private updateTimers: Map<ViewName, NodeJS.Timeout>;
  private batchDelay: number;
  private eventHistory: EventHistoryEntry[];
  private maxHistorySize: number;
  private updateMetrics: UpdateMetrics;
  private refreshThrottle: NodeJS.Timeout | null = null;

  constructor(ui: UIInstance) {
    this.ui = ui;
    this.subscribers = new Map();
    this.updateQueues = new Map();
    this.updateTimers = new Map();
    this.batchDelay = 100; // ms to batch updates
    this.eventHistory = [];
    this.maxHistorySize = 100;
    
    // Performance monitoring
    this.updateMetrics = {
      totalUpdates: 0,
      updateLatency: [],
      batchedUpdates: 0,
      droppedUpdates: 0
    };
    
    this.initializeSystem();
  }

  /**
   * Initialize the real-time update system
   */
  private initializeSystem(): void {
    // Setup system event listeners
    this.setupSystemEvents();
    
    // Initialize update queues for all views
    this.initializeUpdateQueues();
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    this.ui.addLog('success', 'Real-time update system initialized');
  }

  /**
   * Setup system-level event listeners
   */
  private setupSystemEvents(): void {
    // Listen for tool execution events
    this.subscribe('tool_start', (data: ToolStartData) => {
      this.broadcastUpdate('tools', {
        type: 'execution_start',
        toolName: data.toolName,
        executionId: data.executionId,
        timestamp: Date.now()
      });
    });
    
    this.subscribe('tool_complete', (data: ToolCompleteData) => {
      this.broadcastUpdate('tools', {
        type: 'execution_complete',
        toolName: data.toolName,
        executionId: data.executionId,
        result: data.result,
        timestamp: Date.now()
      });
      
      // Update relevant views based on tool type
      this.updateRelatedViews(data.toolName, data.result);
    });
    
    this.subscribe('tool_error', (data: ToolErrorData) => {
      this.broadcastUpdate('tools', {
        type: 'execution_error',
        toolName: data.toolName,
        executionId: data.executionId,
        error: data.error,
        timestamp: Date.now()
      });
    });
    
    // Listen for swarm events
    this.subscribe('swarm_status_change', (data: SwarmStatusData) => {
      this.broadcastUpdate('orchestration', {
        type: 'swarm_update',
        swarmId: data.swarmId,
        status: data.status,
        timestamp: Date.now()
      });
    });
    
    // Listen for memory events
    this.subscribe('memory_change', (data: MemoryChangeData) => {
      this.broadcastUpdate('memory', {
        type: 'memory_update',
        namespace: data.namespace,
        operation: data.operation,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Initialize update queues for all views
   */
  private initializeUpdateQueues(): void {
    const views: ViewName[] = ['neural', 'analysis', 'workflow', 'github', 'daa', 'system', 'tools', 'orchestration', 'memory'];
    views.forEach(view => {
      this.updateQueues.set(view, []);
    });
  }

  /**
   * Subscribe to specific event types
   */
  public subscribe(eventType: EventType, callback: EventCallback): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const subscribers = this.subscribers.get(eventType)!;
    subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
    };
  }

  /**
   * Emit event to all subscribers
   */
  public emit(eventType: EventType, data: any): void {
    const timestamp = Date.now();
    
    // Add to event history
    this.eventHistory.push({
      type: eventType,
      data,
      timestamp
    });
    
    // Trim history if too large
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
    
    // Notify subscribers
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data, timestamp);
        } catch (error) {
          console.error(`Error in event subscriber for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Broadcast update to specific view
   */
  public broadcastUpdate(viewName: ViewName, updateData: UpdateData): void {
    const queue = this.updateQueues.get(viewName);
    if (!queue) return;
    
    // Add update to queue
    const queuedUpdate: QueuedUpdate = {
      ...updateData,
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };
    queue.push(queuedUpdate);
    
    // Schedule batched update
    this.scheduleBatchedUpdate(viewName);
    
    this.updateMetrics.totalUpdates++;
  }

  /**
   * Schedule batched update for a view
   */
  private scheduleBatchedUpdate(viewName: ViewName): void {
    // Clear existing timer
    const existingTimer = this.updateTimers.get(viewName);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Schedule new batched update
    const timer = setTimeout(() => {
      this.processBatchedUpdates(viewName);
    }, this.batchDelay);
    
    this.updateTimers.set(viewName, timer);
  }

  /**
   * Process batched updates for a view
   */
  private processBatchedUpdates(viewName: ViewName): void {
    const queue = this.updateQueues.get(viewName);
    if (!queue || queue.length === 0) return;
    
    const startTime = Date.now();
    
    // Group updates by type
    const groupedUpdates = this.groupUpdatesByType(queue);
    
    // Apply updates
    this.applyUpdatesToView(viewName, groupedUpdates);
    
    // Clear processed updates
    queue.length = 0;
    
    // Update metrics
    const latency = Date.now() - startTime;
    this.updateMetrics.updateLatency.push(latency);
    this.updateMetrics.batchedUpdates++;
    
    // Keep only last 100 latency measurements
    if (this.updateMetrics.updateLatency.length > 100) {
      this.updateMetrics.updateLatency.shift();
    }
    
    // Clear timer
    this.updateTimers.delete(viewName);
  }

  /**
   * Group updates by type for efficient processing
   */
  private groupUpdatesByType(updates: QueuedUpdate[]): GroupedUpdates {
    const grouped: GroupedUpdates = new Map();
    
    updates.forEach(update => {
      if (!grouped.has(update.type)) {
        grouped.set(update.type, []);
      }
      grouped.get(update.type)!.push(update);
    });
    
    return grouped;
  }

  /**
   * Apply grouped updates to a specific view
   */
  private applyUpdatesToView(viewName: ViewName, groupedUpdates: GroupedUpdates): void {
    try {
      // Different views handle updates differently
      switch (viewName) {
        case 'neural':
          this.applyNeuralUpdates(groupedUpdates);
          break;
        case 'analysis':
          this.applyAnalysisUpdates(groupedUpdates);
          break;
        case 'workflow':
          this.applyWorkflowUpdates(groupedUpdates);
          break;
        case 'tools':
          this.applyToolsUpdates(groupedUpdates);
          break;
        case 'orchestration':
          this.applyOrchestrationUpdates(groupedUpdates);
          break;
        case 'memory':
          this.applyMemoryUpdates(groupedUpdates);
          break;
        default:
          this.applyGenericUpdates(viewName, groupedUpdates);
      }
      
      // Trigger UI refresh if this is the current view
      if (this.ui.currentView === viewName) {
        this.requestUIRefresh();
      }
      
    } catch (error) {
      console.error(`Error applying updates to ${viewName}:`, error);
      this.updateMetrics.droppedUpdates++;
    }
  }

  /**
   * Apply neural-specific updates
   */
  private applyNeuralUpdates(groupedUpdates: GroupedUpdates): void {
    const neuralData = this.ui.enhancedViews?.viewData?.get('neural') as NeuralViewData | undefined;
    if (!neuralData) return;
    
    // Handle training job updates
    const trainingUpdates = groupedUpdates.get('training_progress');
    if (trainingUpdates) {
      trainingUpdates.forEach(update => {
        const existingJob = neuralData.trainingJobs.find(job => job.id === (update as any).jobId);
        if (existingJob) {
          Object.assign(existingJob, (update as any).data);
        } else {
          neuralData.trainingJobs.push({
            id: (update as any).jobId,
            ...(update as any).data,
            startTime: update.timestamp
          });
        }
      });
    }
    
    // Handle model updates
    const modelUpdates = groupedUpdates.get('model_update');
    if (modelUpdates) {
      modelUpdates.forEach(update => {
        const existingModel = neuralData.models.find(model => model.id === (update as any).modelId);
        if (existingModel) {
          Object.assign(existingModel, (update as any).data);
        } else {
          neuralData.models.push({
            id: (update as any).modelId,
            ...(update as any).data,
            createdAt: update.timestamp
          });
        }
      });
    }
  }

  /**
   * Apply analysis-specific updates
   */
  private applyAnalysisUpdates(groupedUpdates: GroupedUpdates): void {
    const analysisData = this.ui.enhancedViews?.viewData?.get('analysis') as AnalysisViewData | undefined;
    if (!analysisData) return;
    
    // Handle performance report updates
    const reportUpdates = groupedUpdates.get('performance_report');
    if (reportUpdates) {
      reportUpdates.forEach(update => {
        analysisData.reports.unshift({
          id: (update as any).reportId || `report_${update.timestamp}`,
          ...(update as any).data,
          timestamp: update.timestamp
        });
        
        // Keep only last 50 reports
        if (analysisData.reports.length > 50) {
          analysisData.reports = analysisData.reports.slice(0, 50);
        }
      });
    }
    
    // Handle metrics updates
    const metricsUpdates = groupedUpdates.get('metrics_update');
    if (metricsUpdates) {
      metricsUpdates.forEach(update => {
        analysisData.metrics.push({
          ...(update as any).data,
          timestamp: update.timestamp
        });
        
        // Keep only last 100 metric points
        if (analysisData.metrics.length > 100) {
          analysisData.metrics.shift();
        }
      });
    }
  }

  /**
   * Apply workflow-specific updates
   */
  private applyWorkflowUpdates(groupedUpdates: GroupedUpdates): void {
    // Implement workflow-specific update logic
    this.applyGenericUpdates('workflow', groupedUpdates);
  }

  /**
   * Apply tools-specific updates
   */
  private applyToolsUpdates(groupedUpdates: GroupedUpdates): void {
    // Handle execution updates
    const executionUpdates = groupedUpdates.get('execution_start');
    if (executionUpdates) {
      executionUpdates.forEach(update => {
        this.ui.addLog('info', `🔧 Started: ${(update as any).toolName}`);
      });
    }
    
    const completionUpdates = groupedUpdates.get('execution_complete');
    if (completionUpdates) {
      completionUpdates.forEach(update => {
        this.ui.addLog('success', `✅ Completed: ${(update as any).toolName}`);
        
        // Show result summary if available
        const result = (update as any).result;
        if (result && result.summary) {
          this.ui.addLog('info', `📋 ${result.summary}`);
        }
      });
    }
    
    const errorUpdates = groupedUpdates.get('execution_error');
    if (errorUpdates) {
      errorUpdates.forEach(update => {
        this.ui.addLog('error', `❌ Failed: ${(update as any).toolName} - ${(update as any).error}`);
      });
    }
  }

  /**
   * Apply orchestration-specific updates
   */
  private applyOrchestrationUpdates(groupedUpdates: GroupedUpdates): void {
    // Handle swarm updates
    const swarmUpdates = groupedUpdates.get('swarm_update');
    if (swarmUpdates) {
      swarmUpdates.forEach(update => {
        // Update swarm integration data
        if (this.ui.swarmIntegration) {
          this.ui.swarmIntegration.updateSwarmStatus();
        }
        
        this.ui.addLog('info', `🐝 Swarm ${(update as any).swarmId}: ${(update as any).status}`);
      });
    }
  }

  /**
   * Apply memory-specific updates
   */
  private applyMemoryUpdates(groupedUpdates: GroupedUpdates): void {
    // Handle memory operation updates
    const memoryUpdates = groupedUpdates.get('memory_update');
    if (memoryUpdates) {
      memoryUpdates.forEach(update => {
        // Update memory stats
        if (this.ui.memoryStats) {
          const namespace = this.ui.memoryStats.namespaces.find(ns => ns.name === (update as any).namespace);
          if (namespace) {
            // Update existing namespace stats
            const operation = (update as any).operation;
            if (operation === 'store') {
              namespace.entries++;
            } else if (operation === 'delete') {
              namespace.entries = Math.max(0, namespace.entries - 1);
            }
          }
        }
        
        this.ui.addLog('info', `💾 Memory ${(update as any).operation} in ${(update as any).namespace}`);
      });
    }
  }

  /**
   * Apply generic updates for other views
   */
  private applyGenericUpdates(viewName: ViewName, groupedUpdates: GroupedUpdates): void {
    // Log generic updates
    groupedUpdates.forEach((updates, type) => {
      updates.forEach(update => {
        this.ui.addLog('info', `📡 ${viewName}: ${type} update`);
      });
    });
  }

  /**
   * Update related views based on tool execution
   */
  private updateRelatedViews(toolName: string, result: any): void {
    // Map tool names to affected views
    const toolViewMap: Record<string, ViewName[]> = {
      // Neural tools affect neural view
      'neural_train': ['neural'],
      'neural_predict': ['neural'],
      'neural_status': ['neural'],
      'model_save': ['neural'],
      'model_load': ['neural'],
      
      // Analysis tools affect analysis view
      'performance_report': ['analysis'],
      'bottleneck_analyze': ['analysis'],
      'token_usage': ['analysis'],
      'benchmark_run': ['analysis'],
      
      // Swarm tools affect orchestration view
      'swarm_init': ['orchestration'],
      'agent_spawn': ['orchestration'],
      'task_orchestrate': ['orchestration'],
      
      // Memory tools affect memory view
      'memory_usage': ['memory'],
      'memory_search': ['memory'],
      'memory_backup': ['memory']
    };
    
    const affectedViews = toolViewMap[toolName] || [];
    
    affectedViews.forEach(viewName => {
      this.broadcastUpdate(viewName, {
        type: 'tool_result',
        toolName,
        result,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Request UI refresh (throttled)
   */
  private requestUIRefresh(): void {
    if (this.refreshThrottle) return;
    
    this.refreshThrottle = setTimeout(() => {
      if (this.ui && typeof this.ui.render === 'function') {
        this.ui.render();
      }
      this.refreshThrottle = null;
    }, 50); // Throttle to max 20 FPS
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.reportPerformanceMetrics();
    }, 60000); // Report every minute
  }

  /**
   * Report performance metrics
   */
  private reportPerformanceMetrics(): void {
    const avgLatency = this.updateMetrics.updateLatency.length > 0 
      ? this.updateMetrics.updateLatency.reduce((a, b) => a + b, 0) / this.updateMetrics.updateLatency.length 
      : 0;
    
    const queueSizes = Array.from(this.updateQueues.values()).map(q => q.length);
    const totalQueueSize = queueSizes.reduce((a, b) => a + b, 0);
    
    const metricsData: PerformanceMetricsData = {
      totalUpdates: this.updateMetrics.totalUpdates,
      averageLatency: avgLatency,
      batchedUpdates: this.updateMetrics.batchedUpdates,
      droppedUpdates: this.updateMetrics.droppedUpdates,
      totalQueueSize,
      eventHistorySize: this.eventHistory.length
    };
    
    this.emit('performance_metrics', metricsData);
  }

  /**
   * Get system status
   */
  public getStatus(): SystemStatus {
    const queueSizes: Record<ViewName, number> = {};
    this.updateQueues.forEach((queue, viewName) => {
      queueSizes[viewName] = queue.length;
    });
    
    return {
      subscribers: this.subscribers.size,
      queueSizes,
      metrics: this.updateMetrics,
      eventHistorySize: this.eventHistory.length,
      activeTimers: this.updateTimers.size
    };
  }

  /**
   * Create progressive loading handler
   */
  public createProgressiveLoader<T>(
    viewName: ViewName, 
    dataLoader: () => Promise<T>, 
    options: ProgressiveLoadOptions = {}
  ): () => Promise<void> {
    const {
      chunkSize = 10,
      delay = 100,
      onProgress = null,
      onComplete = null
    } = options;
    
    return async () => {
      try {
        const data = await dataLoader();
        
        if (!Array.isArray(data)) {
          // Non-array data, load immediately
          this.broadcastUpdate(viewName, {
            type: 'data_loaded',
            data,
            timestamp: Date.now()
          });
          
          if (onComplete) onComplete(data);
          return;
        }
        
        // Progressive loading for arrays
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          
          const progress: ProgressInfo = {
            loaded: Math.min(i + chunkSize, data.length),
            total: data.length,
            percentage: Math.min(((i + chunkSize) / data.length) * 100, 100)
          };
          
          this.broadcastUpdate(viewName, {
            type: 'data_chunk',
            chunk,
            progress,
            timestamp: Date.now()
          });
          
          if (onProgress) {
            onProgress(progress);
          }
          
          // Small delay between chunks to prevent blocking
          if (i + chunkSize < data.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        if (onComplete) onComplete(data);
        
      } catch (error) {
        this.broadcastUpdate(viewName, {
          type: 'data_error',
          error: error instanceof Error ? error.message : String(error),
          timestamp: Date.now()
        });
      }
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    // Clear all timers
    this.updateTimers.forEach(timer => clearTimeout(timer));
    this.updateTimers.clear();
    
    // Clear refresh throttle
    if (this.refreshThrottle) {
      clearTimeout(this.refreshThrottle);
    }
    
    // Clear all subscribers
    this.subscribers.clear();
    
    // Clear update queues
    this.updateQueues.clear();
    
    this.ui.addLog('info', 'Real-time update system cleaned up');
  }
}

export default RealtimeUpdateSystem;