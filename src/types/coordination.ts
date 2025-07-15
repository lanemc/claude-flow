/**
 * Coordination and orchestration type definitions
 */

// Coordination strategies
export type CoordinationStrategy = 'parallel' | 'sequential' | 'adaptive' | 'balanced';

// Coordination topology types
export type SwarmTopology = 'mesh' | 'hierarchical' | 'ring' | 'star';

// Agent coordination state
export interface AgentCoordinationState {
  agentId: string;
  status: 'idle' | 'busy' | 'waiting' | 'failed';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    averageExecutionTime: number;
    successRate: number;
  };
  capabilities: string[];
  load: number; // 0-1 representing current load
  lastActivity: Date;
}

// Task coordination metadata
export interface TaskCoordinationMetadata {
  taskId: string;
  assignedAgents: string[];
  dependencies: string[];
  strategy: CoordinationStrategy;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeouts: {
    execution: number;
    coordination: number;
  };
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

// Swarm coordination configuration
export interface SwarmCoordinationConfig {
  topology: SwarmTopology;
  maxAgents: number;
  strategy: CoordinationStrategy;
  loadBalancing: boolean;
  failoverEnabled: boolean;
  healthCheckInterval: number;
  coordinationTimeout: number;
}

// Coordination metrics
export interface CoordinationMetrics {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskExecutionTime: number;
  systemLoad: number;
  throughput: number; // tasks per minute
  errorRate: number;
  lastUpdate: Date;
}

// Coordination event types
export type CoordinationEventType = 
  | 'agent_spawned'
  | 'agent_terminated'
  | 'task_assigned'
  | 'task_completed'
  | 'task_failed'
  | 'coordination_started'
  | 'coordination_stopped'
  | 'load_balanced'
  | 'failover_triggered';

// Coordination event
export interface CoordinationEvent {
  id: string;
  type: CoordinationEventType;
  timestamp: Date;
  agentId?: string;
  taskId?: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Resource allocation
export interface ResourceAllocation {
  cpu: number; // percentage
  memory: number; // bytes
  storage: number; // bytes
  network: number; // bandwidth in bytes/s
}

// Agent resource requirements
export interface AgentResourceRequirements {
  minCpu: number;
  maxCpu: number;
  minMemory: number;
  maxMemory: number;
  requiredCapabilities: string[];
  preferredNode?: string;
}