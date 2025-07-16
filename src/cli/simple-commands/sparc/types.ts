// TypeScript interfaces for SPARC components
export interface SparcOptions {
  namespace?: string;
  swarmEnabled?: boolean;
  neuralLearning?: boolean;
  verbose?: boolean;
  autoRemediation?: boolean;
  mode?: string;
  focus?: string[];
  specializations?: Record<string, string>;
  qualityGates?: Record<string, number>;
  [key: string]: any;
}

export interface PhaseResult {
  successful: boolean;
  executionTime: number;
  artifacts: Record<string, any>;
  qualityGates: Record<string, boolean>;
}

export interface ArchitectureResult extends PhaseResult {
  systemDesign: SystemDesign;
  components: Component[];
  designPatterns: DesignPattern[];
  dataModel: DataModel;
  apiDesign: ApiDesign;
  deploymentArchitecture: DeploymentArchitecture;
  securityArchitecture: SecurityArchitecture;
  scalabilityPlan: ScalabilityPlan;
  integrationPoints: IntegrationPoint[];
  qualityAttributes: QualityAttributes;
  architecturalDecisions: ArchitecturalDecision[];
  riskAssessment: Risk[];
}

export interface SystemDesign {
  style: string;
  layers: LayerDefinition[];
  components: string[];
  dataFlow: DataFlow[];
  controlFlow: ControlFlow[];
  boundaries: Boundary[];
}

export interface LayerDefinition {
  name: string;
  responsibility: string;
}

export interface DataFlow {
  from: string;
  to: string;
  direction: string;
  dataType: string;
}

export interface ControlFlow {
  layer: string;
  order: number;
  triggers: string[];
  actions: string[];
  outcomes: string[];
}

export interface Boundary {
  layer: string;
  type: string;
  encapsulation: string;
  dependencies: string;
  contracts: string;
}

export interface Component {
  name: string;
  type: string;
  responsibility: string;
  interfaces: string[];
  dependencies: string[];
  patterns: string[];
  complexity: string;
}

export interface DesignPattern {
  name: string;
  type: string;
  purpose: string;
  applicability: string;
  implementation: string;
  benefits: string[];
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
  constraints: Constraint[];
  indexes: Index[];
  views: View[];
}

export interface Entity {
  name: string;
  attributes: Attribute[];
  primaryKey: string;
  foreignKeys: string[];
  constraints: Constraint[];
  indexes: Index[];
}

export interface Attribute {
  name: string;
  type: string;
  nullable: boolean;
  unique?: boolean;
  default?: string;
}

export interface Constraint {
  name: string;
  type: string;
  column?: string;
  condition?: string;
}

export interface Index {
  name: string;
  type: string;
  columns: string[];
  table?: string;
}

export interface View {
  name: string;
  definition: string;
  purpose: string;
}

export interface Relationship {
  name: string;
  type: string;
  parent: string;
  child: string;
  parentKey: string;
  childKey: string;
  onDelete: string;
  onUpdate: string;
}

export interface ApiDesign {
  version: string;
  baseUrl: string;
  authentication: string;
  endpoints: Endpoint[];
  schemas: Schema[];
  errorHandling: ErrorHandling;
  rateLimiting: RateLimiting;
  versioning: Versioning;
}

