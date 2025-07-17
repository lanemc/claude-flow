/**
 * Comprehensive TypeScript type definitions for MCP (Model Context Protocol) integration
 * Provides type safety for all MCP protocol operations and Claude Flow extensions
 */

import { ILogger } from '../core/logger.js';
import { EventEmitter } from 'node:events';

// ================================================================
// CORE MCP PROTOCOL TYPES
// ================================================================

/**
 * MCP Protocol Version specification
 */
export interface MCPProtocolVersion {
  major: number;
  minor: number;
  patch: number;
}

/**
 * MCP Error codes as defined by the specification
 */
export enum MCPErrorCode {
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  SERVER_ERROR = -32000,
  TIMEOUT = -32001,
  RATE_LIMITED = -32002,
  AUTHENTICATION_FAILED = -32003,
  AUTHORIZATION_FAILED = -32004,
  RESOURCE_NOT_FOUND = -32005,
  RESOURCE_CONFLICT = -32006,
  VALIDATION_ERROR = -32007,
  CAPABILITY_NOT_SUPPORTED = -32008,
  PROTOCOL_VERSION_MISMATCH = -32009,
  SESSION_EXPIRED = -32010,
  RESOURCE_LOCKED = -32011,
  QUOTA_EXCEEDED = -32012
}

/**
 * MCP Error interface
 */
export interface MCPError {
  code: MCPErrorCode;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 base interface
 */
export interface JSONRPCBase {
  jsonrpc: '2.0';
}

/**
 * JSON-RPC 2.0 Request
 */
export interface JSONRPCRequest extends JSONRPCBase {
  id: string | number;
  method: string;
  params?: unknown;
}

/**
 * JSON-RPC 2.0 Response
 */
export interface JSONRPCResponse extends JSONRPCBase {
  id: string | number;
  result?: unknown;
  error?: MCPError;
}

/**
 * JSON-RPC 2.0 Notification
 */
export interface JSONRPCNotification extends JSONRPCBase {
  method: string;
  params?: unknown;
}

/**
 * Union type for all JSON-RPC message types
 */
export type JSONRPCMessage = JSONRPCRequest | JSONRPCResponse | JSONRPCNotification;

// ================================================================
// MCP CAPABILITIES AND FEATURES
// ================================================================

/**
 * Client capabilities for MCP
 */
export interface MCPClientCapabilities {
  sampling?: {
    [key: string]: unknown;
  };
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
  };
  tools?: {
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    listChanged?: boolean;
    subscribe?: boolean;
  };
  experiments?: {
    [key: string]: boolean;
  };
}

/**
 * Server capabilities for MCP
 */
export interface MCPServerCapabilities {
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
  };
  tools?: {
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    listChanged?: boolean;
    subscribe?: boolean;
  };
  sampling?: {
    [key: string]: unknown;
  };
  experiments?: {
    [key: string]: boolean;
  };
}

/**
 * MCP Capabilities union type
 */
export type MCPCapabilities = MCPClientCapabilities | MCPServerCapabilities;

// ================================================================
// MCP INITIALIZATION
// ================================================================

/**
 * Client info for MCP initialization
 */
export interface MCPClientInfo {
  name: string;
  version: string;
}

/**
 * Server info for MCP initialization
 */
export interface MCPServerInfo {
  name: string;
  version: string;
}

/**
 * MCP Initialize request parameters
 */
export interface MCPInitializeParams {
  protocolVersion: MCPProtocolVersion;
  capabilities: MCPClientCapabilities;
  clientInfo: MCPClientInfo;
}

/**
 * MCP Initialize response result
 */
export interface MCPInitializeResult {
  protocolVersion: MCPProtocolVersion;
  capabilities: MCPServerCapabilities;
  serverInfo: MCPServerInfo;
  instructions?: string;
}

// ================================================================
// MCP TOOL SYSTEM
// ================================================================

/**
 * JSON Schema for tool input validation
 */
export interface JSONSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  description?: string;
  default?: unknown;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  additionalProperties?: boolean | JSONSchema;
  oneOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  allOf?: JSONSchema[];
  not?: JSONSchema;
}

/**
 * MCP Tool definition
 */
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  handler: (input: unknown, context?: MCPContext) => Promise<unknown>;
}

/**
 * MCP Tool result content types
 */
export interface MCPToolContent {
  type: 'text' | 'image' | 'resource' | 'blob';
  text?: string;
  data?: string;
  blob?: Uint8Array;
  mimeType?: string;
  name?: string;
  uri?: string;
}

/**
 * MCP Tool execution result
 */
