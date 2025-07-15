// SPARC Methodology Implementation
// Specification, Pseudocode, Architecture, Refinement, Completion

import { SparcSpecification } from './specification';
import { SparcPseudocode } from './pseudocode';
import { SparcArchitecture } from './architecture';
import { SparcRefinement } from './refinement';
import { SparcCompletion } from './completion';
import { SparcCoordinator } from './coordinator';
import type { SparcOptions, PhaseArtifact, QualityGate } from './phase-base';

// Type definitions for SPARC methodology
export interface SparcMethodologyOptions extends SparcOptions {
  autoRemediation?: boolean;
}

export interface PhaseStatus {
  name: string;
  completed: boolean;
  qualityGate?: QualityGate;
  artifacts?: PhaseArtifact;
}

export interface Progress {
  completed: number;
  total: number;
  percentage: number;
  currentPhase: string;
  phases: PhaseStatus[];
}

export interface Recommendation {
  type: string;
  phase?: string;
  message: string;
}

export interface ExecutionSummary {
  taskDescription: string;
  executionTime: number;
  phases: Array<{
    name: string;
    status: 'passed' | 'failed';
    artifacts: PhaseArtifact;
  }>;
  qualityGates: Record<string, QualityGate>;
  artifacts: Record<string, PhaseArtifact>;
  recommendations: Recommendation[];
}

export interface LearningData {
  phase: string;
  task: string;
  error: string;
  timestamp: string;
  context: Record<string, PhaseArtifact>;
}

// Phase interfaces (to be imported from individual phase files once converted)
interface SparcPhase {
  execute(): Promise<PhaseArtifact>;
  setRemediationContext(qualityGate: QualityGate): void;
}

export class SparcMethodology {
  private taskDescription: string;
  private options: SparcMethodologyOptions;
  private phases: Record<string, SparcPhase>;
  private coordinator: SparcCoordinator;
  private currentPhase: string;
  private phaseOrder: string[];
  private artifacts: Record<string, PhaseArtifact>;
  private qualityGates: Record<string, QualityGate>;
  private startTime?: number;

  constructor(taskDescription: string, options: Partial<SparcMethodologyOptions> = {}) {
    this.taskDescription = taskDescription;
    this.options = {
      namespace: options.namespace || 'sparc',
      swarmEnabled: options.swarmEnabled || false,
      neuralLearning: options.neuralLearning || false,
      verbose: options.verbose || false,
      autoRemediation: options.autoRemediation || false,
      ...options
    };
    
    this.phases = {
      specification: new SparcSpecification(this.taskDescription, this.options),
      pseudocode: new SparcPseudocode(this.taskDescription, this.options),
      architecture: new SparcArchitecture(this.taskDescription, this.options),
      refinement: new SparcRefinement(this.taskDescription, this.options),
      completion: new SparcCompletion(this.taskDescription, this.options)
    };
    
    this.coordinator = new SparcCoordinator(this.phases, this.options);
    this.currentPhase = 'specification';
    this.phaseOrder = ['specification', 'pseudocode', 'architecture', 'refinement', 'completion'];
    this.artifacts = {};
    this.qualityGates = {};
  }

  /**
   * Execute the complete SPARC methodology
   */
  async execute(): Promise<ExecutionSummary> {
    this.startTime = Date.now();
    
    console.log('🚀 Starting SPARC Methodology Execution');
    console.log(`📋 Task: ${this.taskDescription}`);
    console.log(`🔧 Namespace: ${this.options.namespace}`);
    console.log(`🐝 Swarm: ${this.options.swarmEnabled ? 'Enabled' : 'Disabled'}`);
    console.log();

    // Initialize swarm if enabled
    if (this.options.swarmEnabled) {
      await this.coordinator.initializeSwarm();
    }

    // Execute each phase in order
    for (const phaseName of this.phaseOrder) {
      console.log(`\n📍 Phase: ${phaseName.toUpperCase()}`);
      
      try {
        // Pre-phase coordination
        await this.coordinator.prePhase(phaseName);
        
        // Execute phase
        const phase = this.phases[phaseName];
        const result = await phase.execute();
        
        // Store artifacts
        this.artifacts[phaseName] = result;
        
        // Quality gate validation
        const qualityGate = await this.validateQualityGate(phaseName, result);
        this.qualityGates[phaseName] = qualityGate;
        
        if (!qualityGate.passed) {
          console.log(`❌ Quality Gate Failed for ${phaseName}`);
          console.log(`Reasons: ${qualityGate.reasons.join(', ')}`);
          
          // Attempt auto-remediation
          if (this.options.autoRemediation) {
            await this.autoRemediate(phaseName, qualityGate);
          } else {
            throw new Error(`Quality gate failed for phase: ${phaseName}`);
          }
        }
        
        // Post-phase coordination
        await this.coordinator.postPhase(phaseName, result);
        
        console.log(`✅ ${phaseName} completed successfully`);
        
      } catch (error) {
        console.error(`❌ Error in ${phaseName}: ${(error as Error).message}`);
        
        // Neural learning from failures
        if (this.options.neuralLearning) {
          await this.learnFromFailure(phaseName, error as Error);
        }
        
        throw error;
      }
    }

    // Final coordination and cleanup
    await this.coordinator.finalize();
    
    console.log('\n🎉 SPARC Methodology Execution Complete');
    return this.generateSummary();
  }

  /**
   * Execute a specific phase
   */
  async executePhase(phaseName: string): Promise<PhaseArtifact> {
    if (!this.phases[phaseName]) {
      throw new Error(`Unknown phase: ${phaseName}`);
    }

    console.log(`📍 Executing Phase: ${phaseName.toUpperCase()}`);
    
    const phase = this.phases[phaseName];
    const result = await phase.execute();
    
    this.artifacts[phaseName] = result;
    return result;
  }

