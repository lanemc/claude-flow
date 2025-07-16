/**
 * Help text templates for Claude Flow CLI with TypeScript support
 * Provides clear, actionable command documentation
 */

export const VERSION = '2.0.0-alpha.56';

export const MAIN_HELP = `
🌊 Claude-Flow v${VERSION} - Enterprise-Grade AI Agent Orchestration Platform

🎯 ENTERPRISE FEATURES: Complete ruv-swarm integration with 87 MCP tools, neural networking, and production-ready infrastructure
🐝 NEW: Advanced Hive Mind System with Queen-led coordination, collective intelligence, and unlimited scaling
⚡ ALPHA 56: Enhanced code quality - Fixed UI rendering, real metrics, CLI parsing, and portability

USAGE:
  claude-flow <command> [options]
  claude-flow <command> --help    # Get detailed help for any command

🚀 QUICK START:
  # First time setup (creates CLAUDE.md & .claude/commands)
  npx claude-flow@alpha init --sparc
  
  # 🐝 HIVE MIND QUICK START (NEW!):
  claude-flow hive-mind wizard          # Interactive setup wizard
  claude-flow hive-mind spawn "objective"  # Create intelligent swarm
  
  # After setup, use without npx:
  claude-flow start --ui --swarm         # Start with swarm intelligence UI
  claude-flow swarm "build REST API"     # Deploy multi-agent workflow

🐝 HIVE MIND SYSTEM (NEW!):
  hive-mind wizard                      # Interactive setup wizard
  hive-mind spawn "objective"           # Create intelligent swarm
  hive-mind queen                       # Queen-led coordination
  hive-mind collective "task"           # Collective intelligence
  hive-mind optimize                    # Performance optimization
  hive-mind status                      # Real-time hive status
  hive-mind analytics                   # Advanced analytics

🧠 SWARM INTELLIGENCE COMMANDS:
  swarm "objective" [--strategy] [--mode] [--max-agents N] [--parallel] [--monitor]
    --strategy: research, development, analysis, testing, optimization, maintenance
    --mode: centralized, distributed, hierarchical, mesh, hybrid
    --parallel: Enable parallel execution (2.8-4.4x speed improvement)
    --monitor: Real-time swarm monitoring and performance tracking

🏗️ CORE ENTERPRISE COMMANDS:
  init [--sparc]                        # Initialize with enterprise environment + ruv-swarm
  start [--ui] [--swarm]                # Start orchestration with swarm intelligence
  spawn <type> [--name]                 # Create AI agent with swarm coordination
  agent <subcommand>                    # Advanced agent management with neural patterns
  sparc <subcommand>                    # 17 SPARC modes with neural enhancement
  memory <subcommand>                   # Cross-session persistent memory with neural learning
  status                                # Comprehensive system status with performance metrics

🤖 NEURAL AGENT TYPES (ruv-swarm Integration):
  researcher     # Research with web access and data analysis
  coder          # Code development with neural patterns
  analyst        # Performance analysis and optimization
  architect      # System design with enterprise patterns
  tester         # Comprehensive testing with automation
  coordinator    # Multi-agent orchestration and workflow management
  reviewer       # Code review with security and quality checks
  optimizer      # Performance optimization and bottleneck analysis

🐙 GITHUB WORKFLOW AUTOMATION:
  github gh-coordinator                 # GitHub workflow orchestration and coordination
  github pr-manager                     # Pull request management with multi-reviewer coordination
  github issue-tracker                  # Issue management and project coordination
  github release-manager               # Release coordination and deployment pipelines
  github repo-architect                # Repository structure optimization
  github sync-coordinator              # Multi-package synchronization and version alignment

🎮 ENTERPRISE QUICK START:
  # Initialize enterprise environment
  npx claude-flow@alpha init --sparc
  
  # Start enterprise orchestration with swarm intelligence
  ./claude-flow start --ui --swarm
  
  # Deploy intelligent multi-agent development workflow
  ./claude-flow swarm "build enterprise API" --strategy development --parallel --monitor
  
  # GitHub workflow automation
  ./claude-flow github pr-manager "coordinate release with automated testing"
  
  # Neural memory management
  ./claude-flow memory store "architecture" "microservices with API gateway pattern"
  
  # Real-time system monitoring
  ./claude-flow status --verbose

🏢 ENTERPRISE COMMAND CATEGORIES:
  Core Intelligence:    swarm, agent, sparc, memory, neural, hive-mind
  GitHub Automation:    github (6 specialized modes)
  Development:          init, start, status, config, workflow
  Infrastructure:       mcp, terminal, session, docker
  Enterprise:           project, deploy, cloud, security, analytics, audit

📖 DOCUMENTATION & HELP:
  help                                  # Show this help message
  help <command>                        # Show help for specific command
  config                                # Configuration management
  examples                              # Show usage examples
  docs                                  # Open documentation
  version                               # Show version information

🔧 ADVANCED FEATURES:
  MCP Integration:     87 specialized MCP tools
  Neural Networks:     WASM-optimized neural processing
  Memory System:       Cross-session persistent learning
  Swarm Intelligence:  84.8% SWE-Bench solve rate
  Performance:         2.8-4.4x speed improvements
  Token Efficiency:    32.3% reduction in token usage
  Hive Mind:           Unlimited scaling with collective intelligence

💡 TIPS:
  • Use --verbose for detailed output
  • Use --help with any command for specific help
  • Check ./claude-flow status for system health
  • Use swarm mode for complex multi-step tasks
  • Enable --monitor for real-time performance tracking
  • Try hive-mind wizard for interactive setup

🔗 RESOURCES:
  GitHub: https://github.com/ruvnet/claude-flow
  Docs:   https://claude-flow.dev
  Issues: https://github.com/ruvnet/claude-flow/issues
`;

