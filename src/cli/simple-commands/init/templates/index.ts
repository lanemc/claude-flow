// index.ts - Main entry point for all TypeScript template modules

// Re-export all template functions and types
export * from './enhanced-templates.js';
export * from './claude-md.js';
export * from './coordination-md.js';
export * from './memory-bank-md.js';

// Template registry with type safety
export interface TemplateRegistry {
  readonly enhanced: typeof import('./enhanced-templates.js');
  readonly claudeMd: typeof import('./claude-md.js');
  readonly coordination: typeof import('./coordination-md.js');
  readonly memoryBank: typeof import('./memory-bank-md.js');
}

// Template type union
export type TemplateType = 'enhanced' | 'claude-md' | 'coordination' | 'memory-bank';

// Template configuration options
export interface TemplateOptions {
  readonly type?: 'minimal' | 'full' | 'optimized' | 'sparc' | 'optimized-sparc';
  readonly batchtools?: boolean;
  readonly sparc?: boolean;
  readonly concurrent?: boolean;
}

// Main template factory function
export async function createTemplate(
  templateType: TemplateType,
  options: TemplateOptions = {}
): Promise<string> {
  switch (templateType) {
    case 'enhanced':
      const { createEnhancedClaudeMd } = await import('./enhanced-templates.js');
      return createEnhancedClaudeMd();
      
    case 'claude-md':
      const { createClaudeMdTemplate } = await import('./claude-md.js');
      const claudeMdTemplate = createClaudeMdTemplate({
        batchtools: options.batchtools,
        sparcSupport: options.sparc,
        concurrentExecution: options.concurrent
      });
      return claudeMdTemplate.content;
      
    case 'coordination':
      const { createCoordinationTemplate } = await import('./coordination-md.js');
      const coordinationTemplate = createCoordinationTemplate(
        options.type === 'optimized' ? 'optimized' : 
        options.type === 'minimal' ? 'minimal' : 'full'
      );
      return coordinationTemplate.content;
      
    case 'memory-bank':
      const { createMemoryTemplate } = await import('./memory-bank-md.js');
      const memoryTemplate = createMemoryTemplate(
        options.type === 'optimized' ? 'optimized' : 
        options.type === 'minimal' ? 'minimal' : 'full'
      );
      return memoryTemplate.content;
      
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

// Template metadata
export interface TemplateMetadata {
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly features: readonly string[];
  readonly dependencies: readonly string[];
}

// Get template metadata
export function getTemplateMetadata(templateType: TemplateType): TemplateMetadata {
  const metadata: Record<TemplateType, TemplateMetadata> = {
    enhanced: {
      name: 'Enhanced Templates',
      description: 'Comprehensive template system with fallbacks and TypeScript support',
      version: '2.0.0',
      features: ['wrapper-scripts', 'command-docs', 'settings-json', 'helper-scripts'],
      dependencies: ['fs', 'path', 'url']
    },
    'claude-md': {
      name: 'Claude MD Templates',
      description: 'CLAUDE.md configuration templates with concurrent execution patterns',
      version: '2.0.0',
      features: ['concurrent-execution', 'sparc-support', 'batchtools-optimization'],
      dependencies: []
    },
    coordination: {
      name: 'Coordination Templates',
      description: 'Agent coordination system templates with parallel processing',
      version: '2.0.0',
      features: ['agent-management', 'task-coordination', 'parallel-processing', 'batchtools'],
      dependencies: []
    },
    'memory-bank': {
      name: 'Memory Bank Templates',
      description: 'Memory system templates with concurrent operations and batching',
      version: '2.0.0',
      features: ['persistent-memory', 'parallel-access', 'batch-operations', 'performance-optimization'],
      dependencies: []
    }
  };

  return metadata[templateType];
}

// Validate template options
export function validateTemplateOptions(options: TemplateOptions): void {
  const validTypes = ['minimal', 'full', 'optimized', 'sparc', 'optimized-sparc'];
  
  if (options.type && !validTypes.includes(options.type)) {
    throw new Error(`Invalid template type: ${options.type}. Valid types: ${validTypes.join(', ')}`);
  }
  
  if (typeof options.batchtools !== 'undefined' && typeof options.batchtools !== 'boolean') {
    throw new Error('batchtools option must be a boolean');
  }
  
  if (typeof options.sparc !== 'undefined' && typeof options.sparc !== 'boolean') {
    throw new Error('sparc option must be a boolean');
  }
  
  if (typeof options.concurrent !== 'undefined' && typeof options.concurrent !== 'boolean') {
    throw new Error('concurrent option must be a boolean');
  }
}

// Get all available templates
export function getAvailableTemplates(): readonly TemplateType[] {
  return ['enhanced', 'claude-md', 'coordination', 'memory-bank'] as const;
}

// Check if a template type is valid
export function isValidTemplateType(type: string): type is TemplateType {
  const validTypes: readonly TemplateType[] = getAvailableTemplates();
  return validTypes.includes(type as TemplateType);
}