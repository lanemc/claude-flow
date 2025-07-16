/**
 * Error Handling TypeScript Interfaces
 * Comprehensive error management for Claude Flow system
 */

// ===== Core Error Types =====

export interface ErrorDefinition {
  code: string;
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  category: ErrorCategory;
  recoverable: boolean;
  retryable: boolean;
  userFriendly: boolean;
  metadata?: ErrorMetadata;
}

export type ErrorType = 
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'conflict'
  | 'rate_limit'
  | 'quota_exceeded'
  | 'timeout'
  | 'network'
  | 'database'
  | 'file_system'
  | 'memory'
  | 'cpu'
  | 'resource'
  | 'configuration'
  | 'dependency'
  | 'business_logic'
  | 'system'
  | 'external'
  | 'user'
  | 'unknown';

export type ErrorSeverity = 
  | 'trace'
  | 'debug'
  | 'info'
  | 'warning'
  | 'error'
  | 'critical'
  | 'fatal';

export type ErrorCategory = 
  | 'client'
  | 'server'
  | 'network'
  | 'service'
  | 'data'
  | 'security'
  | 'performance'
  | 'resource'
  | 'configuration'
  | 'business'
  | 'system'
  | 'external';

export interface ErrorMetadata {
  timestamp: Date;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  component: string;
  operation: string;
  context: Record<string, any>;
  tags: string[];
  environment: string;
  version: string;
}

// ===== Error Context Types =====

export interface ErrorContext {
  operation: string;
  component: string;
  phase?: string;
  step?: string;
  agent?: string;
  workflow?: string;
  task?: string;
  user?: string;
  session?: string;
  environment: string;
  version: string;
  timestamp: Date;
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  baggage?: Record<string, string>;
}

export interface ErrorStack {
  frames: StackFrame[];
  sourceMap?: boolean;
  formatted?: string;
}

export interface StackFrame {
  function: string;
  file: string;
  line: number;
  column: number;
  source?: string;
  context?: SourceContext;
}

export interface SourceContext {
  pre: string[];
  line: string;
  post: string[];
}

// ===== Specific Error Types =====

export interface ValidationError extends ErrorDefinition {
  type: 'validation';
  field?: string;
  value?: any;
  constraint: ValidationConstraint;
  path?: string;
  schema?: string;
}

export interface ValidationConstraint {
  type: ValidationType;
  rule: string;
  expected?: any;
  actual?: any;
  message?: string;
}

export type ValidationType = 
  | 'required'
  | 'type'
  | 'format'
  | 'length'
  | 'range'
  | 'pattern'
  | 'enum'
  | 'unique'
  | 'custom';

export interface AuthenticationError extends ErrorDefinition {
  type: 'authentication';
  method: AuthMethod;
  reason: AuthFailureReason;
  attempts?: number;
  lockout?: boolean;
  expiresAt?: Date;
}

export type AuthMethod = 
  | 'password'
  | 'token'
  | 'certificate'
  | 'oauth'
  | 'api_key'
  | 'biometric'
  | 'multi_factor';

export type AuthFailureReason = 
  | 'invalid_credentials'
  | 'expired_token'
  | 'revoked_token'
  | 'missing_credentials'
  | 'malformed_credentials'
  | 'account_locked'
  | 'account_disabled'
  | 'too_many_attempts'
  | 'invalid_signature'
  | 'certificate_invalid'
  | 'mfa_required'
  | 'mfa_failed';

export interface AuthorizationError extends ErrorDefinition {
  type: 'authorization';
  resource: string;
  action: string;
  required: Permission[];
  actual: Permission[];
  policy?: string;
}

export interface Permission {
  resource: string;
  action: string;
  condition?: string;
  effect: PermissionEffect;
}

export type PermissionEffect = 'allow' | 'deny';

export interface NotFoundError extends ErrorDefinition {
  type: 'not_found';
  resource: string;
  identifier: string;
  searchCriteria?: Record<string, any>;
  suggestions?: string[];
}

