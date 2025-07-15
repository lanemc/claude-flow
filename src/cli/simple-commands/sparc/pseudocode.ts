// SPARC Pseudocode Phase
// Generate pseudocode and flow diagrams based on specifications

import { SparcPhase } from './phase-base';
import type { PhaseArtifact, SparcOptions } from './phase-base';
import type { SpecificationResult } from './specification';

// Type definitions for pseudocode phase
export interface FlowDiagram {
  title: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  entry: string;
  exit: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'iterative';
}

export interface FlowNode {
  id: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'input' | 'output';
  label: string;
  description?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  condition?: string;
  label?: string;
}

export interface Algorithm {
  name: string;
  purpose: string;
  complexity: string;
  approach: string;
}

export interface DataStructure {
  name: string;
  purpose: string;
  operations: string[];
  complexity: {
    access: string;
    insertion: string;
    deletion: string;
  };
}

export interface InterfaceMethod {
  name: string;
  purpose: string;
  parameters: string[];
  returns: string;
}

export interface SystemInterface {
  name: string;
  type: string;
  methods: InterfaceMethod[];
}

export interface LogicFlowStep {
  step: number;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  conditions: string[];
}

export interface EdgeCase {
  case: string;
  description: string;
  handling: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FunctionComplexity {
  cyclomatic: number;
  lines: number;
  level: 'low' | 'medium' | 'high';
}

export interface ComplexityAnalysis {
  overall: string;
  functions?: Record<string, FunctionComplexity>;
  recommendations: string[];
}

export interface PseudocodeResult extends PhaseArtifact {
  flowDiagram: FlowDiagram | null;
  pseudocode: string[];
  algorithms: Algorithm[];
  dataStructures: DataStructure[];
  interfaces: SystemInterface[];
  logicFlow: LogicFlowStep[];
  edgeCases: EdgeCase[];
  complexityAnalysis: ComplexityAnalysis;
  dependencies: string[];
}

export class SparcPseudocode extends SparcPhase {
  private flowDiagram: FlowDiagram | null;
  private pseudocode: string[];
  private algorithms: Algorithm[];
  private dataStructures: DataStructure[];
  private interfaces: SystemInterface[];

  constructor(taskDescription: string, options: SparcOptions) {
    super('pseudocode', taskDescription, options);
    this.flowDiagram = null;
    this.pseudocode = [];
    this.algorithms = [];
    this.dataStructures = [];
    this.interfaces = [];
  }

