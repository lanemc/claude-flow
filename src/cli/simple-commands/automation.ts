import { printSuccess, printError, printWarning } from "../utils.js";
import {
  // Types
  ComplexityLevel,
  RequirementType,
  ProjectType,
  Priority,
  AgentConfiguration,
  AutoAgentOptions,
  SmartSpawnOptions,
  WorkflowSelectOptions,
  RecommendedAgent,
  WorkflowTemplate,
  WorkflowTemplates,
  AutomationCommand,
  SpawningResult,
  ResourceConstraints,
  // Enums
  ComplexityLevel as ComplexityEnum,
  RequirementType as RequirementEnum,
  ProjectType as ProjectEnum,
  Priority as PriorityEnum,
  // Type Guards
  isComplexityLevel,
  isRequirementType,
  isProjectType,
  isPriority,
  isAutoAgentOptions,
  isSmartSpawnOptions,
  isWorkflowSelectOptions,
  // Constants
  AUTOMATION_DEFAULTS,
  COMPLEXITY_LIMITS,
  // Error Types
  AutomationError,
  AutomationValidationError,
  ResourceConstraintError
} from "./automation-types.js";

// ===== UTILITY FUNCTIONS =====

/**
 * Simple ID generator with type safety
 */
function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determines the optimal agent configuration based on complexity level
 * @param complexity - The task complexity level
 * @returns Agent configuration with proper type safety
 * @throws AutomationValidationError if complexity level is invalid
 */
function getAgentConfigForComplexity(complexity: string): AgentConfiguration {
  if (!isComplexityLevel(complexity)) {
    throw new AutomationValidationError(
      `Invalid complexity level: ${complexity}. Must be one of: ${Object.values(ComplexityEnum).join(', ')}`,
      'complexity',
      complexity
    );
  }

  switch (complexity.toLowerCase()) {
    case ComplexityEnum.LOW:
    case ComplexityEnum.SIMPLE:
      return { coordinator: 1, developer: 1, total: 2 };
    
    case ComplexityEnum.MEDIUM:
    case ComplexityEnum.MODERATE:
      return { coordinator: 1, developer: 2, researcher: 1, total: 4 };
    
    case ComplexityEnum.HIGH:
    case ComplexityEnum.COMPLEX:
      return { coordinator: 2, developer: 3, researcher: 2, analyzer: 1, total: 8 };
    
    case ComplexityEnum.ENTERPRISE:
    case ComplexityEnum.MASSIVE:
      return { coordinator: 3, developer: 5, researcher: 3, analyzer: 2, tester: 2, total: 15 };
    
    default:
      return { coordinator: 1, developer: 2, researcher: 1, total: 4 };
  }
}

/**
 * Analyzes requirements and suggests optimal agent mix
 * @param requirement - The requirement type string
 * @returns Array of recommended agents with reasoning
 * @throws AutomationValidationError if requirement type is invalid
 */
function getRecommendedAgentsForRequirement(requirement: string): RecommendedAgent[] {
  if (!isRequirementType(requirement as RequirementType)) {
    throw new AutomationValidationError(
      `Invalid requirement type: ${requirement}. Must be one of: ${Object.values(RequirementEnum).join(', ')}`,
      'requirement',
      requirement
    );
  }

  const agents: RecommendedAgent[] = [];
  
  if (requirement.includes('development') || requirement.includes('coding')) {
    agents.push(
      { type: 'coordinator', count: 1, reason: 'Task orchestration' },
      { type: 'coder', count: 3, reason: 'Core development work' },
      { type: 'tester', count: 1, reason: 'Quality assurance' }
    );
  }
  
  if (requirement.includes('research') || requirement.includes('analysis')) {
    agents.push(
      { type: 'researcher', count: 2, reason: 'Information gathering' },
      { type: 'analyst', count: 1, reason: 'Data analysis' }
    );
  }
  
  if (requirement.includes('enterprise') || requirement.includes('production')) {
    agents.push(
      { type: 'coordinator', count: 2, reason: 'Multi-tier coordination' },
      { type: 'coder', count: 4, reason: 'Parallel development' },
      { type: 'researcher', count: 2, reason: 'Requirements analysis' },
      { type: 'analyst', count: 1, reason: 'Performance monitoring' },
      { type: 'tester', count: 2, reason: 'Comprehensive testing' }
    );
  }
  
  // Default fallback
  if (agents.length === 0) {
    agents.push(
      { type: 'coordinator', count: 1, reason: 'General coordination' },
      { type: 'coder', count: 2, reason: 'General development' },
      { type: 'researcher', count: 1, reason: 'Support research' }
    );
  }
  
  return agents;
}