export interface ConflictError extends ErrorDefinition {
  type: 'conflict';
  resource: string;
  identifier: string;
  conflictType: ConflictType;
  existing?: any;
  attempted?: any;
}

export type ConflictType = 
  | 'duplicate'
  | 'version'
  | 'state'
  | 'constraint'
  | 'lock'
  | 'dependency';

export interface RateLimitError extends ErrorDefinition {
  type: 'rate_limit';
  limit: number;
  window: number;
  current: number;
  resetAt: Date;
  retryAfter?: number;
}

export interface QuotaExceededError extends ErrorDefinition {
  type: 'quota_exceeded';
  quota: QuotaInfo;
  usage: QuotaUsage;
  resetAt?: Date;
}

export interface QuotaInfo {
  type: QuotaType;
  limit: number;
  window: number;
  unit: string;
}

export type QuotaType = 
  | 'requests'
  | 'bandwidth'
  | 'storage'
  | 'cpu'
  | 'memory'
  | 'duration'
  | 'custom';

export interface QuotaUsage {
  current: number;
  percentage: number;
  history: QuotaUsagePoint[];
}

export interface QuotaUsagePoint {
  timestamp: Date;
  value: number;
  window: number;
}

export interface TimeoutError extends ErrorDefinition {
  type: 'timeout';
  operation: string;
  timeout: number;
  elapsed: number;
  phase?: string;
  partial?: boolean;
}

export interface NetworkError extends ErrorDefinition {
  type: 'network';
  networkType: NetworkErrorType;
  host?: string;
  port?: number;
  protocol?: string;
  statusCode?: number;
  headers?: Record<string, string>;
}

export type NetworkErrorType = 
  | 'connection_refused'
  | 'connection_timeout'
  | 'dns_resolution'
  | 'ssl_handshake'
  | 'certificate_invalid'
  | 'proxy_error'
  | 'network_unreachable'
  | 'host_unreachable'
  | 'protocol_error'
  | 'response_timeout'
  | 'response_invalid'
  | 'connection_reset'
  | 'connection_aborted';

export interface DatabaseError extends ErrorDefinition {
  type: 'database';
  dbType: DatabaseType;
  operation: DatabaseOperation;
  table?: string;
  query?: string;
  constraint?: string;
  sqlState?: string;
  vendorCode?: number;
}

export type DatabaseType = 
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'mongodb'
  | 'redis'
  | 'elasticsearch'
  | 'cassandra'
  | 'dynamodb'
  | 'generic';

export type DatabaseOperation = 
  | 'select'
  | 'insert'
  | 'update'
  | 'delete'
  | 'create'
  | 'drop'
  | 'alter'
  | 'index'
  | 'transaction'
  | 'connection'
  | 'migration';

export interface FileSystemError extends ErrorDefinition {
  type: 'file_system';
  fsType: FileSystemErrorType;
  path: string;
  operation: FileSystemOperation;
  permissions?: string;
  size?: number;
  available?: number;
}

export type FileSystemErrorType = 
  | 'not_found'
  | 'permission_denied'
  | 'disk_full'
  | 'disk_quota_exceeded'
  | 'file_exists'
  | 'directory_not_empty'
  | 'invalid_path'
  | 'too_many_open_files'
  | 'file_too_large'
  | 'read_only'
  | 'corrupted'
  | 'locked';

export type FileSystemOperation = 
  | 'read'
  | 'write'
  | 'create'
  | 'delete'
  | 'copy'
  | 'move'
  | 'rename'
  | 'stat'
  | 'chmod'
  | 'chown'
  | 'mkdir'
  | 'rmdir'
  | 'link'
  | 'sync';

export interface ResourceError extends ErrorDefinition {
  type: 'resource';
  resourceType: ResourceType;
  operation: ResourceOperation;
  limit?: number;
  current?: number;
  requested?: number;
  available?: number;
}

