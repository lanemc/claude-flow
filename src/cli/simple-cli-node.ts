#!/usr/bin/env node
/**
 * Simple CLI wrapper for Claude-Flow (Node.js TypeScript version)
 * This version provides proper typing while maintaining Node.js compatibility
 */

import { 
  executeCommand, 
  hasCommand, 
  showCommandHelp, 
  showAllCommands,
  listCommands 
} from './command-registry.js';
import { parseFlags } from './utils.js';
import { args, cwd, isMainModule, exit, readTextFile, writeTextFile, mkdirAsync, errors } from './node-compat.js';
import { spawn, ChildProcess } from 'child_process';
import process from 'process';
import readline from 'readline';
import { getMainHelp, getCommandHelp } from './help-text.js';

const VERSION = '2.0.0-alpha.56';

// Define types for CLI arguments and flags
interface CLIFlags {
  help?: boolean;
  version?: boolean;
  verbose?: boolean;
  [key: string]: any;
}

interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
  code?: number;
}

function printHelp(): void {
  console.log(getMainHelp());
}

function printCommandHelp(command: string): void {
  const help = getCommandHelp(command);
  console.log(help);
}

// Legacy help function for backward compatibility
function printLegacyHelp(): void {
  console.log(`
🌊 Claude-Flow v${VERSION} - Enterprise-Grade AI Agent Orchestration Platform

🎯 ENTERPRISE FEATURES: Complete ruv-swarm integration with 27 MCP tools, neural networking, and production-ready infrastructure

USAGE:
  claude-flow <command> [options]

🚀 INSTALLATION & ENTERPRISE SETUP:
  npx claude-flow@2.0.0 init --sparc  # Enterprise SPARC + ruv-swarm integration
  
  The --sparc flag creates:
  • Complete ruv-swarm integration with 27 MCP tools
  • Neural network processing with WASM optimization
  • Multi-agent coordination (hierarchical, mesh, ring, star topologies)
  • Cross-session memory and persistent learning
  • GitHub workflow automation (6 specialized modes)
  • Production-ready Docker infrastructure
  • Enterprise security and compliance features

🧠 SWARM INTELLIGENCE COMMANDS (v2.0.0):
  swarm "objective" [--strategy] [--mode] [--max-agents N] [--parallel] [--monitor]
    --strategy: research, development, analysis, testing, optimization, maintenance
    --mode: centralized, distributed, hierarchical, mesh, hybrid
    --parallel: Enable parallel execution (2.8-4.4x speed improvement)
    --monitor: Real-time swarm monitoring and performance tracking

🐙 GITHUB WORKFLOW AUTOMATION (v2.0.0):
  github gh-coordinator        # GitHub workflow orchestration and coordination
  github pr-manager           # Pull request management with multi-reviewer coordination
  github issue-tracker        # Issue management and project coordination
  github release-manager      # Release coordination and deployment pipelines
  github repo-architect       # Repository structure optimization
  github sync-coordinator     # Multi-package synchronization and version alignment

🏗️ CORE ENTERPRISE COMMANDS:
  init [--sparc]              # Initialize with enterprise environment + ruv-swarm
  start [--ui] [--swarm]      # Start orchestration with swarm intelligence
  spawn <type> [--name]       # Create AI agent with swarm coordination
  agent <subcommand>          # Advanced agent management with neural patterns
  sparc <subcommand>          # 17 SPARC modes with neural enhancement
  memory <subcommand>         # Cross-session persistent memory with neural learning
  status                      # Comprehensive system status with performance metrics

🤖 NEURAL AGENT TYPES (ruv-swarm Integration):
  researcher     # Research with web access and data analysis
  coder          # Code development with neural patterns
  analyst        # Performance analysis and optimization
  architect      # System design with enterprise patterns
  tester         # Comprehensive testing with automation
  coordinator    # Multi-agent orchestration and workflow management
  reviewer       # Code review with security and quality checks
  optimizer      # Performance optimization and bottleneck analysis

🎮 ENTERPRISE QUICK START:
  # Initialize enterprise environment
  npx claude-flow@2.0.0 init --sparc
  
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
  Core Intelligence:    swarm, agent, sparc, memory, neural
  GitHub Automation:    github (6 specialized modes)
  Development:          init, start, status, config, workflow
  Infrastructure:       mcp, terminal, session, docker
  Enterprise:           project, deploy, cloud, security, analytics, audit

📖 DOCUMENTATION & HELP:
  help                        # Show this help message
  help <command>              # Show help for specific command
  config                      # Configuration management
  examples                    # Show usage examples
  docs                        # Open documentation
  version                     # Show version information

🔧 ADVANCED FEATURES:
  MCP Integration:     27 specialized MCP tools
  Neural Networks:     WASM-optimized neural processing
  Memory System:       Cross-session persistent learning
  Swarm Intelligence:  84.8% SWE-Bench solve rate
  Performance:         2.8-4.4x speed improvements
  Token Efficiency:    32.3% reduction in token usage

💡 TIPS:
  • Use --verbose for detailed output
  • Use --help with any command for specific help
  • Check ./claude-flow status for system health
  • Use swarm mode for complex multi-step tasks
  • Enable --monitor for real-time performance tracking

🔗 RESOURCES:
  GitHub: https://github.com/ruvnet/claude-flow
  Docs:   https://claude-flow.dev
  Issues: https://github.com/ruvnet/claude-flow/issues
  `);
}

