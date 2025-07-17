/**
 * Serialization utilities for MCP protocol messages
 * Provides efficient serialization/deserialization with type safety and validation
 */

import {
  JSONRPCMessage,
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCNotification,
  MCPError,
  MCPErrorCode,
  MCPTool,
  MCPToolResult,
  MCPPrompt,
  MCPResource,
  MCPSession,
  MCPEvent,
  MCPContext,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPProtocolVersion,
  MCPCapabilities,
  MCPClientInfo,
  MCPServerInfo,
  MCPToolContent,
  MCPPromptMessage,
  MCPResourceContent
} from './types.js';

import {
  isJSONRPCMessage,
  isJSONRPCRequest,
  isJSONRPCResponse,
  isJSONRPCNotification,
  isMCPError,
  createMCPError,
  safeParseJSONRPCMessage,
  safeStringifyJSONRPCMessage,
  validateJSONRPCMessage
} from './type-guards.js';

// ================================================================
// SERIALIZATION OPTIONS
// ================================================================

/**
 * Serialization options for customizing behavior
 */
export interface SerializationOptions {
  /**
   * Whether to include metadata in serialized output
   */
  includeMetadata?: boolean;
  
  /**
   * Whether to compress large payloads
   */
  compress?: boolean;
  
  /**
   * Maximum size limit for serialized messages (in bytes)
   */
  maxSize?: number;
  
  /**
   * Whether to validate data before serialization
   */
  validate?: boolean;
  
  /**
   * Whether to pretty-print JSON output
   */
  prettyPrint?: boolean;
  
  /**
   * Custom replacer function for JSON.stringify
   */
  replacer?: (key: string, value: any) => any;
  
  /**
   * Custom reviver function for JSON.parse
   */
  reviver?: (key: string, value: any) => any;
  
  /**
   * Whether to include debug information
   */
  debug?: boolean;
}

/**
 * Default serialization options
 */
export const DEFAULT_SERIALIZATION_OPTIONS: SerializationOptions = {
  includeMetadata: true,
  compress: false,
  maxSize: 10 * 1024 * 1024, // 10MB
  validate: true,
  prettyPrint: false,
  debug: false
};

// ================================================================
// SERIALIZATION RESULTS
// ================================================================

/**
 * Result of serialization operation
 */
export interface SerializationResult {
  /**
   * Serialized data
   */
  data: string;
  
  /**
   * Size of serialized data in bytes
   */
  size: number;
  
  /**
   * Whether compression was applied
   */
  compressed: boolean;
  
  /**
   * Metadata about the serialization
   */
  metadata?: {
    originalSize?: number;
    compressionRatio?: number;
    serializationTime?: number;
    validationTime?: number;
  };
}

/**
 * Result of deserialization operation
 */
export interface DeserializationResult<T> {
  /**
   * Deserialized data
   */
  data: T;
  
  /**
   * Whether data was compressed
   */
  compressed: boolean;
  
  /**
   * Metadata about the deserialization
   */
  metadata?: {
    deserializationTime?: number;
    validationTime?: number;
    dataSize?: number;
  };
}

// ================================================================
// COMPRESSION UTILITIES
// ================================================================

/**
 * Simple compression using base64 encoding of gzipped data
 * In a real implementation, you would use a proper compression library
 */
async function compress(data: string): Promise<string> {
  // Placeholder for actual compression
  // In production, use libraries like 'zlib' or 'pako'
  return Buffer.from(data).toString('base64');
}

/**
 * Decompression for base64 encoded data
 */
async function decompress(data: string): Promise<string> {
  // Placeholder for actual decompression
  return Buffer.from(data, 'base64').toString();
}

// ================================================================
// CORE SERIALIZATION FUNCTIONS
// ================================================================

/**
 * Serializes a JSON-RPC message with options
 */
