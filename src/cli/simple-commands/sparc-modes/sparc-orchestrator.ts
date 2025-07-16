// sparc-orchestrator.ts - SPARC Orchestrator mode orchestration template with TypeScript types

/**
 * Orchestration phase configuration
 */
export interface OrchestrationPhase {
  name: string;
  description: string;
  estimatedTime: string;
  dependencies?: string[];
  tasks: OrchestrationTask[];
}

/**
 * Individual orchestration task
 */
export interface OrchestrationTask {
  id: string;
  description: string;
  command?: string;
  mode?: string;
  dependencies?: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
}

/**
 * Memory namespace configuration for orchestration
 */
export interface MemoryNamespaceConfig {
  base: string;
  phases: {
    spec: string;
    arch: string;
    refinement: string;
    completion: string;
  };
}

/**
 * BatchTool orchestration configuration
 */
export interface BatchToolConfig {
  name: string;
  pattern: 'boomerang' | 'parallel' | 'sequential';
  phases: BatchToolPhase[];
}

/**
 * BatchTool phase configuration
 */
export interface BatchToolPhase {
  id: string;
  type: 'parallel' | 'sequential';
  commands: string[];
  dependencies?: string[];
}

/**
 * Generate SPARC orchestrator orchestration template
 * @param taskDescription The main task description
 * @param memoryNamespace The memory namespace to use
 * @returns Formatted orchestration template
 */
export function getSparcOrchestratorOrchestration(
  taskDescription: string, 
  memoryNamespace: string
): string {
  const namespaceConfig = createMemoryNamespaceConfig(memoryNamespace);
  const batchToolConfig = createBatchToolConfig(taskDescription, memoryNamespace);
  
  return `
## 🚀 SPARC Orchestrator - Complex Workflow Management

Welcome! I'm your SPARC Orchestrator, ready to break down "${taskDescription}" into manageable subtasks following the SPARC methodology.

## 🎯 BatchTool Parallel Orchestration
For maximum efficiency, I can orchestrate multiple SPARC modes concurrently using BatchTool:

\`\`\`bash
${generateBatchToolCommands(batchToolConfig)}

# Monitor all parallel executions
batchtool monitor --dashboard
\`\`\`

## Task Orchestration Steps

${generateOrchestrationSteps(taskDescription, namespaceConfig)}

## Task Delegation Strategy

For each subtask, I will:
1. Define clear objectives and success criteria
2. Assign to the most appropriate specialist mode
3. Set dependencies and priorities
4. Monitor progress via memory queries
5. Coordinate handoffs between modes
6. Resolve conflicts and blockers
7. Ensure quality standards (modularity, security, testing)

## Quality Validation Checklist
✅ All files < 500 lines
✅ No hardcoded environment variables
✅ Modular, testable architecture
✅ Comprehensive test coverage
✅ Security review completed
✅ Documentation up to date
✅ Deployment successful
✅ Monitoring configured

## Orchestration Commands
\`\`\`bash
# Check overall progress
npx claude-flow memory query ${namespaceConfig.base}_sparc

# View specific phase status
npx claude-flow memory query ${namespaceConfig.phases.refinement}

# Check task dependencies
npx claude-flow memory query ${namespaceConfig.base}_dependencies

# Monitor active tasks
npx claude-flow status
\`\`\`

## Next Steps
I'll now begin orchestrating the SPARC workflow for "${taskDescription}". Each phase will be carefully managed with appropriate specialist modes to ensure secure, modular, and maintainable delivery.

Remember: Every subtask must follow SPARC principles and end with clear deliverables. Let's build something amazing together! 🚀`;
}

/**
 * Create memory namespace configuration
 * @param baseNamespace The base memory namespace
 * @returns Structured namespace configuration
 */
function createMemoryNamespaceConfig(baseNamespace: string): MemoryNamespaceConfig {
  return {
    base: baseNamespace,
    phases: {
      spec: `${baseNamespace}_spec`,
      arch: `${baseNamespace}_arch`,
      refinement: `${baseNamespace}_refinement`,
      completion: `${baseNamespace}_completion`
    }
  };
}

/**
 * Create BatchTool configuration for the orchestration
 * @param taskDescription The main task description
 * @param memoryNamespace The memory namespace
 * @returns BatchTool configuration
 */
