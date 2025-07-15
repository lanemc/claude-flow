// Task system types
import type { TaskEngine } from './engine';
import type { TaskCoordinator } from './coordination';

export interface TodoItem {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low' | 'critical';
  dependencies?: string[];
  estimatedTime?: string;
  assignedAgent?: string;
  batchOptimized?: boolean;
  parallelExecution?: boolean;
  memoryKey?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEntry {
  key: string;
  value: unknown;
  timestamp: Date;
  namespace?: string;
  tags?: string[];
  expiresAt?: Date;
}

export interface CoordinationContext {
  sessionId: string;
  agentId?: string;
  workflowId?: string;
  batchId?: string;
  parentTaskId?: string;
  coordinationMode: 'centralized' | 'distributed' | 'hierarchical' | 'mesh' | 'hybrid';
  agents?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface TaskCommandContext {
  taskEngine: TaskEngine;
  taskCoordinator?: TaskCoordinator;
  memoryManager?: unknown;
  logger?: unknown;
}

// Enhanced task metadata interface
export interface TaskMetadata extends Record<string, unknown> {
  retryCount?: number;
  todoId?: string;
  batchOptimized?: boolean;
  parallelExecution?: boolean;
  memoryKey?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  lastRetryAt?: Date;
  originalPriority?: number;
  escalated?: boolean;
  checkpointData?: Record<string, unknown>;
}
