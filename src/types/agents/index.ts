/**
 * Agent Communication TypeScript Interfaces
 * For swarm-based agent coordination and communication
 */

// ===== Core Agent Types =====

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  version: string;
  description: string;
  capabilities: AgentCapability[];
  configuration: AgentConfiguration;
  state: AgentState;
  metadata: AgentMetadata;
  communication: CommunicationInterface;
  learning: LearningInterface;
  tasks: TaskInterface;
  memory: MemoryInterface;
  monitoring: MonitoringInterface;
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
  | 'generic'
  | 'custom';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  type: CapabilityType;
  level: CapabilityLevel;
  parameters: CapabilityParameter[];
  constraints: CapabilityConstraint[];
  dependencies: string[];
  cost: number;
  enabled: boolean;
}

export type CapabilityType = 
  | 'cognitive'
  | 'technical'
  | 'communication'
  | 'coordination'
  | 'analysis'
  | 'creation'
  | 'optimization'
  | 'validation'
  | 'monitoring'
  | 'learning'
  | 'custom';

export type CapabilityLevel = 
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master';

export interface CapabilityParameter {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
  default?: any;
  constraints?: ParameterConstraint[];
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

export interface ParameterConstraint {
  type: ConstraintType;
  value: any;
  operator: ComparisonOperator;
  message?: string;
}

export type ConstraintType = 
  | 'required'
  | 'type'
  | 'format'
  | 'range'
  | 'length'
  | 'pattern'
  | 'enum'
  | 'custom';

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
  | 'contains'
  | 'starts_with'
  | 'ends_with';

export interface CapabilityConstraint {
  type: CapabilityConstraintType;
  description: string;
  impact: ImpactLevel;
  workaround?: string;
}

export type CapabilityConstraintType = 
  | 'resource'
  | 'dependency'
  | 'environment'
  | 'security'
  | 'performance'
  | 'compatibility'
  | 'regulatory'
  | 'business';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AgentConfiguration {
  maxConcurrentTasks: number;
  timeout: number;
  retryPolicy: RetryPolicy;
  resourceLimits: ResourceLimits;
  communication: CommunicationConfiguration;
  learning: LearningConfiguration;
  monitoring: MonitoringConfiguration;
  security: SecurityConfiguration;
  customSettings: Record<string, any>;
}

export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: BackoffStrategy;
  initialDelay: number;
  maxDelay: number;
  multiplier: number;
  jitter: boolean;
  retryableErrors: string[];
  nonRetryableErrors: string[];
}

export type BackoffStrategy = 
  | 'fixed'
  | 'linear'
  | 'exponential'
  | 'custom';

export interface ResourceLimits {
  memory: number;
  cpu: number;
  storage: number;
  network: number;
  duration: number;
  concurrent: number;
}

export interface CommunicationConfiguration {
  protocols: CommunicationProtocol[];
  encoding: EncodingType;
  compression: boolean;
  encryption: boolean;
  authentication: boolean;
  bufferSize: number;
  timeout: number;
  retryPolicy: RetryPolicy;
}

export type CommunicationProtocol = 
  | 'http'
  | 'websocket'
  | 'grpc'
  | 'message_queue'
  | 'shared_memory'
  | 'event_bus'
  | 'custom';

export type EncodingType = 
  | 'json'
  | 'msgpack'
  | 'protobuf'
  | 'avro'
  | 'cbor'
  | 'xml'
  | 'custom';

export interface LearningConfiguration {
  enabled: boolean;
  algorithms: LearningAlgorithm[];
  dataCollection: DataCollectionConfig;
  modelUpdate: ModelUpdateConfig;
  persistence: PersistenceConfig;
}

export type LearningAlgorithm = 
  | 'reinforcement'
  | 'supervised'
  | 'unsupervised'
  | 'transfer'
  | 'meta'
  | 'online'
  | 'custom';

export interface DataCollectionConfig {
  enabled: boolean;
  sources: DataSource[];
  sampling: SamplingConfig;
  privacy: PrivacyConfig;
  retention: RetentionConfig;
}

export type DataSource = 
  | 'tasks'
  | 'communication'
  | 'performance'
  | 'errors'
  | 'feedback'
  | 'environment'
  | 'custom';

export interface SamplingConfig {
  strategy: SamplingStrategy;
  rate: number;
  conditions: SamplingCondition[];
}

export type SamplingStrategy = 
  | 'uniform'
  | 'stratified'
  | 'adaptive'
  | 'importance'
  | 'custom';

export interface SamplingCondition {
  field: string;
  operator: ComparisonOperator;
  value: any;
  weight: number;
}

export interface PrivacyConfig {
  enabled: boolean;
  anonymization: boolean;
  encryption: boolean;
  retention: number;
  consent: boolean;
}

export interface RetentionConfig {
  enabled: boolean;
  duration: number;
  maxSize: number;
  compression: boolean;
  archiving: boolean;
}

export interface ModelUpdateConfig {
  enabled: boolean;
  frequency: UpdateFrequency;
  threshold: number;
  validation: ValidationConfig;
  rollback: RollbackConfig;
}

export type UpdateFrequency = 
  | 'continuous'
  | 'periodic'
  | 'on_demand'
  | 'threshold'
  | 'custom';

export interface ValidationConfig {
  enabled: boolean;
  strategy: ValidationStrategy;
  metrics: ValidationMetric[];
  threshold: number;
  timeout: number;
}

export type ValidationStrategy = 
  | 'cross_validation'
  | 'holdout'
  | 'bootstrap'
  | 'time_series'
  | 'custom';

export interface ValidationMetric {
  name: string;
  type: MetricType;
  weight: number;
  threshold: number;
  direction: MetricDirection;
}

export type MetricType = 
  | 'accuracy'
  | 'precision'
  | 'recall'
  | 'f1_score'
  | 'mae'
  | 'mse'
  | 'rmse'
  | 'custom';

