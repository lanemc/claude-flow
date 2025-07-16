// Type definitions for SPARC Architecture Phase

export interface Layer {
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

export interface SystemDesign {
  style: string;
  layers: Layer[];
  components: any[]; // Will be replaced with Component[] when defined
  dataFlow: DataFlow[];
  controlFlow: ControlFlow[];
  boundaries: Boundary[];
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

export interface Entity {
  name: string;
  attributes: Attribute[];
  primaryKey: string;
  foreignKeys: string[];
  constraints: Constraint[];
  indexes: Index[];
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

export interface View {
  name: string;
  definition: string;
  purpose: string;
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
  constraints: Constraint[];
  indexes: Index[];
  views: View[];
}

export interface ApiParameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ApiResponse {
  description: string;
  schema?: string;
}

export interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  parameters?: ApiParameter[];
  requestBody?: { schema: string };
  responses: Record<number, ApiResponse>;
}

export interface ApiSchemaProperty {
  type: string;
  format?: string;
  enum?: string[];
  items?: { '$ref': string } | { type: string };
  properties?: Record<string, ApiSchemaProperty>;
}

export interface ApiSchema {
  name: string;
  type: string;
  properties: Record<string, ApiSchemaProperty>;
  required?: string[];
}

export interface ApiErrorHandling {
  strategy: string;
  errorCodes: Record<number, string>;
  errorFormat: Record<string, string>;
  logging: string;
}

export interface ApiRateLimiting {
  strategy: string;
  limits: Record<string, { requests: number; window: string }>;
  headers: Record<string, string>;
  handling: string;
}

export interface ApiVersioning {
  strategy: string;
  format: string;
  lifecycle: Record<string, string>;
  migration: string;
}

export interface ApiDesign {
  version: string;
  baseUrl: string;
  authentication: string;
  endpoints: ApiEndpoint[];
  schemas: ApiSchema[];
  errorHandling: ApiErrorHandling;
  rateLimiting: ApiRateLimiting;
  versioning: ApiVersioning;
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

export interface DeploymentMonitoring {
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

export interface DeploymentScalability {
  horizontal: string;
  vertical: string;
  database: string;
  caching: string;
  cdn: string;
}

export interface DeploymentArchitecture {
  strategy: string;
  environments: Environment[];
  infrastructure: Infrastructure;
  monitoring: DeploymentMonitoring;
  security: DeploymentSecurity;
  scalability: DeploymentScalability;
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

export interface SecurityArchitecture {
  authentication: Authentication;
  authorization: Authorization;
  dataProtection: DataProtection;
  networkSecurity: NetworkSecurity;
  monitoring: SecurityMonitoring;
  compliance: Compliance;
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

export interface ScalabilityPlan {
  horizontalScaling: HorizontalScaling;
  verticalScaling: VerticalScaling;
  dataScaling: DataScaling;
  performanceOptimization: PerformanceOptimization;
  monitoring: ScalabilityMonitoring;
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

export interface QualityAttribute {
  [key: string]: Record<string, string>;
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

export interface ArchitectureResult {
  systemDesign: SystemDesign | null;
  components: Component[];
  designPatterns: DesignPattern[];
  dataModel: DataModel | null;
  apiDesign: ApiDesign | null;
  deploymentArchitecture: DeploymentArchitecture | null;
  securityArchitecture: SecurityArchitecture | null;
  scalabilityPlan: ScalabilityPlan | null;
  integrationPoints: IntegrationPoint[];
  qualityAttributes: QualityAttribute;
  architecturalDecisions: ArchitecturalDecision[];
  riskAssessment: Risk[];
}

export interface SpecificationResult {
  requirements: string[];
  [key: string]: any;
}

export interface PseudocodeFunction {
  function: string;
  description: string;
  steps: string[];
  complexity?: {
    level: string;
  };
}

export interface PseudocodeResult {
  pseudocode: PseudocodeFunction[];
  [key: string]: any;
}