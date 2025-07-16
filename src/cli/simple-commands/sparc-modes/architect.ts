// architect.ts - Architect mode orchestration template with TypeScript types

import type { OrchestrationFunction } from './index.js';

/**
 * Architecture requirements analysis result
 */
export interface ArchitectureRequirements {
  coreComponents: string[];
  externalDependencies: string[];
  integrationPoints: string[];
  scalabilityRequirements: string[];
  securityRequirements: string[];
}

/**
 * System architecture design specification
 */
export interface SystemArchitecture {
  services: ArchitectureService[];
  apis: ArchitectureAPI[];
  dataFlow: DataFlowPattern[];
  stateManagement: StateManagementPattern;
  integrationPoints: IntegrationPoint[];
}

/**
 * Architecture service definition
 */
export interface ArchitectureService {
  name: string;
  type: 'microservice' | 'function' | 'library' | 'component';
  responsibilities: string[];
  dependencies: string[];
  interfaces: string[];
  scalabilityNotes?: string;
}

/**
 * API contract definition
 */
export interface ArchitectureAPI {
  name: string;
  type: 'REST' | 'GraphQL' | 'gRPC' | 'WebSocket' | 'Event';
  endpoints: APIEndpoint[];
  authentication: string;
  rateLimit?: string;
  versioning: string;
}

/**
 * API endpoint specification
 */
export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestSchema?: string;
  responseSchema?: string;
  errorCodes: string[];
}

/**
 * Data flow pattern definition
 */
export interface DataFlowPattern {
  name: string;
  source: string;
  destination: string;
  transformation?: string;
  validation: string[];
  errorHandling: string;
}

/**
 * State management pattern
 */
export interface StateManagementPattern {
  type: 'event-sourced' | 'cqrs' | 'traditional' | 'reactive';
  persistence: string[];
  caching: string[];
  consistency: 'strong' | 'eventual' | 'weak';
}

/**
 * Integration point specification
 */
export interface IntegrationPoint {
  name: string;
  type: 'api' | 'database' | 'message-queue' | 'file-system' | 'cache';
  protocol: string;
  configuration: Record<string, any>;
  failureMode: string;
}

/**
 * Technical specifications structure
 */
export interface TechnicalSpecifications {
  interfaceContracts: InterfaceContract[];
  dataModels: DataModel[];
  securityBoundaries: SecurityBoundary[];
  performanceRequirements: PerformanceRequirement[];
  configurationStrategy: ConfigurationStrategy;
}

/**
 * Interface contract definition
 */
export interface InterfaceContract {
  name: string;
  type: 'OpenAPI' | 'AsyncAPI' | 'GraphQL' | 'Protocol Buffer';
  version: string;
  specification: string;
  validation: string[];
}

/**
 * Data model specification
 */
export interface DataModel {
  name: string;
  type: 'entity' | 'value-object' | 'aggregate' | 'event';
  fields: DataModelField[];
  relationships: DataModelRelationship[];
  constraints: string[];
}

/**
 * Data model field definition
 */
export interface DataModelField {
  name: string;
  type: string;
  required: boolean;
  validation?: string[];
  defaultValue?: any;
}

/**
 * Data model relationship
 */
export interface DataModelRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  target: string;
  foreignKey?: string;
  cascade?: string[];
}

/**
 * Security boundary definition
 */
export interface SecurityBoundary {
  name: string;
  type: 'authentication' | 'authorization' | 'encryption' | 'audit';
  implementation: string;
  scope: string[];
  compliance?: string[];
}

/**
 * Performance requirement specification
 */
export interface PerformanceRequirement {
  metric: 'latency' | 'throughput' | 'availability' | 'consistency';
  target: string;
  measurement: string;
  constraints: string[];
}

/**
 * Configuration management strategy
 */
export interface ConfigurationStrategy {
  approach: 'environment' | 'file-based' | 'remote' | 'hybrid';
  secretsManagement: string;
  environments: string[];
  validation: string[];
}

/**
 * Implementation plan structure
 */
export interface ImplementationPlan {
  phases: ImplementationPhase[];
  modules: ModuleDefinition[];
  testingStrategy: TestingStrategy;
  deploymentProcedures: DeploymentProcedure[];
  sparcModeTasks: SparcModeTask[];
}

/**
 * Implementation phase definition
 */
export interface ImplementationPhase {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  dependencies: string[];
  estimatedTime: string;
  assignedMode?: string;
}

/**
 * Module definition for implementation
 */
export interface ModuleDefinition {
  name: string;
  path: string;
  maxLines: number;
  responsibilities: string[];
  dependencies: string[];
  interfaces: string[];
  tests: string[];
}

/**
 * Testing strategy definition
 */
export interface TestingStrategy {
  levels: ('unit' | 'integration' | 'e2e' | 'performance' | 'security')[];
  coverage: {
    target: number;
    enforcement: boolean;
    exclusions: string[];
  };
  tools: string[];
  automation: string[];
}

/**
 * Deployment procedure definition
 */
export interface DeploymentProcedure {
  environment: string;
  steps: DeploymentStep[];
  rollbackProcedure: string[];
  validation: string[];
  monitoring: string[];
}

