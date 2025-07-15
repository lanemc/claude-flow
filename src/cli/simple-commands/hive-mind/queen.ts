/**
 * Queen Coordinator for Hive Mind System
 * Strategic decision-making and swarm coordination
 */

import { EventEmitter } from 'events';

/**
 * Queen types and their characteristics
 */
const QUEEN_TYPES = {
  strategic: {
    name: 'Strategic Queen',
    traits: ['long-term planning', 'resource optimization', 'goal alignment'],
    decisionWeight: 3,
    consensusThreshold: 0.6
  },
  tactical: {
    name: 'Tactical Queen',
    traits: ['task prioritization', 'workflow optimization', 'rapid response'],
    decisionWeight: 2,
    consensusThreshold: 0.5
  },
  adaptive: {
    name: 'Adaptive Queen',
    traits: ['learning', 'pattern recognition', 'strategy evolution'],
    decisionWeight: 2.5,
    consensusThreshold: 0.55
  }
} as const;

export type QueenType = keyof typeof QUEEN_TYPES;

/**
 * Configuration interface for QueenCoordinator
 */
export interface QueenConfig {
  swarmId?: string;
  type?: QueenType;
  objective?: string;
}

/**
 * Worker interface
 */
export interface Worker {
  id: string;
  type: string;
  status: string;
  tasksCompleted: number;
  performance?: {
    avgTaskTime: number;
    successRate: number;
  };
}

/**
 * Analysis result interface
 */
export interface ObjectiveAnalysis {
  objective: string;
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  requiredCapabilities: string[];
  estimatedTasks: number;
  recommendedStrategy: string;
  resourceRequirements: {
    minWorkers: number;
    optimalWorkers: number;
    estimatedTime: number;
    memoryRequirement: string;
  };
}

/**
 * Execution plan interface
 */
export interface ExecutionPlan {
  strategy: string;
  phases: ExecutionPhase[];
  estimatedDuration: number;
  parallelism: string;
  iterative?: boolean;
  consensusRequired?: boolean;
  learningEnabled?: boolean;
}

/**
 * Execution phase interface
 */
export interface ExecutionPhase {
  name: string;
  tasks: string[];
  workers: Worker[];
  parallel: boolean;
  requiresConsensus?: boolean;
  consensusThreshold?: number;
  learning?: boolean;
  applyLearning?: boolean;
  workerAssignment?: Record<string, Worker>;
}

/**
 * Decision interface
 */
export interface Decision {
  topic: string;
  options: string[];
  workerVotes: Record<string, string>;
  queenVote: string;
  timestamp: number;
  result?: string;
}

/**
 * Strategy function type
 */
type StrategyFunction = (analysis: ObjectiveAnalysis, workers: Worker[]) => Promise<ExecutionPlan>;

/**
 * QueenCoordinator class
 */
export class QueenCoordinator extends EventEmitter {
  private config: Required<QueenConfig> & typeof QUEEN_TYPES[QueenType];
  private state: {
    status: string;
    decisionsCount: number;
    strategiesExecuted: number;
    learningData: Map<string, any>;
    currentStrategy: string | null;
    taskQueue: any[];
    workerAssignments: Map<string, any>;
  };
  private strategies: Record<string, StrategyFunction>;

  constructor(config: QueenConfig = {}) {
    super();
    
    const queenType = config.type || 'strategic';
    this.config = {
      swarmId: config.swarmId || 'default',
      type: queenType,
      objective: config.objective || '',
      ...QUEEN_TYPES[queenType]
    };
    
    this.state = {
      status: 'initializing',
      decisionsCount: 0,
      strategiesExecuted: 0,
      learningData: new Map(),
      currentStrategy: null,
      taskQueue: [],
      workerAssignments: new Map()
    };
    
    this.strategies = {
      divide_and_conquer: this._divideAndConquerStrategy.bind(this),
      parallel_execution: this._parallelExecutionStrategy.bind(this),
      sequential_refinement: this._sequentialRefinementStrategy.bind(this),
      consensus_driven: this._consensusDrivenStrategy.bind(this),
      adaptive_learning: this._adaptiveLearningStrategy.bind(this)
    };
    
    this._initialize();
  }
  
