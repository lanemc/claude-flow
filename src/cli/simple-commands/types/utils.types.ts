/**
 * @fileoverview Utility types and type guards for Claude Flow
 * @author Claude TypeScript Architect Agent
 * @version 1.0.0
 */

import type {
  HookType,
  AgentType,
  Status,
  Priority,
  LogLevel,
  SafetyLevel,
  ComplexityLevel,
  ProjectType,
  Strategy,
  HookConfiguration,
  HookExecutionResult,
  AgentConfiguration,
  ValidationResult,
  SafetyValidationResult
} from './hooks.types.js';

// ================================
// TYPE GUARDS
// ================================

/**
 * Type guard to check if a string is a valid HookType
 */
export function isHookType(value: string): value is HookType {
  return Object.values(HookType).includes(value as HookType);
}

/**
 * Type guard to check if a string is a valid AgentType
 */
export function isAgentType(value: string): value is AgentType {
  return Object.values(AgentType).includes(value as AgentType);
}

/**
 * Type guard to check if a string is a valid Status
 */
export function isStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}

/**
 * Type guard to check if a string is a valid Priority
 */
export function isPriority(value: string): value is Priority {
  return Object.values(Priority).includes(value as Priority);
}

/**
 * Type guard to check if a string is a valid LogLevel
 */
export function isLogLevel(value: string): value is LogLevel {
  return Object.values(LogLevel).includes(value as LogLevel);
}

/**
 * Type guard to check if a string is a valid SafetyLevel
 */
export function isSafetyLevel(value: string): value is SafetyLevel {
  return Object.values(SafetyLevel).includes(value as SafetyLevel);
}

/**
 * Type guard to check if a string is a valid ComplexityLevel
 */
export function isComplexityLevel(value: string): value is ComplexityLevel {
  return Object.values(ComplexityLevel).includes(value as ComplexityLevel);
}

/**
 * Type guard to check if a string is a valid ProjectType
 */
export function isProjectType(value: string): value is ProjectType {
  return Object.values(ProjectType).includes(value as ProjectType);
}

/**
 * Type guard to check if a string is a valid Strategy
 */
export function isStrategy(value: string): value is Strategy {
  return Object.values(Strategy).includes(value as Strategy);
}

/**
 * Type guard to check if an object is a valid HookConfiguration
 */
export function isHookConfiguration(obj: unknown): obj is HookConfiguration {
  if (typeof obj !== 'object' || obj === null) return false;
  const hook = obj as Record<string, unknown>;
  
  return (
    typeof hook.id === 'string' &&
    isHookType(hook.type as string) &&
    typeof hook.enabled === 'boolean' &&
    isPriority(hook.priority as string)
  );
}

/**
 * Type guard to check if an object is a valid HookExecutionResult
 */
export function isHookExecutionResult(obj: unknown): obj is HookExecutionResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const result = obj as Record<string, unknown>;
  
  return (
    typeof result.success === 'boolean' &&
    typeof result.hookId === 'string' &&
    isHookType(result.hookType as string) &&
    typeof result.duration === 'number' &&
    typeof result.timestamp === 'string'
  );
}

/**
 * Type guard to check if an object is a valid AgentConfiguration
 */
export function isAgentConfiguration(obj: unknown): obj is AgentConfiguration {
  if (typeof obj !== 'object' || obj === null) return false;
  const agent = obj as Record<string, unknown>;
  
  return (
    typeof agent.id === 'string' &&
    typeof agent.name === 'string' &&
    isAgentType(agent.type as string) &&
    Array.isArray(agent.capabilities) &&
    isStatus(agent.status as string) &&
    typeof agent.swarmId === 'string' &&
    typeof agent.spawnedAt === 'string'
  );
}

/**
 * Type guard to check if an object is a valid ValidationResult
 */
export function isValidationResult(obj: unknown): obj is ValidationResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const result = obj as Record<string, unknown>;
  
  return (
    typeof result.valid === 'boolean' &&
    Array.isArray(result.errors) &&
    Array.isArray(result.warnings)
  );
}

/**
 * Type guard to check if an object is a valid SafetyValidationResult
 */
export function isSafetyValidationResult(obj: unknown): obj is SafetyValidationResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const result = obj as Record<string, unknown>;
  
  return (
    typeof result.safe === 'boolean' &&
    isSafetyLevel(result.level as string) &&
    Array.isArray(result.warnings) &&
    Array.isArray(result.errors)
  );
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Convert string to HookType with validation
 */
export function toHookType(value: string): HookType | null {
  return isHookType(value) ? value : null;
}

/**
 * Convert string to AgentType with validation
 */
export function toAgentType(value: string): AgentType | null {
  return isAgentType(value) ? value : null;
}

