/**
 * Help text templates for Claude Flow CLI
 * Provides clear, actionable command documentation
 */

export const VERSION = '2.0.0-alpha.49';

export const MAIN_HELP = `
🌊 Claude-Flow v${VERSION} - Enterprise-Grade AI Agent Orchestration Platform

🎯 ENTERPRISE FEATURES: Complete ruv-swarm integration with 87 MCP tools, neural networking, and production-ready infrastructure
🐝 NEW: Advanced Hive Mind System with Queen-led coordination, collective intelligence, and unlimited scaling

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

🐝 HIVE MIND COMMANDS (NEW!):
  hive-mind wizard         🎯 Interactive setup wizard (RECOMMENDED)
  hive-mind init           Initialize Hive Mind system with SQLite
  hive-mind spawn <task>   Create intelligent swarm with objective
  hive-mind status         View active swarms and performance metrics
  hive-mind metrics        Advanced performance analytics

📋 CORE COMMANDS:
  init                     Initialize Claude Flow v2.0.0 (creates CLAUDE.md & .claude/commands)
  start [--ui] [--swarm]   Start orchestration system
  swarm <objective>        Multi-agent swarm coordination
  agent <action>           Agent management (spawn, list, terminate)
  sparc <mode>             SPARC development modes (17 available)
  memory <action>          Persistent memory operations
  github <mode>            GitHub workflow automation (6 modes)
  status                   System status and health
  
📋 SWARM INTELLIGENCE COMMANDS:
  training <command>       Neural pattern learning & model updates (3 commands)
  coordination <command>   Swarm & agent orchestration (3 commands)
  analysis <command>       Performance & usage analytics (3 commands)
  automation <command>     Intelligent agent & workflow management (3 commands)
  hooks <command>          Lifecycle event management (5 commands)
  monitoring <command>     Real-time system monitoring (3 commands)
  optimization <command>   Performance & topology optimization (3 commands)
  
📋 ADDITIONAL COMMANDS:
  task <action>            Task and workflow management
  config <action>          System configuration
  mcp <action>             MCP server management
  batch <action>           Batch operations

🔍 GET HELP:
  claude-flow --help                Show this help
  claude-flow help                  Show this help
  claude-flow help <command>        Detailed command help
  claude-flow <command> --help      Detailed command help

🎯 RECOMMENDED FOR NEW USERS:
  claude-flow hive-mind wizard     # Start here! Interactive guided setup
  claude-flow init --sparc         # Initialize with SPARC methodology
  claude-flow help hive-mind       # Learn about Hive Mind features

📚 Documentation: https://github.com/ruvnet/claude-flow
🐝 Hive Mind Guide: https://github.com/ruvnet/claude-flow/tree/main/docs/hive-mind
🐝 ruv-swarm: https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm
`;

// Type definition for command help structure
interface CommandHelpMap {
  [commandName: string]: string;
}

