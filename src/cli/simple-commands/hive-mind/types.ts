/**
 * Type definitions for Hive Mind system
 * Centralized types for better organization and reusability
 */

import type { Ora } from 'ora';
import type Database from 'better-sqlite3';

// Re-export all interfaces from main file for convenience
export * from '../hive-mind.js';

/**
 * Database schema types
 */
export interface SwarmRecord {
  id: string;
  name: string;
  objective: string;
  status: string;
  queen_type: string;
  created_at: string;
  updated_at: string;
}

export interface AgentRecord {
  id: string;
  swarm_id: string;
  name: string;
  type: string;
  role: string;
  status: string;
  capabilities: string;
  created_at: string;
}

export interface TaskRecord {
  id: string;
  swarm_id: string;
  agent_id: string | null;
  description: string;
  status: string;
  priority: number;
  result: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface MemoryRecord {
  id: string;
  swarm_id: string | null;
  key: string;
  value: string;
  type: string;
  confidence: number;
  created_by: string | null;
  created_at: string;
  accessed_at: string | null;
  access_count: number;
  compressed: number;
  size: number;
}

export interface ConsensusRecord {
  id: string;
  swarm_id: string;
  topic: string;
  decision: string | null;
  votes: string | null;
  algorithm: string;
  confidence: number | null;
  created_at: string;
}

/**
 * Database query result types
 */
export interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

export interface MemoryCount {
  count: number;
}

export interface ConsensusCount {
  count: number;
}

export interface OverallStats {
  total_swarms: number;
  total_agents: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface TaskBreakdown {
  status: string;
  count: number;
}

export interface AgentPerformance {
  name: string;
  type: string;
  tasks_assigned: number;
  tasks_completed: number;
  avg_completion_minutes: number | null;
}

export interface SwarmPerformance {
  name: string;
  objective: string;
  agent_count: number;
  task_count: number;
  completed_count: number;
  memory_entries: number;
  consensus_count: number;
}

export interface AvgTaskTime {
  avg_minutes: number | null;
}

export interface AgentTypePerformance {
  type: string;
  total_tasks: number;
  completed_tasks: number;
  avg_completion_minutes: number | null;
}

/**
 * Wizard types
 */
export interface SpawnSwarmAnswers {
  objective: string;
  name: string;
  queenType: 'strategic' | 'tactical' | 'adaptive';
  maxWorkers: number;
  workerTypes: string[];
  consensusAlgorithm: 'majority' | 'weighted' | 'byzantine';
  autoScale: boolean;
  monitor: boolean;
}

export interface WizardAction {
  action: 'spawn' | 'status' | 'memory' | 'consensus' | 'metrics' | 'config' | 'exit';
}

export interface MemoryAction {
  action: 'list' | 'search' | 'store' | 'stats' | 'clean' | 'export' | 'back';
}

export interface SearchMemoryAnswers {
  searchTerm: string;
}

export interface StoreMemoryAnswers {
  key: string;
  category: string;
  value: string;
}

export interface CleanMemoryAnswers {
  days: number;
}

export interface ConfirmAnswer {
  confirm: boolean;
}

export interface ExportMemoryAnswers {
  filename: string;
}

/**
 * Claude Code integration types
 */
export interface ClaudeCodeSpawnCommand {
  title: string;
  command: string;
  context: string;
  workerType: string;
  count: number;
}

export interface CoordinationInstructions {
  swarmId: string;
  swarmName: string;
  objective: string;
  hiveMindEndpoint: string;
  mcpTools: string[];
  coordinationProtocol: {
    memoryNamespace: string;
    consensusThreshold: number;
    taskUpdateInterval: number;
    healthCheckInterval: number;
  };
  workerCapabilities: Array<{
    id: string;
    type: string;
    capabilities: string[];
  }>;
}

export interface WorkerGroups {
  [key: string]: AgentRecord[];
}

/**
 * Memory backup types
 */
export interface MemoryBackup {
  exportDate: string;
  version: string;
  totalMemories: number;
  namespace: string;
  memories: MemoryRecord[];
}

/**
 * Utility types
 */
export type SpinnerInstance = Ora;
export type DatabaseInstance = Database.Database;

/**
 * Function parameter types
 */
export interface SpawnSwarmParams {
  objective: string;
  flags: import('../hive-mind').HiveMindFlags;
}

export interface ShowStatusParams {
  flags: import('../hive-mind').HiveMindFlags;
}

export interface ResumeSessionParams {
  sessionId: string;
  flags: import('../hive-mind').HiveMindFlags;
}

/**
 * Error types
 */
export interface HiveMindError extends Error {
  code?: string;
  details?: any;
}

/**
 * Configuration types
 */
export interface HiveMindDefaults {
  queenType: 'strategic' | 'tactical' | 'adaptive';
  maxWorkers: number;
  consensusAlgorithm: 'majority' | 'weighted' | 'byzantine';
  memorySize: number;
  autoScale: boolean;
  encryption: boolean;
}

/**
 * Session checkpoint types
 */
export interface SessionCheckpoint {
  timestamp: string;
  swarmState: import('../hive-mind').SwarmStatus;
  agentStates: import('../hive-mind').Agent[];
  taskStates: import('../hive-mind').Task[];
  memorySnapshot: string[];
  consensusHistory: string[];
}

/**
 * Type guards
 */
export function isSwarmRecord(obj: any): obj is SwarmRecord {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

export function isAgentRecord(obj: any): obj is AgentRecord {
  return obj && typeof obj.id === 'string' && typeof obj.swarm_id === 'string';
}

export function isTaskRecord(obj: any): obj is TaskRecord {
  return obj && typeof obj.id === 'string' && typeof obj.swarm_id === 'string';
}

export function isMemoryRecord(obj: any): obj is MemoryRecord {
  return obj && typeof obj.id === 'string' && typeof obj.key === 'string';
}

export function isConsensusRecord(obj: any): obj is ConsensusRecord {
  return obj && typeof obj.id === 'string' && typeof obj.topic === 'string';
}