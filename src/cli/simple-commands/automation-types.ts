/**
 * TypeScript type definitions and enums for the automation system
 * 
 * This file provides comprehensive types for:
 * - Task complexity levels
 * - Project types and requirements
 * - Agent configurations
 * - Workflow templates
 * - Priority levels
 */

// ===== ENUMS =====

/**
 * Task complexity levels for auto-agent spawning
 */
export enum ComplexityLevel {
  LOW = 'low',
  SIMPLE = 'simple',
  MEDIUM = 'medium',
  MODERATE = 'moderate',
  HIGH = 'high',
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise',
  MASSIVE = 'massive'
}

/**
 * Requirement types for smart spawning
 */
export enum RequirementType {
  GENERAL_DEVELOPMENT = 'general-development',
  WEB_DEVELOPMENT = 'web-development',
  DATA_ANALYSIS = 'data-analysis',
  ENTERPRISE_API = 'enterprise-api',
  DEVELOPMENT = 'development',
  CODING = 'coding',
  RESEARCH = 'research',
  ANALYSIS = 'analysis',
  ENTERPRISE = 'enterprise',
  PRODUCTION = 'production'
}

/**
 * Project types for workflow selection
 */
export enum ProjectType {
  WEB_APP = 'web-app',
  API = 'api',
  DATA_ANALYSIS = 'data-analysis',
  ENTERPRISE = 'enterprise',
  GENERAL = 'general'
}

/**
 * Priority levels for optimization
 */
export enum Priority {
  SPEED = 'speed',
  QUALITY = 'quality',
  COST = 'cost',
  BALANCED = 'balanced'
}

/**
 * Agent types for configuration
 */
export enum AgentType {
  COORDINATOR = 'coordinator',
  DEVELOPER = 'developer',
  CODER = 'coder',
  RESEARCHER = 'researcher',
  ANALYZER = 'analyzer',
  ANALYST = 'analyst',
  TESTER = 'tester',
  ARCHITECT = 'architect',
  REVIEWER = 'reviewer',
  MONITOR = 'monitor'
}

// ===== TYPE DEFINITIONS =====

/**
 * Configuration for agent counts by type
 */
export interface AgentConfiguration {
  coordinator: number;
  developer?: number;
  coder?: number;
  researcher?: number;
  analyzer?: number;
  analyst?: number;
  tester?: number;
  architect?: number;
  reviewer?: number;
  monitor?: number;
  total: number;
}

/**
 * Command line options for auto-agent command
 */
export interface AutoAgentOptions {
  'task-complexity'?: string;
  complexity?: string;
  'swarm-id'?: string;
  swarmId?: string;
  help?: boolean;
  h?: boolean;
}

/**
 * Command line options for smart-spawn command
 */
export interface SmartSpawnOptions {
  requirement?: string;
  'max-agents'?: string;
  maxAgents?: string;
  help?: boolean;
  h?: boolean;
}

/**
 * Command line options for workflow-select command
 */
export interface WorkflowSelectOptions {
  'project-type'?: string;
  project?: string;
  priority?: string;
  help?: boolean;
  h?: boolean;
}

/**
 * Recommended agent configuration with reasoning
 */
export interface RecommendedAgent {
  type: string;
  count: number;
  reason: string;
}

/**
 * Workflow template definition
 */
export interface WorkflowTemplate {
  phases: string[];
  agents: Record<string, number>;
  duration: string;
  description?: string;
  estimatedCost?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

/**
 * Collection of all workflow templates
 */
export interface WorkflowTemplates {
  [ProjectType.WEB_APP]: WorkflowTemplate;
  [ProjectType.API]: WorkflowTemplate;
  [ProjectType.DATA_ANALYSIS]: WorkflowTemplate;
  [ProjectType.ENTERPRISE]: WorkflowTemplate;
  [ProjectType.GENERAL]: WorkflowTemplate;
}

/**
 * Complete automation command structure
 */
export interface AutomationCommand {
  subcommand: string;
  flags: AutoAgentOptions | SmartSpawnOptions | WorkflowSelectOptions;
}

/**
 * Agent capability requirements
 */
export interface AgentCapabilityRequirement {
  type: AgentType;
  count: number;
  capabilities: string[];
  priority: 'required' | 'preferred' | 'optional';
  reason: string;
}

/**
 * Workflow phase definition
 */
export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  dependencies: string[];
  estimatedDuration: number; // in hours
  agentRequirements: AgentCapabilityRequirement[];
  deliverables: string[];
}

/**
 * Enhanced workflow template with detailed phase information
 */
export interface EnhancedWorkflowTemplate extends Omit<WorkflowTemplate, 'phases'> {
  phases: WorkflowPhase[];
  totalEstimatedHours: number;
  criticalPath: string[];
  milestones: Array<{
    name: string;
    phaseId: string;
    description: string;
  }>;
}

/**
 * Optimization configuration for priorities
 */
