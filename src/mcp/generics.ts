/**
 * Generic utility types and functions for MCP protocol
 * Provides type-safe generic operations and utilities for extensibility
 */

import {
  MCPTool,
  MCPPrompt,
  MCPResource,
  MCPContext,
  MCPSession,
  MCPEvent,
  MCPToolResult,
  MCPPromptMessage,
  MCPResourceContent,
  JSONRPCMessage,
  JSONRPCRequest,
  JSONRPCResponse,
  MCPError,
  MCPErrorCode,
  MCPCapabilities,
  MCPProtocolVersion,
  JSONSchema,
  MCPEventType,
  MCPLogLevel,
  MCPTransportType,
  MCPAuthMethod,
  MCPSessionState
} from './types.js';

import { createMCPError, isMCPError } from './type-guards.js';

// ================================================================
// GENERIC UTILITY TYPES
// ================================================================

/**
 * Utility type for extracting keys from an object type
 */
export type Keys<T> = keyof T;

/**
 * Utility type for extracting values from an object type
 */
export type Values<T> = T[keyof T];

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
 * Utility type for picking properties by type
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * Utility type for omitting properties by type
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * Utility type for creating a union from array elements
 */
export type ArrayElement<T extends readonly unknown[]> = T[number];

/**
 * Utility type for creating a type from enum values
 */
export type EnumValues<T extends Record<string, string | number>> = T[keyof T];

/**
 * Utility type for extracting function parameters
 */
export type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * Utility type for extracting function return type
 */
export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

/**
 * Utility type for extracting Promise value type
 */
export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

/**
 * Utility type for creating a branded type
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Utility type for creating a nominal type
 */
export type Nominal<T, K extends string> = T & { __nominal: K };

// ================================================================
// MCP-SPECIFIC GENERIC TYPES
// ================================================================

/**
 * Generic MCP handler function type
 */
export type MCPHandler<TInput = unknown, TOutput = unknown, TContext extends MCPContext = MCPContext> = (
  input: TInput,
  context?: TContext
) => Promise<TOutput>;

/**
 * Generic MCP tool with typed input/output
 */
export interface TypedMCPTool<
  TName extends string = string,
  TInput = unknown,
  TOutput = unknown,
  TContext extends MCPContext = MCPContext
> extends Omit<MCPTool, 'name' | 'handler'> {
  name: TName;
  handler: MCPHandler<TInput, TOutput, TContext>;
}

/**
 * Generic MCP prompt with typed arguments
 */
export interface TypedMCPPrompt<
  TName extends string = string,
  TArgs extends Record<string, any> = Record<string, any>
> extends Omit<MCPPrompt, 'name'> {
  name: TName;
  arguments?: Array<{
    name: keyof TArgs;
    description?: string;
    required?: boolean;
  }>;
}

/**
 * Generic MCP resource with typed content
 */
export interface TypedMCPResource<
  TUri extends string = string,
  TContent = unknown
> extends Omit<MCPResource, 'uri'> {
  uri: TUri;
  content?: TContent;
}

/**
 * Generic MCP session with typed metadata
 */
export interface TypedMCPSession<
  TMetadata extends Record<string, any> = Record<string, any>
> extends Omit<MCPSession, 'metadata'> {
  metadata?: TMetadata;
}

/**
 * Generic MCP event with typed data
 */
export interface TypedMCPEvent<
  TType extends MCPEventType = MCPEventType,
  TData = unknown,
  TMetadata extends Record<string, any> = Record<string, any>
> extends Omit<MCPEvent, 'type' | 'data' | 'metadata'> {
  type: TType;
  data: TData;
  metadata?: TMetadata;
}

/**
 * Generic MCP context with typed metadata
 */
export interface TypedMCPContext<
  TMetadata extends Record<string, any> = Record<string, any>
> extends Omit<MCPContext, 'metadata'> {
  metadata?: TMetadata;
}

/**
 * Generic JSON-RPC request with typed parameters
 */
export interface TypedJSONRPCRequest<
  TMethod extends string = string,
  TParams = unknown
> extends Omit<JSONRPCRequest, 'method' | 'params'> {
  method: TMethod;
  params?: TParams;
}

/**
 * Generic JSON-RPC response with typed result
 */
export interface TypedJSONRPCResponse<
  TResult = unknown
> extends Omit<JSONRPCResponse, 'result'> {
  result?: TResult;
}

// ================================================================
// GENERIC COLLECTIONS
// ================================================================

/**
 * Generic registry for MCP components
 */
export class MCPRegistry<T> {
  private items = new Map<string, T>();
  private metadata = new Map<string, Record<string, any>>();
  
