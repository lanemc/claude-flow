/**
 * SwarmMemory - MCP-specific memory persistence extending SharedMemory
 * Provides swarm-specific features like agent coordination, task tracking, and neural patterns
 * 
 * @module swarm-memory
 */

import { SharedMemory } from './shared-memory.js';
import * as path from 'path';
import type {
  SwarmMemoryOptions,
  AgentData,
  TaskData,
  CommunicationMessage,
  ConsensusDecision,
  NeuralPattern,
  SwarmStats,
  CleanupOptions,
  SwarmExportState,
  ImportResult,
  MemorySearchOptions,
  MemoryStoreOptions
} from './types';

/**
 * Swarm-specific namespaces
 */
const SWARM_NAMESPACES = {
  AGENTS: 'swarm:agents',
  TASKS: 'swarm:tasks',
  COMMUNICATIONS: 'swarm:communications',
  CONSENSUS: 'swarm:consensus',
  PATTERNS: 'swarm:patterns',
  METRICS: 'swarm:metrics',
  COORDINATION: 'swarm:coordination'
} as const;

type SwarmNamespace = typeof SWARM_NAMESPACES[keyof typeof SWARM_NAMESPACES];

/**
 * SwarmMemory class - Extends SharedMemory with MCP features
 */
class SwarmMemory extends SharedMemory {
  private swarmId: string;
  private mcpMode: boolean;
  private agentCache = new Map<string, AgentData>();
  private taskCache = new Map<string, TaskData>();
  private patternCache = new Map<string, NeuralPattern>();

  constructor(options: SwarmMemoryOptions = {}) {
    // Default to .swarm directory for MCP
    super({
      directory: options.directory || '.swarm',
      filename: options.filename || 'swarm-memory.db',
      ...options
    });
    
    this.swarmId = options.swarmId || 'default';
    this.mcpMode = options.mcpMode !== false;
  }

  /**
   * Initialize with swarm-specific setup
   */
  override async initialize(): Promise<void> {
    await super.initialize();
    
    // Initialize swarm-specific namespaces
    await this._initializeSwarmNamespaces();
    
    // Load active agents and tasks into cache
    await this._loadSwarmState();
    
    this.emit('swarm:initialized', { swarmId: this.swarmId });
  }

  /**
   * Store agent information
   */
  async storeAgent(agentId: string, agentData: Partial<AgentData>): Promise<{ agentId: string; stored: boolean }> {
    const key = `agent:${agentId}`;
    const enrichedData: AgentData = {
      id: agentId,
      type: agentData.type || 'unknown',
      status: agentData.status || 'active',
      capabilities: agentData.capabilities || [],
      metrics: {
        tasksCompleted: 0,
        successRate: 1.0,
        avgResponseTime: 0,
        ...agentData.metrics
      },
      swarmId: this.swarmId,
      lastUpdated: new Date().toISOString(),
      ...agentData
    };
    
    await this.store(key, enrichedData, {
      namespace: SWARM_NAMESPACES.AGENTS,
      tags: ['agent', enrichedData.type, enrichedData.status],
      metadata: {
        swarmId: this.swarmId,
        agentType: enrichedData.type
      }
    });
    
    // Update agent cache
    this.agentCache.set(agentId, enrichedData);
    
    this.emit('swarm:agentStored', { agentId, type: enrichedData.type });
    
    return { agentId, stored: true };
  }

  /**
   * Retrieve agent information
   */
  async getAgent(agentId: string): Promise<AgentData | null> {
    // Check cache first
    if (this.agentCache.has(agentId)) {
      return this.agentCache.get(agentId)!;
    }
    
    const key = `agent:${agentId}`;
    const agent = await this.retrieve(key, { namespace: SWARM_NAMESPACES.AGENTS }) as AgentData | null;
    
    if (agent) {
      this.agentCache.set(agentId, agent);
    }
    
    return agent;
  }

  /**
   * List all agents in swarm
   */
  async listAgents(filter: { 
    type?: string; 
    status?: string; 
    swarmId?: string; 
    limit?: number 
  } = {}): Promise<AgentData[]> {
    const agents = await this.list({
      namespace: SWARM_NAMESPACES.AGENTS,
      limit: filter.limit || 100
    });
    
    return agents.map(entry => entry.value as AgentData).filter(agent => {
      if (filter.type && agent.type !== filter.type) return false;
      if (filter.status && agent.status !== filter.status) return false;
      if (filter.swarmId && agent.swarmId !== filter.swarmId) return false;
      return true;
    });
  }