  /**
   * Initialize queen coordinator
   */
  private _initialize(): void {
    this.state.status = 'active';
    this.emit('queen:initialized', {
      type: this.config.type,
      traits: this.config.traits
    });
  }
  
  /**
   * Analyze objective and create strategic plan
   */
  async analyzeObjective(objective: string): Promise<ObjectiveAnalysis> {
    const analysis: ObjectiveAnalysis = {
      objective,
      complexity: this._assessComplexity(objective),
      requiredCapabilities: this._identifyRequiredCapabilities(objective),
      estimatedTasks: this._estimateTaskCount(objective),
      recommendedStrategy: this._selectStrategy(objective),
      resourceRequirements: this._estimateResources(objective)
    };
    
    // Store analysis for learning
    this.state.learningData.set('objective_analysis', analysis);
    
    this.emit('objective:analyzed', analysis);
    return analysis;
  }
  
  /**
   * Assess complexity of objective
   */
  private _assessComplexity(objective: string): 'low' | 'medium' | 'high' | 'very_high' {
    const complexityFactors = {
      length: objective.length > 100 ? 2 : 1,
      keywords: this._countComplexityKeywords(objective),
      components: this._identifyComponents(objective).length
    };
    
    const score = Object.values(complexityFactors).reduce((a, b) => a + b, 0);
    
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    if (score <= 9) return 'high';
    return 'very_high';
  }
  
  /**
   * Count complexity keywords
   */
  private _countComplexityKeywords(text: string): number {
    const complexKeywords = [
      'complex', 'advanced', 'enterprise', 'distributed', 'scalable',
      'microservices', 'architecture', 'integration', 'optimization',
      'security', 'performance', 'concurrent', 'real-time'
    ];
    
    const lowerText = text.toLowerCase();
    return complexKeywords.filter(keyword => lowerText.includes(keyword)).length;
  }
  
  /**
   * Identify components in objective
   */
  private _identifyComponents(objective: string): string[] {
    const components: string[] = [];
    const componentKeywords = {
      backend: ['api', 'server', 'backend', 'database', 'service'],
      frontend: ['ui', 'frontend', 'interface', 'client', 'web'],
      data: ['database', 'data', 'storage', 'cache', 'persistence'],
      auth: ['auth', 'security', 'login', 'permission', 'access'],
      testing: ['test', 'quality', 'validation', 'verify'],
      deployment: ['deploy', 'ci/cd', 'docker', 'kubernetes'],
      monitoring: ['monitor', 'logging', 'metrics', 'observability']
    };
    
    const lowerObjective = objective.toLowerCase();
    
    Object.entries(componentKeywords).forEach(([component, keywords]) => {
      if (keywords.some(keyword => lowerObjective.includes(keyword))) {
        components.push(component);
      }
    });
    
    return components;
  }
  
  /**
   * Identify required capabilities
   */
  private _identifyRequiredCapabilities(objective: string): string[] {
    const capabilities = new Set<string>();
    const components = this._identifyComponents(objective);
    
    // Map components to capabilities
    const capabilityMap: Record<string, string[]> = {
      backend: ['coder', 'architect', 'tester'],
      frontend: ['coder', 'tester', 'reviewer'],
      data: ['architect', 'analyst', 'optimizer'],
      auth: ['architect', 'coder', 'tester'],
      testing: ['tester', 'reviewer'],
      deployment: ['architect', 'optimizer'],
      monitoring: ['analyst', 'optimizer']
    };
    
    components.forEach(component => {
      const caps = capabilityMap[component] || [];
      caps.forEach(cap => capabilities.add(cap));
    });
    
    // Always include researcher for initial analysis
    capabilities.add('researcher');
    
    return Array.from(capabilities);
  }
  
