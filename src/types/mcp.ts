/**
 * MCP (Model Context Protocol) type definitions
 * Unified types for all MCP-related functionality
 */

// Core MCP tool interface
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: MCPToolInputSchema;
  handler: MCPToolHandler;
}

// MCP tool handler function type
export type MCPToolHandler = (
  input: unknown,
  context?: MCPContext
) => Promise<unknown> | unknown; // Allow both sync and async handlers for testing

// MCP tool input schema
export interface MCPToolInputSchema {
  type: 'object';
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: unknown;
}

// MCP execution context
export interface MCPContext {
  sessionId?: string;
  userId?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
  logger?: unknown;
  [key: string]: unknown;
}

// MCP tool call
export interface MCPToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

// MCP tool result
export interface MCPToolResult {
  content: MCPContent[];
  isError?: boolean;
}

// MCP content types
export interface MCPContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
  uri?: string;
}

// MCP resource
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// MCP prompt
export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: MCPPromptArgument[];
}

// MCP prompt argument
export interface MCPPromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

// MCP server capabilities
export interface MCPServerCapabilities {
  tools?: boolean;
  resources?: boolean;
  prompts?: boolean;
}

// MCP server info
export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities?: MCPServerCapabilities;
}

// MCP client capabilities
export interface MCPClientCapabilities {
  tools?: boolean;
  resources?: boolean;
  prompts?: boolean;
}

// MCP initialization options
export interface MCPInitializeOptions {
  clientInfo: {
    name: string;
    version: string;
  };
  capabilities?: MCPClientCapabilities;
}

// Tool-specific result types
export interface SwarmInitResult {
  swarmId: string;
  topology: string;
  maxAgents: number;
  strategy: string;
  timestamp: number;
}

export interface AgentSpawnResult {
  agentId: string;
  type: string;
  name?: string;
  capabilities?: string[];
  status: 'active' | 'idle';
}

export interface TaskOrchestrationResult {
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgents?: string[];
  progress?: number;
  results?: unknown;
}

export interface NeuralTrainingResult {
  sessionId: string;
  agentId?: string;
  iterations: number;
  performance: {
    accuracy?: number;
    loss?: number;
    improvements?: string[];
  };
}

export interface ModelSaveResult {
  modelId: string;
  path: string;
  size: number;
  timestamp: number;
}

export interface ModelLoadResult {
  modelId: string;
  loaded: boolean;
  performance?: unknown;
}

// Union type for all tool execution results
export type MCPToolExecutionResult =
  | SwarmInitResult
  | AgentSpawnResult
  | TaskOrchestrationResult
  | NeuralTrainingResult
  | ModelSaveResult
  | ModelLoadResult
  | Record<string, unknown>; // Generic result type

// Export all types
export * from './index';