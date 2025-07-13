/**
 * Enhanced Memory Functions for Comprehensive Swarm Coordination
 * Version 2: Works with both SQLite and in-memory fallback stores
 */

import { FallbackMemoryStore } from './fallback-store';
import type {
  SessionState,
  WorkflowData,
  MetricData,
  AgentData,
  LearningData,
  PerformanceData,
  ExportData,
  FallbackMemoryStoreOptions,
  MemoryStoreOptions
} from './types';

class EnhancedMemory extends FallbackMemoryStore {
  constructor(options: FallbackMemoryStoreOptions = {}) {
    super(options);
  }

  override async initialize(): Promise<void> {
    await super.initialize();
    
    // If using SQLite, try to apply enhanced schema
    if (!this.isUsingFallback() && this.primaryStore) {
      try {
        const { readFileSync } = await import('fs');
        const path = await import('path');
        const { getFilename, getDirname } = await import('../utils/import-meta-shim');
        const __filename = getFilename();
        const __dirname = getDirname();
        const schemaPath = path.join(__dirname, 'enhanced-schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8');
        // Note: Cannot access private db property directly, this would need to be handled differently
        console.error(`[${new Date().toISOString()}] INFO [enhanced-memory] Enhanced schema would be applied here`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] WARN [enhanced-memory] Could not apply enhanced schema:`, 
          error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  // === SESSION MANAGEMENT ===
  
  async saveSessionState(sessionId: string, state: Partial<SessionState>): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const sessionData: SessionState = {
      sessionId,
      userId: state.userId || process.env.USER || 'unknown',
      projectPath: state.projectPath || process.cwd(),
      activeBranch: state.activeBranch || 'main',
      lastActivity: Date.now(),
      state: state.state || 'active',
      context: state.context || {},
      environment: state.environment || process.env as Record<string, string>
    };

    return this.store(`session:${sessionId}`, sessionData, {
      namespace: 'sessions',
      metadata: { type: 'session_state' }
    });
  }

  async resumeSession(sessionId: string): Promise<SessionState | null> {
    return this.retrieve(`session:${sessionId}`, { namespace: 'sessions' });
  }

  async getActiveSessions(): Promise<SessionState[]> {
    const sessions = await this.list({ namespace: 'sessions', limit: 100 });
    return sessions
      .map(item => item.value as SessionState)
      .filter(session => session.state === 'active');
  }

  // === WORKFLOW TRACKING ===
  
  async trackWorkflow(workflowId: string, data: Partial<WorkflowData>): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const workflowData: WorkflowData = {
      workflowId,
      name: data.name || 'Unnamed Workflow',
      steps: data.steps || [],
      status: data.status || 'pending',
      progress: data.progress || 0,
      startTime: data.startTime || Date.now(),
      endTime: data.endTime,
      results: data.results || {}
    };

    return this.store(`workflow:${workflowId}`, workflowData, {
      namespace: 'workflows',
      metadata: { type: 'workflow' }
    });
  }

  async getWorkflowStatus(workflowId: string): Promise<WorkflowData | null> {
    return this.retrieve(`workflow:${workflowId}`, { namespace: 'workflows' });
  }

  // === METRICS COLLECTION ===
  
  async recordMetric(metricName: string, value: any, metadata: Record<string, any> = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const timestamp = Date.now();
    const metricKey = `metric:${metricName}:${timestamp}`;
    
    const metricData: MetricData = {
      name: metricName,
      value,
      timestamp,
      metadata
    };

    return this.store(metricKey, metricData, {
      namespace: 'metrics',
      ttl: 86400 // 24 hours
    });
  }

  async getMetrics(metricName: string, timeRange: number = 3600000): Promise<MetricData[]> { // Default 1 hour
    const cutoff = Date.now() - timeRange;
    const metrics = await this.search(`metric:${metricName}`, {
      namespace: 'metrics',
      limit: 1000
    });
    
    return metrics
      .map(item => item.value as MetricData)
      .filter(metric => metric.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // === AGENT COORDINATION ===
  
  async registerAgent(agentId: string, config: Partial<AgentData>): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const agentData: AgentData = {
      id: agentId,
      type: config.type || 'unknown',
      status: 'active',
      capabilities: config.capabilities || [],
      metrics: {
        tasksCompleted: 0,
        successRate: 1.0,
        avgResponseTime: 0,
        ...config.metrics
      },
      ...config
    };

    return this.store(`agent:${agentId}`, agentData, {
      namespace: 'agents',
      metadata: { type: 'agent_registration' }
    });
  }

  async updateAgentStatus(agentId: string, status: string, metrics: Record<string, any> = {}): Promise<AgentData | null> {
    const agent = await this.retrieve(`agent:${agentId}`, { namespace: 'agents' }) as AgentData | null;
    if (!agent) return null;

    agent.status = status;
    
    if (metrics && agent.metrics) {
      Object.assign(agent.metrics, metrics);
    }

    await this.store(`agent:${agentId}`, agent, {
      namespace: 'agents',
      metadata: { type: 'agent_update' }
    });

    return agent;
  }

  async getActiveAgents(): Promise<AgentData[]> {
    const agents = await this.list({ namespace: 'agents', limit: 100 });
    
    return agents
      .map(item => item.value as AgentData)
      .filter(agent => agent.status === 'active');
  }

  // === KNOWLEDGE MANAGEMENT ===
  
  async storeKnowledge(domain: string, key: string, value: any, metadata: Record<string, any> = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const knowledgeData = {
      domain,
      key,
      value,
      metadata,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return this.store(`knowledge:${domain}:${key}`, knowledgeData, {
      namespace: 'knowledge',
      metadata: { domain }
    });
  }

  async retrieveKnowledge(domain: string, key: string): Promise<any> {
    return this.retrieve(`knowledge:${domain}:${key}`, { namespace: 'knowledge' });
  }

  async searchKnowledge(domain: string, pattern: string): Promise<any[]> {
    const results = await this.search(`knowledge:${domain}:${pattern}`, {
      namespace: 'knowledge',
      limit: 50
    });
    
    return results.map(item => item.value);
  }

  // === LEARNING & ADAPTATION ===
  
  async recordLearning(agentId: string, learning: Omit<LearningData, 'agentId' | 'timestamp'>): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const learningData: LearningData = {
      agentId,
      timestamp: Date.now(),
      type: learning.type,
      input: learning.input,
      output: learning.output,
      feedback: learning.feedback,
      improvement: learning.improvement
    };

    return this.store(`learning:${agentId}:${Date.now()}`, learningData, {
      namespace: 'learning',
      ttl: 604800 // 7 days
    });
  }

  async getLearnings(agentId: string, limit: number = 100): Promise<LearningData[]> {
    const learnings = await this.search(`learning:${agentId}`, {
      namespace: 'learning',
      limit
    });
    
    return learnings
      .map(item => item.value as LearningData)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // === PERFORMANCE TRACKING ===
  
  async trackPerformance(operation: string, duration: number, success: boolean = true, metadata: Record<string, any> = {}): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> {
    const perfData: PerformanceData = {
      operation,
      duration,
      success,
      timestamp: Date.now(),
      metadata
    };

    // Store individual performance record
    await this.store(`perf:${operation}:${Date.now()}`, perfData, {
      namespace: 'performance',
      ttl: 86400 // 24 hours
    });

    // Update aggregated stats
    const statsKey = `stats:${operation}`;
    const stats = await this.retrieve(statsKey, { namespace: 'performance' }) || {
      count: 0,
      successCount: 0,
      totalDuration: 0,
      avgDuration: 0,
      minDuration: Infinity,
      maxDuration: 0
    };

    stats.count++;
    if (success) stats.successCount++;
    stats.totalDuration += duration;
    stats.avgDuration = stats.totalDuration / stats.count;
    stats.minDuration = Math.min(stats.minDuration, duration);
    stats.maxDuration = Math.max(stats.maxDuration, duration);
    stats.successRate = stats.successCount / stats.count;

    return this.store(statsKey, stats, { namespace: 'performance' });
  }

  async getPerformanceStats(operation: string): Promise<any> {
    return this.retrieve(`stats:${operation}`, { namespace: 'performance' });
  }

  // === COORDINATION CACHE ===
  
  async cacheCoordination(key: string, value: any, ttl: number = 300): Promise<{
    success: boolean;
    id?: string | number;
    size?: number;
  }> { // 5 minutes default
    return this.store(`cache:${key}`, value, {
      namespace: 'coordination',
      ttl
    });
  }

  async getCachedCoordination(key: string): Promise<any> {
    return this.retrieve(`cache:${key}`, { namespace: 'coordination' });
  }

  // === UTILITY METHODS ===
  
  async cleanupExpired(): Promise<number> {
    // Base cleanup handles TTL expiration
    const cleaned = await this.cleanup();
    
    // Additional cleanup for old performance data
    if (!this.isUsingFallback()) {
      // SQLite-specific cleanup can be added here
    }
    
    return cleaned;
  }

  async exportData(namespace?: string): Promise<ExportData> {
    const namespaces = namespace ? [namespace] : [
      'sessions', 'workflows', 'metrics', 'agents', 
      'knowledge', 'learning', 'performance', 'coordination'
    ];
    
    const exportData: ExportData = {};
    
    for (const ns of namespaces) {
      exportData[ns] = await this.list({ namespace: ns, limit: 10000 });
    }
    
    return exportData;
  }

  async importData(data: ExportData): Promise<void> {
    for (const [namespace, items] of Object.entries(data)) {
      for (const item of items) {
        await this.store(item.key, item.value, {
          namespace,
          metadata: item.metadata || undefined
        });
      }
    }
  }
}

export { EnhancedMemory };
export default EnhancedMemory;