/**
 * Workflow Orchestration TypeScript Interfaces
 * For swarm-based task coordination and orchestration
 */

// ===== Core Workflow Types =====

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  type: WorkflowType;
  phases: WorkflowPhase[];
  dependencies: WorkflowDependency[];
  triggers: WorkflowTrigger[];
  variables: WorkflowVariable[];
  timeouts: WorkflowTimeout[];
  hooks: WorkflowHook[];
  metadata: WorkflowMetadata;
}

export type WorkflowType = 
  | 'sparc'
  | 'development'
  | 'deployment'
  | 'testing'
  | 'analysis'
  | 'maintenance'
  | 'research'
  | 'custom';

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  type: PhaseType;
  order: number;
  tasks: WorkflowTask[];
  conditions: Condition[];
  timeout: number;
  retryPolicy: RetryPolicy;
  rollbackPolicy: RollbackPolicy;
  hooks: PhaseHook[];
  parallel?: boolean;
  optional?: boolean;
}

export type PhaseType = 
  | 'initialization'
  | 'specification'
  | 'design'
  | 'implementation'
  | 'testing'
  | 'deployment'
  | 'validation'
  | 'cleanup'
  | 'rollback';

export interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  agent: AgentRequirement;
  inputs: TaskInput[];
  outputs: TaskOutput[];
  dependencies: string[];
  conditions: Condition[];
  timeout: number;
  retryPolicy: RetryPolicy;
  properties: TaskProperties;
  hooks: TaskHook[];
  priority: TaskPriority;
  resources: ResourceRequirement[];
}

export type TaskType = 
  | 'agent_spawn'
  | 'task_orchestrate'
  | 'memory_store'
  | 'memory_retrieve'
  | 'file_operation'
  | 'bash_command'
  | 'api_call'
  | 'validation'
  | 'notification'
  | 'wait'
  | 'script'
  | 'custom';

export interface AgentRequirement {
  type: AgentType;
  name?: string;
  capabilities: string[];
  configuration?: Record<string, any>;
  constraints?: AgentConstraint[];
}

export type AgentType = 
  | 'coordinator'
  | 'researcher'
  | 'architect'
  | 'coder'
  | 'tester'
  | 'reviewer'
  | 'analyst'
  | 'optimizer'
  | 'documenter'
  | 'monitor'
  | 'specialist'
  | 'generic';

export interface AgentConstraint {
  type: ConstraintType;
  value: any;
  operator: ComparisonOperator;
}

export type ConstraintType = 
  | 'memory_limit'
  | 'cpu_limit'
  | 'timeout'
  | 'concurrent_tasks'
  | 'skill_level'
  | 'experience';

export type ComparisonOperator = 
  | 'eq'
  | 'ne'
  | 'lt'
  | 'le'
  | 'gt'
  | 'ge'
  | 'in'
  | 'not_in'
  | 'regex'
  | 'contains';

export interface TaskInput {
  name: string;
  type: InputType;
  source: InputSource;
  required: boolean;
  default?: any;
  validation?: ValidationRule;
  transformation?: TransformationRule;
}

export type InputType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'file'
  | 'stream'
  | 'reference';

export interface InputSource {
  type: SourceType;
  location: string;
  selector?: string;
  format?: string;
}

export type SourceType = 
  | 'constant'
  | 'variable'
  | 'task_output'
  | 'phase_output'
  | 'memory'
  | 'file'
  | 'environment'
  | 'user_input';

export interface ValidationRule {
  type: ValidationType;
  parameters: Record<string, any>;
  message?: string;
}

export type ValidationType = 
  | 'required'
  | 'pattern'
  | 'range'
  | 'length'
  | 'type'
  | 'enum'
  | 'custom';

export interface TransformationRule {
  type: TransformationType;
  parameters: Record<string, any>;
}

export type TransformationType = 
  | 'format'
  | 'convert'
  | 'extract'
  | 'aggregate'
  | 'filter'
  | 'sort'
  | 'custom';

export interface TaskOutput {
  name: string;
  type: OutputType;
  destination: OutputDestination;
  format?: string;
  validation?: ValidationRule;
}