export async function serializeMessage(
  message: JSONRPCMessage,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  const startTime = Date.now();
  
  try {
    // Validate message if requested
    if (options.validate) {
      const validationStart = Date.now();
      validateJSONRPCMessage(message);
      const validationTime = Date.now() - validationStart;
      
      if (options.debug) {
        console.debug(`Message validation took ${validationTime}ms`);
      }
    }
    
    // Prepare serialization options
    const replacer = options.replacer || defaultReplacer;
    const space = options.prettyPrint ? 2 : 0;
    
    // Serialize to JSON
    const jsonData = JSON.stringify(message, replacer, space);
    const originalSize = Buffer.byteLength(jsonData, 'utf8');
    
    // Check size limit
    if (options.maxSize && originalSize > options.maxSize) {
      throw createMCPError(
        MCPErrorCode.VALIDATION_ERROR,
        `Message size ${originalSize} exceeds maximum ${options.maxSize}`
      );
    }
    
    // Apply compression if requested and beneficial
    let finalData = jsonData;
    let compressed = false;
    let compressionRatio = 1;
    
    if (options.compress && originalSize > 1024) { // Only compress if > 1KB
      const compressedData = await compress(jsonData);
      const compressedSize = Buffer.byteLength(compressedData, 'utf8');
      
      if (compressedSize < originalSize * 0.9) { // Only use if >10% reduction
        finalData = compressedData;
        compressed = true;
        compressionRatio = originalSize / compressedSize;
      }
    }
    
    const finalSize = Buffer.byteLength(finalData, 'utf8');
    const serializationTime = Date.now() - startTime;
    
    const result: SerializationResult = {
      data: finalData,
      size: finalSize,
      compressed
    };
    
    if (options.includeMetadata) {
      result.metadata = {
        originalSize,
        compressionRatio,
        serializationTime
      };
    }
    
    return result;
    
  } catch (error) {
    if (isMCPError(error)) {
      throw error;
    }
    
    throw createMCPError(
      MCPErrorCode.INTERNAL_ERROR,
      'Serialization failed',
      { originalError: error }
    );
  }
}

/**
 * Deserializes a JSON-RPC message with options
 */
