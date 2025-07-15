// Base class for SPARC phases
// Provides common functionality for all phases

import { ChildProcess, spawn } from 'child_process';

export interface SparcOptions {
  namespace?: string;
  swarmEnabled?: boolean;
  neuralLearning?: boolean;
  verbose?: boolean;
  taskDescription?: string;
  parallelExecution?: boolean;
  autoRemediation?: boolean;
  [key: string]: unknown;
}

export interface PhaseArtifact {
  filename: string;
  path: string;
  timestamp: number;
}

export interface QualityGate {
  passed: boolean;
  reasons: string[];
  [key: string]: unknown;
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

export interface LearningRecord {
  phase: string;
  timestamp: number;
  data: Record<string, unknown>;
  context: {
    task: string;
    options: SparcOptions;
    metrics: PhaseMetrics;
  };
  [key: string]: unknown;
}

export interface LearningInsight {
  timestamp: number;
  insight: string;
  confidence: number;
}

export class SparcPhase {
  protected phaseName: string;
  protected taskDescription: string;
  protected options: SparcOptions;
  protected startTime: number | null;
  protected endTime: number | null;
  protected artifacts: PhaseArtifact[];
  protected memory: Record<string, unknown>;
  protected swarmContext: unknown;
  protected remediationContext: QualityGate | null;

  constructor(phaseName: string, taskDescription: string, options: SparcOptions = {}) {
    this.phaseName = phaseName;
    this.taskDescription = taskDescription;
    this.options = options;
    this.startTime = null;
    this.endTime = null;
    this.artifacts = [];
    this.memory = {};
    this.swarmContext = null;
    this.remediationContext = null;
  }

