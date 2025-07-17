/**
 * Type guards and validation utilities for MCP protocol
 * Provides runtime type checking and validation for MCP messages and data structures
 */

import {
  JSONRPCMessage,
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCNotification,
  MCPError,
  MCPErrorCode,
  MCPProtocolVersion,
  MCPCapabilities,
  MCPTool,
  MCPToolResult,
  MCPToolContent,
  MCPPrompt,
  MCPPromptMessage,
  MCPResource,
  MCPResourceContent,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPContext,
  MCPSession,
  MCPLogLevel,
  MCPTransportType,
  MCPSessionState,
  MCPAuthMethod,
  JSONSchema,
  MCPClientCapabilities,
  MCPServerCapabilities,
  MCPClientInfo,
  MCPServerInfo,
  MCPEvent,
  MCPEventType
} from './types.js';

// ================================================================
// BASIC TYPE GUARDS
// ================================================================

/**
 * Checks if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Checks if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if value is an object (not null or array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

// ================================================================
// JSON-RPC TYPE GUARDS
// ================================================================

/**
 * Validates JSON-RPC 2.0 base structure
 */
export function isJSONRPCBase(value: unknown): value is { jsonrpc: '2.0' } {
  return isObject(value) && value.jsonrpc === '2.0';
}

/**
 * Type guard for JSON-RPC Request
 */
export function isJSONRPCRequest(value: unknown): value is JSONRPCRequest {
  return (
    isJSONRPCBase(value) &&
    ('id' in value && (isString(value.id) || isNumber(value.id))) &&
    ('method' in value && isString(value.method))
  );
}

/**
 * Type guard for JSON-RPC Response
 */
export function isJSONRPCResponse(value: unknown): value is JSONRPCResponse {
  return (
    isJSONRPCBase(value) &&
    ('id' in value && (isString(value.id) || isNumber(value.id))) &&
    (('result' in value) || ('error' in value && isMCPError(value.error)))
  );
}

/**
 * Type guard for JSON-RPC Notification
 */
export function isJSONRPCNotification(value: unknown): value is JSONRPCNotification {
  return (
    isJSONRPCBase(value) &&
    ('method' in value && isString(value.method)) &&
    !('id' in value)
  );
}

/**
 * Type guard for any JSON-RPC message
 */
export function isJSONRPCMessage(value: unknown): value is JSONRPCMessage {
  return (
    isJSONRPCRequest(value) ||
    isJSONRPCResponse(value) ||
    isJSONRPCNotification(value)
  );
}

// ================================================================
// MCP ERROR TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Error
 */
export function isMCPError(value: unknown): value is MCPError {
  return (
    isObject(value) &&
    'code' in value &&
    isNumber(value.code) &&
    'message' in value &&
    isString(value.message)
  );
}

/**
 * Validates MCP Error Code
 */
export function isMCPErrorCode(value: unknown): value is MCPErrorCode {
  return isNumber(value) && Object.values(MCPErrorCode).includes(value);
}

/**
 * Creates a validated MCP Error
 */
export function createMCPError(
  code: MCPErrorCode,
  message: string,
  data?: unknown
): MCPError {
  if (!isMCPErrorCode(code)) {
    throw new Error(`Invalid MCP error code: ${code}`);
  }
  if (!isString(message)) {
    throw new Error('MCP error message must be a string');
  }
  return { code, message, data };
}

// ================================================================
// MCP PROTOCOL VERSION TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Protocol Version
 */
export function isMCPProtocolVersion(value: unknown): value is MCPProtocolVersion {
  return (
    isObject(value) &&
    'major' in value &&
    isNumber(value.major) &&
    'minor' in value &&
    isNumber(value.minor) &&
    'patch' in value &&
    isNumber(value.patch)
  );
}

/**
 * Validates protocol version compatibility
 */
export function isProtocolVersionCompatible(
  client: MCPProtocolVersion,
  server: MCPProtocolVersion
): boolean {
  // Major versions must match
  if (client.major !== server.major) {
    return false;
  }
  
  // Client minor version must be <= server minor version
  if (client.minor > server.minor) {
    return false;
  }
  
  return true;
}

// ================================================================
// MCP CAPABILITIES TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Client Capabilities
 */
export function isMCPClientCapabilities(value: unknown): value is MCPClientCapabilities {
  if (!isObject(value)) return false;
  
  // Check optional properties
  if ('sampling' in value && !isObject(value.sampling)) return false;
  if ('logging' in value && !isObject(value.logging)) return false;
  if ('tools' in value && !isObject(value.tools)) return false;
  if ('prompts' in value && !isObject(value.prompts)) return false;
  if ('resources' in value && !isObject(value.resources)) return false;
  if ('experiments' in value && !isObject(value.experiments)) return false;
  
  return true;
}