function createBatchToolConfig(taskDescription: string, memoryNamespace: string): BatchToolConfig {
  return {
    name: taskDescription,
    pattern: 'boomerang',
    phases: [
      {
        id: 'phase1-research',
        type: 'parallel',
        commands: [
          `npx claude-flow sparc run ask 'research requirements for ${taskDescription}' --non-interactive`,
          `npx claude-flow sparc run security-review 'identify security needs for ${taskDescription}' --non-interactive`
        ]
      },
      {
        id: 'phase2-design',
        type: 'sequential',
        commands: [
          `npx claude-flow sparc run spec-pseudocode 'create specifications from research' --non-interactive`,
          `npx claude-flow sparc run architect 'design system architecture' --non-interactive`
        ],
        dependencies: ['phase1-research']
      },
      {
        id: 'phase3-implementation',
        type: 'parallel',
        commands: [
          `npx claude-flow sparc run code 'implement core features' --non-interactive`,
          `npx claude-flow sparc run code 'implement authentication' --non-interactive`,
          `npx claude-flow sparc run code 'implement data layer' --non-interactive`
        ],
        dependencies: ['phase2-design']
      },
      {
        id: 'phase4-integration',
        type: 'sequential',
        commands: [
          `npx claude-flow sparc run integration 'integrate all components' --non-interactive`,
          `npx claude-flow sparc run tdd 'comprehensive testing' --non-interactive`
        ],
        dependencies: ['phase3-implementation']
      },
      {
        id: 'phase5-completion',
        type: 'parallel',
        commands: [
          `npx claude-flow sparc run optimization 'performance tuning' --non-interactive`,
          `npx claude-flow sparc run docs-writer 'create documentation' --non-interactive`,
          `npx claude-flow sparc run devops 'deployment setup' --non-interactive`
        ],
        dependencies: ['phase4-integration']
      }
    ]
  };
}

/**
 * Generate BatchTool commands from configuration
 * @param config BatchTool configuration
 * @returns Formatted BatchTool command string
 */
function generateBatchToolCommands(config: BatchToolConfig): string {
  const phaseCommands = config.phases.map(phase => {
    const commandList = phase.commands.map(cmd => `    "${cmd}"`).join(' \\\\\n');
    return `  --${phase.id}-${phase.type} \\\\\n${commandList}`;
  }).join(' \\\\\n');
  
  return `# Full SPARC Workflow with BatchTool (Boomerang Pattern)
batchtool orchestrate --${config.pattern} --name "${config.name}" \\\\
${phaseCommands}`;
}

/**
 * Generate orchestration steps
 * @param taskDescription The main task description
 * @param namespaceConfig Memory namespace configuration
 * @returns Formatted orchestration steps
 */