export type ResourceType = 
  | 'memory'
  | 'cpu'
  | 'disk'
  | 'network'
  | 'handles'
  | 'threads'
  | 'connections'
  | 'processes'
  | 'custom';

export type ResourceOperation = 
  | 'allocate'
  | 'deallocate'
  | 'reserve'
  | 'release'
  | 'monitor'
  | 'limit'
  | 'scale';

export interface ConfigurationError extends ErrorDefinition {
  type: 'configuration';
  configType: ConfigurationType;
  key?: string;
  value?: any;
  expected?: string;
  source?: string;
  file?: string;
  line?: number;
}

export type ConfigurationType = 
  | 'missing'
  | 'invalid'
  | 'malformed'
  | 'incompatible'
  | 'deprecated'
  | 'required'
  | 'conflicting'
  | 'circular';

export interface DependencyError extends ErrorDefinition {
  type: 'dependency';
  dependency: DependencyInfo;
  operation: DependencyOperation;
  version?: string;
  expected?: string;
  available?: string;
}

export interface DependencyInfo {
  name: string;
  type: DependencyType;
  version?: string;
  source?: string;
  required: boolean;
}

export type DependencyType = 
  | 'npm'
  | 'system'
  | 'binary'
  | 'library'
  | 'service'
  | 'api'
  | 'database'
  | 'plugin'
  | 'extension';

export type DependencyOperation = 
  | 'install'
  | 'update'
  | 'remove'
  | 'verify'
  | 'load'
  | 'initialize'
  | 'configure'
  | 'start'
  | 'stop';

export interface BusinessLogicError extends ErrorDefinition {
  type: 'business_logic';
  rule: string;
  entity?: string;
  operation: string;
  constraint: BusinessConstraint;
  context?: Record<string, any>;
}

export interface BusinessConstraint {
  type: BusinessConstraintType;
  rule: string;
  values: any[];
  message: string;
}

export type BusinessConstraintType = 
  | 'invariant'
  | 'precondition'
  | 'postcondition'
  | 'business_rule'
  | 'policy'
  | 'workflow'
  | 'state_transition';

export interface SystemError extends ErrorDefinition {
  type: 'system';
  systemType: SystemErrorType;
  component?: string;
  process?: string;
  signal?: string;
  exitCode?: number;
  pid?: number;
}

export type SystemErrorType = 
  | 'process_crashed'
  | 'process_killed'
  | 'process_timeout'
  | 'memory_exhausted'
  | 'cpu_exhausted'
  | 'disk_full'
  | 'kernel_panic'
  | 'system_overload'
  | 'service_unavailable'
  | 'hardware_failure'
  | 'driver_error'
  | 'scheduler_error';

export interface ExternalError extends ErrorDefinition {
  type: 'external';
  service: string;
  operation: string;
  statusCode?: number;
  response?: any;
  endpoint?: string;
  headers?: Record<string, string>;
  retryable: boolean;
}

export interface UserError extends ErrorDefinition {
  type: 'user';
  userType: UserErrorType;
  input?: any;
  expected?: string;
  suggestions?: string[];
  documentation?: string;
}

export type UserErrorType = 
  | 'invalid_input'
  | 'missing_input'
  | 'malformed_input'
  | 'unsupported_operation'
  | 'insufficient_permissions'
  | 'quota_exceeded'
  | 'rate_limited'
  | 'workflow_violation'
  | 'state_error'
  | 'precondition_failed';

// ===== Error Handling Strategies =====

export interface ErrorHandler {
  id: string;
  name: string;
  description: string;
  errorTypes: ErrorType[];
  categories: ErrorCategory[];
  severity: ErrorSeverity[];
  strategy: HandlingStrategy;
  configuration: HandlerConfiguration;
  enabled: boolean;
  priority: number;
}