export interface Endpoint {
  path: string;
  method: string;
  summary: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface RequestBody {
  schema: string;
}

export interface Response {
  description: string;
  schema?: string;
}

export interface Schema {
  name: string;
  type: string;
  properties: Record<string, Property>;
  required?: string[];
}

export interface Property {
  type: string;
  format?: string;
  enum?: string[];
  '$ref'?: string;
}

export interface ErrorHandling {
  strategy: string;
  errorCodes: Record<string, string>;
  errorFormat: Record<string, string>;
  logging: string;
}

export interface RateLimiting {
  strategy: string;
  limits: Record<string, { requests: number; window: string }>;
  headers: Record<string, string>;
  handling: string;
}

export interface Versioning {
  strategy: string;
  format: string;
  lifecycle: Record<string, string>;
  migration: string;
}

export interface DeploymentArchitecture {
  strategy: string;
  environments: Environment[];
  infrastructure: Infrastructure;
  monitoring: Monitoring;
  security: DeploymentSecurity;
  scalability: Scalability;
}

export interface Environment {
  name: string;
  purpose: string;
  resources: string;
  database: string;
  monitoring: string;
}

export interface Infrastructure {
  platform: string;
  compute: string;
  storage: string;
  networking: string;
  dns: string;
}

export interface Monitoring {
  metrics: string;
  logging: string;
  tracing: string;
  alerting: string;
  dashboards: string;
}

export interface DeploymentSecurity {
  secrets: string;
  network: string;
  access: string;
  scanning: string;
  compliance: string;
}

export interface Scalability {
  horizontal: string;
  vertical: string;
  database: string;
  caching: string;
  cdn: string;
}

export interface SecurityArchitecture {
  authentication: Authentication;
  authorization: Authorization;
  dataProtection: DataProtection;
  networkSecurity: NetworkSecurity;
  monitoring: SecurityMonitoring;
  compliance: Compliance;
}

export interface Authentication {
  mechanism: string;
  providers: string[];
  session: string;
  mfa: string;
  passwordPolicy: string;
}

export interface Authorization {
  model: string;
  permissions: string;
  policies: string;
  delegation: string;
  auditing: string;
}

export interface DataProtection {
  encryption: {
    atRest: string;
    inTransit: string;
    keys: string;
  };
  privacy: {
    pii: string;
    anonymization: string;
    retention: string;
  };
  backup: {
    encryption: string;
    testing: string;
    offsite: string;
  };
}

export interface NetworkSecurity {
  firewall: string;
  segmentation: string;
  monitoring: string;
  vpn: string;
  certificates: string;
}

export interface SecurityMonitoring {
  siem: string;
  ids: string;
  behavior: string;
  threat: string;
  incident: string;
}

export interface Compliance {
  frameworks: string[];
  auditing: string;
  documentation: string;
  training: string;
  reporting: string;
}

export interface ScalabilityPlan {
  horizontalScaling: HorizontalScaling;
  verticalScaling: VerticalScaling;
  dataScaling: DataScaling;
  performanceOptimization: PerformanceOptimization;
  monitoring: ScalabilityMonitoring;
}

export interface HorizontalScaling {
  strategy: string;
  triggers: string[];
  limits: {
    minimum: number;
    maximum: number;
    scaleUpRate: number;
    scaleDownRate: number;
  };
  loadBalancing: string;
  sessionAffinity: string;
}

export interface VerticalScaling {
  strategy: string;
  monitoring: string;
  recommendations: string;
  limits: string;
  optimization: string;
}

export interface DataScaling {
  database: {
    readReplicas: string;
    sharding: string;
    caching: string;
    indexing: string;
  };
  storage: {
    tiering: string;
    compression: string;
    archiving: string;
    partitioning: string;
  };
}

export interface PerformanceOptimization {
  caching: {
    application: string;
    database: string;
    cdn: string;
    browser: string;
  };
  optimization: {
    queries: string;
    algorithms: string;
    resources: string;
    networking: string;
  };
}

export interface ScalabilityMonitoring {
  metrics: string[];
  alerting: string;
  capacity: string;
  testing: string;
}

export interface IntegrationPoint {
  name: string;
  type: string;
  purpose: string;
  protocol: string;
  authentication: string;
  dataFormat: string;
  errorHandling: string;
  monitoring: string;
}

export interface QualityAttributes {
  performance: Record<string, string>;
  reliability: Record<string, string>;
  security: Record<string, string>;
  usability: Record<string, string>;
  maintainability: Record<string, string>;
}

export interface ArchitecturalDecision {
  id: string;
  title: string;
  status: string;
  context: string;
  decision: string;
  consequences: {
    positive: string[];
    negative: string[];
  };
  alternatives: string[];
  date: string;
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  probability: string;
  impact: string;
  riskLevel: string;
  mitigation: string[];
  monitoring: string;
}

// Command-related interfaces
export interface SparcCommandOptions extends SparcOptions {
  swarm?: boolean;
  learning?: boolean;
  namespace?: string;
  [key: string]: any;
}

export interface SparcCommandResult {
  taskDescription: string;
  executionTime: number;
  phases: {
    name: SparcPhaseName;
    status: 'passed' | 'failed';
    artifacts: any;
  }[];
  qualityGates: Record<string, boolean>;
  artifacts: Record<string, any>;
  recommendations: Array<{
    type: string;
    phase: string;
    message: string;
    priority?: string;
  }>;
}

export type SparcPhaseName = 
  | 'specification'
  | 'pseudocode'
  | 'architecture'
  | 'refinement'
  | 'completion'
  | 'coordinator';

export type SparcMode = 
  | 'development'
  | 'api'
  | 'ui'
  | 'testing'
  | 'refactoring'
  | 'research'
  | 'data'
  | 'security'
  | 'devops'
  | 'performance';

export interface SparcQualityGates {
  testCoverage?: number;
  codeQuality?: number;
  performance?: number;
  apiCoverage?: number;
  responseTime?: number;
  securityScore?: number;
  accessibility?: number;
  responsiveness?: number;
  mutationScore?: number;
  performanceTests?: number;
  maintainability?: number;
  comprehensiveness?: number;
  accuracy?: number;
  relevance?: number;
  dataQuality?: number;
  vulnerabilities?: number;
  compliance?: number;
  deployment?: number;
  monitoring?: number;
  automation?: number;
  throughput?: number;
  resourceUsage?: number;
}