/**
 * Deployment step definition
 */
export interface DeploymentStep {
  id: string;
  description: string;
  command?: string;
  validation: string[];
  rollbackCommand?: string;
}

/**
 * SPARC mode task assignment
 */
export interface SparcModeTask {
  mode: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  deliverables: string[];
}

/**
 * Get architect mode orchestration template
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @returns Formatted orchestration template
 */
export const getArchitectOrchestration: OrchestrationFunction = (
  taskDescription: string,
  memoryNamespace: string
): string => {
  return `
## Task Orchestration Steps

1. **Requirements Analysis** (10 mins)
   - Analyze the user's request: "${taskDescription}"
   - Query existing project context: \`npx claude-flow memory query ${memoryNamespace}\`
   - Identify core components, services, and modular boundaries
   - List external dependencies and integration points
   - Document scalability and security requirements
   - Store findings: \`npx claude-flow memory store ${memoryNamespace}_requirements "Core components: X, Y, Z. External deps: API-A, Service-B. Security: OAuth2, RLS policies needed."\`

2. **System Architecture Design** (20 mins)
   - Create modular architecture diagram using Mermaid syntax
   - Define clear service boundaries and responsibilities
   - Design API contracts between components
   - Plan data flow and state management patterns
   - Ensure NO hardcoded secrets or env values in design
   - Create extensible integration points
   - Store architecture: \`npx claude-flow memory store ${memoryNamespace}_architecture "Microservices: auth-service, user-service, data-processor. APIs: REST for external, gRPC for internal. State: Event-sourced with CQRS."\`

3. **Technical Specifications** (15 mins)
   - Define detailed interface contracts (OpenAPI/AsyncAPI)
   - Specify data models and database schemas
   - Plan security boundaries and authentication flows
   - Document performance and scaling considerations
   - Define configuration management strategy
   - Store specs: \`npx claude-flow memory store ${memoryNamespace}_tech_specs "Auth: JWT with refresh tokens. DB: PostgreSQL with read replicas. Cache: Redis. Config: Environment-based with secrets manager."\`

4. **Modular Implementation Plan** (10 mins)
   - Break system into modules < 500 lines each
   - Create development phases with clear milestones
   - Define testing strategy (unit, integration, e2e)
   - Plan deployment and rollback procedures
   - Identify tasks for other SPARC modes
   - Store plan: \`npx claude-flow memory store ${memoryNamespace}_implementation_plan "Phase 1: Core auth (tdd mode). Phase 2: User management (code mode). Phase 3: Integration (integration mode)."\`

5. **Directory Safety**
   - **IMPORTANT**: All files should be created in the current working directory
   - **DO NOT** create files in system directories or node_modules
   - For named projects, create a subdirectory: \`mkdir project-name && cd project-name\`
   - Use relative paths from your working directory
   - Example structure:
     \`\`\`
     ./ (current directory)
     ├── architecture/
     │   ├── system-overview.md
     │   └── api-specifications.md
     └── implementation-plan.md
     \`\`\`

6. **Quality Validation**
   - Verify modular design (< 500 lines per file)
   - Confirm no hardcoded secrets or environment values
   - Validate extensibility and scalability considerations
   - Review security boundaries and authentication flows
   - Ensure clear separation of concerns
   - Document architectural decisions and trade-offs

## Next Steps

1. **Hand-off to Code Mode**: \`npx claude-flow sparc run code "Implement ${taskDescription} following the architecture design" --namespace ${memoryNamespace}\`
2. **Security Review**: \`npx claude-flow sparc run security-review "Review architecture security boundaries" --namespace ${memoryNamespace}\`
3. **TDD Implementation**: \`npx claude-flow sparc run tdd "Create comprehensive tests for ${taskDescription}" --namespace ${memoryNamespace}\`

## Deliverables

- System architecture diagram (Mermaid format)
- API specifications (OpenAPI/AsyncAPI)
- Data model schemas
- Security boundary documentation
- Modular implementation plan
- Configuration strategy documentation

All deliverables will be stored in memory with namespace \`${memoryNamespace}\` for other SPARC modes to reference.`;
};

/**
 * Create architecture requirements from task description
 * @param taskDescription The task description
 * @returns Structured architecture requirements
 */
export function createArchitectureRequirements(taskDescription: string): ArchitectureRequirements {
  // This would typically involve NLP or structured analysis
  // For now, return a basic structure
  return {
    coreComponents: [],
    externalDependencies: [],
    integrationPoints: [],
    scalabilityRequirements: [],
    securityRequirements: []
  };
}

/**
 * Validate architecture design
 * @param architecture The system architecture to validate
 * @returns Validation result with errors and warnings
 */
export function validateArchitecture(architecture: SystemArchitecture): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate services
  if (!architecture.services || architecture.services.length === 0) {
    errors.push('Architecture must define at least one service');
  }
  
  // Validate APIs
  if (!architecture.apis || architecture.apis.length === 0) {
    warnings.push('No APIs defined - consider if this is intentional');
  }
  
  // Validate data flow
  if (!architecture.dataFlow || architecture.dataFlow.length === 0) {
    warnings.push('No data flow patterns defined');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
