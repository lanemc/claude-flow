/**
 * Coordination system exports
 */

// Core coordination components
export { CoordinationManager } from './manager';
export type { ICoordinationManager } from './manager';
export { TaskScheduler } from './scheduler';
export { ResourceManager } from './resources';
export { MessageRouter } from './messaging';

// Advanced scheduling
export { 
  AdvancedTaskScheduler,
  CapabilitySchedulingStrategy,
  RoundRobinSchedulingStrategy,
  LeastLoadedSchedulingStrategy,
  AffinitySchedulingStrategy
} from './advanced-scheduler';
export type {
  SchedulingStrategy,
  SchedulingContext
} from './advanced-scheduler';

// Work stealing
export {
  WorkStealingCoordinator
} from './work-stealing';
export type {
  WorkStealingConfig,
  AgentWorkload
} from './work-stealing';

// Dependency management
export {
  DependencyGraph
} from './dependency-graph';
export type {
  DependencyNode,
  DependencyPath
} from './dependency-graph';

// Circuit breakers
export {
  CircuitBreaker,
  CircuitBreakerManager,
  CircuitState
} from './circuit-breaker';
export type {
  CircuitBreakerConfig,
  CircuitBreakerMetrics
} from './circuit-breaker';

// Conflict resolution
export {
  ConflictResolver,
  PriorityResolutionStrategy,
  TimestampResolutionStrategy,
  VotingResolutionStrategy,
  OptimisticLockManager
} from './conflict-resolution';
export type {
  ResourceConflict,
  TaskConflict,
  ConflictResolution,
  ConflictResolutionStrategy
} from './conflict-resolution';

// Metrics and monitoring
export {
  CoordinationMetricsCollector
} from './metrics';
export type {
  CoordinationMetrics,
  MetricsSample
} from './metrics';