export interface MCPToolResult {
  content: MCPToolContent[];
  isError?: boolean;
  meta?: Record<string, unknown>;
}

/**
 * MCP Tool call parameters
 */
export interface MCPToolCallParams {
  name: string;
  arguments?: Record<string, unknown>;
}

/**
 * MCP List Tools result
 */
export interface MCPListToolsResult {
  tools: Array<{
    name: string;
    description: string;
    inputSchema: JSONSchema;
  }>;
}

// ================================================================
// MCP PROMPT SYSTEM
// ================================================================

/**
 * MCP Prompt argument definition
 */
export interface MCPPromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

/**
 * MCP Prompt definition
 */
export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: MCPPromptArgument[];
}

/**
 * MCP Get Prompt parameters
 */
export interface MCPGetPromptParams {
  name: string;
  arguments?: Record<string, string>;
}

/**
 * MCP Prompt message
 */
export interface MCPPromptMessage {
  role: 'user' | 'assistant' | 'system';
  content: {
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    uri?: string;
  };
}

/**
 * MCP Get Prompt result
 */
export interface MCPGetPromptResult {
  description?: string;
  messages: MCPPromptMessage[];
}

/**
 * MCP List Prompts result
 */
export interface MCPListPromptsResult {
  prompts: MCPPrompt[];
}

// ================================================================
// MCP RESOURCE SYSTEM
// ================================================================

/**
 * MCP Resource definition
 */
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  annotations?: {
    audience?: string[];
    priority?: number;
  };
}

/**
 * MCP Resource content
 */
export interface MCPResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: Uint8Array;
}

/**
 * MCP Read Resource parameters
 */
export interface MCPReadResourceParams {
  uri: string;
}

/**
 * MCP Read Resource result
 */
export interface MCPReadResourceResult {
  contents: MCPResourceContent[];
}

/**
 * MCP List Resources result
 */
export interface MCPListResourcesResult {
  resources: MCPResource[];
}

/**
 * MCP Subscribe to Resource parameters
 */
export interface MCPSubscribeResourceParams {
  uri: string;
}

/**
 * MCP Unsubscribe from Resource parameters
 */
export interface MCPUnsubscribeResourceParams {
  uri: string;
}

/**
 * MCP Resource List Changed notification
 */
export interface MCPResourceListChangedNotification {
  method: 'notifications/resources/list_changed';
  params?: unknown;
}

/**
 * MCP Resource Updated notification
 */
export interface MCPResourceUpdatedNotification {
  method: 'notifications/resources/updated';
  params: {
    uri: string;
  };
}

// ================================================================
// MCP LOGGING SYSTEM
// ================================================================

/**
 * MCP Log levels
 */
export type MCPLogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * MCP Log entry
 */
export interface MCPLogEntry {
  level: MCPLogLevel;
  data?: unknown;
  logger?: string;
}

/**
 * MCP Logging notification
 */
export interface MCPLoggingNotification {
  method: 'notifications/message';
  params: MCPLogEntry;
}

// ================================================================
// MCP SAMPLING SYSTEM
// ================================================================

/**
 * MCP Sampling request parameters
 */
export interface MCPSamplingParams {
  messages: MCPPromptMessage[];
  systemPrompt?: string;
  includeContext?: string;
  temperature?: number;
  maxTokens?: number;
  modelPreferences?: {
    hints?: Array<{
      name?: string;
    }>;
    costPriority?: number;
    speedPriority?: number;
    intelligencePriority?: number;
  };
  metadata?: Record<string, unknown>;
}

/**
 * MCP Sampling result
 */
export interface MCPSamplingResult {
  model: string;
  stopReason?: 'endTurn' | 'stopSequence' | 'maxTokens' | 'error';
  role: 'assistant';
  content: {
    type: 'text';
    text: string;
  };
}

// ================================================================
// MCP NOTIFICATIONS
// ================================================================

/**
 * MCP Cancelled notification
 */
export interface MCPCancelledNotification {
  method: 'notifications/cancelled';
  params: {
    requestId: string | number;
    reason?: string;
  };
}

/**
 * MCP Progress notification
 */
export interface MCPProgressNotification {
  method: 'notifications/progress';
  params: {
    progressToken: string | number;
    progress?: number;
    total?: number;
  };
}

/**
 * MCP Initialized notification
 */
export interface MCPInitializedNotification {
  method: 'notifications/initialized';
  params?: unknown;
}

/**
 * Union type for all MCP notifications
 */