export type MetricDirection = 'higher_better' | 'lower_better';

export interface RollbackConfig {
  enabled: boolean;
  strategy: RollbackStrategy;
  validation: boolean;
  backup: boolean;
  timeout: number;
}

export type RollbackStrategy = 
  | 'automatic'
  | 'manual'
  | 'threshold'
  | 'time_based'
  | 'custom';

export interface PersistenceConfig {
  enabled: boolean;
  storage: StorageType;
  compression: boolean;
  encryption: boolean;
  replication: number;
  backup: BackupConfig;
}

export type StorageType = 
  | 'memory'
  | 'disk'
  | 'database'
  | 'distributed'
  | 'cloud'
  | 'custom';

export interface BackupConfig {
  enabled: boolean;
  frequency: BackupFrequency;
  retention: number;
  compression: boolean;
  encryption: boolean;
  verification: boolean;
}

export type BackupFrequency = 
  | 'continuous'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export interface MonitoringConfiguration {
  enabled: boolean;
  metrics: MonitoringMetric[];
  alerts: AlertRule[];
  logging: LoggingConfig;
  tracing: TracingConfig;
}

export interface MonitoringMetric {
  name: string;
  type: MonitoringMetricType;
  interval: number;
  aggregation: AggregationType;
  threshold?: Threshold;
  enabled: boolean;
}

export type MonitoringMetricType = 
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

export interface AlertRule {
  name: string;
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
}

export interface AlertAction {
  type: AlertActionType;
  configuration: AlertActionConfiguration;
  delay?: number;
  enabled: boolean;
}

export type AlertActionType = 
  | 'log'
  | 'email'
  | 'webhook'
  | 'escalate'
  | 'auto_recover'
  | 'custom';

export interface AlertActionConfiguration {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  retries?: number;
  template?: string;
  recipients?: string[];
}

export interface LoggingConfig {
  enabled: boolean;
  level: LogLevel;
  format: LogFormat;
  destinations: LogDestination[];
  filters: LogFilter[];
}

export type LogLevel = 
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export type LogFormat = 
  | 'json'
  | 'text'
  | 'structured'
  | 'custom';

export interface LogDestination {
  type: LogDestinationType;
  configuration: LogDestinationConfig;
  filters: LogFilter[];
  enabled: boolean;
}

export type LogDestinationType = 
  | 'console'
  | 'file'
  | 'database'
  | 'elasticsearch'
  | 'webhook'
  | 'custom';

export interface LogDestinationConfig {
  path?: string;
  url?: string;
  credentials?: Credentials;
  format?: LogFormat;
  bufferSize?: number;
  flushInterval?: number;
  compression?: boolean;
  encryption?: boolean;
}

export interface Credentials {
  type: CredentialType;
  username?: string;
  password?: string;
  token?: string;
  certificate?: string;
  key?: string;
}

export type CredentialType = 
  | 'none'
  | 'basic'
  | 'bearer'
  | 'certificate'
  | 'key'
  | 'custom';

export interface LogFilter {
  type: LogFilterType;
  condition: string;
  action: LogFilterAction;
  enabled: boolean;
}

export type LogFilterType = 
  | 'level'
  | 'component'
  | 'message'
  | 'field'
  | 'custom';

export type LogFilterAction = 
  | 'include'
  | 'exclude'
  | 'transform'
  | 'sample'
  | 'custom';

export interface TracingConfig {
  enabled: boolean;
  sampler: TracingSampler;
  exporter: TracingExporter;
  processor: TracingProcessor;
}

export interface TracingSampler {
  type: SamplerType;
  rate: number;
  maxPerSecond?: number;
  filters?: TracingFilter[];
}

export type SamplerType = 
  | 'always'
  | 'never'
  | 'probability'
  | 'rate_limit'
  | 'custom';

export interface TracingFilter {
  field: string;
  operator: ComparisonOperator;
  value: any;
  action: FilterAction;
}

export type FilterAction = 
  | 'include'
  | 'exclude'
  | 'sample'
  | 'custom';

export interface TracingExporter {
  type: ExporterType;
  configuration: ExporterConfiguration;
  enabled: boolean;
}

export type ExporterType = 
  | 'jaeger'
  | 'zipkin'
  | 'otlp'
  | 'datadog'
  | 'custom';

export interface ExporterConfiguration {
  endpoint: string;
  headers?: Record<string, string>;
  timeout?: number;
  compression?: boolean;
  batchSize?: number;
}

export interface TracingProcessor {
  type: ProcessorType;
  configuration: ProcessorConfiguration;
  enabled: boolean;
}

export type ProcessorType = 
  | 'batch'
  | 'simple'
  | 'custom';

export interface ProcessorConfiguration {
  maxQueueSize?: number;
  batchTimeout?: number;
  maxExportBatchSize?: number;
}

export interface SecurityConfiguration {
  authentication: AuthenticationConfig;
  authorization: AuthorizationConfig;
  encryption: EncryptionConfig;
  auditing: AuditingConfig;
}

export interface AuthenticationConfig {
  enabled: boolean;
  method: AuthenticationMethod;
  credentials: AuthenticationCredentials;
  timeout: number;
  retries: number;
}

export type AuthenticationMethod = 
  | 'token'
  | 'certificate'
  | 'key'
  | 'oauth'
  | 'saml'
  | 'custom';

export interface AuthenticationCredentials {
  type: CredentialType;
  value: string;
  metadata?: Record<string, any>;
}

export interface AuthorizationConfig {
  enabled: boolean;
  model: AuthorizationModel;
  policies: AuthorizationPolicy[];
  cache: AuthorizationCache;
}

export type AuthorizationModel = 
  | 'rbac'
  | 'abac'
  | 'acl'
  | 'custom';

export interface AuthorizationPolicy {
  id: string;
  name: string;
  description: string;
  rules: AuthorizationRule[];
  enabled: boolean;
}