/**
 * Type guard for MCP Server Capabilities
 */
export function isMCPServerCapabilities(value: unknown): value is MCPServerCapabilities {
  if (!isObject(value)) return false;
  
  // Check optional properties
  if ('logging' in value && !isObject(value.logging)) return false;
  if ('tools' in value && !isObject(value.tools)) return false;
  if ('prompts' in value && !isObject(value.prompts)) return false;
  if ('resources' in value && !isObject(value.resources)) return false;
  if ('sampling' in value && !isObject(value.sampling)) return false;
  if ('experiments' in value && !isObject(value.experiments)) return false;
  
  return true;
}

/**
 * Type guard for MCP Capabilities (union type)
 */
export function isMCPCapabilities(value: unknown): value is MCPCapabilities {
  return isMCPClientCapabilities(value) || isMCPServerCapabilities(value);
}

// ================================================================
// MCP CLIENT/SERVER INFO TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Client Info
 */
export function isMCPClientInfo(value: unknown): value is MCPClientInfo {
  return (
    isObject(value) &&
    'name' in value &&
    isString(value.name) &&
    'version' in value &&
    isString(value.version)
  );
}

/**
 * Type guard for MCP Server Info
 */
export function isMCPServerInfo(value: unknown): value is MCPServerInfo {
  return (
    isObject(value) &&
    'name' in value &&
    isString(value.name) &&
    'version' in value &&
    isString(value.version)
  );
}

// ================================================================
// MCP INITIALIZATION TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Initialize Parameters
 */
export function isMCPInitializeParams(value: unknown): value is MCPInitializeParams {
  return (
    isObject(value) &&
    'protocolVersion' in value &&
    isMCPProtocolVersion(value.protocolVersion) &&
    'capabilities' in value &&
    isMCPClientCapabilities(value.capabilities) &&
    'clientInfo' in value &&
    isMCPClientInfo(value.clientInfo)
  );
}

/**
 * Type guard for MCP Initialize Result
 */
export function isMCPInitializeResult(value: unknown): value is MCPInitializeResult {
  return (
    isObject(value) &&
    'protocolVersion' in value &&
    isMCPProtocolVersion(value.protocolVersion) &&
    'capabilities' in value &&
    isMCPServerCapabilities(value.capabilities) &&
    'serverInfo' in value &&
    isMCPServerInfo(value.serverInfo)
  );
}

// ================================================================
// JSON SCHEMA TYPE GUARDS
// ================================================================

/**
 * Type guard for JSON Schema
 */
export function isJSONSchema(value: unknown): value is JSONSchema {
  if (!isObject(value)) return false;
  
  // Must have a type
  if (!('type' in value) || !isString(value.type)) return false;
  
  const validTypes = ['object', 'array', 'string', 'number', 'boolean', 'null'];
  if (!validTypes.includes(value.type)) return false;
  
  // Validate optional properties
  if ('properties' in value && !isObject(value.properties)) return false;
  if ('items' in value && !isObject(value.items)) return false;
  if ('required' in value && !isArray(value.required)) return false;
  if ('description' in value && !isString(value.description)) return false;
  if ('enum' in value && !isArray(value.enum)) return false;
  if ('minimum' in value && !isNumber(value.minimum)) return false;
  if ('maximum' in value && !isNumber(value.maximum)) return false;
  if ('minLength' in value && !isNumber(value.minLength)) return false;
  if ('maxLength' in value && !isNumber(value.maxLength)) return false;
  if ('pattern' in value && !isString(value.pattern)) return false;
  if ('format' in value && !isString(value.format)) return false;
  
  return true;
}

// ================================================================
// MCP TOOL TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Tool Content
 */
export function isMCPToolContent(value: unknown): value is MCPToolContent {
  if (!isObject(value)) return false;
  
  // Must have a type
  if (!('type' in value) || !isString(value.type)) return false;
  
  const validTypes = ['text', 'image', 'resource', 'blob'];
  if (!validTypes.includes(value.type)) return false;
  
  // Validate optional properties based on type
  if ('text' in value && !isString(value.text)) return false;
  if ('data' in value && !isString(value.data)) return false;
  if ('blob' in value && !(value.blob instanceof Uint8Array)) return false;
  if ('mimeType' in value && !isString(value.mimeType)) return false;
  if ('name' in value && !isString(value.name)) return false;
  if ('uri' in value && !isString(value.uri)) return false;
  
  return true;
}