export type MCPNotification = 
  | MCPResourceListChangedNotification
  | MCPResourceUpdatedNotification
  | MCPLoggingNotification
  | MCPCancelledNotification
  | MCPProgressNotification
  | MCPInitializedNotification;

// ================================================================
// MCP TRANSPORT LAYER
// ================================================================

/**
 * MCP Transport types
 */
export type MCPTransportType = 'stdio' | 'http' | 'websocket' | 'sse';

/**
 * Base MCP Transport interface
 */
export interface MCPTransport {
  type: MCPTransportType;
  send(message: JSONRPCMessage): Promise<void>;
  close(): Promise<void>;
  onMessage(handler: (message: JSONRPCMessage) => void): void;
  onClose(handler: () => void): void;
  onError(handler: (error: Error) => void): void;
}

/**
 * STDIO Transport configuration
 */
export interface MCPStdioTransportConfig {
  type: 'stdio';
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  timeout?: number;
}

/**
 * HTTP Transport configuration
 */
export interface MCPHttpTransportConfig {
  type: 'http';
  url: string;
  method?: 'POST' | 'GET';
  headers?: Record<string, string>;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * WebSocket Transport configuration
 */
export interface MCPWebSocketTransportConfig {
  type: 'websocket';
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  timeout?: number;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

/**
 * Server-Sent Events Transport configuration
 */
export interface MCPSSETransportConfig {
  type: 'sse';
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

/**
 * Union type for all transport configurations
 */
export type MCPTransportConfig = 
  | MCPStdioTransportConfig
  | MCPHttpTransportConfig
  | MCPWebSocketTransportConfig
  | MCPSSETransportConfig;

// ================================================================
// MCP SESSION MANAGEMENT
// ================================================================

/**
 * MCP Session state
 */
export type MCPSessionState = 'disconnected' | 'connecting' | 'connected' | 'initializing' | 'initialized' | 'error';

/**
 * MCP Session interface
 */
export interface MCPSession {
  id: string;
  state: MCPSessionState;
  transport: MCPTransport;
  clientInfo?: MCPClientInfo;
  serverInfo?: MCPServerInfo;
  protocolVersion?: MCPProtocolVersion;
  clientCapabilities?: MCPClientCapabilities;
  serverCapabilities?: MCPServerCapabilities;
  createdAt: Date;
  lastActivity: Date;
  metadata?: Record<string, unknown>;
}

// ================================================================
// MCP CONTEXT AND EXECUTION
// ================================================================

/**
 * MCP Execution context
 */
export interface MCPContext {
  sessionId: string;
  requestId?: string | number;
  agentId?: string;
  userId?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
  logger?: ILogger;
  protocolVersion?: MCPProtocolVersion;
  capabilities?: MCPCapabilities;
  timeout?: number;
  cancellationToken?: AbortSignal;
}

/**
 * MCP Request context with additional Claude Flow extensions
 */
export interface MCPRequestContext extends MCPContext {
  timestamp: Date;
  source: 'client' | 'server';
  method: string;
  params?: unknown;
  headers?: Record<string, string>;
  route?: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    resetTime: Date;
  };
}

// ================================================================
// MCP AUTHENTICATION AND AUTHORIZATION
// ================================================================

/**
 * MCP Authentication methods
 */
export type MCPAuthMethod = 'none' | 'token' | 'basic' | 'bearer' | 'oauth' | 'jwt' | 'custom';

/**
 * MCP Authentication configuration
 */
export interface MCPAuthConfig {
  method: MCPAuthMethod;
  token?: string;
  username?: string;
  password?: string;
  bearerToken?: string;
  jwtSecret?: string;
  customAuth?: (context: MCPContext) => Promise<boolean>;
  sessionTimeout?: number;
  refreshToken?: string;
  scopes?: string[];
}

/**
 * MCP User permissions
 */
export interface MCPPermissions {
  tools?: string[];
  prompts?: string[];
  resources?: string[];
  admin?: boolean;
  rateLimit?: {
    requestsPerMinute: number;
    burstLimit: number;
  };
}

/**
 * MCP Authentication result
 */
export interface MCPAuthResult {
  authenticated: boolean;
  userId?: string;
  permissions?: MCPPermissions;
  sessionToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

// ================================================================
// MCP METRICS AND MONITORING
// ================================================================

/**
 * MCP Performance metrics
 */
export interface MCPMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    cancelled: number;
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
  };
  tools: {
    invocations: Record<string, number>;
    averageExecutionTime: Record<string, number>;
    errorRate: Record<string, number>;
  };
  prompts: {
    invocations: Record<string, number>;
    averageExecutionTime: Record<string, number>;
    errorRate: Record<string, number>;
  };
  resources: {
    reads: Record<string, number>;
    subscriptions: Record<string, number>;
    errorRate: Record<string, number>;
  };
  sessions: {
    active: number;
    total: number;
    averageDuration: number;
  };
  transport: {
    messagesSent: number;
    messagesReceived: number;
    bytesTransferred: number;
    connectionErrors: number;
  };
  errors: Record<string, number>;
  timestamp: Date;
}

/**
 * MCP Health check result
 */
export interface MCPHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    transport: 'healthy' | 'degraded' | 'unhealthy';
    authentication: 'healthy' | 'degraded' | 'unhealthy';
    tools: 'healthy' | 'degraded' | 'unhealthy';
    prompts: 'healthy' | 'degraded' | 'unhealthy';
    resources: 'healthy' | 'degraded' | 'unhealthy';
    memory: 'healthy' | 'degraded' | 'unhealthy';
  };
  metrics: MCPMetrics;
  timestamp: Date;
  uptime: number;
}