  /**
   * Validate quality gate for a phase
   */
  async validateQualityGate(phaseName: string, result: PhaseArtifact): Promise<QualityGate> {
    const qualityGate: QualityGate = {
      passed: true,
      reasons: [],
      score: 1.0,
      timestamp: new Date()
    };

    switch (phaseName) {
      case 'specification':
        if (!result.requirements || result.requirements.length === 0) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No requirements defined');
        }
        if (!result.acceptanceCriteria || result.acceptanceCriteria.length === 0) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No acceptance criteria defined');
        }
        break;

      case 'pseudocode':
        if (!result.flowDiagram) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No flow diagram created');
        }
        if (!result.pseudocode || result.pseudocode.length < 10) {
          qualityGate.passed = false;
          qualityGate.reasons.push('Insufficient pseudocode detail');
        }
        break;

      case 'architecture':
        if (!result.components || result.components.length === 0) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No components defined');
        }
        if (!result.designPatterns || result.designPatterns.length === 0) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No design patterns specified');
        }
        break;

      case 'refinement':
        if (!result.testResults || result.testResults.passed === 0) {
          qualityGate.passed = false;
          qualityGate.reasons.push('No passing tests');
        }
        if (result.codeQuality && result.codeQuality.score < 0.8) {
          qualityGate.passed = false;
          qualityGate.reasons.push('Code quality below threshold');
        }
        break;

      case 'completion':
        if (!result.validated) {
          qualityGate.passed = false;
          qualityGate.reasons.push('Final validation failed');
        }
        if (!result.documented) {
          qualityGate.passed = false;
          qualityGate.reasons.push('Documentation incomplete');
        }
        break;
    }

    // Calculate quality score
    qualityGate.score = qualityGate.passed ? 1.0 : 0.5 - (qualityGate.reasons.length * 0.1);
    
    return qualityGate;
  }

  /**
   * Auto-remediate quality gate failures
   */
  async autoRemediate(phaseName: string, qualityGate: QualityGate): Promise<void> {
    console.log(`🔄 Attempting auto-remediation for ${phaseName}`);
    
    // Neural learning can inform remediation strategies
    if (this.options.neuralLearning) {
      await this.learnFromFailure(phaseName, new Error(`Quality gate failed: ${qualityGate.reasons.join(', ')}`));
    }

    // Re-execute the phase with enhanced context
    const phase = this.phases[phaseName];
    phase.setRemediationContext(qualityGate);
    
    const result = await phase.execute();
    this.artifacts[phaseName] = result;
    
    // Re-validate
    const newQualityGate = await this.validateQualityGate(phaseName, result);
    this.qualityGates[phaseName] = newQualityGate;
    
    if (!newQualityGate.passed) {
      throw new Error(`Auto-remediation failed for ${phaseName}: ${newQualityGate.reasons.join(', ')}`);
    }
    
    console.log(`✅ Auto-remediation successful for ${phaseName}`);
  }

  /**
   * Neural learning from failures
   */
  async learnFromFailure(phaseName: string, error: Error): Promise<void> {
    const learningData: LearningData = {
      phase: phaseName,
      task: this.taskDescription,
      error: error.message,
      timestamp: new Date().toISOString(),
      context: this.artifacts
    };

    // Store learning data for neural network training
    if (this.options.neuralLearning) {
      await this.coordinator.recordLearning(learningData);
    }
  }

  /**
   * Generate execution summary
   */
  generateSummary(): ExecutionSummary {
    const summary: ExecutionSummary = {
      taskDescription: this.taskDescription,
      executionTime: Date.now() - (this.startTime || 0),
      phases: this.phaseOrder.map(phase => ({
        name: phase,
        status: this.qualityGates[phase]?.passed ? 'passed' : 'failed',
        artifacts: this.artifacts[phase]
      })),
      qualityGates: this.qualityGates,
      artifacts: this.artifacts,
      recommendations: this.generateRecommendations()
    };

    return summary;
  }

  /**
   * Generate recommendations based on execution
   */
  generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Analyze quality gate failures
    for (const [phase, gate] of Object.entries(this.qualityGates)) {
      if (!gate.passed) {
        recommendations.push({
          type: 'quality_improvement',
          phase,
          message: `Improve ${phase} quality: ${gate.reasons.join(', ')}`
        });
      }
    }

    // Analyze artifacts for optimization opportunities
    if (this.artifacts.architecture && 
        this.artifacts.architecture.components && 
        this.artifacts.architecture.components.length > 10) {
      recommendations.push({
        type: 'architecture_optimization',
        message: 'Consider breaking down architecture into smaller, more manageable components'
      });
    }

    return recommendations;
  }

  /**
   * Get current phase status
   */
  getPhaseStatus(phaseName: string): PhaseStatus {
    return {
      name: phaseName,
      completed: !!this.artifacts[phaseName],
      qualityGate: this.qualityGates[phaseName],
      artifacts: this.artifacts[phaseName]
    };
  }

  /**
   * Get overall progress
   */
  getProgress(): Progress {
    const completedPhases = Object.keys(this.artifacts).length;
    const totalPhases = this.phaseOrder.length;
    
    return {
      completed: completedPhases,
      total: totalPhases,
      percentage: (completedPhases / totalPhases) * 100,
      currentPhase: this.currentPhase,
      phases: this.phaseOrder.map(phase => this.getPhaseStatus(phase))
    };
  }
}

export default SparcMethodology;