/**
 * TypeScript type definitions for SPARC modes system
 * Generated for conversion from JavaScript to TypeScript
 */

// ============================================================================
// SPARC ORCHESTRATION TYPES
// ============================================================================

export type OrchestrationFunction = (taskDescription: string, memoryNamespace: string) => string;

export interface SparcModeOrchestrations {
  [modeSlug: string]: OrchestrationFunction;
}

// ============================================================================
// INDIVIDUAL SPARC MODE TYPES
// ============================================================================

export interface ArchitectMode {
  getArchitectOrchestration: OrchestrationFunction;
}

export interface CodeMode {
  getCodeOrchestration: OrchestrationFunction;
}

export interface TddMode {
  getTddOrchestration: OrchestrationFunction;
}

export interface DebugMode {
  getDebugOrchestration: OrchestrationFunction;
}

export interface SecurityReviewMode {
  getSecurityReviewOrchestration: OrchestrationFunction;
}

export interface DocsWriterMode {
  getDocsWriterOrchestration: OrchestrationFunction;
}

export interface IntegrationMode {
  getIntegrationOrchestration: OrchestrationFunction;
}

export interface MonitoringMode {
  getMonitoringOrchestration: OrchestrationFunction;
}

export interface OptimizationMode {
  getOptimizationOrchestration: OrchestrationFunction;
}

export interface SupabaseAdminMode {
  getSupabaseAdminOrchestration: OrchestrationFunction;
}

export interface SpecPseudocodeMode {
  getSpecPseudocodeOrchestration: OrchestrationFunction;
}

export interface McpMode {
  getMcpOrchestration: OrchestrationFunction;
}

export interface DevOpsMode {
  getDevOpsOrchestration: OrchestrationFunction;
}

export interface AskMode {
  getAskOrchestration: OrchestrationFunction;
}

export interface TutorialMode {
  getTutorialOrchestration: OrchestrationFunction;
}

export interface SparcOrchestratorMode {
  getSparcOrchestratorOrchestration: OrchestrationFunction;
}

export interface GenericMode {
  getGenericOrchestration: OrchestrationFunction;
}

export interface SwarmMode {
  getSwarmOrchestration: OrchestrationFunction;
}

// ============================================================================
// SPARC PROMPT CREATION TYPES
// ============================================================================

export interface SparcPromptParams {
  mode: {
    name: string;
    slug: string;
    roleDefinition: string;
    customInstructions: string;
  };
  taskDescription: string;
  memoryNamespace: string;
  currentWorkingDirectory?: string;
}

export interface SparcPromptResult {
  prompt: string;
  orchestration: string;
  workingDirectory: string;
}

// ============================================================================
// SPARC MODE EXECUTION TYPES
// ============================================================================

export interface SparcExecutionContext {
  modeSlug: string;
  taskDescription: string;
  memoryNamespace: string;
  workingDirectory: string;
  orchestrationTemplate: string;
  fullPrompt: string;
}

export interface SparcMemoryOperations {
  storeProgress(namespace: string, phase: string, description: string): Promise<void>;
  queryContext(namespace: string): Promise<string>;
  storeRequirements(namespace: string, requirements: string): Promise<void>;
  storeArchitecture(namespace: string, architecture: string): Promise<void>;
  storeTechSpecs(namespace: string, specs: string): Promise<void>;
  storeImplementationPlan(namespace: string, plan: string): Promise<void>;
}

// ============================================================================
// SPARC BATCH ORCHESTRATION TYPES
// ============================================================================

export interface SparcBatchExecution {
  mode: 'parallel' | 'boomerang' | 'concurrent';
  maxParallel?: number;
  phases?: SparcBatchPhase[];
  commands: SparcBatchCommand[];
}

export interface SparcBatchPhase {
  name: string;
  description: string;
  command: SparcBatchCommand;
  dependsOn?: string[];
}

export interface SparcBatchCommand {
  mode: string;
  taskDescription: string;
  flags: string[];
  namespace?: string;
  timeout?: number;
}

export interface SparcBoomerangPattern {
  research: SparcBatchCommand;
  design: SparcBatchCommand;
  implementation: SparcBatchCommand;
  testing: SparcBatchCommand;
  refinement: SparcBatchCommand;
  loopBack?: boolean;
}

// ============================================================================
// SPARC ORCHESTRATION TEMPLATES
// ============================================================================

export interface SparcOrchestrationStep {
  name: string;
  duration: string;
  tasks: string[];
  memoryOperations: string[];
  outputs: string[];
}

export interface SparcOrchestrationPlan {
  mode: string;
  steps: SparcOrchestrationStep[];
  totalDuration: string;
  prerequisites: string[];
  deliverables: string[];
}

// ============================================================================
// SPARC DIRECTORY AND FILE MANAGEMENT
// ============================================================================

export interface SparcDirectoryRules {
  currentWorkingDirectory: string;
  allowedDirectories: string[];
  forbiddenDirectories: string[];
  projectStructure: SparcProjectStructure;
}

export interface SparcProjectStructure {
  baseDirectory: string;
  subdirectories: string[];
  fileTemplates: { [filename: string]: string };
  configFiles: string[];
}