// ================================================================
// MCP CONFIGURATION
// ================================================================

/**
 * MCP Server configuration
 */
export interface MCPServerConfig {
  name: string;
  version: string;
  description?: string;
  transport: MCPTransportConfig;
  auth?: MCPAuthConfig;
  capabilities?: MCPServerCapabilities;
  tools?: MCPTool[];
  prompts?: MCPPrompt[];
  resources?: MCPResource[];
  logging?: {
    level: MCPLogLevel;
    format: 'json' | 'text';
    destination: 'console' | 'file' | 'both';
    filePath?: string;
  };
  limits?: {
    maxSessions: number;
    maxRequestsPerSession: number;
    maxRequestSize: number;
    maxResponseSize: number;
    requestTimeout: number;
    sessionTimeout: number;
  };
  cors?: {
    enabled: boolean;
    origins: string[];
    methods: string[];
    headers: string[];
  };
  rateLimit?: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
    windowMs: number;
  };
  monitoring?: {
    enabled: boolean;
    metricsInterval: number;
    healthCheckInterval: number;
  };
  middleware?: Array<(context: MCPContext, next: () => Promise<void>) => Promise<void>>;
}

/**
 * MCP Client configuration
 */
export interface MCPClientConfig {
  name: string;
  version: string;
  transport: MCPTransportConfig;
  auth?: MCPAuthConfig;
  capabilities?: MCPClientCapabilities;
  timeout?: number;
  retryPolicy?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  logging?: {
    level: MCPLogLevel;
    enabled: boolean;
  };
  middleware?: Array<(context: MCPContext, next: () => Promise<void>) => Promise<void>>;
}

// ================================================================
// MCP EVENTS AND HOOKS
// ================================================================

/**
 * MCP Event types
 */
export type MCPEventType = 
  | 'session:created'
  | 'session:initialized'
  | 'session:closed'
  | 'session:error'
  | 'tool:called'
  | 'tool:completed'
  | 'tool:failed'
  | 'prompt:called'
  | 'prompt:completed'
  | 'prompt:failed'
  | 'resource:read'
  | 'resource:subscribed'
  | 'resource:unsubscribed'
  | 'resource:updated'
  | 'message:sent'
  | 'message:received'
  | 'error:occurred'
  | 'metrics:collected';

/**
 * MCP Event data
 */
export interface MCPEvent {
  type: MCPEventType;
  sessionId: string;
  timestamp: Date;
  data: unknown;
  metadata?: Record<string, unknown>;
}

/**
 * MCP Event emitter interface
 */
export interface MCPEventEmitter extends EventEmitter {
  emit(event: MCPEventType, data: MCPEvent): boolean;
  on(event: MCPEventType, listener: (data: MCPEvent) => void): this;
  once(event: MCPEventType, listener: (data: MCPEvent) => void): this;
  off(event: MCPEventType, listener: (data: MCPEvent) => void): this;
}

// ================================================================
// MCP UTILITY TYPES
// ================================================================

/**
 * Type guard for MCP requests
 */
export function isMCPRequest(message: JSONRPCMessage): message is JSONRPCRequest {
  return 'id' in message && 'method' in message;
}

/**
 * Type guard for MCP responses
 */
export function isMCPResponse(message: JSONRPCMessage): message is JSONRPCResponse {
  return 'id' in message && ('result' in message || 'error' in message);
}

/**
 * Type guard for MCP notifications
 */
export function isMCPNotification(message: JSONRPCMessage): message is JSONRPCNotification {
  return 'method' in message && !('id' in message);
}

