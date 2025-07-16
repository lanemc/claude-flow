/**
 * SPARC Architecture TypeScript Interfaces
 * Core types for the SPARC development methodology
 */

// ===== Core SPARC Types =====

export interface SparcPhase {
  name: SparcPhaseName;
  description: string;
  taskDescription: string;
  options: SparcOptions;
  artifacts: Map<string, SparcArtifact>;
  memory: SparcMemory;
  status: PhaseStatus;
  startTime?: Date;
  endTime?: Date;
  error?: Error;
}

export type SparcPhaseName = 
  | 'specification'
  | 'pseudocode'
  | 'architecture'
  | 'refinement'
  | 'completion';

export interface SparcOptions {
  verbose?: boolean;
  interactive?: boolean;
  outputDir?: string;
  memoryNamespace?: string;
  skipValidation?: boolean;
  parallel?: boolean;
  timeout?: number;
}

export interface SparcArtifact {
  name: string;
  content: string;
  type: ArtifactType;
  created: Date;
  modified: Date;
  checksum?: string;
}

export type ArtifactType = 
  | 'specification'
  | 'pseudocode'
  | 'architecture'
  | 'code'
  | 'test'
  | 'documentation';

export interface SparcMemory {
  namespace: string;
  entries: Map<string, MemoryEntry>;
  metadata: MemoryMetadata;
}

export interface MemoryEntry {
  key: string;
  value: any;
  timestamp: Date;
  ttl?: number;
  metadata?: Record<string, any>;
}

export interface MemoryMetadata {
  created: Date;
  modified: Date;
  version: number;
  tags: string[];
}

export interface PhaseStatus {
  phase: SparcPhaseName;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  message?: string;
  error?: string;
}

// ===== Specification Phase Types =====

export interface SparcSpecification {
  projectName: string;
  description: string;
  requirements: Requirement[];
  constraints: Constraint[];
  acceptanceCriteria: AcceptanceCriteria[];
  assumptions: string[];
  risks: Risk[];
  dependencies: Dependency[];
  metadata: SpecificationMetadata;
}

export interface Requirement {
  id: string;
  type: RequirementType;
  priority: Priority;
  description: string;
  rationale?: string;
  acceptance?: string[];
  dependencies?: string[];
  tags?: string[];
}

export type RequirementType = 
  | 'functional'
  | 'non-functional'
  | 'business'
  | 'technical'
  | 'regulatory';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Constraint {
  id: string;
  type: ConstraintType;
  description: string;
  impact: ImpactLevel;
  mitigation?: string;
}

export type ConstraintType = 
  | 'technical'
  | 'business'
  | 'regulatory'
  | 'resource'
  | 'time';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AcceptanceCriteria {
  id: string;
  description: string;
  testable: boolean;
  requirementIds: string[];
  validation?: ValidationMethod;
}

export interface ValidationMethod {
  type: 'manual' | 'automated' | 'review';
  description: string;
  tools?: string[];
}

export interface Risk {
  id: string;
  description: string;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  mitigation: string[];
  owner?: string;
  status: RiskStatus;
}

export type ProbabilityLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type RiskStatus = 'identified' | 'mitigated' | 'accepted' | 'closed';

export interface Dependency {
  id: string;
  type: DependencyType;
  name: string;
  version?: string;
  description?: string;
  required: boolean;
}

export type DependencyType = 
  | 'library'
  | 'service'
  | 'api'
  | 'database'
  | 'tool'
  | 'system';

export interface SpecificationMetadata {
  author: string;
  version: string;
  created: Date;
  modified: Date;
  reviewers?: string[];
  approvers?: string[];
  status: DocumentStatus;
}

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'final';

// ===== Pseudocode Phase Types =====

export interface SparcPseudocode {
  functions: PseudocodeFunction[];
  dataStructures: DataStructure[];
  algorithms: Algorithm[];
  controlFlow: ControlFlow[];
  errorHandling: ErrorHandlingStrategy[];
  optimizations: Optimization[];
}

