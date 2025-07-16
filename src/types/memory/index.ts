/**
 * Memory System TypeScript Interfaces
 * For persistent storage, caching, and swarm coordination memory
 */

// ===== Core Memory Types =====

// Define MemoryEntry interface for this module
export interface MemoryEntry {
  id: string;
  key: string;
  value: any;
  data?: any;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  partition?: string;
}

export interface MemoryStore {
  id: string;
  name: string;
  type: MemoryStoreType;
  configuration: MemoryConfiguration;
  state: MemoryState;
  capabilities: MemoryCapability[];
  metrics: MemoryMetrics;
  operations: MemoryOperations;
}

export type MemoryStoreType = 
  | 'shared'
  | 'distributed'
  | 'swarm'
  | 'persistent'
  | 'cache'
  | 'temporal'
  | 'neural'
  | 'custom';

export interface MemoryConfiguration {
  capacity: number;
  persistence: PersistenceConfig;
  replication: ReplicationConfig;
  partitioning: PartitioningConfig;
  compression: CompressionConfig;
  encryption: EncryptionConfig;
  indexing: IndexingConfig;
  expiration: ExpirationConfig;
  consistency: ConsistencyConfig;
  performance: PerformanceConfig;
}

export interface PersistenceConfig {
  enabled: boolean;
  backend: PersistenceBackend;
  location: string;
  format: PersistenceFormat;
  durability: DurabilityLevel;
  journaling: JournalingConfig;
  backup: BackupConfig;
}

export type PersistenceBackend = 
  | 'file'
  | 'sqlite'
  | 'postgresql'
  | 'mongodb'
  | 'redis'
  | 'cassandra'
  | 'elasticsearch'
  | 'custom';

export type PersistenceFormat = 
  | 'json'
  | 'binary'
  | 'avro'
  | 'protobuf'
  | 'msgpack'
  | 'custom';

export type DurabilityLevel = 
  | 'none'
  | 'memory'
  | 'disk'
  | 'replicated'
  | 'distributed'
  | 'fault_tolerant';

export interface JournalingConfig {
  enabled: boolean;
  mode: JournalingMode;
  syncInterval: number;
  maxLogSize: number;
  compression: boolean;
  encryption: boolean;
}

export type JournalingMode = 
  | 'write_ahead'
  | 'write_behind'
  | 'synchronous'
  | 'asynchronous'
  | 'custom';

export interface BackupConfig {
  enabled: boolean;
  strategy: BackupStrategy;
  schedule: BackupSchedule;
  retention: RetentionPolicy;
  compression: boolean;
  encryption: boolean;
  verification: boolean;
}

export type BackupStrategy = 
  | 'full'
  | 'incremental'
  | 'differential'
  | 'continuous'
  | 'custom';

export interface BackupSchedule {
  type: ScheduleType;
  frequency: number;
  time?: string;
  days?: string[];
  timezone?: string;
}

export type ScheduleType = 
  | 'interval'
  | 'cron'
  | 'event'
  | 'manual'
  | 'custom';

export interface RetentionPolicy {
  count: number;
  duration: number;
  size: number;
  rules: RetentionRule[];
}

export interface RetentionRule {
  type: RetentionRuleType;
  condition: string;
  action: RetentionAction;
  priority: number;
}

export type RetentionRuleType = 
  | 'age'
  | 'size'
  | 'count'
  | 'access'
  | 'custom';

export type RetentionAction = 
  | 'delete'
  | 'archive'
  | 'compress'
  | 'move'
  | 'custom';

export interface ReplicationConfig {
  enabled: boolean;
  factor: number;
  strategy: ReplicationStrategy;
  synchronization: SynchronizationMode;
  failover: FailoverConfig;
  consistency: ConsistencyLevel;
}

export type ReplicationStrategy = 
  | 'master_slave'
  | 'master_master'
  | 'peer_to_peer'
  | 'chain'
  | 'quorum'
  | 'custom';

export type SynchronizationMode = 
  | 'synchronous'
  | 'asynchronous'
  | 'semi_synchronous'
  | 'eventual'
  | 'custom';

export interface FailoverConfig {
  enabled: boolean;
  detection: FailureDetection;
  recovery: RecoveryConfig;
  notification: NotificationConfig;
}

export interface FailureDetection {
  method: DetectionMethod;
  interval: number;
  timeout: number;
  threshold: number;
}

export type DetectionMethod = 
  | 'heartbeat'
  | 'health_check'
  | 'response_time'
  | 'error_rate'
  | 'custom';

export interface RecoveryConfig {
  strategy: RecoveryStrategy;
  timeout: number;
  retries: number;
  delay: number;
}

export type RecoveryStrategy = 
  | 'automatic'
  | 'manual'
  | 'split_brain'
  | 'majority'
  | 'custom';

export interface NotificationConfig {
  enabled: boolean;
  channels: NotificationChannel[];
  template: NotificationTemplate;
  throttling: ThrottlingConfig;
}

export interface NotificationChannel {
  type: ChannelType;
  destination: string;
  priority: ChannelPriority;
  filters: NotificationFilter[];
}

export type ChannelType = 
  | 'email'
  | 'sms'
  | 'webhook'
  | 'slack'
  | 'pager'
  | 'custom';

export type ChannelPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'urgent';

export interface NotificationFilter {
  type: FilterType;
  condition: string;
  action: FilterAction;
}

export type FilterType = 
  | 'severity'
  | 'component'
  | 'event'
  | 'time'
  | 'custom';

export type FilterAction = 
  | 'allow'
  | 'deny'
  | 'modify'
  | 'delay'
  | 'custom';

export interface NotificationTemplate {
  subject: string;
  body: string;
  format: TemplateFormat;
  variables: TemplateVariable[];
}

export type TemplateFormat = 
  | 'text'
  | 'html'
  | 'markdown'
  | 'json'
  | 'custom';

export interface TemplateVariable {
  name: string;
  type: VariableType;
  default?: any;
  required: boolean;
}

export type VariableType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array'
  | 'custom';

export interface ThrottlingConfig {
  enabled: boolean;
  rate: number;
  burst: number;
  window: number;
}

export type ConsistencyLevel = 
  | 'eventual'
  | 'strong'
  | 'bounded_staleness'
  | 'session'
  | 'consistent_prefix'
  | 'custom';

export interface PartitioningConfig {
  enabled: boolean;
  strategy: PartitioningStrategy;
  key: string;
  shards: number;
  rebalancing: RebalancingConfig;
}

export type PartitioningStrategy = 
  | 'hash'
  | 'range'
  | 'directory'
  | 'consistent_hash'
  | 'custom';

export interface RebalancingConfig {
  enabled: boolean;
  trigger: RebalancingTrigger;
  strategy: RebalancingStrategy;
  threshold: number;
}

export type RebalancingTrigger = 
  | 'load'
  | 'size'
  | 'time'
  | 'manual'
  | 'custom';