  /**
   * Estimate number of tasks
   */
  private _estimateTaskCount(objective: string): number {
    const complexity = this._assessComplexity(objective);
    const components = this._identifyComponents(objective).length;
    
    const baseTaskCount = {
      low: 5,
      medium: 10,
      high: 20,
      very_high: 30
    };
    
    return baseTaskCount[complexity] + (components * 3);
  }
  
  /**
   * Select optimal strategy
   */
  private _selectStrategy(objective: string): string {
    const complexity = this._assessComplexity(objective);
    const components = this._identifyComponents(objective);
    
    // Strategy selection heuristics
    if (components.length > 3 && complexity !== 'low') {
      return 'divide_and_conquer';
    }
    
    if (objective.toLowerCase().includes('parallel') || components.length > 5) {
      return 'parallel_execution';
    }
    
    if (objective.toLowerCase().includes('iterative') || objective.toLowerCase().includes('refine')) {
      return 'sequential_refinement';
    }
    
    if (this.config.type === 'adaptive') {
      return 'adaptive_learning';
    }
    
    return 'consensus_driven'; // Default
  }
  
  /**
   * Estimate resource requirements
   */
  private _estimateResources(objective: string): ObjectiveAnalysis['resourceRequirements'] {
    const complexity = this._assessComplexity(objective);
    const taskCount = this._estimateTaskCount(objective);
    
    return {
      minWorkers: Math.min(3, Math.ceil(taskCount / 10)),
      optimalWorkers: Math.min(8, Math.ceil(taskCount / 5)),
      estimatedTime: taskCount * 5, // minutes
      memoryRequirement: complexity === 'very_high' ? 'high' : 'medium'
    };
  }
  
  /**
   * Create execution plan
   */
  async createExecutionPlan(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const strategy = this.strategies[analysis.recommendedStrategy];
    if (!strategy) {
      throw new Error(`Unknown strategy: ${analysis.recommendedStrategy}`);
    }
    
    const plan = await strategy(analysis, workers);
    
    this.state.currentStrategy = analysis.recommendedStrategy;
    this.state.strategiesExecuted++;
    
    this.emit('plan:created', plan);
    return plan;
  }
  
  /**
   * Divide and conquer strategy
   */
  private async _divideAndConquerStrategy(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const components = this._identifyComponents(analysis.objective);
    const phases: ExecutionPhase[] = [];
    
    // Phase 1: Research and planning
    phases.push({
      name: 'Research and Planning',
      tasks: [
        'Research best practices and patterns',
        'Analyze requirements and constraints',
        'Create high-level architecture design'
      ],
      workers: workers.filter(w => ['researcher', 'architect'].includes(w.type)),
      parallel: true
    });
    
    // Phase 2: Component development
    components.forEach(component => {
      phases.push({
        name: `Develop ${component}`,
        tasks: this._generateComponentTasks(component),
        workers: workers.filter(w => ['coder', 'architect'].includes(w.type)),
        parallel: true
      });
    });
    
    // Phase 3: Integration and testing
    phases.push({
      name: 'Integration and Testing',
      tasks: [
        'Integrate components',
        'Write integration tests',
        'Perform end-to-end testing',
        'Fix integration issues'
      ],
      workers: workers.filter(w => ['coder', 'tester'].includes(w.type)),
      parallel: false
    });
    
    // Phase 4: Optimization and documentation
    phases.push({
      name: 'Optimization and Documentation',
      tasks: [
        'Optimize performance',
        'Document architecture',
        'Create user documentation',
        'Prepare deployment guide'
      ],
      workers: workers.filter(w => ['optimizer', 'documenter'].includes(w.type)),
      parallel: true
    });
    
    return {
      strategy: 'divide_and_conquer',
      phases,
      estimatedDuration: phases.length * 15, // minutes
      parallelism: 'high'
    };
  }
  
