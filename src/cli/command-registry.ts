// command-registry.ts - Extensible command registration system
import process from 'process';
import { initCommand } from './simple-commands/init/index';
import { memoryCommand } from './simple-commands/memory';
import { sparcCommand } from './simple-commands/sparc';
import { agentCommand } from './simple-commands/agent';
import { taskCommand } from './simple-commands/task';
import { configCommand } from './simple-commands/config';
import { statusCommand } from './simple-commands/status';
import { mcpCommand } from './simple-commands/mcp';
import { monitorCommand } from './simple-commands/monitor';
import { startCommand } from './simple-commands/start';
import { swarmCommand } from './simple-commands/swarm';
import { batchManagerCommand } from './simple-commands/batch-manager';
import { githubCommand } from './simple-commands/github';
import { trainingAction } from './simple-commands/training';
import { analysisAction } from './simple-commands/analysis';
import { automationAction } from './simple-commands/automation';
import { coordinationAction } from './simple-commands/coordination';
import { hooksAction } from './simple-commands/hooks';
import { hookSafetyCommand } from './simple-commands/hook-safety';
import { hiveMindCommand } from './simple-commands/hive-mind';
import hiveMindOptimizeCommand from './simple-commands/hive-mind-optimize';
import { showUnifiedMetrics, fixTaskAttribution } from './simple-commands/swarm-metrics-integration';

// TypeScript interfaces for command system
export interface CommandFlags {
  [key: string]: unknown;
  help?: boolean;
  h?: boolean;
  verbose?: boolean;
  debug?: boolean;
  force?: boolean;
  minimal?: boolean;
  sparc?: boolean;
  daemon?: boolean;
  port?: number;
  ui?: boolean;
  web?: boolean;
  terminal?: boolean;
  watch?: boolean;
  interval?: number;
  json?: boolean;
  format?: string;
  filter?: string;
  strategy?: string;
  'max-agents'?: number;
  parallel?: boolean;
  monitor?: boolean;
  background?: boolean;
  auto?: boolean;
  report?: boolean;
  'clean-memory'?: boolean;
  'memory-days'?: number;
  vacuum?: boolean;
  'archive-tasks'?: boolean;
}

export interface CommandHandler {
  (args: string[], flags: CommandFlags): Promise<void> | void;
}

export interface CommandDefinition {
  handler: CommandHandler;
  description: string;
  usage: string;
  examples: string[];
  details?: string;
}

export interface CommandInfo {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  details?: string;
}

// Command registry for extensible CLI
export const commandRegistry = new Map<string, CommandDefinition>();