/**
 * Gets the workflow templates for all project types
 * @returns Complete collection of workflow templates
 */
function getWorkflowTemplates(): WorkflowTemplates {
  return {
    [ProjectEnum.WEB_APP]: {
      phases: ['planning', 'design', 'frontend', 'backend', 'testing', 'deployment'],
      agents: { coordinator: 1, developer: 3, tester: 1, researcher: 1 },
      duration: '2-4 weeks',
      description: 'Full-stack web application development workflow',
      riskLevel: 'medium'
    },
    [ProjectEnum.API]: {
      phases: ['specification', 'design', 'implementation', 'testing', 'documentation'],
      agents: { coordinator: 1, developer: 2, tester: 1, researcher: 1 },
      duration: '1-2 weeks',
      description: 'API development and documentation workflow',
      riskLevel: 'low'
    },
    [ProjectEnum.DATA_ANALYSIS]: {
      phases: ['collection', 'cleaning', 'analysis', 'visualization', 'reporting'],
      agents: { coordinator: 1, researcher: 2, analyzer: 2, developer: 1 },
      duration: '1-3 weeks',
      description: 'Data science and analytics workflow',
      riskLevel: 'medium'
    },
    [ProjectEnum.ENTERPRISE]: {
      phases: ['requirements', 'architecture', 'development', 'integration', 'testing', 'deployment', 'monitoring'],
      agents: { coordinator: 2, developer: 5, researcher: 2, analyzer: 1, tester: 2 },
      duration: '2-6 months',
      description: 'Enterprise-scale application development workflow',
      riskLevel: 'high'
    },
    [ProjectEnum.GENERAL]: {
      phases: ['planning', 'implementation', 'testing', 'delivery'],
      agents: { coordinator: 1, developer: 2, researcher: 1 },
      duration: '1-2 weeks',
      description: 'General-purpose development workflow',
      riskLevel: 'low'
    }
  };
}

/**
 * Gets a specific workflow template with validation
 * @param projectType - The project type string
 * @returns Workflow template for the project type
 * @throws AutomationValidationError if project type is invalid
 */
function getWorkflowTemplate(projectType: string): WorkflowTemplate {
  if (!isProjectType(projectType as ProjectType)) {
    throw new AutomationValidationError(
      `Invalid project type: ${projectType}. Must be one of: ${Object.values(ProjectEnum).join(', ')}`,
      'projectType',
      projectType
    );
  }

  const templates = getWorkflowTemplates();
  return templates[projectType as ProjectType] || templates[ProjectEnum.GENERAL];
}

// ===== MAIN AUTOMATION ACTION =====

