// SPARC Command Variations
// Specialized SPARC commands for different development scenarios

import { SparcMethodology } from './index.js';
import { 
  SparcOptions as BaseSparcOptions,
  SparcPhaseName,
  SparcSpecification,
  SparcPseudocode,
  SparcArchitecture,
  SparcRefinement,
  SparcCompletion,
  Priority
} from '../../../types/sparc/index.js';

// Extended SPARC options for command variations
export interface SparcCommandOptions extends BaseSparcOptions {
  namespace?: string;
  swarmEnabled?: boolean;
  swarm?: boolean;
  neuralLearning?: boolean;
  learning?: boolean;
  autoRemediation?: boolean;
  mode?: SparcMode;
  focus?: SparcPhaseName[];
  specializations?: SparcSpecializations;
  qualityGates?: QualityGates;
  // Additional feature flags
  tddCycles?: boolean;
  continuousIntegration?: boolean;
  generateOpenAPI?: boolean;
  includeAuthentication?: boolean;
  includeValidation?: boolean;
  includeAccessibility?: boolean;
  includeResponsiveDesign?: boolean;
  includeComponentLibrary?: boolean;
  includeUnitTests?: boolean;
  includeIntegrationTests?: boolean;
  includeE2ETests?: boolean;
  includePerformanceTests?: boolean;
  includeMutationTesting?: boolean;
  preserveFunctionality?: boolean;
  incremental?: boolean;
  safetyFirst?: boolean;
  includeWebSearch?: boolean;
  includeDataAnalysis?: boolean;
  includeLiteratureReview?: boolean;
  includeDataModeling?: boolean;
  includeETL?: boolean;
  includeSecurityReview?: boolean;
  includePenetrationTesting?: boolean;
  includeComplianceCheck?: boolean;
  includeCI?: boolean;
  includeCD?: boolean;
  includeMonitoring?: boolean;
  includeInfrastructureAsCode?: boolean;
  includeLoadTesting?: boolean;
  includeProfiler?: boolean;
  includeCaching?: boolean;
  includeOptimization?: boolean;
}

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

export interface SparcSpecializations {
  specification?: string;
  pseudocode?: string;
  architecture?: string;
  refinement?: string;
  completion?: string;
}

export interface QualityGates {
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
  dataQuality?: number;
  accuracy?: number;
  comprehensiveness?: number;
  relevance?: number;
  vulnerabilities?: number;
  compliance?: number;
  deployment?: number;
  monitoring?: number;
  automation?: number;
  throughput?: number;
  resourceUsage?: number;
}

export interface SparcCommandResult {
  specification?: SparcSpecification;
  pseudocode?: SparcPseudocode;
  architecture?: SparcArchitecture;
  refinement?: SparcRefinement;
  completion?: SparcCompletion;
  taskDescription: string;
  executionTime: number;
  phases: Array<{
    name: SparcPhaseName;
    status: 'passed' | 'failed';
    artifacts: any;
  }>;
  qualityGates: Record<string, {
    passed: boolean;
    reasons: string[];
  }>;
  artifacts: Record<string, any>;
  recommendations: Array<{
    type: string;
    phase?: string;
    message: string;
  }>;
}

export type SparcCommandFunction = (taskDescription: string, options?: SparcCommandOptions) => Promise<SparcCommandResult>;

export interface SparcCommandMap {
  [key: string]: SparcCommandFunction;
}

// Type guards and validation functions
export function isValidSparcMode(mode: string): mode is SparcMode {
  return ['development', 'api', 'ui', 'testing', 'refactoring', 'research', 'data', 'security', 'devops', 'performance'].includes(mode);
}

export function isValidSparcPhase(phase: string): phase is SparcPhaseName {
  return ['specification', 'pseudocode', 'architecture', 'refinement', 'completion'].includes(phase);
}

export function validateSparcCommandOptions(options: SparcCommandOptions): void {
  if (options.mode && !isValidSparcMode(options.mode)) {
    throw new Error(`Invalid SPARC mode: ${options.mode}`);
  }
  
  if (options.focus && !Array.isArray(options.focus)) {
    throw new Error('Focus must be an array of SPARC phases');
  }
  
  if (options.focus && options.focus.some(phase => !isValidSparcPhase(phase))) {
    throw new Error(`Invalid SPARC phase in focus: ${options.focus.find(phase => !isValidSparcPhase(phase))}`);
  }
  
  if (options.qualityGates) {
    const gates = options.qualityGates;
    Object.entries(gates).forEach(([key, value]) => {
      if (typeof value !== 'number' || value < 0) {
        throw new Error(`Quality gate '${key}' must be a non-negative number`);
      }
    });
  }
}