  /**
   * Store task information
   */
  async storeTask(taskId: string, taskData: Partial<TaskData>): Promise<{ taskId: string; stored: boolean }> {
    const key = `task:${taskId}`;
    const enrichedData: TaskData = {
      id: taskId,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'normal',
      assignedAgents: taskData.assignedAgents || [],
      swarmId: this.swarmId,
      createdAt: taskData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...taskData
    };
    
    await this.store(key, enrichedData, {
      namespace: SWARM_NAMESPACES.TASKS,
      tags: ['task', enrichedData.status, enrichedData.priority || 'normal'],
      metadata: {
        swarmId: this.swarmId,
        assignedAgents: enrichedData.assignedAgents
      }
    });
    
    // Update task cache
    this.taskCache.set(taskId, enrichedData);
    
    this.emit('swarm:taskStored', { taskId, status: enrichedData.status });
    
    return { taskId, stored: true };
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId: string, status: string, result?: unknown): Promise<{ taskId: string; status: string; updated: boolean }> {
    const task = await this.getTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    task.status = status;
    task.updatedAt = new Date().toISOString();
    
    if (result) {
      task.result = result;
    }
    
    if (status === 'completed') {
      task.completedAt = new Date().toISOString();
    }
    
    await this.storeTask(taskId, task);
    
    this.emit('swarm:taskStatusUpdated', { taskId, status });
    
    return { taskId, status, updated: true };
  }

  /**
   * Get task information
   */
  async getTask(taskId: string): Promise<TaskData | null> {
    // Check cache first
    if (this.taskCache.has(taskId)) {
      return this.taskCache.get(taskId)!;
    }
    
    const key = `task:${taskId}`;
    const task = await this.retrieve(key, { namespace: SWARM_NAMESPACES.TASKS }) as TaskData | null;
    
    if (task) {
      this.taskCache.set(taskId, task);
    }
    
    return task;
  }