  /**
   * Parallel execution strategy
   */
  private async _parallelExecutionStrategy(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const tasks = this._generateAllTasks(analysis);
    const workerGroups = this._groupWorkersByType(workers);
    
    return {
      strategy: 'parallel_execution',
      phases: [{
        name: 'Parallel Execution',
        tasks,
        workers,
        parallel: true,
        workerAssignment: this._optimizeWorkerAssignment(tasks, workerGroups)
      }],
      estimatedDuration: Math.ceil(tasks.length / workers.length) * 10,
      parallelism: 'maximum'
    };
  }
  
  /**
   * Sequential refinement strategy
   */
  private async _sequentialRefinementStrategy(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const iterations = 3;
    const phases: ExecutionPhase[] = [];
    
    for (let i = 0; i < iterations; i++) {
      phases.push({
        name: `Iteration ${i + 1}`,
        tasks: [
          `Design iteration ${i + 1}`,
          `Implement features for iteration ${i + 1}`,
          `Test iteration ${i + 1}`,
          `Review and refine iteration ${i + 1}`
        ],
        workers,
        parallel: false,
        requiresConsensus: true
      });
    }
    
    return {
      strategy: 'sequential_refinement',
      phases,
      estimatedDuration: phases.length * 20,
      parallelism: 'low',
      iterative: true
    };
  }
  
  /**
   * Consensus-driven strategy
   */
  private async _consensusDrivenStrategy(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const decisionPoints = this._identifyDecisionPoints(analysis);
    const phases: ExecutionPhase[] = [];
    
    decisionPoints.forEach((decision, _index) => {
      phases.push({
        name: `Decision Phase ${index + 1}: ${decision}`,
        tasks: [
          `Research options for ${decision}`,
          `Analyze trade-offs`,
          `Build consensus on approach`,
          `Implement chosen solution`
        ],
        workers,
        parallel: index === 0, // Only first phase in parallel
        requiresConsensus: true,
        consensusThreshold: this.config.consensusThreshold
      });
    });
    
    return {
      strategy: 'consensus_driven',
      phases,
      estimatedDuration: phases.length * 25,
      parallelism: 'medium',
      consensusRequired: true
    };
  }
  
  /**
   * Adaptive learning strategy
   */
  private async _adaptiveLearningStrategy(analysis: ObjectiveAnalysis, workers: Worker[]): Promise<ExecutionPlan> {
    const learningPhases: ExecutionPhase[] = [
      {
        name: 'Exploration Phase',
        tasks: [
          'Explore multiple approaches',
          'Experiment with different solutions',
          'Collect performance metrics'
        ],
        workers,
        parallel: true,
        learning: true
      },
      {
        name: 'Analysis Phase',
        tasks: [
          'Analyze results',
          'Identify patterns',
          'Select best approaches'
        ],
        workers: workers.filter(w => ['analyst', 'researcher'].includes(w.type)),
        parallel: false,
        learning: true
      },
      {
        name: 'Implementation Phase',
        tasks: [
          'Implement optimized solution',
          'Apply learned patterns',
          'Validate improvements'
        ],
        workers,
        parallel: true,
        applyLearning: true
      }
    ];
    
    return {
      strategy: 'adaptive_learning',
      phases: learningPhases,
      estimatedDuration: 45,
      parallelism: 'adaptive',
      learningEnabled: true
    };
  }
  
  /**
   * Generate component-specific tasks
   */
  private _generateComponentTasks(component: string): string[] {
    const taskTemplates: Record<string, string[]> = {
      backend: [
        'Design API endpoints',
        'Implement business logic',
        'Set up database models',
        'Create API tests'
      ],
      frontend: [
        'Design UI components',
        'Implement user interface',
        'Add interactivity',
        'Create UI tests'
      ],
      data: [
        'Design data schema',
        'Implement data access layer',
        'Set up caching',
        'Optimize queries'
      ],
      auth: [
        'Design authentication flow',
        'Implement auth middleware',
        'Add authorization checks',
        'Test security'
      ]
    };
    
    return taskTemplates[component] || [
      `Design ${component}`,
      `Implement ${component}`,
      `Test ${component}`
    ];
  }
  
