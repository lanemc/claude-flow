/**
 * Memory System Type Definitions
 * Comprehensive types for the memory system migration
 */

import { Database as SQLiteDatabase, Statement } from 'better-sqlite3';

// ==== Core Memory Types ====

export interface MemoryOptions {
  type?: 'shared' | 'swarm';
  swarmId?: string;
  directory?: string;
  filename?: string;
  dbName?: string;
  cacheSize?: number;
  cacheMemoryMB?: number;
  compressionThreshold?: number;
  gcInterval?: number;
  enableWAL?: boolean;
  enableVacuum?: boolean;
}

export interface MemoryStoreOptions {
  namespace?: string;
  metadata?: Record<string, unknown>;
  ttl?: number;
  tags?: string[];
}

export interface StoreOptions {
  namespace?: string;
  ttl?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface StoreResult {
  success: boolean;
  id: string | number;
  size: number;
}

export interface EnhancedMemoryOptions extends MemoryOptions {
  enableAnalytics?: boolean;
  enableCompression?: boolean;
  backupInterval?: number;
}

export interface MemoryEntry {
  key: string;
  value: string;
  namespace: string;
  metadata: Record<string, any> | null;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  accessCount: number;
  ttl: number | null;
  expiresAt: number | null;
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
  value: unknown;
  namespace: string;
  score?: number;
  updatedAt: Date;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
}

// ==== SQLite Store Types ====

export interface SQLiteMemoryStoreOptions {
  dbName?: string;
  directory?: string;
  [key: string]: unknown;
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
  [key: string]: unknown;
}

export interface CacheEntry {
  data: Record<string, unknown>;
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
  agentId: string;
  type: string;
  capabilities: string[];
  status: string;
  createdAt: number;
  lastHeartbeat: number;
  metrics: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
}

export interface SwarmAgentData {
  id: string;
  type: string;
  status: string;
  capabilities?: string[];
  metrics?: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
  [key: string]: unknown;
}

export interface TaskData {
  id: string;
  status: string;
  priority?: string;
  assignedAgents?: string[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  result?: unknown;
  [key: string]: unknown;
}

export interface CommunicationMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: {
    type: string;
    [key: string]: unknown;
  };
  swarmId: string;
  timestamp: string;
}

export interface ConsensusDecision {
  status: string;
  taskId?: string;
  threshold?: number;
  [key: string]: unknown;
}

export interface NeuralPattern {
  id: string;
  type: string;
  confidence?: number;
  usageCount?: number;
  successRate?: number;
  lastUsedAt?: string;
  [key: string]: unknown;
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

export interface SessionData {
  sessionId: string;
  userId: string;
  projectPath: string;
  activeBranch: string;
  lastActivity: number;
  state: 'active' | 'inactive' | 'suspended';
  context: Record<string, any>;
  environment: Record<string, any>;
}

export interface SessionState extends SessionData {
  // Legacy alias for backwards compatibility
}

export interface WorkflowData {
  workflowId: string;
  name: string;
  steps?: unknown[];
  status?: string;
  progress?: number;
  startTime?: number;
  endTime?: number;
  results?: Record<string, unknown>;
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface LearningData {
  agentId: string;
  timestamp: number;
  type: string;
  input: Record<string, any>;
  output: Record<string, any>;
  feedback?: string;
  improvement?: string;
}

export interface KnowledgeData {
  domain: string;
  key: string;
  value: any;
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
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
  metadata: Record<string, unknown>;
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
  store(key: string, value: unknown, options?: StoreOptions): Promise<StoreResult>;
  retrieve(key: string, options?: StoreOptions): Promise<unknown>;
  list(options?: StoreOptions): Promise<any[]>;
  delete(key: string, options?: StoreOptions): Promise<boolean>;
  search(pattern: string, options?: StoreOptions): Promise<any[]>;
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
  public cause?: Error;
  
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
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
  statistics: unknown;
}

export interface ImportResult {
  agents: number;
  tasks: number;
  patterns: number;
}

// ==== Migration Types ====

export interface MigrationOptions {
  oldDbPath: string;
  newDbPath: string;
  swarmDbPath: string;
  dryRun: boolean;
  verbose: boolean;
}

export interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  errors: number;
}

export interface MigrationResult {
  success: boolean;
  stats: MigrationStats;
  error?: string;
}

// ==== Memory Instance Type ====

export type MemoryInstance = import('./shared-memory.js').default | import('./swarm-memory.js').SwarmMemory;