// sparc-commands.ts - SPARC-specific slash commands with TypeScript types

/**
 * SPARC mode configuration interface
 */
export interface SparcMode {
  slug: string;
  name: string;
  roleDefinition: string;
  customInstructions: string;
  groups?: SparcToolGroup[];
  description?: string;
  category?: string;
  priority?: number;
}

/**
 * Tool group configuration for SPARC modes
 */
export type SparcToolGroup = string | [string, SparcToolConfig?];

/**
 * Tool configuration interface
 */
export interface SparcToolConfig {
  description?: string;
  fileRegex?: string;
  enabled?: boolean;
  options?: Record<string, any>;
}

/**
 * Slash command configuration
 */
export interface SlashCommandConfig {
  name: string;
  description: string;
  content: string;
  metadata?: {
    mode?: string;
    category?: string;
    tags?: string[];
  };
}

/**
 * Example task configuration
 */
export interface ExampleTaskConfig {
  [modeSlug: string]: string;
}

/**
 * Tool description mapping
 */
export interface ToolDescriptionMap {
  [toolName: string]: string;
}

// Create SPARC mode slash command
export function createSparcSlashCommand(mode: SparcMode): string {
  // Extract the full description without truncation
  const fullDescription = mode.roleDefinition.length > 100 
    ? `${mode.roleDefinition.substring(0, 97)}...` 
    : mode.roleDefinition;

  return `---
name: sparc-${mode.slug}
description: ${mode.name} - ${fullDescription}
---

# ${mode.name}

## Role Definition
${mode.roleDefinition}

## Custom Instructions
${mode.customInstructions}

## Available Tools
${formatToolGroups(mode.groups)}

## Usage

To use this SPARC mode, you can:

1. **Run directly**: \`./claude-flow sparc run ${mode.slug} "your task"\`
2. **TDD shorthand** (if applicable): \`./claude-flow sparc ${mode.slug} "your task"\`
3. **Use in workflow**: Include \`${mode.slug}\` in your SPARC workflow
4. **Delegate tasks**: Use \`new_task\` to assign work to this mode

## Example Commands

\`\`\`bash
# Run this specific mode
./claude-flow sparc run ${mode.slug} "${getExampleTask(mode.slug)}"

# Use with memory namespace
./claude-flow sparc run ${mode.slug} "your task" --namespace ${mode.slug}

# Non-interactive mode for automation
./claude-flow sparc run ${mode.slug} "your task" --non-interactive
\`\`\`

## Memory Integration

\`\`\`bash
# Store mode-specific context
./claude-flow memory store "${mode.slug}_context" "important decisions" --namespace ${mode.slug}

# Query previous work
./claude-flow memory query "${mode.slug}" --limit 5
\`\`\`
`;
}

/**
 * Format tool groups for display in slash commands
 * @param groups Array of tool groups
 * @returns Formatted string representation
 */
function formatToolGroups(groups?: SparcToolGroup[]): string {
  if (!Array.isArray(groups) || groups.length === 0) {
    return 'None';
  }
  
  return groups.map(group => {
    if (typeof group === 'string') {
      return `- **${group}**: ${getToolDescription(group)}`;
    } else if (Array.isArray(group)) {
      const [toolName, config] = group;
      const description = config?.description || getToolDescription(toolName);
      const fileRegex = config?.fileRegex ? ` (Files matching: ${config.fileRegex})` : '';
      return `- **${toolName}**: ${description}${fileRegex}`;
    }
    return `- ${JSON.stringify(group)}`;
  }).join('\n');
}

// Helper function to get tool descriptions
function getToolDescription(tool: string): string {
  const toolDescriptions: ToolDescriptionMap = {
    'read': 'File reading and viewing',
    'edit': 'File modification and creation',
    'browser': 'Web browsing capabilities',
    'mcp': 'Model Context Protocol tools',
    'command': 'Command execution',
    'bash': 'Shell command execution',
    'write': 'File writing operations',
    'search': 'File and content search',
    'memory': 'Memory storage and retrieval',
    'git': 'Git version control operations',
    'npm': 'Node.js package management',
    'test': 'Testing and validation tools',
    'debug': 'Debugging and troubleshooting',
    'deploy': 'Deployment and infrastructure',
    'monitor': 'Monitoring and observability'
  };
  return toolDescriptions[tool] || 'Tool access';
}

// Helper function to get example tasks
function getExampleTask(slug: string): string {
  const examples: ExampleTaskConfig = {
    'architect': 'design microservices architecture',
    'code': 'implement REST API endpoints',
    'tdd': 'create user authentication tests',
    'debug': 'fix memory leak in service',
    'security-review': 'audit API security',
    'docs-writer': 'create API documentation',
    'integration': 'connect payment service',
    'post-deployment-monitoring-mode': 'monitor production metrics',
    'refinement-optimization-mode': 'optimize database queries',
    'devops': 'deploy to AWS Lambda',
    'supabase-admin': 'create user authentication schema',
    'spec-pseudocode': 'define payment flow requirements',
    'mcp': 'integrate with external API',
    'swarm': 'build complete feature with tests',
    'sparc': 'orchestrate authentication system',
    'ask': 'help me choose the right mode',
    'tutorial': 'guide me through SPARC methodology'
  };
  return examples[slug] || 'implement feature';
}