export interface OptimizationConfig {
  priority: Priority;
  adjustments: {
    agentMultiplier?: number;
    parallelExecution?: boolean;
    qualityGates?: number;
    testingCoverage?: number;
    reviewStages?: number;
    costReduction?: number;
  };
  description: string;
}

/**
 * Resource constraints for spawning
 */
export interface ResourceConstraints {
  maxAgents: number;
  maxCost?: number;
  maxDuration?: number; // in hours
  availableSkills: string[];
  requiredTools: string[];
  environmentConstraints?: Record<string, any>;
}

/**
 * Spawning result with metadata
 */
export interface SpawningResult {
  success: boolean;
  agentConfiguration: AgentConfiguration;
  estimatedCost: number;
  estimatedDuration: number;
  recommendations: string[];
  warnings: string[];
  errors?: string[];
  metadata: {
    swarmId: string;
    timestamp: Date;
    complexity: string;
    strategy: string;
  };
}

// ===== VALIDATION SCHEMAS =====

/**
 * Validation schema for complexity levels
 */
export const COMPLEXITY_LEVELS = Object.values(ComplexityLevel);

/**
 * Validation schema for requirement types
 */
export const REQUIREMENT_TYPES = Object.values(RequirementType);

/**
 * Validation schema for project types
 */
export const PROJECT_TYPES = Object.values(ProjectType);

/**
 * Validation schema for priorities
 */
export const PRIORITIES = Object.values(Priority);

// ===== TYPE GUARDS =====

/**
 * Type guard for complexity level
 */
export function isComplexityLevel(value: string): value is ComplexityLevel {
  return COMPLEXITY_LEVELS.includes(value as ComplexityLevel);
}

/**
 * Type guard for requirement type
 */
export function isRequirementType(value: string): value is RequirementType {
  return REQUIREMENT_TYPES.includes(value as RequirementType);
}

/**
 * Type guard for project type
 */
export function isProjectType(value: string): value is ProjectType {
  return PROJECT_TYPES.includes(value as ProjectType);
}

/**
 * Type guard for priority
 */
export function isPriority(value: string): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

/**
 * Type guard for auto-agent options
 */
export function isAutoAgentOptions(options: any): options is AutoAgentOptions {
  return options && (
    options['task-complexity'] !== undefined ||
    options.complexity !== undefined ||
    options['swarm-id'] !== undefined ||
    options.swarmId !== undefined ||
    options.help !== undefined ||
    options.h !== undefined
  );
}

/**
 * Type guard for smart-spawn options
 */
export function isSmartSpawnOptions(options: any): options is SmartSpawnOptions {
  return options && (
    options.requirement !== undefined ||
    options['max-agents'] !== undefined ||
    options.maxAgents !== undefined ||
    options.help !== undefined ||
    options.h !== undefined
  );
}

/**
 * Type guard for workflow-select options
 */
export function isWorkflowSelectOptions(options: any): options is WorkflowSelectOptions {
  return options && (
    options['project-type'] !== undefined ||
    options.project !== undefined ||
    options.priority !== undefined ||
    options.help !== undefined ||
    options.h !== undefined
  );
}

// ===== CONSTANTS =====

/**
 * Default configuration values
 */
export const AUTOMATION_DEFAULTS = {
  COMPLEXITY: ComplexityLevel.MEDIUM,
  MAX_AGENTS: 10,
  PROJECT_TYPE: ProjectType.GENERAL,
  PRIORITY: Priority.BALANCED,
  SWARM_ID_PREFIX: 'swarm',
  SIMULATION_DELAY: {
    AUTO_AGENT: 1500,
    SMART_SPAWN: 1000,
    WORKFLOW_SELECT: 800
  }
} as const;

/**
 * Agent count limits by complexity
 */
export const COMPLEXITY_LIMITS = {
  [ComplexityLevel.LOW]: { min: 1, max: 3 },
  [ComplexityLevel.SIMPLE]: { min: 1, max: 3 },
  [ComplexityLevel.MEDIUM]: { min: 3, max: 6 },
  [ComplexityLevel.MODERATE]: { min: 3, max: 6 },
  [ComplexityLevel.HIGH]: { min: 6, max: 12 },
  [ComplexityLevel.COMPLEX]: { min: 6, max: 12 },
  [ComplexityLevel.ENTERPRISE]: { min: 10, max: 20 },
  [ComplexityLevel.MASSIVE]: { min: 10, max: 20 }
} as const;

// ===== ERROR TYPES =====

/**
 * Custom error for automation operations
 */
export class AutomationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AutomationError';
  }
}

/**
 * Validation error for automation parameters
 */
export class AutomationValidationError extends AutomationError {
  constructor(message: string, public field: string, public value: any) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'AutomationValidationError';
  }
}

/**
 * Resource constraint error
 */
export class ResourceConstraintError extends AutomationError {
  constructor(message: string, public constraint: string, public requested: any, public available: any) {
    super(message, 'RESOURCE_CONSTRAINT_ERROR', { constraint, requested, available });
    this.name = 'ResourceConstraintError';
  }
}