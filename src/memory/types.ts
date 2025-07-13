/**
 * Memory System Type Definitions
 * Comprehensive types for the memory system migration
 */

import { Database as SQLiteDatabase, Statement } from 'better-sqlite3';

// ==== Core Memory Types ====

export interface MemoryStoreOptions {
  namespace?: string;
  metadata?: Record<string, any>;
  ttl?: number;
  tags?: string[];
}

export interface MemoryEntry {
  key: string;
  value: any;
  namespace: string;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  accessedAt: Date;
  accessCount: number;
  ttl?: number | null;
  expiresAt?: Date | null;
}

export interface MemorySearchOptions {
  namespace?: string;
  limit?: number;
  offset?: number;
  pattern?: string;
  tags?: string[];
}

export interface MemoryListOptions {
  namespace?: string;
  limit?: number;
  offset?: number;
}

export interface MemorySearchResult {
  key: string;
  value: any;
  namespace: string;
  score?: number;
  updatedAt: Date;
  metadata?: Record<string, any> | null;
  tags?: string[];
}

// ==== SQLite Store Types ====

export interface SQLiteMemoryStoreOptions {
  dbName?: string;
  directory?: string;
  [key: string]: any;
}

export interface SQLiteRow {
  id: number;
  key: string;
  value: string;
  namespace: string;
  metadata: string | null;
  created_at: number;
  updated_at: number;
  accessed_at: number;
  access_count: number;
  ttl: number | null;
  expires_at: number | null;
}

// ==== Shared Memory Types ====

export interface SharedMemoryOptions {
  directory?: string;
  filename?: string;
  cacheSize?: number;
  cacheMemoryMB?: number;
  compressionThreshold?: number;
  gcInterval?: number;
  enableWAL?: boolean;
  enableVacuum?: boolean;
  [key: string]: any;
}

export interface CacheEntry {
  data: any;
  size: number;
  timestamp: number;
}

export interface CacheStats {
  size: number;
  memoryUsage: number;
  memoryUsageMB: number;
  hitRate: number;
  evictions: number;
  utilizationPercent: number;
}

export interface PerformanceMetrics {
  operations: Map<string, number[]>;
  lastGC: number;
  totalOperations: number;
}

export interface DatabaseStats {
  namespace: string;
  count: number;
  total_size: number;
  avg_size: number;
  compressed_count: number;
}

export interface SharedMemoryStats {
  namespaces: Record<string, {
    count: number;
    totalSize: number;
    avgSize: number;
    compressed: number;
  }>;
  cache: CacheStats;
  metrics: Record<string, {
    count: number;
    avg: number;
    min: number;
    max: number;
  }> & {
    totalOperations: number;
    lastGC: string;
  };
  database: {
    totalEntries: number;
    totalSize: number;
  };
}

export interface Migration {
  version: number;
  description: string;
  sql: string;
}

// ==== Swarm Memory Types ====

export interface SwarmMemoryOptions extends SharedMemoryOptions {
  swarmId?: string;
  mcpMode?: boolean;
}

export interface AgentData {
  id: string;
  type: string;
  status: string;
  capabilities?: string[];
  metrics?: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
  [key: string]: any;
}

export interface TaskData {
  id: string;
  status: string;
  priority?: string;
  assignedAgents?: string[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  result?: any;
  [key: string]: any;
}

export interface CommunicationMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: {
    type: string;
    [key: string]: any;
  };
  swarmId: string;
  timestamp: string;
}

export interface ConsensusDecision {
  status: string;
  taskId?: string;
  threshold?: number;
  [key: string]: any;
}

export interface NeuralPattern {
  id: string;
  type: string;
  confidence?: number;
  usageCount?: number;
  successRate?: number;
  lastUsedAt?: string;
  [key: string]: any;
}

export interface SwarmStats {
  swarmId: string;
  agents: {
    total: number;
    active: number;
    cached: number;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
  };
  patterns: {
    total: number;
    cached: number;
  };
  namespaces: string[];
}

// ==== Enhanced Memory Types ====

export interface SessionState {
  sessionId: string;
  userId?: string;
  projectPath?: string;
  activeBranch?: string;
  lastActivity: number;
  state?: string;
  context?: Record<string, any>;
  environment?: Record<string, string>;
}

export interface WorkflowData {
  workflowId: string;
  name: string;
  steps?: any[];
  status?: string;
  progress?: number;
  startTime?: number;
  endTime?: number;
  results?: Record<string, any>;
}

export interface MetricData {
  name: string;
  value: any;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface LearningData {
  agentId: string;
  timestamp: number;
  type: string;
  input: any;
  output: any;
  feedback?: any;
  improvement?: any;
}

export interface PerformanceData {
  operation: string;
  duration: number;
  success: boolean;
  timestamp: number;
  metadata: Record<string, any>;
}

// ==== Fallback Store Types ====

export interface FallbackMemoryStoreOptions extends SQLiteMemoryStoreOptions {
  // Inherits from SQLite options
}

// ==== In-Memory Store Types ====

export interface InMemoryEntry {
  key: string;
  value: string;
  namespace: string;
  metadata: any;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  accessCount: number;
  ttl: number | null;
  expiresAt: number | null;
}

// ==== Common Interfaces ====

export interface IMemoryStore {
  initialize(): Promise<void>;
  store(key: string, value: any, options?: MemoryStoreOptions): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }>;
  retrieve(key: string, options?: { namespace?: string }): Promise<any>;
  list(options?: MemoryListOptions): Promise<MemoryEntry[]>;
  delete(key: string, options?: { namespace?: string }): Promise<boolean>;
  search(pattern: string, options?: MemorySearchOptions): Promise<MemorySearchResult[]>;
  cleanup(): Promise<number>;
  close?(): void;
}

export interface IFallbackStore extends IMemoryStore {
  isUsingFallback(): boolean;
}

// ==== Swarm Namespaces ====

export const SWARM_NAMESPACES = {
  AGENTS: 'swarm:agents',
  TASKS: 'swarm:tasks',
  COMMUNICATIONS: 'swarm:communications',
  CONSENSUS: 'swarm:consensus',
  PATTERNS: 'swarm:patterns',
  METRICS: 'swarm:metrics',
  COORDINATION: 'swarm:coordination'
} as const;

export type SwarmNamespace = typeof SWARM_NAMESPACES[keyof typeof SWARM_NAMESPACES];

// ==== Error Types ====

export class MemoryStoreError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'MemoryStoreError';
  }
}

// ==== Export Utils ====

export interface ExportData {
  [namespace: string]: MemoryEntry[];
}

export interface CleanupOptions {
  maxAge?: number;
  keepPatterns?: boolean;
  keepConsensus?: boolean;
}

export interface SwarmExportState {
  swarmId: string;
  exportedAt: string;
  agents: AgentData[];
  tasks: TaskData[];
  patterns: NeuralPattern[];
  statistics: any;
}

export interface ImportResult {
  agents: number;
  tasks: number;
  patterns: number;
}