export interface PseudocodeFunction {
  id: string;
  name: string;
  description: string;
  inputs: Parameter[];
  outputs: Parameter[];
  steps: PseudocodeStep[];
  complexity: ComplexityAnalysis;
  dependencies: string[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description?: string;
  validation?: string;
}

export interface PseudocodeStep {
  id: string;
  type: StepType;
  description: string;
  condition?: string;
  action: string;
  next?: string[];
  error?: string;
}

export type StepType = 
  | 'input'
  | 'process'
  | 'decision'
  | 'loop'
  | 'call'
  | 'output'
  | 'error';

export interface ComplexityAnalysis {
  time: string; // O(n), O(n²), etc.
  space: string;
  bestCase?: string;
  worstCase?: string;
  averageCase?: string;
  explanation?: string;
}

export interface DataStructure {
  name: string;
  type: DataStructureType;
  properties: Property[];
  methods: Method[];
  invariants: string[];
  complexity: ComplexityAnalysis;
}

export type DataStructureType = 
  | 'class'
  | 'interface'
  | 'enum'
  | 'type'
  | 'record'
  | 'union';

export interface Property {
  name: string;
  type: string;
  visibility: Visibility;
  required: boolean;
  readonly?: boolean;
  default?: any;
  description?: string;
}

export type Visibility = 'public' | 'private' | 'protected' | 'internal';

export interface Method {
  name: string;
  visibility: Visibility;
  parameters: Parameter[];
  returnType: string;
  description: string;
  complexity?: ComplexityAnalysis;
}

export interface Algorithm {
  name: string;
  description: string;
  type: AlgorithmType;
  steps: AlgorithmStep[];
  complexity: ComplexityAnalysis;
  proofOfCorrectness?: string;
}

export type AlgorithmType = 
  | 'sorting'
  | 'searching'
  | 'optimization'
  | 'machine_learning'
  | 'cryptographic'
  | 'graph'
  | 'dynamic_programming'
  | 'greedy'
  | 'divide_conquer'
  | 'other';

export interface AlgorithmStep {
  number: number;
  description: string;
  pseudocode: string;
  complexity?: string;
}

export interface ControlFlow {
  id: string;
  type: ControlFlowType;
  from: string;
  to: string;
  condition?: string;
  description?: string;
}

export type ControlFlowType = 
  | 'sequence'
  | 'branch'
  | 'loop'
  | 'call'
  | 'return'
  | 'exception';

export interface ErrorHandlingStrategy {
  type: ErrorType;
  strategy: string;
  recovery?: string;
  logging?: string;
  notification?: string;
}

export type ErrorType = 
  | 'validation'
  | 'network'
  | 'database'
  | 'authentication'
  | 'authorization'
  | 'business_logic'
  | 'system'
  | 'unknown';

export interface Optimization {
  type: OptimizationType;
  description: string;
  benefit: string;
  tradeoff?: string;
  implementation?: string;
}

export type OptimizationType = 
  | 'performance'
  | 'memory'
  | 'network'
  | 'database'
  | 'algorithm'
  | 'caching'
  | 'parallelization';

// ===== Architecture Phase Types =====

export interface SparcArchitecture {
  systemDesign: SystemDesign;
  components: Component[];
  designPatterns: DesignPattern[];
  dataModel: DataModel;
  apiDesign: ApiDesign;
  deploymentArchitecture: DeploymentArchitecture;
  securityArchitecture: SecurityArchitecture;
  scalabilityPlan: ScalabilityPlan;
  integrationPoints: Integration[];
  qualityAttributes: QualityAttributes;
  architecturalDecisions: ArchitecturalDecision[];
  riskAssessment: ArchitecturalRisk[];
}

export interface SystemDesign {
  style: ArchitectureStyle;
  layers: Layer[];
  components: string[];
  dataFlow: DataFlow[];
  controlFlow: SystemControlFlow[];
  boundaries: Boundary[];
}

export type ArchitectureStyle = 
  | 'layered'
  | 'microservices'
  | 'event-driven'
  | 'serverless'
  | 'monolithic'
  | 'mvc'
  | 'mvvm'
  | 'clean'
  | 'hexagonal'
  | 'modular';

export interface Layer {
  name: string;
  responsibility: string;
  components?: string[];
  dependencies?: string[];
  interfaces?: string[];
}

export interface DataFlow {
  from: string;
  to: string;
  direction: 'upstream' | 'downstream' | 'bidirectional';
  dataType: string;
  protocol?: string;
  format?: string;
}

export interface SystemControlFlow {
  layer: string;
  order: number;
  triggers: string[];
  actions: string[];
  outcomes: string[];
}

export interface Boundary {
  layer: string;
  type: BoundaryType;
  encapsulation: string;
  dependencies: string;
  contracts: string;
}

export type BoundaryType = 
  | 'logical'
  | 'physical'
  | 'process'
  | 'deployment'
  | 'security';

export interface Component {
  name: string;
  type: ComponentType;
  responsibility: string;
  interfaces: string[];
  dependencies: string[];
  patterns: string[];
  complexity: ComplexityLevel;
  metrics?: ComponentMetrics;
}

export type ComponentType = 
  | 'service'
  | 'controller'
  | 'repository'
  | 'utility'
  | 'model'
  | 'view'
  | 'presenter'
  | 'gateway'
  | 'adapter'
  | 'facade'
  | 'proxy'
  | 'decorator'
  | 'component';

export type ComplexityLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface ComponentMetrics {
  linesOfCode?: number;
  cyclomaticComplexity?: number;
  coupling?: number;
  cohesion?: number;
  testCoverage?: number;
}

export interface DesignPattern {
  name: string;
  type: PatternType;
  purpose: string;
  applicability: string;
  implementation: string;
  benefits: string[];
  drawbacks?: string[];
  examples?: string[];
}

export type PatternType = 
  | 'creational'
  | 'structural'
  | 'behavioral'
  | 'architectural'
  | 'concurrency'
  | 'integration';

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
  constraints: DataConstraint[];
  indexes: Index[];
  views: View[];
  procedures?: StoredProcedure[];
}

