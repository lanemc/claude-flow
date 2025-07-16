// Base class for SPARC phases - TypeScript version
// Provides common functionality for all phases

import type { SparcOptions, PhaseResult } from './types';

export interface Artifact {
  filename: string;
  path: string;
  timestamp: number;
}

export interface PhaseMetrics {
  phaseName: string;
  duration: number | null;
  artifactsCount: number;
  memoryKeys: number;
  hasSwarmContext: boolean;
  hasRemediationContext: boolean;
}

export interface PhaseStatus {
  phase: string;
  started: boolean;
  completed: boolean;
  duration: number | null;
  artifacts: number;
  hasContext: boolean;
  hasRemediation: boolean;
}

export interface LearningData {
  success: boolean;
  duration?: number;
  errors?: string[];
  qualityGate?: {
    passed: boolean;
    reasons?: string[];
  };
  [key: string]: any;
}

export interface LearningRecord {
  phase: string;
  timestamp: number;
  data: LearningData;
  context: {
    task: string;
    options: SparcOptions;
    metrics: PhaseMetrics;
  };
}

export interface LearningInsight {
  timestamp: number;
  insight: string;
  confidence: number;
}

export interface QualityGate {
  passed: boolean;
  reasons: string[];
}

export interface ValidationResult {
  valid: boolean;
  reasons: string[];
}

export class SparcPhase {
  protected phaseName: string;
  protected taskDescription: string;
  protected options: SparcOptions;
  protected startTime: number | null = null;
  protected endTime: number | null = null;
  protected artifacts: Artifact[] = [];
  protected memory: Record<string, any> = {};
  protected swarmContext: any = null;
  protected remediationContext: QualityGate | null = null;

  constructor(phaseName: string, taskDescription: string, options: SparcOptions = {}) {
    this.phaseName = phaseName;
    this.taskDescription = taskDescription;
    this.options = options;
  }

  /**
   * Initialize phase execution
   */
  protected async initializePhase(): Promise<void> {
    this.startTime = Date.now();
    console.log(`🚀 Initializing ${this.phaseName} phase`);
    
    // Load previous context from memory
    if (this.options.swarmEnabled) {
      await this.loadSwarmContext();
    }
    
    // Store phase start in memory
    await this.storeInMemory(`${this.phaseName}_started`, {
      timestamp: this.startTime,
      taskDescription: this.taskDescription
    });
  }

  /**
   * Finalize phase execution
   */
  protected async finalizePhase(): Promise<void> {
    this.endTime = Date.now();
    const duration = this.endTime - (this.startTime || 0);
    
    console.log(`✅ ${this.phaseName} phase completed in ${duration}ms`);
    
    // Store phase completion in memory
    await this.storeInMemory(`${this.phaseName}_completed`, {
      timestamp: this.endTime,
      duration: duration,
      artifacts: this.artifacts
    });
    
    // Update swarm context if enabled
    if (this.options.swarmEnabled) {
      await this.updateSwarmContext();
    }
  }