export type RebalancingStrategy = 
  | 'immediate'
  | 'gradual'
  | 'scheduled'
  | 'custom';

export interface CompressionConfig {
  enabled: boolean;
  algorithm: CompressionAlgorithm;
  level: number;
  threshold: number;
  pattern: string;
}

export type CompressionAlgorithm = 
  | 'gzip'
  | 'lz4'
  | 'zstd'
  | 'brotli'
  | 'snappy'
  | 'custom';

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: EncryptionAlgorithm;
  keyDerivation: KeyDerivation;
  rotation: KeyRotation;
  scope: EncryptionScope;
}

export type EncryptionAlgorithm = 
  | 'aes_256_gcm'
  | 'chacha20_poly1305'
  | 'aes_256_cbc'
  | 'rsa_2048'
  | 'custom';

export interface KeyDerivation {
  function: DerivationFunction;
  salt: string;
  iterations: number;
  length: number;
}

export type DerivationFunction = 
  | 'pbkdf2'
  | 'scrypt'
  | 'argon2'
  | 'bcrypt'
  | 'custom';

export interface KeyRotation {
  enabled: boolean;
  schedule: RotationSchedule;
  gracePeriod: number;
  notification: boolean;
}

export interface RotationSchedule {
  frequency: RotationFrequency;
  time?: string;
  trigger?: RotationTrigger;
}

export type RotationFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

export type RotationTrigger = 
  | 'time'
  | 'usage'
  | 'compromise'
  | 'manual'
  | 'custom';

export interface EncryptionScope {
  keys: boolean;
  values: boolean;
  indexes: boolean;
  logs: boolean;
  backups: boolean;
}

export interface IndexingConfig {
  enabled: boolean;
  strategy: IndexingStrategy;
  indexes: IndexDefinition[];
  optimization: IndexOptimization;
}

export type IndexingStrategy = 
  | 'btree'
  | 'hash'
  | 'bitmap'
  | 'full_text'
  | 'geospatial'
  | 'custom';

export interface IndexDefinition {
  name: string;
  type: IndexType;
  fields: IndexField[];
  unique: boolean;
  sparse: boolean;
  partial: boolean;
  condition?: string;
}

export type IndexType = 
  | 'btree'
  | 'hash'
  | 'gin'
  | 'gist'
  | 'bitmap'
  | 'full_text'
  | 'custom';

export interface IndexField {
  name: string;
  direction: SortDirection;
  weight?: number;
  type?: FieldType;
}

export type SortDirection = 'asc' | 'desc';

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array'
  | 'custom';

export interface IndexOptimization {
  enabled: boolean;
  strategy: OptimizationStrategy;
  schedule: OptimizationSchedule;
  maintenance: MaintenanceConfig;
}

export type OptimizationStrategy = 
  | 'rebuild'
  | 'reorganize'
  | 'statistics'
  | 'fragmentation'
  | 'custom';

export interface OptimizationSchedule {
  frequency: OptimizationFrequency;
  time?: string;
  condition?: string;
}

export type OptimizationFrequency = 
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export interface MaintenanceConfig {
  enabled: boolean;
  operations: MaintenanceOperation[];
  window: MaintenanceWindow;
  notification: boolean;
}

export interface MaintenanceOperation {
  type: OperationType;
  schedule: string;
  priority: OperationPriority;
  timeout: number;
}

export type OperationType = 
  | 'vacuum'
  | 'analyze'
  | 'reindex'
  | 'compact'
  | 'repair'
  | 'custom';

export type OperationPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface MaintenanceWindow {
  start: string;
  end: string;
  timezone: string;
  days: string[];
}

export interface ExpirationConfig {
  enabled: boolean;
  defaultTtl: number;
  strategy: ExpirationStrategy;
  policy: ExpirationPolicy;
  cleanup: CleanupConfig;
}

export type ExpirationStrategy = 
  | 'ttl'
  | 'lru'
  | 'lfu'
  | 'fifo'
  | 'lifo'
  | 'custom';

export interface ExpirationPolicy {
  lazy: boolean;
  proactive: boolean;
  batch: boolean;
  notification: boolean;
}

export interface CleanupConfig {
  enabled: boolean;
  interval: number;
  batchSize: number;
  maxDuration: number;
}

export interface ConsistencyConfig {
  level: ConsistencyLevel;
  isolation: IsolationLevel;
  durability: DurabilityLevel;
  atomicity: AtomicityLevel;
}

export type IsolationLevel = 
  | 'read_uncommitted'
  | 'read_committed'
  | 'repeatable_read'
  | 'serializable'
  | 'snapshot'
  | 'custom';

export type AtomicityLevel = 
  | 'none'
  | 'operation'
  | 'transaction'
  | 'distributed'
  | 'custom';

export interface PerformanceConfig {
  caching: CachingConfig;
  pooling: PoolingConfig;
  batching: BatchingConfig;
  prefetching: PrefetchingConfig;
  monitoring: MonitoringConfig;
}

export interface CachingConfig {
  enabled: boolean;
  strategy: CachingStrategy;
  size: number;
  layers: CacheLayer[];
}

export type CachingStrategy = 
  | 'write_through'
  | 'write_back'
  | 'write_around'
  | 'read_through'
  | 'refresh_ahead'
  | 'custom';

export interface CacheLayer {
  name: string;
  type: CacheType;
  size: number;
  ttl: number;
  eviction: EvictionPolicy;
}

export type CacheType = 
  | 'memory'
  | 'disk'
  | 'distributed'
  | 'hybrid'
  | 'custom';

export type EvictionPolicy = 
  | 'lru'
  | 'lfu'
  | 'fifo'
  | 'lifo'
  | 'random'
  | 'custom';

export interface PoolingConfig {
  enabled: boolean;
  minSize: number;
  maxSize: number;
  timeout: number;
  validation: PoolValidation;
}

export interface PoolValidation {
  enabled: boolean;
  query: string;
  timeout: number;
  interval: number;
}

export interface BatchingConfig {
  enabled: boolean;
  size: number;
  timeout: number;
  strategy: BatchingStrategy;
}

export type BatchingStrategy = 
  | 'size'
  | 'time'
  | 'adaptive'
  | 'custom';

export interface PrefetchingConfig {
  enabled: boolean;
  strategy: PrefetchingStrategy;
  lookahead: number;
  pattern: string;
}

export type PrefetchingStrategy = 
  | 'sequential'
  | 'random'
  | 'pattern'
  | 'ml'
  | 'custom';

export interface MonitoringConfig {
  enabled: boolean;
  metrics: MonitoringMetric[];
  alerts: MonitoringAlert[];
  dashboard: DashboardConfig;
}