export interface Entity {
  name: string;
  attributes: Attribute[];
  primaryKey: string | string[];
  foreignKeys: ForeignKey[];
  constraints: EntityConstraint[];
  indexes: EntityIndex[];
}

export interface Attribute {
  name: string;
  type: string;
  nullable: boolean;
  unique?: boolean;
  default?: any;
  length?: number;
  precision?: number;
  scale?: number;
  description?: string;
}

export interface ForeignKey {
  name: string;
  column: string | string[];
  references: string;
  referencedColumn: string | string[];
  onDelete?: ReferentialAction;
  onUpdate?: ReferentialAction;
}

export type ReferentialAction = 
  | 'CASCADE'
  | 'RESTRICT'
  | 'SET NULL'
  | 'SET DEFAULT'
  | 'NO ACTION';

export interface EntityConstraint {
  name: string;
  type: ConstraintType;
  column?: string;
  condition?: string;
  expression?: string;
}

export interface EntityIndex {
  name: string;
  type: IndexType;
  columns: string[];
  unique?: boolean;
  condition?: string;
}

export type IndexType = 'BTREE' | 'HASH' | 'GIN' | 'GIST' | 'SPGIST' | 'BRIN';

export interface Relationship {
  name: string;
  type: RelationshipType;
  parent: string;
  child: string;
  parentKey: string;
  childKey: string;
  onDelete: ReferentialAction;
  onUpdate: ReferentialAction;
}

export type RelationshipType = 
  | 'one-to-one'
  | 'one-to-many'
  | 'many-to-one'
  | 'many-to-many';

export interface DataConstraint {
  name: string;
  type: string;
  condition: string;
  entities?: string[];
}

export interface Index {
  name: string;
  type: IndexType;
  table: string;
  columns: string[];
  unique?: boolean;
  condition?: string;
  include?: string[];
}

export interface View {
  name: string;
  definition: string;
  purpose: string;
  materialized?: boolean;
  refreshStrategy?: string;
}

export interface StoredProcedure {
  name: string;
  parameters: ProcedureParameter[];
  returnType?: string;
  body: string;
  purpose: string;
}

export interface ProcedureParameter {
  name: string;
  type: string;
  direction: 'IN' | 'OUT' | 'INOUT';
  default?: any;
}

export interface ApiDesign {
  version: string;
  baseUrl: string;
  authentication: string;
  endpoints: ApiEndpoint[];
  schemas: ApiSchema[];
  errorHandling: ErrorHandlingConfig;
  rateLimiting: RateLimitingConfig;
  versioning: VersioningStrategy;
}

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  summary: string;
  description?: string;
  parameters?: ApiParameter[];
  requestBody?: RequestBody;
  responses: Record<string, ApiResponse>;
  security?: SecurityRequirement[];
  tags?: string[];
}

export type HttpMethod = 
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

export interface ApiParameter {
  name: string;
  in: ParameterLocation;
  type: string;
  required?: boolean;
  description?: string;
  default?: any;
  enum?: any[];
  pattern?: string;
}

export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, MediaType>;
}

export interface MediaType {
  schema: string | ApiSchema;
  example?: any;
  examples?: Record<string, any>;
}

export interface ApiResponse {
  description: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, ApiHeader>;
}

export interface ApiHeader {
  description?: string;
  type: string;
  format?: string;
}

export interface SecurityRequirement {
  type: SecurityType;
  scopes?: string[];
}

export type SecurityType = 
  | 'apiKey'
  | 'http'
  | 'oauth2'
  | 'openIdConnect';

export interface ApiSchema {
  name: string;
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  example?: any;
}

export interface SchemaProperty {
  type: string;
  format?: string;
  description?: string;
  default?: any;
  enum?: any[];
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  items?: SchemaProperty;
}