  /**
   * Initialize phase execution
   */
  async initializePhase(): Promise<void> {
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
  async finalizePhase(): Promise<void> {
    this.endTime = Date.now();
    const duration = this.endTime - (this.startTime || 0);
    
    console.log(`✅ ${this.phaseName} phase completed in ${duration}ms`);
    
    // Store phase completion in memory
    await this.storeInMemory(`${this.phaseName}_completed`, {
      timestamp: this.endTime,
      duration,
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
  async storeInMemory(key: string, data: Record<string, unknown>): Promise<void> {
    try {
      const memoryKey = `${this.options.namespace}_${key}`;
      const memoryData = JSON.stringify(data);
      
      // Store in local memory
      this.memory[key] = data;
      
      // Store in swarm memory if enabled
      if (this.options.swarmEnabled) {
        await this.storeInSwarmMemory(memoryKey, memoryData);
      }
      
      console.log(`💾 Stored in memory: ${memoryKey}`);
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to store in memory: ${(_error as Error).message}`);
    }
  }

  /**
   * Retrieve data from memory system
   */
  async retrieveFromMemory(key: string): Promise<unknown> {
    try {
      const memoryKey = `${this.options.namespace}_${key}`;
      
      // Try local memory first
      if (this.memory[key]) {
        return this.memory[key];
      }
      
      // Try swarm memory if enabled
      if (this.options.swarmEnabled) {
        return await this.retrieveFromSwarmMemory(memoryKey);
      }
      
      return null;
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to retrieve from memory: ${(_error as Error).message}`);
      return null;
    }
  }

  /**
   * Store data in swarm memory
   */
  async storeInSwarmMemory(key: string, data: string): Promise<void> {
    if (!this.options.swarmEnabled) return;
    
    try {
      return new Promise((resolve, reject) => {
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
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to store in swarm memory: ${(_error as Error).message}`);
    }
  }

  /**
   * Retrieve data from swarm memory
   */
  async retrieveFromSwarmMemory(key: string): Promise<unknown> {
    if (!this.options.swarmEnabled) return null;
    
    try {
      return new Promise((resolve, reject) => {
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
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to retrieve from swarm memory: ${(_error as Error).message}`);
      return null;
    }
  }

  /**
   * Load swarm context
   */
  async loadSwarmContext(): Promise<void> {
    try {
      this.swarmContext = await this.retrieveFromSwarmMemory(`${this.options.namespace}_swarm_context`);
      if (this.swarmContext) {
        console.log(`🐝 Loaded swarm context for ${this.phaseName}`);
      }
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to load swarm context: ${(_error as Error).message}`);
    }
  }

  /**
   * Update swarm context
   */
  async updateSwarmContext(): Promise<void> {
    try {
      const contextUpdate = {
        phase: this.phaseName,
        timestamp: Date.now(),
        artifacts: this.artifacts,
        memory: this.memory,
        status: 'completed'
      };
      
      await this.storeInSwarmMemory(`${this.options.namespace}_swarm_context`, JSON.stringify(contextUpdate));
      console.log(`🐝 Updated swarm context for ${this.phaseName}`);
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to update swarm context: ${(_error as Error).message}`);
    }
  }

  /**
   * Save artifact to file system
   */
  async saveArtifact(filename: string, content: string): Promise<string | null> {
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
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to save artifact: ${(_error as Error).message}`);
      return null;
    }
  }

  /**
   * Load artifact from file system
   */
  async loadArtifact(filename: string): Promise<string | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const artifactDir = path.join(process.cwd(), 'sparc-artifacts', this.options.namespace || 'default');
      const filePath = path.join(artifactDir, filename);
      
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to load artifact: ${(_error as Error).message}`);
      return null;
    }
  }

  /**
   * Set remediation context for quality gate failures
   */
  setRemediationContext(qualityGate: QualityGate): void {
    this.remediationContext = qualityGate;
    console.log(`🔧 Set remediation context for ${this.phaseName}: ${qualityGate.reasons.join(', ')}`);
  }

  /**
   * Get phase metrics
   */
  getMetrics(): PhaseMetrics {
    return {
      phaseName: this.phaseName,
      duration: this.endTime ? this.endTime - (this.startTime || 0) : null,
      artifactsCount: this.artifacts.length,
      memoryKeys: Object.keys(this.memory).length,
      hasSwarmContext: !!this.swarmContext,
      hasRemediationContext: !!this.remediationContext
    };
  }

  /**
   * Validate phase prerequisites
   */
  async validatePrerequisites(): Promise<{ valid: boolean; reasons: string[] }> {
    // Base validation - override in subclasses
    return { valid: true, reasons: [] };
  }

  /**
   * Execute phase - must be implemented by subclasses
   */
  async execute(): Promise<unknown> {
    throw new Error(`Execute method must be implemented by ${this.phaseName} phase`);
  }

  /**
   * Get phase status
   */
  getStatus(): PhaseStatus {
    return {
      phase: this.phaseName,
      started: !!this.startTime,
      completed: !!this.endTime,
      duration: this.endTime ? this.endTime - (this.startTime || 0) : null,
      artifacts: this.artifacts.length,
      hasContext: !!this.swarmContext,
      hasRemediation: !!this.remediationContext
    };
  }

  /**
   * Neural learning hook
   */
  async recordLearning(learningData: unknown): Promise<void> {
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
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to record learning: ${(_error as Error).message}`);
    }
  }

  /**
   * Get learning insights
   */
  async getLearningInsights(): Promise<LearningInsight[]> {
    if (!this.options.neuralLearning) return [];
    
    try {
      const insights: LearningInsight[] = [];
      
      // Analyze previous executions
      const learningKeys = Object.keys(this.memory).filter(key => key.startsWith('learning_'));
      
      for (const key of learningKeys) {
        const record = this.memory[key];
        if (record && record.phase === this.phaseName) {
          insights.push({
            timestamp: record.timestamp,
            insight: this.generateInsight(record),
            confidence: this.calculateConfidence(record)
          });
        }
      }
      
      return insights;
    } catch (_error: Error | unknown) {
      console.warn(`⚠️ Failed to get learning insights: ${(_error as Error).message}`);
      return [];
    }
  }

  /**
   * Generate insight from learning record
   */
  protected generateInsight(record: LearningRecord): string {
    // Basic insight generation - can be enhanced with ML
    const patterns = this.identifyPatterns(record);
    return `Pattern identified: ${patterns.join(', ')}`;
  }

  /**
   * Calculate confidence score
   */
  protected calculateConfidence(record: LearningRecord): number {
    // Simple confidence calculation based on recency and success
    const age = Date.now() - record.timestamp;
    const recencyScore = Math.max(0, 1 - age / (24 * 60 * 60 * 1000)); // Decay over 24 hours
    const successScore = record.data.success ? 1 : 0.5;
    
    return (recencyScore + successScore) / 2;
  }

  /**
   * Identify patterns in learning data
   */
  protected identifyPatterns(record: LearningRecord): string[] {
    const patterns: string[] = [];
    
    if (record.data.duration) {
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