export interface AuthorizationRule {
  resource: string;
  action: string;
  condition?: string;
  effect: RuleEffect;
}

export type RuleEffect = 'allow' | 'deny';

export interface AuthorizationCache {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  eviction: EvictionPolicy;
}

export type EvictionPolicy = 
  | 'lru'
  | 'lfu'
  | 'ttl'
  | 'fifo'
  | 'custom';

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: EncryptionAlgorithm;
  keyManagement: KeyManagement;
  scope: EncryptionScope;
}

export type EncryptionAlgorithm = 
  | 'aes_256'
  | 'chacha20'
  | 'rsa_2048'
  | 'rsa_4096'
  | 'ecc_p256'
  | 'ecc_p384'
  | 'custom';

export interface KeyManagement {
  type: KeyManagementType;
  rotation: KeyRotation;
  storage: KeyStorage;
  distribution: KeyDistribution;
}

export type KeyManagementType = 
  | 'static'
  | 'dynamic'
  | 'hsm'
  | 'kms'
  | 'custom';

export interface KeyRotation {
  enabled: boolean;
  frequency: RotationFrequency;
  automatic: boolean;
  gracePeriod: number;
}

export type RotationFrequency = 
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

export interface KeyStorage {
  type: StorageType;
  location: string;
  encryption: boolean;
  backup: boolean;
  replication: number;
}

export interface KeyDistribution {
  method: DistributionMethod;
  security: DistributionSecurity;
  verification: DistributionVerification;
}

export type DistributionMethod = 
  | 'push'
  | 'pull'
  | 'exchange'
  | 'broadcast'
  | 'custom';

export interface DistributionSecurity {
  encryption: boolean;
  signing: boolean;
  authentication: boolean;
  authorization: boolean;
}

export interface DistributionVerification {
  enabled: boolean;
  method: VerificationMethod;
  timeout: number;
  retries: number;
}

export type VerificationMethod = 
  | 'hash'
  | 'signature'
  | 'challenge'
  | 'custom';

export interface EncryptionScope {
  communication: boolean;
  storage: boolean;
  memory: boolean;
  logs: boolean;
  metrics: boolean;
}

export interface AuditingConfig {
  enabled: boolean;
  events: AuditEvent[];
  storage: AuditStorage;
  retention: AuditRetention;
  compliance: ComplianceConfig;
}

export interface AuditEvent {
  type: AuditEventType;
  level: AuditLevel;
  fields: string[];
  filters: AuditFilter[];
  enabled: boolean;
}

export type AuditEventType = 
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'configuration'
  | 'administration'
  | 'error'
  | 'custom';

export type AuditLevel = 
  | 'minimal'
  | 'standard'
  | 'detailed'
  | 'verbose'
  | 'custom';

export interface AuditFilter {
  field: string;
  operator: ComparisonOperator;
  value: any;
  action: FilterAction;
}

export interface AuditStorage {
  type: StorageType;
  location: string;
  encryption: boolean;
  signing: boolean;
  immutable: boolean;
}

export interface AuditRetention {
  duration: number;
  maxSize: number;
  compression: boolean;
  archiving: boolean;
  deletion: DeletionPolicy;
}

export interface DeletionPolicy {
  enabled: boolean;
  criteria: DeletionCriteria;
  verification: boolean;
  approval: boolean;
}

export interface DeletionCriteria {
  age: number;
  size: number;
  type: string[];
  level: AuditLevel[];
}

export interface ComplianceConfig {
  standards: ComplianceStandard[];
  reporting: ComplianceReporting;
  monitoring: ComplianceMonitoring;
}

export interface ComplianceStandard {
  name: string;
  version: string;
  requirements: ComplianceRequirement[];
  certification: boolean;
}

export interface ComplianceRequirement {
  id: string;
  description: string;
  controls: ComplianceControl[];
  testing: ComplianceTesting;
}

export interface ComplianceControl {
  id: string;
  type: ControlType;
  implementation: string;
  verification: string;
  automated: boolean;
}

export type ControlType = 
  | 'preventive'
  | 'detective'
  | 'corrective'
  | 'compensating'
  | 'administrative'
  | 'technical'
  | 'physical';

export interface ComplianceTesting {
  frequency: TestingFrequency;
  method: TestingMethod;
  automation: boolean;
  documentation: boolean;
}

export type TestingFrequency = 
  | 'continuous'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'custom';

export type TestingMethod = 
  | 'automated'
  | 'manual'
  | 'hybrid'
  | 'third_party'
  | 'custom';

export interface ComplianceReporting {
  enabled: boolean;
  frequency: ReportingFrequency;
  format: ReportingFormat;
  recipients: string[];
  template: string;
}

export type ReportingFrequency = 
  | 'real_time'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'custom';

export type ReportingFormat = 
  | 'json'
  | 'xml'
  | 'pdf'
  | 'html'
  | 'csv'
  | 'custom';

export interface ComplianceMonitoring {
  enabled: boolean;
  metrics: ComplianceMetric[];
  alerts: ComplianceAlert[];
  dashboards: ComplianceDashboard[];
}

export interface ComplianceMetric {
  name: string;
  type: MetricType;
  calculation: string;
  threshold: number;
  frequency: MonitoringFrequency;
}

export type MonitoringFrequency = 
  | 'real_time'
  | 'minutes'
  | 'hourly'
  | 'daily'
  | 'custom';

export interface ComplianceAlert {
  name: string;
  condition: AlertCondition;
  severity: AlertSeverity;
  actions: AlertAction[];
  escalation: AlertEscalation;
}

export type AlertSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface AlertEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number;
}

export interface EscalationLevel {
  level: number;
  recipients: string[];
  actions: AlertAction[];
  timeout: number;
}

export interface ComplianceDashboard {
  name: string;
  widgets: DashboardWidget[];
  refresh: number;
  access: AccessControl;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  metrics: string[];
  configuration: WidgetConfiguration;
  position: WidgetPosition;
}

