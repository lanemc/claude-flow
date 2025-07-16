/**
 * Validation and Rollback Systems - TypeScript Entry Point
 * Comprehensive type-safe validation and rollback functionality
 */

// Import classes for use in factory functions
import {
  ValidationEngine,
  ValidationSchemaBuilder,
  BuiltInValidators,
  CommonSchemas,
  defaultValidationEngine
} from './validation-engine.js';
import {
  ValidationStateManager,
  RollbackStateManager,
  CombinedStateManager
} from './state-manager.js';
import {
  TypedValidationMiddleware
} from './express-validation.js';
import {
  createDefaultHealthCheckManager
} from './health-check.js';
import {
  RollbackManager
} from '../migration/rollback-manager.js';
import {
  RollbackExecutor
} from '../cli/simple-commands/init/rollback/rollback-executor.js';

// Core validation engine
export {
  ValidationEngine,
  ValidationSchemaBuilder,
  BuiltInValidators,
  CommonSchemas,
  defaultValidationEngine
} from './validation-engine.js';

// Express.js validation middleware
export {
  ExpressValidationChains,
  TypedValidationMiddleware,
  ValidationChains,
  validationMiddleware,
  handleValidationErrors,
  validateUser,
  validateUserUpdate,
  type ValidationErrorResponse,
  type TypedRequest,
  type UserCreateRequest,
  type UserUpdateRequest,
  type AgentCreateRequest,
  type ConfigRequest,
  type RollbackRequest
} from './express-validation.js';

// Health check system
export {
  HealthCheckManager,
  BaseHealthCheck,
  FileSystemHealthCheck,
  ValidationEngineHealthCheck,
  RollbackSystemHealthCheck,
  MemoryHealthCheck,
  DatabaseHealthCheck,
  createDefaultHealthCheckManager,
  type HealthCheckConfig,
  type HealthCheckProvider
} from './health-check.js';

// State management
export {
  ValidationStateManager,
  RollbackStateManager,
  CombinedStateManager,
  type StateChangeEvents,
  type StateManagerConfig
} from './state-manager.js';

// Rollback executor (TypeScript version)
export {
  RollbackExecutor
} from '../cli/simple-commands/init/rollback/rollback-executor.js';

// Rollback manager
export {
  RollbackManager
} from '../migration/rollback-manager.js';

// Re-export types from migration system
export type {
  // Validation types
  ValidationSchema,
  ValidationRule,
  ValidationValidator,
  ValidationRuleResult,
  TypedValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationState,
  
  // Rollback types
  RollbackPhase,
  RollbackResult,
  RollbackAction,
  RollbackCheckpoint,
  RollbackStrategy,
  RollbackState,
  
  // Health check types
  HealthCheck,
  SystemHealthStatus,
  
  // Migration types
  MigrationBackup,
  BackupFile,
  ValidationResult,
  ValidationCheck
} from '../migration/types.js';

// Factory functions for easy setup
export function createValidationSystem(projectPath: string = process.cwd()) {
  const validationEngine = new ValidationEngine();
  const validationState = new ValidationStateManager(validationEngine, {
    persistPath: `${projectPath}/.claude/validation-state.json`
  });
  
  // Register common schemas
  validationEngine.registerSchema(CommonSchemas.createUserSchema());
  validationEngine.registerSchema(CommonSchemas.createConfigSchema());
  validationEngine.registerSchema(CommonSchemas.createAgentSchema());
  
  return {
    engine: validationEngine,
    state: validationState,
    middleware: new TypedValidationMiddleware(validationEngine)
  };
}

export function createRollbackSystem(projectPath: string = process.cwd()) {
  const rollbackManager = new RollbackManager(projectPath);
  const rollbackState = new RollbackStateManager(rollbackManager, {
    persistPath: `${projectPath}/.claude/rollback-state.json`
  });
  const rollbackExecutor = new RollbackExecutor(projectPath);
  
  return {
    manager: rollbackManager,
    state: rollbackState,
    executor: rollbackExecutor
  };
}

export function createHealthCheckSystem(
  projectPath: string = process.cwd(),
  validationEngine?: ValidationEngine,
  rollbackManager?: RollbackManager
) {
  // Create default instances if not provided
  const validation = validationEngine || new ValidationEngine();
  const rollback = rollbackManager || new RollbackManager(projectPath);
  
  const healthManager = createDefaultHealthCheckManager(projectPath, validation, rollback);
  
  return {
    manager: healthManager,
    validation,
    rollback
  };
}

export function createCombinedSystem(projectPath: string = process.cwd()) {
  const validation = createValidationSystem(projectPath);
  const rollback = createRollbackSystem(projectPath);
  const health = createHealthCheckSystem(projectPath, validation.engine, rollback.manager);
  
  const combinedState = new CombinedStateManager(
    validation.engine,
    rollback.manager,
    { persistPath: `${projectPath}/.claude/state.json` }
  );
  
  return {
    validation,
    rollback,
    health,
    state: combinedState,
    
    // Convenience methods
    async initialize() {
      await combinedState.loadAll();
      await rollback.state.refreshBackups();
    },
    
    async shutdown() {
      await combinedState.saveAll();
      health.manager.stopPeriodicChecks();
      combinedState.destroy();
    },
    
    async healthCheck() {
      return health.manager.runHealthChecks();
    }
  };
}

// Default export for easy usage
const defaultSystem = createCombinedSystem();
export default defaultSystem;