// index.ts - SPARC mode orchestration loader with TypeScript types

import { getArchitectOrchestration } from './architect.js';
import { getCodeOrchestration } from './code.js';
import { getTddOrchestration } from './tdd.js';
import { getDebugOrchestration } from './debug.js';
import { getSecurityReviewOrchestration } from './security-review.js';
import { getDocsWriterOrchestration } from './docs-writer.js';
import { getIntegrationOrchestration } from './integration.js';
import { getMonitoringOrchestration } from './monitoring.js';
import { getOptimizationOrchestration } from './optimization.js';
import { getSupabaseAdminOrchestration } from './supabase-admin.js';
import { getSpecPseudocodeOrchestration } from './spec-pseudocode.js';
import { getMcpOrchestration } from './mcp.js';
import { getDevOpsOrchestration } from './devops.js';
import { getAskOrchestration } from './ask.js';
import { getTutorialOrchestration } from './tutorial.js';
import { getSparcOrchestratorOrchestration } from './sparc-orchestrator.js';
import { getGenericOrchestration } from './generic.js';
import { getSwarmOrchestration } from './swarm.js';

/**
 * Orchestration function type
 */
export type OrchestrationFunction = (
  taskDescription: string,
  memoryNamespace: string
) => string;

/**
 * SPARC mode configuration interface
 */
export interface SparcModeConfig {
  slug: string;
  name: string;
  roleDefinition: string;
  customInstructions: string;
  orchestrationFunction?: OrchestrationFunction;
  category?: string;
  priority?: number;
  tags?: string[];
  dependencies?: string[];
}

/**
 * Orchestration context for SPARC prompts
 */
export interface OrchestrationContext {
  workingDirectory: string;
  taskDescription: string;
  memoryNamespace: string;
  mode: SparcModeConfig;
  timestamp: string;
  sessionId?: string;
}

/**
 * SPARC prompt configuration
 */
export interface SparcPromptConfig {
  includeWorkingDirectory: boolean;
  includeMemoryIntegration: boolean;
  includeBatchToolInstructions: boolean;
  includeQualityGuidelines: boolean;
  customSections?: string[];
}

// Mode orchestration mapping
const modeOrchestrations: Record<string, OrchestrationFunction> = {
  'architect': getArchitectOrchestration,
  'code': getCodeOrchestration,
  'tdd': getTddOrchestration,
  'debug': getDebugOrchestration,
  'security-review': getSecurityReviewOrchestration,
  'docs-writer': getDocsWriterOrchestration,
  'integration': getIntegrationOrchestration,
  'post-deployment-monitoring-mode': getMonitoringOrchestration,
  'refinement-optimization-mode': getOptimizationOrchestration,
  'supabase-admin': getSupabaseAdminOrchestration,
  'spec-pseudocode': getSpecPseudocodeOrchestration,
  'mcp': getMcpOrchestration,
  'devops': getDevOpsOrchestration,
  'ask': getAskOrchestration,
  'tutorial': getTutorialOrchestration,
  'sparc': getSparcOrchestratorOrchestration,
  'swarm': getSwarmOrchestration,
};

/**
 * Get orchestration template for a specific mode
 * @param modeSlug The mode slug identifier
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @returns The orchestration template
 */
export function getModeOrchestration(
  modeSlug: string,
  taskDescription: string,
  memoryNamespace: string
): string {
  const orchestrationFunction = modeOrchestrations[modeSlug];
  
  if (orchestrationFunction) {
    return orchestrationFunction(taskDescription, memoryNamespace);
  }
  
  // Return generic orchestration for unknown modes
  return getGenericOrchestration(taskDescription, memoryNamespace);
}

/**
 * Check if a mode has a specific orchestration function
 * @param modeSlug The mode slug to check
 * @returns True if the mode has a specific orchestration function
 */
export function hasModeOrchestration(modeSlug: string): boolean {
  return modeSlug in modeOrchestrations;
}

/**
 * Get all available mode slugs with orchestration functions
 * @returns Array of mode slugs
 */
export function getAvailableModeSlugs(): string[] {
  return Object.keys(modeOrchestrations);
}

/**
 * Get the base SPARC prompt template
 * @param mode The mode configuration
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @param config Optional prompt configuration
 * @returns The complete SPARC prompt
 */
