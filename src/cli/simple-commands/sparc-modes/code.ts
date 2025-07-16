// code.ts - Auto-Coder mode orchestration template with TypeScript types

import type { OrchestrationFunction } from './index.js';

/**
 * Project setup configuration
 */
export interface ProjectSetupConfig {
  name: string;
  directory: string;
  language: string;
  framework?: string;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  environmentVariables: EnvironmentVariable[];
}

/**
 * Environment variable definition
 */
export interface EnvironmentVariable {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  type: 'string' | 'number' | 'boolean' | 'url' | 'secret';
  validation?: string;
}

/**
 * Module structure definition
 */
export interface ModuleStructure {
  name: string;
  path: string;
  type: 'domain' | 'application' | 'infrastructure' | 'shared';
  maxLines: number;
  responsibilities: string[];
  dependencies: ModuleDependency[];
  interfaces: ModuleInterface[];
  configuration: ConfigurationRequirement[];
}

/**
 * Module dependency specification
 */
export interface ModuleDependency {
  name: string;
  type: 'internal' | 'external' | 'system';
  version?: string;
  optional: boolean;
  injectionType?: 'constructor' | 'property' | 'method';
}

/**
 * Module interface definition
 */
export interface ModuleInterface {
  name: string;
  type: 'class' | 'interface' | 'function' | 'type';
  methods: InterfaceMethod[];
  properties?: InterfaceProperty[];
  events?: InterfaceEvent[];
}

/**
 * Interface method specification
 */
export interface InterfaceMethod {
  name: string;
  parameters: MethodParameter[];
  returnType: string;
  async: boolean;
  description: string;
  throws?: string[];
}

/**
 * Method parameter definition
 */
export interface MethodParameter {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: any;
  description: string;
}

/**
 * Interface property definition
 */
export interface InterfaceProperty {
  name: string;
  type: string;
  readonly: boolean;
  optional: boolean;
  description: string;
}

/**
 * Interface event definition
 */
export interface InterfaceEvent {
  name: string;
  payload: string;
  description: string;
  when: string;
}

/**
 * Configuration requirement
 */
export interface ConfigurationRequirement {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  validation?: ConfigurationValidation;
  source: 'environment' | 'file' | 'remote' | 'computed';
}

/**
 * Configuration validation rules
 */
export interface ConfigurationValidation {
  pattern?: string;
  min?: number;
  max?: number;
  enum?: any[];
  custom?: string;
}

/**
 * Clean architecture layer definition
 */
export interface ArchitectureLayer {
  name: 'domain' | 'application' | 'infrastructure' | 'presentation';
  description: string;
  modules: LayerModule[];
  dependencies: string[];
  restrictions: string[];
}

/**
 * Layer module specification
 */
export interface LayerModule {
  name: string;
  type: 'entity' | 'service' | 'repository' | 'controller' | 'adapter' | 'factory';
  responsibilities: string[];
  contracts: string[];
  implementation: ImplementationDetails;
}

/**
 * Implementation details
 */
export interface ImplementationDetails {
  patterns: string[];
  errorHandling: ErrorHandlingStrategy;
  logging: LoggingStrategy;
  validation: ValidationStrategy;
  caching?: CachingStrategy;
  security?: SecurityStrategy;
}

/**
 * Error handling strategy
 */
export interface ErrorHandlingStrategy {
  type: 'exception' | 'result' | 'either' | 'maybe';
  customErrors: CustomError[];
  fallbackBehavior: string;
  retryPolicy?: RetryPolicy;
}

/**
 * Custom error definition
 */
export interface CustomError {
  name: string;
  code: string;
  message: string;
  httpStatus?: number;
  recovery?: string;
}

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  baseDelay: number;
  maxDelay: number;
  conditions: string[];
}

/**
 * Logging strategy
 */
export interface LoggingStrategy {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text' | 'structured';
  context: string[];
  sensitive: string[];
  destinations: LoggingDestination[];
}

/**
 * Logging destination
 */
