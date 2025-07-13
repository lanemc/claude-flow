/**
 * Memory Module - Unified memory persistence for ruv-swarm
 * 
 * Provides both generic SharedMemory and MCP-specific SwarmMemory implementations
 * 
 * @module memory
 */

import SharedMemory from './shared-memory';
import { SwarmMemory, createSwarmMemory } from './swarm-memory';
import { SWARM_NAMESPACES } from './types';
import type { 
  SharedMemoryOptions, 
  SwarmMemoryOptions, 
  SwarmNamespace 
} from './types';

export { SharedMemory, SwarmMemory, createSwarmMemory };

// Re-export swarm namespaces for convenience
export { SWARM_NAMESPACES };

// Re-export types
export type { 
  SharedMemoryOptions,
  SwarmMemoryOptions,
  SwarmNamespace,
  MemoryEntry,
  MemoryStoreOptions,
  MemorySearchOptions,
  MemoryListOptions,
  AgentData,
  TaskData,
  SessionState,
  WorkflowData
} from './types';

/**
 * Create memory instance based on context
 */
export function createMemory(options: SwarmMemoryOptions & { type?: 'swarm' }): SwarmMemory;
export function createMemory(options: SharedMemoryOptions): SharedMemory;
export function createMemory(options: SharedMemoryOptions | SwarmMemoryOptions = {}): SharedMemory | SwarmMemory {
  if ('type' in options && options.type === 'swarm' || 'swarmId' in options) {
    return new SwarmMemory(options as SwarmMemoryOptions);
  }
  return new SharedMemory(options as SharedMemoryOptions);
}

// Default export for backwards compatibility
export default { 
  SharedMemory, 
  SwarmMemory, 
  createMemory, 
  SWARM_NAMESPACES 
};