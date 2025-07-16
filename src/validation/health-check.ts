/**
 * Health Check System - Type-safe health monitoring for validation and rollback systems
 */

import { HealthCheck, SystemHealthStatus } from '../migration/types.js';
import { ValidationEngine } from './validation-engine.js';
import { RollbackManager } from '../migration/rollback-manager.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { logger } from '../migration/logger.js';

export interface HealthCheckConfig {
  interval: number; // milliseconds
  timeout: number; // milliseconds
  retries: number;
  enabledChecks: string[];
}

export interface HealthCheckProvider {
  name: string;
  check(): Promise<HealthCheck>;
}

// Base health check implementation
export abstract class BaseHealthCheck implements HealthCheckProvider {
  abstract name: string;
  protected timeout: number;

  constructor(timeout: number = 5000) {
    this.timeout = timeout;
  }

  abstract check(): Promise<HealthCheck>;

  protected createHealthCheck(
    status: 'healthy' | 'warning' | 'critical' | 'unknown',
    message?: string,
    metadata?: Record<string, any>
  ): HealthCheck {
    return {
      name: this.name,
      status,
      message,
      timestamp: new Date(),
      metadata
    };
  }

  protected async withTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Health check timeout after ${this.timeout}ms`));
      }, this.timeout);

      operation()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
}

// File system health check
export class FileSystemHealthCheck extends BaseHealthCheck {
  name = 'filesystem';
  private checkPaths: string[];

  constructor(checkPaths: string[], timeout?: number) {
    super(timeout);
    this.checkPaths = checkPaths;
  }

  async check(): Promise<HealthCheck> {
    try {
      return await this.withTimeout(async () => {
        const results: Array<{ path: string; accessible: boolean; error?: string }> = [];

        for (const checkPath of this.checkPaths) {
          try {
            await fs.access(checkPath);
            results.push({ path: checkPath, accessible: true });
          } catch (error) {
            results.push({
              path: checkPath,
              accessible: false,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }

        const inaccessiblePaths = results.filter(r => !r.accessible);
        
        if (inaccessiblePaths.length === 0) {
          return this.createHealthCheck(
            'healthy',
            'All file system paths are accessible',
            { checkedPaths: this.checkPaths.length, results }
          );
        } else if (inaccessiblePaths.length < this.checkPaths.length) {
          return this.createHealthCheck(
            'warning',
            `${inaccessiblePaths.length} of ${this.checkPaths.length} paths are inaccessible`,
            { checkedPaths: this.checkPaths.length, results, inaccessiblePaths }
          );
        } else {
          return this.createHealthCheck(
            'critical',
            'All file system paths are inaccessible',
            { checkedPaths: this.checkPaths.length, results, inaccessiblePaths }
          );
        }
      });
    } catch (error) {
      return this.createHealthCheck(
        'critical',
        `File system health check failed: ${error instanceof Error ? error.message : String(error)}`,
        { error: error instanceof Error ? error.stack : String(error) }
      );
    }
  }
}

// Validation engine health check
export class ValidationEngineHealthCheck extends BaseHealthCheck {
  name = 'validation-engine';
  private validationEngine: ValidationEngine;

  constructor(validationEngine: ValidationEngine, timeout?: number) {
    super(timeout);
    this.validationEngine = validationEngine;
  }

  async check(): Promise<HealthCheck> {
    try {
      return await this.withTimeout(async () => {
        // Test validation engine with a simple validation
        const testSchema = this.validationEngine.getSchema('user');
        
        if (!testSchema) {
          return this.createHealthCheck(
            'warning',
            'No test schema available for validation engine',
            { availableSchemas: 0 }
          );
        }

        // Test validation with valid data
        const testData = { name: 'Test User', email: 'test@example.com', age: 25 };
        const result = await this.validationEngine.validate(testData, 'user');

        if (result.valid) {
          return this.createHealthCheck(
            'healthy',
            'Validation engine is working correctly',
            { 
              testPassed: true,
              validationTime: Date.now() - result.metadata.timestamp.getTime()
            }
          );
        } else {
          return this.createHealthCheck(
            'warning',
            'Validation engine test failed with valid data',
            { 
              testPassed: false,
              errors: result.errors.length,
              warnings: result.warnings.length
            }
          );
        }
      });
    } catch (error) {
      return this.createHealthCheck(
        'critical',
        `Validation engine health check failed: ${error instanceof Error ? error.message : String(error)}`,
        { error: error instanceof Error ? error.stack : String(error) }
      );
    }
  }
}

// Rollback system health check
export class RollbackSystemHealthCheck extends BaseHealthCheck {
  name = 'rollback-system';
  private rollbackManager: RollbackManager;

  constructor(rollbackManager: RollbackManager, timeout?: number) {
    super(timeout);
    this.rollbackManager = rollbackManager;
  }

  async check(): Promise<HealthCheck> {
    try {
      return await this.withTimeout(async () => {
        // Check if rollback manager can list backups
        const backups = await this.rollbackManager.listBackups();
        
        // Check backup directory accessibility
        const backupDir = path.join(this.rollbackManager['projectPath'], this.rollbackManager['backupDir']);
        
        try {
          await fs.access(backupDir);
        } catch {
          return this.createHealthCheck(
            'warning',
            'Backup directory is not accessible',
            { backupDir, backupCount: backups.length }
          );
        }

        return this.createHealthCheck(
          'healthy',
          'Rollback system is operational',
          { 
            backupCount: backups.length,
            backupDir,
            oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
            newestBackup: backups.length > 0 ? backups[0].timestamp : null
          }
        );
      });
    } catch (error) {
      return this.createHealthCheck(
        'critical',
        `Rollback system health check failed: ${error instanceof Error ? error.message : String(error)}`,
        { error: error instanceof Error ? error.stack : String(error) }
      );
    }
  }
}

// Memory health check
export class MemoryHealthCheck extends BaseHealthCheck {
  name = 'memory';
  private thresholds: {
    warningPercent: number;
    criticalPercent: number;
  };

  constructor(thresholds = { warningPercent: 80, criticalPercent: 90 }, timeout?: number) {
    super(timeout);
    this.thresholds = thresholds;
  }

  async check(): Promise<HealthCheck> {
    try {
      return await this.withTimeout(async () => {
        const memUsage = process.memoryUsage();
        const totalMemory = require('os').totalmem();
        const usedPercent = (memUsage.rss / totalMemory) * 100;

        const metadata = {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
          totalMemory,
          usedPercent: Math.round(usedPercent * 100) / 100
        };

        if (usedPercent >= this.thresholds.criticalPercent) {
          return this.createHealthCheck(
            'critical',
            `Memory usage is critically high: ${metadata.usedPercent}%`,
            metadata
          );
        } else if (usedPercent >= this.thresholds.warningPercent) {
          return this.createHealthCheck(
            'warning',
            `Memory usage is high: ${metadata.usedPercent}%`,
            metadata
          );
        } else {
          return this.createHealthCheck(
            'healthy',
            `Memory usage is normal: ${metadata.usedPercent}%`,
            metadata
          );
        }
      });
    } catch (error) {
      return this.createHealthCheck(
        'critical',
        `Memory health check failed: ${error instanceof Error ? error.message : String(error)}`,
        { error: error instanceof Error ? error.stack : String(error) }
      );
    }
  }
}

// Database connectivity health check (for SQLite memory store)
export class DatabaseHealthCheck extends BaseHealthCheck {
  name = 'database';
  private dbPath: string;

  constructor(dbPath: string, timeout?: number) {
    super(timeout);
    this.dbPath = dbPath;
  }

  async check(): Promise<HealthCheck> {
    try {
      return await this.withTimeout(async () => {
        // Check if database file exists and is accessible
        try {
          const stats = await fs.stat(this.dbPath);
          
          return this.createHealthCheck(
            'healthy',
            'Database is accessible',
            {
              path: this.dbPath,
              size: stats.size,
              modified: stats.mtime
            }
          );
        } catch (error) {
          return this.createHealthCheck(
            'warning',
            'Database file is not accessible',
            {
              path: this.dbPath,
              error: error instanceof Error ? error.message : String(error)
            }
          );
        }
      });
    } catch (error) {
      return this.createHealthCheck(
        'critical',
        `Database health check failed: ${error instanceof Error ? error.message : String(error)}`,
        { error: error instanceof Error ? error.stack : String(error) }
      );
    }
  }
}

// Health check manager
export class HealthCheckManager {
  private providers: Map<string, HealthCheckProvider> = new Map();
  private config: HealthCheckConfig;
  private intervalId?: NodeJS.Timeout;

  constructor(config: Partial<HealthCheckConfig> = {}) {
    this.config = {
      interval: 30000, // 30 seconds
      timeout: 5000,   // 5 seconds
      retries: 3,
      enabledChecks: [],
      ...config
    };
  }

  registerProvider(provider: HealthCheckProvider): void {
    this.providers.set(provider.name, provider);
  }

  unregisterProvider(name: string): void {
    this.providers.delete(name);
  }

  async runHealthChecks(): Promise<SystemHealthStatus> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];
    
    const enabledProviders = Array.from(this.providers.entries())
      .filter(([name]) => 
        this.config.enabledChecks.length === 0 || 
        this.config.enabledChecks.includes(name)
      );

    // Run all health checks in parallel
    const checkPromises = enabledProviders.map(async ([name, provider]) => {
      try {
        return await provider.check();
      } catch (error) {
        return {
          name,
          status: 'critical' as const,
          message: `Health check failed: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date(),
          metadata: { error: error instanceof Error ? error.stack : String(error) }
        };
      }
    });

    const results = await Promise.all(checkPromises);
    checks.push(...results);

    // Calculate overall status
    const summary = {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      warning: checks.filter(c => c.status === 'warning').length,
      critical: checks.filter(c => c.status === 'critical').length,
      unknown: checks.filter(c => c.status === 'unknown').length
    };

    let overall: 'healthy' | 'warning' | 'critical';
    if (summary.critical > 0) {
      overall = 'critical';
    } else if (summary.warning > 0) {
      overall = 'warning';
    } else {
      overall = 'healthy';
    }

    const healthStatus: SystemHealthStatus = {
      overall,
      checks,
      summary,
      timestamp: new Date()
    };

    // Log health status
    const duration = Date.now() - startTime;
    logger.info(`Health check completed in ${duration}ms - Overall: ${overall}`, {
      summary,
      duration
    });

    return healthStatus;
  }

  startPeriodicChecks(): void {
    if (this.intervalId) {
      this.stopPeriodicChecks();
    }

    this.intervalId = setInterval(async () => {
      try {
        await this.runHealthChecks();
      } catch (error) {
        logger.error('Periodic health check failed:', error);
      }
    }, this.config.interval);

    logger.info(`Started periodic health checks every ${this.config.interval}ms`);
  }

  stopPeriodicChecks(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      logger.info('Stopped periodic health checks');
    }
  }

  getStatus(): { running: boolean; interval: number; providersCount: number } {
    return {
      running: !!this.intervalId,
      interval: this.config.interval,
      providersCount: this.providers.size
    };
  }
}

// Create and export a default health check manager
export function createDefaultHealthCheckManager(
  projectPath: string,
  validationEngine: ValidationEngine,
  rollbackManager: RollbackManager
): HealthCheckManager {
  const manager = new HealthCheckManager();

  // Register default health checks
  manager.registerProvider(new FileSystemHealthCheck([
    projectPath,
    path.join(projectPath, '.claude'),
    path.join(projectPath, 'memory'),
    path.join(projectPath, '.swarm')
  ]));

  manager.registerProvider(new ValidationEngineHealthCheck(validationEngine));
  manager.registerProvider(new RollbackSystemHealthCheck(rollbackManager));
  manager.registerProvider(new MemoryHealthCheck());
  
  const dbPath = path.join(projectPath, '.swarm', 'memory.db');
  manager.registerProvider(new DatabaseHealthCheck(dbPath));

  return manager;
}