export type WidgetType = 
  | 'chart'
  | 'table'
  | 'gauge'
  | 'counter'
  | 'status'
  | 'custom';

export interface WidgetConfiguration {
  timeRange: TimeRange;
  aggregation: AggregationType;
  filters: WidgetFilter[];
  visualization: VisualizationConfig;
}

export interface TimeRange {
  start: Date | string;
  end: Date | string;
}

export interface WidgetFilter {
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export interface VisualizationConfig {
  type: VisualizationType;
  colors: string[];
  labels: boolean;
  legend: boolean;
  axes: AxesConfig;
}

export type VisualizationType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'heatmap'
  | 'custom';

export interface AxesConfig {
  x: AxisConfig;
  y: AxisConfig;
}

export interface AxisConfig {
  label: string;
  scale: ScaleType;
  range?: [number, number];
  format?: string;
}

export type ScaleType = 
  | 'linear'
  | 'logarithmic'
  | 'categorical'
  | 'time'
  | 'custom';

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AccessControl {
  public: boolean;
  users: string[];
  groups: string[];
  roles: string[];
}

export interface AgentState {
  status: AgentStatus;
  health: HealthStatus;
  performance: PerformanceMetrics;
  resources: ResourceUsage;
  tasks: TaskStatus;
  communication: CommunicationStatus;
  learning: LearningStatus;
  errors: ErrorStatus;
  lastUpdate: Date;
}

export type AgentStatus = 
  | 'initializing'
  | 'idle'
  | 'busy'
  | 'waiting'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'error'
  | 'unknown';

export interface HealthStatus {
  status: HealthStatusType;
  score: number;
  checks: HealthCheck[];
  lastCheck: Date;
  uptime: number;
}

export type HealthStatusType = 
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export interface HealthCheck {
  name: string;
  status: HealthStatusType;
  duration: number;
  message?: string;
  timestamp: Date;
}

export interface PerformanceMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  efficiency: number;
  utilization: number;
  quality: number;
}

export interface ResourceUsage {
  memory: ResourceMetric;
  cpu: ResourceMetric;
  storage: ResourceMetric;
  network: ResourceMetric;
}

export interface ResourceMetric {
  current: number;
  average: number;
  peak: number;
  limit: number;
  unit: string;
}

export interface TaskStatus {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  running: number;
  averageDuration: number;
}

export interface CommunicationStatus {
  connected: boolean;
  connections: number;
  messagesReceived: number;
  messagesSent: number;
  errors: number;
  latency: number;
}

export interface LearningStatus {
  enabled: boolean;
  modelVersion: string;
  accuracy: number;
  confidence: number;
  training: boolean;
  lastUpdate: Date;
}

export interface ErrorStatus {
  total: number;
  recent: number;
  rate: number;
  types: Record<string, number>;
  lastError?: Date;
}

export interface AgentMetadata {
  created: Date;
  modified: Date;
  version: string;
  author: string;
  description: string;
  tags: string[];
  category: string;
  environment: string;
  deployment: DeploymentInfo;
  dependencies: DependencyInfo[];
}

export interface DeploymentInfo {
  id: string;
  environment: string;
  version: string;
  timestamp: Date;
  configuration: Record<string, any>;
  resources: ResourceAllocation;
}

export interface ResourceAllocation {
  memory: number;
  cpu: number;
  storage: number;
  network: number;
}

export interface DependencyInfo {
  name: string;
  version: string;
  type: DependencyType;
  required: boolean;
  status: DependencyStatus;
}

export type DependencyType = 
  | 'agent'
  | 'service'
  | 'library'
  | 'model'
  | 'data'
  | 'custom';

export type DependencyStatus = 
  | 'available'
  | 'unavailable'
  | 'degraded'
  | 'unknown';

// ===== Communication Interface =====

export interface CommunicationInterface {
  send: (message: Message) => Promise<MessageResult>;
  receive: (handler: MessageHandler) => void;
  broadcast: (message: Message, recipients?: string[]) => Promise<BroadcastResult>;
  subscribe: (topic: string, handler: MessageHandler) => void;
  unsubscribe: (topic: string, handler: MessageHandler) => void;
  connect: (endpoint: string) => Promise<ConnectionResult>;
  disconnect: (endpoint: string) => Promise<void>;
  getStatus: () => CommunicationStatus;
  getConnections: () => Connection[];
}

export interface Message {
  id: string;
  type: MessageType;
  sender: string;
  recipient?: string;
  topic?: string;
  payload: any;
  metadata: MessageMetadata;
  timestamp: Date;
  expiry?: Date;
  priority: MessagePriority;
  reliable: boolean;
  encrypted: boolean;
  compressed: boolean;
}

export type MessageType = 
  | 'request'
  | 'response'
  | 'notification'
  | 'broadcast'
  | 'event'
  | 'command'
  | 'query'
  | 'heartbeat'
  | 'error'
  | 'custom';

export interface MessageMetadata {
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  baggage?: Record<string, string>;
  headers?: Record<string, string>;
  encoding?: string;
  contentType?: string;
  retryCount?: number;
  attempts?: number;
}

export type MessagePriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'
  | 'urgent';

export interface MessageResult {
  success: boolean;
  messageId: string;
  timestamp: Date;
  duration: number;
  error?: CommunicationError;
}

export interface CommunicationError {
  code: string;
  message: string;
  type: CommunicationErrorType;
  retryable: boolean;
  details?: Record<string, any>;
}

export type CommunicationErrorType = 
  | 'network'
  | 'timeout'
  | 'authentication'
  | 'authorization'
  | 'serialization'
  | 'protocol'
  | 'capacity'
  | 'rate_limit'
  | 'unknown';

export type MessageHandler = (message: Message) => Promise<MessageHandlerResult>;

export interface MessageHandlerResult {
  success: boolean;
  response?: any;
  error?: CommunicationError;
}

