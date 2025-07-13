import { getErrorMessage } from '../utils/error-handler';
import type { 
  MCPOrchestrationConfig, 
  OrchestrationComponents,
  MCPOrchestrationIntegration as MCPOrchestrationIntegrationType
} from './types/index';
/**
 * MCP (Model Context Protocol) Module
 * Export all MCP components for easy integration
 */

// Core MCP Server
export { MCPServer } from './server';
export type { IMCPServer } from './server';
export type { MCPServer as MCPServerInterface } from './types/index';

// Lifecycle Management
export { 
  MCPLifecycleManager, 
  LifecycleState
} from './lifecycle-manager';
export type {
  LifecycleEvent,
  HealthCheckResult,
  LifecycleManagerConfig 
} from './lifecycle-manager';
export type { MCPLifecycleManager as MCPLifecycleManagerInterface } from './types/index';

// Tool Registry and Management
export { 
  ToolRegistry
} from './tools';
export type {
  ToolCapability,
  ToolMetrics,
  ToolDiscoveryQuery 
} from './tools';

// Protocol Management
export { 
  MCPProtocolManager
} from './protocol-manager';
export type {
  ProtocolVersionInfo,
  CompatibilityResult,
  NegotiationResult 
} from './protocol-manager';
export type { MCPProtocolManager as MCPProtocolManagerInterface } from './types/index';

// Authentication and Authorization
export { 
  AuthManager,
  Permissions 
} from './auth';
export type {
  IAuthManager,
  AuthResult,
  TokenValidation,
  Permission
} from './auth';

// Performance Monitoring
export { 
  MCPPerformanceMonitor
} from './performance-monitor';
export type {
  PerformanceMetrics,
  RequestMetrics,
  AlertRule,
  Alert,
  OptimizationSuggestion 
} from './performance-monitor';
export type { MCPPerformanceMonitor as MCPPerformanceMonitorInterface } from './types/index';

// Orchestration Integration
export { 
  MCPOrchestrationIntegration
} from './orchestration-integration';
export type {
  OrchestrationComponents,
  MCPOrchestrationConfig,
  IntegrationStatus 
} from './orchestration-integration';
export type { 
  MCPOrchestrationIntegration as MCPOrchestrationIntegrationInterface,
  OrchestrationComponents as OrchestrationComponentsInterface,
  MCPOrchestrationConfig as MCPOrchestrationConfigInterface 
} from './types/index';

// Transport Implementations
export { type ITransport } from './transports/base';
export { StdioTransport } from './transports/stdio';
export { HttpTransport } from './transports/http';

// Request Routing
export { RequestRouter } from './router';

// Session Management
export { SessionManager } from './session-manager';
export type { ISessionManager } from './session-manager';

// Load Balancing
export { LoadBalancer, RequestQueue } from './load-balancer';
export type { ILoadBalancer } from './load-balancer';

// Tool Implementations
export { createClaudeFlowTools } from './claude-flow-tools';
export type { ClaudeFlowToolContext } from './claude-flow-tools';
export { createSwarmTools } from './swarm-tools';
export type { SwarmToolContext } from './swarm-tools';

/**
 * MCP Integration Factory
 * Provides a simple way to create a complete MCP integration
 */
export class MCPIntegrationFactory {
  /**
   * Create a complete MCP integration with all components
   */
  static async createIntegration(config: {
    mcpConfig: import('../utils/types').MCPConfig;
    orchestrationConfig?: Partial<MCPOrchestrationConfig>;
    components?: Partial<OrchestrationComponents>;
    logger: import('../core/logger').ILogger;
  }): Promise<import('./orchestration-integration').MCPOrchestrationIntegration> {
    const { mcpConfig, orchestrationConfig = {}, components = {}, logger } = config;

    const { MCPOrchestrationIntegration: MCPOrchestrationIntegrationClass } = await import('./orchestration-integration');
    const integration = new MCPOrchestrationIntegrationClass(
      mcpConfig,
      {
        enabledIntegrations: {
          orchestrator: true,
          swarm: true,
          agents: true,
          resources: true,
          memory: true,
          monitoring: true,
          terminals: true,
        },
        autoStart: true,
        healthCheckInterval: 30000,
        reconnectAttempts: 3,
        reconnectDelay: 5000,
        enableMetrics: true,
        enableAlerts: true,
        ...orchestrationConfig,
      },
      components,
      logger,
    );

    return integration;
  }