export type OutputType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'file'
  | 'stream'
  | 'artifact';

export interface OutputDestination {
  type: DestinationType;
  location: string;
  overwrite?: boolean;
  backup?: boolean;
}

export type DestinationType = 
  | 'variable'
  | 'memory'
  | 'file'
  | 'stream'
  | 'artifact'
  | 'notification';

export interface TaskProperties {
  executable?: string;
  arguments?: string[];
  environment?: Record<string, string>;
  workingDirectory?: string;
  shell?: string;
  async?: boolean;
  streaming?: boolean;
  caching?: CachingConfig;
}

export interface CachingConfig {
  enabled: boolean;
  strategy: CachingStrategy;
  duration: number;
  key?: string;
  invalidation?: InvalidationRule[];
}

export type CachingStrategy = 
  | 'none'
  | 'memory'
  | 'disk'
  | 'distributed'
  | 'hybrid';

export interface InvalidationRule {
  type: InvalidationType;
  condition: string;
  action: InvalidationAction;
}

export type InvalidationType = 
  | 'time'
  | 'dependency'
  | 'manual'
  | 'event';

export type InvalidationAction = 
  | 'remove'
  | 'refresh'
  | 'mark_stale';

export interface TaskHook {
  type: HookType;
  timing: HookTiming;
  action: HookAction;
  condition?: string;
}

export type HookType = 
  | 'pre_execution'
  | 'post_execution'
  | 'error'
  | 'success'
  | 'retry'
  | 'timeout';

export type HookTiming = 
  | 'before'
  | 'after'
  | 'on_error'
  | 'on_success'
  | 'on_retry'
  | 'on_timeout';

export interface HookAction {
  type: ActionType;
  parameters: Record<string, any>;
}

export type ActionType = 
  | 'log'
  | 'notify'
  | 'execute'
  | 'store'
  | 'transform'
  | 'validate'
  | 'rollback'
  | 'retry'
  | 'skip'
  | 'abort';

export type TaskPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'
  | 'urgent';

export interface ResourceRequirement {
  type: ResourceType;
  amount: number;
  unit: string;
  reservation?: ResourceReservation;
}

export type ResourceType = 
  | 'cpu'
  | 'memory'
  | 'storage'
  | 'network'
  | 'gpu'
  | 'custom';

export interface ResourceReservation {
  guaranteed: number;
  maximum: number;
  scalable: boolean;
}

export interface WorkflowDependency {
  id: string;
  type: DependencyType;
  source: string;
  target: string;
  condition?: string;
  timeout?: number;
}

export type DependencyType = 
  | 'finish_to_start'
  | 'start_to_start'
  | 'finish_to_finish'
  | 'start_to_finish'
  | 'conditional'
  | 'data';

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  condition: TriggerCondition;
  action: TriggerAction;
  enabled: boolean;
}

export type TriggerType = 
  | 'manual'
  | 'scheduled'
  | 'event'
  | 'webhook'
  | 'file_change'
  | 'status_change'
  | 'threshold'
  | 'api_call';

export interface TriggerCondition {
  type: ConditionType;
  expression: string;
  parameters: Record<string, any>;
}

export type ConditionType = 
  | 'always'
  | 'never'
  | 'cron'
  | 'event'
  | 'value'
  | 'state'
  | 'custom';

export interface TriggerAction {
  type: TriggerActionType;
  parameters: Record<string, any>;
}

export type TriggerActionType = 
  | 'start_workflow'
  | 'stop_workflow'
  | 'pause_workflow'
  | 'resume_workflow'
  | 'skip_task'
  | 'retry_task'
  | 'notify'
  | 'execute';

export interface WorkflowVariable {
  name: string;
  type: VariableType;
  value: any;
  scope: VariableScope;
  mutable: boolean;
  sensitive: boolean;
  description?: string;
}

export type VariableType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'secret'
  | 'reference';

export type VariableScope = 
  | 'global'
  | 'workflow'
  | 'phase'
  | 'task'
  | 'agent';

