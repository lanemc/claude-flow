export class SwarmWebUIIntegration {
    constructor(ui: any);
    ui: any;
    swarmActive: boolean;
    swarmId: string | null;
    agents: Map<any, any>;
    tasks: Map<any, any>;
    /**
     * Initialize swarm integration
     */
    initializeSwarm(topology?: string, maxAgents?: number): Promise<void>;
    /**
     * Check if ruv-swarm MCP tools are available
     */
    checkSwarmAvailability(): Promise<boolean>;
    /**
     * Initialize mock swarm for demonstration
     */
    initializeMockSwarm(): void;
    /**
     * Get capabilities for different agent types
     */
    getAgentCapabilities(type: any): any;
    /**
     * Update swarm status in UI
     */
    updateSwarmStatus(): void;
    /**
     * Spawn new agent
     */
    spawnAgent(type: any, name?: null): Promise<string | null>;
    /**
     * Create new task
     */
    createTask(description: any, priority?: string, assignedTo?: null): Promise<string | null>;
    /**
     * Assign task to agent
     */
    assignTask(taskId: any, agentId: any): Promise<boolean>;
    /**
     * Complete task
     */
    completeTask(taskId: any): Promise<boolean>;
    /**
     * Get swarm metrics for display
     */
    getSwarmMetrics(): {
        swarmId: string | null;
        agents: {
            total: number;
            active: number;
            idle: number;
        };
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            pending: number;
        };
        efficiency: number;
    } | null;
    /**
     * Stop swarm
     */
    stopSwarm(): Promise<void>;
}
export default SwarmWebUIIntegration;
//# sourceMappingURL=swarm-webui-integration.d.ts.map