  /**
   * Execute pseudocode phase
   */
  async execute(): Promise<PseudocodeResult> {
    console.log('🔄 Starting Pseudocode Phase');
    
    await this.initializePhase();
    
    const result: PseudocodeResult = {
      flowDiagram: null,
      pseudocode: [],
      algorithms: [],
      dataStructures: [],
      interfaces: [],
      logicFlow: [],
      edgeCases: [],
      complexityAnalysis: {
        overall: 'low',
        recommendations: []
      },
      dependencies: []
    };

    try {
      // Load specification from previous phase
      const specification = await this.retrieveFromMemory('specification_complete') as SpecificationResult;
      if (!specification) {
        throw new Error('Specification phase must be completed first');
      }

      // Generate flow diagram
      result.flowDiagram = await this.generateFlowDiagram(specification);
      
      // Generate pseudocode
      result.pseudocode = await this.generatePseudocode(specification);
      
      // Define algorithms
      result.algorithms = await this.defineAlgorithms(specification);
      
      // Define data structures
      result.dataStructures = await this.defineDataStructures(specification);
      
      // Define interfaces
      result.interfaces = await this.defineInterfaces(specification);
      
      // Map logic flow
      result.logicFlow = await this.mapLogicFlow(specification);
      
      // Identify edge cases
      result.edgeCases = await this.identifyEdgeCases(specification);
      
      // Analyze complexity
      result.complexityAnalysis = await this.analyzeComplexity(result.pseudocode);
      
      // Identify dependencies
      result.dependencies = await this.identifyDependencies(specification);

      // Generate pseudocode document
      await this.generatePseudocodeDocument(result);

      // Store in memory
      await this.storeInMemory('pseudocode_complete', result);

      console.log('✅ Pseudocode phase completed');
      return result;

    } catch (error) {
      console.error('❌ Pseudocode phase failed:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Generate flow diagram
   */
  async generateFlowDiagram(specification: SpecificationResult): Promise<FlowDiagram> {
    const flowDiagram: FlowDiagram = {
      title: `Flow Diagram: ${this.taskDescription}`,
      nodes: [],
      edges: [],
      entry: 'start',
      exit: 'end',
      type: 'sequential'
    };

    // Determine flow type based on requirements
    const requirements = specification.requirements || [];
    const hasApiRequirements = requirements.some(req => req.toLowerCase().includes('api'));
    const hasConditional = requirements.some(req => req.toLowerCase().includes('validate') || req.toLowerCase().includes('check'));
    const hasLoop = requirements.some(req => req.toLowerCase().includes('process') || req.toLowerCase().includes('iterate'));

    if (hasLoop) {
      flowDiagram.type = 'iterative';
    } else if (hasConditional) {
      flowDiagram.type = 'conditional';
    } else if (hasApiRequirements) {
      flowDiagram.type = 'sequential';
    }

    // Add start node
    flowDiagram.nodes.push({
      id: 'start',
      type: 'start',
      label: 'Start',
      description: 'System initialization'
    });

    // Add process nodes based on requirements
    for (const [index, requirement] of requirements.entries()) {
      const nodeId = `process_${index + 1}`;
      flowDiagram.nodes.push({
        id: nodeId,
        type: 'process',
        label: this.generateFunctionName(requirement),
        description: requirement
      });

      // Add edge from previous node
      const previousId = index === 0 ? 'start' : `process_${index}`;
      flowDiagram.edges.push({
        from: previousId,
        to: nodeId,
        label: `Step ${index + 1}`
      });
    }

    // Add end node
    flowDiagram.nodes.push({
      id: 'end',
      type: 'end',
      label: 'End',
      description: 'System completion'
    });

    // Connect last process to end
    if (requirements.length > 0) {
      flowDiagram.edges.push({
        from: `process_${requirements.length}`,
        to: 'end',
        label: 'Complete'
      });
    }

    return flowDiagram;
  }

  /**
   * Generate function name from requirement
   */
  generateFunctionName(requirement: string): string {
    const words = requirement.toLowerCase().split(' ');
    const actionVerbs = ['provide', 'handle', 'ensure', 'validate', 'authenticate', 'process', 'create', 'update', 'delete'];
    
    for (const verb of actionVerbs) {
      if (words.includes(verb)) {
        const objectWord = words[words.indexOf(verb) + 1] || 'data';
        return `${verb}_${objectWord}`;
      }
    }
    
    return 'process_request';
  }

  /**
   * Generate pseudocode
   */
  async generatePseudocode(specification: SpecificationResult): Promise<string[]> {
    const pseudocode: string[] = [];
    const requirements = specification.requirements || [];

    // Main function header
    pseudocode.push('FUNCTION main()');
    pseudocode.push('  BEGIN');
    
    // Initialization
    pseudocode.push('    // Initialize system');
    pseudocode.push('    CALL initialize_system()');
    pseudocode.push('    SET error_handler = default_error_handler');
    pseudocode.push('');

    // Process each requirement
    for (const [index, requirement] of requirements.entries()) {
      const functionName = this.generateFunctionName(requirement);
      pseudocode.push(`    // ${requirement}`);
      pseudocode.push(`    TRY`);
      pseudocode.push(`      CALL ${functionName}()`);
      pseudocode.push(`    CATCH error`);
      pseudocode.push(`      CALL handle_error(error)`);
      pseudocode.push(`      RETURN failure`);
      pseudocode.push('');
    }

    // Cleanup and return
    pseudocode.push('    // Cleanup and finalize');
    pseudocode.push('    CALL cleanup_resources()');
    pseudocode.push('    RETURN success');
    pseudocode.push('  END');
    pseudocode.push('');

    // Generate sub-functions for each requirement
    for (const requirement of requirements) {
      const functionName = this.generateFunctionName(requirement);
      pseudocode.push(...this.generateFunctionPseudocode(functionName, requirement));
      pseudocode.push('');
    }

    return pseudocode;
  }

  /**
   * Generate pseudocode for individual function
   */
  generateFunctionPseudocode(functionName: string, requirement: string): string[] {
    const pseudocode: string[] = [];
    const reqLower = requirement.toLowerCase();

    pseudocode.push(`FUNCTION ${functionName}()`);
    pseudocode.push('  BEGIN');

    if (reqLower.includes('validate')) {
      pseudocode.push('    IF input IS NOT valid THEN');
      pseudocode.push('      THROW validation_error');
      pseudocode.push('    END IF');
    }

    if (reqLower.includes('authenticate')) {
      pseudocode.push('    IF credentials ARE NOT valid THEN');
      pseudocode.push('      THROW authentication_error');
      pseudocode.push('    END IF');
      pseudocode.push('    SET user_session = create_session(user)');
    }

    if (reqLower.includes('api')) {
      pseudocode.push('    PARSE request_data');
      pseudocode.push('    VALIDATE request_format');
      pseudocode.push('    PROCESS request');
      pseudocode.push('    FORMAT response');
      pseudocode.push('    RETURN response');
    } else if (reqLower.includes('data')) {
      pseudocode.push('    CONNECT to_database');
      pseudocode.push('    EXECUTE query');
      pseudocode.push('    PROCESS results');
      pseudocode.push('    CLOSE connection');
    } else {
      pseudocode.push('    EXECUTE main_logic');
      pseudocode.push('    VALIDATE results');
    }

    pseudocode.push('  END');
    
    return pseudocode;
  }

  /**
   * Define algorithms
   */
  async defineAlgorithms(specification: SpecificationResult): Promise<Algorithm[]> {
    const algorithms: Algorithm[] = [];
    const requirements = specification.requirements || [];
    
    // Analyze requirements for algorithmic needs
    for (const requirement of requirements) {
      const reqLower = requirement.toLowerCase();
      
      if (reqLower.includes('search') || reqLower.includes('find')) {
        algorithms.push({
          name: 'Search Algorithm',
          purpose: 'Efficiently locate data within collections',
          complexity: 'O(log n)',
          approach: 'Binary search for sorted data, hash lookup for key-value pairs'
        });
      }
      
      if (reqLower.includes('sort') || reqLower.includes('order')) {
        algorithms.push({
          name: 'Sorting Algorithm',
          purpose: 'Arrange data in specified order',
          complexity: 'O(n log n)',
          approach: 'Quick sort or merge sort for general cases'
        });
      }
      
      if (reqLower.includes('optimize') || reqLower.includes('performance')) {
        algorithms.push({
          name: 'Optimization Algorithm',
          purpose: 'Improve system performance and resource usage',
          complexity: 'O(n)',
          approach: 'Caching, lazy loading, and resource pooling'
        });
      }
      
      if (reqLower.includes('authenticate') || reqLower.includes('security')) {
        algorithms.push({
          name: 'Authentication Algorithm',
          purpose: 'Secure user verification and session management',
          complexity: 'O(1)',
          approach: 'Token-based authentication with cryptographic hashing'
        });
      }
      
      if (reqLower.includes('validate') || reqLower.includes('check')) {
        algorithms.push({
          name: 'Validation Algorithm',
          purpose: 'Ensure data integrity and format compliance',
          complexity: 'O(n)',
          approach: 'Rule-based validation with early termination'
        });
      }
    }
    
    // Default algorithms for common patterns
    if (algorithms.length === 0) {
      algorithms.push({
        name: 'Sequential Processing Algorithm',
        purpose: 'Process operations in defined sequence',
        complexity: 'O(n)',
        approach: 'Linear processing with error handling'
      });
    }
    
    return algorithms;
  }

  /**
   * Define data structures
   */
  async defineDataStructures(specification: SpecificationResult): Promise<DataStructure[]> {
    const dataStructures: DataStructure[] = [];
    const requirements = specification.requirements || [];
    
    // Analyze requirements for data structure needs
    for (const requirement of requirements) {
      const reqLower = requirement.toLowerCase();
      
      if (reqLower.includes('list') || reqLower.includes('array') || reqLower.includes('collection')) {
        dataStructures.push({
          name: 'Dynamic Array',
          purpose: 'Store variable-length collections',
          operations: ['add', 'remove', 'search', 'iterate'],
          complexity: { access: 'O(1)', insertion: 'O(n)', deletion: 'O(n)' }
        });
      }
      
      if (reqLower.includes('map') || reqLower.includes('dictionary') || reqLower.includes('key')) {
        dataStructures.push({
          name: 'Hash Map',
          purpose: 'Key-value pair storage with fast lookup',
          operations: ['put', 'get', 'remove', 'contains'],
          complexity: { access: 'O(1)', insertion: 'O(1)', deletion: 'O(1)' }
        });
      }
      
      if (reqLower.includes('queue') || reqLower.includes('fifo') || reqLower.includes('buffer')) {
        dataStructures.push({
          name: 'Queue',
          purpose: 'First-in-first-out data processing',
          operations: ['enqueue', 'dequeue', 'peek', 'isEmpty'],
          complexity: { access: 'O(n)', insertion: 'O(1)', deletion: 'O(1)' }
        });
      }
      
      if (reqLower.includes('stack') || reqLower.includes('lifo') || reqLower.includes('undo')) {
        dataStructures.push({
          name: 'Stack',
          purpose: 'Last-in-first-out operations',
          operations: ['push', 'pop', 'peek', 'isEmpty'],
          complexity: { access: 'O(n)', insertion: 'O(1)', deletion: 'O(1)' }
        });
      }
    }
    
    // Default data structures
    if (dataStructures.length === 0) {
      dataStructures.push({
        name: 'Object',
        purpose: 'Basic data encapsulation',
        operations: ['create', 'read', 'update', 'delete'],
        complexity: { access: 'O(1)', insertion: 'O(1)', deletion: 'O(1)' }
      });
    }
    
    return dataStructures;
  }

  /**
   * Define interfaces
   */
  async defineInterfaces(specification: SpecificationResult): Promise<SystemInterface[]> {
    const interfaces: SystemInterface[] = [];
    const requirements = specification.requirements || [];
    
    // API interfaces
    if (requirements.some(req => req.toLowerCase().includes('api'))) {
      interfaces.push({
        name: 'APIInterface',
        type: 'REST API',
        methods: [
          { name: 'GET', purpose: 'Retrieve data', parameters: ['id', 'filters'], returns: 'data object' },
          { name: 'POST', purpose: 'Create new resource', parameters: ['data'], returns: 'created resource' },
          { name: 'PUT', purpose: 'Update existing resource', parameters: ['id', 'data'], returns: 'updated resource' },
          { name: 'DELETE', purpose: 'Remove resource', parameters: ['id'], returns: 'success status' }
        ]
      });
    }
    
    // Database interfaces
    if (requirements.some(req => req.toLowerCase().includes('data'))) {
      interfaces.push({
        name: 'DatabaseInterface',
        type: 'Data Access Layer',
        methods: [
          { name: 'connect', purpose: 'Establish connection', parameters: ['config'], returns: 'connection object' },
          { name: 'query', purpose: 'Execute query', parameters: ['sql', 'params'], returns: 'result set' },
          { name: 'transaction', purpose: 'Execute transaction', parameters: ['operations'], returns: 'transaction result' },
          { name: 'disconnect', purpose: 'Close connection', parameters: [], returns: 'void' }
        ]
      });
    }
    
    // Service interfaces
    interfaces.push({
      name: 'ServiceInterface',
      type: 'Business Logic Layer',
      methods: [
        { name: 'initialize', purpose: 'Initialize service', parameters: ['config'], returns: 'service instance' },
        { name: 'execute', purpose: 'Execute main operation', parameters: ['request'], returns: 'response' },
        { name: 'validate', purpose: 'Validate input', parameters: ['data'], returns: 'validation result' },
        { name: 'cleanup', purpose: 'Clean up resources', parameters: [], returns: 'void' }
      ]
    });
    
    return interfaces;
  }

  /**
   * Map logic flow
   */
  async mapLogicFlow(specification: SpecificationResult): Promise<LogicFlowStep[]> {
    const logicFlow: LogicFlowStep[] = [];
    const requirements = specification.requirements || [];
    
    // Main flow
    logicFlow.push({
      step: 1,
      name: 'Initialization',
      description: 'System startup and configuration',
      inputs: ['configuration', 'environment variables'],
      outputs: ['initialized system'],
      conditions: ['valid configuration', 'available resources']
    });
    
    // Process each requirement as a flow step
    for (const [index, requirement] of requirements.entries()) {
      logicFlow.push({
        step: index + 2,
        name: this.generateFunctionName(requirement),
        description: requirement,
        inputs: this.identifyInputs(requirement),
        outputs: this.identifyOutputs(requirement),
        conditions: this.identifyConditions(requirement)
      });
    }
    
    // Final step
    logicFlow.push({
      step: requirements.length + 2,
      name: 'Finalization',
      description: 'Cleanup and result reporting',
      inputs: ['execution results'],
      outputs: ['final status', 'cleanup confirmation'],
      conditions: ['all operations completed']
    });
    
    return logicFlow;
  }

  /**
   * Identify inputs for requirement
   */
  identifyInputs(requirement: string): string[] {
    const inputs: string[] = [];
    const reqLower = requirement.toLowerCase();
    
    if (reqLower.includes('api')) inputs.push('HTTP request', 'request parameters');
    if (reqLower.includes('data')) inputs.push('data payload', 'database connection');
    if (reqLower.includes('user')) inputs.push('user credentials', 'user input');
    if (reqLower.includes('validate')) inputs.push('validation rules', 'input data');
    if (reqLower.includes('authenticate')) inputs.push('authentication credentials');
    
    return inputs.length > 0 ? inputs : ['system input'];
  }

  /**
   * Identify outputs for requirement
   */
  identifyOutputs(requirement: string): string[] {
    const outputs: string[] = [];
    const reqLower = requirement.toLowerCase();
    
    if (reqLower.includes('api')) outputs.push('HTTP response', 'status code');
    if (reqLower.includes('data')) outputs.push('processed data', 'transaction result');
    if (reqLower.includes('user')) outputs.push('user session', 'authentication token');
    if (reqLower.includes('validate')) outputs.push('validation result', 'error messages');
    if (reqLower.includes('authenticate')) outputs.push('authentication status', 'user session');
    
    return outputs.length > 0 ? outputs : ['system output'];
  }

  /**
   * Identify conditions for requirement
   */
  identifyConditions(requirement: string): string[] {
    const conditions: string[] = [];
    const reqLower = requirement.toLowerCase();
    
    if (reqLower.includes('api')) conditions.push('valid request format', 'authorized access');
    if (reqLower.includes('data')) conditions.push('database connectivity', 'valid data format');
    if (reqLower.includes('user')) conditions.push('user exists', 'session active');
    if (reqLower.includes('validate')) conditions.push('validation rules met', 'data format correct');
    if (reqLower.includes('authenticate')) conditions.push('valid credentials', 'account active');
    
    return conditions.length > 0 ? conditions : ['system ready'];
  }

  /**
   * Identify edge cases
   */
  async identifyEdgeCases(specification: SpecificationResult): Promise<EdgeCase[]> {
    const edgeCases: EdgeCase[] = [];
    const requirements = specification.requirements || [];
    
    // Common edge cases
    edgeCases.push(
      {
        case: 'Empty input data',
        description: 'System receives null or empty input',
        handling: 'Validate input and return appropriate error message',
        severity: 'medium'
      },
      {
        case: 'Network connectivity issues',
        description: 'Network connection is lost during operation',
        handling: 'Implement retry logic with exponential backoff',
        severity: 'high'
      },
      {
        case: 'Concurrent access conflicts',
        description: 'Multiple users accessing same resource simultaneously',
        handling: 'Implement proper locking and transaction management',
        severity: 'high'
      },
      {
        case: 'System resource exhaustion',
        description: 'Memory or disk space becomes unavailable',
        handling: 'Monitor resources and implement graceful degradation',
        severity: 'critical'
      }
    );

    // Requirement-specific edge cases
    for (const requirement of requirements) {
      const reqLower = requirement.toLowerCase();
      
      if (reqLower.includes('api')) {
        edgeCases.push({
          case: 'Invalid API request format',
          description: 'Malformed or unexpected request structure',
          handling: 'Validate request format and return 400 Bad Request',
          severity: 'medium'
        });
      }
      
      if (reqLower.includes('authenticate')) {
        edgeCases.push({
          case: 'Authentication token expiration',
          description: 'User token expires during session',
          handling: 'Implement token refresh mechanism',
          severity: 'medium'
        });
      }
      
      if (reqLower.includes('data')) {
        edgeCases.push({
          case: 'Database corruption',
          description: 'Data integrity issues in storage layer',
          handling: 'Implement data validation and backup recovery',
          severity: 'critical'
        });
      }
    }
    
    return edgeCases;
  }

  /**
   * Analyze complexity
   */
  async analyzeComplexity(pseudocode: string[]): Promise<ComplexityAnalysis> {
    let cyclomaticComplexity = 1; // Base complexity
    const totalLines = pseudocode.length;
    const functions: Record<string, FunctionComplexity> = {};
    const recommendations: string[] = [];
    
    // Count decision points
    for (const line of pseudocode) {
      if (line.includes('IF') || line.includes('WHILE') || line.includes('FOR') || 
          line.includes('TRY') || line.includes('CATCH')) {
        cyclomaticComplexity++;
      }
    }
    
    // Analyze functions
    let currentFunction = '';
    let functionLines = 0;
    let functionComplexity = 1;
    
    for (const line of pseudocode) {
      if (line.includes('FUNCTION')) {
        if (currentFunction) {
          functions[currentFunction] = {
            cyclomatic: functionComplexity,
            lines: functionLines,
            level: functionComplexity > 10 ? 'high' : functionComplexity > 5 ? 'medium' : 'low'
          };
        }
        currentFunction = line.match(/FUNCTION (\w+)/)?.[1] || 'unknown';
        functionLines = 0;
        functionComplexity = 1;
      } else if (currentFunction) {
        functionLines++;
        if (line.includes('IF') || line.includes('WHILE') || line.includes('FOR') || 
            line.includes('TRY') || line.includes('CATCH')) {
          functionComplexity++;
        }
      }
    }
    
    // Add last function
    if (currentFunction) {
      functions[currentFunction] = {
        cyclomatic: functionComplexity,
        lines: functionLines,
        level: functionComplexity > 10 ? 'high' : functionComplexity > 5 ? 'medium' : 'low'
      };
    }
    
    // Generate recommendations
    if (cyclomaticComplexity > 20) {
      recommendations.push('Consider breaking down complex logic into smaller functions');
    }
    if (totalLines > 100) {
      recommendations.push('Large pseudocode block - consider modularization');
    }
    
    const overallLevel = cyclomaticComplexity > 20 ? 'high' : cyclomaticComplexity > 10 ? 'medium' : 'low';
    
    return {
      overall: overallLevel,
      functions,
      recommendations
    };
  }

  /**
   * Identify dependencies
   */
  async identifyDependencies(specification: SpecificationResult): Promise<string[]> {
    const dependencies: string[] = [];
    const requirements = specification.requirements || [];
    
    for (const requirement of requirements) {
      const reqLower = requirement.toLowerCase();
      
      if (reqLower.includes('api')) {
        dependencies.push('HTTP client library');
        dependencies.push('JSON parsing library');
      }
      if (reqLower.includes('data')) {
        dependencies.push('Database driver');
        dependencies.push('ORM or query builder');
      }
      if (reqLower.includes('authenticate')) {
        dependencies.push('Cryptography library');
        dependencies.push('JWT token library');
      }
      if (reqLower.includes('validate')) {
        dependencies.push('Validation framework');
        dependencies.push('Schema validation library');
      }
    }
    
    // Remove duplicates
    return [...new Set(dependencies)];
  }

  /**
   * Generate pseudocode document
   */
  async generatePseudocodeDocument(result: PseudocodeResult): Promise<string> {
    const document = `# ${this.taskDescription} - Pseudocode

## Flow Diagram
**Title**: ${result.flowDiagram?.title || 'N/A'}
**Type**: ${result.flowDiagram?.type || 'sequential'}

### Nodes
${result.flowDiagram?.nodes.map(node => `
- **${node.id}** (${node.type}): ${node.label}
  ${node.description ? `  *${node.description}*` : ''}
`).join('') || 'No nodes defined'}

### Edges
${result.flowDiagram?.edges.map(edge => `
- ${edge.from} → ${edge.to} ${edge.condition ? `[${edge.condition}]` : ''}
  ${edge.label ? `  *${edge.label}*` : ''}
`).join('') || 'No edges defined'}

## Pseudocode

\`\`\`
${result.pseudocode.join('\n')}
\`\`\`

## Algorithms

${result.algorithms.map((algo, _index) => `
### ${index + 1}. ${algo.name}
**Purpose**: ${algo.purpose}
**Complexity**: ${algo.complexity}
**Approach**: ${algo.approach}
`).join('\n')}

## Data Structures

${result.dataStructures.map((ds, _index) => `
### ${index + 1}. ${ds.name}
**Purpose**: ${ds.purpose}
**Operations**: ${ds.operations.join(', ')}
**Complexity**: Access: ${ds.complexity.access}, Insertion: ${ds.complexity.insertion}, Deletion: ${ds.complexity.deletion}
`).join('\n')}

## Interfaces

${result.interfaces.map((iface, _index) => `
### ${index + 1}. ${iface.name}
**Type**: ${iface.type}

${iface.methods.map(method => `
#### ${method.name}
- **Purpose**: ${method.purpose}
- **Parameters**: ${method.parameters.join(', ')}
- **Returns**: ${method.returns}
`).join('\n')}
`).join('\n')}

## Logic Flow

${result.logicFlow.map(step => `
### Step ${step.step}: ${step.name}
**Description**: ${step.description}
**Inputs**: ${step.inputs.join(', ')}
**Outputs**: ${step.outputs.join(', ')}
**Conditions**: ${step.conditions.join(', ')}
`).join('\n')}

## Edge Cases

${result.edgeCases.map((edge, _index) => `
### ${index + 1}. ${edge.case}
**Description**: ${edge.description}
**Handling**: ${edge.handling}
**Severity**: ${edge.severity}
`).join('\n')}

## Complexity Analysis
**Overall Complexity**: ${result.complexityAnalysis.overall}

### Function Complexity
${Object.entries(result.complexityAnalysis.functions || {}).map(([func, complexity]) => `
- **${func}**: Cyclomatic: ${complexity.cyclomatic}, Lines: ${complexity.lines}, Level: ${complexity.level}
`).join('\n')}

### Recommendations
${result.complexityAnalysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Dependencies
${result.dependencies.map((dep, _index) => `${index + 1}. ${dep}`).join('\n')}
`;

    // Save document
    await this.saveArtifact('pseudocode.md', document);
    return document;
  }
}

export default SparcPseudocode;