async function runInteractiveMode(): Promise<void> {
  console.log(`🌊 Claude-Flow v${VERSION} - Interactive Mode`);
  console.log('Type "help" for available commands or "exit" to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'claude-flow> '
  });

  rl.prompt();

  rl.on('line', async (line: string) => {
    const input = line.trim();
    
    if (input === 'exit' || input === 'quit') {
      rl.close();
      return;
    }
    
    if (input === '') {
      rl.prompt();
      return;
    }
    
    if (input === 'help') {
      printHelp();
      rl.prompt();
      return;
    }
    
    try {
      const [command, ...commandArgs] = input.split(' ');
      const flags = parseFlags(commandArgs);
      
      if (hasCommand(command)) {
        const result = await executeCommand(command, flags, commandArgs);
        if (result && 'error' in result && result.error) {
          console.error(`❌ Error: ${result.error}`);
        }
      } else {
        console.log(`❌ Unknown command: ${command}`);
        console.log('Type "help" for available commands.');
      }
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n👋 Goodbye!');
    process.exit(0);
  });
}

async function main(): Promise<void> {
  try {
    const rawArgs = args();
    const flags = parseFlags(rawArgs) as CLIFlags;
    
    // Handle version flag
    if (flags.version) {
      console.log(`Claude-Flow v${VERSION}`);
      return;
    }
    
    // Handle help flag
    if (flags.help && rawArgs.length === 0) {
      printHelp();
      return;
    }
    
    // If no arguments, enter interactive mode
    if (rawArgs.length === 0) {
      await runInteractiveMode();
      return;
    }
    
    const [command, ...commandArgs] = rawArgs;
    
    // Handle help for specific command
    if (flags.help) {
      printCommandHelp(command);
      return;
    }
    
    // Handle legacy help commands
    if (command === 'help' || command === '--help') {
      if (commandArgs.length > 0) {
        printCommandHelp(commandArgs[0]);
      } else {
        printHelp();
      }
      return;
    }
    
    // Execute the command
    if (hasCommand(command)) {
      const result = await executeCommand(command, flags, commandArgs);
      if (result && 'error' in result && result.error) {
        console.error(`❌ Error: ${result.error}`);
        process.exit(1);
      }
    } else {
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "claude-flow help" for available commands.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`❌ Fatal error: ${error}`);
    process.exit(1);
  }
}

// Run main function if this is the main module
if (isMainModule()) {
  main().catch((error) => {
    console.error(`❌ Fatal error: ${error}`);
    process.exit(1);
  });
}

export { main, printHelp, printCommandHelp, runInteractiveMode };
export type { CLIFlags, CommandResult };