  /**
   * Registers an item with optional metadata
   */
  register(name: string, item: T, metadata?: Record<string, any>): void {
    this.items.set(name, item);
    if (metadata) {
      this.metadata.set(name, metadata);
    }
  }
  
  /**
   * Unregisters an item
   */
  unregister(name: string): boolean {
    this.metadata.delete(name);
    return this.items.delete(name);
  }
  
  /**
   * Gets an item by name
   */
  get(name: string): T | undefined {
    return this.items.get(name);
  }
  
  /**
   * Gets metadata for an item
   */
  getMetadata(name: string): Record<string, any> | undefined {
    return this.metadata.get(name);
  }
  
  /**
   * Checks if an item exists
   */
  has(name: string): boolean {
    return this.items.has(name);
  }
  
  /**
   * Lists all registered names
   */
  list(): string[] {
    return Array.from(this.items.keys());
  }
  
  /**
   * Gets all items as an array
   */
  getAll(): Array<{ name: string; item: T; metadata?: Record<string, any> }> {
    return Array.from(this.items.entries()).map(([name, item]) => ({
      name,
      item,
      metadata: this.metadata.get(name)
    }));
  }
  
  /**
   * Clears all items
   */
  clear(): void {
    this.items.clear();
    this.metadata.clear();
  }
  
  /**
   * Gets the number of registered items
   */
  size(): number {
    return this.items.size;
  }
  
  /**
   * Executes a function for each item
   */
  forEach(callback: (item: T, name: string, metadata?: Record<string, any>) => void): void {
    for (const [name, item] of this.items) {
      callback(item, name, this.metadata.get(name));
    }
  }
  
  /**
   * Filters items by a predicate
   */
  filter(predicate: (item: T, name: string, metadata?: Record<string, any>) => boolean): Array<{ name: string; item: T; metadata?: Record<string, any> }> {
    const results: Array<{ name: string; item: T; metadata?: Record<string, any> }> = [];
    
    for (const [name, item] of this.items) {
      const metadata = this.metadata.get(name);
      if (predicate(item, name, metadata)) {
        results.push({ name, item, metadata });
      }
    }
    
    return results;
  }
  
  /**
   * Maps items to a new array
   */
  map<U>(mapper: (item: T, name: string, metadata?: Record<string, any>) => U): U[] {
    const results: U[] = [];
    
    for (const [name, item] of this.items) {
      const metadata = this.metadata.get(name);
      results.push(mapper(item, name, metadata));
    }
    
    return results;
  }
  
  /**
   * Finds the first item matching a predicate
   */
  find(predicate: (item: T, name: string, metadata?: Record<string, any>) => boolean): { name: string; item: T; metadata?: Record<string, any> } | undefined {
    for (const [name, item] of this.items) {
      const metadata = this.metadata.get(name);
      if (predicate(item, name, metadata)) {
        return { name, item, metadata };
      }
    }
    return undefined;
  }
}

/**
 * Generic cache for MCP operations
 */
export class MCPCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number; ttl?: number }>();
  private defaultTTL: number;
  
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }
  
  /**
   * Sets a value in the cache
   */
  set(key: K, value: V, ttl?: number): void {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    };
    this.cache.set(key, entry);
  }
  
  /**
   * Gets a value from the cache
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    // Check if expired
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }
  
  /**
   * Checks if a key exists in the cache
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
  
  /**
   * Deletes a value from the cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clears all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Gets the number of cached items
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Cleans up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Gets all keys
   */
  keys(): K[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Gets all values (non-expired)
   */
  values(): V[] {
    const values: V[] = [];
    for (const key of this.cache.keys()) {
      const value = this.get(key);
      if (value !== undefined) {
        values.push(value);
      }
    }
    return values;
  }
}

/**
 * Generic queue for MCP operations
 */
export class MCPQueue<T> {
  private queue: T[] = [];
  private processing = false;
  private processor?: (item: T) => Promise<void>;
  
  constructor(processor?: (item: T) => Promise<void>) {
    this.processor = processor;
  }
  
  /**
   * Adds an item to the queue
   */
  enqueue(item: T): void {
    this.queue.push(item);
    if (this.processor && !this.processing) {
      this.process();
    }
  }
  
  /**
   * Removes and returns the first item from the queue
   */
  dequeue(): T | undefined {
    return this.queue.shift();
  }
  
  /**
   * Peeks at the first item without removing it
   */
  peek(): T | undefined {
    return this.queue[0];
  }
  
  /**
   * Checks if the queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }
  
  /**
   * Gets the number of items in the queue
   */
  size(): number {
    return this.queue.length;
  }
  
  /**
   * Clears all items from the queue
   */
  clear(): void {
    this.queue = [];
  }
  
