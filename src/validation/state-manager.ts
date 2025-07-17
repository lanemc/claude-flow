/**
 * State Manager - Type-safe state management for validation and rollback systems
 */

import { 
  ValidationState, 
  RollbackState, 
  ValidationSchema, 
  TypedValidationResult,
  MigrationBackup,
  RollbackResult,
  RollbackCheckpoint 
} from '../migration/types.js';
import { ValidationEngine } from './validation-engine.js';
import { RollbackManager } from '../migration/rollback-manager.js';
import { logger } from '../migration/logger.js';
import { EventEmitter } from 'events';
import * as fs from 'fs-extra';
import * as path from 'path';

// State change events
export interface StateChangeEvents {
  'validation:schema-registered': { schema: ValidationSchema };
  'validation:result-cached': { key: string; result: TypedValidationResult };
  'validation:config-updated': { config: ValidationState['config'] };
  'rollback:backup-created': { backup: MigrationBackup };
  'rollback:checkpoint-created': { checkpoint: RollbackCheckpoint };
  'rollback:state-updated': { state: RollbackState };
  'state:persisted': { timestamp: Date };
  'state:restored': { timestamp: Date };
}

export interface StateManagerConfig {
  persistPath?: string;
  autoSave: boolean;
  saveInterval: number; // milliseconds
  maxCacheSize: number;
  enableEvents: boolean;
}

// Validation state manager
export class ValidationStateManager extends EventEmitter {
  private state: ValidationState;
  private validationEngine: ValidationEngine;
  private config: StateManagerConfig;
  private saveTimer?: NodeJS.Timeout;

  constructor(
    validationEngine: ValidationEngine,
    config: Partial<StateManagerConfig> = {}
  ) {
    super();
    
    this.validationEngine = validationEngine;
    this.config = {
      persistPath: '.claude/validation-state.json',
      autoSave: true,
      saveInterval: 10000, // 10 seconds
      maxCacheSize: 1000,
      enableEvents: true,
      ...config
    };

    this.state = {
      schemas: {},
      activeValidations: {},
      cache: {},
      config: {
        strictMode: false,
        validateOnSave: true,
        autoCorrect: false
      }
    };

    if (this.config.autoSave) {
      this.startAutoSave();
    }
  }

  // Schema management
  registerSchema<T>(schema: ValidationSchema<T>): void {
    this.state.schemas[schema.name] = schema;
    this.validationEngine.registerSchema(schema);
    
    if (this.config.enableEvents) {
      this.emit('validation:schema-registered', { schema });
    }
    
    logger.debug(`Registered validation schema: ${schema.name}`);
  }

  getSchema<T>(name: string): ValidationSchema<T> | undefined {
    return this.state.schemas[name] as ValidationSchema<T>;
  }

  listSchemas(): string[] {
    return Object.keys(this.state.schemas);
  }

  removeSchema(name: string): boolean {
    if (this.state.schemas[name]) {
      delete this.state.schemas[name];
      // Clean up related cache entries
      Object.keys(this.state.cache).forEach(key => {
        if (key.startsWith(`${name}:`)) {
          delete this.state.cache[key];
        }
      });
      return true;
    }
    return false;
  }

  // Validation result caching
  cacheValidationResult<T>(key: string, result: TypedValidationResult<T>): void {
    // Implement cache size limit
    if (Object.keys(this.state.cache).length >= this.config.maxCacheSize) {
      this.clearOldestCacheEntries(Math.floor(this.config.maxCacheSize * 0.2));
    }

    this.state.activeValidations[key] = result;
    this.state.cache[key] = {
      timestamp: new Date(),
      result: result
    };

    if (this.config.enableEvents) {
      this.emit('validation:result-cached', { key, result });
    }
  }

  getCachedValidationResult<T>(key: string): TypedValidationResult<T> | undefined {
    return this.state.activeValidations[key] as TypedValidationResult<T>;
  }

