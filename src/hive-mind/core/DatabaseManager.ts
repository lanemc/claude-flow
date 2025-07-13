/**
 * DatabaseManager Class
 * 
 * Manages all database operations for the Hive Mind system
 * using SQLite as the persistence layer.
 */

import Database, { Statement } from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

// ES module compatibility - define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  ttl?: number;
  access_count: number;
  last_accessed_at: string;
  created_at: string;
  expires_at?: string;
  metadata?: string;
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
  id: number;
  swarm_id: string;
  agent_id?: string;
  metric_type: string;
  metric_value: number;
  timestamp: string;
  metadata?: string;
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
  totalTasks: number;
  successful: number;
  avgCompletionTime: number;
}

export interface MemoryStats {
  totalEntries: number;
  totalSize: number;
}

export interface NamespaceStats {
  entries: number;
  size: number;
  avgTTL: number;
}

// Raw SQL helper type
export interface RawSQL {
  _raw: string;
}

// Type guards
export function isSwarmRow(obj: unknown): obj is SwarmRow {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj;
}

export function isAgentRow(obj: unknown): obj is AgentRow {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'swarm_id' in obj;
}

export function isTaskRow(obj: unknown): obj is TaskRow {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'swarm_id' in obj && 'description' in obj;
}

export function isMemoryRow(obj: unknown): obj is MemoryRow {
  return typeof obj === 'object' && obj !== null && 'key' in obj && 'namespace' in obj;
}

export function isConsensusRow(obj: unknown): obj is ConsensusRow {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'votes' in obj && 'required_threshold' in obj;
}

export function isAgentStats(obj: unknown): obj is AgentStats {
  return typeof obj === 'object' && obj !== null && 'agentCount' in obj && 'busyAgents' in obj;
}

export function isTaskStats(obj: unknown): obj is TaskStats {
  return typeof obj === 'object' && obj !== null && 'taskBacklog' in obj;
}

export function isRawSQL(obj: unknown): obj is RawSQL {
  return typeof obj === 'object' && obj !== null && '_raw' in obj;
}

export class DatabaseManager extends EventEmitter {
  private static instance: DatabaseManager;
  private db!: Database.Database;
  private statements: Map<string, Database.Statement>;
  private dbPath!: string;

  private constructor() {
    super();
    this.statements = new Map();
  }