/**
 * Convert string to Status with validation
 */
export function toStatus(value: string): Status | null {
  return isStatus(value) ? value : null;
}

/**
 * Convert string to Priority with validation
 */
export function toPriority(value: string): Priority | null {
  return isPriority(value) ? value : null;
}

/**
 * Convert string to LogLevel with validation
 */
export function toLogLevel(value: string): LogLevel | null {
  return isLogLevel(value) ? value : null;
}

/**
 * Get all possible values for an enum
 */
export function getEnumValues<T extends Record<string, string>>(enumObject: T): T[keyof T][] {
  return Object.values(enumObject);
}

/**
 * Normalize HookType string (handle aliases)
 */
export function normalizeHookType(value: string): HookType | null {
  const normalized = value.toLowerCase().replace(/_/g, '-');
  
  // Handle aliases
  const aliasMap: Record<string, HookType> = {
    'pre-command': HookType.PRE_BASH,
    'post-command': HookType.POST_BASH,
    'notify': HookType.NOTIFICATION,
    'notification': HookType.NOTIFICATION
  };
  
  if (aliasMap[normalized]) {
    return aliasMap[normalized];
  }
  
  return toHookType(normalized as HookType);
}

/**
 * Check if a hook type is a pre-operation hook
 */
export function isPreHook(hookType: HookType): boolean {
  return [
    HookType.PRE_TASK,
    HookType.PRE_EDIT,
    HookType.PRE_BASH,
    HookType.PRE_COMMAND,
    HookType.PRE_SEARCH
  ].includes(hookType);
}

/**
 * Check if a hook type is a post-operation hook
 */
export function isPostHook(hookType: HookType): boolean {
  return [
    HookType.POST_TASK,
    HookType.POST_EDIT,
    HookType.POST_BASH,
    HookType.POST_COMMAND,
    HookType.POST_SEARCH
  ].includes(hookType);
}

/**
 * Check if a hook type is an MCP integration hook
 */
export function isMcpHook(hookType: HookType): boolean {
  return [
    HookType.MCP_INITIALIZED,
    HookType.AGENT_SPAWNED,
    HookType.TASK_ORCHESTRATED,
    HookType.NEURAL_TRAINED
  ].includes(hookType);
}

/**
 * Check if a hook type is a session hook
 */
export function isSessionHook(hookType: HookType): boolean {
  return [
    HookType.SESSION_START,
    HookType.SESSION_END,
    HookType.SESSION_RESTORE,
    HookType.NOTIFICATION
  ].includes(hookType);
}

/**
 * Check if a hook type is potentially dangerous (e.g., Stop hooks)
 */
export function isDangerousHook(hookType: HookType): boolean {
  return [
    HookType.STOP,
    HookType.SUBAGENT_STOP,
    HookType.POST_TOOL_USE
  ].includes(hookType);
}

/**
 * Get recommended agent types for a project type
 */
export function getRecommendedAgents(projectType: ProjectType): AgentType[] {
  const recommendations: Record<ProjectType, AgentType[]> = {
    [ProjectType.WEB_APP]: [
      AgentType.COORDINATOR,
      AgentType.FRONTEND_DEVELOPER,
      AgentType.BACKEND_DEVELOPER,
      AgentType.TESTER
    ],
    [ProjectType.API]: [
      AgentType.COORDINATOR,
      AgentType.BACKEND_DEVELOPER,
      AgentType.TESTER,
      AgentType.TECHNICAL_WRITER
    ],
    [ProjectType.DATA_ANALYSIS]: [
      AgentType.COORDINATOR,
      AgentType.RESEARCHER,
      AgentType.ANALYST,
      AgentType.PYTHON_DEVELOPER
    ],
    [ProjectType.ENTERPRISE]: [
      AgentType.COORDINATOR,
      AgentType.ARCHITECT,
      AgentType.DEVELOPER,
      AgentType.TESTER,
      AgentType.DEVOPS_ENGINEER
    ],
    [ProjectType.GENERAL]: [
      AgentType.COORDINATOR,
      AgentType.DEVELOPER,
      AgentType.RESEARCHER
    ],
    [ProjectType.MOBILE_APP]: [
      AgentType.COORDINATOR,
      AgentType.DEVELOPER,
      AgentType.FRONTEND_DEVELOPER,
      AgentType.TESTER
    ],
    [ProjectType.DESKTOP_APP]: [
      AgentType.COORDINATOR,
      AgentType.DEVELOPER,
      AgentType.FRONTEND_DEVELOPER,
      AgentType.TESTER
    ],
    [ProjectType.MICROSERVICE]: [
      AgentType.COORDINATOR,
      AgentType.BACKEND_DEVELOPER,
      AgentType.DEVOPS_ENGINEER,
      AgentType.TESTER
    ],
    [ProjectType.LIBRARY]: [
      AgentType.COORDINATOR,
      AgentType.DEVELOPER,
      AgentType.TESTER,
      AgentType.TECHNICAL_WRITER
    ],
    [ProjectType.TOOL]: [
      AgentType.COORDINATOR,
      AgentType.DEVELOPER,
      AgentType.TESTER
    ]
  };
  
  return recommendations[projectType] || recommendations[ProjectType.GENERAL];
}