/**
 * Type guard for MCP Tool Result
 */
export function isMCPToolResult(value: unknown): value is MCPToolResult {
  if (!isObject(value)) return false;
  
  // Must have content array
  if (!('content' in value) || !isArray(value.content)) return false;
  
  // All content items must be valid
  for (const item of value.content) {
    if (!isMCPToolContent(item)) return false;
  }
  
  // Validate optional properties
  if ('isError' in value && !isBoolean(value.isError)) return false;
  if ('meta' in value && !isObject(value.meta)) return false;
  
  return true;
}

/**
 * Type guard for MCP Tool (without handler)
 */
export function isMCPToolDefinition(value: unknown): value is Omit<MCPTool, 'handler'> {
  return (
    isObject(value) &&
    'name' in value &&
    isString(value.name) &&
    'description' in value &&
    isString(value.description) &&
    'inputSchema' in value &&
    isJSONSchema(value.inputSchema)
  );
}

/**
 * Type guard for MCP Tool (with handler)
 */
export function isMCPTool(value: unknown): value is MCPTool {
  return (
    isMCPToolDefinition(value) &&
    'handler' in value &&
    typeof value.handler === 'function'
  );
}

// ================================================================
// MCP PROMPT TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Prompt Message
 */
export function isMCPPromptMessage(value: unknown): value is MCPPromptMessage {
  if (!isObject(value)) return false;
  
  // Must have role and content
  if (!('role' in value) || !isString(value.role)) return false;
  if (!('content' in value) || !isObject(value.content)) return false;
  
  const validRoles = ['user', 'assistant', 'system'];
  if (!validRoles.includes(value.role)) return false;
  
  // Validate content
  const content = value.content;
  if (!('type' in content) || !isString(content.type)) return false;
  
  const validContentTypes = ['text', 'image', 'resource'];
  if (!validContentTypes.includes(content.type)) return false;
  
  // Validate optional content properties
  if ('text' in content && !isString(content.text)) return false;
  if ('data' in content && !isString(content.data)) return false;
  if ('mimeType' in content && !isString(content.mimeType)) return false;
  if ('uri' in content && !isString(content.uri)) return false;
  
  return true;
}

/**
 * Type guard for MCP Prompt
 */
export function isMCPPrompt(value: unknown): value is MCPPrompt {
  if (!isObject(value)) return false;
  
  // Must have name
  if (!('name' in value) || !isString(value.name)) return false;
  
  // Validate optional properties
  if ('description' in value && !isString(value.description)) return false;
  if ('arguments' in value) {
    if (!isArray(value.arguments)) return false;
    for (const arg of value.arguments) {
      if (!isObject(arg)) return false;
      if (!('name' in arg) || !isString(arg.name)) return false;
      if ('description' in arg && !isString(arg.description)) return false;
      if ('required' in arg && !isBoolean(arg.required)) return false;
    }
  }
  
  return true;
}

// ================================================================
// MCP RESOURCE TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Resource
 */
export function isMCPResource(value: unknown): value is MCPResource {
  if (!isObject(value)) return false;
  
  // Must have uri and name
  if (!('uri' in value) || !isString(value.uri)) return false;
  if (!('name' in value) || !isString(value.name)) return false;
  
  // Validate optional properties
  if ('description' in value && !isString(value.description)) return false;
  if ('mimeType' in value && !isString(value.mimeType)) return false;
  if ('annotations' in value && !isObject(value.annotations)) return false;
  
  return true;
}

/**
 * Type guard for MCP Resource Content
 */
export function isMCPResourceContent(value: unknown): value is MCPResourceContent {
  if (!isObject(value)) return false;
  
  // Must have uri
  if (!('uri' in value) || !isString(value.uri)) return false;
  
  // Validate optional properties
  if ('mimeType' in value && !isString(value.mimeType)) return false;
  if ('text' in value && !isString(value.text)) return false;
  if ('blob' in value && !(value.blob instanceof Uint8Array)) return false;
  
  return true;
}

// ================================================================
// MCP CONTEXT TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Context
 */
