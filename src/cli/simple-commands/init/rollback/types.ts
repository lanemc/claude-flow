// types.ts - Shared types and interfaces for rollback system

export interface BackupMetadata {
  created: number;
  size: number;
  fileCount: number;
  dirCount: number;
}

export interface BackupManifest {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  workingDir: string;
  files: FileInfo[];
  directories: DirectoryInfo[];
}

export interface FileInfo {
  originalPath: string;
  backupPath: string;
  size: number;
  modified: number;
}

export interface DirectoryInfo {
  originalPath: string;
  backupPath: string;
}

export interface BackupResult {
  success: boolean;
  id: string | null;
  location: string | null;
  errors: string[];
  warnings: string[];
  files: string[];
}

export interface RestoreResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  restored: string[];
}

export interface BackupListItem {
  id: string;
  type: string;
  description: string;
  created: number;
  size: number;
  fileCount: number;
  dirCount: number;
}

export interface DiskSpaceResult {
  adequate: boolean;
  available: number;
}

export interface RollbackResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  actions: string[];
}

export interface RollbackPoint {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  backupId?: string;
  state?: string;
}

export interface Checkpoint {
  id: string;
  phase: string;
  timestamp: number;
  data: any;
  status: 'active' | 'committed';
  completed?: number;
}

export interface RollbackRecord {
  id: string;
  targetId: string;
  rollbackType: string;
  phase: string | null;
  timestamp: number;
  status: string;
}

export interface FileOperation {
  id: string;
  operation: 'create' | 'modify' | 'delete';
  filePath: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface StateData {
  version: string;
  created: number;
  lastActivity: number;
  rollbackPoints: RollbackPoint[];
  checkpoints: Checkpoint[];
  rollbackHistory: RollbackRecord[];
  fileOperations: FileOperation[];
  currentPhase: string;
  phaseHistory: { phase: string; timestamp: number }[];
  lastValidation?: number;
}

export interface InitializationStats {
  rollbackPoints: number;
  checkpoints: number;
  rollbackHistory: number;
  fileOperations: number;
  currentPhase: string;
  lastActivity: number;
  phaseHistory: { phase: string; timestamp: number }[];
}

export interface StateValidationResult {
  valid: boolean;
  issues: string[];
}

export interface StateExportResult {
  success: boolean;
  data?: StateData;
  timestamp?: number;
  error?: string;
}

export interface GenericResult {
  success: boolean;
  errors: string[];
  warnings?: string[];
}

export interface CleanupResult extends GenericResult {
  cleaned: string[];
}

export interface CheckpointResult extends GenericResult {
  id: string | null;
  checkpointId?: string | null;
}

export interface StateCleanupResult extends GenericResult {
  cleaned: number;
}

export interface ValidationResult extends GenericResult {
  checks?: {
    backup?: GenericResult;
    stateTracking?: GenericResult;
    recovery?: GenericResult;
  };
}

export interface FileOperationResult {
  success: boolean;
  fileInfo?: FileInfo | null;
  dirInfo?: DirectoryInfo | null;
  error?: string;
  description?: string;
}

export interface RecoveryAction {
  type: string;
  path?: string;
  backup?: string;
}

export interface RecoveryResult extends RollbackResult {
  recoveryActions?: string[];
}

export interface ListResult extends GenericResult {
  rollbackPoints: RollbackPoint[];
  checkpoints: Checkpoint[];
}