/**
 * Get file extension to agent type mapping
 */
export function getAgentTypeForFileExtension(extension: string): AgentType | null {
  const mapping: Record<string, AgentType> = {
    '.js': AgentType.JAVASCRIPT_DEVELOPER,
    '.jsx': AgentType.JAVASCRIPT_DEVELOPER,
    '.ts': AgentType.TYPESCRIPT_DEVELOPER,
    '.tsx': AgentType.TYPESCRIPT_DEVELOPER,
    '.py': AgentType.PYTHON_DEVELOPER,
    '.go': AgentType.GOLANG_DEVELOPER,
    '.rs': AgentType.RUST_DEVELOPER,
    '.java': AgentType.JAVA_DEVELOPER,
    '.cpp': AgentType.CPP_DEVELOPER,
    '.c': AgentType.C_DEVELOPER,
    '.css': AgentType.FRONTEND_DEVELOPER,
    '.scss': AgentType.FRONTEND_DEVELOPER,
    '.html': AgentType.FRONTEND_DEVELOPER,
    '.vue': AgentType.FRONTEND_DEVELOPER,
    '.react': AgentType.FRONTEND_DEVELOPER,
    '.md': AgentType.TECHNICAL_WRITER,
    '.yml': AgentType.DEVOPS_ENGINEER,
    '.yaml': AgentType.DEVOPS_ENGINEER,
    '.json': AgentType.CONFIG_SPECIALIST,
    '.sql': AgentType.DATABASE_EXPERT,
    '.sh': AgentType.SYSTEM_ADMIN,
    '.dockerfile': AgentType.DEVOPS_ENGINEER,
    '.docker': AgentType.DEVOPS_ENGINEER
  };
  
  return mapping[extension.toLowerCase()] || null;
}

/**
 * Validate and normalize flags object
 */
export function normalizeFlags(flags: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(flags)) {
    // Convert camelCase to kebab-case for consistency
    const normalizedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    
    // Handle boolean flags
    if (typeof value === 'string' && (value === 'true' || value === 'false')) {
      normalized[normalizedKey] = value === 'true';
    } else {
      normalized[normalizedKey] = value;
    }
  }
  
  return normalized;
}

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix = 'id'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Get current ISO date string
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

/**
 * Check if a value is a valid ISO date string
 */
export function isISODateString(value: string): boolean {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime()) && value === date.toISOString();
}

// ================================
// VALIDATION HELPERS
// ================================

/**
 * Validate hook configuration object
 */
export function validateHookConfiguration(config: unknown): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  
  if (!isHookConfiguration(config)) {
    errors.push({
      code: 'INVALID_HOOK_CONFIG',
      message: 'Invalid hook configuration object',
      field: 'root'
    });
    return { valid: false, errors, warnings };
  }
  
  // Additional validations can be added here
  
  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate agent configuration object
 */
export function validateAgentConfiguration(config: unknown): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];
  
  if (!isAgentConfiguration(config)) {
    errors.push({
      code: 'INVALID_AGENT_CONFIG',
      message: 'Invalid agent configuration object',
      field: 'root'
    });
    return { valid: false, errors, warnings };
  }
  
  // Additional validations can be added here
  
  return { valid: errors.length === 0, errors, warnings };
}

// ================================
// EXPORT ALL UTILITIES
// ================================

export const TypeUtils = {
  // Type guards
  isHookType,
  isAgentType,
  isStatus,
  isPriority,
  isLogLevel,
  isSafetyLevel,
  isComplexityLevel,
  isProjectType,
  isStrategy,
  isHookConfiguration,
  isHookExecutionResult,
  isAgentConfiguration,
  isValidationResult,
  isSafetyValidationResult,
  
  // Converters
  toHookType,
  toAgentType,
  toStatus,
  toPriority,
  toLogLevel,
  
  // Utilities
  getEnumValues,
  normalizeHookType,
  isPreHook,
  isPostHook,
  isMcpHook,
  isSessionHook,
  isDangerousHook,
  getRecommendedAgents,
  getAgentTypeForFileExtension,
  normalizeFlags,
  generateId,
  getCurrentISOString,
  isISODateString,
  
  // Validators
  validateHookConfiguration,
  validateAgentConfiguration
};

export default TypeUtils;