export async function deserializeMessage<T extends JSONRPCMessage = JSONRPCMessage>(
  data: string,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<DeserializationResult<T>> {
  const startTime = Date.now();
  
  try {
    // Detect if data is compressed (simple heuristic)
    const isCompressed = !data.startsWith('{') && !data.startsWith('[');
    
    // Decompress if needed
    let jsonData = data;
    if (isCompressed) {
      jsonData = await decompress(data);
    }
    
    // Parse JSON
    const reviver = options.reviver || defaultReviver;
    const parsed = JSON.parse(jsonData, reviver);
    
    // Validate if requested
    if (options.validate) {
      const validationStart = Date.now();
      validateJSONRPCMessage(parsed);
      const validationTime = Date.now() - validationStart;
      
      if (options.debug) {
        console.debug(`Message validation took ${validationTime}ms`);
      }
    }
    
    const deserializationTime = Date.now() - startTime;
    const dataSize = Buffer.byteLength(jsonData, 'utf8');
    
    const result: DeserializationResult<T> = {
      data: parsed as T,
      compressed: isCompressed
    };
    
    if (options.includeMetadata) {
      result.metadata = {
        deserializationTime,
        dataSize
      };
    }
    
    return result;
    
  } catch (error) {
    if (isMCPError(error)) {
      throw error;
    }
    
    throw createMCPError(
      MCPErrorCode.PARSE_ERROR,
      'Deserialization failed',
      { originalError: error }
    );
  }
}

// ================================================================
// SPECIALIZED SERIALIZATION FUNCTIONS
// ================================================================

/**
 * Serializes an MCP tool definition
 */
export async function serializeTool(
  tool: MCPTool,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  // Remove the handler function for serialization
  const { handler, ...toolDefinition } = tool;
  
  return serializeMessage(toolDefinition as any, options);
}

/**
 * Serializes an MCP tool result
 */
export async function serializeToolResult(
  result: MCPToolResult,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  // Handle binary content specially
  const processedResult = {
    ...result,
    content: result.content.map(content => ({
      ...content,
      blob: content.blob ? Array.from(content.blob) : undefined
    }))
  };
  
  return serializeMessage(processedResult as any, options);
}

/**
 * Deserializes an MCP tool result
 */
export async function deserializeToolResult(
  data: string,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<DeserializationResult<MCPToolResult>> {
  const result = await deserializeMessage(data, options);
  
  // Restore binary content
  const processedResult = {
    ...result.data,
    content: (result.data as any).content.map((content: any) => ({
      ...content,
      blob: content.blob ? new Uint8Array(content.blob) : undefined
    }))
  };
  
  return {
    ...result,
    data: processedResult as MCPToolResult
  };
}

/**
 * Serializes an MCP session
 */
export async function serializeSession(
  session: MCPSession,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  // Remove non-serializable properties
  const { transport, ...sessionData } = session;
  
  const processedSession = {
    ...sessionData,
    transportType: transport.type,
    createdAt: session.createdAt.toISOString(),
    lastActivity: session.lastActivity.toISOString()
  };
  
  return serializeMessage(processedSession as any, options);
}

/**
 * Deserializes an MCP session (partial - transport needs to be restored)
 */
export async function deserializeSession(
  data: string,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<DeserializationResult<Partial<MCPSession>>> {
  const result = await deserializeMessage(data, options);
  
  // Restore Date objects
  const processedSession = {
    ...result.data,
    createdAt: new Date((result.data as any).createdAt),
    lastActivity: new Date((result.data as any).lastActivity)
  };
  
  return {
    ...result,
    data: processedSession as Partial<MCPSession>
  };
}

/**
 * Serializes an MCP event
 */
export async function serializeEvent(
  event: MCPEvent,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  const processedEvent = {
    ...event,
    timestamp: event.timestamp.toISOString()
  };
  
  return serializeMessage(processedEvent as any, options);
}

/**
 * Deserializes an MCP event
 */
export async function deserializeEvent(
  data: string,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<DeserializationResult<MCPEvent>> {
  const result = await deserializeMessage(data, options);
  
  // Restore Date object
  const processedEvent = {
    ...result.data,
    timestamp: new Date((result.data as any).timestamp)
  };
  
  return {
    ...result,
    data: processedEvent as MCPEvent
  };
}

// ================================================================
// BATCH SERIALIZATION
// ================================================================

/**
 * Serializes multiple messages in a batch
 */
export async function serializeBatch(
  messages: JSONRPCMessage[],
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<SerializationResult> {
  const startTime = Date.now();
  
  try {
    // Validate all messages if requested
    if (options.validate) {
      for (const message of messages) {
        validateJSONRPCMessage(message);
      }
    }
    
    // Serialize the batch
    const batchData = JSON.stringify(messages, options.replacer, options.prettyPrint ? 2 : 0);
    const originalSize = Buffer.byteLength(batchData, 'utf8');
    
    // Check size limit
    if (options.maxSize && originalSize > options.maxSize) {
      throw createMCPError(
        MCPErrorCode.VALIDATION_ERROR,
        `Batch size ${originalSize} exceeds maximum ${options.maxSize}`
      );
    }
    
    // Apply compression if requested
    let finalData = batchData;
    let compressed = false;
    let compressionRatio = 1;
    
    if (options.compress && originalSize > 1024) {
      const compressedData = await compress(batchData);
      const compressedSize = Buffer.byteLength(compressedData, 'utf8');
      
      if (compressedSize < originalSize * 0.9) {
        finalData = compressedData;
        compressed = true;
        compressionRatio = originalSize / compressedSize;
      }
    }
    
    const finalSize = Buffer.byteLength(finalData, 'utf8');
    const serializationTime = Date.now() - startTime;
    
    const result: SerializationResult = {
      data: finalData,
      size: finalSize,
      compressed
    };
    
    if (options.includeMetadata) {
      result.metadata = {
        originalSize,
        compressionRatio,
        serializationTime
      };
    }
    
    return result;
    
  } catch (error) {
    if (isMCPError(error)) {
      throw error;
    }
    
    throw createMCPError(
      MCPErrorCode.INTERNAL_ERROR,
      'Batch serialization failed',
      { originalError: error }
    );
  }
}

/**
 * Deserializes a batch of messages
 */
export async function deserializeBatch(
  data: string,
  options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS
): Promise<DeserializationResult<JSONRPCMessage[]>> {
  const startTime = Date.now();
  
  try {
    // Detect if data is compressed
    const isCompressed = !data.startsWith('[') && !data.startsWith('{');
    
    // Decompress if needed
    let jsonData = data;
    if (isCompressed) {
      jsonData = await decompress(data);
    }
    
    // Parse JSON
    const parsed = JSON.parse(jsonData, options.reviver);
    
    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      throw createMCPError(
        MCPErrorCode.INVALID_REQUEST,
        'Batch must be an array of messages'
      );
    }
    
    // Validate each message if requested
    if (options.validate) {
      for (const message of parsed) {
        validateJSONRPCMessage(message);
      }
    }
    
    const deserializationTime = Date.now() - startTime;
    const dataSize = Buffer.byteLength(jsonData, 'utf8');
    
    const result: DeserializationResult<JSONRPCMessage[]> = {
      data: parsed,
      compressed: isCompressed
    };
    
    if (options.includeMetadata) {
      result.metadata = {
        deserializationTime,
        dataSize
      };
    }
    
    return result;
    
  } catch (error) {
    if (isMCPError(error)) {
      throw error;
    }
    
    throw createMCPError(
      MCPErrorCode.PARSE_ERROR,
      'Batch deserialization failed',
      { originalError: error }
    );
  }
}

// ================================================================
// STREAMING SERIALIZATION
// ================================================================

/**
 * Streaming serializer for large datasets
 */
export class StreamingSerializer {
  private options: SerializationOptions;
  private buffer: string[] = [];
  private size = 0;
  
  constructor(options: SerializationOptions = DEFAULT_SERIALIZATION_OPTIONS) {
    this.options = options;
  }
  
  /**
   * Adds a message to the stream
   */
  async add(message: JSONRPCMessage): Promise<void> {
    if (this.options.validate) {
      validateJSONRPCMessage(message);
    }
    
    const serialized = JSON.stringify(message, this.options.replacer);
    this.buffer.push(serialized);
    this.size += Buffer.byteLength(serialized, 'utf8');
    
    // Check size limit
    if (this.options.maxSize && this.size > this.options.maxSize) {
      throw createMCPError(
        MCPErrorCode.VALIDATION_ERROR,
        `Stream size ${this.size} exceeds maximum ${this.options.maxSize}`
      );
    }
  }
  
  /**
   * Finalizes the stream and returns serialized data
   */
  async finalize(): Promise<SerializationResult> {
    const arrayData = '[' + this.buffer.join(',') + ']';
    const originalSize = Buffer.byteLength(arrayData, 'utf8');
    
    let finalData = arrayData;
    let compressed = false;
    let compressionRatio = 1;
    
    if (this.options.compress && originalSize > 1024) {
      const compressedData = await compress(arrayData);
      const compressedSize = Buffer.byteLength(compressedData, 'utf8');
      
      if (compressedSize < originalSize * 0.9) {
        finalData = compressedData;
        compressed = true;
        compressionRatio = originalSize / compressedSize;
      }
    }
    
    const finalSize = Buffer.byteLength(finalData, 'utf8');
    
    return {
      data: finalData,
      size: finalSize,
      compressed,
      metadata: this.options.includeMetadata ? {
        originalSize,
        compressionRatio
      } : undefined
    };
  }
  
  /**
   * Clears the stream buffer
   */
  clear(): void {
    this.buffer = [];
    this.size = 0;
  }
}

// ================================================================
// DEFAULT REPLACER/REVIVER FUNCTIONS
// ================================================================

/**
 * Default replacer function for JSON.stringify
 */
function defaultReplacer(key: string, value: any): any {
  // Handle Date objects
  if (value instanceof Date) {
    return { __type: 'Date', __value: value.toISOString() };
  }
  
  // Handle RegExp objects
  if (value instanceof RegExp) {
    return { __type: 'RegExp', __value: value.toString() };
  }
  
  // Handle Uint8Array
  if (value instanceof Uint8Array) {
    return { __type: 'Uint8Array', __value: Array.from(value) };
  }
  
  // Handle functions (exclude them)
  if (typeof value === 'function') {
    return undefined;
  }
  
  // Handle undefined
  if (value === undefined) {
    return { __type: 'undefined' };
  }
  
  // Handle BigInt
  if (typeof value === 'bigint') {
    return { __type: 'BigInt', __value: value.toString() };
  }
  
  return value;
}

/**
 * Default reviver function for JSON.parse
 */
function defaultReviver(key: string, value: any): any {
  // Handle special type objects
  if (typeof value === 'object' && value !== null && '__type' in value) {
    switch (value.__type) {
      case 'Date':
        return new Date(value.__value);
      case 'RegExp':
        const match = value.__value.match(/^\/(.+)\/([gimuy]*)$/);
        return match ? new RegExp(match[1], match[2]) : new RegExp(value.__value);
      case 'Uint8Array':
        return new Uint8Array(value.__value);
      case 'undefined':
        return undefined;
      case 'BigInt':
        return BigInt(value.__value);
    }
  }
  
  return value;
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Calculates the size of a serialized object
 */
export function calculateSize(obj: any): number {
  return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}

/**
 * Checks if compression would be beneficial
 */
export function shouldCompress(data: string, threshold = 1024): boolean {
  return Buffer.byteLength(data, 'utf8') > threshold;
}

/**
 * Validates serialization options
 */
export function validateSerializationOptions(options: SerializationOptions): void {
  if (options.maxSize && options.maxSize < 0) {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'maxSize must be positive'
    );
  }
  
  if (options.replacer && typeof options.replacer !== 'function') {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'replacer must be a function'
    );
  }
  
  if (options.reviver && typeof options.reviver !== 'function') {
    throw createMCPError(
      MCPErrorCode.VALIDATION_ERROR,
      'reviver must be a function'
    );
  }
}

// ================================================================
// EXPORT SERIALIZATION SUITE
// ================================================================

/**
 * Complete serialization suite for MCP protocol
 */
export const MCPSerialization = {
  // Core functions
  serializeMessage,
  deserializeMessage,
  serializeBatch,
  deserializeBatch,
  
  // Specialized functions
  serializeTool,
  serializeToolResult,
  deserializeToolResult,
  serializeSession,
  deserializeSession,
  serializeEvent,
  deserializeEvent,
  
  // Streaming
  StreamingSerializer,
  
  // Utilities
  calculateSize,
  shouldCompress,
  validateSerializationOptions,
  
  // Constants
  DEFAULT_SERIALIZATION_OPTIONS
};

export default MCPSerialization;