export interface WorkflowTimeout {
  type: TimeoutType;
  duration: number;
  unit: TimeUnit;
  action: TimeoutAction;
}

export type TimeoutType = 
  | 'workflow'
  | 'phase'
  | 'task'
  | 'agent'
  | 'idle';

export type TimeUnit = 
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days';

export interface TimeoutAction {
  type: TimeoutActionType;
  parameters: Record<string, any>;
}

export type TimeoutActionType = 
  | 'abort'
  | 'retry'
  | 'skip'
  | 'notify'
  | 'escalate'
  | 'rollback';

export interface WorkflowHook {
  type: WorkflowHookType;
  timing: HookTiming;
  action: HookAction;
  condition?: string;
}

export type WorkflowHookType = 
  | 'start'
  | 'end'
  | 'error'
  | 'success'
  | 'pause'
  | 'resume'
  | 'cancel';

export interface WorkflowMetadata {
  author: string;
  version: string;
  created: Date;
  modified: Date;
  description?: string;
  tags: string[];
  category?: string;
  visibility: VisibilityLevel;
  permissions: WorkflowPermission[];
}

export type VisibilityLevel = 
  | 'public'
  | 'private'
  | 'team'
  | 'organization';

export interface WorkflowPermission {
  user: string;
  role: string;
  actions: PermissionAction[];
}

export type PermissionAction = 
  | 'read'
  | 'write'
  | 'execute'
  | 'manage'
  | 'admin';

// ===== Workflow Execution Types =====

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  trigger: ExecutionTrigger;
  context: ExecutionContext;
  phases: PhaseExecution[];
  variables: Record<string, any>;
  logs: ExecutionLog[];
  metrics: ExecutionMetrics;
  error?: ExecutionError;
}

export type ExecutionStatus = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout';

export interface ExecutionTrigger {
  type: TriggerType;
  source: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface ExecutionContext {
  user: string;
  environment: string;
  version: string;
  configuration: Record<string, any>;
  resources: ResourceAllocation[];
}

export interface ResourceAllocation {
  type: ResourceType;
  allocated: number;
  used: number;
  available: number;
  unit: string;
}

export interface PhaseExecution {
  id: string;
  phaseId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  tasks: TaskExecution[];
  logs: ExecutionLog[];
  metrics: PhaseMetrics;
  error?: ExecutionError;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  agent: AgentExecution;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  logs: ExecutionLog[];
  metrics: TaskMetrics;
  error?: ExecutionError;
  retryCount?: number;
}

export interface AgentExecution {
  id: string;
  type: AgentType;
  name: string;
  capabilities: string[];
  configuration: Record<string, any>;
  status: AgentStatus;
  startTime: Date;
  endTime?: Date;
  tasks: string[];
  metrics: AgentMetrics;
  error?: ExecutionError;
}

export type AgentStatus = 
  | 'idle'
  | 'busy'
  | 'waiting'
  | 'error'
  | 'terminated';

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  data?: Record<string, any>;
  correlationId?: string;
}

export type LogLevel = 
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export interface ExecutionMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  skipppedTasks: number;
  averageTaskDuration: number;
  resourceUtilization: ResourceUtilization[];
  throughput: number;
  errorRate: number;
}

export interface ResourceUtilization {
  type: ResourceType;
  average: number;
  peak: number;
  unit: string;
}

export interface PhaseMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  parallelTasks: number;
  waitTime: number;
  executionTime: number;
  efficiency: number;
}

export interface TaskMetrics {
  executionTime: number;
  waitTime: number;
  inputSize: number;
  outputSize: number;
  memoryUsage: number;
  cpuUsage: number;
  networkUsage: number;
  cacheHitRate?: number;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksFailed: number;
  averageTaskDuration: number;
  memoryUsage: number;
  cpuUsage: number;
  efficiency: number;
  uptime: number;
  errorRate: number;
}

export interface ExecutionError {
  code: string;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  timestamp: Date;
  source: string;
  details?: Record<string, any>;
  stackTrace?: string;
  recovery?: RecoveryAction;
}