/**
 * SPARC Development Command
 * Full-stack development workflow with TDD
 */
export async function sparcDev(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🚀 SPARC Development Workflow');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-dev',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    autoRemediation: true,
    mode: 'development',
    focus: ['specification', 'architecture', 'refinement'],
    qualityGates: {
      testCoverage: 85,
      codeQuality: 80,
      performance: 200 // ms
    },
    tddCycles: true,
    continuousIntegration: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Development completed');
    console.log(`📊 Test Coverage: ${result.refinement?.testResults?.coverage?.toFixed(1)}%`);
    console.log(`🎯 Code Quality: ${result.refinement?.codeQuality?.overall?.toFixed(1)}/100`);
    console.log(`⚡ Performance: ${result.refinement?.performance?.responseTime?.average}ms`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Development failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC API Command
 * API-focused development with OpenAPI specs
 */
export async function sparcApi(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🔌 SPARC API Development');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-api',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'api',
    focus: ['specification', 'architecture', 'refinement'],
    specializations: {
      specification: 'api_requirements',
      architecture: 'api_design',
      refinement: 'api_testing'
    },
    qualityGates: {
      apiCoverage: 100,
      responseTime: 100, // ms
      securityScore: 90
    },
    generateOpenAPI: true,
    includeAuthentication: true,
    includeValidation: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC API Development completed');
    console.log(`🔌 API Endpoints: ${result.architecture?.apiDesign?.endpoints?.length || 0}`);
    console.log(`🔒 Security Score: ${result.refinement?.security?.score || 0}/100`);
    console.log(`📋 OpenAPI Spec: Generated`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC API Development failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC UI Command
 * Frontend/UI development with component architecture
 */
export async function sparcUi(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🎨 SPARC UI Development');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-ui',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'ui',
    focus: ['specification', 'pseudocode', 'architecture', 'refinement'],
    specializations: {
      specification: 'ux_requirements',
      pseudocode: 'ui_flows',
      architecture: 'component_design',
      refinement: 'ui_testing'
    },
    qualityGates: {
      accessibility: 95,
      performance: 3000, // ms load time
      responsiveness: 100
    },
    includeAccessibility: true,
    includeResponsiveDesign: true,
    includeComponentLibrary: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC UI Development completed');
    console.log(`🎨 Components: ${result.architecture?.components?.length || 0}`);
    console.log(`♿ Accessibility: ${result.refinement?.validation?.usability?.accessibility?.score || 0}%`);
    console.log(`📱 Responsive: ${result.refinement?.validation?.compatibility?.devices?.score || 0}%`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC UI Development failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Test Command
 * Test-driven development with comprehensive testing
 */
export async function sparcTest(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🧪 SPARC Test-Driven Development');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-test',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'testing',
    focus: ['specification', 'refinement'],
    specializations: {
      specification: 'test_requirements',
      refinement: 'comprehensive_testing'
    },
    qualityGates: {
      testCoverage: 95,
      mutationScore: 80,
      performanceTests: 100
    },
    tddCycles: true,
    includeUnitTests: true,
    includeIntegrationTests: true,
    includeE2ETests: true,
    includePerformanceTests: true,
    includeMutationTesting: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Test Development completed');
    console.log(`🧪 Test Coverage: ${result.refinement?.testResults?.coverage?.toFixed(1)}%`);
    console.log(`🔬 Test Types: Unit, Integration, E2E, Performance`);
    console.log(`⚡ TDD Cycles: ${result.refinement?.tddCycles?.length || 0}`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Test Development failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Refactor Command
 * Code refactoring and optimization
 */
export async function sparcRefactor(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🔄 SPARC Refactoring');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-refactor',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'refactoring',
    focus: ['architecture', 'refinement'],
    specializations: {
      architecture: 'refactoring_design',
      refinement: 'code_optimization'
    },
    qualityGates: {
      codeQuality: 90,
      performance: 150, // ms improvement
      maintainability: 85
    },
    preserveFunctionality: true,
    incremental: true,
    safetyFirst: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Refactoring completed');
    console.log(`📈 Quality Improvement: +${result.refinement?.refactoring?.after?.overall - result.refinement?.refactoring?.before?.overall || 0} points`);
    console.log(`⚡ Performance Gain: ${result.refinement?.optimizations?.length || 0} optimizations applied`);
    console.log(`🔧 Refactoring Techniques: ${result.refinement?.refactoring?.techniques?.length || 0}`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Refactoring failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Research Command
 * Research and analysis workflow
 */
export async function sparcResearch(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🔍 SPARC Research & Analysis');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-research',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'research',
    focus: ['specification', 'pseudocode'],
    specializations: {
      specification: 'research_requirements',
      pseudocode: 'analysis_workflow'
    },
    qualityGates: {
      comprehensiveness: 90,
      accuracy: 95,
      relevance: 85
    },
    includeWebSearch: true,
    includeDataAnalysis: true,
    includeLiteratureReview: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Research completed');
    console.log(`📚 Sources Analyzed: ${result.specification?.userStories?.length || 0}`);
    console.log(`📊 Analysis Workflows: ${result.pseudocode?.algorithms?.length || 0}`);
    console.log(`🎯 Research Quality: ${result.specification?.requirements?.filter((r: any) => r.fulfilled)?.length || 0} requirements validated`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Research failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Data Command
 * Data engineering and analytics workflow
 */
export async function sparcData(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('📊 SPARC Data Engineering');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-data',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'data',
    focus: ['specification', 'architecture', 'refinement'],
    specializations: {
      specification: 'data_requirements',
      architecture: 'data_architecture',
      refinement: 'data_validation'
    },
    qualityGates: {
      dataQuality: 95,
      performance: 1000, // ms query time
      accuracy: 99
    },
    includeDataModeling: true,
    includeETL: true,
    includeValidation: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Data Engineering completed');
    console.log(`📊 Data Models: ${result.architecture?.dataModel?.entities?.length || 0}`);
    console.log(`🔄 ETL Pipelines: ${result.architecture?.integrationPoints?.length || 0}`);
    console.log(`✅ Data Quality: ${result.refinement?.validation?.score || 0}/100`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Data Engineering failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Security Command
 * Security-focused development and auditing
 */
export async function sparcSecurity(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🔒 SPARC Security Development');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-security',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'security',
    focus: ['specification', 'architecture', 'refinement'],
    specializations: {
      specification: 'security_requirements',
      architecture: 'security_architecture',
      refinement: 'security_testing'
    },
    qualityGates: {
      securityScore: 95,
      vulnerabilities: 0,
      compliance: 100
    },
    includeSecurityReview: true,
    includePenetrationTesting: true,
    includeComplianceCheck: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Security Development completed');
    console.log(`🔒 Security Score: ${result.refinement?.security?.score || 0}/100`);
    console.log(`🛡️ Vulnerabilities: ${result.refinement?.security?.vulnerabilities?.length || 0}`);
    console.log(`📋 Compliance: ${Object.values(result.refinement?.security?.compliance || {}).filter((c: any) => c).length}/3 standards`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Security Development failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC DevOps Command
 * DevOps and deployment workflow
 */
export async function sparcDevOps(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('⚙️ SPARC DevOps Workflow');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-devops',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'devops',
    focus: ['architecture', 'completion'],
    specializations: {
      architecture: 'deployment_architecture',
      completion: 'devops_deployment'
    },
    qualityGates: {
      deployment: 100,
      monitoring: 100,
      automation: 90
    },
    includeCI: true,
    includeCD: true,
    includeMonitoring: true,
    includeInfrastructureAsCode: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC DevOps completed');
    console.log(`🚀 Deployments: ${result.completion?.deployment?.environments?.length || 0} environments`);
    console.log(`📊 Monitoring: ${result.completion?.monitoring?.alerts?.length || 0} alerts configured`);
    console.log(`🤖 Automation: ${result.completion?.deployment?.successful ? 'Successful' : 'Pending'}`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC DevOps failed:', (error as Error).message);
    throw error;
  }
}

/**
 * SPARC Performance Command
 * Performance optimization and monitoring
 */
export async function sparcPerformance(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('⚡ SPARC Performance Optimization');
  
  // Validate options
  validateSparcCommandOptions(options);
  
  const sparcOptions: SparcCommandOptions = {
    ...options,
    namespace: options.namespace || 'sparc-performance',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'performance',
    focus: ['architecture', 'refinement'],
    specializations: {
      architecture: 'performance_architecture',
      refinement: 'performance_optimization'
    },
    qualityGates: {
      responseTime: 100, // ms
      throughput: 1000, // req/s
      resourceUsage: 70 // %
    },
    includeLoadTesting: true,
    includeProfiler: true,
    includeCaching: true,
    includeOptimization: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Performance Optimization completed');
    console.log(`⚡ Response Time: ${result.refinement?.performance?.responseTime?.average || 0}ms`);
    console.log(`🚀 Throughput: ${result.refinement?.performance?.throughput?.requestsPerSecond || 0} req/s`);
    console.log(`📈 Optimizations: ${result.refinement?.optimizations?.length || 0} applied`);
    
    return result;
  } catch (error) {
    console.error('❌ SPARC Performance Optimization failed:', (error as Error).message);
    throw error;
  }
}

/**
 * Command factory for creating SPARC command variations
 */
export const sparcCommands: SparcCommandMap = {
  dev: sparcDev,
  api: sparcApi,
  ui: sparcUi,
  test: sparcTest,
  refactor: sparcRefactor,
  research: sparcResearch,
  data: sparcData,
  security: sparcSecurity,
  devops: sparcDevOps,
  performance: sparcPerformance
};

/**
 * Get available SPARC command variations
 */
export function getSparcCommands(): string[] {
  return Object.keys(sparcCommands);
}

/**
 * Execute a SPARC command variation
 */
export async function executeSparcCommand(command: string, taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  if (!command || typeof command !== 'string') {
    throw new Error('Command must be a non-empty string');
  }
  
  if (!taskDescription || typeof taskDescription !== 'string') {
    throw new Error('Task description must be a non-empty string');
  }
  
  if (!sparcCommands[command]) {
    throw new Error(`Unknown SPARC command: ${command}. Available commands: ${getSparcCommands().join(', ')}`);
  }
  
  try {
    return await sparcCommands[command](taskDescription, options);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to execute SPARC command '${command}': ${errorMessage}`);
  }
}

/**
 * Get help for SPARC command variations
 */
export function getSparcCommandHelp(command: string): string {
  const helpTexts: { [key: string]: string } = {
    dev: 'Full-stack development workflow with TDD and quality gates',
    api: 'API-focused development with OpenAPI specifications and security',
    ui: 'Frontend/UI development with component architecture and accessibility',
    test: 'Test-driven development with comprehensive testing strategies',
    refactor: 'Code refactoring and optimization while preserving functionality',
    research: 'Research and analysis workflow with data gathering',
    data: 'Data engineering and analytics with quality validation',
    security: 'Security-focused development with auditing and compliance',
    devops: 'DevOps workflow with CI/CD and infrastructure automation',
    performance: 'Performance optimization with load testing and monitoring'
  };
  
  return helpTexts[command] || 'Unknown command';
}

/**
 * Show help for all SPARC command variations
 */
export function showSparcCommandsHelp(): void {
  console.log('🎯 SPARC Command Variations:');
  console.log();
  
  for (const [command, helpText] of Object.entries(getSparcCommands().reduce((acc: { [key: string]: string }, cmd) => {
    acc[cmd] = getSparcCommandHelp(cmd);
    return acc;
  }, {}))) {
    console.log(`  sparc-${command.padEnd(12)} ${helpText}`);
  }
  
  console.log();
  console.log('Usage:');
  console.log('  claude-flow sparc-<command> "<task-description>" [options]');
  console.log();
  console.log('Examples:');
  console.log('  claude-flow sparc-dev "build user authentication system"');
  console.log('  claude-flow sparc-api "create REST API for e-commerce" --swarm');
  console.log('  claude-flow sparc-test "comprehensive testing for payment module"');
  console.log('  claude-flow sparc-security "security audit for web application"');
}

export default {
  sparcCommands,
  getSparcCommands,
  executeSparcCommand,
  getSparcCommandHelp,
  showSparcCommandsHelp
};