  private clearOldestCacheEntries(count: number): void {
    const entries = Object.entries(this.state.cache)
      .map(([key, value]) => ({ key, timestamp: value.timestamp }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(0, count);

    entries.forEach(({ key }) => {
      delete this.state.cache[key];
      delete this.state.activeValidations[key];
    });

    logger.debug(`Cleared ${count} oldest cache entries`);
  }

  // Configuration management
  updateConfig(newConfig: Partial<ValidationState['config']>): void {
    this.state.config = { ...this.state.config, ...newConfig };
    
    if (this.config.enableEvents) {
      this.emit('validation:config-updated', { config: this.state.config });
    }
    
    logger.info('Validation configuration updated', newConfig);
  }

  getConfig(): ValidationState['config'] {
    return { ...this.state.config };
  }

  // State persistence
  async saveState(): Promise<void> {
    if (!this.config.persistPath) return;

    try {
      const stateToSave = {
        ...this.state,
        timestamp: new Date()
      };

      await fs.ensureDir(path.dirname(this.config.persistPath));
      await fs.writeJson(this.config.persistPath, stateToSave, { spaces: 2 });
      
      if (this.config.enableEvents) {
        this.emit('state:persisted', { timestamp: new Date() });
      }
      
      logger.debug(`Validation state saved to ${this.config.persistPath}`);
    } catch (error) {
      logger.error('Failed to save validation state:', error);
    }
  }

  async loadState(): Promise<void> {
    if (!this.config.persistPath) return;

    try {
      const exists = await fs.pathExists(this.config.persistPath);
      if (!exists) return;

      const savedState = await fs.readJson(this.config.persistPath);
      
      // Restore schemas
      if (savedState.schemas) {
        Object.values(savedState.schemas).forEach((schema: any) => {
          this.validationEngine.registerSchema(schema);
        });
      }

      // Restore state (excluding cache for freshness)
      this.state = {
        schemas: savedState.schemas || {},
        activeValidations: {},
        cache: {},
        config: savedState.config || this.state.config
      };

      if (this.config.enableEvents) {
        this.emit('state:restored', { timestamp: new Date() });
      }
      
      logger.info(`Validation state loaded from ${this.config.persistPath}`);
    } catch (error) {
      logger.error('Failed to load validation state:', error);
    }
  }

  private startAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }

    this.saveTimer = setInterval(() => {
      this.saveState().catch(error => {
        logger.error('Auto-save failed:', error);
      });
    }, this.config.saveInterval);
  }

  private stopAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = undefined;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopAutoSave();
    this.removeAllListeners();
    this.state.cache = {};
    this.state.activeValidations = {};
  }

  // State inspection
  getStateSnapshot(): ValidationState {
    return JSON.parse(JSON.stringify(this.state));
  }

  getCacheStats(): {
    size: number;
    maxSize: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    const entries = Object.values(this.state.cache);
    const timestamps = entries.map(entry => entry.timestamp);
    
    return {
      size: entries.length,
      maxSize: this.config.maxCacheSize,
      oldestEntry: timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : undefined,
      newestEntry: timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : undefined
    };
  }
}

// Rollback state manager
export class RollbackStateManager extends EventEmitter {
  private state: RollbackState;
  private rollbackManager: RollbackManager;
  private config: StateManagerConfig;
  private saveTimer?: NodeJS.Timeout;

  constructor(
    rollbackManager: RollbackManager,
    config: Partial<StateManagerConfig> = {}
  ) {
    super();
    
    this.rollbackManager = rollbackManager;
    this.config = {
      persistPath: '.claude/rollback-state.json',
      autoSave: true,
      saveInterval: 15000, // 15 seconds
      maxCacheSize: 100,
      enableEvents: true,
      ...config
    };

    this.state = {
      availableBackups: [],
      activeRollbacks: {},
      checkpoints: {},
      config: {
        autoBackup: true,
        maxBackups: 10,
        retentionDays: 30
      }
    };

    if (this.config.autoSave) {
      this.startAutoSave();
    }
  }

  // Backup management
  async refreshBackups(): Promise<void> {
    try {
      this.state.availableBackups = await this.rollbackManager.listBackups();
      logger.debug(`Refreshed backup list: ${this.state.availableBackups.length} backups found`);
    } catch (error) {
      logger.error('Failed to refresh backup list:', error);
    }
  }

  addBackup(backup: MigrationBackup): void {
    this.state.availableBackups.unshift(backup);
    
    // Maintain backup limit
    if (this.state.availableBackups.length > this.state.config.maxBackups) {
      this.state.availableBackups = this.state.availableBackups.slice(0, this.state.config.maxBackups);
    }

    if (this.config.enableEvents) {
      this.emit('rollback:backup-created', { backup });
    }
  }

  getBackups(): MigrationBackup[] {
    return [...this.state.availableBackups];
  }

  // Checkpoint management
  createCheckpoint(checkpoint: RollbackCheckpoint): void {
    this.state.checkpoints[checkpoint.id] = checkpoint;
    
    if (this.config.enableEvents) {
      this.emit('rollback:checkpoint-created', { checkpoint });
    }
    
    logger.debug(`Created rollback checkpoint: ${checkpoint.id}`);
  }

  getCheckpoint(id: string): RollbackCheckpoint | undefined {
    return this.state.checkpoints[id];
  }

  listCheckpoints(): RollbackCheckpoint[] {
    return Object.values(this.state.checkpoints);
  }

  removeCheckpoint(id: string): boolean {
    if (this.state.checkpoints[id]) {
      delete this.state.checkpoints[id];
      return true;
    }
    return false;
  }

