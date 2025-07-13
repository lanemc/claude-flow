/**
 * SPARC Memory Bank - Main Export
 * Complete memory management system for Claude-Flow
 */

export { MemoryManager } from './core/memory-manager';
export type { MemoryManagerConfig } from './core/memory-manager';
export { SqliteBackend } from './backends/sqlite-backend';
export type { SqliteBackendConfig } from './backends/sqlite-backend';
export { MarkdownBackend } from './backends/markdown-backend';
export type { MarkdownBackendConfig } from './backends/markdown-backend';
export { MemoryCache } from './cache/memory-cache';
export { MemoryIndexer } from './indexer/memory-indexer';
export { ReplicationManager } from './replication/replication-manager';
export { NamespaceManager } from './namespaces/namespace-manager';
export { ImportExportManager } from './io/import-export';

export * from './types';

// Re-export commonly used types
export type {
  MemoryItem,
  MemoryQuery,
  MemoryBackend,
  MemoryMetadata,
  MemorySnapshot,
  MemoryNamespace,
  VectorSearchResult,
  CacheConfig,
  ReplicationConfig,
  ImportExportOptions
} from './types';