function generateOrchestrationSteps(
  taskDescription: string, 
  namespaceConfig: MemoryNamespaceConfig
): string {
  const phases: OrchestrationPhase[] = [
    {
      name: 'Project Analysis & Planning',
      description: 'Analyze complex objective and create SPARC breakdown',
      estimatedTime: '15 mins',
      tasks: [
        {
          id: 'analyze-objective',
          description: `Analyze the complex objective: "${taskDescription}"`,
          priority: 'high'
        },
        {
          id: 'query-context',
          description: 'Query existing context and memory',
          command: `npx claude-flow memory query ${namespaceConfig.base}`,
          priority: 'high'
        },
        {
          id: 'create-sparc-plan',
          description: 'Break down into SPARC phases and identify specialist modes',
          priority: 'high'
        },
        {
          id: 'store-plan',
          description: 'Store comprehensive project plan',
          command: `npx claude-flow memory store ${namespaceConfig.base}_sparc_plan "Objective: ${taskDescription}. Phases: 5. Estimated subtasks: 12. Critical path: spec->arch->tdd->integration."`,
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Specification Phase Delegation',
      description: 'Create and delegate specification subtasks',
      estimatedTime: '10 mins',
      dependencies: ['Project Analysis & Planning'],
      tasks: [
        {
          id: 'delegate-spec',
          description: 'Delegate requirements gathering to spec-pseudocode mode',
          command: `npx claude-flow sparc run spec-pseudocode "Define detailed requirements for ${taskDescription}" --non-interactive`,
          mode: 'spec-pseudocode',
          priority: 'high'
        },
        {
          id: 'store-spec-assignment',
          description: 'Store task assignment in memory',
          command: `npx claude-flow memory store ${namespaceConfig.phases.spec}_task "Assigned to: spec-pseudocode mode. Status: In progress. Dependencies: None."`,
          priority: 'medium'
        },
        {
          id: 'validate-spec-deliverables',
          description: 'Review deliverables: requirements.md, pseudocode.md',
          priority: 'high'
        },
        {
          id: 'store-spec-results',
          description: 'Store specification completion status',
          command: `npx claude-flow memory store ${namespaceConfig.phases.spec}_complete "Requirements defined. Pseudocode created. Edge cases identified. Ready for architecture phase."`,
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Architecture Phase Delegation',
      description: 'Design system architecture',
      estimatedTime: '15 mins',
      dependencies: ['Specification Phase Delegation'],
      tasks: [
        {
          id: 'delegate-arch',
          description: 'Delegate system design to architect mode',
          command: `npx claude-flow sparc run architect "Design scalable architecture for ${taskDescription}" --non-interactive`,
          mode: 'architect',
          priority: 'high'
        },
        {
          id: 'ensure-modular-design',
          description: 'Ensure modular design (< 500 lines per file)',
          priority: 'high'
        },
        {
          id: 'verify-security',
          description: 'Review security architecture and boundaries',
          priority: 'high'
        },
        {
          id: 'store-arch-results',
          description: 'Store architecture completion status',
          command: `npx claude-flow memory store ${namespaceConfig.phases.arch}_complete "Architecture designed. APIs defined. Security boundaries established. Ready for implementation."`,
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Refinement Phase Orchestration',
      description: 'Coordinate parallel implementation tasks',
      estimatedTime: '20 mins',
      dependencies: ['Architecture Phase Delegation'],
      tasks: [
        {
          id: 'coordinate-tdd',
          description: 'TDD implementation with comprehensive tests',
          command: `npx claude-flow sparc run tdd "Implement core functionality with tests" --non-interactive`,
          mode: 'tdd',
          priority: 'high'
        },
        {
          id: 'coordinate-code',
          description: 'Main code implementation following architecture',
          command: `npx claude-flow sparc run code "Build modular implementation following architecture" --non-interactive`,
          mode: 'code',
          priority: 'high'
        },
        {
          id: 'coordinate-security',
          description: 'Security review and vulnerability audit',
          command: `npx claude-flow sparc run security-review "Audit implementation for vulnerabilities" --non-interactive`,
          mode: 'security-review',
          priority: 'high'
        },
        {
          id: 'coordinate-debug',
          description: 'Debugging support for issues',
          command: `npx claude-flow sparc run debug "Investigate and fix any issues" --non-interactive`,
          mode: 'debug',
          priority: 'medium'
        },
        {
          id: 'store-refinement-status',
          description: 'Store parallel task status and progress',
          command: `npx claude-flow memory store ${namespaceConfig.phases.refinement}_tasks "TDD: 80% complete. Code: 60% complete. Security: Pending. Debug: On standby."`,
          priority: 'medium'
        }
      ]
    },
    {
      name: 'Completion Phase Coordination',
      description: 'Final integration and deployment',
      estimatedTime: '15 mins',
      dependencies: ['Refinement Phase Orchestration'],
      tasks: [
        {
          id: 'coordinate-integration',
          description: 'System integration of all components',
          command: `npx claude-flow sparc run integration "Integrate all components" --non-interactive`,
          mode: 'integration',
          priority: 'high'
        },
        {
          id: 'coordinate-docs',
          description: 'Comprehensive documentation creation',
          command: `npx claude-flow sparc run docs-writer "Create comprehensive documentation" --non-interactive`,
          mode: 'docs-writer',
          priority: 'medium'
        },
        {
          id: 'coordinate-optimization',
          description: 'Performance optimization and structure refinement',
          command: `npx claude-flow sparc run refinement-optimization-mode "Optimize performance and structure" --non-interactive`,
          mode: 'refinement-optimization-mode',
          priority: 'medium'
        },
        {
          id: 'coordinate-devops',
          description: 'DevOps deployment to production',
          command: `npx claude-flow sparc run devops "Deploy to production" --non-interactive`,
          mode: 'devops',
          priority: 'high'
        },
        {
          id: 'coordinate-monitoring',
          description: 'Production monitoring configuration',
          command: `npx claude-flow sparc run post-deployment-monitoring-mode "Configure production monitoring" --non-interactive`,
          mode: 'post-deployment-monitoring-mode',
          priority: 'medium'
        },
        {
          id: 'store-completion',
          description: 'Store final completion status',
          command: `npx claude-flow memory store ${namespaceConfig.phases.completion}_sparc_complete "Project delivered. All phases complete. Documentation ready. Deployed to production. Monitoring active."`,
          priority: 'low'
        }
      ]
    }
  ];
  
  return phases.map((phase, index) => {
    const phaseNumber = index + 1;
    const taskList = phase.tasks.map(task => {
      const commandSection = task.command ? `\n     \`\`\`bash\n     ${task.command}\n     \`\`\`` : '';
      const modeSection = task.mode ? ` (Mode: ${task.mode})` : '';
      return `   - ${task.description}${modeSection}${commandSection}`;
    }).join('\n');
    
    return `${phaseNumber}. **${phase.name}** (${phase.estimatedTime})\n   - ${phase.description}\n${taskList}`;
  }).join('\n\n');
}

/**
 * Create orchestration configuration for a specific task
 * @param taskDescription The task description
 * @param memoryNamespace The memory namespace
 * @returns Orchestration configuration object
 */
export function createOrchestrationConfig(
  taskDescription: string,
  memoryNamespace: string
): {
  task: string;
  namespace: MemoryNamespaceConfig;
  batchTool: BatchToolConfig;
  phases: OrchestrationPhase[];
} {
  const namespaceConfig = createMemoryNamespaceConfig(memoryNamespace);
  const batchToolConfig = createBatchToolConfig(taskDescription, memoryNamespace);
  
  return {
    task: taskDescription,
    namespace: namespaceConfig,
    batchTool: batchToolConfig,
    phases: [] // Would be populated with the actual phases from generateOrchestrationSteps
  };
}