export interface ErrorHandlingConfig {
  strategy: string;
  errorCodes: Record<number, string>;
  errorFormat: ErrorFormat;
  logging: string;
}

export interface ErrorFormat {
  error: string;
  message: string;
  details?: string;
  timestamp?: string;
  requestId?: string;
}

export interface RateLimitingConfig {
  strategy: string;
  limits: Record<string, RateLimit>;
  headers: Record<string, string>;
  handling: string;
}

export interface RateLimit {
  requests: number;
  window: string;
  burst?: number;
}

export interface VersioningStrategy {
  strategy: string;
  format: string;
  lifecycle: Record<string, string>;
  migration: string;
}

export interface DeploymentArchitecture {
  strategy: string;
  environments: Environment[];
  infrastructure: Infrastructure;
  monitoring: MonitoringConfig;
  security: DeploymentSecurity;
  scalability: ScalabilityConfig;
}

export interface Environment {
  name: string;
  purpose: string;
  resources: string;
  database: string;
  monitoring: string;
  configuration?: Record<string, any>;
}

export interface Infrastructure {
  platform: string;
  compute: string;
  storage: string;
  networking: string;
  dns: string;
  cdn?: string;
  loadBalancer?: string;
}

export interface MonitoringConfig {
  metrics: string;
  logging: string;
  tracing: string;
  alerting: string;
  dashboards: string;
  sla?: ServiceLevelAgreement;
}

export interface ServiceLevelAgreement {
  availability: string;
  responseTime: string;
  errorRate: string;
  throughput: string;
}

export interface DeploymentSecurity {
  secrets: string;
  network: string;
  access: string;
  scanning: string;
  compliance: string;
  encryption?: EncryptionConfig;
}

export interface EncryptionConfig {
  atRest: string;
  inTransit: string;
  keyManagement: string;
}

export interface ScalabilityConfig {
  horizontal: string;
  vertical: string;
  database: string;
  caching: string;
  cdn: string;
}

export interface SecurityArchitecture {
  authentication: AuthenticationConfig;
  authorization: AuthorizationConfig;
  dataProtection: DataProtectionConfig;
  networkSecurity: NetworkSecurityConfig;
  monitoring: SecurityMonitoringConfig;
  compliance: ComplianceConfig;
}

export interface AuthenticationConfig {
  mechanism: string;
  providers: string[];
  session: string;
  mfa: string;
  passwordPolicy: string;
}

export interface AuthorizationConfig {
  model: string;
  permissions: string;
  policies: string;
  delegation: string;
  auditing: string;
}

export interface DataProtectionConfig {
  encryption: EncryptionStrategy;
  privacy: PrivacyConfig;
  backup: BackupConfig;
}

export interface EncryptionStrategy {
  atRest: string;
  inTransit: string;
  keys: string;
  algorithms?: string[];
}

export interface PrivacyConfig {
  pii: string;
  anonymization: string;
  retention: string;
  rightToErasure?: boolean;
}

export interface BackupConfig {
  encryption: string;
  testing: string;
  offsite: string;
  retention: string;
  recovery: RecoveryConfig;
}

export interface RecoveryConfig {
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  strategy: string;
  testing: string;
}

export interface NetworkSecurityConfig {
  firewall: string;
  segmentation: string;
  monitoring: string;
  vpn: string;
  certificates: string;
}

export interface SecurityMonitoringConfig {
  siem: string;
  ids: string;
  behavior: string;
  threat: string;
  incident: string;
}

export interface ComplianceConfig {
  frameworks: string[];
  auditing: string;
  documentation: string;
  training: string;
  reporting: string;
}

export interface ScalabilityPlan {
  horizontalScaling: HorizontalScalingConfig;
  verticalScaling: VerticalScalingConfig;
  dataScaling: DataScalingConfig;
  performanceOptimization: PerformanceOptimizationConfig;
  monitoring: ScalabilityMonitoringConfig;
}

export interface HorizontalScalingConfig {
  strategy: string;
  triggers: string[];
  limits: ScalingLimits;
  loadBalancing: string;
  sessionAffinity: string;
}

export interface ScalingLimits {
  minimum: number;
  maximum: number;
  scaleUpRate: number;
  scaleDownRate: number;
  cooldownPeriod?: number;
}

export interface VerticalScalingConfig {
  strategy: string;
  monitoring: string;
  recommendations: string;
  limits: string;
  optimization: string;
}

export interface DataScalingConfig {
  database: DatabaseScalingConfig;
  storage: StorageScalingConfig;
}