// Register core commands
export function registerCoreCommands(): void {
  commandRegistry.set('init', {
    handler: initCommand,
    description: 'Initialize Claude Code integration files and SPARC development environment',
    usage: 'init [--force] [--minimal] [--sparc]',
    examples: [
      'npx claude-flow@latest init --sparc  # Recommended: Full SPARC setup',
      'init --sparc                         # Initialize with SPARC modes',
      'init --force --minimal               # Minimal setup, overwrite existing',
      'init --sparc --force                 # Force SPARC setup'
    ],
    details: `
The --sparc flag creates a complete development environment:
  • .roomodes file containing 17 specialized SPARC modes
  • CLAUDE.md for AI-readable project instructions
  • Pre-configured modes: architect, code, tdd, debug, security, and more
  • Ready for TDD workflows and automated code generation
  
First-time users should run: npx claude-flow@latest init --sparc`
  });

  commandRegistry.set('start', {
    handler: startCommand,
    description: 'Start the Claude-Flow orchestration system',
    usage: 'start [--daemon] [--port <port>] [--verbose] [--ui] [--web]',
    examples: [
      'start                    # Start in interactive mode',
      'start --daemon           # Start as background daemon',
      'start --port 8080        # Use custom MCP port',
      'start --verbose          # Show detailed system activity',
      'start --ui               # Launch terminal-based UI',
      'start --web              # Launch web-based UI'
    ]
  });

  // Add start-ui as a convenient alias for launching the UI
  commandRegistry.set('start-ui', {
    handler: async (args: string[], flags: CommandFlags) => {
      // Import and use the direct UI launcher
      const { launchUI } = await import('./simple-commands/start-ui');
      // Pass the full raw arguments from process.argv
      const fullArgs = process.argv.slice(3); // Skip node, script, and command
      return launchUI(fullArgs);
    },
    description: 'Start the UI interface (web UI by default)',
    usage: 'start-ui [--port <port>] [--terminal]',
    examples: [
      'start-ui                 # Launch web-based UI (default)',
      'start-ui --port 3000     # Use custom port',
      'start-ui --terminal      # Launch terminal-based UI instead'
    ]
  });

  commandRegistry.set('memory', {
    handler: memoryCommand,
    description: 'Memory management operations',
    usage: 'memory <subcommand> [options]',
    examples: [
      'memory store key "value"',
      'memory query search_term',
      'memory stats',
      'memory export backup.json'
    ]
  });

  commandRegistry.set('sparc', {
    handler: sparcCommand,
    description: 'SPARC development mode operations',
    usage: 'sparc [subcommand] [options]',
    examples: [
      'sparc "orchestrate full app development"  # Default: sparc orchestrator',
      'sparc modes                               # List available modes',
      'sparc run code "implement feature"        # Run specific mode',
      'sparc tdd "feature description"           # TDD workflow',
      'sparc info architect                      # Mode details'
    ]
  });

  commandRegistry.set('agent', {
    handler: agentCommand,
    description: 'Manage AI agents and hierarchies',
    usage: 'agent <subcommand> [options]',
    examples: [
      'agent spawn researcher --name "DataBot"',
      'agent list --verbose',
      'agent hierarchy create enterprise',
      'agent ecosystem status'
    ]
  });

  commandRegistry.set('task', {
    handler: taskCommand,
    description: 'Manage tasks and workflows',
    usage: 'task <subcommand> [options]',
    examples: [
      'task create research "Market analysis"',
      'task list --filter running',
      'task workflow examples/dev-flow.json',
      'task coordination status'
    ]
  });

  commandRegistry.set('config', {
    handler: configCommand,
    description: 'Manage system configuration',
    usage: 'config <subcommand> [options]',
    examples: [
      'config init',
      'config set terminal.poolSize 15',
      'config get orchestrator.maxConcurrentTasks',
      'config validate'
    ]
  });

  commandRegistry.set('status', {
    handler: statusCommand,
    description: 'Show system status and health',
    usage: 'status [--verbose] [--json]',
    examples: [
      'status',
      'status --verbose',
      'status --json'
    ]
  });

  commandRegistry.set('mcp', {
    handler: mcpCommand,
    description: 'Manage MCP server and tools',
    usage: 'mcp <subcommand> [options]',
    examples: [
      'mcp status',
      'mcp start --port 8080',
      'mcp tools --verbose',
      'mcp auth setup'
    ]
  });

  commandRegistry.set('monitor', {
    handler: monitorCommand,
    description: 'Real-time system monitoring',
    usage: 'monitor [--watch] [--interval <ms>]',
    examples: [
      'monitor',
      'monitor --watch',
      'monitor --interval 1000 --watch',
      'monitor --format json'
    ]
  });

  commandRegistry.set('swarm', {
    handler: swarmCommand,
    description: 'Swarm-based AI agent coordination',
    usage: 'swarm <objective> [options]',
    examples: [
      'swarm "Build a REST API"',
      'swarm "Research cloud architecture" --strategy research',
      'swarm "Analyze data" --max-agents 3 --parallel',
      'swarm "Development task" --ui --monitor --background'
    ]
  });

  commandRegistry.set('hive-mind', {
    handler: hiveMindCommand,
    description: 'Advanced Hive Mind swarm intelligence with collective decision-making',
    usage: 'hive-mind <subcommand> [options]',
    examples: [
      'hive-mind init                          # Initialize hive mind system',
      'hive-mind spawn "Build microservices"   # Create swarm with objective',
      'hive-mind wizard                        # Interactive setup wizard',
      'hive-mind status                        # View active swarms',
      'hive-mind consensus                     # View consensus decisions',
      'hive-mind metrics                       # Performance analytics'
    ],
    details: `
Hive Mind System Features:
  • Queen-led coordination with specialized worker agents
  • Collective memory and knowledge sharing
  • Consensus building for critical decisions  
  • Auto-scaling based on workload
  • Parallel task execution with work stealing
  • Real-time monitoring and metrics
  • SQLite-backed persistence
  • MCP tool integration for 87+ operations

Queen Types:
  • Strategic - Long-term planning and optimization
  • Tactical - Task prioritization and rapid response
  • Adaptive - Learning and strategy evolution

Worker Types:
  • Researcher, Coder, Analyst, Tester
  • Architect, Reviewer, Optimizer, Documenter

Use 'hive-mind wizard' for interactive setup or 'hive-mind help' for full documentation.`
  });

  commandRegistry.set('hive-mind-optimize', {
    handler: hiveMindOptimizeCommand,
    description: '🔧 Optimize hive mind database for better performance',
    usage: 'hive-mind-optimize [options]',
    examples: [
      'hive-mind-optimize                      # Interactive optimization wizard',
      'hive-mind-optimize --auto               # Auto-optimize with defaults',
      'hive-mind-optimize --report             # Generate optimization report',
      'hive-mind-optimize --clean-memory --memory-days 60',
      'hive-mind-optimize --auto --vacuum --archive-tasks'
    ],
    details: `
Hive Mind Database Optimization Features:
  • Safe, backward-compatible optimizations
  • Performance indexes for 50% faster queries
  • Memory cleanup and archiving
  • Task archival for space management
  • Behavioral pattern tracking
  • Database integrity checking
  
Optimization Levels:
  • v1.0 → v1.1: Basic performance indexes
  • v1.1 → v1.2: Advanced query optimization
  • v1.2 → v1.3: Performance tracking tables
  • v1.3 → v1.4: Memory optimization features
  • v1.4 → v1.5: Behavioral analysis tracking

Safety Features:
  • Automatic backups before major operations
  • All changes are backward-compatible
  • Existing data is always preserved
  • Rollback capability on errors`
  });

  commandRegistry.set('swarm-metrics', {
    handler: async (args: string[], flags: CommandFlags) => {
      const subcommand = args[0];
      if (subcommand === 'fix') {
        await fixTaskAttribution();
      } else {
        await showUnifiedMetrics();
      }
    },
    description: 'Unified swarm metrics and task attribution diagnostics',
    usage: 'swarm-metrics [fix] [options]',
    examples: [
      'swarm-metrics                    # Show unified metrics from all swarm systems',
      'swarm-metrics fix                # Fix task attribution issues between systems'
    ],
    details: `
Swarm Metrics Integration Features:
  • Unified view of hive-mind and ruv-swarm metrics
  • Task attribution diagnosis and repair
  • Cross-system swarm performance comparison
  • Database integration status checking
  • Automatic sample task creation for empty swarms

This command helps resolve issues where:
  • Overall task statistics show correctly but per-swarm shows 0/0
  • Multiple swarm systems are not properly integrated
  • Task assignments are missing or incorrectly attributed

Use 'swarm-metrics fix' to automatically repair attribution issues.`
  });

  commandRegistry.set('batch', {
    handler: batchManagerCommand,
    description: 'Batch operation management and configuration utilities',
    usage: 'batch <command> [options]',
    examples: [
      'batch create-config my-batch.json',
      'batch validate config.json',
      'batch run workflow.json --parallel',
      'batch status --verbose'
    ]
  });

  commandRegistry.set('github', {
    handler: githubCommand,
    description: 'GitHub integration and workflow automation',
    usage: 'github <subcommand> [options]',
    examples: [
      'github setup                    # Setup GitHub integration',
      'github workflow create          # Create automated workflow',
      'github pr "feature description" # Create pull request with AI assistance',
      'github issue analyze            # Analyze and prioritize issues'
    ]
  });

  // Enhanced system commands
  commandRegistry.set('training', {
    handler: trainingAction,
    description: 'AI model training and adaptation operations',
    usage: 'training <subcommand> [options]',
    examples: [
      'training start --model custom    # Start training session',
      'training status                  # Check training progress',
      'training export model.bin        # Export trained model'
    ]
  });

  commandRegistry.set('analysis', {
    handler: analysisAction,
    description: 'Advanced system and project analysis',
    usage: 'analysis <subcommand> [options]',
    examples: [
      'analysis performance            # Analyze system performance',
      'analysis codebase --deep        # Deep code analysis',
      'analysis dependencies           # Dependency analysis'
    ]
  });

  commandRegistry.set('automation', {
    handler: automationAction,
    description: 'Workflow automation and scripting',
    usage: 'automation <subcommand> [options]',
    examples: [
      'automation create workflow.yaml # Create automation workflow',
      'automation run --schedule daily # Run scheduled automations',
      'automation templates            # List automation templates'
    ]
  });

  commandRegistry.set('coordination', {
    handler: coordinationAction,
    description: 'Multi-agent coordination and orchestration',
    usage: 'coordination <subcommand> [options]',
    examples: [
      'coordination topology mesh      # Set coordination topology',
      'coordination balance load       # Load balance agent tasks',
      'coordination sync all           # Synchronize all agents'
    ]
  });

  commandRegistry.set('hooks', {
    handler: hooksAction,
    description: 'System hooks and event management',
    usage: 'hooks <subcommand> [options]',
    examples: [
      'hooks list                      # List active hooks',
      'hooks add pre-task script.js    # Add pre-task hook',
      'hooks remove post-edit cleanup  # Remove hook'
    ]
  });

  commandRegistry.set('hook-safety', {
    handler: hookSafetyCommand,
    description: 'Hook safety validation and management',
    usage: 'hook-safety <subcommand> [options]',
    examples: [
      'hook-safety validate            # Validate all hooks',
      'hook-safety scan --deep         # Deep security scan',
      'hook-safety quarantine hook.js  # Quarantine unsafe hook'
    ]
  });
}