export interface BroadcastResult {
  success: boolean;
  messageId: string;
  recipients: string[];
  delivered: number;
  failed: number;
  errors: BroadcastError[];
}

export interface BroadcastError {
  recipient: string;
  error: CommunicationError;
}

export interface ConnectionResult {
  success: boolean;
  connectionId: string;
  endpoint: string;
  timestamp: Date;
  error?: CommunicationError;
}

export interface Connection {
  id: string;
  endpoint: string;
  status: ConnectionStatus;
  protocol: CommunicationProtocol;
  created: Date;
  lastActivity: Date;
  metrics: ConnectionMetrics;
}

export type ConnectionStatus = 
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'error';

export interface ConnectionMetrics {
  messagesReceived: number;
  messagesSent: number;
  bytesReceived: number;
  bytesSent: number;
  errors: number;
  latency: number;
}

// ===== Learning Interface =====

export interface LearningInterface {
  train: (data: TrainingData) => Promise<TrainingResult>;
  evaluate: (data: EvaluationData) => Promise<EvaluationResult>;
  predict: (input: any) => Promise<PredictionResult>;
  update: (feedback: Feedback) => Promise<UpdateResult>;
  getModel: () => Promise<Model>;
  setModel: (model: Model) => Promise<void>;
  getMetrics: () => Promise<LearningMetrics>;
  reset: () => Promise<void>;
}

export interface TrainingData {
  inputs: any[];
  outputs: any[];
  metadata: TrainingMetadata;
}

export interface TrainingMetadata {
  source: string;
  quality: number;
  timestamp: Date;
  labels: string[];
  features: string[];
}

export interface TrainingResult {
  success: boolean;
  modelId: string;
  metrics: TrainingMetrics;
  duration: number;
  error?: LearningError;
}

export interface TrainingMetrics {
  accuracy: number;
  loss: number;
  epochs: number;
  samples: number;
  convergence: boolean;
}

export interface EvaluationData {
  inputs: any[];
  expectedOutputs: any[];
  metadata: EvaluationMetadata;
}

export interface EvaluationMetadata {
  dataset: string;
  split: string;
  size: number;
  timestamp: Date;
}

export interface EvaluationResult {
  success: boolean;
  metrics: EvaluationMetrics;
  predictions: any[];
  error?: LearningError;
}

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusion: ConfusionMatrix;
}