export interface DatabaseScalingConfig {
  readReplicas: string;
  sharding: string;
  caching: string;
  indexing: string;
  partitioning?: string;
}

export interface StorageScalingConfig {
  tiering: string;
  compression: string;
  archiving: string;
  partitioning: string;
}

export interface PerformanceOptimizationConfig {
  caching: CachingStrategy;
  optimization: OptimizationStrategy;
}

export interface CachingStrategy {
  application: string;
  database: string;
  cdn: string;
  browser: string;
}

export interface OptimizationStrategy {
  queries: string;
  algorithms: string;
  resources: string;
  networking: string;
}

export interface ScalabilityMonitoringConfig {
  metrics: string[];
  alerting: string;
  capacity: string;
  testing: string;
}

export interface Integration {
  name: string;
  type: IntegrationType;
  purpose: string;
  protocol: string;
  authentication: string;
  dataFormat: string;
  errorHandling: string;
  monitoring: string;
  documentation?: string;
}

export type IntegrationType = 
  | 'REST API'
  | 'GraphQL'
  | 'gRPC'
  | 'WebSocket'
  | 'Message Queue'
  | 'Database'
  | 'File System'
  | 'Email'
  | 'SMS'
  | 'Payment'
  | 'Analytics'
  | 'Monitoring'
  | 'Logging';

export interface QualityAttributes {
  performance: PerformanceAttributes;
  reliability: ReliabilityAttributes;
  security: SecurityAttributes;
  usability: UsabilityAttributes;
  maintainability: MaintainabilityAttributes;
}

export interface PerformanceAttributes {
  responseTime: string;
  throughput: string;
  scalability: string;
  efficiency: string;
}

export interface ReliabilityAttributes {
  availability: string;
  faultTolerance: string;
  recoverability: string;
  durability: string;
}

export interface SecurityAttributes {
  confidentiality: string;
  integrity: string;
  authentication: string;
  authorization: string;
}

export interface UsabilityAttributes {
  learnability: string;
  efficiency: string;
  memorability: string;
  errors: string;
}

export interface MaintainabilityAttributes {
  modifiability: string;
  testability: string;
  reusability: string;
  analyzability: string;
}

export interface ArchitecturalDecision {
  id: string;
  title: string;
  status: DecisionStatus;
  context: string;
  decision: string;
  consequences: Consequences;
  alternatives: string[];
  date: Date;
  author?: string;
  reviewers?: string[];
}

export type DecisionStatus = 
  | 'proposed'
  | 'accepted'
  | 'rejected'
  | 'deprecated'
  | 'superseded';

export interface Consequences {
  positive: string[];
  negative: string[];
  risks?: string[];
  mitigations?: string[];
}

export interface ArchitecturalRisk {
  id: string;
  category: RiskCategory;
  description: string;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  riskLevel: RiskLevel;
  mitigation: string[];
  monitoring: string;
  owner?: string;
  status: RiskStatus;
}

export type RiskCategory = 
  | 'Technical'
  | 'Performance'
  | 'Security'
  | 'Scalability'
  | 'Integration'
  | 'Operational'
  | 'Business';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

// ===== Refinement Phase Types =====

export interface SparcRefinement {
  implementation: Implementation;
  testing: TestingStrategy;
  optimization: OptimizationResults;
  refactoring: RefactoringPlan;
  documentation: DocumentationPlan;
  qualityMetrics: QualityMetrics;
}

export interface Implementation {
  modules: Module[];
  classes: Class[];
  functions: Function[];
  tests: Test[];
  configuration: ConfigurationFiles[];
}

export interface Module {
  name: string;
  path: string;
  exports: string[];
  imports: string[];
  description: string;
  complexity: ComplexityMetrics;
}

export interface Class {
  name: string;
  module: string;
  extends?: string;
  implements?: string[];
  properties: ClassProperty[];
  methods: ClassMethod[];
  visibility: Visibility;
  abstract?: boolean;
  final?: boolean;
}

export interface ClassProperty {
  name: string;
  type: string;
  visibility: Visibility;
  static?: boolean;
  readonly?: boolean;
  initialized?: boolean;
}

export interface ClassMethod {
  name: string;
  visibility: Visibility;
  static?: boolean;
  abstract?: boolean;
  parameters: MethodParameter[];
  returnType: string;
  throws?: string[];
  complexity: number;
}

export interface MethodParameter {
  name: string;
  type: string;
  optional?: boolean;
  default?: any;
  rest?: boolean;
}

export interface Function {
  name: string;
  module: string;
  parameters: FunctionParameter[];
  returnType: string;
  async?: boolean;
  generator?: boolean;
  complexity: ComplexityMetrics;
  testCoverage?: number;
}

