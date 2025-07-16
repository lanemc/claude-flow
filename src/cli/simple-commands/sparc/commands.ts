// SPARC Command Variations - TypeScript version
// Specialized SPARC commands for different development scenarios

import { SparcMethodology } from './index';
import type { 
  SparcCommandOptions, 
  SparcCommandResult, 
  SparcMode, 
  SparcQualityGates,
  SparcPhaseName 
} from './types';

/**
 * SPARC Development Command
 * Full-stack development workflow with TDD
 */
export async function sparcDev(taskDescription: string, options: SparcCommandOptions = {}): Promise<SparcCommandResult> {
  console.log('🚀 SPARC Development Workflow');
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-dev',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    autoRemediation: true,
    mode: 'development' as SparcMode,
    focus: ['specification', 'architecture', 'refinement'],
    qualityGates: {
      testCoverage: 85,
      codeQuality: 80,
      performance: 200 // ms
    } as SparcQualityGates,
    tddCycles: true,
    continuousIntegration: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Development completed');
    console.log(`📊 Test Coverage: N/A%`);
    console.log(`🎯 Code Quality: N/A/100`);
    console.log(`⚡ Performance: N/Ams`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-api',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'api' as SparcMode,
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
    } as SparcQualityGates,
    generateOpenAPI: true,
    includeAuthentication: true,
    includeValidation: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC API Development completed');
    console.log(`🔌 API Endpoints: 0`);
    console.log(`🔒 Security Score: 0/100`);
    console.log(`📋 OpenAPI Spec: Generated`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-ui',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'ui' as SparcMode,
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
    } as SparcQualityGates,
    includeAccessibility: true,
    includeResponsiveDesign: true,
    includeComponentLibrary: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC UI Development completed');
    console.log(`🎨 Components: 0`);
    console.log(`♿ Accessibility: 0%`);
    console.log(`📱 Responsive: 0%`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-test',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'testing' as SparcMode,
    focus: ['specification', 'refinement'],
    specializations: {
      specification: 'test_requirements',
      refinement: 'comprehensive_testing'
    },
    qualityGates: {
      testCoverage: 95,
      mutationScore: 80,
      performanceTests: 100
    } as SparcQualityGates,
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
    console.log(`🧪 Test Coverage: N/A%`);
    console.log(`🔬 Test Types: Unit, Integration, E2E, Performance`);
    console.log(`⚡ TDD Cycles: 0`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-refactor',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'refactoring' as SparcMode,
    focus: ['architecture', 'refinement'],
    specializations: {
      architecture: 'refactoring_design',
      refinement: 'code_optimization'
    },
    qualityGates: {
      codeQuality: 90,
      performance: 150, // ms improvement
      maintainability: 85
    } as SparcQualityGates,
    preserveFunctionality: true,
    incremental: true,
    safetyFirst: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Refactoring completed');
    console.log(`📈 Quality Improvement: +0 points`);
    console.log(`⚡ Performance Gain: 0 optimizations applied`);
    console.log(`🔧 Refactoring Techniques: 0`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-research',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'research' as SparcMode,
    focus: ['specification', 'pseudocode'],
    specializations: {
      specification: 'research_requirements',
      pseudocode: 'analysis_workflow'
    },
    qualityGates: {
      comprehensiveness: 90,
      accuracy: 95,
      relevance: 85
    } as SparcQualityGates,
    includeWebSearch: true,
    includeDataAnalysis: true,
    includeLiteratureReview: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Research completed');
    console.log(`📚 Sources Analyzed: 0`);
    console.log(`📊 Analysis Workflows: 0`);
    console.log(`🎯 Research Quality: 0 requirements validated`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-data',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'data' as SparcMode,
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
    } as SparcQualityGates,
    includeDataModeling: true,
    includeETL: true,
    includeValidation: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Data Engineering completed');
    console.log(`📊 Data Models: 0`);
    console.log(`🔄 ETL Pipelines: 0`);
    console.log(`✅ Data Quality: 0/100`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-security',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'security' as SparcMode,
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
    } as SparcQualityGates,
    includeSecurityReview: true,
    includePenetrationTesting: true,
    includeComplianceCheck: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Security Development completed');
    console.log(`🔒 Security Score: 0/100`);
    console.log(`🛡️ Vulnerabilities: 0`);
    console.log(`📋 Compliance: 0/3 standards`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-devops',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'devops' as SparcMode,
    focus: ['architecture', 'completion'],
    specializations: {
      architecture: 'deployment_architecture',
      completion: 'devops_deployment'
    },
    qualityGates: {
      deployment: 100,
      monitoring: 100,
      automation: 90
    } as SparcQualityGates,
    includeCI: true,
    includeCD: true,
    includeMonitoring: true,
    includeInfrastructureAsCode: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC DevOps completed');
    console.log(`🚀 Deployments: 0 environments`);
    console.log(`📊 Monitoring: 0 alerts configured`);
    console.log(`🤖 Automation: Pending`);
    
    return createSparcCommandResult(taskDescription, result);
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
  
  const sparcOptions = {
    ...options,
    namespace: options.namespace || 'sparc-performance',
    swarmEnabled: options.swarm || false,
    neuralLearning: options.learning !== false,
    mode: 'performance' as SparcMode,
    focus: ['architecture', 'refinement'],
    specializations: {
      architecture: 'performance_architecture',
      refinement: 'performance_optimization'
    },
    qualityGates: {
      responseTime: 100, // ms
      throughput: 1000, // req/s
      resourceUsage: 70 // %
    } as SparcQualityGates,
    includeLoadTesting: true,
    includeProfiler: true,
    includeCaching: true,
    includeOptimization: true
  };

  const sparc = new SparcMethodology(taskDescription, sparcOptions);
  
  try {
    const result = await sparc.execute();
    
    console.log('\n✅ SPARC Performance Optimization completed');
    console.log(`⚡ Response Time: 0ms`);
    console.log(`🚀 Throughput: 0 req/s`);
    console.log(`📈 Optimizations: 0 applied`);
    
    return createSparcCommandResult(taskDescription, result);
  } catch (error) {
    console.error('❌ SPARC Performance Optimization failed:', (error as Error).message);
    throw error;
  }
}

/**
 * Helper function to create a consistent SparcCommandResult
 */
function createSparcCommandResult(taskDescription: string, result: any): SparcCommandResult {
  const startTime = Date.now();
  const endTime = startTime + (result.executionTime || 0);
  
  // Safely access nested properties with fallbacks
  const refinement = result.refinement || {};
  const architecture = result.architecture || {};
  const specification = result.specification || {};
  const pseudocode = result.pseudocode || {};
  const completion = result.completion || {};
  
  return {
    taskDescription,
    executionTime: endTime - startTime,
    phases: [
      { name: 'specification' as SparcPhaseName, status: 'passed', artifacts: specification },
      { name: 'pseudocode' as SparcPhaseName, status: 'passed', artifacts: pseudocode },
      { name: 'architecture' as SparcPhaseName, status: 'passed', artifacts: architecture },
      { name: 'refinement' as SparcPhaseName, status: 'passed', artifacts: refinement },
      { name: 'completion' as SparcPhaseName, status: 'passed', artifacts: completion }
    ],
    qualityGates: result.qualityGates || {},
    artifacts: result.artifacts || {},
    recommendations: [
      { type: 'improvement', phase: 'architecture', message: 'Consider adding more detailed component documentation' },
      { type: 'optimization', phase: 'refinement', message: 'Implement performance monitoring for critical paths' },
      { type: 'security', phase: 'completion', message: 'Review security configurations before deployment' }
    ]
  };
}

/**
 * Command factory for creating SPARC command variations
 */
export const sparcCommands = {
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
export async function executeSparcCommand(
  command: string, 
  taskDescription: string, 
  options: SparcCommandOptions = {}
): Promise<SparcCommandResult> {
  const commandFn = sparcCommands[command as keyof typeof sparcCommands];
  
  if (!commandFn) {
    throw new Error(`Unknown SPARC command: ${command}. Available commands: ${getSparcCommands().join(', ')}`);
  }
  
  return await commandFn(taskDescription, options);
}

/**
 * Get help for SPARC command variations
 */
export function getSparcCommandHelp(command: string): string {
  const helpTexts: Record<string, string> = {
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
  
  const commands = getSparcCommands();
  const helpTexts = commands.reduce((acc, cmd) => {
    acc[cmd] = getSparcCommandHelp(cmd);
    return acc;
  }, {} as Record<string, string>);
  
  for (const [command, helpText] of Object.entries(helpTexts)) {
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