/**
 * Type guard for MCP errors
 */
export function isMCPError(obj: unknown): obj is MCPError {
  return typeof obj === 'object' && obj !== null && 'code' in obj && 'message' in obj;
}

/**
 * Utility type for extracting tool names from a tool array
 */
export type ExtractToolNames<T extends readonly MCPTool[]> = T[number]['name'];

/**
 * Utility type for extracting prompt names from a prompt array
 */
export type ExtractPromptNames<T extends readonly MCPPrompt[]> = T[number]['name'];

/**
 * Utility type for making all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Utility type for making all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Utility type for extracting the return type of a tool handler
 */
export type ToolHandlerReturnType<T extends MCPTool> = 
  T['handler'] extends (input: any, context?: any) => Promise<infer R> ? R : never;

// ================================================================
// MCP EXTENSIONS FOR CLAUDE FLOW
// ================================================================

/**
 * Claude Flow specific MCP extensions
 */
export interface ClaudeFlowMCPExtensions {
  swarm?: {
    enabled: boolean;
    agentTypes: string[];
    coordinationMode: 'hierarchical' | 'mesh' | 'ring' | 'star';
    maxAgents: number;
  };
  memory?: {
    enabled: boolean;
    backend: 'sqlite' | 'markdown' | 'hybrid';
    namespace: string;
    ttl?: number;
  };
  terminal?: {
    enabled: boolean;
    type: 'vscode' | 'native' | 'auto';
    poolSize: number;
  };
  neural?: {
    enabled: boolean;
    models: string[];
    trainingMode: 'online' | 'offline' | 'hybrid';
  };
}

/**
 * Extended MCP Context with Claude Flow features
 */
export interface ClaudeFlowMCPContext extends MCPContext {
  swarmId?: string;
  coordinationData?: Record<string, unknown>;
  memoryNamespace?: string;
  terminalId?: string;
  neuralModelId?: string;
  extensions?: ClaudeFlowMCPExtensions;
}

/**
 * Claude Flow MCP Tool with enhanced capabilities
 */
export interface ClaudeFlowMCPTool extends MCPTool {
  category?: string;
  tags?: string[];
  permissions?: string[];
  rateLimit?: {
    requestsPerMinute: number;
    burstLimit: number;
  };
  caching?: {
    enabled: boolean;
    ttl: number;
    keyGenerator?: (input: unknown) => string;
  };
  validation?: {
    enabled: boolean;
    customValidator?: (input: unknown) => Promise<boolean>;
  };
  monitoring?: {
    enabled: boolean;
    trackMetrics: boolean;
    alertOnErrors: boolean;
  };
  handler: (input: unknown, context?: ClaudeFlowMCPContext) => Promise<unknown>;
}

// ================================================================
// EXPORTED TYPES FOR CONVENIENCE
// ================================================================

/**
 * Main MCP namespace export
 */
export namespace MCP {
  // Core types
  export type ProtocolVersion = MCPProtocolVersion;
  export type Error = MCPError;
  export type Capabilities = MCPCapabilities;
  export type Context = MCPContext;
  export type Session = MCPSession;
  export type Transport = MCPTransport;
  export type TransportConfig = MCPTransportConfig;
  
  // Tool system
  export type Tool = MCPTool;
  export type ToolResult = MCPToolResult;
  export type ToolContent = MCPToolContent;
  export type ToolCall = MCPToolCallParams;
  
  // Prompt system
  export type Prompt = MCPPrompt;
  export type PromptArgument = MCPPromptArgument;
  export type PromptMessage = MCPPromptMessage;
  
  // Resource system
  export type Resource = MCPResource;
  export type ResourceContent = MCPResourceContent;
  
  // Messaging
  export type Request = JSONRPCRequest;
  export type Response = JSONRPCResponse;
  export type Notification = JSONRPCNotification;
  export type Message = JSONRPCMessage;
  
  // Configuration
  export type ServerConfig = MCPServerConfig;
  export type ClientConfig = MCPClientConfig;
  export type AuthConfig = MCPAuthConfig;
  
  // Monitoring
  export type Metrics = MCPMetrics;
  export type HealthCheck = MCPHealthCheck;
  export type Event = MCPEvent;
  
  // Claude Flow extensions
  export type ClaudeFlowContext = ClaudeFlowMCPContext;
  export type ClaudeFlowTool = ClaudeFlowMCPTool;
  export type ClaudeFlowExtensions = ClaudeFlowMCPExtensions;
}

// Default export for the main namespace
export default MCP;