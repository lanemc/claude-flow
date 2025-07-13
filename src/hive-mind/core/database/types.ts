/**
 * Database Types and Interfaces
 * Extracted from DatabaseManager to reduce file complexity
 */

// Database result interfaces
export interface SwarmRow {
  id: string;
  name: string;
  topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
  queen_mode: 'centralized' | 'distributed';
  max_agents: number;
  consensus_threshold: number;
  memory_ttl: number;
  config: string;
  created_at: string;
  updated_at: string;
  is_active: number;
  status: 'active' | 'paused' | 'archived';
}

export interface AgentRow {
  id: string;
  swarm_id: string;
  name: string;
  type: 'coordinator' | 'researcher' | 'coder' | 'analyst' | 'architect' | 'tester' | 'reviewer' | 'optimizer' | 'documenter' | 'monitor' | 'specialist';
  status: 'idle' | 'busy' | 'active' | 'error' | 'offline';
  capabilities: string;
  current_task_id?: string;
  message_count: number;
  error_count: number;
  success_count: number;
  created_at: string;
  last_active_at?: string;
  metadata?: string;
}

export interface TaskRow {
  id: string;
  swarm_id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  strategy: 'parallel' | 'sequential' | 'adaptive' | 'consensus';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: string;
  error?: string;
  dependencies?: string;
  assigned_agents?: string;
  require_consensus: number;
  consensus_achieved?: number;
  max_agents: number;
  required_capabilities?: string;
  created_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  metadata?: string;
}

export interface MemoryRow {
  key: string;
  namespace: string;
  value: string;
  access_count: number;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: string;
  ttl?: number;
}

export interface CommunicationRow {
  id: number;
  from_agent_id: string;
  to_agent_id?: string;
  swarm_id: string;
  message_type: 'direct' | 'broadcast' | 'consensus' | 'query' | 'response' | 'notification';
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requires_response: number;
  response_to_id?: number;
  timestamp: string;
  delivered_at?: string;
  read_at?: string;
  metadata?: string;
}

export interface ConsensusRow {
  id: string;
  swarm_id: string;
  task_id?: string;
  proposal: string;
  required_threshold: number;
  current_votes: number;
  total_voters: number;
  votes: string;
  status: 'pending' | 'achieved' | 'failed' | 'timeout';
  created_at: string;
  deadline_at?: string;
  completed_at?: string;
}

export interface PerformanceMetricRow {
  id: string;
  swarm_id: string;
  agent_id?: string;
  task_id?: string;
  metric_type: string;
  metric_value: number;
  metadata?: string;
  created_at: string;
}

// Statistics and aggregated result interfaces
export interface AgentStats {
  agentCount: number;
  busyAgents: number;
}

export interface TaskStats {
  taskBacklog: number;
}

export interface SwarmStats extends AgentStats, TaskStats {
  agentUtilization: number;
}

export interface StrategyPerformanceResult {
  strategy: string;
  successRate: number;
  avgCompletionTime: number;
  totalTasks: number;
  recentPerformance: number;
}

export interface MemoryStats {
  totalEntries: number;
  totalSize: number;
  namespaceCount: number;
}

export interface NamespaceStats {
  entries: number;
  size: number;
  avgTTL: number;
}

export interface RawSQL {
  sql: string;
  params: any[];
}

// Type guard functions
export function isSwarmRow(obj: unknown): obj is SwarmRow {
  return typeof obj === 'object' && obj !== null && 'topology' in obj;
}

export function isAgentRow(obj: unknown): obj is AgentRow {
  return typeof obj === 'object' && obj !== null && 'swarm_id' in obj && 'capabilities' in obj;
}

export function isTaskRow(obj: unknown): obj is TaskRow {
  return typeof obj === 'object' && obj !== null && 'type' in obj && 'description' in obj;
}

export function isMemoryRow(obj: unknown): obj is MemoryRow {
  return typeof obj === 'object' && obj !== null && 'key' in obj && 'namespace' in obj;
}

export function isConsensusRow(obj: unknown): obj is ConsensusRow {
  return typeof obj === 'object' && obj !== null && 'proposal_type' in obj && 'threshold_required' in obj;
}

export function isAgentStats(obj: unknown): obj is AgentStats {
  return typeof obj === 'object' && obj !== null && 'totalAgents' in obj;
}

export function isTaskStats(obj: unknown): obj is TaskStats {
  return typeof obj === 'object' && obj !== null && 'totalTasks' in obj;
}

export function isRawSQL(obj: unknown): obj is RawSQL {
  return typeof obj === 'object' && obj !== null && 'sql' in obj && 'params' in obj;
}