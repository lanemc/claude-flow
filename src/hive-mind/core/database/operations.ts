/**
 * Database Operations
 * Core CRUD operations extracted from DatabaseManager
 */

import Database, { Statement } from 'better-sqlite3';
import { SQL_STATEMENTS } from './statements';
import type {
  SwarmRow, AgentRow, TaskRow, MemoryRow, CommunicationRow, 
  ConsensusRow, PerformanceMetricRow, SwarmStats, StrategyPerformanceResult,
  MemoryStats, NamespaceStats
} from './types';

export class DatabaseOperations {
  private db: Database.Database;
  private statements: Map<string, Statement> = new Map();

  constructor(database: Database.Database) {
    this.db = database;
  }

  private getStatement(key: string, sql: string): Statement {
    if (!this.statements.has(key)) {
      this.statements.set(key, this.db.prepare(sql));
    }
    return this.statements.get(key)!;
  }

  // Swarm operations
  async createSwarm(data: any): Promise<void> {
    const stmt = this.getStatement('createSwarm', SQL_STATEMENTS.CREATE_SWARM);
    stmt.run(data.id, data.name, data.topology, data.queen_mode, data.max_agents,
             data.consensus_threshold, data.memory_ttl, data.config, data.created_at,
             data.updated_at, data.is_active, data.status);
  }

  async getSwarm(id: string): Promise<SwarmRow | undefined> {
    const stmt = this.getStatement('getSwarm', SQL_STATEMENTS.GET_SWARM);
    return stmt.get(id) as SwarmRow | undefined;
  }

  async getActiveSwarmId(): Promise<string | null> {
    const stmt = this.getStatement('getActiveSwarm', SQL_STATEMENTS.GET_ACTIVE_SWARM);
    const result = stmt.get() as { id: string } | undefined;
    return result?.id || null;
  }

  async setActiveSwarm(id: string): Promise<void> {
    this.db.exec('UPDATE swarms SET is_active = 0');
    this.db.exec(`UPDATE swarms SET is_active = 1 WHERE id = '${id}'`);
  }

  async getAllSwarms(): Promise<(SwarmRow & { agentCount: number })[]> {
    const stmt = this.getStatement('getAllSwarms', SQL_STATEMENTS.GET_ALL_SWARMS);
    return stmt.all() as (SwarmRow & { agentCount: number })[];
  }

  // Agent operations
  async createAgent(data: any): Promise<void> {
    const stmt = this.getStatement('createAgent', SQL_STATEMENTS.CREATE_AGENT);
    stmt.run(data.id, data.swarm_id, data.name, data.type, data.status, data.capabilities,
             data.current_task_id, data.message_count, data.error_count, data.success_count,
             data.created_at, data.last_active_at, data.metadata);
  }

  async getAgent(id: string): Promise<AgentRow | undefined> {
    const stmt = this.getStatement('getAgent', SQL_STATEMENTS.GET_AGENT);
    return stmt.get(id) as AgentRow | undefined;
  }

  async getAgents(swarmId: string): Promise<AgentRow[]> {
    const stmt = this.getStatement('getAgents', SQL_STATEMENTS.GET_AGENTS);
    return stmt.all(swarmId) as AgentRow[];
  }