  /**
   * Processes all items in the queue
   */
  private async process(): Promise<void> {
    if (this.processing || !this.processor) return;
    
    this.processing = true;
    
    try {
      while (!this.isEmpty()) {
        const item = this.dequeue();
        if (item) {
          await this.processor(item);
        }
      }
    } finally {
      this.processing = false;
    }
  }
  
  /**
   * Sets a new processor function
   */
  setProcessor(processor: (item: T) => Promise<void>): void {
    this.processor = processor;
    if (!this.processing && !this.isEmpty()) {
      this.process();
    }
  }
  
  /**
   * Converts the queue to an array
   */
  toArray(): T[] {
    return [...this.queue];
  }
}

// ================================================================
// GENERIC BUILDERS
// ================================================================

/**
 * Generic builder for MCP tools
 */
export class MCPToolBuilder<
  TName extends string = string,
  TInput = unknown,
  TOutput = unknown,
  TContext extends MCPContext = MCPContext
> {
  private tool: Partial<TypedMCPTool<TName, TInput, TOutput, TContext>> = {};
  
  /**
   * Sets the tool name
   */
  name<NewName extends string>(name: NewName): MCPToolBuilder<NewName, TInput, TOutput, TContext> {
    this.tool.name = name as any;
    return this as any;
  }
  
  /**
   * Sets the tool description
   */
  description(description: string): this {
    this.tool.description = description;
    return this;
  }
  
  /**
   * Sets the input schema
   */
  inputSchema(schema: JSONSchema): this {
    this.tool.inputSchema = schema;
    return this;
  }
  
  /**
   * Sets the handler function
   */
  handler(handler: MCPHandler<TInput, TOutput, TContext>): this {
    this.tool.handler = handler;
    return this;
  }
  
  /**
   * Builds the tool
   */
  build(): TypedMCPTool<TName, TInput, TOutput, TContext> {
    if (!this.tool.name) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Tool name is required');
    }
    if (!this.tool.description) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Tool description is required');
    }
    if (!this.tool.inputSchema) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Tool input schema is required');
    }
    if (!this.tool.handler) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Tool handler is required');
    }
    
    return this.tool as TypedMCPTool<TName, TInput, TOutput, TContext>;
  }
}

/**
 * Generic builder for MCP prompts
 */
export class MCPPromptBuilder<
  TName extends string = string,
  TArgs extends Record<string, any> = Record<string, any>
> {
  private prompt: Partial<TypedMCPPrompt<TName, TArgs>> = {};
  
  /**
   * Sets the prompt name
   */
  name<NewName extends string>(name: NewName): MCPPromptBuilder<NewName, TArgs> {
    this.prompt.name = name as any;
    return this as any;
  }
  
  /**
   * Sets the prompt description
   */
  description(description: string): this {
    this.prompt.description = description;
    return this;
  }
  
  /**
   * Adds an argument
   */
  argument<K extends keyof TArgs>(name: K, description?: string, required?: boolean): this {
    if (!this.prompt.arguments) {
      this.prompt.arguments = [];
    }
    
    this.prompt.arguments.push({
      name,
      description,
      required
    });
    
    return this;
  }
  
  /**
   * Builds the prompt
   */
  build(): TypedMCPPrompt<TName, TArgs> {
    if (!this.prompt.name) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Prompt name is required');
    }
    
    return this.prompt as TypedMCPPrompt<TName, TArgs>;
  }
}

/**
 * Generic builder for MCP resources
 */
export class MCPResourceBuilder<
  TUri extends string = string,
  TContent = unknown
> {
  private resource: Partial<TypedMCPResource<TUri, TContent>> = {};
  
  /**
   * Sets the resource URI
   */
  uri<NewUri extends string>(uri: NewUri): MCPResourceBuilder<NewUri, TContent> {
    this.resource.uri = uri as any;
    return this as any;
  }
  
  /**
   * Sets the resource name
   */
  name(name: string): this {
    this.resource.name = name;
    return this;
  }
  
  /**
   * Sets the resource description
   */
  description(description: string): this {
    this.resource.description = description;
    return this;
  }
  
  /**
   * Sets the resource MIME type
   */
  mimeType(mimeType: string): this {
    this.resource.mimeType = mimeType;
    return this;
  }
  
  /**
   * Sets the resource content
   */
  content(content: TContent): this {
    this.resource.content = content;
    return this;
  }
  
  /**
   * Builds the resource
   */
  build(): TypedMCPResource<TUri, TContent> {
    if (!this.resource.uri) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Resource URI is required');
    }
    if (!this.resource.name) {
      throw createMCPError(MCPErrorCode.VALIDATION_ERROR, 'Resource name is required');
    }
    
    return this.resource as TypedMCPResource<TUri, TContent>;
  }
}