export function createSparcPrompt(
  mode: SparcModeConfig,
  taskDescription: string,
  memoryNamespace: string,
  config?: Partial<SparcPromptConfig>
): string {
  const defaultConfig: SparcPromptConfig = {
    includeWorkingDirectory: true,
    includeMemoryIntegration: true,
    includeBatchToolInstructions: true,
    includeQualityGuidelines: true,
    customSections: []
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  const orchestration = getModeOrchestration(mode.slug, taskDescription, memoryNamespace);
  
  // Get the actual working directory where the command was run from
  // Note: In a proper TypeScript environment, we'd use proper imports
  // This maintains compatibility with the existing Deno-based system
  const cwd = typeof Deno !== 'undefined' 
    ? (Deno.env.get('PWD') || Deno.cwd())
    : process.cwd();
  
  let prompt = `# ${mode.name} - Task Execution

## 🎯 Your Mission
Build exactly what the user requested: "${taskDescription}"
`;
  
  // Working directory section
  if (finalConfig.includeWorkingDirectory) {
    prompt += `
## 📁 IMPORTANT: Project Directory
**Current Working Directory:** ${cwd}

⚠️ **CRITICAL INSTRUCTIONS:**
- Create ALL project files in the current working directory: ${cwd}
- NEVER create files in node_modules/ or any claude-flow directories
- If the task specifies a project name (e.g., "hello-world"), create it as a subdirectory in ${cwd}
- Use paths relative to ${cwd} for all file operations
- Example: If creating "hello-world" app, use ${cwd}/hello-world/
`;
  }
  
  // Role definition
  prompt += `
## 🚀 Your Role
${mode.roleDefinition}

${orchestration}

## 📋 Mode-Specific Guidelines
${mode.customInstructions}
`;
  
  // Memory integration section
  if (finalConfig.includeMemoryIntegration) {
    prompt += generateMemoryIntegrationSection(memoryNamespace);
  }
  
  // BatchTool instructions section
  if (finalConfig.includeBatchToolInstructions) {
    prompt += generateBatchToolInstructionsSection();
  }
  
  // Quality guidelines section
  if (finalConfig.includeQualityGuidelines) {
    prompt += generateQualityGuidelinesSection(cwd, taskDescription);
  }
  
  // Custom sections
  if (finalConfig.customSections && finalConfig.customSections.length > 0) {
    prompt += `\n\n## Additional Instructions\n${finalConfig.customSections.join('\n\n')}`;
  }
  
  // Final execution section
  prompt += `

## 🏁 Start Execution

Begin with Step 1 of the orchestration plan above. Focus on delivering exactly what was requested: "${taskDescription}"

Remember: You're building the user's project, using claude-flow only for memory and orchestration support.`;
  
  return prompt;
}

/**
 * Generate memory integration section
 * @param memoryNamespace The memory namespace
 * @returns Formatted memory integration section
 */
function generateMemoryIntegrationSection(memoryNamespace: string): string {
  return `

## 🛐️ Claude-Flow Integration

### Memory Operations
Use the memory system to track your progress and share context:

\`\`\`bash
# Store your work
npx claude-flow memory store ${memoryNamespace}_<phase> "description of work completed"

# Query previous work
npx claude-flow memory query ${memoryNamespace}

# Examples for this task
npx claude-flow memory store ${memoryNamespace}_analysis "Analyzed task - found X components needed"
npx claude-flow memory store ${memoryNamespace}_progress "Completed Y% of implementation"
npx claude-flow memory store ${memoryNamespace}_blockers "Issue with Z - need clarification"
\`\`\`

### Task Orchestration
For complex tasks, coordinate with other specialists:

\`\`\`bash
# Check system status
npx claude-flow status

# View active agents (if --parallel was used)
npx claude-flow agent list

# Monitor progress
npx claude-flow monitor
\`\`\``;
}

/**
 * Generate BatchTool instructions section
 * @returns Formatted BatchTool instructions section
 */
function generateBatchToolInstructionsSection(): string {
  return `

### 🚀 Parallel Execution with BatchTool
Use BatchTool to orchestrate multiple SPARC modes concurrently in a boomerang pattern:

\`\`\`bash
# Example: Parallel development workflow
batchtool run --parallel \\\\
  "npx claude-flow sparc run architect 'design user authentication system' --non-interactive" \\\\
  "npx claude-flow sparc run security-review 'analyze authentication requirements' --non-interactive" \\\\
  "npx claude-flow sparc run spec-pseudocode 'create auth flow pseudocode' --non-interactive"

# Boomerang Pattern: Research → Design → Implement → Test → Refine
batchtool orchestrate --boomerang \\\\
  --phase1 "npx claude-flow sparc run ask 'research best auth practices' --non-interactive" \\\\
  --phase2 "npx claude-flow sparc run architect 'design based on research' --non-interactive" \\\\
  --phase3 "npx claude-flow sparc run code 'implement auth system' --non-interactive" \\\\
  --phase4 "npx claude-flow sparc run tdd 'test auth implementation' --non-interactive" \\\\
  --phase5 "npx claude-flow sparc run optimization 'refine auth performance' --non-interactive"

# Concurrent Feature Development
batchtool run --concurrent --max-parallel 3 \\\\
  "npx claude-flow sparc run code 'implement login feature' --non-interactive" \\\\
  "npx claude-flow sparc run code 'implement registration feature' --non-interactive" \\\\
  "npx claude-flow sparc run code 'implement password reset' --non-interactive" \\\\
  "npx claude-flow sparc run tdd 'create auth test suite' --non-interactive"
\`\`\`

#### Boomerang Orchestration Pattern
The boomerang pattern allows for iterative development where results from one phase inform the next:
1. **Research Phase**: Gather requirements and best practices
2. **Design Phase**: Create architecture based on research
3. **Implementation Phase**: Build according to design
4. **Testing Phase**: Validate implementation
5. **Refinement Phase**: Optimize based on test results
6. **Loop Back**: Results feed back to improve the cycle

Benefits of --non-interactive mode with BatchTool:
- No manual intervention required
- Parallel execution of independent tasks
- Automatic result collection and aggregation
- Progress tracking across all concurrent operations
- Efficient resource utilization`;
}

/**
 * Generate quality guidelines section
 * @param cwd Current working directory
 * @param taskDescription Task description
 * @returns Formatted quality guidelines section
 */
function generateQualityGuidelinesSection(cwd: string, taskDescription: string): string {
  return `

## ⚡ Execution Guidelines

1. **Focus on User's Project**
   - Build what they asked for, not improvements to claude-flow
   - Create files ONLY in the current working directory: ${cwd}
   - NEVER create files in node_modules/ or system directories
   - If creating a named project, make it a subdirectory of ${cwd}
   - Use appropriate project structure relative to ${cwd}

2. **Directory Rules**
   - Current directory: ${cwd}
   - Create new projects as: ${cwd}/<project-name>/
   - Use relative paths from ${cwd} for all operations
   - Verify you're in the correct directory before creating files

3. **Quality Standards**
   - Keep all files under 500 lines
   - Never hardcode secrets or credentials
   - Use environment variables and config files
   - Write clean, maintainable code

4. **Communication**
   - Store progress updates in memory
   - Document key decisions
   - Ask for clarification if needed
   - Provide clear status updates`;
}

/**
 * Create orchestration context
 * @param mode The SPARC mode
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @param sessionId Optional session ID
 * @returns Orchestration context object
 */
export function createOrchestrationContext(
  mode: SparcModeConfig,
  taskDescription: string,
  memoryNamespace: string,
  sessionId?: string
): OrchestrationContext {
  const cwd = typeof Deno !== 'undefined' 
    ? (Deno.env.get('PWD') || Deno.cwd())
    : process.cwd();
    
  return {
    workingDirectory: cwd,
    taskDescription,
    memoryNamespace,
    mode,
    timestamp: new Date().toISOString(),
    sessionId
  };
}

/**
 * Validate SPARC mode configuration
 * @param mode The mode configuration to validate
 * @returns Validation result with errors and warnings
 */
export function validateSparcModeConfig(mode: SparcModeConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!mode.slug || typeof mode.slug !== 'string') {
    errors.push('Mode slug is required and must be a string');
  } else if (!/^[a-z0-9-]+$/.test(mode.slug)) {
    errors.push('Mode slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!mode.name || typeof mode.name !== 'string') {
    errors.push('Mode name is required and must be a string');
  }
  
  if (!mode.roleDefinition || typeof mode.roleDefinition !== 'string') {
    errors.push('Mode roleDefinition is required and must be a string');
  } else if (mode.roleDefinition.length < 10) {
    warnings.push('Role definition seems very short');
  }
  
  if (!mode.customInstructions || typeof mode.customInstructions !== 'string') {
    errors.push('Mode customInstructions is required and must be a string');
  }
  
  // Optional fields validation
  if (mode.priority !== undefined && (typeof mode.priority !== 'number' || mode.priority < 0)) {
    errors.push('Mode priority must be a non-negative number if provided');
  }
  
  if (mode.tags && !Array.isArray(mode.tags)) {
    errors.push('Mode tags must be an array if provided');
  }
  
  if (mode.dependencies && !Array.isArray(mode.dependencies)) {
    errors.push('Mode dependencies must be an array if provided');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