  async updateAgent(id: string, updates: Record<string, any>): Promise<void> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const sql = SQL_STATEMENTS.UPDATE_AGENT.replace('{{COLUMNS}}', setClause);
    const stmt = this.db.prepare(sql);
    stmt.run(...Object.values(updates), id);
  }

  async updateAgentStatus(id: string, status: string): Promise<void> {
    const stmt = this.getStatement('updateAgentStatus', SQL_STATEMENTS.UPDATE_AGENT_STATUS);
    stmt.run(status, new Date().toISOString(), id);
  }

  async getAgentPerformance(agentId: string): Promise<any> {
    const stmt = this.getStatement('getAgentPerformance', SQL_STATEMENTS.GET_AGENT_PERFORMANCE);
    return stmt.get(agentId);
  }

  // Task operations
  async createTask(data: any): Promise<void> {
    const stmt = this.getStatement('createTask', SQL_STATEMENTS.CREATE_TASK);
    stmt.run(data.id, data.swarm_id, data.type, data.description, data.status, data.priority,
             data.assigned_agent_id, data.dependencies, data.requirements, data.result,
             data.created_at, data.assigned_at, data.started_at, data.completed_at,
             data.estimated_duration, data.actual_duration, data.metadata);
  }

  async getTask(id: string): Promise<TaskRow | undefined> {
    const stmt = this.getStatement('getTask', SQL_STATEMENTS.GET_TASK);
    return stmt.get(id) as TaskRow | undefined;
  }

  async getTasks(swarmId: string): Promise<TaskRow[]> {
    const stmt = this.getStatement('getTasks', SQL_STATEMENTS.GET_TASKS);
    return stmt.all(swarmId) as TaskRow[];
  }

  async updateTask(id: string, updates: Record<string, any>): Promise<void> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const sql = SQL_STATEMENTS.UPDATE_TASK.replace('{{COLUMNS}}', setClause);
    const stmt = this.db.prepare(sql);
    stmt.run(...Object.values(updates), id);
  }

  async updateTaskStatus(id: string, status: string): Promise<void> {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const stmt = this.getStatement('updateTaskStatus', SQL_STATEMENTS.UPDATE_TASK_STATUS);
    stmt.run(status, completedAt, id);
  }

  async getPendingTasks(swarmId: string): Promise<TaskRow[]> {
    const stmt = this.getStatement('getPendingTasks', SQL_STATEMENTS.GET_PENDING_TASKS);
    return stmt.all(swarmId) as TaskRow[];
  }

  async getActiveTasks(swarmId: string): Promise<TaskRow[]> {
    const stmt = this.getStatement('getActiveTasks', SQL_STATEMENTS.GET_ACTIVE_TASKS);
    return stmt.all(swarmId) as TaskRow[];
  }

  async reassignTask(taskId: string, newAgentId: string): Promise<void> {
    const stmt = this.getStatement('reassignTask', SQL_STATEMENTS.REASSIGN_TASK);
    stmt.run(newAgentId, new Date().toISOString(), taskId);
  }

  // Memory operations
  async storeMemory(data: any): Promise<void> {
    const stmt = this.getStatement('storeMemory', SQL_STATEMENTS.STORE_MEMORY);
    stmt.run(data.key, data.namespace, data.value, data.access_count || 0,
             data.last_accessed_at, data.created_at, data.updated_at, data.metadata, data.ttl);
  }

  async getMemory(key: string, namespace: string): Promise<MemoryRow | undefined> {
    const stmt = this.getStatement('getMemory', SQL_STATEMENTS.GET_MEMORY);
    return stmt.get(key, namespace) as MemoryRow | undefined;
  }

  async updateMemoryAccess(key: string, namespace: string): Promise<void> {
    const stmt = this.getStatement('updateMemoryAccess', SQL_STATEMENTS.UPDATE_MEMORY_ACCESS);
    stmt.run(new Date().toISOString(), key, namespace);
  }

  async searchMemory(options: { namespace: string; query: string; limit: number }): Promise<MemoryRow[]> {
    const stmt = this.getStatement('searchMemory', SQL_STATEMENTS.SEARCH_MEMORY);
    const queryPattern = `%${options.query}%`;
    return stmt.all(options.namespace, queryPattern, queryPattern, options.limit) as MemoryRow[];
  }

  async deleteMemory(key: string, namespace: string): Promise<void> {
    const stmt = this.getStatement('deleteMemory', SQL_STATEMENTS.DELETE_MEMORY);
    stmt.run(key, namespace);
  }

  async listMemory(namespace: string, limit: number): Promise<MemoryRow[]> {
    const stmt = this.getStatement('listMemory', SQL_STATEMENTS.LIST_MEMORY);
    return stmt.all(namespace, limit) as MemoryRow[];
  }

  async getMemoryStats(): Promise<MemoryStats> {
    const stmt = this.getStatement('getMemoryStats', SQL_STATEMENTS.GET_MEMORY_STATS);
    return stmt.get() as MemoryStats;
  }

  async getNamespaceStats(namespace: string): Promise<NamespaceStats> {
    const stmt = this.getStatement('getNamespaceStats', SQL_STATEMENTS.GET_NAMESPACE_STATS);
    return stmt.get(namespace) as NamespaceStats;
  }

  async getAllMemoryEntries(): Promise<MemoryRow[]> {
    const stmt = this.getStatement('getAllMemory', SQL_STATEMENTS.GET_ALL_MEMORY);
    return stmt.all() as MemoryRow[];
  }

  async getRecentMemoryEntries(limit: number): Promise<MemoryRow[]> {
    const stmt = this.getStatement('getRecentMemory', SQL_STATEMENTS.GET_RECENT_MEMORY);
    return stmt.all(limit) as MemoryRow[];
  }

  async getOldMemoryEntries(daysOld: number): Promise<MemoryRow[]> {
    const stmt = this.getStatement('getOldMemory', SQL_STATEMENTS.GET_OLD_MEMORY);
    return stmt.all(daysOld) as MemoryRow[];
  }

  // Performance operations
  async storePerformanceMetric(data: any): Promise<void> {
    const stmt = this.getStatement('storePerformanceMetric', SQL_STATEMENTS.STORE_PERFORMANCE_METRIC);
    stmt.run(data.id, data.swarm_id, data.agent_id, data.task_id, data.metric_type,
             data.metric_value, data.metadata, data.created_at);
  }

  async getSwarmStats(swarmId: string): Promise<SwarmStats> {
    const stmt = this.getStatement('getSwarmStats', SQL_STATEMENTS.GET_SWARM_STATS);
    return stmt.get(swarmId, swarmId, swarmId, swarmId, swarmId, swarmId, swarmId) as SwarmStats;
  }

  async getStrategyPerformance(swarmId: string): Promise<Record<string, StrategyPerformanceResult>> {
    const stmt = this.getStatement('getStrategyPerformance', SQL_STATEMENTS.GET_STRATEGY_PERFORMANCE);
    const results = stmt.all(swarmId) as StrategyPerformanceResult[];
    
    const performance: Record<string, StrategyPerformanceResult> = {};
    results.forEach(result => {
      performance[result.strategy] = result;
    });
    
    return performance;
  }

  async getSuccessfulDecisions(swarmId: string): Promise<MemoryRow[]> {
    const stmt = this.getStatement('getSuccessfulDecisions', SQL_STATEMENTS.GET_SUCCESSFUL_DECISIONS);
    return stmt.all(swarmId) as MemoryRow[];
  }

  // Communication operations
  async createCommunication(data: any): Promise<void> {
    const stmt = this.getStatement('createCommunication', SQL_STATEMENTS.CREATE_COMMUNICATION);
    stmt.run(data.id, data.swarm_id, data.from_agent_id, data.to_agent_id, data.message_type,
             data.content, data.metadata, data.broadcast_scope, data.priority, data.created_at,
             data.delivered_at, data.read_at, data.acknowledged_at, data.requires_response,
             data.parent_message_id);
  }

  async getPendingMessages(agentId: string): Promise<CommunicationRow[]> {
    const stmt = this.getStatement('getPendingMessages', SQL_STATEMENTS.GET_PENDING_MESSAGES);
    return stmt.all(agentId) as CommunicationRow[];
  }

  async markMessageDelivered(messageId: string): Promise<void> {
    const stmt = this.getStatement('markMessageDelivered', SQL_STATEMENTS.MARK_MESSAGE_DELIVERED);
    stmt.run(new Date().toISOString(), messageId);
  }

  async markMessageRead(messageId: string): Promise<void> {
    const stmt = this.getStatement('markMessageRead', SQL_STATEMENTS.MARK_MESSAGE_READ);
    stmt.run(new Date().toISOString(), messageId);
  }

  async getRecentMessages(swarmId: string, timeWindow: number): Promise<CommunicationRow[]> {
    const stmt = this.getStatement('getRecentMessages', SQL_STATEMENTS.GET_RECENT_MESSAGES);
    return stmt.all(swarmId, timeWindow) as CommunicationRow[];
  }

  // Consensus operations
  async createConsensusProposal(proposal: any): Promise<void> {
    const stmt = this.getStatement('createConsensusProposal', SQL_STATEMENTS.CREATE_CONSENSUS_PROPOSAL);
    stmt.run(proposal.id, proposal.swarm_id, proposal.proposal_type, proposal.proposal_data,
             proposal.proposed_by, proposal.threshold_required, proposal.votes_for,
             proposal.votes_against, proposal.votes_total, proposal.status, proposal.created_at,
             proposal.resolved_at, proposal.timeout_at);
  }

  async submitConsensusVote(proposalId: string, agentId: string, vote: boolean, reason?: string): Promise<void> {
    const stmt = this.getStatement('submitConsensusVote', SQL_STATEMENTS.SUBMIT_CONSENSUS_VOTE);
    const votesFor = vote ? 1 : 0;
    const votesAgainst = vote ? 0 : 1;
    stmt.run(votesFor, votesAgainst, proposalId);
  }

  async getConsensusProposal(id: string): Promise<ConsensusRow | undefined> {
    const stmt = this.getStatement('getConsensusProposal', SQL_STATEMENTS.GET_CONSENSUS_PROPOSAL);
    return stmt.get(id) as ConsensusRow | undefined;
  }

  async updateConsensusStatus(id: string, status: 'pending' | 'achieved' | 'failed' | 'timeout'): Promise<void> {
    const stmt = this.getStatement('updateConsensusStatus', SQL_STATEMENTS.UPDATE_CONSENSUS_STATUS);
    stmt.run(status, new Date().toISOString(), id);
  }

  async getRecentConsensusProposals(swarmId: string, limit: number = 10): Promise<ConsensusRow[]> {
    const stmt = this.getStatement('getRecentConsensus', SQL_STATEMENTS.GET_RECENT_CONSENSUS);
    return stmt.all(swarmId, limit) as ConsensusRow[];
  }

  // Utility operations
  async clearMemory(swarmId: string): Promise<void> {
    const stmt = this.getStatement('clearMemory', SQL_STATEMENTS.CLEAR_MEMORY);
    stmt.run(`%swarm-${swarmId}%`);
  }

  async deleteOldEntries(namespace: string, ttl: number): Promise<void> {
    const stmt = this.getStatement('deleteOldEntries', SQL_STATEMENTS.DELETE_OLD_ENTRIES);
    stmt.run(namespace, ttl);
  }

  async trimNamespace(namespace: string, maxEntries: number): Promise<void> {
    const stmt = this.getStatement('trimNamespace', SQL_STATEMENTS.TRIM_NAMESPACE);
    stmt.run(namespace, namespace, maxEntries);
  }

  async updateMemoryEntry(entry: any): Promise<void> {
    const stmt = this.getStatement('updateMemoryEntry', SQL_STATEMENTS.UPDATE_MEMORY_ENTRY);
    stmt.run(entry.value, entry.metadata, new Date().toISOString(), entry.key, entry.namespace);
  }

  async deleteMemoryEntry(key: string, namespace: string): Promise<void> {
    const stmt = this.getStatement('deleteMemoryEntry', SQL_STATEMENTS.DELETE_MEMORY_ENTRY);
    stmt.run(key, namespace);
  }

  async healthCheck(): Promise<any> {
    const results = {
      swarms: this.db.prepare(SQL_STATEMENTS.HEALTH_CHECK_SWARMS).get() as { count: number },
      agents: this.db.prepare(SQL_STATEMENTS.HEALTH_CHECK_AGENTS).get() as { count: number },
      tasks: this.db.prepare(SQL_STATEMENTS.HEALTH_CHECK_TASKS).get() as { count: number },
      memory: this.db.prepare(SQL_STATEMENTS.HEALTH_CHECK_MEMORY).get() as { count: number },
      communications: this.db.prepare(SQL_STATEMENTS.HEALTH_CHECK_COMMUNICATIONS).get() as { count: number }
    };

    return {
      healthy: true,
      timestamp: new Date().toISOString(),
      tables: results,
      message: 'Database is functioning normally'
    };
  }
}