  /**
   * Create a standalone MCP server (without orchestration integration)
   */
  static async createStandaloneServer(config: {
    mcpConfig: import('../utils/types').MCPConfig;
    logger: import('../core/logger').ILogger;
    enableLifecycleManagement?: boolean;
    enablePerformanceMonitoring?: boolean;
  }): Promise<{
    server: import('./server').MCPServer;
    lifecycleManager?: import('./lifecycle-manager').MCPLifecycleManager;
    performanceMonitor?: import('./performance-monitor').MCPPerformanceMonitor;
  }> {
    const { 
      mcpConfig, 
      logger, 
      enableLifecycleManagement = true,
      enablePerformanceMonitoring = true 
    } = config;

    const eventBus = new (await import('node:events')).EventEmitter();
    const { MCPServer: MCPServerClass } = await import('./server');
    const server = new MCPServerClass(mcpConfig, eventBus, logger);

    let lifecycleManager: import('./lifecycle-manager').MCPLifecycleManager | undefined;
    let performanceMonitor: import('./performance-monitor').MCPPerformanceMonitor | undefined;

    if (enableLifecycleManagement) {
      const { MCPLifecycleManager: MCPLifecycleManagerClass } = await import('./lifecycle-manager');
      lifecycleManager = new MCPLifecycleManagerClass(
        mcpConfig,
        logger,
        () => server,
      );
    }

    if (enablePerformanceMonitoring) {
      const { MCPPerformanceMonitor: MCPPerformanceMonitorClass } = await import('./performance-monitor');
      performanceMonitor = new MCPPerformanceMonitorClass(logger);
    }

    return {
      server,
      lifecycleManager,
      performanceMonitor,
    };
  }

  /**
   * Create a development/testing MCP setup
   */
  static async createDevelopmentSetup(logger: import('../core/logger').ILogger): Promise<{
    server: import('./server').MCPServer;
    lifecycleManager: import('./lifecycle-manager').MCPLifecycleManager;
    performanceMonitor: import('./performance-monitor').MCPPerformanceMonitor;
    protocolManager: import('./protocol-manager').MCPProtocolManager;
  }> {
    const mcpConfig: import('../utils/types').MCPConfig = {
      transport: 'stdio',
      enableMetrics: true,
      auth: {
        enabled: false,
        method: 'token',
      },
    };

    const { server, lifecycleManager, performanceMonitor } = await this.createStandaloneServer({
      mcpConfig,
      logger,
      enableLifecycleManagement: true,
      enablePerformanceMonitoring: true,
    });

    const { MCPProtocolManager: MCPProtocolManagerClass } = await import('./protocol-manager');
    const protocolManager = new MCPProtocolManagerClass(logger);

    return {
      server,
      lifecycleManager: lifecycleManager!,
      performanceMonitor: performanceMonitor!,
      protocolManager,
    };
  }
}

/**
 * Default MCP configuration for common use cases
 */
export const DefaultMCPConfigs = {
  /**
   * Development configuration with stdio transport
   */
  development: {
    transport: 'stdio' as const,
    enableMetrics: true,
    auth: {
      enabled: false,
      method: 'token' as const,
    },
  },

  /**
   * Production configuration with HTTP transport and authentication
   */
  production: {
    transport: 'http' as const,
    host: '0.0.0.0',
    port: 3000,
    tlsEnabled: true,
    enableMetrics: true,
    auth: {
      enabled: true,
      method: 'token' as const,
    },
    loadBalancer: {
      enabled: true,
      maxRequestsPerSecond: 100,
      maxConcurrentRequests: 50,
    },
    sessionTimeout: 3600000, // 1 hour
    maxSessions: 1000,
  },

  /**
   * Testing configuration with minimal features
   */
  testing: {
    transport: 'stdio' as const,
    enableMetrics: false,
    auth: {
      enabled: false,
      method: 'token' as const,
    },
  },
} as const;

/**
 * MCP Utility Functions
 */
export const MCPUtils = {
  /**
   * Validate MCP protocol version
   */
  isValidProtocolVersion(version: import('../utils/types').MCPProtocolVersion): boolean {
    return (
      typeof version.major === 'number' &&
      typeof version.minor === 'number' &&
      typeof version.patch === 'number' &&
      version.major > 0
    );
  },

  /**
   * Compare two protocol versions
   */
  compareVersions(
    a: import('../utils/types').MCPProtocolVersion,
    b: import('../utils/types').MCPProtocolVersion
  ): number {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    return a.patch - b.patch;
  },

  /**
   * Format protocol version as string
   */
  formatVersion(version: import('../utils/types').MCPProtocolVersion): string {
    return `${version.major}.${version.minor}.${version.patch}`;
  },

  /**
   * Parse protocol version from string
   */
  parseVersion(versionString: string): import('../utils/types').MCPProtocolVersion {
    const parts = versionString.split('.').map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(p => isNaN(p))) {
      throw new Error(`Invalid version string: ${versionString}`);
    }
    return {
      major: parts[0],
      minor: parts[1],
      patch: parts[2],
    };
  },

  /**
   * Generate a random session ID
   */
  generateSessionId(): string {
    return `mcp_session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  },

  /**
   * Generate a random request ID
   */
  generateRequestId(): string {
    return `mcp_req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  },
};