  /**
   * Generate all tasks based on analysis
   */
  private _generateAllTasks(analysis: ObjectiveAnalysis): string[] {
    const tasks: string[] = [];
    const components = this._identifyComponents(analysis.objective);
    
    // Add general tasks
    tasks.push(
      'Analyze requirements',
      'Design architecture',
      'Set up project structure'
    );
    
    // Add component tasks
    components.forEach(component => {
      tasks.push(...this._generateComponentTasks(component));
    });
    
    // Add integration tasks
    tasks.push(
      'Integrate components',
      'Write tests',
      'Document solution'
    );
    
    return tasks;
  }
  
  /**
   * Group workers by type
   */
  private _groupWorkersByType(workers: Worker[]): Record<string, Worker[]> {
    const groups: Record<string, Worker[]> = {};
    
    workers.forEach(worker => {
      if (!groups[worker.type]) {
        groups[worker.type] = [];
      }
      groups[worker.type].push(worker);
    });
    
    return groups;
  }
  
  /**
   * Optimize worker assignment for tasks
   */
  private _optimizeWorkerAssignment(tasks: string[], workerGroups: Record<string, Worker[]>): Record<string, Worker> {
    const assignments: Record<string, Worker> = {};
    
    tasks.forEach(task => {
      const bestWorkerType = this._findBestWorkerType(task);
      const availableWorkers = workerGroups[bestWorkerType] || [];
      
      if (availableWorkers.length > 0) {
        // Round-robin assignment within type
        const workerIndex = Object.keys(assignments).filter(
          t => assignments[t].type === bestWorkerType
        ).length % availableWorkers.length;
        
        assignments[task] = availableWorkers[workerIndex];
      }
    });
    
    return assignments;
  }
  
  /**
   * Find best worker type for task
   */
  private _findBestWorkerType(task: string): string {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('research') || taskLower.includes('analyze')) {
      return 'researcher';
    }
    if (taskLower.includes('design') || taskLower.includes('architect')) {
      return 'architect';
    }
    if (taskLower.includes('implement') || taskLower.includes('code')) {
      return 'coder';
    }
    if (taskLower.includes('test') || taskLower.includes('validate')) {
      return 'tester';
    }
    if (taskLower.includes('optimize') || taskLower.includes('performance')) {
      return 'optimizer';
    }
    if (taskLower.includes('document') || taskLower.includes('write')) {
      return 'documenter';
    }
    