export interface HandlingStrategy {
  type: StrategyType;
  actions: ErrorAction[];
  conditions: ErrorCondition[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
  escalationPolicy?: EscalationPolicy;
}

export type StrategyType = 
  | 'ignore'
  | 'log'
  | 'retry'
  | 'fallback'
  | 'circuit_breaker'
  | 'bulkhead'
  | 'timeout'
  | 'rate_limit'
  | 'degrade'
  | 'escalate'
  | 'compensate'
  | 'rollback'
  | 'restart'
  | 'fail_fast'
  | 'custom';

export interface ErrorAction {
  type: ActionType;
  parameters: Record<string, any>;
  conditions: ErrorCondition[];
  timeout?: number;
  async?: boolean;
  critical?: boolean;
}

export type ActionType = 
  | 'log'
  | 'notify'
  | 'retry'
  | 'fallback'
  | 'circuit_break'
  | 'degrade'
  | 'escalate'
  | 'compensate'
  | 'rollback'
  | 'restart'
  | 'abort'
  | 'continue'
  | 'transform'
  | 'custom';

export interface ErrorCondition {
  type: ConditionType;
  expression: string;
  parameters: Record<string, any>;
  negated?: boolean;
}

export type ConditionType = 
  | 'error_type'
  | 'error_code'
  | 'severity'
  | 'category'
  | 'count'
  | 'rate'
  | 'duration'
  | 'context'
  | 'time'
  | 'custom';

export interface HandlerConfiguration {
  timeout: number;
  bufferSize: number;
  batchSize: number;
  flushInterval: number;
  compression: boolean;
  encryption: boolean;
  persistence: boolean;
  format: OutputFormat;
  destinations: Destination[];
}

export interface OutputFormat {
  type: FormatType;
  template?: string;
  fields?: string[];
  includeStack?: boolean;
  includeContext?: boolean;
  timestampFormat?: string;
}

export type FormatType = 
  | 'json'
  | 'text'
  | 'csv'
  | 'xml'
  | 'structured'
  | 'custom';

export interface Destination {
  type: DestinationType;
  configuration: DestinationConfiguration;
  filters: ErrorFilter[];
  enabled: boolean;
}

export type DestinationType = 
  | 'console'
  | 'file'
  | 'database'
  | 'elasticsearch'
  | 'email'
  | 'slack'
  | 'webhook'
  | 'sms'
  | 'pager'
  | 'metrics'
  | 'custom';

export interface DestinationConfiguration {
  url?: string;
  credentials?: Credentials;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  bufferSize?: number;
  batchSize?: number;
  compression?: boolean;
  encryption?: boolean;
  format?: OutputFormat;
  template?: string;
}

export interface Credentials {
  type: CredentialType;
  username?: string;
  password?: string;
  token?: string;
  certificate?: string;
  key?: string;
  secret?: string;
}

export type CredentialType = 
  | 'none'
  | 'basic'
  | 'bearer'
  | 'oauth'
  | 'certificate'
  | 'key'
  | 'secret'
  | 'custom';

export interface ErrorFilter {
  type: FilterType;
  condition: string;
  action: FilterAction;
  priority: number;
}

export type FilterType = 
  | 'include'
  | 'exclude'
  | 'transform'
  | 'sample'
  | 'rate_limit'
  | 'custom';

export type FilterAction = 
  | 'allow'
  | 'deny'
  | 'transform'
  | 'sample'
  | 'rate_limit'
  | 'custom';

export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: BackoffStrategy;
  initialDelay: number;
  maxDelay: number;
  multiplier: number;
  jitter: boolean;
  retryableErrors: ErrorType[];
  nonRetryableErrors: ErrorType[];
  conditions: ErrorCondition[];
}

export type BackoffStrategy = 
  | 'fixed'
  | 'linear'
  | 'exponential'
  | 'fibonacci'
  | 'custom';

export interface EscalationPolicy {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number;
  maxLevels: number;
  conditions: ErrorCondition[];
}

export interface EscalationLevel {
  level: number;
  name: string;
  actions: ErrorAction[];
  timeout: number;
  conditions: ErrorCondition[];
}

// ===== Error Monitoring and Metrics =====