export interface LoggingDestination {
  type: 'console' | 'file' | 'remote' | 'database';
  config: Record<string, any>;
  filters?: string[];
}

/**
 * Validation strategy
 */
export interface ValidationStrategy {
  type: 'schema' | 'annotation' | 'custom' | 'hybrid';
  schemas: ValidationSchema[];
  sanitization: boolean;
  errorMessages: Record<string, string>;
}

/**
 * Validation schema definition
 */
export interface ValidationSchema {
  name: string;
  type: string;
  rules: ValidationRule[];
  dependencies?: string[];
}

/**
 * Validation rule
 */
export interface ValidationRule {
  field: string;
  type: string;
  required: boolean;
  constraints: Record<string, any>;
  message: string;
}

/**
 * Caching strategy
 */
export interface CachingStrategy {
  type: 'memory' | 'redis' | 'database' | 'cdn' | 'hybrid';
  ttl: number;
  evictionPolicy: string;
  serialization: string;
  invalidation: string[];
}

/**
 * Security strategy
 */
export interface SecurityStrategy {
  authentication: AuthenticationStrategy;
  authorization: AuthorizationStrategy;
  encryption: EncryptionStrategy;
  rateLimit: RateLimitStrategy;
  inputSanitization: boolean;
}

/**
 * Authentication strategy
 */
export interface AuthenticationStrategy {
  type: 'jwt' | 'session' | 'oauth' | 'api-key' | 'certificate';
  provider?: string;
  config: Record<string, any>;
  tokenExpiry: string;
  refreshToken: boolean;
}

/**
 * Authorization strategy
 */
export interface AuthorizationStrategy {
  type: 'rbac' | 'abac' | 'acl' | 'policy';
  roles: string[];
  permissions: string[];
  resources: string[];
  policies?: string[];
}

/**
 * Encryption strategy
 */
export interface EncryptionStrategy {
  algorithm: string;
  keyManagement: string;
  atRest: boolean;
  inTransit: boolean;
  fieldLevel: string[];
}

/**
 * Rate limiting strategy
 */
export interface RateLimitStrategy {
  type: 'fixed' | 'sliding' | 'token-bucket' | 'leaky-bucket';
  requests: number;
  window: string;
  scope: 'global' | 'user' | 'ip' | 'api-key';
  storage: string;
}

/**
 * Integration setup configuration
 */
export interface IntegrationSetup {
  dependencyInjection: DIContainerConfig;
  healthChecks: HealthCheck[];
  monitoring: MonitoringConfig;
  testing: TestingConfig;
}

/**
 * Dependency injection container configuration
 */
export interface DIContainerConfig {
  type: 'native' | 'inversify' | 'awilix' | 'tsyringe' | 'custom';
  bindings: DIBinding[];
  scopes: DIScope[];
  interceptors?: DIInterceptor[];
}

/**
 * DI binding configuration
 */
export interface DIBinding {
  token: string;
  implementation: string;
  scope: 'singleton' | 'transient' | 'scoped';
  factory?: string;
  dependencies?: string[];
}

/**
 * DI scope definition
 */
export interface DIScope {
  name: string;
  lifetime: string;
  cleanup?: string;
}

/**
 * DI interceptor
 */
export interface DIInterceptor {
  name: string;
  type: 'pre' | 'post' | 'around';
  target: string;
  implementation: string;
}

/**
 * Health check configuration
 */
export interface HealthCheck {
  name: string;
  endpoint: string;
  timeout: number;
  interval: number;
  dependencies: string[];
  implementation: string;
}

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  metrics: MetricConfig[];
  tracing: TracingConfig;
  alerts: AlertConfig[];
  dashboards: string[];
}

/**
 * Metric configuration
 */
export interface MetricConfig {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  labels: string[];
  aggregation?: string;
}

/**
 * Tracing configuration
 */
export interface TracingConfig {
  enabled: boolean;
  provider: string;
  sampling: number;
  exporters: string[];
  attributes: string[];
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  throttle?: string;
}

/**
 * Testing configuration
 */