  /**
   * Get singleton instance
   */
  static async getInstance(): Promise<DatabaseManager> {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
      await DatabaseManager.instance.initialize();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database
   */
  async initialize(): Promise<void> {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Set database path
    this.dbPath = path.join(dataDir, 'hive-mind.db');
    
    // Open database
    this.db = new Database(this.dbPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Load schema
    await this.loadSchema();
    
    // Prepare statements
    this.prepareStatements();
    
    this.emit('initialized');
  }

  /**
   * Load database schema
   */
  private async loadSchema(): Promise<void> {
    const schemaPath = path.join(__dirname, '..', '..', 'db', 'hive-mind-schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    // Execute schema
    this.db.exec(schema);
  }

  /**
   * Prepare common SQL statements
   */
  private prepareStatements(): void {
    // Swarm statements
    this.statements.set('createSwarm', this.db.prepare(`
      INSERT INTO swarms (id, name, topology, queen_mode, max_agents, consensus_threshold, memory_ttl, config)
      VALUES (@id, @name, @topology, @queenMode, @maxAgents, @consensusThreshold, @memoryTTL, @config)
    `));
    
    this.statements.set('getSwarm', this.db.prepare(`
      SELECT * FROM swarms WHERE id = ?
    `));
    
    this.statements.set('getActiveSwarm', this.db.prepare(`
      SELECT id FROM swarms WHERE is_active = 1 LIMIT 1
    `));
    
    this.statements.set('setActiveSwarm', this.db.prepare(`
      UPDATE swarms SET is_active = CASE WHEN id = ? THEN 1 ELSE 0 END
    `));
    
    // Agent statements
    this.statements.set('createAgent', this.db.prepare(`
      INSERT INTO agents (id, swarm_id, name, type, status, capabilities, metadata)
      VALUES (@id, @swarmId, @name, @type, @status, @capabilities, @metadata)
    `));
    
    this.statements.set('getAgent', this.db.prepare(`
      SELECT * FROM agents WHERE id = ?
    `));
    
    this.statements.set('getAgents', this.db.prepare(`
      SELECT * FROM agents WHERE swarm_id = ?
    `));
    
    this.statements.set('updateAgent', this.db.prepare(`
      UPDATE agents SET ? WHERE id = ?
    `));
    
    // Task statements
    this.statements.set('createTask', this.db.prepare(`
      INSERT INTO tasks (
        id, swarm_id, description, priority, strategy, status, 
        dependencies, assigned_agents, require_consensus, max_agents, 
        required_capabilities, metadata
      ) VALUES (
        @id, @swarmId, @description, @priority, @strategy, @status,
        @dependencies, @assignedAgents, @requireConsensus, @maxAgents,
        @requiredCapabilities, @metadata
      )
    `));
    
    this.statements.set('getTask', this.db.prepare(`
      SELECT * FROM tasks WHERE id = ?
    `));
    
    this.statements.set('getTasks', this.db.prepare(`
      SELECT * FROM tasks WHERE swarm_id = ? ORDER BY created_at DESC
    `));
    
    this.statements.set('updateTaskStatus', this.db.prepare(`
      UPDATE tasks SET status = ? WHERE id = ?
    `));
    
    // Memory statements
    this.statements.set('storeMemory', this.db.prepare(`
      INSERT OR REPLACE INTO memory (key, namespace, value, ttl, metadata)
      VALUES (@key, @namespace, @value, @ttl, @metadata)
    `));
    
    this.statements.set('getMemory', this.db.prepare(`
      SELECT * FROM memory WHERE key = ? AND namespace = ?
    `));
    
    this.statements.set('searchMemory', this.db.prepare(`
      SELECT * FROM memory 
      WHERE namespace = ? AND (key LIKE ? OR value LIKE ?)
      ORDER BY last_accessed_at DESC
      LIMIT ?
    `));
    
    // Communication statements
    this.statements.set('createCommunication', this.db.prepare(`
      INSERT INTO communications (
        from_agent_id, to_agent_id, swarm_id, message_type, 
        content, priority, requires_response
      ) VALUES (
        @from_agent_id, @to_agent_id, @swarm_id, @message_type,
        @content, @priority, @requires_response
      )
    `));
    
    // Performance statements
    this.statements.set('storeMetric', this.db.prepare(`
      INSERT INTO performance_metrics (swarm_id, agent_id, metric_type, metric_value, metadata)
      VALUES (@swarm_id, @agent_id, @metric_type, @metric_value, @metadata)
    `));
  }

  /**
   * Raw SQL helper for complex updates
   */
  raw(sql: string): RawSQL {
    return { _raw: sql };
  }

  // Swarm operations

  async createSwarm(data: any): Promise<void> {
    this.statements.get('createSwarm')!.run(data);
  }

  async getSwarm(id: string): Promise<SwarmRow | undefined> {
    const result = this.statements.get('getSwarm')!.get(id);
    return result as SwarmRow | undefined;
  }

  async getActiveSwarmId(): Promise<string | null> {
    const result = this.statements.get('getActiveSwarm')!.get() as SwarmRow | undefined;
    return result ? result.id : null;
  }

  async setActiveSwarm(id: string): Promise<void> {
    this.statements.get('setActiveSwarm')!.run(id);
  }

  async getAllSwarms(): Promise<(SwarmRow & { agentCount: number })[]> {
    const results = this.db.prepare(`
      SELECT s.*, COUNT(a.id) as agentCount 
      FROM swarms s 
      LEFT JOIN agents a ON s.id = a.swarm_id 
      GROUP BY s.id 
      ORDER BY s.created_at DESC
    `).all();
    return results as (SwarmRow & { agentCount: number })[];
  }

  // Agent operations

  async createAgent(data: any): Promise<void> {
    this.statements.get('createAgent')!.run(data);
  }

  async getAgent(id: string): Promise<AgentRow | undefined> {
    const result = this.statements.get('getAgent')!.get(id);
    return result as AgentRow | undefined;
  }

  async getAgents(swarmId: string): Promise<AgentRow[]> {
    const results = this.statements.get('getAgents')!.all(swarmId);
    return results as AgentRow[];
  }

  async updateAgent(id: string, updates: Record<string, any>): Promise<void> {
    const setClauses: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value && typeof value === 'object' && isRawSQL(value)) {
        setClauses.push(`${key} = ${value._raw}`);
      } else {
        setClauses.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE agents SET ${setClauses.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
  }

  async updateAgentStatus(id: string, status: string): Promise<void> {
    this.db.prepare('UPDATE agents SET status = ? WHERE id = ?').run(status, id);
  }

  async getAgentPerformance(agentId: string): Promise<{
    successRate: number;
    totalTasks: number;
    messageCount: number;
  } | null> {
    const agent = await this.getAgent(agentId);
    if (!agent) return null;
    
    return {
      successRate: agent.success_count / (agent.success_count + agent.error_count) || 0,
      totalTasks: agent.success_count + agent.error_count,
      messageCount: agent.message_count
    };
  }

  // Task operations

  async createTask(data: any): Promise<void> {
    this.statements.get('createTask')!.run({
      ...data,
      requireConsensus: data.requireConsensus ? 1 : 0
    });
  }

  async getTask(id: string): Promise<TaskRow | undefined> {
    const result = this.statements.get('getTask')!.get(id);
    return result as TaskRow | undefined;
  }

  async getTasks(swarmId: string): Promise<TaskRow[]> {
    const results = this.statements.get('getTasks')!.all(swarmId);
    return results as TaskRow[];
  }

  async updateTask(id: string, updates: Record<string, any>): Promise<void> {
    const setClauses: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?
    `);
    
    stmt.run(...values);
  }

  async updateTaskStatus(id: string, status: string): Promise<void> {
    this.statements.get('updateTaskStatus')!.run(status, id);
  }

  async getPendingTasks(swarmId: string): Promise<TaskRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM tasks 
      WHERE swarm_id = ? AND status = 'pending'
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at ASC
    `).all(swarmId);
    return results as TaskRow[];
  }

  async getActiveTasks(swarmId: string): Promise<TaskRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM tasks 
      WHERE swarm_id = ? AND status IN ('assigned', 'in_progress')
    `).all(swarmId);
    return results as TaskRow[];
  }

  async reassignTask(taskId: string, newAgentId: string): Promise<void> {
    const task = await this.getTask(taskId);
    if (!task) return;
    
    const assignedAgents = JSON.parse(task.assigned_agents || '[]');
    if (!assignedAgents.includes(newAgentId)) {
      assignedAgents.push(newAgentId);
    }
    
    await this.updateTask(taskId, {
      assigned_agents: JSON.stringify(assignedAgents)
    });
  }

  // Memory operations

  async storeMemory(data: any): Promise<void> {
    this.statements.get('storeMemory')!.run(data);
  }

  async getMemory(key: string, namespace: string): Promise<MemoryRow | undefined> {
    const result = this.statements.get('getMemory')!.get(key, namespace);
    return result as MemoryRow | undefined;
  }

  async updateMemoryAccess(key: string, namespace: string): Promise<void> {
    this.db.prepare(`
      UPDATE memory 
      SET access_count = access_count + 1, last_accessed_at = CURRENT_TIMESTAMP
      WHERE key = ? AND namespace = ?
    `).run(key, namespace);
  }

  async searchMemory(options: {
    pattern?: string;
    namespace?: string;
    limit?: number;
  }): Promise<MemoryRow[]> {
    const pattern = `%${options.pattern || ''}%`;
    const results = this.statements.get('searchMemory')!.all(
      options.namespace || 'default',
      pattern,
      pattern,
      options.limit || 10
    );
    return results as MemoryRow[];
  }

  async deleteMemory(key: string, namespace: string): Promise<void> {
    this.db.prepare('DELETE FROM memory WHERE key = ? AND namespace = ?').run(key, namespace);
  }

  async listMemory(namespace: string, limit: number): Promise<MemoryRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM memory 
      WHERE namespace = ? 
      ORDER BY last_accessed_at DESC 
      LIMIT ?
    `).all(namespace, limit);
    return results as MemoryRow[];
  }

  async getMemoryStats(): Promise<MemoryStats> {
    const result = this.db.prepare(`
      SELECT 
        COUNT(*) as totalEntries,
        SUM(LENGTH(value)) as totalSize
      FROM memory
    `).get();
    
    return (result as MemoryStats) || { totalEntries: 0, totalSize: 0 };
  }

  async getNamespaceStats(namespace: string): Promise<NamespaceStats> {
    const result = this.db.prepare(`
      SELECT 
        COUNT(*) as entries,
        SUM(LENGTH(value)) as size,
        AVG(ttl) as avgTTL
      FROM memory
      WHERE namespace = ?
    `).get(namespace);
    return (result as NamespaceStats) || { entries: 0, size: 0, avgTTL: 0 };
  }

  async getAllMemoryEntries(): Promise<MemoryRow[]> {
    const results = this.db.prepare('SELECT * FROM memory').all();
    return results as MemoryRow[];
  }

  async getRecentMemoryEntries(limit: number): Promise<MemoryRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM memory 
      ORDER BY last_accessed_at DESC 
      LIMIT ?
    `).all(limit);
    return results as MemoryRow[];
  }

  async getOldMemoryEntries(daysOld: number): Promise<MemoryRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM memory 
      WHERE created_at < datetime('now', '-' || ? || ' days')
    `).all(daysOld);
    return results as MemoryRow[];
  }

  async updateMemoryEntry(entry: any): Promise<void> {
    this.db.prepare(`
      UPDATE memory 
      SET value = ?, access_count = ?, last_accessed_at = ?
      WHERE key = ? AND namespace = ?
    `).run(
      entry.value,
      entry.accessCount,
      entry.lastAccessedAt,
      entry.key,
      entry.namespace
    );
  }

  async clearMemory(swarmId: string): Promise<void> {
    // Clear memory related to a specific swarm
    this.db.prepare(`
      DELETE FROM memory 
      WHERE metadata LIKE '%"swarmId":"${swarmId}"%'
    `).run();
  }

  async deleteOldEntries(namespace: string, ttl: number): Promise<void> {
    this.db.prepare(`
      DELETE FROM memory 
      WHERE namespace = ? AND created_at < datetime('now', '-' || ? || ' seconds')
    `).run(namespace, ttl);
  }

  async trimNamespace(namespace: string, maxEntries: number): Promise<void> {
    this.db.prepare(`
      DELETE FROM memory 
      WHERE namespace = ? AND key NOT IN (
        SELECT key FROM memory 
        WHERE namespace = ? 
        ORDER BY last_accessed_at DESC 
        LIMIT ?
      )
    `).run(namespace, namespace, maxEntries);
  }

  // Communication operations

  async createCommunication(data: any): Promise<void> {
    this.statements.get('createCommunication')!.run(data);
  }

  async getPendingMessages(agentId: string): Promise<CommunicationRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM communications 
      WHERE to_agent_id = ? AND delivered_at IS NULL
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'normal' THEN 3 
          WHEN 'low' THEN 4 
        END,
        timestamp ASC
    `).all(agentId);
    return results as CommunicationRow[];
  }

  async markMessageDelivered(messageId: string): Promise<void> {
    this.db.prepare(`
      UPDATE communications 
      SET delivered_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(messageId);
  }

  async markMessageRead(messageId: string): Promise<void> {
    this.db.prepare(`
      UPDATE communications 
      SET read_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(messageId);
  }

  async getRecentMessages(swarmId: string, timeWindow: number): Promise<CommunicationRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM communications 
      WHERE swarm_id = ? AND timestamp > datetime('now', '-' || ? || ' milliseconds')
    `).all(swarmId, timeWindow);
    return results as CommunicationRow[];
  }

  // Consensus operations

  async createConsensusProposal(proposal: any): Promise<void> {
    this.db.prepare(`
      INSERT INTO consensus (
        id, swarm_id, task_id, proposal, required_threshold, 
        status, deadline_at
      ) VALUES (
        @id, @swarmId, @taskId, @proposal, @requiredThreshold,
        'pending', @deadline
      )
    `).run({
      id: proposal.id,
      swarmId: proposal.swarmId,
      taskId: proposal.taskId || null,
      proposal: JSON.stringify(proposal.proposal),
      requiredThreshold: proposal.requiredThreshold,
      deadline: proposal.deadline
    });
  }

  async submitConsensusVote(proposalId: string, agentId: string, vote: boolean, reason?: string): Promise<void> {
    const proposal = this.db.prepare('SELECT * FROM consensus WHERE id = ?').get(proposalId) as ConsensusRow | undefined;
    if (!proposal) return;
    
    const votes = JSON.parse(proposal.votes || '{}');
    votes[agentId] = { vote, reason: reason || '', timestamp: new Date() };
    
    const totalVoters = Object.keys(votes).length;
    const positiveVotes = Object.values(votes).filter((v: any) => v.vote).length;
    const currentRatio = positiveVotes / totalVoters;
    
    const status = currentRatio >= proposal.required_threshold ? 'achieved' : 'pending';
    
    this.db.prepare(`
      UPDATE consensus 
      SET votes = ?, current_votes = ?, total_voters = ?, status = ?
      WHERE id = ?
    `).run(
      JSON.stringify(votes),
      positiveVotes,
      totalVoters,
      status,
      proposalId
    );
  }

  // Performance operations

  async storePerformanceMetric(data: any): Promise<void> {
    this.statements.get('storeMetric')!.run({
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null
    });
  }

  async getSwarmStats(swarmId: string): Promise<SwarmStats> {
    const agentStats = this.db.prepare(`
      SELECT 
        COUNT(*) as agentCount,
        SUM(CASE WHEN status = 'busy' THEN 1 ELSE 0 END) as busyAgents
      FROM agents 
      WHERE swarm_id = ?
    `).get(swarmId) as AgentStats | undefined;
    
    const taskStats = this.db.prepare(`
      SELECT 
        COUNT(*) as taskBacklog
      FROM tasks 
      WHERE swarm_id = ? AND status IN ('pending', 'assigned')
    `).get(swarmId) as TaskStats | undefined;
    
    const safeAgentStats: AgentStats = agentStats || { agentCount: 0, busyAgents: 0 };
    const safeTaskStats: TaskStats = taskStats || { taskBacklog: 0 };
    
    return {
      ...safeAgentStats,
      ...safeTaskStats,
      agentUtilization: safeAgentStats.agentCount > 0 
        ? safeAgentStats.busyAgents / safeAgentStats.agentCount 
        : 0
    };
  }

  async getStrategyPerformance(swarmId: string): Promise<Record<string, {
    successRate: number;
    avgCompletionTime: number;
    totalTasks: number;
  }>> {
    const results = this.db.prepare(`
      SELECT 
        strategy,
        COUNT(*) as totalTasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful,
        AVG(JULIANDAY(completed_at) - JULIANDAY(created_at)) * 24 * 60 * 60 * 1000 as avgCompletionTime
      FROM tasks 
      WHERE swarm_id = ? AND completed_at IS NOT NULL
      GROUP BY strategy
    `).all(swarmId) as StrategyPerformanceResult[];
    
    const performance: Record<string, {
      successRate: number;
      avgCompletionTime: number;
      totalTasks: number;
    }> = {};
    
    for (const result of results) {
      performance[result.strategy] = {
        successRate: result.successful / result.totalTasks,
        avgCompletionTime: result.avgCompletionTime,
        totalTasks: result.totalTasks
      };
    }
    
    return performance;
  }

  async getSuccessfulDecisions(swarmId: string): Promise<MemoryRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM memory 
      WHERE namespace = 'queen-decisions' 
      AND key LIKE 'decision/%'
      AND metadata LIKE '%"swarmId":"${swarmId}"%'
      ORDER BY created_at DESC
      LIMIT 100
    `).all();
    return results as MemoryRow[];
  }

  // Utility operations

  async deleteMemoryEntry(key: string, namespace: string): Promise<void> {
    const startTime = performance.now();
    
    try {
      this.db.prepare('DELETE FROM memory WHERE key = ? AND namespace = ?').run(key, namespace);
      
      const duration = performance.now() - startTime;
      this.recordPerformance('delete_memory', duration);
      
    } catch (error) {
      this.recordPerformance('delete_memory_error', performance.now() - startTime);
      throw error;
    }
  }

  /**
   * Health check for database
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    details?: any;
  }> {
    try {
      // Test basic database connectivity
      this.db.prepare('SELECT 1').get();
      
      // Test core tables exist
      const tables = this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN ('swarms', 'agents', 'tasks', 'memory')
      `).all();
      
      if (tables.length < 4) {
        return {
          status: 'degraded',
          message: 'Some core tables are missing',
          details: { foundTables: tables.length, expectedTables: 4 }
        };
      }
      
      return {
        status: 'healthy',
        message: 'Database is functioning normally'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Get consensus proposal by ID
   */
  async getConsensusProposal(id: string): Promise<ConsensusRow | undefined> {
    const result = this.db.prepare('SELECT * FROM consensus WHERE id = ?').get(id);
    return result as ConsensusRow | undefined;
  }

  /**
   * Update consensus status
   */
  async updateConsensusStatus(id: string, status: 'pending' | 'achieved' | 'failed' | 'timeout'): Promise<void> {
    this.db.prepare('UPDATE consensus SET status = ? WHERE id = ?').run(status, id);
  }

  /**
   * Get recent consensus proposals
   */
  async getRecentConsensusProposals(swarmId: string, limit: number = 10): Promise<ConsensusRow[]> {
    const results = this.db.prepare(`
      SELECT * FROM consensus 
      WHERE swarm_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(swarmId, limit);
    return results as ConsensusRow[];
  }

  /**
   * Access to underlying database for complex queries
   */
  get prepare(): (sql: string) => Statement {
    return this.db.prepare.bind(this.db);
  }

  /**
   * Get database analytics
   */
  getDatabaseAnalytics(): {
    fragmentation: number;
    tableCount: number;
    schemaVersion: string;
    performance: {
      query_execution?: {
        avg: number;
      };
    };
  } {
    try {
      const stats = this.db.prepare('PRAGMA table_info(swarms)').all();
      return {
        fragmentation: 0, // Placeholder - could implement actual fragmentation detection
        tableCount: stats.length,
        schemaVersion: '1.0.0',
        performance: {
          query_execution: {
            avg: 0 // Placeholder - could implement actual query performance tracking
          }
        }
      };
    } catch (error) {
      return {
        fragmentation: 0,
        tableCount: 0,
        schemaVersion: 'unknown',
        performance: {
          query_execution: {
            avg: 0
          }
        }
      };
    }
  }

  /**
   * Record performance metric
   */
  private recordPerformance(operation: string, duration: number): void {
    // Simple performance tracking - could be expanded
    console.debug(`DB Operation ${operation}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}