  /**
   * Store data in memory system
   */
  protected async storeInMemory(key: string, data: any): Promise<void> {
    try {
      const memoryKey = `${this.options.namespace || 'default'}_${key}`;
      const memoryData = JSON.stringify(data);
      
      // Store in local memory
      this.memory[key] = data;
      
      // Store in swarm memory if enabled
      if (this.options.swarmEnabled) {
        await this.storeInSwarmMemory(memoryKey, memoryData);
      }
      
      console.log(`💾 Stored in memory: ${memoryKey}`);
    } catch (error) {
      console.warn(`⚠️ Failed to store in memory: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieve data from memory system
   */
  protected async retrieveFromMemory(key: string): Promise<any> {
    try {
      const memoryKey = `${this.options.namespace || 'default'}_${key}`;
      
      // Try local memory first
      if (this.memory[key]) {
        return this.memory[key];
      }
      
      // Try swarm memory if enabled
      if (this.options.swarmEnabled) {
        return await this.retrieveFromSwarmMemory(memoryKey);
      }
      
      return null;
    } catch (error) {
      console.warn(`⚠️ Failed to retrieve from memory: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Store data in swarm memory
   */
  private async storeInSwarmMemory(key: string, data: string): Promise<void> {
    if (!this.options.swarmEnabled) return;
    
    try {
      // Use ruv-swarm memory hooks
      const { spawn } = await import('child_process');
      
      return new Promise<void>((resolve, reject) => {
        const process = spawn('npx', ['ruv-swarm', 'hook', 'memory-store', '--key', key, '--data', data], {
          stdio: 'pipe'
        });
        
        let output = '';
        process.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        process.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Memory store failed with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.warn(`⚠️ Failed to store in swarm memory: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieve data from swarm memory
   */
  private async retrieveFromSwarmMemory(key: string): Promise<any> {
    if (!this.options.swarmEnabled) return null;
    
    try {
      const { spawn } = await import('child_process');
      
      return new Promise<any>((resolve) => {
        const process = spawn('npx', ['ruv-swarm', 'hook', 'memory-retrieve', '--key', key], {
          stdio: 'pipe'
        });
        
        let output = '';
        process.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        process.on('close', (code) => {
          if (code === 0) {
            try {
              const data = JSON.parse(output);
              resolve(data);
            } catch (parseError) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.warn(`⚠️ Failed to retrieve from swarm memory: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Load swarm context
   */
  private async loadSwarmContext(): Promise<void> {
    try {
      this.swarmContext = await this.retrieveFromSwarmMemory(`${this.options.namespace || 'default'}_swarm_context`);
      if (this.swarmContext) {
        console.log(`🐝 Loaded swarm context for ${this.phaseName}`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to load swarm context: ${(error as Error).message}`);
    }
  }

  /**
   * Update swarm context
   */
  private async updateSwarmContext(): Promise<void> {
    try {
      const contextUpdate = {
        phase: this.phaseName,
        timestamp: Date.now(),
        artifacts: this.artifacts,
        memory: this.memory,
        status: 'completed'
      };
      
      await this.storeInSwarmMemory(`${this.options.namespace || 'default'}_swarm_context`, JSON.stringify(contextUpdate));
      console.log(`🐝 Updated swarm context for ${this.phaseName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to update swarm context: ${(error as Error).message}`);
    }
  }

  /**
   * Save artifact to file system
   */
  protected async saveArtifact(filename: string, content: string): Promise<string | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const artifactDir = path.join(process.cwd(), 'sparc-artifacts', this.options.namespace || 'default');
      await fs.mkdir(artifactDir, { recursive: true });
      
      const filePath = path.join(artifactDir, filename);
      await fs.writeFile(filePath, content, 'utf8');
      
      this.artifacts.push({
        filename,
        path: filePath,
        timestamp: Date.now()
      });
      
      console.log(`📄 Saved artifact: ${filename}`);
      return filePath;
    } catch (error) {
      console.warn(`⚠️ Failed to save artifact: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Load artifact from file system
   */
  protected async loadArtifact(filename: string): Promise<string | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const artifactDir = path.join(process.cwd(), 'sparc-artifacts', this.options.namespace || 'default');
      const filePath = path.join(artifactDir, filename);
      
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.warn(`⚠️ Failed to load artifact: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Set remediation context for quality gate failures
   */
  public setRemediationContext(qualityGate: QualityGate): void {
    this.remediationContext = qualityGate;
    console.log(`🔧 Set remediation context for ${this.phaseName}: ${qualityGate.reasons.join(', ')}`);
  }

  /**
   * Get phase metrics
   */
  public getMetrics(): PhaseMetrics {
    return {
      phaseName: this.phaseName,
      duration: this.endTime && this.startTime ? this.endTime - this.startTime : null,
      artifactsCount: this.artifacts.length,
      memoryKeys: Object.keys(this.memory).length,
      hasSwarmContext: !!this.swarmContext,
      hasRemediationContext: !!this.remediationContext
    };
  }

  /**
   * Validate phase prerequisites
   */
  public async validatePrerequisites(): Promise<ValidationResult> {
    // Base validation - override in subclasses
    return { valid: true, reasons: [] };
  }

  /**
   * Execute phase - must be implemented by subclasses
   */
  public async execute(): Promise<PhaseResult> {
    throw new Error(`Execute method must be implemented by ${this.phaseName} phase`);
  }

  /**
   * Get phase status
   */
  public getStatus(): PhaseStatus {
    return {
      phase: this.phaseName,
      started: !!this.startTime,
      completed: !!this.endTime,
      duration: this.endTime && this.startTime ? this.endTime - this.startTime : null,
      artifacts: this.artifacts.length,
      hasContext: !!this.swarmContext,
      hasRemediation: !!this.remediationContext
    };
  }

  /**
   * Neural learning hook
   */
  protected async recordLearning(learningData: LearningData): Promise<void> {
    if (!this.options.neuralLearning) return;
    
    try {
      const learningRecord: LearningRecord = {
        phase: this.phaseName,
        timestamp: Date.now(),
        data: learningData,
        context: {
          task: this.taskDescription,
          options: this.options,
          metrics: this.getMetrics()
        }
      };
      
      await this.storeInMemory(`learning_${Date.now()}`, learningRecord);
      
      // Store in neural learning system if available
      if (this.options.swarmEnabled) {
        await this.storeInSwarmMemory(`neural_learning_${this.phaseName}`, JSON.stringify(learningRecord));
      }
      
      console.log(`🧠 Recorded learning for ${this.phaseName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to record learning: ${(error as Error).message}`);
    }
  }

  /**
   * Get learning insights
   */
  protected async getLearningInsights(): Promise<LearningInsight[]> {
    if (!this.options.neuralLearning) return [];
    
    try {
      const insights: LearningInsight[] = [];
      
      // Analyze previous executions
      const learningKeys = Object.keys(this.memory).filter(key => key.startsWith('learning_'));
      
      for (const key of learningKeys) {
        const record = this.memory[key] as LearningRecord;
        if (record && record.phase === this.phaseName) {
          insights.push({
            timestamp: record.timestamp,
            insight: this.generateInsight(record),
            confidence: this.calculateConfidence(record)
          });
        }
      }
      
      return insights;
    } catch (error) {
      console.warn(`⚠️ Failed to get learning insights: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Generate insight from learning record
   */
  private generateInsight(record: LearningRecord): string {
    // Basic insight generation - can be enhanced with ML
    const patterns = this.identifyPatterns(record);
    return `Pattern identified: ${patterns.join(', ')}`;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(record: LearningRecord): number {
    // Simple confidence calculation based on recency and success
    const age = Date.now() - record.timestamp;
    const recencyScore = Math.max(0, 1 - age / (24 * 60 * 60 * 1000)); // Decay over 24 hours
    const successScore = record.data.success ? 1 : 0.5;
    
    return (recencyScore + successScore) / 2;
  }

  /**
   * Identify patterns in learning data
   */
  private identifyPatterns(record: LearningRecord): string[] {
    const patterns: string[] = [];
    
    if (record.data.duration !== undefined) {
      if (record.data.duration > 60000) {
        patterns.push('Long execution time');
      } else if (record.data.duration < 10000) {
        patterns.push('Fast execution');
      }
    }
    
    if (record.data.errors && record.data.errors.length > 0) {
      patterns.push('Error prone');
    }
    
    if (record.data.qualityGate && !record.data.qualityGate.passed) {
      patterns.push('Quality gate failures');
    }
    
    return patterns;
  }
}

export default SparcPhase;