export interface TestingConfig {
  framework: string;
  types: ('unit' | 'integration' | 'e2e' | 'performance')[];
  coverage: CoverageConfig;
  mocking: MockingConfig;
  fixtures: string[];
}

/**
 * Coverage configuration
 */
export interface CoverageConfig {
  threshold: number;
  enforce: boolean;
  excludePatterns: string[];
  reporters: string[];
}

/**
 * Mocking configuration
 */
export interface MockingConfig {
  strategy: 'manual' | 'auto' | 'hybrid';
  libraries: string[];
  patterns: string[];
  dataFactories: string[];
}

/**
 * Get code mode orchestration template
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @returns Formatted orchestration template
 */
export const getCodeOrchestration: OrchestrationFunction = (
  taskDescription: string,
  memoryNamespace: string
): string => {
  return `
## Task Orchestration Steps

1. **Project Directory Setup & Context Review** (5 mins)
   - Verify current working directory and create project structure
   - For named projects (e.g., "hello-world"), create as subdirectory
   - Review implementation task: "${taskDescription}"
   - Query architecture and pseudocode: 
     \`\`\`bash
     npx claude-flow memory query ${memoryNamespace}_architecture
     npx claude-flow memory query ${memoryNamespace}_pseudocode
     npx claude-flow memory query ${memoryNamespace}_tech_specs
     \`\`\`
   - Identify modules to implement and their boundaries
   - Review configuration requirements
   - Check for any blocking dependencies

2. **Project Setup & Configuration** (10 mins)
   - Initialize project structure in current directory or subdirectory
   - IMPORTANT: Use pwd to verify you're NOT in node_modules/
   - Set up environment configuration (NO hardcoded values):
     - Create .env.example with all required variables
     - Set up config/ directory with environment loaders
     - Implement secrets management abstraction
   - Install dependencies based on tech specs
   - Create module structure (each file < 500 lines)
   - Store setup: \`npx claude-flow memory store ${memoryNamespace}_setup "Project structure: src/{domain,application,infrastructure}. Config: dotenv + vault integration. Dependencies: express, joi, winston."\`

3. **Modular Implementation** (30 mins)
   - Implement features using clean architecture principles:
     - Domain layer: Business entities and rules
     - Application layer: Use cases and workflows
     - Infrastructure layer: External integrations
   - Follow SOLID principles and dependency injection
   - Keep each module/file under 500 lines
   - Use configuration for ALL environment-specific values
   - Implement comprehensive error handling
   - Add structured logging with context
   - Store progress: \`npx claude-flow memory store ${memoryNamespace}_implementation "Completed: auth-service (3 modules), user-repository (2 modules). Remaining: notification-service."\`

4. **Integration & Basic Testing** (15 mins)
   - Wire up dependency injection container
   - Connect modules following architecture design
   - Implement health checks and monitoring endpoints
   - Add input validation and sanitization
   - Create smoke tests for critical paths
   - Verify configuration loading works correctly
   - Test error scenarios and graceful degradation
   - Store integration: \`npx claude-flow memory store ${memoryNamespace}_integration "DI container configured. Health checks: 5 endpoints. Validation: input sanitization active. Error handling: 95% coverage."\`

5. **Security & Performance** (10 mins)
   - Implement authentication and authorization
   - Add rate limiting and input validation
   - Secure sensitive data and API endpoints
   - Optimize critical performance paths
   - Add monitoring and observability hooks
   - Store security: \`npx claude-flow memory store ${memoryNamespace}_security "Auth: JWT + refresh tokens. Rate limiting: 100 req/min per user. Validation: Joi schemas. Monitoring: Prometheus metrics."\`

6. **Documentation & Handoff** (5 mins)
   - Generate API documentation
   - Create deployment guides
   - Document configuration options
   - Prepare for TDD mode handoff
   - Store documentation: \`npx claude-flow memory store ${memoryNamespace}_documentation "API docs: OpenAPI 3.0. Deploy guide: Docker + K8s. Config: Environment variables documented."\`

## Implementation Guidelines

### Clean Architecture Layers
1. **Domain Layer** (Business Logic)
   - Entities: Core business objects
   - Value Objects: Immutable data structures
   - Domain Services: Complex business operations
   - Repository Interfaces: Data access contracts

2. **Application Layer** (Use Cases)
   - Use Cases: Application-specific business rules
   - Command/Query Handlers: CQRS implementation
   - Application Services: Orchestrate domain operations
   - DTOs: Data transfer objects

3. **Infrastructure Layer** (External Concerns)
   - Repository Implementations: Data persistence
   - External Service Adapters: Third-party integrations
   - Framework Configurations: Web, Database, etc.
   - Cross-cutting Concerns: Logging, Caching, etc.

### Code Quality Standards
- **File Size**: Maximum 500 lines per file
- **Function Size**: Maximum 20 lines per function
- **Complexity**: Maximum cyclomatic complexity of 10
- **Dependencies**: Minimal and well-defined
- **Testing**: Unit tests for all business logic
- **Documentation**: Clear JSDoc comments

### Security Requirements
- **No Hardcoded Secrets**: Use environment variables
- **Input Validation**: Validate all external inputs
- **Output Encoding**: Prevent injection attacks
- **Authentication**: Implement proper auth flows
- **Authorization**: Role-based access control
- **Logging**: Security event logging

### Performance Considerations
- **Async Operations**: Use async/await properly
- **Database Queries**: Optimize N+1 problems
- **Caching**: Implement appropriate caching strategies
- **Memory Management**: Avoid memory leaks
- **Connection Pooling**: Efficient resource usage
- **Monitoring**: Performance metrics collection

## Next Steps

1. **TDD Mode**: \`npx claude-flow sparc run tdd "Create comprehensive tests for ${taskDescription}" --namespace ${memoryNamespace}\`
2. **Security Review**: \`npx claude-flow sparc run security-review "Audit implementation security" --namespace ${memoryNamespace}\`
3. **Integration**: \`npx claude-flow sparc run integration "Integrate with external services" --namespace ${memoryNamespace}\`
4. **Performance Testing**: \`npx claude-flow sparc run optimization "Optimize performance" --namespace ${memoryNamespace}\`

## Deliverables

- Modular source code (< 500 lines per file)
- Configuration management system
- Dependency injection setup
- Error handling and logging
- Security implementation
- Health checks and monitoring
- Basic integration tests
- Documentation and deployment guides

All implementation details will be stored in memory with namespace \`${memoryNamespace}\` for other SPARC modes to reference.`;
};

