// sparc-modes.ts - SPARC mode file templates with TypeScript support

import type { TemplateGenerator } from '../../../../types/template.js';

/**
 * Creates SPARC modes overview documentation
 */
export const createSparcModesOverview: TemplateGenerator<void> = (): string => {
  return `# SPARC Modes Overview

SPARC (Specification, Planning, Architecture, Review, Code) is a comprehensive development methodology with 17 specialized modes.

## Available Modes

### Core Orchestration Modes
- **orchestrator**: Multi-agent task orchestration
- **swarm-coordinator**: Specialized swarm management
- **workflow-manager**: Process automation
- **batch-executor**: Parallel task execution

### Development Modes  
- **coder**: Autonomous code generation
- **architect**: System design
- **reviewer**: Code review
- **tdd**: Test-driven development

### Analysis and Research Modes
- **researcher**: Deep research capabilities
- **analyzer**: Code and data analysis
- **optimizer**: Performance optimization

### Creative and Support Modes
- **designer**: UI/UX design
- **innovator**: Creative problem solving
- **documenter**: Documentation generation
- **debugger**: Systematic debugging
- **tester**: Comprehensive testing
- **memory-manager**: Knowledge management

## Usage
\`\`\`bash
# Run a specific mode
./claude-flow sparc run <mode> "task description"

# List all modes
./claude-flow sparc modes

# Get help for a mode
./claude-flow sparc help <mode>
\`\`\`
`;
};

/**
 * Creates swarm strategy templates
 */
export const createSwarmStrategyTemplates = (): Record<string, string> => {
  return {
    'analysis.md': createAnalysisStrategy(),
    'development.md': createDevelopmentStrategy(),
    'examples.md': createExamplesStrategy(),
    'maintenance.md': createMaintenanceStrategy(),
    'optimization.md': createOptimizationStrategy(),
    'research.md': createResearchStrategy(),
    'testing.md': createTestingStrategy()
  };
};

/**
 * Creates analysis strategy documentation
 */
function createAnalysisStrategy(): string {
  return `# Analysis Swarm Strategy

## Purpose
Comprehensive analysis through distributed agent coordination.

## Activation
\`./claude-flow swarm "analyze system performance" --strategy analysis\`

## Agent Roles
- Data Collector: Gathers metrics and logs
- Pattern Analyzer: Identifies trends and anomalies
- Report Generator: Creates comprehensive reports
- Insight Synthesizer: Combines findings

## Coordination Modes
- Mesh: For exploratory analysis
- Pipeline: For sequential processing
- Hierarchical: For complex systems

## Best Practices
- Define clear analysis objectives
- Use appropriate data sampling
- Validate findings across agents
- Generate actionable insights

## Example Workflow
1. Initialize analysis swarm
2. Collect system metrics
3. Analyze patterns in parallel
4. Synthesize findings
5. Generate comprehensive report
`;
}

/**
 * Creates development strategy documentation
 */
function createDevelopmentStrategy(): string {
  return `# Development Swarm Strategy

## Purpose
Coordinated development through specialized agent teams.

## Activation
\`./claude-flow swarm "build feature X" --strategy development\`

## Agent Roles
- Architect: Designs system structure
- Frontend Developer: Implements UI
- Backend Developer: Creates APIs
- Database Specialist: Manages data layer
- Integration Expert: Connects components

## Best Practices
- Use hierarchical mode for large projects
- Implement continuous integration
- Regular cross-agent synchronization
- Maintain consistent coding standards

## Coordination Patterns
- **Feature Teams**: Groups focused on specific features
- **Layer Teams**: Specialized by system layer
- **Cross-functional**: Mixed expertise groups

## Example Workflow
1. Architect creates system design
2. Teams implement components in parallel
3. Integration expert connects pieces
4. Continuous testing throughout
5. Final integration and deployment
`;
}

/**
 * Creates examples strategy documentation
 */
function createExamplesStrategy(): string {
  return `# Example Swarm Strategies

## Quick Start Examples

### Basic Web Application
\`\`\`bash
./claude-flow swarm "create todo app" --strategy development --agents 5
\`\`\`

### Data Analysis Pipeline
\`\`\`bash
./claude-flow swarm "analyze sales data" --strategy analysis --topology mesh
\`\`\`

### System Optimization
\`\`\`bash
./claude-flow swarm "optimize database queries" --strategy optimization
\`\`\`

## Advanced Examples

### Microservices Architecture
\`\`\`bash
./claude-flow swarm "design microservices" \\
  --strategy development \\
  --topology hierarchical \\
  --agents 8 \\
  --config microservices.json
\`\`\`

### Security Audit
\`\`\`bash
./claude-flow swarm "security assessment" \\
  --strategy analysis \\
  --priority critical \\
  --parallel
\`\`\`

## Custom Configurations
- Load from JSON files
- Override default settings
- Chain multiple strategies
- Integrate with CI/CD
`;
}