export interface ErrorMonitor {
  id: string;
  name: string;
  description: string;
  metrics: ErrorMetric[];
  alerts: ErrorAlert[];
  dashboards: ErrorDashboard[];
  configuration: MonitorConfiguration;
  enabled: boolean;
}

export interface ErrorMetric {
  name: string;
  type: MetricType;
  description: string;
  unit: string;
  aggregation: AggregationType;
  dimensions: string[];
  threshold?: Threshold;
  alert?: boolean;
}

export type MetricType = 
  | 'counter'
  | 'gauge'
  | 'histogram'
  | 'timer'
  | 'rate'
  | 'custom';

export type AggregationType = 
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'count'
  | 'p50'
  | 'p90'
  | 'p95'
  | 'p99'
  | 'p999'
  | 'custom';

export interface Threshold {
  warning: number;
  critical: number;
  operator: ThresholdOperator;
  duration: number;
}

export type ThresholdOperator = 
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'eq'
  | 'ne'
  | 'between'
  | 'not_between';

export interface ErrorAlert {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  actions: AlertAction[];
  cooldown: number;
  enabled: boolean;
}

export interface AlertCondition {
  metric: string;
  operator: ThresholdOperator;
  threshold: number;
  duration: number;
  aggregation: AggregationType;
  dimensions?: Record<string, string>;
}

export interface AlertAction {
  type: AlertActionType;
  configuration: AlertActionConfiguration;
  delay?: number;
  enabled: boolean;
}

export type AlertActionType = 
  | 'email'
  | 'slack'
  | 'webhook'
  | 'sms'
  | 'pager'
  | 'auto_resolve'
  | 'escalate'
  | 'custom';

export interface AlertActionConfiguration {
  recipients?: string[];
  message?: string;
  template?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  retries?: number;
}

export interface ErrorDashboard {
  id: string;
  name: string;
  description: string;
  panels: DashboardPanel[];
  timeRange: TimeRange;
  refresh: number;
  filters: DashboardFilter[];
}

export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  metrics: string[];
  dimensions: string[];
  aggregation: AggregationType;
  visualization: Visualization;
  position: PanelPosition;
  size: PanelSize;
}

export type PanelType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'table'
  | 'stat'
  | 'heatmap'
  | 'gauge'
  | 'custom';

export interface Visualization {
  type: VisualizationType;
  options: VisualizationOptions;
}

export type VisualizationType = 
  | 'time_series'
  | 'single_stat'
  | 'table'
  | 'graph'
  | 'heatmap'
  | 'gauge'
  | 'custom';

export interface VisualizationOptions {
  colors?: string[];
  thresholds?: Threshold[];
  unit?: string;
  decimals?: number;
  legend?: boolean;
  tooltips?: boolean;
  zoom?: boolean;
  pan?: boolean;
}

export interface PanelPosition {
  x: number;
  y: number;
}

export interface PanelSize {
  width: number;
  height: number;
}

export interface TimeRange {
  from: Date | string;
  to: Date | string;
}

export interface DashboardFilter {
  name: string;
  dimension: string;
  operator: FilterOperator;
  value: any;
  enabled: boolean;
}

export type FilterOperator = 
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'like'
  | 'not_like'
  | 'regex'
  | 'not_regex';

export interface MonitorConfiguration {
  interval: number;
  retention: number;
  storage: StorageConfiguration;
  aggregation: AggregationConfiguration;
  sampling: SamplingConfiguration;
}

export interface StorageConfiguration {
  type: StorageType;
  location: string;
  compression: boolean;
  encryption: boolean;
  replication: number;
  sharding: boolean;
}

export type StorageType = 
  | 'memory'
  | 'disk'
  | 'database'
  | 'time_series'
  | 'distributed'
  | 'custom';

export interface AggregationConfiguration {
  enabled: boolean;
  interval: number;
  functions: AggregationType[];
  dimensions: string[];
  retention: number;
}