/**
 * Create project setup configuration from task description
 * @param taskDescription The task description
 * @param language Programming language
 * @returns Project setup configuration
 */
export function createProjectSetupConfig(
  taskDescription: string,
  language: string = 'typescript'
): ProjectSetupConfig {
  return {
    name: extractProjectName(taskDescription),
    directory: process.cwd(),
    language,
    dependencies: [],
    devDependencies: [],
    scripts: {},
    environmentVariables: []
  };
}

/**
 * Extract project name from task description
 * @param taskDescription The task description
 * @returns Extracted project name
 */
function extractProjectName(taskDescription: string): string {
  // Simple extraction logic - could be enhanced with NLP
  const match = taskDescription.match(/"([^"]+)"/); // Extract quoted strings
  if (match) {
    return match[1].toLowerCase().replace(/\s+/g, '-');
  }
  
  return 'project';
}

/**
 * Validate module structure
 * @param module The module structure to validate
 * @returns Validation result
 */
export function validateModuleStructure(module: ModuleStructure): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (module.maxLines > 500) {
    errors.push(`Module ${module.name} exceeds 500 line limit`);
  }
  
  if (module.responsibilities.length === 0) {
    warnings.push(`Module ${module.name} has no defined responsibilities`);
  }
  
  if (module.dependencies.length > 10) {
    warnings.push(`Module ${module.name} has many dependencies (${module.dependencies.length})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
