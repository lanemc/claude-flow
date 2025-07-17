/**
 * @fileoverview Main entry point for Claude Flow TypeScript types
 * @author Claude TypeScript Architect Agent
 * @version 1.0.0
 */

// Re-export all types from hooks.types.ts
export * from './hooks.types.js';

// Re-export default export
export { default as HookSystemTypes } from './hooks.types.js';

// Convenience type exports for common use cases
export type {
  HookConfiguration,
  HookExecutionResult,
  HookContext,
  AgentConfiguration,
  AutomationWorkflow,
  SafetyValidationResult,
  AllFlags,
  HookFlags,
  AutomationFlags,
  SwarmFlags
} from './hooks.types.js';

// Enum re-exports for easy access
export {
  HookType,
  AgentType,
  Status,
  Priority,
  LogLevel,
  SafetyLevel,
  ComplexityLevel,
  ProjectType,
  Strategy
} from './hooks.types.js';