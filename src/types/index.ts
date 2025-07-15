// Re-export specific types to avoid conflicts
// Swarm types
export type {
  AgentState,
  AgentType,
  AgentStatus,
  SwarmConfig,
  ExecutorConfig
} from '../swarm/types';

// Memory types
export type {
  MemoryConfig,
  MemoryBackend,
  MemoryQueryOptions
} from '../memory/types';

// Hive types - rename conflicting exports
export type {
  SwarmTopology as HiveSwarmTopology,
  HiveMindConfig,
  AgentNetworkConfig
} from '../hive-mind/types';

// Task types
export type {
  TaskConfig,
  TaskExecutorOptions
} from '../task/types';

// MCP types - rename conflicting exports
export type {
  SwarmInitResult as MCPSwarmInitResult,
  NeuralTrainingResult as MCPNeuralTrainingResult,
  MCPServerConfig,
  ToolsConfig
} from '../mcp/types';

// Migration types
export type {
  MigrationConfig,
  MigrationStep,
  MigrationStatus
} from '../migration/types';

// Integration types
export type {
  IntegrationConfig,
  ComponentHealth
} from '../integration/types';

// New type definitions
export * from './mcp';
export * from './test-utils';
export * from './coordination';
export * from './cli-types';

// Memory-specific types that may be referenced
export interface MemoryEntry {
  id: string;
  key: string;
  value: unknown;
  data?: unknown; // For backward compatibility
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  partition?: string;
}

// Task types for swarm
export type TaskId = string;
export type TaskStatus = 'pending' | 'active' | 'completed' | 'failed';

// Component monitoring types
export enum ComponentStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

// Alert types for monitoring
export interface AlertData {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  component?: string;
  metadata?: Record<string, unknown>;
}

// Agent profile interface used across the system
export interface AgentProfile {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  systemPrompt?: string;
  maxConcurrentTasks?: number;
  priority?: number;
  environment?: Record<string, string>;
  workingDirectory?: string;
}

// Task interface used across the system  
export interface Task {
  id: string;
  type: string;
  description: string;
  priority: number;
  dependencies: string[];
  input: Record<string, unknown>;
  status: TaskStatus;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  assignedTo?: string;
  result?: unknown;
  error?: string;
}