export interface ConfusionMatrix {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface PredictionResult {
  success: boolean;
  prediction: any;
  confidence: number;
  probability?: number;
  alternatives?: Alternative[];
  error?: LearningError;
}

export interface Alternative {
  prediction: any;
  confidence: number;
  probability: number;
}

export interface Feedback {
  predictionId: string;
  actual: any;
  predicted: any;
  correct: boolean;
  confidence: number;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface UpdateResult {
  success: boolean;
  improvement: number;
  metrics: UpdateMetrics;
  error?: LearningError;
}

export interface UpdateMetrics {
  before: ModelMetrics;
  after: ModelMetrics;
  change: number;
}

export interface ModelMetrics {
  accuracy: number;
  confidence: number;
  size: number;
  version: string;
  timestamp: Date;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  architecture: string;
  parameters: ModelParameters;
  weights: ModelWeights;
  metadata: ModelMetadata;
}

export type ModelType = 
  | 'neural_network'
  | 'decision_tree'
  | 'random_forest'
  | 'svm'
  | 'linear_regression'
  | 'logistic_regression'
  | 'ensemble'
  | 'custom';

export interface ModelParameters {
  [key: string]: any;
}

export interface ModelWeights {
  format: WeightFormat;
  data: any;
  checksum: string;
  size: number;
}

export type WeightFormat = 
  | 'tensorflow'
  | 'pytorch'
  | 'onnx'
  | 'json'
  | 'binary'
  | 'custom';

export interface ModelMetadata {
  created: Date;
  modified: Date;
  author: string;
  description: string;
  tags: string[];
  performance: ModelPerformance;
  training: TrainingHistory;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
}

export interface TrainingHistory {
  epochs: TrainingEpoch[];
  totalTime: number;
  bestEpoch: number;
  converged: boolean;
}

export interface TrainingEpoch {
  epoch: number;
  loss: number;
  accuracy: number;
  duration: number;
  timestamp: Date;
}

export interface LearningError {
  code: string;
  message: string;
  type: LearningErrorType;
  retryable: boolean;
  details?: Record<string, any>;
}

export type LearningErrorType = 
  | 'data'
  | 'model'
  | 'training'
  | 'evaluation'
  | 'prediction'
  | 'update'
  | 'resource'
  | 'unknown';

export interface LearningMetrics {
  modelVersion: string;
  accuracy: number;
  confidence: number;
  predictions: number;
  correct: number;
  incorrect: number;
  feedback: number;
  updates: number;
  training: TrainingStatistics;
}

export interface TrainingStatistics {
  sessions: number;
  epochs: number;
  samples: number;
  duration: number;
  lastTraining: Date;
  nextTraining?: Date;
}

// ===== Task Interface =====

export interface TaskInterface {
  execute: (task: Task) => Promise<TaskResult>;
  cancel: (taskId: string) => Promise<void>;
  pause: (taskId: string) => Promise<void>;
  resume: (taskId: string) => Promise<void>;
  getStatus: (taskId: string) => Promise<TaskExecutionStatus>;
  getHistory: (filter?: TaskFilter) => Promise<TaskHistory[]>;
  getMetrics: () => Promise<TaskMetrics>;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  parameters: TaskParameters;
  dependencies: TaskDependency[];
  constraints: TaskConstraint[];
  timeout: number;
  retryPolicy: RetryPolicy;
  metadata: TaskMetadata;
}

export type TaskType = 
  | 'analysis'
  | 'computation'
  | 'communication'
  | 'coordination'
  | 'learning'
  | 'monitoring'
  | 'validation'
  | 'transformation'
  | 'custom';

export type TaskPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'
  | 'urgent';

export interface TaskParameters {
  [key: string]: any;
}

export interface TaskDependency {
  taskId: string;
  type: DependencyType;
  condition?: string;
}

export interface TaskConstraint {
  type: ConstraintType;
  condition: string;
  value: any;
}

export interface TaskMetadata {
  created: Date;
  creator: string;
  context: Record<string, any>;
  tags: string[];
  version: string;
}

export interface TaskResult {
  success: boolean;
  taskId: string;
  result: any;
  duration: number;
  resources: ResourceUsage;
  error?: TaskError;
  metadata: TaskResultMetadata;
}

export interface TaskError {
  code: string;
  message: string;
  type: TaskErrorType;
  retryable: boolean;
  details?: Record<string, any>;
}

export type TaskErrorType = 
  | 'validation'
  | 'execution'
  | 'resource'
  | 'dependency'
  | 'timeout'
  | 'cancellation'
  | 'unknown';

export interface TaskResultMetadata {
  timestamp: Date;
  metrics: TaskExecutionMetrics;
  trace: ExecutionTrace;
  artifacts: TaskArtifact[];
}

export interface TaskExecutionMetrics {
  startTime: Date;
  endTime: Date;
  duration: number;
  cpuTime: number;
  memoryUsage: number;
  networkUsage: number;
  ioOperations: number;
}

export interface ExecutionTrace {
  spans: ExecutionSpan[];
  totalDuration: number;
  criticalPath: string[];
}

export interface ExecutionSpan {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  parent?: string;
  children: string[];
  metadata: Record<string, any>;
}

export interface TaskArtifact {
  id: string;
  name: string;
  type: ArtifactType;
  size: number;
  location: string;
  checksum: string;
  metadata: Record<string, any>;
}

export type ArtifactType = 
  | 'data'
  | 'model'
  | 'report'
  | 'log'
  | 'config'
  | 'custom';

export interface TaskExecutionStatus {
  taskId: string;
  status: TaskExecutionStatusType;
  progress: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  message?: string;
  error?: TaskError;
}

export type TaskExecutionStatusType = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout';

export interface TaskFilter {
  status?: TaskExecutionStatusType[];
  type?: TaskType[];
  priority?: TaskPriority[];
  dateRange?: DateRange;
  creator?: string;
  tags?: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TaskHistory {
  task: Task;
  execution: TaskExecutionStatus;
  result?: TaskResult;
  events: TaskEvent[];
}

export interface TaskEvent {
  id: string;
  type: TaskEventType;
  timestamp: Date;
  description: string;
  metadata: Record<string, any>;
}

export type TaskEventType = 
  | 'created'
  | 'started'
  | 'paused'
  | 'resumed'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout'
  | 'retry'
  | 'custom';

export interface TaskMetrics {
  total: number;
  completed: number;
  failed: number;
  cancelled: number;
  timeout: number;
  averageDuration: number;
  successRate: number;
  throughput: number;
  resourceUtilization: ResourceUtilization;
}

export interface ResourceUtilization {
  cpu: UtilizationMetric;
  memory: UtilizationMetric;
  network: UtilizationMetric;
  storage: UtilizationMetric;
}

export interface UtilizationMetric {
  current: number;
  average: number;
  peak: number;
  efficiency: number;
}

// ===== Memory Interface =====

export interface MemoryInterface {
  store: (key: string, value: any, options?: MemoryOptions) => Promise<void>;
  retrieve: (key: string) => Promise<any>;
  delete: (key: string) => Promise<void>;
  search: (query: MemoryQuery) => Promise<MemorySearchResult>;
  list: (pattern?: string) => Promise<MemoryEntry[]>;
  clear: (namespace?: string) => Promise<void>;
  getStats: () => Promise<MemoryStats>;
}

export interface MemoryOptions {
  ttl?: number;
  namespace?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  compression?: boolean;
  encryption?: boolean;
}

export interface MemoryQuery {
  pattern?: string;
  namespace?: string;
  tags?: string[];
  dateRange?: DateRange;
  limit?: number;
  offset?: number;
}

export interface MemorySearchResult {
  entries: MemoryEntry[];
  total: number;
  offset: number;
  limit: number;
  duration: number;
}

export interface MemoryEntry {
  key: string;
  value: any;
  timestamp: Date;
  ttl?: number;
  namespace: string;
  tags: string[];
  metadata: Record<string, any>;
  size: number;
  compressed: boolean;
  encrypted: boolean;
}

export interface MemoryStats {
  totalEntries: number;
  totalSize: number;
  namespaces: Record<string, NamespaceStats>;
  hitRate: number;
  missRate: number;
  evictions: number;
  performance: MemoryPerformance;
}

export interface NamespaceStats {
  entries: number;
  size: number;
  hitRate: number;
  missRate: number;
  evictions: number;
}

export interface MemoryPerformance {
  averageReadTime: number;
  averageWriteTime: number;
  throughput: number;
  latency: number;
  errors: number;
}

// ===== Monitoring Interface =====

export interface MonitoringInterface {
  collect: (metrics: Metric[]) => Promise<void>;
  query: (query: MetricQuery) => Promise<MetricResult>;
  alert: (alert: Alert) => Promise<void>;
  getHealth: () => Promise<HealthReport>;
  getMetrics: () => Promise<MonitoringMetrics>;
  subscribe: (query: MetricQuery, callback: MetricCallback) => string;
  unsubscribe: (subscriptionId: string) => void;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels: Record<string, string>;
  type: MetricType;
}

export interface MetricQuery {
  name?: string;
  labels?: Record<string, string>;
  aggregation?: AggregationType;
  timeRange?: TimeRange;
  interval?: number;
  limit?: number;
}

export interface MetricResult {
  metrics: Metric[];
  aggregation?: AggregatedMetric;
  total: number;
  duration: number;
}

export interface AggregatedMetric {
  name: string;
  value: number;
  count: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata: Record<string, any>;
}

export interface HealthReport {
  status: HealthStatusType;
  score: number;
  components: ComponentHealth[];
  timestamp: Date;
  uptime: number;
}

export interface ComponentHealth {
  name: string;
  status: HealthStatusType;
  message?: string;
  metrics: Metric[];
  checks: HealthCheck[];
}

export interface MonitoringMetrics {
  uptime: number;
  metricsCollected: number;
  alertsGenerated: number;
  healthChecks: number;
  performance: MonitoringPerformance;
}

export interface MonitoringPerformance {
  collectionRate: number;
  queryLatency: number;
  alertLatency: number;
  storageUsage: number;
  throughput: number;
}

export type MetricCallback = (metrics: Metric[]) => void;

// ===== Swarm Coordination Types =====

export interface SwarmCoordination {
  topology: SwarmTopology;
  consensus: ConsensusProtocol;
  election: LeaderElection;
  coordination: CoordinationProtocol;
  synchronization: SynchronizationProtocol;
  failover: FailoverProtocol;
}

export interface SwarmTopology {
  type: TopologyType;
  nodes: SwarmNode[];
  edges: SwarmEdge[];
  properties: TopologyProperties;
}

export type TopologyType = 
  | 'star'
  | 'ring'
  | 'mesh'
  | 'tree'
  | 'hierarchy'
  | 'hybrid'
  | 'custom';

export interface SwarmNode {
  id: string;
  agentId: string;
  role: NodeRole;
  capabilities: string[];
  connections: string[];
  metrics: NodeMetrics;
  status: NodeStatus;
}

export type NodeRole = 
  | 'leader'
  | 'follower'
  | 'coordinator'
  | 'worker'
  | 'observer'
  | 'backup'
  | 'custom';

export interface NodeMetrics {
  load: number;
  throughput: number;
  latency: number;
  reliability: number;
  availability: number;
}

export type NodeStatus = 
  | 'active'
  | 'inactive'
  | 'joining'
  | 'leaving'
  | 'failed'
  | 'recovering';

export interface SwarmEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  latency: number;
  bandwidth: number;
  reliability: number;
  status: EdgeStatus;
}

export type EdgeStatus = 
  | 'active'
  | 'inactive'
  | 'degraded'
  | 'failed';

export interface TopologyProperties {
  diameter: number;
  clustering: number;
  redundancy: number;
  scalability: number;
  faultTolerance: number;
}

export interface ConsensusProtocol {
  algorithm: ConsensusAlgorithm;
  parameters: ConsensusParameters;
  state: ConsensusState;
}

export type ConsensusAlgorithm = 
  | 'raft'
  | 'pbft'
  | 'paxos'
  | 'pos'
  | 'pow'
  | 'voting'
  | 'custom';

export interface ConsensusParameters {
  timeout: number;
  quorum: number;
  rounds: number;
  threshold: number;
}

export interface ConsensusState {
  round: number;
  leader: string;
  term: number;
  votes: Vote[];
  decision?: any;
}

export interface Vote {
  voter: string;
  value: any;
  timestamp: Date;
  signature?: string;
}

export interface LeaderElection {
  algorithm: ElectionAlgorithm;
  current: string;
  candidates: Candidate[];
  state: ElectionState;
  history: ElectionHistory[];
}

export type ElectionAlgorithm = 
  | 'bully'
  | 'ring'
  | 'raft'
  | 'priority'
  | 'random'
  | 'custom';

export interface Candidate {
  id: string;
  priority: number;
  capabilities: string[];
  metrics: CandidateMetrics;
}

export interface CandidateMetrics {
  performance: number;
  reliability: number;
  availability: number;
  load: number;
  experience: number;
}

export interface ElectionState {
  phase: ElectionPhase;
  round: number;
  votes: Vote[];
  leader?: string;
  timestamp: Date;
}

export type ElectionPhase = 
  | 'nomination'
  | 'campaign'
  | 'voting'
  | 'counting'
  | 'decided'
  | 'failed';

export interface ElectionHistory {
  round: number;
  leader: string;
  candidates: string[];
  votes: Vote[];
  timestamp: Date;
  duration: number;
}

export interface CoordinationProtocol {
  type: CoordinationProtocolType;
  strategies: CoordinationStrategy[];
  state: CoordinationState;
}

export type CoordinationProtocolType = 
  | 'centralized'
  | 'distributed'
  | 'hierarchical'
  | 'peer_to_peer'
  | 'hybrid'
  | 'custom';

export interface CoordinationStrategy {
  name: string;
  type: CoordinationStrategyType;
  parameters: StrategyParameters;
  conditions: StrategyCondition[];
  actions: StrategyAction[];
}

export type CoordinationStrategyType = 
  | 'centralized'
  | 'distributed'
  | 'hierarchical'
  | 'peer_to_peer'
  | 'hybrid'
  | 'custom';

export interface StrategyParameters {
  [key: string]: any;
}

export interface StrategyCondition {
  type: StrategyConditionType;
  expression: string;
  threshold: number;
}

export type StrategyConditionType = 
  | 'metric'
  | 'threshold'
  | 'time'
  | 'event'
  | 'custom';

export interface StrategyAction {
  type: StrategyActionType;
  parameters: ActionParameters;
  timeout: number;
}

export type StrategyActionType = 
  | 'allocate'
  | 'delegate'
  | 'coordinate'
  | 'monitor'
  | 'custom';

export interface ActionParameters {
  [key: string]: any;
}

export interface CoordinationState {
  phase: CoordinationPhase;
  participants: string[];
  decisions: CoordinationDecision[];
  conflicts: CoordinationConflict[];
}

export type CoordinationPhase = 
  | 'initialization'
  | 'negotiation'
  | 'decision'
  | 'execution'
  | 'completion'
  | 'failure';

export interface CoordinationDecision {
  id: string;
  type: DecisionType;
  participants: string[];
  result: any;
  timestamp: Date;
  confidence: number;
}

export type DecisionType = 
  | 'resource_allocation'
  | 'task_assignment'
  | 'priority_adjustment'
  | 'topology_change'
  | 'parameter_tuning'
  | 'failure_handling'
  | 'custom';

export interface CoordinationConflict {
  id: string;
  type: ConflictType;
  participants: string[];
  description: string;
  resolution?: ConflictResolution;
  timestamp: Date;
}

export type ConflictType = 
  | 'resource'
  | 'priority'
  | 'assignment'
  | 'topology'
  | 'parameter'
  | 'custom';

export interface ConflictResolution {
  method: ResolutionMethod;
  result: any;
  timestamp: Date;
  duration: number;
}

export type ResolutionMethod = 
  | 'voting'
  | 'priority'
  | 'negotiation'
  | 'arbitration'
  | 'escalation'
  | 'custom';

export interface SynchronizationProtocol {
  type: SynchronizationType;
  clock: LogicalClock;
  state: SynchronizationState;
}

export type SynchronizationType = 
  | 'logical_clock'
  | 'vector_clock'
  | 'physical_clock'
  | 'hybrid_clock'
  | 'custom';

export interface LogicalClock {
  type: ClockType;
  value: number;
  vector?: Record<string, number>;
  timestamp: Date;
}

export type ClockType = 
  | 'lamport'
  | 'vector'
  | 'matrix'
  | 'hybrid'
  | 'custom';

export interface SynchronizationState {
  synchronized: boolean;
  drift: number;
  offset: number;
  accuracy: number;
  participants: string[];
}

export interface FailoverProtocol {
  type: FailoverType;
  triggers: FailoverTrigger[];
  policies: FailoverPolicy[];
  state: FailoverState;
}

export type FailoverType = 
  | 'hot_standby'
  | 'warm_standby'
  | 'cold_standby'
  | 'active_active'
  | 'custom';

export interface FailoverTrigger {
  type: FailoverTriggerType;
  condition: string;
  threshold: number;
  timeout: number;
}

export type FailoverTriggerType = 
  | 'health_check'
  | 'metric_threshold'
  | 'timeout'
  | 'manual'
  | 'custom';

export interface FailoverPolicy {
  name: string;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  priority: number;
}

export interface PolicyCondition {
  type: PolicyConditionType;
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export type PolicyConditionType = 
  | 'metric'
  | 'state'
  | 'time'
  | 'event'
  | 'custom';

export interface PolicyAction {
  type: PolicyActionType;
  parameters: PolicyParameters;
  timeout: number;
}

export type PolicyActionType = 
  | 'promote'
  | 'demote'
  | 'restart'
  | 'redirect'
  | 'isolate'
  | 'notify'
  | 'custom';

export interface PolicyParameters {
  [key: string]: any;
}

export interface FailoverState {
  active: boolean;
  primary: string;
  backup: string[];
  history: FailoverEvent[];
}

export interface FailoverEvent {
  id: string;
  type: FailoverEventType;
  from: string;
  to: string;
  reason: string;
  timestamp: Date;
  duration: number;
  success: boolean;
}

export type FailoverEventType = 
  | 'promotion'
  | 'demotion'
  | 'restart'
  | 'redirect'
  | 'isolation'
  | 'recovery'
  | 'custom';

// ===== Agent Factory and Registry =====

export interface AgentFactory {
  create: (config: AgentConfig) => Promise<Agent>;
  destroy: (agentId: string) => Promise<void>;
  clone: (agentId: string, config?: Partial<AgentConfig>) => Promise<Agent>;
  upgrade: (agentId: string, version: string) => Promise<Agent>;
  migrate: (agentId: string, target: string) => Promise<Agent>;
  getTemplates: () => Promise<AgentTemplate[]>;
  getCapabilities: () => Promise<AgentCapability[]>;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  version: string;
  capabilities: string[];
  configuration: AgentConfiguration;
  template?: string;
  customization?: Record<string, any>;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  version: string;
  capabilities: AgentCapability[];
  configuration: AgentConfiguration;
  parameters: TemplateParameter[];
  metadata: TemplateMetadata;
}

export interface TemplateParameter {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
  default?: any;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  type: ValidationType;
  rule: string;
  message: string;
}

export type ValidationType = 
  | 'required'
  | 'type'
  | 'format'
  | 'range'
  | 'pattern'
  | 'enum'
  | 'custom';

export interface TemplateMetadata {
  author: string;
  created: Date;
  modified: Date;
  version: string;
  tags: string[];
  category: string;
  popularity: number;
  rating: number;
}

export interface AgentRegistry {
  register: (agent: Agent) => Promise<void>;
  unregister: (agentId: string) => Promise<void>;
  find: (query: AgentQuery) => Promise<Agent[]>;
  get: (agentId: string) => Promise<Agent>;
  list: (filter?: AgentFilter) => Promise<Agent[]>;
  update: (agentId: string, updates: Partial<Agent>) => Promise<void>;
  getStats: () => Promise<RegistryStats>;
}

export interface AgentQuery {
  type?: AgentType;
  capabilities?: string[];
  status?: AgentStatus;
  name?: string;
  version?: string;
  tags?: string[];
  performance?: PerformanceFilter;
}

export interface PerformanceFilter {
  minThroughput?: number;
  maxLatency?: number;
  minReliability?: number;
  minAvailability?: number;
}

export interface AgentFilter {
  type?: AgentType[];
  status?: AgentStatus[];
  capabilities?: string[];
  dateRange?: DateRange;
  limit?: number;
  offset?: number;
}

export interface RegistryStats {
  totalAgents: number;
  byType: Record<AgentType, number>;
  byStatus: Record<AgentStatus, number>;
  byCapability: Record<string, number>;
  performance: RegistryPerformance;
}

export interface RegistryPerformance {
  queryLatency: number;
  throughput: number;
  availability: number;
  reliability: number;
  consistency: number;
}