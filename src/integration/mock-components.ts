/**
 * Mock Components for System Integration Testing
 * These are lightweight mocks for missing components during development
 */

import { EventBus } from '../core/event-bus';
import { Logger } from '../core/logger';

export class MockConfigManager {
  private config: Record<string, unknown> = {};

  static getInstance(): MockConfigManager {
    return new MockConfigManager();
  }

  async load(): Promise<void> {
    // Mock configuration loading
    this.config = {
      agents: { maxAgents: 10 },
      swarm: { topology: 'mesh' },
      memory: { backend: 'memory' }
    };
  }

  get(path: string): unknown {
    const keys = path.split('.');
    let value = this.config;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return value;
  }

  set(path: string, value: unknown): void {
    const keys = path.split('.');
    let obj = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    obj[keys[keys.length - 1]] = value;
  }

  async initialize(): Promise<void> {
    await this.load();
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'configManager',
      healthy: true,
      message: 'Mock config manager healthy',
      timestamp: Date.now()
    });
  }
}

export class MockMemoryManager {
  private storage: Map<string, unknown> = new Map();

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  async get(key: string): Promise<unknown> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: unknown): Promise<void> {
    this.storage.set(key, value);
  }

  async delete(key: string): Promise<boolean> {
    return this.storage.delete(key);
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.storage.keys());
    if (!pattern) return allKeys;
    
    // Simple pattern matching
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'memoryManager',
      healthy: true,
      message: 'Mock memory manager healthy',
      timestamp: Date.now()
    });
  }

  getMetrics(): Promise<unknown> {
    return Promise.resolve({
      storageSize: this.storage.size,
      memoryUsage: process.memoryUsage().heapUsed
    });
  }
}

export class MockAgentManager {
  private agents: Map<string, unknown> = new Map();

  constructor(private eventBus: EventBus, private logger: Logger) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  async spawnAgent(type: string, config: Record<string, unknown>): Promise<string> {
    const agentId = `mock-agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.agents.set(agentId, {
      id: agentId,
      type,
      config,
      status: 'active',
      createdAt: new Date()
    });
    return agentId;
  }

  async terminateAgent(agentId: string): Promise<void> {
    this.agents.delete(agentId);
  }

  async listAgents(): Promise<any[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(agentId: string): Promise<unknown> {
    return this.agents.get(agentId) || null;
  }

  async sendMessage(message: unknown): Promise<unknown> {
    // Mock message sending
    return { success: true, id: `msg-${Date.now()}` };
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'agentManager',
      healthy: true,
      message: 'Mock agent manager healthy',
      timestamp: Date.now()
    });
  }

  getMetrics(): Promise<unknown> {
    return Promise.resolve({
      activeAgents: this.agents.size,
      totalAgents: this.agents.size
    });
  }
}

export class MockSwarmCoordinator {
  private swarms: Map<string, unknown> = new Map();

  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private memoryManager: MockMemoryManager
  ) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  async createSwarm(config: Record<string, unknown>): Promise<string> {
    const swarmId = `mock-swarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.swarms.set(swarmId, {
      id: swarmId,
      config,
      status: 'active',
      agents: [],
      createdAt: new Date()
    });
    return swarmId;
  }

  async getSwarmStatus(swarmId: string): Promise<unknown> {
    const swarm = this.swarms.get(swarmId);
    return swarm || null;
  }

  async spawnAgentInSwarm(swarmId: string, agentConfig: unknown): Promise<string> {
    const agentId = `mock-swarm-agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const swarm = this.swarms.get(swarmId);
    if (swarm) {
      swarm.agents.push(agentId);
    }
    return agentId;
  }

  async getSwarmAgents(swarmId: string): Promise<string[]> {
    const swarm = this.swarms.get(swarmId);
    return swarm?.agents || [];
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'swarmCoordinator',
      healthy: true,
      message: 'Mock swarm coordinator healthy',
      timestamp: Date.now()
    });
  }

  getMetrics(): Promise<unknown> {
    return Promise.resolve({
      activeSwarms: this.swarms.size,
      totalAgents: Array.from(this.swarms.values()).reduce((sum, swarm) => sum + swarm.agents.length, 0)
    });
  }
}

export class MockTaskEngine {
  private tasks: Map<string, unknown> = new Map();

  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private memoryManager: MockMemoryManager
  ) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  async createTask(taskConfig: unknown): Promise<string> {
    const taskId = `mock-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.tasks.set(taskId, {
      id: taskId,
      ...taskConfig,
      status: 'pending',
      createdAt: new Date()
    });
    return taskId;
  }

  async getTaskStatus(taskId: string): Promise<unknown> {
    return this.tasks.get(taskId) || null;
  }

  async getActiveTasks(swarmId?: string): Promise<any[]> {
    const allTasks = Array.from(this.tasks.values());
    return swarmId 
      ? allTasks.filter(task => task.swarmId === swarmId && task.status === 'active')
      : allTasks.filter(task => task.status === 'active');
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'taskEngine',
      healthy: true,
      message: 'Mock task engine healthy',
      timestamp: Date.now()
    });
  }

  getMetrics(): Promise<unknown> {
    const tasks = Array.from(this.tasks.values());
    return Promise.resolve({
      totalTasks: tasks.length,
      activeTasks: tasks.filter(t => t.status === 'active').length,
      queuedTasks: tasks.filter(t => t.status === 'pending').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length
    });
  }
}

export class MockRealTimeMonitor {
  constructor(private eventBus: EventBus, private logger: Logger) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  attachToOrchestrator(orchestrator: unknown): void {
    // Mock attachment
  }

  attachToAgentManager(agentManager: unknown): void {
    // Mock attachment
  }

  attachToSwarmCoordinator(swarmCoordinator: unknown): void {
    // Mock attachment
  }

  attachToTaskEngine(taskEngine: unknown): void {
    // Mock attachment
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'monitor',
      healthy: true,
      message: 'Mock monitor healthy',
      timestamp: Date.now()
    });
  }
}

export class MockMcpServer {
  constructor(private eventBus: EventBus, private logger: Logger) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  attachToOrchestrator(orchestrator: unknown): void {
    // Mock attachment
  }

  attachToAgentManager(agentManager: unknown): void {
    // Mock attachment
  }

  attachToSwarmCoordinator(swarmCoordinator: unknown): void {
    // Mock attachment
  }

  attachToTaskEngine(taskEngine: unknown): void {
    // Mock attachment
  }

  attachToMemoryManager(memoryManager: unknown): void {
    // Mock attachment
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'mcpServer',
      healthy: true,
      message: 'Mock MCP server healthy',
      timestamp: Date.now()
    });
  }
}

export class MockOrchestrator {
  constructor(
    private configManager: unknown,
    private eventBus: EventBus,
    private logger: Logger
  ) {}

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async shutdown(): Promise<void> {
    // Mock shutdown
  }

  setAgentManager(agentManager: unknown): void {
    // Mock setter
  }

  healthCheck(): Promise<unknown> {
    return Promise.resolve({
      component: 'orchestrator',
      healthy: true,
      message: 'Mock orchestrator healthy',
      timestamp: Date.now()
    });
  }
}