export type ErrorType = 
  | 'validation'
  | 'execution'
  | 'timeout'
  | 'resource'
  | 'network'
  | 'permission'
  | 'configuration'
  | 'system'
  | 'user';

export type ErrorSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface RecoveryAction {
  type: RecoveryType;
  description: string;
  automated: boolean;
  parameters: Record<string, any>;
}

export type RecoveryType = 
  | 'retry'
  | 'rollback'
  | 'skip'
  | 'restart'
  | 'escalate'
  | 'manual';

// ===== Workflow Orchestration Types =====

export interface WorkflowOrchestrator {
  id: string;
  name: string;
  type: OrchestratorType;
  configuration: OrchestratorConfiguration;
  capabilities: string[];
  status: OrchestratorStatus;
  workflows: WorkflowReference[];
  agents: AgentReference[];
  resources: ResourcePool[];
  metrics: OrchestratorMetrics;
}

export type OrchestratorType = 
  | 'centralized'
  | 'distributed'
  | 'hierarchical'
  | 'peer_to_peer'
  | 'hybrid';

export interface OrchestratorConfiguration {
  maxConcurrentWorkflows: number;
  maxConcurrentTasks: number;
  maxAgents: number;
  resourceLimits: Record<ResourceType, number>;
  scheduling: SchedulingConfig;
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

export interface SchedulingConfig {
  algorithm: SchedulingAlgorithm;
  priority: PriorityConfig;
  loadBalancing: LoadBalancingConfig;
  fairness: FairnessConfig;
}

export type SchedulingAlgorithm = 
  | 'fifo'
  | 'priority'
  | 'round_robin'
  | 'shortest_job_first'
  | 'least_connections'
  | 'weighted_round_robin'
  | 'custom';

export interface PriorityConfig {
  enabled: boolean;
  levels: number;
  preemption: boolean;
  aging: boolean;
}

export interface LoadBalancingConfig {
  enabled: boolean;
  algorithm: LoadBalancingAlgorithm;
  threshold: number;
  migration: boolean;
}

export type LoadBalancingAlgorithm = 
  | 'round_robin'
  | 'least_loaded'
  | 'weighted'
  | 'random'
  | 'hash';

export interface FairnessConfig {
  enabled: boolean;
  policy: FairnessPolicy;
  window: number;
  threshold: number;
}

export type FairnessPolicy = 
  | 'proportional'
  | 'absolute'
  | 'weighted'
  | 'lottery';

export interface MonitoringConfig {
  enabled: boolean;
  interval: number;
  metrics: string[];
  alerts: AlertConfig[];
  retention: number;
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  action: AlertAction;
  cooldown: number;
}

export interface AlertAction {
  type: AlertActionType;
  parameters: Record<string, any>;
}

export type AlertActionType = 
  | 'log'
  | 'email'
  | 'webhook'
  | 'slack'
  | 'sms'
  | 'custom';

export interface SecurityConfig {
  authentication: boolean;
  authorization: boolean;
  encryption: boolean;
  audit: boolean;
  isolation: IsolationConfig;
}

export interface IsolationConfig {
  enabled: boolean;
  level: IsolationLevel;
  networking: boolean;
  filesystem: boolean;
  resources: boolean;
}

export type IsolationLevel = 
  | 'none'
  | 'process'
  | 'container'
  | 'vm'
  | 'sandbox';

export type OrchestratorStatus = 
  | 'initializing'
  | 'running'
  | 'pausing'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'error';

export interface WorkflowReference {
  id: string;
  name: string;
  version: string;
  status: WorkflowStatus;
  executions: number;
  lastExecution?: Date;
}

export type WorkflowStatus = 
  | 'active'
  | 'inactive'
  | 'deprecated'
  | 'error';

export interface AgentReference {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  capabilities: string[];
  currentTask?: string;
  metrics: AgentMetrics;
}

export interface ResourcePool {
  type: ResourceType;
  total: number;
  available: number;
  allocated: number;
  reserved: number;
  unit: string;
  utilization: number;
}

export interface OrchestratorMetrics {
  uptime: number;
  totalWorkflows: number;
  completedWorkflows: number;
  failedWorkflows: number;
  averageWorkflowDuration: number;
  throughput: number;
  resourceUtilization: ResourceUtilization[];
  errorRate: number;
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  errorsPerSecond: number;
  queueSize: number;
}

// ===== Workflow Conditions and Rules =====

export interface Condition {
  id: string;
  type: ConditionType;
  expression: string;
  parameters: Record<string, any>;
  negated?: boolean;
  description?: string;
}

export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: BackoffStrategy;
  retryableErrors: string[];
  nonRetryableErrors: string[];
}