export function isMCPContext(value: unknown): value is MCPContext {
  if (!isObject(value)) return false;
  
  // Must have sessionId
  if (!('sessionId' in value) || !isString(value.sessionId)) return false;
  
  // Validate optional properties
  if ('requestId' in value && !isString(value.requestId) && !isNumber(value.requestId)) return false;
  if ('agentId' in value && !isString(value.agentId)) return false;
  if ('userId' in value && !isString(value.userId)) return false;
  if ('permissions' in value && !isArray(value.permissions)) return false;
  if ('metadata' in value && !isObject(value.metadata)) return false;
  if ('protocolVersion' in value && !isMCPProtocolVersion(value.protocolVersion)) return false;
  if ('capabilities' in value && !isMCPCapabilities(value.capabilities)) return false;
  if ('timeout' in value && !isNumber(value.timeout)) return false;
  
  return true;
}

// ================================================================
// MCP SESSION TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Session State
 */
export function isMCPSessionState(value: unknown): value is MCPSessionState {
  const validStates = ['disconnected', 'connecting', 'connected', 'initializing', 'initialized', 'error'];
  return isString(value) && validStates.includes(value);
}

/**
 * Type guard for MCP Session
 */
export function isMCPSession(value: unknown): value is MCPSession {
  if (!isObject(value)) return false;
  
  // Must have required properties
  if (!('id' in value) || !isString(value.id)) return false;
  if (!('state' in value) || !isMCPSessionState(value.state)) return false;
  if (!('transport' in value) || !isObject(value.transport)) return false;
  if (!('createdAt' in value) || !(value.createdAt instanceof Date)) return false;
  if (!('lastActivity' in value) || !(value.lastActivity instanceof Date)) return false;
  
  // Validate optional properties
  if ('clientInfo' in value && !isMCPClientInfo(value.clientInfo)) return false;
  if ('serverInfo' in value && !isMCPServerInfo(value.serverInfo)) return false;
  if ('protocolVersion' in value && !isMCPProtocolVersion(value.protocolVersion)) return false;
  if ('clientCapabilities' in value && !isMCPClientCapabilities(value.clientCapabilities)) return false;
  if ('serverCapabilities' in value && !isMCPServerCapabilities(value.serverCapabilities)) return false;
  if ('metadata' in value && !isObject(value.metadata)) return false;
  
  return true;
}

// ================================================================
// MCP LOG LEVEL TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Log Level
 */
export function isMCPLogLevel(value: unknown): value is MCPLogLevel {
  const validLevels = ['debug', 'info', 'warn', 'error'];
  return isString(value) && validLevels.includes(value);
}

// ================================================================
// MCP TRANSPORT TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Transport Type
 */
export function isMCPTransportType(value: unknown): value is MCPTransportType {
  const validTypes = ['stdio', 'http', 'websocket', 'sse'];
  return isString(value) && validTypes.includes(value);
}

// ================================================================
// MCP AUTH TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Auth Method
 */
export function isMCPAuthMethod(value: unknown): value is MCPAuthMethod {
  const validMethods = ['none', 'token', 'basic', 'bearer', 'oauth', 'jwt', 'custom'];
  return isString(value) && validMethods.includes(value);
}

// ================================================================
// MCP EVENT TYPE GUARDS
// ================================================================

/**
 * Type guard for MCP Event Type
 */
export function isMCPEventType(value: unknown): value is MCPEventType {
  const validEventTypes = [
    'session:created', 'session:initialized', 'session:closed', 'session:error',
    'tool:called', 'tool:completed', 'tool:failed',
    'prompt:called', 'prompt:completed', 'prompt:failed',
    'resource:read', 'resource:subscribed', 'resource:unsubscribed', 'resource:updated',
    'message:sent', 'message:received', 'error:occurred', 'metrics:collected'
  ];
  return isString(value) && validEventTypes.includes(value);
}

/**
 * Type guard for MCP Event
 */
export function isMCPEvent(value: unknown): value is MCPEvent {
  if (!isObject(value)) return false;
  
  // Must have required properties
  if (!('type' in value) || !isMCPEventType(value.type)) return false;
  if (!('sessionId' in value) || !isString(value.sessionId)) return false;
  if (!('timestamp' in value) || !(value.timestamp instanceof Date)) return false;
  if (!('data' in value)) return false;
  
  // Validate optional properties
  if ('metadata' in value && !isObject(value.metadata)) return false;
  
  return true;
}

// ================================================================
// VALIDATION UTILITIES
// ================================================================

/**
 * Validates and normalizes a JSON-RPC message
 */
export function validateJSONRPCMessage(message: unknown): JSONRPCMessage {
  if (!isJSONRPCMessage(message)) {
    throw createMCPError(
      MCPErrorCode.INVALID_REQUEST,
      'Invalid JSON-RPC message format'
    );
  }
  return message;
}