// Check if command exists
export function hasCommand(name: string): boolean {
  return commandRegistry.has(name);
}

// Execute a command
export async function executeCommand(name: string, args: string[], flags: CommandFlags): Promise<void> {
  const command = commandRegistry.get(name);
  if (!command) {
    throw new Error(`Unknown command: ${name}`);
  }
  
  await command.handler(args, flags);
}

// List all commands
export function listCommands(): CommandInfo[] {
  const commands: CommandInfo[] = [];
  
  for (const [name, command] of commandRegistry) {
    commands.push({
      name,
      description: command.description,
      usage: command.usage,
      examples: command.examples,
      details: command.details
    });
  }
  
  return commands.sort((a, b) => a.name.localeCompare(b.name));
}

// Show help for a specific command
export function showCommandHelp(name: string): void {
  const command = commandRegistry.get(name);
  
  if (!command) {
    console.log(`Unknown command: ${name}`);
    return;
  }
  
  console.log(`Command: ${name}`);
  console.log(`Description: ${command.description}`);
  console.log(`Usage: claude-flow ${command.usage}`);
  
  if (command.details) {
    console.log(command.details);
  }
  
  if (command.examples.length > 0) {
    console.log('\nExamples:');
    for (const example of command.examples) {
      if (example.startsWith('npx')) {
        console.log(`  ${example}`);
      } else {
        console.log(`  claude-flow ${example}`);
      }
    }
  }
}

// Helper to show all commands
export function showAllCommands(): void {
  const commands = listCommands();
  
  console.log('Available commands:');
  console.log();
  
  for (const command of commands) {
    console.log(`  ${command.name.padEnd(12)} ${command.description}`);
  }
  
  console.log();
  console.log('Use "claude-flow help <command>" for detailed usage information');
}

// Initialize the command registry
registerCoreCommands();