export type BackoffStrategy = 
  | 'fixed'
  | 'exponential'
  | 'linear'
  | 'custom';

export interface RollbackPolicy {
  enabled: boolean;
  automatic: boolean;
  triggers: string[];
  actions: RollbackAction[];
  verification: VerificationStep[];
}

export interface RollbackAction {
  type: RollbackActionType;
  parameters: Record<string, any>;
  order: number;
}

export type RollbackActionType = 
  | 'undo_task'
  | 'restore_state'
  | 'notify'
  | 'cleanup'
  | 'custom';

export interface VerificationStep {
  name: string;
  type: VerificationType;
  condition: string;
  timeout: number;
  required: boolean;
}

export type VerificationType = 
  | 'health_check'
  | 'data_integrity'
  | 'functional_test'
  | 'performance_test'
  | 'manual_check';

export interface PhaseHook {
  type: PhaseHookType;
  timing: HookTiming;
  action: HookAction;
  condition?: string;
}

export type PhaseHookType = 
  | 'start'
  | 'end'
  | 'error'
  | 'success'
  | 'skip'
  | 'retry';

// ===== Workflow Templates and Patterns =====

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  pattern: WorkflowPattern;
  definition: WorkflowDefinition;
  parameters: TemplateParameter[];
  examples: WorkflowExample[];
  metadata: TemplateMetadata;
}

export type WorkflowPattern = 
  | 'sequential'
  | 'parallel'
  | 'pipeline'
  | 'map_reduce'
  | 'scatter_gather'
  | 'fork_join'
  | 'state_machine'
  | 'event_driven'
  | 'saga'
  | 'choreography'
  | 'orchestration';

export interface TemplateParameter {
  name: string;
  type: ParameterType;
  required: boolean;
  default?: any;
  description: string;
  validation?: ValidationRule;
}

export type ParameterType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'enum'
  | 'file'
  | 'reference';

export interface WorkflowExample {
  name: string;
  description: string;
  parameters: Record<string, any>;
  expectedOutput: Record<string, any>;
  duration: number;
}

export interface TemplateMetadata {
  author: string;
  created: Date;
  modified: Date;
  version: string;
  tags: string[];
  rating: number;
  downloads: number;
  documentation: string;
}

// ===== Workflow Optimization Types =====

export interface WorkflowOptimization {
  id: string;
  workflowId: string;
  type: OptimizationType;
  analysis: OptimizationAnalysis;
  recommendations: OptimizationRecommendation[];
  implementation: OptimizationImplementation;
  results: OptimizationResults;
}

export type OptimizationType = 
  | 'performance'
  | 'resource'
  | 'cost'
  | 'reliability'
  | 'scalability'
  | 'maintainability';

export interface OptimizationAnalysis {
  startTime: Date;
  endTime: Date;
  metrics: AnalysisMetrics;
  bottlenecks: Bottleneck[];
  opportunities: Opportunity[];
  constraints: OptimizationConstraint[];
}

export interface AnalysisMetrics {
  executionTime: number;
  resourceUsage: ResourceUsage[];
  throughput: number;
  errorRate: number;
  cost: number;
  efficiency: number;
}

export interface ResourceUsage {
  type: ResourceType;
  average: number;
  peak: number;
  utilization: number;
  unit: string;
}

export interface Bottleneck {
  id: string;
  type: BottleneckType;
  location: string;
  severity: BottleneckSeverity;
  impact: number;
  description: string;
  recommendations: string[];
}