/**
 * Create main SPARC command slash command
 * @param modes Array of SPARC modes
 * @returns Formatted slash command content
 */
export function createMainSparcCommand(modes: SparcMode[]): string {
  const modeList = modes.map(m => `- \`/sparc-${m.slug}\` - ${m.name}`).join('\n');
  
  // Find the sparc orchestrator mode for its full description
  const sparcMode = modes.find(m => m.slug === 'sparc');
  const sparcDescription = sparcMode ? sparcMode.roleDefinition : 'SPARC orchestrator for complex workflows';
  const sparcInstructions = sparcMode ? sparcMode.customInstructions : '';
  
  return `---
name: sparc
description: Execute SPARC methodology workflows with Claude-Flow
---

# ⚡️ SPARC Development Methodology

${sparcDescription}

## SPARC Workflow

${sparcInstructions.split('\n').slice(0, 10).join('\n')}

## Available SPARC Modes

${modeList}

## Quick Start

### Run SPARC orchestrator (default):
\`\`\`bash
./claude-flow sparc "build complete authentication system"
\`\`\`

### Run a specific mode:
\`\`\`bash
./claude-flow sparc run <mode> "your task"
./claude-flow sparc run architect "design API structure"
./claude-flow sparc run tdd "implement user service"
\`\`\`

### Execute full TDD workflow:
\`\`\`bash
./claude-flow sparc tdd "implement user authentication"
\`\`\`

### List all modes with details:
\`\`\`bash
./claude-flow sparc modes --verbose
\`\`\`

## SPARC Methodology Phases

1. **📋 Specification**: Define requirements, constraints, and acceptance criteria
2. **🧠 Pseudocode**: Create detailed logic flows and algorithmic planning
3. **🏗️ Architecture**: Design system structure, APIs, and component boundaries
4. **🔄 Refinement**: Implement with TDD (Red-Green-Refactor cycle)
5. **✅ Completion**: Integrate, document, and validate against requirements

## Memory Integration

Use memory commands to persist context across SPARC sessions:
\`\`\`bash
# Store specifications
./claude-flow memory store "spec_auth" "OAuth2 + JWT requirements" --namespace spec

# Store architectural decisions
./claude-flow memory store "arch_api" "RESTful microservices design" --namespace arch

# Query previous work
./claude-flow memory query "authentication" --limit 10

# Export project memory
./claude-flow memory export sparc-project-backup.json
\`\`\`

## Advanced Swarm Mode

For complex tasks requiring multiple agents with timeout-free execution:
\`\`\`bash
# Development swarm with monitoring
./claude-flow swarm "Build e-commerce platform" --strategy development --monitor --review

# Background optimization swarm
./claude-flow swarm "Optimize system performance" --strategy optimization --background

# Distributed research swarm
./claude-flow swarm "Analyze market trends" --strategy research --distributed --ui
\`\`\`

## Non-Interactive Mode

For CI/CD integration and automation:
\`\`\`bash
./claude-flow sparc run code "implement API" --non-interactive
./claude-flow sparc tdd "user tests" --non-interactive --enable-permissions
\`\`\`

## Best Practices

✅ **Modular Design**: Keep files under 500 lines
✅ **Environment Safety**: Never hardcode secrets or env values
✅ **Test-First**: Always write tests before implementation
✅ **Memory Usage**: Store important decisions and context
✅ **Task Completion**: All tasks should end with \`attempt_completion\`

See \`/claude-flow-help\` for all available commands.
`;
}

/**
 * Validate SPARC mode configuration
 * @param mode The mode to validate
 * @returns Object with validation results
 */
export function validateSparcMode(mode: SparcMode): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields validation
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
  if (mode.groups && !Array.isArray(mode.groups)) {
    errors.push('Mode groups must be an array if provided');
  }
  
  if (mode.priority !== undefined && (typeof mode.priority !== 'number' || mode.priority < 0)) {
    errors.push('Mode priority must be a non-negative number if provided');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate slash command configuration from SPARC mode
 * @param mode The SPARC mode
 * @returns Slash command configuration object
 */
export function generateSlashCommandConfig(mode: SparcMode): SlashCommandConfig {
  return {
    name: `sparc-${mode.slug}`,
    description: `${mode.name} - ${mode.roleDefinition.substring(0, 100)}${
      mode.roleDefinition.length > 100 ? '...' : ''
    }`,
    content: createSparcSlashCommand(mode),
    metadata: {
      mode: mode.slug,
      category: mode.category || 'sparc',
      tags: ['sparc', 'development', mode.slug]
    }
  };
}