    return 'coder'; // Default
  }
  
  /**
   * Identify decision points in objective
   */
  private _identifyDecisionPoints(analysis: ObjectiveAnalysis): string[] {
    const decisions: string[] = [];
    const components = this._identifyComponents(analysis.objective);
    
    // Architecture decisions
    if (components.length > 2) {
      decisions.push('Architecture pattern selection');
    }
    
    // Technology decisions
    components.forEach(component => {
      decisions.push(`Technology stack for ${component}`);
    });
    
    // Implementation decisions
    if (analysis.complexity !== 'low') {
      decisions.push('Implementation approach');
    }
    
    return decisions;
  }
  
  /**
   * Make strategic decision
   */
  async makeDecision(topic: string, options: string[], workerVotes: Record<string, string> = {}): Promise<Decision> {
    const decision: Decision = {
      topic,
      options,
      workerVotes,
      queenVote: this._calculateQueenVote(topic, options, workerVotes),
      timestamp: Date.now()
    };
    
    // Calculate final decision with queen's weighted vote
    const finalDecision = this._calculateFinalDecision(decision);
    
    decision.result = finalDecision;
    this.state.decisionsCount++;
    
    // Learn from decision
    if (this.config.type === 'adaptive') {
      this._learnFromDecision(decision);
    }
    
    this.emit('decision:made', decision);
    return decision;
  }
  
  /**
   * Calculate queen's vote
   */
  private _calculateQueenVote(topic: string, options: string[], workerVotes: Record<string, string>): string {
    // Strategic queen focuses on long-term impact
    if (this.config.type === 'strategic') {
      return this._strategicVote(topic, options);
    }
    
    // Tactical queen focuses on immediate efficiency
    if (this.config.type === 'tactical') {
      return this._tacticalVote(topic, options, workerVotes);
    }
    
    // Adaptive queen learns from past decisions
    if (this.config.type === 'adaptive') {
      return this._adaptiveVote(topic, options, workerVotes);
    }
    
    return options[0]; // Default
  }
  
  /**
   * Strategic voting logic
   */
  private _strategicVote(topic: string, options: string[]): string {
    // Prefer options that mention long-term benefits
    const strategicKeywords = ['scalable', 'maintainable', 'extensible', 'future'];
    
    for (const option of options) {
      const optionLower = option.toLowerCase();
      if (strategicKeywords.some(keyword => optionLower.includes(keyword))) {
        return option;
      }
    }
    
    return options[0];
  }
  
  /**
   * Tactical voting logic
   */
  private _tacticalVote(topic: string, options: string[], workerVotes: Record<string, string>): string {
    // Follow majority if consensus is strong
    const voteCounts: Record<string, number> = {};
    Object.values(workerVotes).forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });
    
    const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0 && sorted[0][1] > Object.keys(workerVotes).length * 0.6) {
      return sorted[0][0];
    }
    
    // Otherwise, prefer quick implementation
    const tacticalKeywords = ['simple', 'quick', 'fast', 'efficient'];
    
    for (const option of options) {
      const optionLower = option.toLowerCase();
      if (tacticalKeywords.some(keyword => optionLower.includes(keyword))) {
        return option;
      }
    }
    
    return options[0];
  }
  
  /**
   * Adaptive voting logic
   */
  private _adaptiveVote(topic: string, options: string[], workerVotes: Record<string, string>): string {
    // Check if we've seen similar decisions before
    const similarDecisions = Array.from(this.state.learningData.entries())
      .filter(([key, value]) => key.includes('decision') && value.topic.includes(topic));
    
    if (similarDecisions.length > 0) {
      // Use learned preferences
      const successfulOptions = similarDecisions
        .filter(([_, decision]) => decision.success)
        .map(([_, decision]) => decision.result);
      
      for (const option of options) {
        if (successfulOptions.includes(option)) {
          return option;
        }
      }
    }
    
    // Otherwise, explore new option
    return options[Math.floor(Math.random() * options.length)];
  }
  
  /**
   * Calculate final decision with weighted votes
   */
  private _calculateFinalDecision(decision: Decision): string {
    const voteCounts: Record<string, number> = {};
    
    // Count worker votes
    Object.values(decision.workerVotes).forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });
    
    // Add queen's weighted vote
    voteCounts[decision.queenVote] = (voteCounts[decision.queenVote] || 0) + this.config.decisionWeight;
    
    // Find winner
    const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }
  
  /**
   * Learn from decision outcomes
   */
  private _learnFromDecision(decision: Decision): void {
    const key = `decision-${this.state.decisionsCount}`;
    this.state.learningData.set(key, {
      ...decision,
      success: true // Will be updated based on outcome
    });
  }
  
  /**
   * Update decision outcome
   */
  updateDecisionOutcome(decisionId: number, success: boolean, metrics: Record<string, any> = {}): void {
    const key = `decision-${decisionId}`;
    const decision = this.state.learningData.get(key);
    
    if (decision) {
      decision.success = success;
      decision.metrics = metrics;
      this.emit('learning:updated', { decisionId, success, metrics });
    }
  }
  
  /**
   * Get queen status
   */
  getStatus(): {
    type: string;
    name: string;
    status: string;
    decisionsCount: number;
    strategiesExecuted: number;
    currentStrategy: string | null;
    learningDataSize: number;
  } {
    return {
      type: this.config.type,
      name: this.config.name,
      status: this.state.status,
      decisionsCount: this.state.decisionsCount,
      strategiesExecuted: this.state.strategiesExecuted,
      currentStrategy: this.state.currentStrategy,
      learningDataSize: this.state.learningData.size
    };
  }
}