export type BottleneckType = 
  | 'resource'
  | 'dependency'
  | 'serialization'
  | 'coordination'
  | 'communication'
  | 'computation';

export type BottleneckSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  description: string;
  benefit: number;
  effort: number;
  priority: number;
  implementation: string;
}

export type OpportunityType = 
  | 'parallelization'
  | 'caching'
  | 'optimization'
  | 'elimination'
  | 'consolidation'
  | 'automation';

export interface OptimizationConstraint {
  type: OptimizationConstraintType;
  description: string;
  impact: string;
  workaround?: string;
}

export type OptimizationConstraintType = 
  | 'resource'
  | 'dependency'
  | 'compatibility'
  | 'compliance'
  | 'business'
  | 'technical';

export interface OptimizationRecommendation {
  id: string;
  type: RecommendationType;
  priority: number;
  description: string;
  expectedBenefit: number;
  implementationEffort: number;
  risks: string[];
  implementation: RecommendationImplementation;
}

export type RecommendationType = 
  | 'architectural'
  | 'configuration'
  | 'algorithmic'
  | 'resource'
  | 'workflow'
  | 'infrastructure';

export interface RecommendationImplementation {
  type: ImplementationType;
  steps: string[];
  validation: string[];
  rollback: string[];
  monitoring: string[];
}

export type ImplementationType = 
  | 'automatic'
  | 'semi_automatic'
  | 'manual'
  | 'assisted';

export interface OptimizationImplementation {
  status: ImplementationStatus;
  startTime: Date;
  endTime?: Date;
  progress: number;
  applied: OptimizationChange[];
  validation: ValidationResult[];
  rollback?: RollbackResult;
}

export type ImplementationStatus = 
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export interface OptimizationChange {
  id: string;
  type: ChangeType;
  description: string;
  target: string;
  before: any;
  after: any;
  timestamp: Date;
}

export type ChangeType = 
  | 'configuration'
  | 'code'
  | 'architecture'
  | 'infrastructure'
  | 'process'
  | 'data';

export interface ValidationResult {
  id: string;
  type: ValidationType;
  status: ValidationStatus;
  result: any;
  message: string;
  timestamp: Date;
}

export type ValidationStatus = 
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'warning';

export interface RollbackResult {
  status: RollbackStatus;
  reason: string;
  changes: RollbackChange[];
  timestamp: Date;
}

export type RollbackStatus = 
  | 'successful'
  | 'failed'
  | 'partial';

export interface RollbackChange {
  id: string;
  description: string;
  status: RollbackStatus;
  timestamp: Date;
}

export interface OptimizationResults {
  before: PerformanceSnapshot;
  after: PerformanceSnapshot;
  improvement: ImprovementMetrics;
  validation: ValidationResults;
  monitoring: MonitoringResults;
}

export interface PerformanceSnapshot {
  timestamp: Date;
  metrics: PerformanceMetrics;
  resources: ResourceUsage[];
  cost: number;
  errors: number;
}

export interface ImprovementMetrics {
  executionTime: number;
  throughput: number;
  resourceUtilization: number;
  errorRate: number;
  cost: number;
  efficiency: number;
}

export interface ValidationResults {
  functional: ValidationResult[];
  performance: ValidationResult[];
  quality: ValidationResult[];
  security: ValidationResult[];
}

export interface MonitoringResults {
  duration: number;
  metrics: MonitoringMetric[];
  alerts: Alert[];
  issues: Issue[];
}

export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  trend: TrendDirection;
}

export type TrendDirection = 'up' | 'down' | 'stable' | 'volatile';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export type AlertType = 
  | 'performance'
  | 'resource'
  | 'error'
  | 'security'
  | 'availability';

export type AlertSeverity = 
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';

export interface Issue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  description: string;
  impact: string;
  resolution: string;
  timestamp: Date;
  status: IssueStatus;
}

export type IssueType = 
  | 'bug'
  | 'performance'
  | 'security'
  | 'usability'
  | 'compatibility'
  | 'reliability';

export type IssueSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type IssueStatus = 
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'deferred';