export interface FunctionParameter {
  name: string;
  type: string;
  optional?: boolean;
  default?: any;
  rest?: boolean;
  destructured?: boolean;
}

export interface ComplexityMetrics {
  cyclomatic: number;
  cognitive: number;
  lines: number;
  statements: number;
  branches: number;
  functions: number;
}

export interface Test {
  id: string;
  name: string;
  type: TestType;
  target: string;
  status: TestStatus;
  duration?: number;
  assertions?: number;
  coverage?: CoverageMetrics;
}

export type TestType = 
  | 'unit'
  | 'integration'
  | 'e2e'
  | 'performance'
  | 'security'
  | 'contract'
  | 'smoke'
  | 'regression';

export type TestStatus = 
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'skipped'
  | 'error';

export interface CoverageMetrics {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export interface ConfigurationFiles {
  name: string;
  path: string;
  format: ConfigFormat;
  environment?: string;
  schema?: string;
}

export type ConfigFormat = 
  | 'json'
  | 'yaml'
  | 'toml'
  | 'env'
  | 'ini'
  | 'xml'
  | 'properties';

export interface TestingStrategy {
  approach: string;
  levels: TestLevel[];
  tools: TestingTool[];
  coverage: CoverageRequirements;
  automation: AutomationStrategy;
}

export interface TestLevel {
  type: TestType;
  scope: string;
  frequency: string;
  responsibility: string;
  tools: string[];
}

export interface TestingTool {
  name: string;
  type: string;
  purpose: string;
  configuration?: Record<string, any>;
}

export interface CoverageRequirements {
  unit: number;
  integration: number;
  e2e: number;
  overall: number;
}

export interface AutomationStrategy {
  ci: string;
  cd: string;
  triggers: string[];
  stages: string[];
  notifications: string[];
}

export interface OptimizationResults {
  performance: PerformanceOptimization[];
  memory: MemoryOptimization[];
  network: NetworkOptimization[];
  database: DatabaseOptimization[];
  algorithm: AlgorithmOptimization[];
}

export interface PerformanceOptimization {
  area: string;
  baseline: PerformanceMetric;
  optimized: PerformanceMetric;
  improvement: number;
  technique: string;
}

export interface PerformanceMetric {
  value: number;
  unit: string;
  percentile?: number;
}

export interface MemoryOptimization {
  area: string;
  before: MemoryMetric;
  after: MemoryMetric;
  reduction: number;
  technique: string;
}

export interface MemoryMetric {
  heap: number;
  stack: number;
  total: number;
  unit: string;
}

export interface NetworkOptimization {
  endpoint: string;
  before: NetworkMetric;
  after: NetworkMetric;
  improvement: number;
  technique: string;
}

export interface NetworkMetric {
  latency: number;
  bandwidth: number;
  requests: number;
  unit: string;
}

export interface DatabaseOptimization {
  query: string;
  before: QueryMetric;
  after: QueryMetric;
  improvement: number;
  technique: string;
}

export interface QueryMetric {
  executionTime: number;
  rows: number;
  cost: number;
}

export interface AlgorithmOptimization {
  algorithm: string;
  before: ComplexityAnalysis;
  after: ComplexityAnalysis;
  improvement: string;
  technique: string;
}

export interface RefactoringPlan {
  targets: RefactoringTarget[];
  patterns: string[];
  timeline: string;
  risks: string[];
  benefits: string[];
}

export interface RefactoringTarget {
  type: RefactoringType;
  location: string;
  reason: string;
  effort: EffortLevel;
  priority: Priority;
}

export type RefactoringType = 
  | 'extract_method'
  | 'extract_class'
  | 'move_method'
  | 'rename'
  | 'inline'
  | 'introduce_parameter'
  | 'remove_duplication'
  | 'simplify_conditional'
  | 'replace_inheritance';

export type EffortLevel = 'trivial' | 'small' | 'medium' | 'large' | 'epic';

export interface DocumentationPlan {
  types: DocumentationType[];
  audience: string[];
  format: string[];
  tools: string[];
  maintenance: string;
}

export interface DocumentationType {
  type: DocType;
  purpose: string;
  format: string;
  location: string;
  maintainer: string;
}

export type DocType = 
  | 'api'
  | 'user_guide'
  | 'developer_guide'
  | 'architecture'
  | 'deployment'
  | 'troubleshooting'
  | 'faq'
  | 'tutorial';

export interface QualityMetrics {
  code: CodeQualityMetrics;
  architecture: ArchitectureQualityMetrics;
  testing: TestQualityMetrics;
  documentation: DocumentationQualityMetrics;
}

export interface CodeQualityMetrics {
  maintainabilityIndex: number;
  cyclomaticComplexity: number;
  technicalDebt: number;
  codeSmells: number;
  duplications: number;
  violations: ViolationSummary;
}

export interface ViolationSummary {
  critical: number;
  major: number;
  minor: number;
  info: number;
}

export interface ArchitectureQualityMetrics {
  coupling: number;
  cohesion: number;
  abstractness: number;
  instability: number;
  distance: number;
}

export interface TestQualityMetrics {
  coverage: CoverageMetrics;
  effectiveness: number;
  maintainability: number;
  flakiness: number;
  executionTime: number;
}

export interface DocumentationQualityMetrics {
  completeness: number;
  accuracy: number;
  clarity: number;
  upToDate: boolean;
  examples: number;
}

// ===== Completion Phase Types =====

export interface SparcCompletion {
  deliverables: Deliverable[];
  deployment: DeploymentPlan;
  handover: HandoverPackage;
  maintenance: MaintenancePlan;
  retrospective: ProjectRetrospective;
  metrics: ProjectMetrics;
}

export interface Deliverable {
  name: string;
  type: DeliverableType;
  version: string;
  location: string;
  checksum: string;
  size: number;
  documentation?: string;
}

export type DeliverableType = 
  | 'source_code'
  | 'binary'
  | 'container'
  | 'documentation'
  | 'configuration'
  | 'database_schema'
  | 'test_suite'
  | 'deployment_script';

export interface DeploymentPlan {
  strategy: DeploymentStrategy;
  environments: DeploymentEnvironment[];
  steps: DeploymentStep[];
  rollback: RollbackPlan;
  validation: ValidationPlan;
}

export type DeploymentStrategy = 
  | 'blue_green'
  | 'canary'
  | 'rolling'
  | 'recreate'
  | 'a_b_testing';

export interface DeploymentEnvironment {
  name: string;
  url: string;
  purpose: string;
  configuration: Record<string, any>;
  healthCheck: string;
}

export interface DeploymentStep {
  order: number;
  name: string;
  description: string;
  script: string;
  timeout: number;
  rollbackScript?: string;
}

export interface RollbackPlan {
  trigger: string;
  steps: string[];
  validation: string;
  communication: string;
}

export interface ValidationPlan {
  preDeployment: ValidationStep[];
  postDeployment: ValidationStep[];
  smoke: ValidationStep[];
  monitoring: string;
}

export interface ValidationStep {
  name: string;
  type: ValidationType;
  script: string;
  expectedResult: string;
  timeout: number;
}

export type ValidationType = 
  | 'health_check'
  | 'smoke_test'
  | 'integration_test'
  | 'performance_test'
  | 'security_scan';

export interface HandoverPackage {
  documentation: HandoverDocumentation[];
  training: TrainingPlan;
  support: SupportPlan;
  contacts: Contact[];
  knowledge: KnowledgeBase;
}

export interface HandoverDocumentation {
  title: string;
  type: string;
  location: string;
  audience: string[];
  lastUpdated: Date;
}

export interface TrainingPlan {
  sessions: TrainingSession[];
  materials: string[];
  prerequisites: string[];
  certification?: string;
}

export interface TrainingSession {
  topic: string;
  duration: number;
  audience: string[];
  format: TrainingFormat;
  materials: string[];
}

export type TrainingFormat = 
  | 'workshop'
  | 'presentation'
  | 'hands_on'
  | 'video'
  | 'documentation';

export interface SupportPlan {
  tier: SupportTier;
  hours: string;
  responseTime: Record<Priority, string>;
  escalation: EscalationPath[];
}

export type SupportTier = 'basic' | 'standard' | 'premium' | 'enterprise';

export interface EscalationPath {
  level: number;
  contact: string;
  criteria: string;
  responseTime: string;
}

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone?: string;
  availability: string;
  expertise: string[];
}