export interface SamplingConfiguration {
  enabled: boolean;
  rate: number;
  strategy: SamplingStrategy;
  conditions: ErrorCondition[];
}

export type SamplingStrategy = 
  | 'uniform'
  | 'stratified'
  | 'systematic'
  | 'cluster'
  | 'adaptive'
  | 'custom';

// ===== Error Recovery Types =====

export interface ErrorRecovery {
  id: string;
  name: string;
  description: string;
  triggers: RecoveryTrigger[];
  strategies: RecoveryStrategy[];
  conditions: ErrorCondition[];
  timeout: number;
  priority: number;
  enabled: boolean;
}

export interface RecoveryTrigger {
  type: TriggerType;
  condition: string;
  threshold?: number;
  duration?: number;
  count?: number;
}

export type TriggerType = 
  | 'error_count'
  | 'error_rate'
  | 'error_type'
  | 'health_check'
  | 'metric_threshold'
  | 'time_based'
  | 'manual'
  | 'custom';

export interface RecoveryStrategy {
  type: RecoveryStrategyType;
  actions: RecoveryAction[];
  conditions: ErrorCondition[];
  timeout: number;
  priority: number;
  fallback?: RecoveryStrategy;
}

export type RecoveryStrategyType = 
  | 'retry'
  | 'fallback'
  | 'circuit_breaker'
  | 'bulkhead'
  | 'timeout'
  | 'rate_limit'
  | 'degrade'
  | 'compensate'
  | 'rollback'
  | 'restart'
  | 'failover'
  | 'custom';

export interface RecoveryAction {
  type: RecoveryActionType;
  parameters: Record<string, any>;
  timeout: number;
  critical: boolean;
  async: boolean;
  conditions: ErrorCondition[];
}

export type RecoveryActionType = 
  | 'restart_service'
  | 'restart_process'
  | 'restart_container'
  | 'restart_system'
  | 'clear_cache'
  | 'reset_connections'
  | 'rollback_transaction'
  | 'rollback_deployment'
  | 'failover_primary'
  | 'failover_secondary'
  | 'scale_up'
  | 'scale_down'
  | 'isolate_component'
  | 'notify_team'
  | 'create_ticket'
  | 'execute_script'
  | 'custom';

// ===== Error Reporting Types =====

export interface ErrorReport {
  id: string;
  title: string;
  summary: string;
  description: string;
  errors: ErrorInstance[];
  timeRange: TimeRange;
  statistics: ErrorStatistics;
  analysis: ErrorAnalysis;
  recommendations: ErrorRecommendation[];
  metadata: ReportMetadata;
}

export interface ErrorInstance {
  id: string;
  timestamp: Date;
  error: ErrorDefinition;
  context: ErrorContext;
  stack?: ErrorStack;
  resolved: boolean;
  resolution?: ErrorResolution;
  impact: ErrorImpact;
}

export interface ErrorResolution {
  timestamp: Date;
  method: ResolutionMethod;
  description: string;
  duration: number;
  success: boolean;
  author?: string;
}

export type ResolutionMethod = 
  | 'automatic'
  | 'manual'
  | 'self_healing'
  | 'user_action'
  | 'system_recovery'
  | 'external_fix'
  | 'workaround'
  | 'configuration_change'
  | 'code_fix'
  | 'rollback'
  | 'other';

export interface ErrorImpact {
  severity: ImpactSeverity;
  scope: ImpactScope;
  users: number;
  duration: number;
  cost?: number;
  reputation?: number;
}

export type ImpactSeverity = 
  | 'negligible'
  | 'minor'
  | 'moderate'
  | 'major'
  | 'critical'
  | 'catastrophic';

export interface ImpactScope {
  type: ScopeType;
  components: string[];
  services: string[];
  users: string[];
  geography: string[];
}

export type ScopeType = 
  | 'single_user'
  | 'multiple_users'
  | 'single_component'
  | 'multiple_components'
  | 'single_service'
  | 'multiple_services'
  | 'system_wide'
  | 'global';