/**
 * Creates maintenance strategy documentation
 */
function createMaintenanceStrategy(): string {
  return `# Maintenance Swarm Strategy

## Purpose
Systematic maintenance and updates through coordinated agents.

## Activation
\`./claude-flow swarm "maintain production system" --strategy maintenance\`

## Agent Roles
- Monitor: Tracks system health
- Debugger: Investigates issues
- Patcher: Applies fixes
- Validator: Ensures stability
- Documenter: Updates documentation

## Maintenance Tasks
- Dependency updates
- Security patches
- Performance tuning
- Code refactoring
- Documentation updates

## Best Practices
- Schedule regular maintenance windows
- Implement rollback procedures
- Test all changes thoroughly
- Document all modifications
- Monitor post-maintenance

## Coordination Modes
- **Scheduled**: Regular maintenance cycles
- **Reactive**: Issue-driven maintenance
- **Preventive**: Proactive improvements
`;
}

/**
 * Creates optimization strategy documentation
 */
function createOptimizationStrategy(): string {
  return `# Optimization Swarm Strategy

## Purpose
Performance optimization through specialized agent coordination.

## Activation
\`./claude-flow swarm "optimize application performance" --strategy optimization\`

## Agent Roles
- Profiler: Identifies bottlenecks
- Optimizer: Implements improvements
- Benchmarker: Measures performance
- Validator: Ensures correctness
- Reporter: Documents changes

## Optimization Areas
- Algorithm efficiency
- Database queries
- Resource utilization
- Code structure
- Caching strategies

## Methodology
1. Profile current performance
2. Identify bottlenecks
3. Propose optimizations
4. Implement changes
5. Measure improvements
6. Validate functionality

## Best Practices
- Measure before optimizing
- Focus on critical paths
- Consider trade-offs
- Document all changes
- Maintain functionality
`;
}

/**
 * Creates research strategy documentation
 */
function createResearchStrategy(): string {
  return `# Research Swarm Strategy

## Purpose
Deep research and exploration through distributed agent intelligence.

## Activation
\`./claude-flow swarm "research quantum computing applications" --strategy research\`

## Agent Roles
- Literature Reviewer: Surveys existing work
- Data Analyst: Processes research data
- Hypothesis Generator: Creates theories
- Experiment Designer: Plans validation
- Knowledge Synthesizer: Combines findings

## Research Phases
1. Literature review
2. Gap analysis
3. Hypothesis formation
4. Experimental design
5. Data collection
6. Analysis and synthesis
7. Report generation

## Coordination Patterns
- **Parallel Exploration**: Multiple research paths
- **Sequential Depth**: Deep dive approaches
- **Iterative Refinement**: Continuous improvement

## Output Formats
- Research papers
- Technical reports
- Knowledge graphs
- Implementation guides
`;
}

/**
 * Creates testing strategy documentation
 */
function createTestingStrategy(): string {
  return `# Testing Swarm Strategy

## Purpose
Comprehensive testing through coordinated agent efforts.

## Activation
\`./claude-flow swarm "test entire system" --strategy testing\`

## Agent Roles
- Test Designer: Creates test scenarios
- Unit Tester: Tests individual components
- Integration Tester: Tests component interactions
- Performance Tester: Measures system performance
- Security Tester: Identifies vulnerabilities

## Testing Levels
- Unit Testing
- Integration Testing
- System Testing
- Performance Testing
- Security Testing
- User Acceptance Testing

## Best Practices
- Test early and often
- Automate where possible
- Cover edge cases
- Monitor test coverage
- Document test results

## Coordination Benefits
- Parallel test execution
- Comprehensive coverage
- Faster feedback cycles
- Consistent methodology
- Shared test artifacts
`;
}

/**
 * Creates a SPARC mode configuration template
 */
export const createSparcModeConfig: TemplateGenerator<{ mode: string; description: string }> = (options): string => {
  const { mode, description } = options || { mode: 'default', description: 'Default SPARC mode' };
  
  return {
    name: mode,
    description: description,
    version: "1.0.0",
    capabilities: [],
    tools: [],
    workflow: [],
    configuration: {
      maxAgents: 5,
      topology: "mesh",
      strategy: "adaptive"
    }
  } as any; // Return as JSON string in real implementation
};

/**
 * Type definitions for SPARC mode configuration
 */
export interface SparcModeConfig {
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  tools: string[];
  workflow: string[];
  configuration: {
    maxAgents: number;
    topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
    strategy: 'parallel' | 'sequential' | 'adaptive';
  };
}

/**
 * Type definitions for swarm strategy
 */
export interface SwarmStrategy {
  name: string;
  purpose: string;
  activation: string;
  agentRoles: Record<string, string>;
  coordinationModes: string[];
  bestPractices: string[];
}