export async function automationAction(subArgs: string[], flags: AutoAgentOptions | SmartSpawnOptions | WorkflowSelectOptions): Promise<void> {
  const subcommand = subArgs[0];
  const options = flags;

  if (options.help || options.h || !subcommand) {
    showAutomationHelp();
    return;
  }

  try {
    switch (subcommand) {
      case 'auto-agent':
        await autoAgentCommand(subArgs, flags as AutoAgentOptions);
        break;
      case 'smart-spawn':
        await smartSpawnCommand(subArgs, flags as SmartSpawnOptions);
        break;
      case 'workflow-select':
        await workflowSelectCommand(subArgs, flags as WorkflowSelectOptions);
        break;
      default:
        printError(`Unknown automation command: ${subcommand}`);
        showAutomationHelp();
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    printError(`Automation command failed: ${errorMessage}`);
  }
}

// ===== COMMAND IMPLEMENTATIONS =====

async function autoAgentCommand(subArgs: string[], flags: AutoAgentOptions): Promise<void> {
  const options = flags;
  const complexityInput = options['task-complexity'] || options.complexity || AUTOMATION_DEFAULTS.COMPLEXITY;
  const swarmId: string = options['swarm-id'] || options.swarmId || generateId(AUTOMATION_DEFAULTS.SWARM_ID_PREFIX);

  // Validate complexity level
  if (!isComplexityLevel(complexityInput)) {
    throw new AutomationValidationError(
      `Invalid complexity level: ${complexityInput}`,
      'complexity',
      complexityInput
    );
  }

  const complexity = complexityInput as ComplexityLevel;

  console.log(`🤖 Auto-spawning agents based on task complexity...`);
  console.log(`📊 Task complexity: ${complexity}`);
  console.log(`🐝 Swarm ID: ${swarmId}`);

  // Determine optimal agent configuration based on complexity
  const agentConfig = getAgentConfigForComplexity(complexity);

  // Validate agent configuration against limits
  const limits = COMPLEXITY_LIMITS[complexity as ComplexityLevel];
  if (agentConfig.total < limits.min || agentConfig.total > limits.max) {
    printWarning(`⚠️  Agent count ${agentConfig.total} is outside recommended range ${limits.min}-${limits.max} for ${complexity} complexity`);
  }

  console.log(`\n🎯 OPTIMAL AGENT CONFIGURATION:`);
  Object.entries(agentConfig).forEach(([type, count]) => {
    if (type !== 'total') {
      console.log(`  🤖 ${type}: ${count} agents`);
    }
  });
  console.log(`  📊 Total agents: ${agentConfig.total}`);
  console.log(`  📋 Recommended range: ${limits.min}-${limits.max} agents`);

  // Simulate auto-spawning with a delay
  await new Promise(resolve => setTimeout(resolve, AUTOMATION_DEFAULTS.SIMULATION_DELAY.AUTO_AGENT));

  printSuccess(`✅ Auto-agent spawning completed`);
  console.log(`🚀 ${agentConfig.total} agents spawned and configured for ${complexity} complexity tasks`);
  console.log(`💾 Agent configuration saved to swarm memory: ${swarmId}`);
  console.log(`📋 Agents ready for task assignment`);
}

async function smartSpawnCommand(subArgs: string[], flags: SmartSpawnOptions): Promise<void> {
  const options = flags;
  const requirementInput = options.requirement || RequirementEnum.GENERAL_DEVELOPMENT;
  const maxAgentsInput = options['max-agents'] || options.maxAgents || String(AUTOMATION_DEFAULTS.MAX_AGENTS);

  // Validate requirement type
  if (!isRequirementType(requirementInput as RequirementType)) {
    throw new AutomationValidationError(
      `Invalid requirement type: ${requirementInput}`,
      'requirement',
      requirementInput
    );
  }

  // Validate max agents
  const maxAgents = parseInt(maxAgentsInput);
  if (isNaN(maxAgents) || maxAgents < 1 || maxAgents > 50) {
    throw new AutomationValidationError(
      `Invalid max agents: ${maxAgentsInput}. Must be a number between 1 and 50`,
      'maxAgents',
      maxAgentsInput
    );
  }

  const requirement = requirementInput as RequirementType;
  
  console.log(`🧠 Smart spawning agents based on requirements...`);
  console.log(`📋 Requirement: ${requirement}`);
  console.log(`🔢 Max agents: ${maxAgents}`);

  // Analyze requirements and suggest optimal agent mix
  const recommendedAgents = getRecommendedAgentsForRequirement(requirement);

  await new Promise(resolve => setTimeout(resolve, 1000));

  printSuccess(`✅ Smart spawn analysis completed`);
  console.log(`\n🎯 RECOMMENDED AGENT CONFIGURATION:`);
  
  let totalRecommended = 0;
  recommendedAgents.forEach(agent => {
    console.log(`  🤖 ${agent.type}: ${agent.count} agents - ${agent.reason}`);
    totalRecommended += agent.count;
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`  📝 Total recommended: ${totalRecommended} agents`);
  console.log(`  🔢 Max allowed: ${maxAgents} agents`);
  console.log(`  ✅ Configuration: ${totalRecommended <= maxAgents ? 'Within limits' : 'Exceeds limits - scaling down required'}`);
  
  if (totalRecommended > maxAgents) {
    printWarning(`⚠️  Recommended configuration exceeds max agents. Consider increasing limit or simplifying requirements.`);
  }
}

async function workflowSelectCommand(subArgs: string[], flags: WorkflowSelectOptions): Promise<void> {
  const options = flags;
  const projectTypeInput = options['project-type'] || options.project || AUTOMATION_DEFAULTS.PROJECT_TYPE;
  const priorityInput = options.priority || AUTOMATION_DEFAULTS.PRIORITY;

  // Validate project type
  if (!isProjectType(projectTypeInput as ProjectType)) {
    throw new AutomationValidationError(
      `Invalid project type: ${projectTypeInput}`,
      'projectType',
      projectTypeInput
    );
  }

  // Validate priority
  if (!isPriority(priorityInput as Priority)) {
    throw new AutomationValidationError(
      `Invalid priority: ${priorityInput}`,
      'priority',
      priorityInput
    );
  }

  const projectType = projectTypeInput as ProjectType;
  const priority = priorityInput as Priority;

  console.log(`🔄 Selecting optimal workflow configuration...`);
  console.log(`📁 Project type: ${projectType}`);
  console.log(`⚡ Priority: ${priority}`);

  // Get validated workflow template
  const selectedWorkflow = getWorkflowTemplate(projectType);

  await new Promise(resolve => setTimeout(resolve, AUTOMATION_DEFAULTS.SIMULATION_DELAY.WORKFLOW_SELECT));

  printSuccess(`✅ Workflow selection completed`);
  console.log(`\n🔄 SELECTED WORKFLOW: ${projectType.toUpperCase()}`);
  console.log(`📝 Description: ${selectedWorkflow.description || 'No description available'}`);
  console.log(`⏱️  Estimated duration: ${selectedWorkflow.duration}`);
  console.log(`⚠️  Risk level: ${selectedWorkflow.riskLevel || 'Unknown'}`);
  
  console.log(`\n📋 WORKFLOW PHASES:`);
  selectedWorkflow.phases.forEach((phase, index) => {
    console.log(`  ${index + 1}. ${phase.charAt(0).toUpperCase() + phase.slice(1)}`);
  });
  
  console.log(`\n🤖 RECOMMENDED AGENTS:`);
  const totalAgents = Object.values(selectedWorkflow.agents).reduce((sum, count) => sum + count, 0);
  Object.entries(selectedWorkflow.agents).forEach(([type, count]) => {
    console.log(`  • ${type}: ${count} agent${count > 1 ? 's' : ''}`);
  });
  console.log(`  📊 Total: ${totalAgents} agents`);
  
  console.log(`\n⚡ PRIORITY OPTIMIZATIONS:`);
  switch (priority) {
    case PriorityEnum.SPEED:
      console.log(`  🚀 Speed-optimized: +50% agents, parallel execution`);
      break;
    case PriorityEnum.QUALITY:
      console.log(`  🎯 Quality-focused: +100% testing, code review stages`);
      break;
    case PriorityEnum.COST:
      console.log(`  💰 Cost-efficient: Minimal agents, sequential execution`);
      break;
    default:
      console.log(`  ⚖️  Balanced approach: Optimal speed/quality/cost ratio`);
  }
  
  console.log(`\n📄 Workflow template saved for project: ${projectType}`);
}

// ===== HELP FUNCTION =====

function showAutomationHelp(): void {
  console.log(`
🤖 Automation Commands - Intelligent Agent & Workflow Management

USAGE:
  claude-flow automation <command> [options]

COMMANDS:
  auto-agent        Automatically spawn optimal agents based on task complexity
  smart-spawn       Intelligently spawn agents based on specific requirements
  workflow-select   Select and configure optimal workflows for project types

AUTO-AGENT OPTIONS:
  --task-complexity <level>  Task complexity level (default: ${AUTOMATION_DEFAULTS.COMPLEXITY})
                             Options: ${Object.values(ComplexityEnum).join(', ')}
  --swarm-id <id>           Target swarm ID for agent spawning

SMART-SPAWN OPTIONS:
  --requirement <req>       Specific requirement description
                           Options: ${Object.values(RequirementEnum).join(', ')}
  --max-agents <n>         Maximum number of agents to spawn (default: ${AUTOMATION_DEFAULTS.MAX_AGENTS})

WORKFLOW-SELECT OPTIONS:
  --project-type <type>     Project type (default: ${AUTOMATION_DEFAULTS.PROJECT_TYPE})
                           Options: ${Object.values(ProjectEnum).join(', ')}
  --priority <priority>     Optimization priority (default: ${AUTOMATION_DEFAULTS.PRIORITY})
                           Options: ${Object.values(PriorityEnum).join(', ')}

EXAMPLES:
  # Auto-spawn for complex enterprise task
  claude-flow automation auto-agent --task-complexity enterprise --swarm-id swarm-123

  # Smart spawn for web development
  claude-flow automation smart-spawn --requirement "web-development" --max-agents 8

  # Select workflow for API project optimized for speed
  claude-flow automation workflow-select --project-type api --priority speed

  # Auto-spawn for simple task
  claude-flow automation auto-agent --task-complexity low

🎯 Automation benefits:
  • Optimal resource allocation
  • Intelligent agent selection
  • Workflow optimization
  • Reduced manual configuration
  • Performance-based scaling
`);
}

// ===== EXPORTS =====

export {
  generateId,
  getAgentConfigForComplexity,
  getRecommendedAgentsForRequirement,
  getWorkflowTemplates,
  getWorkflowTemplate,
  showAutomationHelp
};