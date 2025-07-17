/**
 * Hive Mind Shared Type Definitions
 * 
 * Comprehensive type definitions for the Hive Mind system including:
 * - Agent communication protocols
 * - Performance metrics
 * - Hive configurations
 * - Task management
 * - Optimization results
 * - SPARC methodology integration
 */

// Re-export all types from hive-mind/types for centralized access
export * from '../hive-mind/types.js';

// ============================================
// SPARC Methodology Types
// ============================================

export interface SparcMode {
  name: string;
  description: string;
  tools?: string[];
  usagePattern?: string;
  bestPractices?: string[];
  integrationCapabilities?: string[];
  instructions?: string;
  systemPrompt?: string;
}

export interface SparcPhase {
  name: string;
  description: string;
  outputs: string[];
  requiredCapabilities?: import('../hive-mind/types.js').AgentCapability[];
  dependencies?: string[];
}

export interface SparcExecutorConfig {
  logger?: any;
  enableTDD?: boolean;
  qualityThreshold?: number;
  enableMemory?: boolean;
  enableParallelExecution?: boolean;
}

export interface SparcOrchestration {
  mode: SparcMode;
  phases: SparcPhase[];
  currentPhase?: string;
  phaseResults: Map<string, any>;
  overallProgress: number;
  startTime?: Date;
  endTime?: Date;
}

// ============================================
// Agent Communication Protocol Types
// ============================================

export interface AgentProtocol {
  version: string;
  supportedMessages: MessageType[];
  capabilities: ProtocolCapability[];
  handshakeRequired: boolean;
  encryptionEnabled?: boolean;
}

export type ProtocolCapability = 
  | 'batch_operations'
  | 'streaming'
  | 'compression'
  | 'encryption'
  | 'priority_queuing'
  | 'acknowledgments'
  | 'retry_mechanism'
  | 'heartbeat';

export interface HandshakeRequest {
  agentId: string;
  protocol: AgentProtocol;
  timestamp: Date;
  nonce?: string;
}

export interface HandshakeResponse {
  accepted: boolean;
  sessionId?: string;
  reason?: string;
  serverProtocol?: AgentProtocol;
}

export interface BatchMessage {
  id: string;
  messages: import('../hive-mind/types.js').Message[];
  priority: import('../hive-mind/types.js').MessagePriority;
  requiresAtomic: boolean;
  timeout?: number;
}

// ============================================
// Performance Metrics Types
// ============================================

export interface PerformanceMetrics {
  swarmId: string;
  timestamp: Date;
  aggregationPeriod: 'minute' | 'hour' | 'day' | 'week';
  
  // Task Performance
  taskMetrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageCompletionTime: number;
    taskThroughput: number;
    queueDepth: number;
    backlog: number;
  };
  
  // Agent Performance
  agentMetrics: {
    totalAgents: number;
    activeAgents: number;
    idleAgents: number;
    averageUtilization: number;
    agentEfficiency: number;
    spawningRate: number;
    failureRate: number;
  };
  
  // Communication Performance
  communicationMetrics: {
    totalMessages: number;
    messageLatency: number;
    messageThroughput: number;
    droppedMessages: number;
    retryCount: number;
    channelUtilization: number;
  };
  
  // Memory Performance
  memoryMetrics: {
    totalMemoryUsage: number;
    cacheHitRate: number;
    cacheSize: number;
    evictionRate: number;
    fragmentationRatio: number;
    gcPauseTime: number;
  };
  
  // Resource Usage
  resourceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskIO: number;
    networkIO: number;
    activeConnections: number;
  };
}

export interface PerformanceAlert {
  id: string;
  swarmId: string;
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  threshold: number;
  actualValue: number;
  timestamp: Date;
  message: string;
  suggestedAction?: string;
}

export interface PerformanceOptimization {
  id: string;
  swarmId: string;
  type: OptimizationType;
  description: string;
  expectedImprovement: number;
  risk: 'low' | 'medium' | 'high';
  requiredChanges: string[];
  estimatedDowntime?: number;
}

export type OptimizationType = 
  | 'topology_adjustment'
  | 'agent_rebalancing'
  | 'memory_optimization'
  | 'communication_tuning'
  | 'resource_scaling'
  | 'algorithm_improvement';

// ============================================
// Hive Configuration Types
// ============================================

export interface ExtendedHiveMindConfig extends import('../hive-mind/types.js').HiveMindConfig {
  // Performance tuning
  performanceProfile: 'balanced' | 'throughput' | 'latency' | 'efficiency';
  resourceLimits?: {
    maxCPU?: number;
    maxMemory?: number;
    maxAgents?: number;
    maxConnections?: number;
  };
  
