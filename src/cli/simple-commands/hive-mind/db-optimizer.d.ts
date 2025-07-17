/**
 * Type definitions for Hive Mind Database Optimizer
 */

// Optimization options interface
export interface OptimizationOptions {
  vacuum?: boolean;
  cleanMemory?: boolean;
  archiveTasks?: boolean;
  checkIntegrity?: boolean;
  memoryRetentionDays?: number;
  taskRetentionDays?: number;
  verbose?: boolean | ((message: string) => void);
}

// Optimization result interface
export interface OptimizationResult {
  success: boolean;
  error?: string;
  optimizationsApplied?: string[];
  schemaVersion?: number;
  backupPath?: string;
}

// Table statistics interface
export interface TableStats {
  rowCount: number;
  sizeBytes: number;
  avgRowSize?: number;
  indexCount?: number;
}

// Index information interface
export interface IndexInfo {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
  partial?: boolean;
}

// Performance metrics interface
export interface PerformanceMetrics {
  avgTaskCompletionMinutes: number;
  totalTasks?: number;
  completedTasks?: number;
  successRate?: number;
  avgMemoryQueryMs?: number;
  avgTaskQueryMs?: number;
}

// Optimization report interface
export interface OptimizationReport {
  schemaVersion: number;
  tables: Record<string, TableStats>;
  indexes: IndexInfo[];
  performance: PerformanceMetrics;
  recommendations?: string[];
  lastOptimized?: Date;
  databaseSize?: number;
}

// Maintenance result interface
export interface MaintenanceResult {
  success: boolean;
  operations: {
    memoryCleanup?: {
      rowsDeleted: number;
      spaceReclaimed: number;
    };
    taskArchive?: {
      tasksArchived: number;
      spaceReclaimed: number;
    };
    integrityCheck?: {
      passed: boolean;
      errors?: string[];
    };
    vacuum?: {
      success: boolean;
      spaceReclaimed: number;
    };
  };
  duration: number;
  errors?: string[];
}

// Schema migration interface
export interface SchemaMigration {
  version: number;
  description: string;
  sql: string[];
  rollback?: string[];
}

// Database statistics interface
export interface DatabaseStats {
  pageCount: number;
  pageSize: number;
  totalSize: number;
  freePages: number;
  walSize?: number;
  cacheHitRate?: number;
}

/**
 * Optimize existing hive mind database with backward compatibility
 * @param dbPath Path to the database file
 * @param options Optimization options
 * @returns Promise resolving to optimization result
 */
export function optimizeHiveMindDatabase(
  dbPath: string, 
  options?: OptimizationOptions
): Promise<OptimizationResult>;

/**
 * Perform maintenance tasks on the database
 * @param dbPath Path to the database file
 * @param options Maintenance options
 * @returns Promise resolving to maintenance result
 */
export function performMaintenance(
  dbPath: string, 
  options?: OptimizationOptions
): Promise<MaintenanceResult>;

/**
 * Generate optimization report for the database
 * @param dbPath Path to the database file
 * @returns Promise resolving to optimization report or null if error
 */
export function generateOptimizationReport(
  dbPath: string
): Promise<OptimizationReport | null>;