export interface ErrorStatistics {
  total: number;
  byType: Record<ErrorType, number>;
  byCategory: Record<ErrorCategory, number>;
  bySeverity: Record<ErrorSeverity, number>;
  byComponent: Record<string, number>;
  byTimeRange: TimeSeriesData[];
  trends: ErrorTrend[];
  patterns: ErrorPattern[];
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  labels?: Record<string, string>;
}

export interface ErrorTrend {
  type: TrendType;
  direction: TrendDirection;
  change: number;
  confidence: number;
  duration: number;
  description: string;
}

export type TrendType = 
  | 'count'
  | 'rate'
  | 'severity'
  | 'duration'
  | 'impact'
  | 'resolution_time'
  | 'custom';

export type TrendDirection = 
  | 'increasing'
  | 'decreasing'
  | 'stable'
  | 'volatile'
  | 'cyclical';

export interface ErrorPattern {
  id: string;
  name: string;
  description: string;
  pattern: string;
  frequency: number;
  confidence: number;
  examples: ErrorInstance[];
  recommendations: string[];
}

export interface ErrorAnalysis {
  rootCauses: RootCause[];
  correlations: ErrorCorrelation[];
  clusters: ErrorCluster[];
  anomalies: ErrorAnomaly[];
  predictions: ErrorPrediction[];
}

export interface RootCause {
  id: string;
  description: string;
  category: string;
  confidence: number;
  evidence: Evidence[];
  impact: number;
  frequency: number;
}

export interface Evidence {
  type: EvidenceType;
  description: string;
  data: any;
  timestamp: Date;
  confidence: number;
}

export type EvidenceType = 
  | 'log'
  | 'metric'
  | 'trace'
  | 'event'
  | 'user_report'
  | 'system_state'
  | 'configuration'
  | 'deployment'
  | 'external'
  | 'custom';

export interface ErrorCorrelation {
  errors: string[];
  type: CorrelationType;
  strength: number;
  confidence: number;
  description: string;
  timeWindow: number;
}

export type CorrelationType = 
  | 'causal'
  | 'temporal'
  | 'spatial'
  | 'logical'
  | 'statistical'
  | 'custom';

export interface ErrorCluster {
  id: string;
  errors: string[];
  center: ErrorInstance;
  radius: number;
  density: number;
  characteristics: string[];
  description: string;
}

export interface ErrorAnomaly {
  id: string;
  type: AnomalyType;
  description: string;
  severity: number;
  confidence: number;
  timestamp: Date;
  duration: number;
  baseline: number;
  actual: number;
  threshold: number;
}

export type AnomalyType = 
  | 'spike'
  | 'dip'
  | 'trend'
  | 'seasonal'
  | 'outlier'
  | 'pattern'
  | 'custom';

export interface ErrorPrediction {
  id: string;
  type: PredictionType;
  description: string;
  probability: number;
  confidence: number;
  timeframe: number;
  impact: number;
  recommendations: string[];
}

export type PredictionType = 
  | 'error_increase'
  | 'error_decrease'
  | 'new_error_type'
  | 'cascading_failure'
  | 'system_overload'
  | 'performance_degradation'
  | 'custom';

export interface ErrorRecommendation {
  id: string;
  type: RecommendationType;
  description: string;
  priority: number;
  effort: number;
  impact: number;
  timeline: string;
  dependencies: string[];
  risks: string[];
  benefits: string[];
}

export type RecommendationType = 
  | 'fix'
  | 'workaround'
  | 'prevention'
  | 'monitoring'
  | 'alerting'
  | 'process'
  | 'training'
  | 'documentation'
  | 'tooling'
  | 'architecture'
  | 'custom';

export interface ReportMetadata {
  generated: Date;
  author: string;
  version: string;
  format: string;
  size: number;
  filters: ReportFilter[];
  parameters: Record<string, any>;
}

export interface ReportFilter {
  name: string;
  field: string;
  operator: FilterOperator;
  value: any;
  applied: boolean;
}