  // Advanced features
  advancedFeatures?: {
    autoScaling?: boolean;
    predictiveOptimization?: boolean;
    adaptiveTopology?: boolean;
    neuralPatternLearning?: boolean;
    distributedConsensus?: boolean;
  };
  
  // Integration settings
  integrations?: {
    mcp?: {
      enabled: boolean;
      servers: string[];
      autoDiscovery?: boolean;
    };
    sparc?: {
      enabled: boolean;
      defaultMode?: string;
      autoPhaseTransition?: boolean;
    };
    external?: {
      webhooks?: string[];
      apis?: Record<string, string>;
    };
  };
  
  // Monitoring and observability
  monitoring?: {
    metricsEnabled: boolean;
    metricsInterval: number;
    alertThresholds?: Record<string, number>;
    exporters?: string[];
  };
}

// ============================================
// Task Management Types
// ============================================

export interface EnhancedTask extends import('../hive-mind/types.js').Task {
  // SPARC integration
  sparcPhase?: string;
  sparcMode?: string;
  
  // Advanced scheduling
  scheduling?: {
    preferredStartTime?: Date;
    deadline?: Date;
    recurrence?: RecurrencePattern;
    timeConstraints?: TimeConstraint[];
  };
  
  // Resource requirements
  resources?: {
    minAgents?: number;
    maxAgents?: number;
    requiredMemory?: number;
    requiredCPU?: number;
    exclusiveExecution?: boolean;
  };
  
  // Quality requirements
  quality?: {
    minConfidence?: number;
    requireConsensus?: boolean;
    consensusThreshold?: number;
    validationRules?: ValidationRule[];
  };
  
  // Optimization hints
  optimization?: {
    parallelizable?: boolean;
    cacheable?: boolean;
    priority?: number;
    affinityGroup?: string;
  };
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'cron';
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  cronExpression?: string;
  endDate?: Date;
  maxOccurrences?: number;
}

export interface TimeConstraint {
  type: 'business_hours' | 'off_peak' | 'maintenance_window';
  startTime: string;
  endTime: string;
  timezone?: string;
  daysOfWeek?: number[];
}

export interface ValidationRule {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'range' | 'custom';
  value: any;
  errorMessage?: string;
  customValidator?: (value: any) => boolean;
}

// ============================================
// Optimization Result Types
// ============================================

export interface OptimizationResult {
  id: string;
  swarmId: string;
  optimizationType: OptimizationType;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  
  // Results
  results?: {
    before: OptimizationMetrics;
    after: OptimizationMetrics;
    improvement: number;
    improvementPercentage: number;
  };
  
  // Changes made
  changes: OptimizationChange[];
  
  // Rollback info
  rollbackPlan?: RollbackPlan;
  
  // Analysis
  analysis?: {
    bottlenecks: string[];
    recommendations: string[];
    risks: string[];
    nextSteps: string[];
  };
}

export interface OptimizationMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  resourceUsage: number;
  efficiency: number;
  customMetrics?: Record<string, number>;
}

export interface OptimizationChange {
  type: string;
  description: string;
  target: string;
  oldValue: any;
  newValue: any;
  impact: 'low' | 'medium' | 'high';
  reversible: boolean;
}

export interface RollbackPlan {
  steps: RollbackStep[];
  estimatedTime: number;
  automatedRollback: boolean;
  validationChecks: string[];
}

export interface RollbackStep {
  order: number;
  action: string;
  target: string;
  parameters: any;
  verification: string;
}

// ============================================
// Integration Types
// ============================================

export interface IntegrationAdapter {
  name: string;
  type: 'mcp' | 'api' | 'webhook' | 'custom';
  version: string;
  capabilities: string[];
  configuration: any;
  status: 'connected' | 'disconnected' | 'error';
  lastHeartbeat?: Date;
}

export interface IntegrationEvent {
  id: string;
  source: string;
  type: string;
  timestamp: Date;
  data: any;
  processed: boolean;
  result?: any;
  error?: string;
}

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
}>;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FilterOptions {
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Type guards
export function isEnhancedTask(task: any): task is EnhancedTask {
  return task && typeof task.id === 'string' && 'swarmId' in task;
}

export function isSparcMode(mode: any): mode is SparcMode {
  return mode && typeof mode.name === 'string' && 'description' in mode;
}

export function isPerformanceMetrics(metrics: any): metrics is PerformanceMetrics {
  return metrics && 'swarmId' in metrics && 'taskMetrics' in metrics;
}