export interface KnowledgeBase {
  articles: KnowledgeArticle[];
  faqs: FAQ[];
  troubleshooting: TroubleshootingGuide[];
  bestPractices: string[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
  relatedArticles?: string[];
}

export interface TroubleshootingGuide {
  issue: string;
  symptoms: string[];
  causes: string[];
  solutions: Solution[];
  prevention?: string;
}

export interface Solution {
  description: string;
  steps: string[];
  verification: string;
  workaround?: string;
}

export interface MaintenancePlan {
  schedule: MaintenanceSchedule;
  procedures: MaintenanceProcedure[];
  monitoring: MonitoringPlan;
  updates: UpdateStrategy;
}

export interface MaintenanceSchedule {
  regular: RegularMaintenance[];
  windows: MaintenanceWindow[];
  emergency: string;
}

export interface RegularMaintenance {
  task: string;
  frequency: string;
  duration: number;
  impact: string;
  responsible: string;
}

export interface MaintenanceWindow {
  start: Date;
  end: Date;
  type: MaintenanceType;
  activities: string[];
  notification: string;
}

export type MaintenanceType = 
  | 'planned'
  | 'emergency'
  | 'security'
  | 'upgrade'
  | 'patch';

export interface MaintenanceProcedure {
  name: string;
  type: string;
  steps: string[];
  verification: string;
  rollback?: string;
}

export interface MonitoringPlan {
  metrics: MonitoringMetric[];
  alerts: AlertRule[];
  dashboards: string[];
  reports: ReportConfig[];
}

export interface MonitoringMetric {
  name: string;
  type: MetricType;
  threshold: Threshold;
  interval: number;
  retention: number;
}

export type MetricType = 
  | 'availability'
  | 'performance'
  | 'error_rate'
  | 'throughput'
  | 'latency'
  | 'resource';

export interface Threshold {
  warning: number;
  critical: number;
  unit: string;
}

export interface AlertRule {
  name: string;
  condition: string;
  severity: Severity;
  channels: string[];
  escalation?: string;
}

export type Severity = 'info' | 'warning' | 'error' | 'critical';

export interface ReportConfig {
  name: string;
  frequency: string;
  recipients: string[];
  format: ReportFormat;
  content: string[];
}

export type ReportFormat = 'pdf' | 'html' | 'csv' | 'json' | 'dashboard';

export interface UpdateStrategy {
  approach: string;
  frequency: string;
  testing: string;
  rollout: string;
  communication: string;
}

export interface ProjectRetrospective {
  successes: Achievement[];
  challenges: Challenge[];
  learnings: Learning[];
  improvements: Improvement[];
  teamFeedback: TeamFeedback[];
}

export interface Achievement {
  description: string;
  impact: string;
  contributors: string[];
  metrics?: Record<string, any>;
}

export interface Challenge {
  description: string;
  impact: string;
  resolution: string;
  prevention: string;
}

export interface Learning {
  topic: string;
  description: string;
  application: string;
  sharing: string;
}

export interface Improvement {
  area: string;
  current: string;
  proposed: string;
  benefit: string;
  effort: EffortLevel;
}

export interface TeamFeedback {
  member: string;
  role: string;
  feedback: string;
  suggestions: string[];
  rating?: number;
}

export interface ProjectMetrics {
  schedule: ScheduleMetrics;
  budget: BudgetMetrics;
  quality: QualityProjectMetrics;
  team: TeamMetrics;
  customer: CustomerMetrics;
}

export interface ScheduleMetrics {
  plannedDuration: number;
  actualDuration: number;
  variance: number;
  milestones: MilestoneMetric[];
}

export interface MilestoneMetric {
  name: string;
  plannedDate: Date;
  actualDate: Date;
  variance: number;
  status: MilestoneStatus;
}

export type MilestoneStatus = 
  | 'on_time'
  | 'early'
  | 'delayed'
  | 'at_risk'
  | 'blocked';

export interface BudgetMetrics {
  planned: number;
  actual: number;
  variance: number;
  breakdown: CostBreakdown[];
}

export interface CostBreakdown {
  category: string;
  planned: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface QualityProjectMetrics {
  defects: DefectMetrics;
  testResults: TestResultMetrics;
  codeQuality: CodeQualityProjectMetrics;
  performance: PerformanceProjectMetrics;
}

export interface DefectMetrics {
  total: number;
  severity: Record<Severity, number>;
  resolved: number;
  averageResolutionTime: number;
  escapeRate: number;
}

export interface TestResultMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
  executionTime: number;
}

export interface CodeQualityProjectMetrics {
  linesOfCode: number;
  technicalDebt: number;
  maintainabilityIndex: number;
  duplicatePercentage: number;
  complexityAverage: number;
}

export interface PerformanceProjectMetrics {
  responseTime: PerformanceMetric;
  throughput: PerformanceMetric;
  errorRate: number;
  availability: number;
}

export interface TeamMetrics {
  size: number;
  velocity: number;
  productivity: number;
  satisfaction: number;
  turnover: number;
}

export interface CustomerMetrics {
  satisfaction: number;
  nps: number; // Net Promoter Score
  adoptionRate: number;
  retentionRate: number;
  supportTickets: number;
}