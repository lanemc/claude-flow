/**
 * Coordination system exports
 */

// Core coordination components
export { CoordinationManager } from './manager.js';
export type { ICoordinationManager } from './manager.js';
export { TaskScheduler } from './scheduler.js';
export { ResourceManager } from './resources.js';
export { MessageRouter } from './messaging.js';

// Advanced scheduling
export { 
  AdvancedTaskScheduler,
  CapabilitySchedulingStrategy,
  RoundRobinSchedulingStrategy,
  LeastLoadedSchedulingStrategy,
  AffinitySchedulingStrategy
} from './advanced-scheduler.js';
export type {
  SchedulingStrategy,
  SchedulingContext
} from './advanced-scheduler.js';

// Work stealing
export {
  WorkStealingCoordinator
} from './work-stealing.js';
export type {
  WorkStealingConfig,
  AgentWorkload
} from './work-stealing.js';

// Dependency management
export {
  DependencyGraph
} from './dependency-graph.js';
export type {
  DependencyNode,
  DependencyPath
} from './dependency-graph.js';

// Circuit breakers
export {
  CircuitBreaker,
  CircuitBreakerManager,
  CircuitState
} from './circuit-breaker.js';
export type {
  CircuitBreakerConfig,
  CircuitBreakerMetrics
} from './circuit-breaker.js';

// Conflict resolution
export {
  ConflictResolver,
  PriorityResolutionStrategy,
  TimestampResolutionStrategy,
  VotingResolutionStrategy,
  OptimisticLockManager
} from './conflict-resolution.js';
export type {
  ResourceConflict,
  TaskConflict,
  ConflictResolution,
  ConflictResolutionStrategy
} from './conflict-resolution.js';

// Metrics and monitoring
export {
  CoordinationMetricsCollector
} from './metrics.js';
export type {
  CoordinationMetrics,
  MetricsSample
} from './metrics.js';