/**
 * Validates MCP tool definition
 */
export function validateMCPTool(tool: unknown): MCPTool {
  if (!isMCPTool(tool)) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'Invalid MCP tool definition'
    );
  }
  return tool;
}

/**
 * Validates MCP prompt definition
 */
export function validateMCPPrompt(prompt: unknown): MCPPrompt {
  if (!isMCPPrompt(prompt)) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'Invalid MCP prompt definition'
    );
  }
  return prompt;
}

/**
 * Validates MCP resource definition
 */
export function validateMCPResource(resource: unknown): MCPResource {
  if (!isMCPResource(resource)) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'Invalid MCP resource definition'
    );
  }
  return resource;
}

/**
 * Validates MCP context
 */
export function validateMCPContext(context: unknown): MCPContext {
  if (!isMCPContext(context)) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'Invalid MCP context'
    );
  }
  return context;
}

/**
 * Validates MCP session
 */
export function validateMCPSession(session: unknown): MCPSession {
  if (!isMCPSession(session)) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'Invalid MCP session'
    );
  }
  return session;
}

/**
 * Validates protocol version compatibility
 */
export function validateProtocolCompatibility(
  client: MCPProtocolVersion,
  server: MCPProtocolVersion
): void {
  if (!isProtocolVersionCompatible(client, server)) {
    throw createMCPError(
      MCPErrorCode.PROTOCOL_VERSION_MISMATCH,
      `Protocol version mismatch: client ${client.major}.${client.minor}.${client.patch}, server ${server.major}.${server.minor}.${server.patch}`
    );
  }
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Safely parses JSON and validates as JSON-RPC message
 */
export function safeParseJSONRPCMessage(json: string): JSONRPCMessage {
  try {
    const parsed = JSON.parse(json);
    return validateJSONRPCMessage(parsed);
  } catch (error) {
    throw createMCPError(
      MCPErrorCode.PARSE_ERROR,
      'Failed to parse JSON-RPC message',
      { originalError: error }
    );
  }
}

/**
 * Safely stringifies JSON-RPC message
 */
export function safeStringifyJSONRPCMessage(message: JSONRPCMessage): string {
  try {
    return JSON.stringify(message);
  } catch (error) {
    throw createMCPError(
      MCPErrorCode.INTERNAL_ERROR,
      'Failed to stringify JSON-RPC message',
      { originalError: error }
    );
  }
}

/**
 * Creates a standard JSON-RPC error response
 */
export function createErrorResponse(
  id: string | number,
  error: MCPError
): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    error
  };
}

/**
 * Creates a standard JSON-RPC success response
 */
export function createSuccessResponse(
  id: string | number,
  result: unknown
): JSONRPCResponse {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

/**
 * Creates a standard JSON-RPC notification
 */
export function createNotification(
  method: string,
  params?: unknown
): JSONRPCNotification {
  return {
    jsonrpc: '2.0',
    method,
    params
  };
}

/**
 * Extracts error information from unknown error
 */
export function extractErrorInfo(error: unknown): { message: string; code: MCPErrorCode; data?: unknown } {
  if (isMCPError(error)) {
    return { message: error.message, code: error.code, data: error.data };
  }
  
  if (error instanceof Error) {
    return { message: error.message, code: MCPErrorCode.INTERNAL_ERROR, data: { stack: error.stack } };
  }
  
  return { 
    message: 'Unknown error occurred', 
    code: MCPErrorCode.INTERNAL_ERROR, 
    data: { originalError: error } 
  };
}

// ================================================================
// EXPORT DEFAULT VALIDATION SUITE
// ================================================================

/**
 * Complete validation suite for MCP protocol
 */
export const MCPValidation = {
  // Type guards
  isJSONRPCMessage,
  isJSONRPCRequest,
  isJSONRPCResponse,
  isJSONRPCNotification,
  isMCPError,
  isMCPProtocolVersion,
  isMCPCapabilities,
  isMCPTool,
  isMCPPrompt,
  isMCPResource,
  isMCPContext,
  isMCPSession,
  isMCPEvent,
  
  // Validation functions
  validateJSONRPCMessage,
  validateMCPTool,
  validateMCPPrompt,
  validateMCPResource,
  validateMCPContext,
  validateMCPSession,
  validateProtocolCompatibility,
  
  // Utility functions
  safeParseJSONRPCMessage,
  safeStringifyJSONRPCMessage,
  createErrorResponse,
  createSuccessResponse,
  createNotification,
  createMCPError,
  extractErrorInfo
};

export default MCPValidation;