  // Active rollback tracking
  trackRollback(rollbackResult: RollbackResult): void {
    this.state.activeRollbacks[rollbackResult.rollbackId] = rollbackResult;
    
    if (this.config.enableEvents) {
      this.emit('rollback:state-updated', { state: this.state });
    }
  }

  getRollbackResult(rollbackId: string): RollbackResult | undefined {
    return this.state.activeRollbacks[rollbackId];
  }

  listActiveRollbacks(): RollbackResult[] {
    return Object.values(this.state.activeRollbacks);
  }

  // Configuration management
  updateConfig(newConfig: Partial<RollbackState['config']>): void {
    this.state.config = { ...this.state.config, ...newConfig };
    logger.info('Rollback configuration updated', newConfig);
  }

  getConfig(): RollbackState['config'] {
    return { ...this.state.config };
  }

  // State persistence
  async saveState(): Promise<void> {
    if (!this.config.persistPath) return;

    try {
      const stateToSave = {
        ...this.state,
        timestamp: new Date()
      };

      await fs.ensureDir(path.dirname(this.config.persistPath));
      await fs.writeJson(this.config.persistPath, stateToSave, { spaces: 2 });
      
      if (this.config.enableEvents) {
        this.emit('state:persisted', { timestamp: new Date() });
      }
      
      logger.debug(`Rollback state saved to ${this.config.persistPath}`);
    } catch (error) {
      logger.error('Failed to save rollback state:', error);
    }
  }

  async loadState(): Promise<void> {
    if (!this.config.persistPath) return;

    try {
      const exists = await fs.pathExists(this.config.persistPath);
      if (!exists) return;

      const savedState = await fs.readJson(this.config.persistPath);
      
      this.state = {
        availableBackups: savedState.availableBackups || [],
        activeRollbacks: savedState.activeRollbacks || {},
        checkpoints: savedState.checkpoints || {},
        config: savedState.config || this.state.config
      };

      if (this.config.enableEvents) {
        this.emit('state:restored', { timestamp: new Date() });
      }
      
      logger.info(`Rollback state loaded from ${this.config.persistPath}`);
    } catch (error) {
      logger.error('Failed to load rollback state:', error);
    }
  }

  private startAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }

    this.saveTimer = setInterval(() => {
      this.saveState().catch(error => {
        logger.error('Auto-save failed:', error);
      });
    }, this.config.saveInterval);
  }

  private stopAutoSave(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = undefined;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopAutoSave();
    this.removeAllListeners();
    this.state.activeRollbacks = {};
    this.state.checkpoints = {};
  }

  // State inspection
  getStateSnapshot(): RollbackState {
    return JSON.parse(JSON.stringify(this.state));
  }

  getStats(): {
    backupCount: number;
    checkpointCount: number;
    activeRollbackCount: number;
    oldestBackup?: Date;
    newestBackup?: Date;
  } {
    const backups = this.state.availableBackups;
    
    return {
      backupCount: backups.length,
      checkpointCount: Object.keys(this.state.checkpoints).length,
      activeRollbackCount: Object.keys(this.state.activeRollbacks).length,
      oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : undefined,
      newestBackup: backups.length > 0 ? backups[0].timestamp : undefined
    };
  }
}

// Combined state manager for both validation and rollback
export class CombinedStateManager extends EventEmitter {
  public validation: ValidationStateManager;
  public rollback: RollbackStateManager;

  constructor(
    validationEngine: ValidationEngine,
    rollbackManager: RollbackManager,
    config: Partial<StateManagerConfig> = {}
  ) {
    super();

    this.validation = new ValidationStateManager(validationEngine, {
      ...config,
      persistPath: config.persistPath ? path.join(path.dirname(config.persistPath), 'validation-state.json') : undefined
    });

    this.rollback = new RollbackStateManager(rollbackManager, {
      ...config,
      persistPath: config.persistPath ? path.join(path.dirname(config.persistPath), 'rollback-state.json') : undefined
    });

    // Forward events from child managers
    this.validation.on('*', (event, data) => this.emit(event, data));
    this.rollback.on('*', (event, data) => this.emit(event, data));
  }

  async saveAll(): Promise<void> {
    await Promise.all([
      this.validation.saveState(),
      this.rollback.saveState()
    ]);
  }

  async loadAll(): Promise<void> {
    await Promise.all([
      this.validation.loadState(),
      this.rollback.loadState()
    ]);
  }

  destroy(): void {
    this.validation.destroy();
    this.rollback.destroy();
    this.removeAllListeners();
  }

  getOverallStats(): {
    validation: ReturnType<ValidationStateManager['getCacheStats']>;
    rollback: ReturnType<RollbackStateManager['getStats']>;
  } {
    return {
      validation: this.validation.getCacheStats(),
      rollback: this.rollback.getStats()
    };
  }
}