// Command-specific help templates
export const COMMAND_HELP: Record<string, string> = {
  init: `
🚀 Initialize Claude-Flow Environment

USAGE:
  claude-flow init [options]

OPTIONS:
  --sparc                    Enable SPARC enterprise features
  --ui                       Setup UI components
  --swarm                    Initialize swarm intelligence
  --config <file>            Use custom config file
  --force                    Force overwrite existing files
  --verbose                  Show detailed output

EXAMPLES:
  claude-flow init --sparc                    # Full enterprise setup
  claude-flow init --ui --swarm               # UI with swarm intelligence
  claude-flow init --config my-config.json    # Custom configuration
  `,

  swarm: `
🐝 Swarm Intelligence Commands

USAGE:
  claude-flow swarm <objective> [options]

OPTIONS:
  --strategy <type>          Strategy: research, development, analysis, testing, optimization, maintenance
  --mode <type>              Mode: centralized, distributed, hierarchical, mesh, hybrid
  --max-agents <number>      Maximum number of agents (default: 5)
  --max-tasks <number>       Maximum number of tasks (default: 100)
  --parallel                 Enable parallel execution
  --monitor                  Real-time monitoring
  --dry-run                  Show configuration without executing

EXAMPLES:
  claude-flow swarm "build REST API" --strategy development --parallel
  claude-flow swarm "research AI trends" --strategy research --monitor
  claude-flow swarm "optimize database" --strategy optimization --max-agents 8
  `,

  'hive-mind': `
🐝 Hive Mind System Commands

USAGE:
  claude-flow hive-mind <subcommand> [options]

SUBCOMMANDS:
  wizard                     Interactive setup wizard
  spawn <objective>          Create intelligent swarm
  queen                      Queen-led coordination
  collective <task>          Collective intelligence
  optimize                   Performance optimization
  status                     Real-time hive status
  analytics                  Advanced analytics

OPTIONS:
  --objective <string>       Primary objective
  --agents <number>          Number of agents
  --strategy <type>          Coordination strategy
  --monitor                  Enable monitoring

EXAMPLES:
  claude-flow hive-mind wizard                    # Interactive setup
  claude-flow hive-mind spawn "build app"         # Create swarm
  claude-flow hive-mind queen --strategy adaptive # Queen coordination
  `,

  agent: `
🤖 Agent Management Commands

USAGE:
  claude-flow agent <subcommand> [options]

SUBCOMMANDS:
  spawn <type>               Create new agent
  list                       List active agents
  status <id>                Get agent status
  stop <id>                  Stop agent
  restart <id>               Restart agent
  logs <id>                  View agent logs

AGENT TYPES:
  researcher, coder, analyst, architect, tester, coordinator, reviewer, optimizer

OPTIONS:
  --name <string>            Agent name
  --capabilities <list>      Agent capabilities
  --max-tasks <number>       Maximum concurrent tasks

EXAMPLES:
  claude-flow agent spawn researcher --name "data-analyst"
  claude-flow agent list --verbose
  claude-flow agent status agent-123
  `,

  memory: `
💾 Memory Management Commands

USAGE:
  claude-flow memory <subcommand> [options]

SUBCOMMANDS:
  store <key> <value>        Store data
  query <key>                Retrieve data
  list                       List all keys
  delete <key>               Delete data
  stats                      Memory statistics
  export <file>              Export to file
  import <file>              Import from file

OPTIONS:
  --namespace <string>       Memory namespace
  --ttl <seconds>            Time to live
  --compress                 Enable compression
  --backup                   Create backup

EXAMPLES:
  claude-flow memory store "config" "{\\"key\\": \\"value\\"}"
  claude-flow memory query "config"
  claude-flow memory list --namespace project
  claude-flow memory export backup.json
  `,

  github: `
🐙 GitHub Integration Commands

USAGE:
  claude-flow github <subcommand> [options]

SUBCOMMANDS:
  gh-coordinator             GitHub workflow orchestration
  pr-manager                 Pull request management
  issue-tracker              Issue management
  release-manager            Release coordination
  repo-architect             Repository optimization
  sync-coordinator           Multi-repo synchronization

OPTIONS:
  --repo <string>            Repository name
  --pr-number <number>       Pull request number
  --action <string>          Action to perform
  --strategy <string>        Coordination strategy

EXAMPLES:
  claude-flow github pr-manager --repo "owner/repo" --pr-number 123
  claude-flow github issue-tracker --repo "owner/repo" --action track
  claude-flow github release-manager --repo "owner/repo" --version v1.0.0
  `,

  config: `
⚙️ Configuration Management Commands

USAGE:
  claude-flow config <subcommand> [options]

SUBCOMMANDS:
  show                       Show current configuration
  get <key>                  Get configuration value
  set <key> <value>          Set configuration value
  reset                      Reset to defaults
  validate                   Validate configuration

OPTIONS:
  --config-file <file>       Configuration file path
  --global                   Global configuration
  --local                    Local configuration

EXAMPLES:
  claude-flow config show
  claude-flow config get orchestrator.maxTasks
  claude-flow config set orchestrator.maxTasks 20
  claude-flow config validate --config-file my-config.json
  `,

  status: `
📊 System Status Commands

USAGE:
  claude-flow status [options]

OPTIONS:
  --verbose                  Show detailed status
  --json                     Output as JSON
  --watch                    Watch for changes
  --components <list>        Check specific components

EXAMPLES:
  claude-flow status --verbose
  claude-flow status --json
  claude-flow status --watch
  claude-flow status --components swarm,agents,memory
  `,

  start: `
🚀 Start Claude-Flow Services

USAGE:
  claude-flow start [options]

OPTIONS:
  --ui                       Start with UI
  --swarm                    Enable swarm intelligence
  --port <number>            Port number (default: 3000)
  --host <string>            Host address (default: localhost)
  --daemon                   Run as daemon
  --config <file>            Configuration file

EXAMPLES:
  claude-flow start --ui --swarm
  claude-flow start --port 8080 --host 0.0.0.0
  claude-flow start --daemon --config production.json
  `,
};

// Get help for main CLI
function getMainHelp(): string {
  return MAIN_HELP;
}

// Get help for specific command
function getCommandHelp(command: string): string {
  return COMMAND_HELP[command] || `
❌ No help available for command: ${command}

Run 'claude-flow help' to see all available commands.
`;
}

// Get list of all commands with brief descriptions
function getCommandList(): Record<string, string> {
  return {
    init: 'Initialize Claude-Flow environment',
    start: 'Start Claude-Flow services',
    swarm: 'Deploy intelligent multi-agent swarms',
    'hive-mind': 'Advanced hive mind system with collective intelligence',
    agent: 'Manage AI agents',
    memory: 'Memory management system',
    github: 'GitHub integration and automation',
    config: 'Configuration management',
    status: 'System status and monitoring',
    sparc: 'SPARC development modes',
    task: 'Task management',
    mcp: 'MCP server integration',
    monitor: 'Real-time monitoring',
    help: 'Show help information',
    version: 'Show version information',
  };
}

// Export help functions and constants
export {
  getMainHelp,
  getCommandHelp,
  getCommandList,
};