// ================================================================
// GENERIC MIDDLEWARE
// ================================================================

/**
 * Generic middleware function type
 */
export type MCPMiddleware<TContext extends MCPContext = MCPContext> = (
  context: TContext,
  next: () => Promise<void>
) => Promise<void>;

/**
 * Generic middleware chain
 */
export class MCPMiddlewareChain<TContext extends MCPContext = MCPContext> {
  private middlewares: MCPMiddleware<TContext>[] = [];
  
  /**
   * Adds middleware to the chain
   */
  use(middleware: MCPMiddleware<TContext>): this {
    this.middlewares.push(middleware);
    return this;
  }
  
  /**
   * Executes the middleware chain
   */
  async execute(context: TContext, final?: () => Promise<void>): Promise<void> {
    let index = 0;
    
    const next = async (): Promise<void> => {
      if (index >= this.middlewares.length) {
        if (final) {
          await final();
        }
        return;
      }
      
      const middleware = this.middlewares[index++];
      await middleware(context, next);
    };
    
    await next();
  }
  
  /**
   * Gets the number of middlewares
   */
  size(): number {
    return this.middlewares.length;
  }
  
  /**
   * Clears all middlewares
   */
  clear(): void {
    this.middlewares = [];
  }
}

// ================================================================
// GENERIC UTILITIES
// ================================================================

/**
 * Creates a type-safe MCP tool
 */
export function createTypedTool<
  TName extends string,
  TInput = unknown,
  TOutput = unknown,
  TContext extends MCPContext = MCPContext
>(name: TName): MCPToolBuilder<TName, TInput, TOutput, TContext> {
  return new MCPToolBuilder<TName, TInput, TOutput, TContext>().name(name);
}

/**
 * Creates a type-safe MCP prompt
 */
export function createTypedPrompt<
  TName extends string,
  TArgs extends Record<string, any> = Record<string, any>
>(name: TName): MCPPromptBuilder<TName, TArgs> {
  return new MCPPromptBuilder<TName, TArgs>().name(name);
}

/**
 * Creates a type-safe MCP resource
 */
export function createTypedResource<
  TUri extends string,
  TContent = unknown
>(uri: TUri): MCPResourceBuilder<TUri, TContent> {
  return new MCPResourceBuilder<TUri, TContent>().uri(uri);
}

/**
 * Creates a generic MCP registry
 */
export function createRegistry<T>(): MCPRegistry<T> {
  return new MCPRegistry<T>();
}

/**
 * Creates a generic MCP cache
 */
export function createCache<K, V>(defaultTTL?: number): MCPCache<K, V> {
  return new MCPCache<K, V>(defaultTTL);
}

/**
 * Creates a generic MCP queue
 */
export function createQueue<T>(processor?: (item: T) => Promise<void>): MCPQueue<T> {
  return new MCPQueue<T>(processor);
}

/**
 * Creates a generic middleware chain
 */
export function createMiddlewareChain<TContext extends MCPContext = MCPContext>(): MCPMiddlewareChain<TContext> {
  return new MCPMiddlewareChain<TContext>();
}

/**
 * Utility function to check if two types are equal
 */
export type TypeEquals<T, U> = T extends U ? U extends T ? true : false : false;

/**
 * Utility function to assert type equality at compile time
 */
export function assertTypeEquals<T, U>(): TypeEquals<T, U> {
  return true as TypeEquals<T, U>;
}

/**
 * Utility function to create a type-safe predicate
 */
export function createPredicate<T>(
  predicate: (item: T) => boolean
): (item: T) => boolean {
  return predicate;
}

/**
 * Utility function to create a type-safe mapper
 */
export function createMapper<T, U>(
  mapper: (item: T) => U
): (item: T) => U {
  return mapper;
}

/**
 * Utility function to create a type-safe comparator
 */
export function createComparator<T>(
  comparator: (a: T, b: T) => number
): (a: T, b: T) => number {
  return comparator;
}

// ================================================================
// EXPORT GENERICS SUITE
// ================================================================

/**
 * Complete generics suite for MCP protocol
 */
export const MCPGenerics = {
  // Classes
  MCPRegistry,
  MCPCache,
  MCPQueue,
  MCPToolBuilder,
  MCPPromptBuilder,
  MCPResourceBuilder,
  MCPMiddlewareChain,
  
  // Factory functions
  createTypedTool,
  createTypedPrompt,
  createTypedResource,
  createRegistry,
  createCache,
  createQueue,
  createMiddlewareChain,
  
  // Utility functions
  assertTypeEquals,
  createPredicate,
  createMapper,
  createComparator
};

export default MCPGenerics;