  /**
   * Store inter-agent communication
   */
  async storeCommunication(fromAgent: string, toAgent: string, message: { type: string; [key: string]: any }): Promise<{ id: string; stored: boolean }> {
    const commId = `comm:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const communication: CommunicationMessage = {
      id: commId,
      fromAgent,
      toAgent,
      message,
      swarmId: this.swarmId,
      timestamp: new Date().toISOString()
    };
    
    await this.store(commId, communication, {
      namespace: SWARM_NAMESPACES.COMMUNICATIONS,
      ttl: 86400, // 24 hours
      tags: ['communication', message.type],
      metadata: {
        fromAgent,
        toAgent,
        messageType: message.type
      }
    });
    
    this.emit('swarm:communication', { fromAgent, toAgent, type: message.type });
    
    return { id: commId, stored: true };
  }

  /**
   * Store consensus decision
   */
  async storeConsensus(consensusId: string, decision: ConsensusDecision): Promise<{ consensusId: string; stored: boolean }> {
    const key = `consensus:${consensusId}`;
    const consensusData = {
      ...decision,
      swarmId: this.swarmId,
      timestamp: new Date().toISOString()
    };
    
    await this.store(key, consensusData, {
      namespace: SWARM_NAMESPACES.CONSENSUS,
      tags: ['consensus', decision.status],
      metadata: {
        swarmId: this.swarmId,
        taskId: decision.taskId,
        threshold: decision.threshold
      }
    });
    
    this.emit('swarm:consensus', { consensusId, status: decision.status });
    
    return { consensusId, stored: true };
  }

  /**
   * Store neural pattern
   */
  async storePattern(patternId: string, pattern: Omit<NeuralPattern, 'id' | 'usageCount' | 'successRate'>): Promise<{ patternId: string; stored: boolean }> {
    const key = `pattern:${patternId}`;
    const patternData: NeuralPattern = {
      id: patternId,
      type: pattern.type,
      swarmId: this.swarmId,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      successRate: 0,
      ...pattern
    };
    
    await this.store(key, patternData, {
      namespace: SWARM_NAMESPACES.PATTERNS,
      tags: ['pattern', pattern.type],
      metadata: {
        swarmId: this.swarmId,
        patternType: pattern.type,
        confidence: pattern.confidence || 0
      }
    });
    
    // Cache frequently used patterns
    if (pattern.type === 'coordination' || pattern.type === 'optimization') {
      this.patternCache.set(patternId, patternData);
    }
    
    this.emit('swarm:patternStored', { patternId, type: pattern.type });
    
    return { patternId, stored: true };
  }

  /**
   * Update pattern usage and success metrics
   */
  async updatePatternMetrics(patternId: string, success: boolean = true): Promise<{ patternId: string; usageCount: number; successRate: number }> {
    const pattern = await this.getPattern(patternId);
    if (!pattern) {
      throw new Error(`Pattern ${patternId} not found`);
    }
    
    pattern.usageCount = (pattern.usageCount || 0) + 1;
    pattern.lastUsedAt = new Date().toISOString();
    
    // Update success rate with exponential moving average
    const alpha = 0.1; // Smoothing factor
    const currentSuccess = success ? 1 : 0;
    pattern.successRate = alpha * currentSuccess + (1 - alpha) * (pattern.successRate || 0);
    
    await this.storePattern(patternId, pattern);
    
    return { patternId, usageCount: pattern.usageCount, successRate: pattern.successRate };
  }

  /**
   * Get pattern
   */
  async getPattern(patternId: string): Promise<NeuralPattern | null> {
    // Check cache first
    if (this.patternCache.has(patternId)) {
      return this.patternCache.get(patternId)!;
    }
    
    const key = `pattern:${patternId}`;
    return await this.retrieve(key, { namespace: SWARM_NAMESPACES.PATTERNS }) as NeuralPattern | null;
  }

  /**
   * Find best patterns for a given context
   */
  async findBestPatterns(context: { tags?: string[] }, limit: number = 5): Promise<(NeuralPattern & { score: number })[]> {
    const patterns = await this.search('pattern:', {
      namespace: SWARM_NAMESPACES.PATTERNS,
      tags: context.tags,
      limit: 100
    });
    
    // Score patterns based on success rate and relevance
    const scored = patterns.map(entry => {
      const pattern = entry.value as NeuralPattern;
      const score = (pattern.successRate || 0) * 0.7 + 
                   (pattern.confidence || 0) * 0.2 +
                   ((pattern.usageCount || 0) > 0 ? 0.1 : 0);
      
      return { ...pattern, score };
    });
    
    // Sort by score and return top patterns
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Store coordination state
   */
  async storeCoordination(key: string, state: Record<string, unknown>): Promise<{ key: string; stored: boolean }> {
    await this.store(key, state, {
      namespace: SWARM_NAMESPACES.COORDINATION,
      ttl: 3600, // 1 hour
      metadata: {
        swarmId: this.swarmId,
        timestamp: new Date().toISOString()
      }
    });
    
    return { key, stored: true };
  }

  /**
   * Get coordination state
   */
  async getCoordination(key: string): Promise<unknown> {
    return await this.retrieve(key, { namespace: SWARM_NAMESPACES.COORDINATION });
  }

  /**
   * Store performance metrics
   */
  async storeMetrics(metricsId: string, metrics: { type: string; agentId?: string; [key: string]: any }): Promise<{ metricsId: string; stored: boolean }> {
    const key = `metrics:${metricsId}`;
    await this.store(key, metrics, {
      namespace: SWARM_NAMESPACES.METRICS,
      ttl: 86400 * 7, // 7 days
      tags: ['metrics', metrics.type],
      metadata: {
        swarmId: this.swarmId,
        agentId: metrics.agentId,
        timestamp: new Date().toISOString()
      }
    });
    
    this.emit('swarm:metricsStored', { metricsId, type: metrics.type });
    
    return { metricsId, stored: true };
  }

  /**
   * Get swarm statistics
   */
  async getSwarmStats(): Promise<SwarmStats & { base: any }> {
    const baseStats = await this.getStats();
    
    // Add swarm-specific stats
    const agentCount = await this._countNamespace(SWARM_NAMESPACES.AGENTS);
    const taskCount = await this._countNamespace(SWARM_NAMESPACES.TASKS);
    const patternCount = await this._countNamespace(SWARM_NAMESPACES.PATTERNS);
    
    // Get active agents
    const activeAgents = Array.from(this.agentCache.values())
      .filter(agent => agent.status === 'active' || agent.status === 'busy')
      .length;
    
    // Get task statistics
    const tasks = Array.from(this.taskCache.values());
    const taskStats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length
    };
    
    return {
      base: baseStats,
      swarmId: this.swarmId,
      agents: {
        total: agentCount,
        active: activeAgents,
        cached: this.agentCache.size
      },
      tasks: taskStats,
      patterns: {
        total: patternCount,
        cached: this.patternCache.size
      },
      namespaces: Object.values(SWARM_NAMESPACES)
    };
  }

  /**
   * Clean up old swarm data
   */
  async cleanupSwarmData(options: CleanupOptions = {}): Promise<{ cleaned: number }> {
    const {
      maxAge = 86400 * 7, // 7 days
      keepPatterns = true,
      keepConsensus = true
    } = options;
    
    const cutoffTime = Date.now() - (maxAge * 1000);
    let cleaned = 0;
    
    // Clean old communications
    const comms = await this.list({ namespace: SWARM_NAMESPACES.COMMUNICATIONS });
    for (const comm of comms) {
      const commData = comm.value as CommunicationMessage;
      if (new Date(commData.timestamp).getTime() < cutoffTime) {
        await this.delete(comm.key, { namespace: SWARM_NAMESPACES.COMMUNICATIONS });
        cleaned++;
      }
    }
    
    // Clean completed tasks
    const tasks = await this.list({ namespace: SWARM_NAMESPACES.TASKS });
    for (const task of tasks) {
      const taskData = task.value as TaskData;
      if (taskData.status === 'completed' && 
          taskData.completedAt &&
          new Date(taskData.completedAt).getTime() < cutoffTime) {
        await this.delete(task.key, { namespace: SWARM_NAMESPACES.TASKS });
        this.taskCache.delete(taskData.id);
        cleaned++;
      }
    }
    
    // Clean old metrics
    const metrics = await this.list({ namespace: SWARM_NAMESPACES.METRICS });
    for (const metric of metrics) {
      if (metric.createdAt.getTime() < cutoffTime) {
        await this.delete(metric.key, { namespace: SWARM_NAMESPACES.METRICS });
        cleaned++;
      }
    }
    
    this.emit('swarm:cleanup', { cleaned, maxAge });
    
    return { cleaned };
  }

  /**
   * Export swarm state
   */
  async exportSwarmState(): Promise<SwarmExportState> {
    const agents = await this.listAgents();
    const tasks = Array.from(this.taskCache.values());
    const patterns = await this.list({ namespace: SWARM_NAMESPACES.PATTERNS });
    
    return {
      swarmId: this.swarmId,
      exportedAt: new Date().toISOString(),
      agents,
      tasks,
      patterns: patterns.map(p => p.value as NeuralPattern),
      statistics: await this.getSwarmStats()
    };
  }

  /**
   * Import swarm state
   */
  async importSwarmState(state: SwarmExportState): Promise<ImportResult> {
    const imported: ImportResult = {
      agents: 0,
      tasks: 0,
      patterns: 0
    };
    
    // Import agents
    if (state.agents) {
      for (const agent of state.agents) {
        await this.storeAgent(agent.id, agent);
        imported.agents++;
      }
    }
    
    // Import tasks
    if (state.tasks) {
      for (const task of state.tasks) {
        await this.storeTask(task.id, task);
        imported.tasks++;
      }
    }
    
    // Import patterns
    if (state.patterns) {
      for (const pattern of state.patterns) {
        await this.storePattern(pattern.id, pattern);
        imported.patterns++;
      }
    }
    
    this.emit('swarm:imported', imported);
    
    return imported;
  }

  /**
   * Shutdown the swarm memory system
   */
  async shutdown(): Promise<void> {
    // Clear all caches
    this.agentCache.clear();
    this.taskCache.clear();
    this.patternCache.clear();
    
    // Emit shutdown event
    this.emit('swarm:shutdown', { swarmId: this.swarmId });
    
    // Call parent close method
    await this.close();
  }

  /**
   * Private helper methods
   */
  
  private async _initializeSwarmNamespaces(): Promise<void> {
    // Create swarm metadata
    await this.store('swarm:metadata', {
      swarmId: this.swarmId,
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      namespaces: Object.values(SWARM_NAMESPACES)
    }, {
      namespace: 'swarm:system'
    });
  }

  private async _loadSwarmState(): Promise<void> {
    // Load active agents
    const agents = await this.list({ namespace: SWARM_NAMESPACES.AGENTS, limit: 100 });
    for (const entry of agents) {
      const agent = entry.value as AgentData;
      if (agent.status === 'active' || agent.status === 'busy') {
        this.agentCache.set(agent.id, agent);
      }
    }
    
    // Load in-progress tasks
    const tasks = await this.search('task:', {
      namespace: SWARM_NAMESPACES.TASKS,
      tags: ['in_progress'],
      limit: 100
    });
    for (const entry of tasks) {
      const task = entry.value as TaskData;
      this.taskCache.set(task.id, task);
    }
    
    // Load high-confidence patterns
    const patterns = await this.list({ namespace: SWARM_NAMESPACES.PATTERNS, limit: 50 });
    for (const entry of patterns) {
      const pattern = entry.value as NeuralPattern;
      if ((pattern.confidence || 0) > 0.7 || (pattern.successRate || 0) > 0.8) {
        this.patternCache.set(pattern.id, pattern);
      }
    }
  }

  private async _countNamespace(namespace: string): Promise<number> {
    const stats = await this.getStats();
    return stats.namespaces[namespace]?.count || 0;
  }
}

// Export factory function for easy creation
export function createSwarmMemory(options: SwarmMemoryOptions = {}): SwarmMemory {
  return new SwarmMemory(options);
}

// Export for backwards compatibility
export { SwarmMemory };
export default SwarmMemory;