export interface MonitoringMetric {
  name: string;
  type: MetricType;
  aggregation: AggregationType;
  interval: number;
  retention: number;
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
  | 'custom';

export interface MonitoringAlert {
  name: string;
  condition: AlertCondition;
  threshold: Threshold;
  actions: AlertAction[];
  cooldown: number;
}

export interface AlertCondition {
  metric: string;
  operator: ComparisonOperator;
  value: number;
  duration: number;
}

export type ComparisonOperator = 
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'eq'
  | 'ne'
  | 'between'
  | 'not_between';

export interface Threshold {
  warning: number;
  critical: number;
  recovery: number;
}

export interface AlertAction {
  type: AlertActionType;
  configuration: AlertConfiguration;
  delay?: number;
}

export type AlertActionType = 
  | 'email'
  | 'sms'
  | 'webhook'
  | 'slack'
  | 'pager'
  | 'auto_scale'
  | 'custom';

export interface AlertConfiguration {
  url?: string;
  recipients?: string[];
  template?: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface DashboardConfig {
  enabled: boolean;
  title: string;
  panels: DashboardPanel[];
  refresh: number;
  timeRange: TimeRange;
}

export interface DashboardPanel {
  id: string;
  title: string;
  type: PanelType;
  metrics: string[];
  visualization: VisualizationConfig;
  position: PanelPosition;
  size: PanelSize;
}

export type PanelType = 
  | 'chart'
  | 'table'
  | 'gauge'
  | 'stat'
  | 'heatmap'
  | 'custom';

export interface VisualizationConfig {
  type: VisualizationType;
  options: VisualizationOptions;
}

export type VisualizationType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'custom';

export interface VisualizationOptions {
  colors?: string[];
  legend?: boolean;
  tooltip?: boolean;
  zoom?: boolean;
  stacked?: boolean;
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

export interface MemoryState {
  status: MemoryStatus;
  health: MemoryHealth;
  usage: MemoryUsage;
  performance: MemoryPerformance;
  operations: OperationStats;
  replication: ReplicationState;
  consistency: ConsistencyState;
  errors: ErrorState;
}

export type MemoryStatus = 
  | 'initializing'
  | 'active'
  | 'degraded'
  | 'maintenance'
  | 'error'
  | 'shutdown';

export interface MemoryHealth {
  score: number;
  checks: HealthCheck[];
  issues: HealthIssue[];
  recommendations: HealthRecommendation[];
}

export interface HealthCheck {
  name: string;
  status: HealthStatus;
  duration: number;
  message?: string;
  timestamp: Date;
}

export type HealthStatus = 
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'unknown';

export interface HealthIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  description: string;
  impact: string;
  resolution: string;
  timestamp: Date;
}

export type IssueType = 
  | 'performance'
  | 'capacity'
  | 'reliability'
  | 'security'
  | 'configuration'
  | 'custom';

export type IssueSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface HealthRecommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  description: string;
  impact: string;
  effort: EffortLevel;
  timeline: string;
}

export type RecommendationType = 
  | 'optimization'
  | 'scaling'
  | 'configuration'
  | 'maintenance'
  | 'security'
  | 'custom';

export type RecommendationPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type EffortLevel = 
  | 'trivial'
  | 'small'
  | 'medium'
  | 'large'
  | 'epic';

export interface MemoryUsage {
  total: number;
  used: number;
  free: number;
  reserved: number;
  overhead: number;
  fragmentation: number;
  efficiency: number;
}

export interface MemoryPerformance {
  throughput: ThroughputMetrics;
  latency: LatencyMetrics;
  availability: AvailabilityMetrics;
  consistency: ConsistencyMetrics;
}

export interface ThroughputMetrics {
  reads: number;
  writes: number;
  deletes: number;
  queries: number;
  total: number;
}

export interface LatencyMetrics {
  read: LatencyStats;
  write: LatencyStats;
  delete: LatencyStats;
  query: LatencyStats;
}

export interface LatencyStats {
  avg: number;
  min: number;
  max: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface AvailabilityMetrics {
  uptime: number;
  downtime: number;
  incidents: number;
  mttr: number;
  mtbf: number;
}

export interface ConsistencyMetrics {
  level: ConsistencyLevel;
  lag: number;
  conflicts: number;
  repairs: number;
}

export interface OperationStats {
  total: number;
  successful: number;
  failed: number;
  retries: number;
  timeouts: number;
  rate: number;
}

export interface ReplicationState {
  status: ReplicationStatus;
  nodes: ReplicationNode[];
  lag: number;
  conflicts: number;
  health: ReplicationHealth;
}

export type ReplicationStatus = 
  | 'active'
  | 'degraded'
  | 'failed'
  | 'recovering'
  | 'disabled';

export interface ReplicationNode {
  id: string;
  role: NodeRole;
  status: NodeStatus;
  lag: number;
  health: number;
  lastSync: Date;
}

export type NodeRole = 
  | 'primary'
  | 'secondary'
  | 'replica'
  | 'backup'
  | 'witness';

export type NodeStatus = 
  | 'online'
  | 'offline'
  | 'syncing'
  | 'failed'
  | 'recovering';

export interface ReplicationHealth {
  score: number;
  issues: ReplicationIssue[];
  warnings: ReplicationWarning[];
}

export interface ReplicationIssue {
  node: string;
  type: ReplicationIssueType;
  severity: IssueSeverity;
  description: string;
  timestamp: Date;
}

export type ReplicationIssueType = 
  | 'lag'
  | 'disconnect'
  | 'conflict'
  | 'corruption'
  | 'performance'
  | 'custom';

export interface ReplicationWarning {
  node: string;
  type: ReplicationWarningType;
  message: string;
  timestamp: Date;
}

export type ReplicationWarningType = 
  | 'high_lag'
  | 'slow_sync'
  | 'capacity'
  | 'configuration'
  | 'custom';

export interface ConsistencyState {
  level: ConsistencyLevel;
  violations: ConsistencyViolation[];
  repairs: ConsistencyRepair[];
  health: ConsistencyHealth;
}

export interface ConsistencyViolation {
  id: string;
  type: ViolationType;
  description: string;
  impact: ImpactLevel;
  detected: Date;
  resolved?: Date;
}

export type ViolationType = 
  | 'read_inconsistency'
  | 'write_conflict'
  | 'timestamp_skew'
  | 'ordering_violation'
  | 'partition_tolerance'
  | 'custom';

export type ImpactLevel = 
  | 'none'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface ConsistencyRepair {
  id: string;
  violation: string;
  method: RepairMethod;
  status: RepairStatus;
  started: Date;
  completed?: Date;
  result?: string;
}

export type RepairMethod = 
  | 'read_repair'
  | 'anti_entropy'
  | 'merkle_tree'
  | 'vector_clock'
  | 'consensus'
  | 'custom';

export type RepairStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ConsistencyHealth {
  score: number;
  trend: TrendDirection;
  issues: number;
  violations: number;
  repairs: number;
}

export type TrendDirection = 
  | 'improving'
  | 'stable'
  | 'degrading'
  | 'volatile';

export interface ErrorState {
  total: number;
  recent: number;
  rate: number;
  types: Record<string, number>;
  severity: Record<string, number>;
  trends: ErrorTrend[];
}

export interface ErrorTrend {
  type: string;
  count: number;
  rate: number;
  trend: TrendDirection;
  period: string;
}

export interface MemoryCapability {
  id: string;
  name: string;
  description: string;
  type: CapabilityType;
  version: string;
  enabled: boolean;
  configuration: CapabilityConfiguration;
}

export type CapabilityType = 
  | 'storage'
  | 'indexing'
  | 'querying'
  | 'replication'
  | 'compression'
  | 'encryption'
  | 'monitoring'
  | 'custom';

export interface CapabilityConfiguration {
  parameters: CapabilityParameter[];
  constraints: CapabilityConstraint[];
  dependencies: CapabilityDependency[];
}

export interface CapabilityParameter {
  name: string;
  type: ParameterType;
  value: any;
  required: boolean;
  validation?: ParameterValidation;
}

export type ParameterType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'enum'
  | 'custom';

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
  | 'custom';

export interface CapabilityConstraint {
  type: ConstraintType;
  description: string;
  impact: ImpactLevel;
  workaround?: string;
}

export type ConstraintType = 
  | 'resource'
  | 'dependency'
  | 'environment'
  | 'configuration'
  | 'version'
  | 'custom';

export interface CapabilityDependency {
  capability: string;
  version: string;
  required: boolean;
  type: DependencyType;
}

export type DependencyType = 
  | 'hard'
  | 'soft'
  | 'optional'
  | 'conflicting'
  | 'custom';

export interface MemoryMetrics {
  performance: PerformanceMetrics;
  usage: UsageMetrics;
  reliability: ReliabilityMetrics;
  efficiency: EfficiencyMetrics;
}

export interface PerformanceMetrics {
  throughput: ThroughputMetrics;
  latency: LatencyMetrics;
  concurrency: ConcurrencyMetrics;
  scalability: ScalabilityMetrics;
}

export interface ConcurrencyMetrics {
  maxConcurrent: number;
  currentConcurrent: number;
  averageConcurrent: number;
  contention: number;
  deadlocks: number;
}

export interface ScalabilityMetrics {
  horizontal: ScalabilityScore;
  vertical: ScalabilityScore;
  elasticity: number;
  bottlenecks: BottleneckInfo[];
}

export interface ScalabilityScore {
  score: number;
  limit: number;
  current: number;
  trend: TrendDirection;
}

export interface BottleneckInfo {
  component: string;
  type: BottleneckType;
  severity: number;
  impact: number;
  recommendation: string;
}

export type BottleneckType = 
  | 'cpu'
  | 'memory'
  | 'network'
  | 'disk'
  | 'lock'
  | 'custom';

export interface UsageMetrics {
  capacity: CapacityMetrics;
  distribution: DistributionMetrics;
  patterns: UsagePattern[];
  trends: UsageTrend[];
}

export interface CapacityMetrics {
  total: number;
  used: number;
  available: number;
  utilization: number;
  growth: number;
}

export interface DistributionMetrics {
  keys: DistributionStats;
  values: DistributionStats;
  access: DistributionStats;
}

export interface DistributionStats {
  count: number;
  size: SizeStats;
  frequency: FrequencyStats;
  skew: number;
}

export interface SizeStats {
  min: number;
  max: number;
  avg: number;
  median: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface FrequencyStats {
  total: number;
  rate: number;
  peak: number;
  variance: number;
}

export interface UsagePattern {
  id: string;
  type: PatternType;
  description: string;
  frequency: number;
  confidence: number;
  impact: number;
}

export type PatternType = 
  | 'temporal'
  | 'spatial'
  | 'access'
  | 'size'
  | 'lifecycle'
  | 'custom';

export interface UsageTrend {
  metric: string;
  direction: TrendDirection;
  rate: number;
  confidence: number;
  forecast: ForecastData[];
}

export interface ForecastData {
  timestamp: Date;
  value: number;
  confidence: number;
  bounds: ForecastBounds;
}

export interface ForecastBounds {
  lower: number;
  upper: number;
  confidence: number;
}

export interface ReliabilityMetrics {
  availability: AvailabilityMetrics;
  durability: DurabilityMetrics;
  consistency: ConsistencyMetrics;
  recovery: RecoveryMetrics;
}

export interface DurabilityMetrics {
  guarantee: number;
  violations: number;
  loss: number;
  corruption: number;
}

export interface RecoveryMetrics {
  mttr: number;
  rto: number;
  rpo: number;
  success: number;
  failure: number;
}

export interface EfficiencyMetrics {
  storage: StorageEfficiency;
  compute: ComputeEfficiency;
  network: NetworkEfficiency;
  cost: CostEfficiency;
}

export interface StorageEfficiency {
  compression: number;
  deduplication: number;
  fragmentation: number;
  utilization: number;
}

export interface ComputeEfficiency {
  cpu: number;
  memory: number;
  threads: number;
  parallelism: number;
}

export interface NetworkEfficiency {
  bandwidth: number;
  latency: number;
  throughput: number;
  utilization: number;
}

export interface CostEfficiency {
  storage: number;
  compute: number;
  network: number;
  total: number;
}

export interface MemoryOperations {
  store: StoreOperation;
  retrieve: RetrieveOperation;
  delete: DeleteOperation;
  query: QueryOperation;
  stream: StreamOperation;
  bulk: BulkOperation;
  transaction: TransactionOperation;
  maintenance: MaintenanceOperation;
}

export interface StoreOperation {
  put: (key: string, value: any, options?: StoreOptions) => Promise<StoreResult>;
  putBatch: (entries: StoreEntry[], options?: StoreOptions) => Promise<BatchResult>;
  putStream: (stream: StoreStream, options?: StoreOptions) => Promise<StreamResult>;
}

export interface StoreOptions {
  ttl?: number;
  namespace?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  consistency?: ConsistencyLevel;
  durability?: DurabilityLevel;
  replication?: ReplicationLevel;
  compression?: boolean;
  encryption?: boolean;
}

export type ReplicationLevel = 
  | 'none'
  | 'local'
  | 'regional'
  | 'global'
  | 'custom';

export interface StoreEntry {
  key: string;
  value: any;
  options?: StoreOptions;
}

export interface StoreStream {
  entries: AsyncIterable<StoreEntry>;
  options?: StoreOptions;
}

export interface StoreResult {
  success: boolean;
  key: string;
  version: string;
  timestamp: Date;
  size: number;
  error?: MemoryError;
}

export interface BatchResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: StoreResult[];
  duration: number;
}

export interface StreamResult {
  success: boolean;
  total: number;
  processed: number;
  skipped: number;
  failed: number;
  duration: number;
  rate: number;
}

export interface RetrieveOperation {
  get: (key: string, options?: RetrieveOptions) => Promise<RetrieveResult>;
  getBatch: (keys: string[], options?: RetrieveOptions) => Promise<BatchRetrieveResult>;
  getStream: (keys: AsyncIterable<string>, options?: RetrieveOptions) => Promise<StreamRetrieveResult>;
}

export interface RetrieveOptions {
  namespace?: string;
  consistency?: ConsistencyLevel;
  timeout?: number;
  projection?: string[];
  version?: string;
}

export interface RetrieveResult {
  success: boolean;
  key: string;
  value: any;
  version: string;
  timestamp: Date;
  ttl?: number;
  metadata?: Record<string, any>;
  cached: boolean;
  error?: MemoryError;
}

export interface BatchRetrieveResult {
  success: boolean;
  total: number;
  found: number;
  missing: number;
  results: RetrieveResult[];
  duration: number;
}

export interface StreamRetrieveResult {
  success: boolean;
  total: number;
  found: number;
  missing: number;
  results: AsyncIterable<RetrieveResult>;
  duration: number;
}

export interface DeleteOperation {
  delete: (key: string, options?: DeleteOptions) => Promise<DeleteResult>;
  deleteBatch: (keys: string[], options?: DeleteOptions) => Promise<BatchDeleteResult>;
  deleteQuery: (query: DeleteQuery, options?: DeleteOptions) => Promise<QueryDeleteResult>;
}

export interface DeleteOptions {
  namespace?: string;
  consistency?: ConsistencyLevel;
  cascade?: boolean;
  version?: string;
}

export interface DeleteQuery {
  namespace?: string;
  tags?: string[];
  pattern?: string;
  filter?: QueryFilter;
  limit?: number;
}

export interface QueryFilter {
  type: FilterType;
  field: string;
  operator: FilterOperator;
  value: any;
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
  | 'regex'
  | 'exists'
  | 'custom';

export interface DeleteResult {
  success: boolean;
  key: string;
  existed: boolean;
  version: string;
  timestamp: Date;
  error?: MemoryError;
}

export interface BatchDeleteResult {
  success: boolean;
  total: number;
  deleted: number;
  missing: number;
  results: DeleteResult[];
  duration: number;
}

export interface QueryDeleteResult {
  success: boolean;
  matched: number;
  deleted: number;
  duration: number;
  error?: MemoryError;
}

export interface QueryOperation {
  find: (query: MemoryQuery, options?: QueryOptions) => Promise<QueryResult>;
  findStream: (query: MemoryQuery, options?: QueryOptions) => Promise<StreamQueryResult>;
  count: (query: MemoryQuery, options?: QueryOptions) => Promise<CountResult>;
  aggregate: (query: AggregateQuery, options?: QueryOptions) => Promise<AggregateResult>;
}

export interface MemoryQuery {
  namespace?: string;
  tags?: string[];
  pattern?: string;
  filter?: QueryFilter[];
  sort?: SortSpec[];
  limit?: number;
  offset?: number;
}

export interface SortSpec {
  field: string;
  direction: SortDirection;
}

export interface QueryOptions {
  consistency?: ConsistencyLevel;
  timeout?: number;
  projection?: string[];
  hint?: QueryHint;
}

export interface QueryHint {
  index?: string;
  strategy?: QueryStrategy;
  parallel?: boolean;
  cache?: boolean;
}

export type QueryStrategy = 
  | 'scan'
  | 'index'
  | 'hash'
  | 'range'
  | 'custom';

export interface QueryResult {
  success: boolean;
  total: number;
  returned: number;
  offset: number;
  limit: number;
  entries: MemoryEntry[];
  duration: number;
  cached: boolean;
  error?: MemoryError;
}

export interface StreamQueryResult {
  success: boolean;
  total: number;
  entries: AsyncIterable<MemoryEntry>;
  duration: number;
  error?: MemoryError;
}

export interface CountResult {
  success: boolean;
  count: number;
  estimated: boolean;
  duration: number;
  error?: MemoryError;
}

export interface AggregateQuery {
  namespace?: string;
  filter?: QueryFilter[];
  groupBy?: string[];
  aggregations: AggregationSpec[];
}

export interface AggregationSpec {
  name: string;
  function: AggregationFunction;
  field?: string;
  parameters?: Record<string, any>;
}

export type AggregationFunction = 
  | 'count'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'distinct'
  | 'percentile'
  | 'custom';

export interface AggregateResult {
  success: boolean;
  groups: AggregateGroup[];
  duration: number;
  error?: MemoryError;
}

export interface AggregateGroup {
  key: Record<string, any>;
  aggregations: Record<string, any>;
  count: number;
}

export interface StreamOperation {
  subscribe: (pattern: string, handler: StreamHandler) => StreamSubscription;
  unsubscribe: (subscription: StreamSubscription) => void;
  publish: (event: StreamEvent) => Promise<PublishResult>;
}

export interface StreamHandler {
  (event: StreamEvent): Promise<void>;
}

export interface StreamSubscription {
  id: string;
  pattern: string;
  handler: StreamHandler;
  created: Date;
  active: boolean;
  metrics: SubscriptionMetrics;
}

export interface SubscriptionMetrics {
  events: number;
  errors: number;
  latency: number;
  throughput: number;
}

export interface StreamEvent {
  id: string;
  type: EventType;
  key: string;
  value?: any;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export type EventType = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'expired'
  | 'evicted'
  | 'custom';

export interface PublishResult {
  success: boolean;
  eventId: string;
  subscribers: number;
  delivered: number;
  failed: number;
  duration: number;
}

export interface BulkOperation {
  import: (source: ImportSource, options?: ImportOptions) => Promise<ImportResult>;
  export: (destination: ExportDestination, options?: ExportOptions) => Promise<ExportResult>;
  backup: (destination: BackupDestination, options?: BackupOptions) => Promise<BackupResult>;
  restore: (source: RestoreSource, options?: RestoreOptions) => Promise<RestoreResult>;
}

export interface ImportSource {
  type: SourceType;
  location: string;
  format: DataFormat;
  credentials?: Credentials;
  options?: SourceOptions;
}

export type SourceType = 
  | 'file'
  | 'database'
  | 'url'
  | 'stream'
  | 'memory'
  | 'custom';

export type DataFormat = 
  | 'json'
  | 'csv'
  | 'xml'
  | 'binary'
  | 'parquet'
  | 'avro'
  | 'custom';

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
  | 'oauth'
  | 'custom';

export interface SourceOptions {
  compression?: boolean;
  encryption?: boolean;
  encoding?: string;
  delimiter?: string;
  headers?: boolean;
  schema?: string;
}

export interface ImportOptions {
  namespace?: string;
  overwrite?: boolean;
  upsert?: boolean;
  validation?: boolean;
  transformation?: TransformationSpec;
  batchSize?: number;
  parallel?: boolean;
}

export interface TransformationSpec {
  type: TransformationType;
  script: string;
  parameters?: Record<string, any>;
}

export type TransformationType = 
  | 'map'
  | 'filter'
  | 'reduce'
  | 'join'
  | 'aggregate'
  | 'custom';

export interface ImportResult {
  success: boolean;
  total: number;
  processed: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: ImportError[];
  duration: number;
  rate: number;
}

export interface ImportError {
  record: number;
  key?: string;
  message: string;
  data?: any;
}

export interface ExportDestination {
  type: DestinationType;
  location: string;
  format: DataFormat;
  credentials?: Credentials;
  options?: DestinationOptions;
}

export type DestinationType = 
  | 'file'
  | 'database'
  | 'url'
  | 'stream'
  | 'memory'
  | 'custom';

export interface DestinationOptions {
  compression?: boolean;
  encryption?: boolean;
  encoding?: string;
  delimiter?: string;
  headers?: boolean;
  overwrite?: boolean;
}

export interface ExportOptions {
  namespace?: string;
  filter?: QueryFilter[];
  projection?: string[];
  sort?: SortSpec[];
  limit?: number;
  batchSize?: number;
  parallel?: boolean;
}

export interface ExportResult {
  success: boolean;
  total: number;
  exported: number;
  skipped: number;
  failed: number;
  errors: ExportError[];
  duration: number;
  rate: number;
  size: number;
}

export interface ExportError {
  key: string;
  message: string;
  data?: any;
}

export interface BackupDestination {
  type: BackupType;
  location: string;
  credentials?: Credentials;
  options?: BackupDestinationOptions;
}

export type BackupType = 
  | 'file'
  | 'cloud'
  | 'database'
  | 'tape'
  | 'custom';

export interface BackupDestinationOptions {
  compression?: boolean;
  encryption?: boolean;
  incremental?: boolean;
  verification?: boolean;
  retention?: number;
}

export interface BackupOptions {
  type: BackupStrategyType;
  consistency?: ConsistencyLevel;
  parallel?: boolean;
  verification?: boolean;
  metadata?: boolean;
}

export type BackupStrategyType = 
  | 'full'
  | 'incremental'
  | 'differential'
  | 'snapshot'
  | 'custom';

export interface BackupResult {
  success: boolean;
  type: BackupStrategyType;
  size: number;
  compressed: number;
  checksum: string;
  entries: number;
  duration: number;
  rate: number;
  error?: MemoryError;
}

export interface RestoreSource {
  type: RestoreSourceType;
  location: string;
  credentials?: Credentials;
  options?: RestoreSourceOptions;
}

export type RestoreSourceType = 
  | 'backup'
  | 'snapshot'
  | 'file'
  | 'stream'
  | 'custom';

export interface RestoreSourceOptions {
  compression?: boolean;
  encryption?: boolean;
  verification?: boolean;
  checksum?: string;
}

export interface RestoreOptions {
  namespace?: string;
  overwrite?: boolean;
  verification?: boolean;
  consistency?: ConsistencyLevel;
  parallel?: boolean;
}

export interface RestoreResult {
  success: boolean;
  entries: number;
  restored: number;
  skipped: number;
  failed: number;
  errors: RestoreError[];
  duration: number;
  rate: number;
  verification: VerificationResult;
}

export interface RestoreError {
  key: string;
  message: string;
  data?: any;
}

export interface VerificationResult {
  success: boolean;
  checksum: string;
  entries: number;
  corrupt: number;
  missing: number;
  errors: VerificationError[];
}

export interface VerificationError {
  key: string;
  type: VerificationErrorType;
  message: string;
}

export type VerificationErrorType = 
  | 'checksum'
  | 'missing'
  | 'corrupt'
  | 'format'
  | 'custom';

export interface TransactionOperation {
  begin: (options?: TransactionOptions) => Promise<Transaction>;
  commit: (transaction: Transaction) => Promise<CommitResult>;
  rollback: (transaction: Transaction) => Promise<RollbackResult>;
}

export interface TransactionOptions {
  isolation?: IsolationLevel;
  timeout?: number;
  readOnly?: boolean;
  deferrable?: boolean;
}

export interface Transaction {
  id: string;
  state: TransactionState;
  isolation: IsolationLevel;
  started: Date;
  timeout: number;
  readOnly: boolean;
  operations: TransactionOperation[];
  locks: TransactionLock[];
  metadata: Record<string, any>;
}

export type TransactionState = 
  | 'active'
  | 'committed'
  | 'aborted'
  | 'preparing'
  | 'prepared'
  | 'failed';

export interface TransactionLock {
  resource: string;
  type: LockType;
  mode: LockMode;
  acquired: Date;
  duration: number;
}

export type LockType = 
  | 'read'
  | 'write'
  | 'exclusive'
  | 'shared'
  | 'intent'
  | 'custom';

export type LockMode = 
  | 'immediate'
  | 'deferred'
  | 'exclusive'
  | 'shared'
  | 'custom';

export interface CommitResult {
  success: boolean;
  transactionId: string;
  timestamp: Date;
  duration: number;
  operations: number;
  conflicts: number;
  error?: MemoryError;
}

export interface RollbackResult {
  success: boolean;
  transactionId: string;
  timestamp: Date;
  duration: number;
  operations: number;
  reason: string;
  error?: MemoryError;
}

export interface MaintenanceOperation {
  vacuum: (options?: VacuumOptions) => Promise<VacuumResult>;
  analyze: (options?: AnalyzeOptions) => Promise<AnalyzeResult>;
  reindex: (options?: ReindexOptions) => Promise<ReindexResult>;
  compact: (options?: CompactOptions) => Promise<CompactResult>;
  repair: (options?: RepairOptions) => Promise<RepairResult>;
}

export interface VacuumOptions {
  namespace?: string;
  aggressive?: boolean;
  analyze?: boolean;
  parallel?: boolean;
}

export interface VacuumResult {
  success: boolean;
  freed: number;
  compacted: number;
  duration: number;
  statistics: VacuumStatistics;
}

export interface VacuumStatistics {
  pagesFree: number;
  pagesUsed: number;
  fragmentation: number;
  efficiency: number;
}

export interface AnalyzeOptions {
  namespace?: string;
  tables?: string[];
  columns?: string[];
  sample?: number;
}

export interface AnalyzeResult {
  success: boolean;
  tables: number;
  columns: number;
  samples: number;
  duration: number;
  statistics: AnalyzeStatistics;
}

export interface AnalyzeStatistics {
  cardinality: Record<string, number>;
  distribution: Record<string, DistributionStats>;
  nulls: Record<string, number>;
  correlations: Record<string, number>;
}

export interface ReindexOptions {
  namespace?: string;
  indexes?: string[];
  parallel?: boolean;
  online?: boolean;
}

export interface ReindexResult {
  success: boolean;
  indexes: number;
  rebuilt: number;
  duration: number;
  statistics: ReindexStatistics;
}

export interface ReindexStatistics {
  sizeBefore: number;
  sizeAfter: number;
  compression: number;
  fragmentation: number;
}

export interface CompactOptions {
  namespace?: string;
  threshold?: number;
  aggressive?: boolean;
  parallel?: boolean;
}

export interface CompactResult {
  success: boolean;
  sizeBefore: number;
  sizeAfter: number;
  freed: number;
  duration: number;
  statistics: CompactStatistics;
}

export interface CompactStatistics {
  filesBefore: number;
  filesAfter: number;
  fragmentation: number;
  efficiency: number;
}

export interface RepairOptions {
  namespace?: string;
  verify?: boolean;
  fix?: boolean;
  backup?: boolean;
}

export interface RepairResult {
  success: boolean;
  issues: number;
  fixed: number;
  duration: number;
  report: RepairReport;
}

export interface RepairReport {
  corruption: CorruptionInfo[];
  inconsistencies: InconsistencyInfo[];
  fixes: FixInfo[];
  recommendations: string[];
}

export interface CorruptionInfo {
  location: string;
  type: CorruptionType;
  severity: CorruptionSeverity;
  description: string;
  fixable: boolean;
}

export type CorruptionType = 
  | 'checksum'
  | 'structure'
  | 'index'
  | 'metadata'
  | 'custom';

export type CorruptionSeverity = 
  | 'minor'
  | 'major'
  | 'critical'
  | 'fatal';

export interface InconsistencyInfo {
  location: string;
  type: InconsistencyType;
  description: string;
  impact: ImpactLevel;
  fixable: boolean;
}

export type InconsistencyType = 
  | 'duplicate'
  | 'missing'
  | 'orphan'
  | 'reference'
  | 'constraint'
  | 'custom';

export interface FixInfo {
  issue: string;
  action: FixAction;
  result: FixResult;
  duration: number;
}

export type FixAction = 
  | 'remove'
  | 'repair'
  | 'recreate'
  | 'ignore'
  | 'custom';

export type FixResult = 
  | 'success'
  | 'partial'
  | 'failed'
  | 'skipped';

export interface MemoryError {
  code: string;
  message: string;
  type: MemoryErrorType;
  severity: ErrorSeverity;
  retryable: boolean;
  details?: Record<string, any>;
  stackTrace?: string;
}

export type MemoryErrorType = 
  | 'connection'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'conflict'
  | 'timeout'
  | 'capacity'
  | 'corruption'
  | 'consistency'
  | 'replication'
  | 'network'
  | 'system'
  | 'custom';

export type ErrorSeverity = 
  | 'info'
  | 'warning'
  | 'error'
  | 'critical'
  | 'fatal';

// ===== Swarm Memory Types =====

export interface SwarmMemory extends MemoryStore {
  type: 'swarm';
  swarm: SwarmConfiguration;
  coordination: CoordinationInterface;
  consensus: ConsensusInterface;
  synchronization: SynchronizationInterface;
}

export interface SwarmConfiguration {
  id: string;
  topology: SwarmTopology;
  nodes: SwarmNode[];
  protocols: SwarmProtocol[];
  policies: SwarmPolicy[];
}

export interface SwarmTopology {
  type: TopologyType;
  nodes: number;
  edges: number;
  diameter: number;
  clustering: number;
  redundancy: number;
}

export type TopologyType = 
  | 'star'
  | 'ring'
  | 'mesh'
  | 'tree'
  | 'hierarchy'
  | 'custom';

export interface SwarmNode {
  id: string;
  role: SwarmRole;
  status: SwarmStatus;
  capabilities: SwarmCapability[];
  connections: SwarmConnection[];
  metadata: SwarmNodeMetadata;
}

export type SwarmRole = 
  | 'coordinator'
  | 'participant'
  | 'observer'
  | 'backup'
  | 'custom';

export type SwarmStatus = 
  | 'active'
  | 'inactive'
  | 'joining'
  | 'leaving'
  | 'failed'
  | 'custom';

export interface SwarmCapability {
  name: string;
  type: SwarmCapabilityType;
  level: CapabilityLevel;
  enabled: boolean;
}

export type SwarmCapabilityType = 
  | 'storage'
  | 'computation'
  | 'coordination'
  | 'consensus'
  | 'monitoring'
  | 'custom';

export type CapabilityLevel = 
  | 'basic'
  | 'standard'
  | 'advanced'
  | 'expert'
  | 'custom';

export interface SwarmConnection {
  node: string;
  status: ConnectionStatus;
  latency: number;
  bandwidth: number;
  reliability: number;
}

export type ConnectionStatus = 
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'failed'
  | 'custom';

export interface SwarmNodeMetadata {
  created: Date;
  updated: Date;
  version: string;
  location: string;
  properties: Record<string, any>;
}

export interface SwarmProtocol {
  name: string;
  type: ProtocolType;
  version: string;
  configuration: ProtocolConfiguration;
  enabled: boolean;
}

export type ProtocolType = 
  | 'consensus'
  | 'synchronization'
  | 'communication'
  | 'replication'
  | 'coordination'
  | 'custom';

export interface ProtocolConfiguration {
  parameters: Record<string, any>;
  timeout: number;
  retries: number;
  backoff: BackoffStrategy;
}

export type BackoffStrategy = 
  | 'fixed'
  | 'linear'
  | 'exponential'
  | 'custom';

export interface SwarmPolicy {
  name: string;
  type: PolicyType;
  rules: PolicyRule[];
  priority: number;
  enabled: boolean;
}

export type PolicyType = 
  | 'access'
  | 'replication'
  | 'consistency'
  | 'recovery'
  | 'performance'
  | 'custom';

export interface PolicyRule {
  condition: string;
  action: string;
  parameters: Record<string, any>;
  priority: number;
}

export interface CoordinationInterface {
  coordinate: (request: CoordinationRequest) => Promise<CoordinationResponse>;
  negotiate: (proposal: NegotiationProposal) => Promise<NegotiationResult>;
  arbitrate: (conflict: ConflictInfo) => Promise<ArbitrationResult>;
  delegate: (task: DelegationTask) => Promise<DelegationResult>;
}

export interface CoordinationRequest {
  type: CoordinationType;
  participants: string[];
  proposal: any;
  timeout: number;
  priority: number;
}

export type CoordinationType = 
  | 'resource_allocation'
  | 'task_assignment'
  | 'load_balancing'
  | 'fault_tolerance'
  | 'custom';

export interface CoordinationResponse {
  success: boolean;
  result: any;
  participants: ParticipantResponse[];
  duration: number;
  conflicts: ConflictInfo[];
}

export interface ParticipantResponse {
  node: string;
  response: any;
  duration: number;
  error?: string;
}

export interface ConflictInfo {
  type: ConflictType;
  participants: string[];
  description: string;
  resolution?: ConflictResolution;
}

export type ConflictType = 
  | 'resource'
  | 'priority'
  | 'consistency'
  | 'timing'
  | 'custom';

export interface ConflictResolution {
  method: ResolutionMethod;
  result: any;
  duration: number;
}

export type ResolutionMethod = 
  | 'voting'
  | 'priority'
  | 'consensus'
  | 'arbitration'
  | 'custom';

export interface NegotiationProposal {
  type: NegotiationType;
  proposal: any;
  constraints: NegotiationConstraint[];
  deadline: Date;
}

export type NegotiationType = 
  | 'resource'
  | 'schedule'
  | 'priority'
  | 'configuration'
  | 'custom';

export interface NegotiationConstraint {
  type: ConstraintType;
  value: any;
  flexible: boolean;
}

export interface NegotiationResult {
  success: boolean;
  agreement: any;
  participants: string[];
  duration: number;
  rounds: number;
}

export interface ArbitrationResult {
  success: boolean;
  decision: any;
  rationale: string;
  duration: number;
}

export interface DelegationTask {
  id: string;
  type: TaskType;
  description: string;
  requirements: TaskRequirement[];
  deadline: Date;
  priority: number;
}

export type TaskType = 
  | 'computation'
  | 'storage'
  | 'communication'
  | 'monitoring'
  | 'custom';

export interface TaskRequirement {
  type: RequirementType;
  value: any;
  mandatory: boolean;
}

export type RequirementType = 
  | 'resource'
  | 'capability'
  | 'location'
  | 'performance'
  | 'custom';

export interface DelegationResult {
  success: boolean;
  assignee: string;
  duration: number;
  alternatives: string[];
}

export interface ConsensusInterface {
  propose: (proposal: ConsensusProposal) => Promise<ConsensusResult>;
  vote: (ballot: ConsensusBallot) => Promise<VoteResult>;
  commit: (decision: ConsensusDecision) => Promise<CommitResult>;
  abort: (reason: string) => Promise<AbortResult>;
}

export interface ConsensusProposal {
  id: string;
  type: ProposalType;
  value: any;
  proposer: string;
  timestamp: Date;
  timeout: number;
}

export type ProposalType = 
  | 'configuration'
  | 'membership'
  | 'resource'
  | 'policy'
  | 'custom';

export interface ConsensusResult {
  success: boolean;
  decision: any;
  votes: ConsensusVote[];
  duration: number;
  rounds: number;
}

export interface ConsensusVote {
  voter: string;
  value: any;
  timestamp: Date;
  weight: number;
}

export interface ConsensusBallot {
  proposal: string;
  vote: any;
  voter: string;
  timestamp: Date;
}

export interface VoteResult {
  success: boolean;
  accepted: boolean;
  reason?: string;
}

export interface ConsensusDecision {
  proposal: string;
  decision: any;
  votes: ConsensusVote[];
  timestamp: Date;
}

export interface AbortResult {
  success: boolean;
  reason: string;
  timestamp: Date;
}

export interface SynchronizationInterface {
  sync: (request: SyncRequest) => Promise<SyncResult>;
  clock: (type: ClockType) => Promise<ClockResult>;
  barrier: (participants: string[]) => Promise<BarrierResult>;
  lock: (resource: string) => Promise<LockResult>;
  unlock: (resource: string) => Promise<UnlockResult>;
}

export interface SyncRequest {
  type: SyncType;
  participants: string[];
  data?: any;
  timeout: number;
}

export type SyncType = 
  | 'data'
  | 'clock'
  | 'state'
  | 'configuration'
  | 'custom';

export interface SyncResult {
  success: boolean;
  synchronized: string[];
  conflicts: SyncConflict[];
  duration: number;
}

export interface SyncConflict {
  participant: string;
  type: ConflictType;
  description: string;
  resolution?: ConflictResolution;
}

export type ClockType = 
  | 'logical'
  | 'vector'
  | 'physical'
  | 'hybrid'
  | 'custom';

export interface ClockResult {
  success: boolean;
  time: any;
  synchronized: boolean;
  drift: number;
}

export interface BarrierResult {
  success: boolean;
  participants: string[];
  duration: number;
  synchronized: boolean;
}

export interface LockResult {
  success: boolean;
  resource: string;
  owner: string;
  expires: Date;
  type: LockType;
}

export interface UnlockResult {
  success: boolean;
  resource: string;
  owner: string;
  duration: number;
}

// ===== Memory Factory and Registry =====

export interface MemoryFactory {
  create: (config: MemoryConfig) => Promise<MemoryStore>;
  destroy: (storeId: string) => Promise<void>;
  clone: (storeId: string, config?: Partial<MemoryConfig>) => Promise<MemoryStore>;
  migrate: (storeId: string, target: MemoryConfig) => Promise<MigrationResult>;
  getTemplates: () => Promise<MemoryTemplate[]>;
}

export interface MemoryConfig {
  type: MemoryStoreType;
  name: string;
  configuration: MemoryConfiguration;
  template?: string;
}

export interface MigrationResult {
  success: boolean;
  source: string;
  target: string;
  entries: number;
  duration: number;
  errors: MigrationError[];
}

export interface MigrationError {
  key: string;
  message: string;
  data?: any;
}

export interface MemoryTemplate {
  id: string;
  name: string;
  type: MemoryStoreType;
  description: string;
  configuration: MemoryConfiguration;
  parameters: TemplateParameter[];
  metadata: MemoryTemplateMetadata;
}

export interface TemplateParameter {
  name: string;
  type: ParameterType;
  description: string;
  required: boolean;
  default?: any;
}

export interface MemoryTemplateMetadata {
  author: string;
  version: string;
  created: Date;
  updated: Date;
  tags: string[];
  category: string;
}

export interface MemoryRegistry {
  register: (store: MemoryStore) => Promise<void>;
  unregister: (storeId: string) => Promise<void>;
  find: (query: MemoryQuery) => Promise<MemoryStore[]>;
  get: (storeId: string) => Promise<MemoryStore>;
  list: (filter?: MemoryFilter) => Promise<MemoryStore[]>;
  getStats: () => Promise<RegistryStats>;
}

export interface MemoryFilter {
  type?: MemoryStoreType[];
  status?: MemoryStatus[];
  namespace?: string[];
  tags?: string[];
  dateRange?: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface RegistryStats {
  total: number;
  byType: Record<MemoryStoreType, number>;
  byStatus: Record<MemoryStatus, number>;
  totalCapacity: number;
  totalUsed: number;
  totalAvailable: number;
  performance: RegistryPerformance;
}

export interface RegistryPerformance {
  throughput: number;
  latency: number;
  availability: number;
  reliability: number;
}