// ============================================================================
// SPARC QUALITY STANDARDS
// ============================================================================

export interface SparcQualityStandards {
  maxFileLines: number;
  forbiddenPatterns: string[];
  requiredPatterns: string[];
  securityRules: SparcSecurityRules;
  codeStandards: SparcCodeStandards;
}

export interface SparcSecurityRules {
  noHardcodedSecrets: boolean;
  useEnvironmentVariables: boolean;
  configFileManagement: boolean;
  authenticationRequired: boolean;
}

export interface SparcCodeStandards {
  maintainability: boolean;
  documentation: boolean;
  testing: boolean;
  errorHandling: boolean;
  performanceConsiderations: boolean;
}

// ============================================================================
// SPARC INTEGRATION TYPES
// ============================================================================

export interface SparcClaudeFlowIntegration {
  memoryOperations: SparcMemoryOperations;
  taskOrchestration: SparcTaskOrchestration;
  parallelExecution: SparcParallelExecution;
}

export interface SparcTaskOrchestration {
  checkSystemStatus(): Promise<string>;
  listActiveAgents(): Promise<string[]>;
  monitorProgress(): Promise<SparcProgressReport>;
}

export interface SparcParallelExecution {
  runParallel(commands: SparcBatchCommand[]): Promise<SparcBatchResult[]>;
  runBoomerang(pattern: SparcBoomerangPattern): Promise<SparcBoomerangResult>;
  runConcurrent(commands: SparcBatchCommand[], maxParallel: number): Promise<SparcBatchResult[]>;
}

export interface SparcProgressReport {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  failedTasks: number;
  agents: SparcAgentStatus[];
}

export interface SparcAgentStatus {
  id: string;
  mode: string;
  status: 'active' | 'idle' | 'error';
  currentTask?: string;
  progress: number;
}

export interface SparcBatchResult {
  command: SparcBatchCommand;
  success: boolean;
  output: string;
  error?: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface SparcBoomerangResult {
  phases: { [phaseName: string]: SparcBatchResult };
  totalDuration: number;
  success: boolean;
  iterationCount: number;
  feedbackLoop: string[];
}

// ============================================================================
// SPARC MODE SPECIFIC TYPES
// ============================================================================

export interface ArchitectOrchestrationPlan extends SparcOrchestrationPlan {
  requirementsAnalysis: SparcOrchestrationStep;
  systemArchitectureDesign: SparcOrchestrationStep;
  technicalSpecifications: SparcOrchestrationStep;
  modularImplementationPlan: SparcOrchestrationStep;
  directorySafety: SparcOrchestrationStep;
}

export interface CodeOrchestrationPlan extends SparcOrchestrationPlan {
  codeImplementation: SparcOrchestrationStep;
  testing: SparcOrchestrationStep;
  documentation: SparcOrchestrationStep;
  errorHandling: SparcOrchestrationStep;
}

export interface TddOrchestrationPlan extends SparcOrchestrationPlan {
  redPhase: SparcOrchestrationStep;
  greenPhase: SparcOrchestrationStep;
  refactorPhase: SparcOrchestrationStep;
  integrationTesting: SparcOrchestrationStep;
}

// ============================================================================
// EXPORT MAIN FUNCTIONS
// ============================================================================

export interface SparcModeSystem {
  getModeOrchestration(modeSlug: string, taskDescription: string, memoryNamespace: string): string;
  createSparcPrompt(
    mode: { name: string; slug: string; roleDefinition: string; customInstructions: string },
    taskDescription: string,
    memoryNamespace: string
  ): string;
  getAllModes(): string[];
  validateMode(modeSlug: string): boolean;
  getDefaultOrchestration(taskDescription: string, memoryNamespace: string): string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export {
  OrchestrationFunction,
  SparcModeOrchestrations,
  ArchitectMode,
  CodeMode,
  TddMode,
  DebugMode,
  SecurityReviewMode,
  DocsWriterMode,
  IntegrationMode,
  MonitoringMode,
  OptimizationMode,
  SupabaseAdminMode,
  SpecPseudocodeMode,
  McpMode,
  DevOpsMode,
  AskMode,
  TutorialMode,
  SparcOrchestratorMode,
  GenericMode,
  SwarmMode,
  SparcPromptParams,
  SparcPromptResult,
  SparcExecutionContext,
  SparcMemoryOperations,
  SparcBatchExecution,
  SparcBatchPhase,
  SparcBatchCommand,
  SparcBoomerangPattern,
  SparcOrchestrationStep,
  SparcOrchestrationPlan,
  SparcDirectoryRules,
  SparcProjectStructure,
  SparcQualityStandards,
  SparcSecurityRules,
  SparcCodeStandards,
  SparcClaudeFlowIntegration,
  SparcTaskOrchestration,
  SparcParallelExecution,
  SparcProgressReport,
  SparcAgentStatus,
  SparcBatchResult,
  SparcBoomerangResult,
  ArchitectOrchestrationPlan,
  CodeOrchestrationPlan,
  TddOrchestrationPlan,
  SparcModeSystem,
};