export const COMMAND_HELP: CommandHelpMap = {
  swarm: `
🧠 SWARM COMMAND - Multi-Agent AI Coordination

USAGE:
  claude-flow swarm <objective> [options]

DESCRIPTION:
  Deploy intelligent multi-agent swarms to accomplish complex objectives.
  Agents work in parallel with neural optimization and real-time coordination.

OPTIONS:
  --strategy <type>    Execution strategy: research, development, analysis, 
                       testing, optimization, maintenance
  --mode <type>        Coordination mode: centralized, distributed, 
                       hierarchical, mesh, hybrid
  --max-agents <n>     Maximum number of agents (default: 5)
  --parallel           Enable parallel execution (2.8-4.4x speed improvement)
  --monitor            Real-time swarm monitoring
  --ui                 Interactive user interface
  --background         Run in background with progress tracking

EXAMPLES:
  claude-flow swarm "Build REST API" --strategy development --parallel
  claude-flow swarm "Research cloud architecture" --strategy research --mode distributed
  claude-flow swarm "Analyze performance" --max-agents 3 --monitor
  claude-flow swarm "Testing workflow" --ui --background

🎯 Features:
  • Neural pattern learning and optimization
  • Real-time coordination and load balancing
  • Parallel execution with 2.8-4.4x speed improvement
  • Adaptive strategy selection
  • Live monitoring and metrics
`,

  'hive-mind': `
🐝 HIVE MIND COMMAND - Collective AI Intelligence System

USAGE:
  claude-flow hive-mind <subcommand> [options]

DESCRIPTION:
  Advanced swarm intelligence with Queen-led coordination, collective memory,
  consensus building, and unlimited scaling capabilities.

SUBCOMMANDS:
  wizard               🎯 Interactive setup wizard (RECOMMENDED)
  init                 Initialize Hive Mind system with SQLite database
  spawn <objective>    Create intelligent swarm with specific objective
  status               View active swarms and performance metrics
  metrics              Advanced performance analytics and insights
  consensus            View collective decision-making results
  optimize             Database optimization and performance tuning

WIZARD OPTIONS:
  --quick              Quick setup with defaults
  --advanced           Advanced configuration options
  --force              Force reinitialize existing setup

SPAWN OPTIONS:
  --queen <type>       Queen type: strategic, tactical, adaptive
  --workers <n>        Number of worker agents (default: auto-scale)
  --topology <type>    Network topology: mesh, hierarchical, ring, star
  --priority <level>   Task priority: low, medium, high, critical
  --memory-shared      Enable shared collective memory

STATUS OPTIONS:
  --detailed           Show detailed swarm information
  --json               Output in JSON format
  --live               Live updating status display

EXAMPLES:
  claude-flow hive-mind wizard                                    # Interactive setup
  claude-flow hive-mind init --force                             # Force reinitialize
  claude-flow hive-mind spawn "Build microservices architecture" # Create swarm
  claude-flow hive-mind status --detailed --live                 # Live monitoring
  claude-flow hive-mind metrics --json                           # Export metrics

🐝 Features:
  • Queen-led coordination with specialized roles
  • Collective memory and knowledge sharing
  • Consensus building for critical decisions
  • Auto-scaling based on workload complexity
  • Real-time performance monitoring
  • SQLite-backed persistence
  • MCP tool integration (87+ operations)
`,

  init: `
🚀 INIT COMMAND - Initialize Claude Flow Environment

USAGE:
  claude-flow init [options]

DESCRIPTION:
  Initialize Claude Flow v2.0.0 development environment with SPARC methodology,
  MCP tools, and optional ruv-swarm integration.

OPTIONS:
  --sparc              Initialize with SPARC development methodology
  --force              Overwrite existing configuration files
  --minimal            Minimal setup without optional features
  --template <name>    Use specific template (default, enterprise, research)
  --no-install         Skip dependency installation
  --verbose            Show detailed initialization steps

EXAMPLES:
  claude-flow init --sparc                    # Recommended: Full SPARC setup
  claude-flow init --force --minimal          # Minimal setup, overwrite existing
  claude-flow init --template enterprise      # Enterprise template
  claude-flow init --sparc --no-install       # SPARC setup without npm install

🎯 What gets created:
  • .claude/ directory with command templates
  • CLAUDE.md with AI-readable project instructions
  • .roomodes file with 17 SPARC development modes
  • Configuration files for swarm intelligence
  • Integration setup for ruv-swarm MCP tools
`,

  start: `
🎬 START COMMAND - Launch Claude Flow Orchestration System

USAGE:
  claude-flow start [options]

DESCRIPTION:
  Start the Claude Flow orchestration system with optional UI and swarm intelligence.

OPTIONS:
  --ui                 Launch interactive user interface
  --web                Launch web-based UI (default port: 3000)
  --terminal           Use terminal-based UI instead of web
  --swarm              Enable swarm intelligence features
  --daemon             Run as background daemon
  --port <number>      Custom port for web UI or MCP server
  --verbose            Show detailed system activity
  --debug              Enable debug mode with additional logging
  --config <path>      Use custom configuration file

EXAMPLES:
  claude-flow start                           # Basic start in interactive mode
  claude-flow start --ui --swarm             # Start with swarm intelligence UI
  claude-flow start --web --port 8080        # Web UI on custom port
  claude-flow start --daemon --verbose       # Background daemon with logging
  claude-flow start --terminal --debug       # Terminal UI with debug mode

🎯 Features:
  • Interactive terminal or web-based UI
  • Real-time system monitoring
  • Swarm intelligence coordination
  • Background daemon mode
  • Configurable port and logging
`,

  agent: `
🤖 AGENT COMMAND - AI Agent Management

USAGE:
  claude-flow agent <subcommand> [options]

DESCRIPTION:
  Manage AI agents, hierarchies, and ecosystems with specialized roles and capabilities.

SUBCOMMANDS:
  spawn <type>         Create new agent with specific role
  list                 List all active agents
  terminate <id>       Terminate specific agent
  hierarchy            Manage agent hierarchies
  ecosystem            View agent ecosystem status
  roles                List available agent roles

AGENT TYPES:
  researcher           Research with web access and data analysis
  coder                Code development with neural patterns
  analyst              Performance analysis and optimization
  architect            System design with enterprise patterns
  tester               Comprehensive testing with automation
  coordinator          Multi-agent orchestration and workflow management
  reviewer             Code review with security and quality checks
  optimizer            Performance optimization and bottleneck analysis

SPAWN OPTIONS:
  --name <name>        Custom agent name
  --tools <list>       Comma-separated list of tools
  --config <path>      Custom configuration file
  --priority <level>   Agent priority: low, medium, high
  --memory <size>      Memory allocation in MB

EXAMPLES:
  claude-flow agent spawn researcher --name "DataBot"
  claude-flow agent list --verbose
  claude-flow agent hierarchy create enterprise
  claude-flow agent ecosystem status
  claude-flow agent roles

🎯 Features:
  • Specialized agent roles with unique capabilities
  • Hierarchical agent organization
  • Tool integration and configuration
  • Memory and resource management
  • Real-time ecosystem monitoring
`,

  sparc: `
🎨 SPARC COMMAND - Development Methodology Modes

USAGE:
  claude-flow sparc [subcommand] [options]

DESCRIPTION:
  SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) 
  development methodology with 17 specialized modes.

SUBCOMMANDS:
  modes                List all available SPARC modes
  run <mode> <task>    Execute specific SPARC mode
  info <mode>          Get detailed information about a mode
  tdd <task>           Test-driven development workflow
  orchestrate <task>   Full orchestrated development cycle

AVAILABLE MODES:
  architect            System architecture and design patterns
  code                 Code implementation and development
  tdd                  Test-driven development workflow
  debug                Debugging and troubleshooting
  security-review      Security analysis and vulnerability assessment
  spec-pseudocode      Specification and pseudocode generation
  integration          Integration testing and system connectivity
  docs-writer          Documentation generation and maintenance
  devops               DevOps and deployment automation
  optimization         Performance optimization and tuning
  monitoring           System monitoring and observability
  supabase-admin       Supabase administration and management
  generic              General-purpose development assistant
  tutorial             Tutorial and learning content creation
  ask                  Interactive Q&A and assistance

EXAMPLES:
  claude-flow sparc modes                                    # List all modes
  claude-flow sparc run architect "Design microservices"    # Run architect mode
  claude-flow sparc tdd "User authentication feature"       # TDD workflow
  claude-flow sparc info security-review                    # Mode information
  claude-flow sparc orchestrate "Build complete API"        # Full cycle

🎯 Features:
  • 17 specialized development modes
  • Neural pattern learning and optimization
  • Integrated testing and validation
  • Documentation generation
  • Security and performance analysis
`,

  memory: `
🧠 MEMORY COMMAND - Persistent Memory Operations

USAGE:
  claude-flow memory <subcommand> [options]

DESCRIPTION:
  Manage persistent memory across sessions with support for namespaces,
  search, and cross-session learning.

SUBCOMMANDS:
  store <key> <value>  Store information with optional namespace
  query <search>       Search stored information
  stats                Show memory statistics and usage
  export <file>        Export memory to JSON file
  import <file>        Import memory from JSON file
  clear                Clear all memory (with confirmation)
  namespaces           List all available namespaces

STORE OPTIONS:
  --namespace <ns>     Memory namespace (default: global)
  --tags <list>        Comma-separated tags for categorization
  --expires <time>     Expiration time (e.g., 1h, 1d, 1w)

QUERY OPTIONS:
  --namespace <ns>     Search within specific namespace
  --limit <n>          Limit number of results (default: 10)
  --format <type>      Output format: table, json, markdown

EXAMPLES:
  claude-flow memory store auth_pattern "JWT with refresh tokens"
  claude-flow memory store --namespace project --tags api,auth key "value"
  claude-flow memory query "authentication" --limit 5
  claude-flow memory stats --namespace project
  claude-flow memory export backup.json
  claude-flow memory clear --namespace temp

🎯 Features:
  • Cross-session persistence
  • Namespace organization
  • Full-text search capabilities
  • Tagging and categorization
  • Import/export functionality
  • Automatic expiration
`,

  github: `
🐙 GITHUB COMMAND - GitHub Integration and Workflow Automation

USAGE:
  claude-flow github <subcommand> [options]

DESCRIPTION:
  GitHub workflow automation with 6 specialized modes for comprehensive
  repository management and collaboration.

SUBCOMMANDS:
  setup                Setup GitHub integration and authentication
  workflow <action>    Manage automated workflows
  pr <description>     Create pull request with AI assistance
  issue <action>       Issue management and analysis
  gh-coordinator       GitHub workflow orchestration and coordination
  pr-manager           Pull request management with multi-reviewer coordination
  issue-tracker        Issue management and project coordination
  release-manager      Release coordination and deployment pipelines
  repo-architect       Repository structure optimization
  sync-coordinator     Multi-package synchronization and version alignment

WORKFLOW ACTIONS:
  create               Create new automated workflow
  list                 List existing workflows
  run <name>           Execute specific workflow
  status               Show workflow status

PR OPTIONS:
  --branch <name>      Source branch name
  --target <branch>    Target branch (default: main)
  --draft              Create as draft PR
  --reviewers <list>   Comma-separated list of reviewers

EXAMPLES:
  claude-flow github setup                                    # Initial setup
  claude-flow github workflow create --type ci               # Create CI workflow
  claude-flow github pr "Add user authentication feature"    # Create PR
  claude-flow github issue analyze --priority high           # Analyze issues
  claude-flow github gh-coordinator "Release coordination"   # Orchestrate release

🎯 Features:
  • 6 specialized GitHub automation modes
  • Intelligent PR creation and management
  • Multi-reviewer coordination
  • Release pipeline automation
  • Repository structure optimization
  • Cross-repository synchronization
`,

  hooks: `
🪝 HOOKS COMMAND - Lifecycle Event Management

USAGE:
  claude-flow hooks <hook-type> [options]

DESCRIPTION:
  Comprehensive lifecycle event management for swarm coordination,
  performance tracking, and automated workflows.

HOOK TYPES:
  pre-task             Execute before task begins
  post-task            Execute after task completion
  pre-edit             Execute before file modifications
  post-edit            Execute after file modifications
  pre-search           Execute before search operations
  post-command         Execute after any command
  session-start        Execute at session beginning
  session-end          Execute at session termination
  session-restore      Execute when restoring previous session
  notification         Send coordination notifications
  pre-command          Execute before any command

PRE-TASK OPTIONS:
  --description <text>         Task description
  --task-id <id>              Task identifier
  --agent-id <id>             Agent identifier
  --swarm-id <id>             Swarm identifier
  --coordination-mode <mode>   Coordination mode for the task

POST-TASK OPTIONS:
  --task-id <id>               Task identifier
  --analyze-performance        Generate performance analysis
  --generate-insights          Create AI-powered insights

PRE-EDIT OPTIONS:
  --file <path>           Target file path
  --operation <type>      Edit operation type (edit, create, delete)

POST-EDIT OPTIONS:
  --file <path>           Modified file path
  --memory-key <key>      Coordination memory key for storing edit info

SESSION-END OPTIONS:
  --export-metrics        Export session performance metrics
  --swarm-id <id>         Swarm identifier for coordination cleanup
  --generate-summary      Create comprehensive session summary

EXAMPLES:
  claude-flow hooks pre-task --description "Build API" --task-id task-123 --agent-id agent-456
  claude-flow hooks post-task --task-id task-123 --analyze-performance --generate-insights
  claude-flow hooks pre-edit --file "src/api.js" --operation edit
  claude-flow hooks post-edit --file "src/api.js" --memory-key "swarm/123/edits/timestamp"
  claude-flow hooks session-end --export-metrics --generate-summary --swarm-id swarm-123

🎯 Hooks enable:
  • Automated preparation & cleanup
  • Performance tracking
  • Coordination synchronization
  • Error prevention
  • Insight generation
`
};

export function getCommandHelp(command: string): string {
  return COMMAND_HELP[command] || `Help not available for command: ${command}`;
}

export function getMainHelp(): string {
  return MAIN_HELP;
}