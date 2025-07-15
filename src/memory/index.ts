/**
 * Memory Module - Unified memory persistence for ruv-swarm
 * 
 * Provides both generic SharedMemory and MCP-specific SwarmMemory implementations
 * 
 * @module memory
 */

import SharedMemory from './shared-memory.js';
import { SwarmMemory, createSwarmMemory } from './swarm-memory.js';
import type { MemoryOptions, MemoryInstance } from './types.js';

export { SharedMemory, SwarmMemory, createSwarmMemory };

// Re-export swarm namespaces for convenience
export const SWARM_NAMESPACES = {
  AGENTS: 'swarm:agents',
  TASKS: 'swarm:tasks', 
  COMMUNICATIONS: 'swarm:communications',
  CONSENSUS: 'swarm:consensus',
  PATTERNS: 'swarm:patterns',
  METRICS: 'swarm:metrics',
  COORDINATION: 'swarm:coordination'
} as const;

type SwarmNamespace = typeof SWARM_NAMESPACES[keyof typeof SWARM_NAMESPACES];

/**
 * Create memory instance based on context
 */
export function createMemory(options: MemoryOptions = {}): MemoryInstance {
  if (options.type === 'swarm' || options.swarmId) {
    return new SwarmMemory(options);
  }
  return new SharedMemory(options);
}

// Default export for backwards compatibility
export default { SharedMemory, SwarmMemory, createMemory, SWARM_NAMESPACES };

// Type exports
export type { MemoryOptions, MemoryInstance, SwarmNamespace };