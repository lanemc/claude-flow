// enhanced-templates.ts - Generate Claude Flow v2.0.0 enhanced templates with TypeScript support

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { 
  TemplateGenerator, 
  WrapperScriptOptions, 
  CommandDocOptions, 
  CommandStructure,
  ClaudeSettings 
} from '../../../../types/template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load template files with fallback handling
 */
const loadTemplate = (filename: string): string | null => {
  try {
    return readFileSync(join(__dirname, filename), 'utf8');
  } catch (error) {
    // Silently fall back to hardcoded templates if files not found
    // This handles npm packaging scenarios where template files may not be included
    return null;
  }
};

/**
 * Creates enhanced CLAUDE.md with fallback support
 */
export const createEnhancedClaudeMd: TemplateGenerator<void> = (): string => {
  const template = loadTemplate('CLAUDE.md');
  if (!template) {
    // Fallback to hardcoded if template file not found
    return createEnhancedClaudeMdFallback();
  }
  return template;
};

/**
 * Creates enhanced settings.json with fallback support
 */
export const createEnhancedSettingsJson: TemplateGenerator<void> = (): string => {
  const template = loadTemplate('settings.json');
  if (!template) {
    return createEnhancedSettingsJsonFallback();
  }
  return template;
};

/**
 * Creates wrapper script with type safety
 */
export const createWrapperScript: TemplateGenerator<WrapperScriptOptions> = (options: WrapperScriptOptions = { type: 'unix' }): string => {
  const { type = 'unix', useUniversal = false } = options;
  
  // For unix, use the universal wrapper that works in both CommonJS and ES modules
  if (type === 'unix' && useUniversal) {
    const universalTemplate = loadTemplate('claude-flow-universal');
    if (universalTemplate) {
      return universalTemplate;
    }
  }
  
  const filename = type === 'unix' ? 'claude-flow' : 
                   type === 'windows' ? 'claude-flow.bat' : 
                   'claude-flow.ps1';
  
  const template = loadTemplate(filename);
  if (!template) {
    return createWrapperScriptFallback(type);
  }
  return template;
};

/**
 * Creates command documentation with type safety
 */
export const createCommandDoc = (options: CommandDocOptions): string => {
  const { category, command, description, usage, examples, options: cmdOptions } = options;
  
  const template = loadTemplate(`commands/${category}/${command}.md`);
  if (!template) {
    // Silently fall back to generated documentation
    return createCommandDocFallback(category, command);
  }
  return template;
};

/**
 * Generate command documentation fallbacks with proper typing
 */
function createCommandDocFallback(category: string, command: string): string {
  const docs: Record<string, Record<string, string>> = {
    analysis: {
      'bottleneck-detect': `# bottleneck-detect

Automatically detect performance bottlenecks in your swarm operations.

## Usage
\`\`\`bash
npx claude-flow analysis bottleneck-detect [options]
\`\`\`

## Options
- \`--swarm-id <id>\` - Target specific swarm
- \`--threshold <ms>\` - Performance threshold (default: 1000ms)
- \`--export <file>\` - Export results to file

## Examples
\`\`\`bash
# Detect bottlenecks in current swarm
npx claude-flow analysis bottleneck-detect

# Set custom threshold
npx claude-flow analysis bottleneck-detect --threshold 500

# Export results
npx claude-flow analysis bottleneck-detect --export bottlenecks.json
\`\`\`
`,
      'token-usage': `# token-usage

Analyze token usage patterns and optimize for efficiency.

## Usage
\`\`\`bash
npx claude-flow analysis token-usage [options]
\`\`\`

## Options
- \`--period <time>\` - Analysis period (1h, 24h, 7d, 30d)
- \`--by-agent\` - Break down by agent
- \`--by-operation\` - Break down by operation type

## Examples
\`\`\`bash
# Last 24 hours token usage
npx claude-flow analysis token-usage --period 24h

# By agent breakdown
npx claude-flow analysis token-usage --by-agent

# Export detailed report
npx claude-flow analysis token-usage --period 7d --export tokens.csv
\`\`\`
`,
      'performance-report': `# performance-report

Generate comprehensive performance reports for swarm operations.

## Usage
\`\`\`bash
npx claude-flow analysis performance-report [options]
\`\`\`

## Options
- \`--format <type>\` - Report format (json, html, markdown)
- \`--include-metrics\` - Include detailed metrics
- \`--compare <id>\` - Compare with previous swarm

## Examples
\`\`\`bash
# Generate HTML report
npx claude-flow analysis performance-report --format html

# Compare swarms
npx claude-flow analysis performance-report --compare swarm-123

# Full metrics report
npx claude-flow analysis performance-report --include-metrics --format markdown
\`\`\`
`
    },
    automation: {
      'auto-agent': `# auto-agent

Automatically assign agents based on task analysis.

## Usage
\`\`\`bash
npx claude-flow automation auto-agent [options]
\`\`\`

## Options
- \`--task <description>\` - Task to analyze
- \`--max-agents <n>\` - Maximum agents to spawn
- \`--strategy <type>\` - Assignment strategy

## Examples
\`\`\`bash
# Auto-assign for task
npx claude-flow automation auto-agent --task "Build REST API"

# Limit agents
npx claude-flow automation auto-agent --task "Fix bugs" --max-agents 3

# Use specific strategy
npx claude-flow automation auto-agent --strategy specialized
\`\`\`
`,
      'smart-spawn': `# smart-spawn

Intelligently spawn agents based on workload analysis.

## Usage
\`\`\`bash
npx claude-flow automation smart-spawn [options]
\`\`\`

## Options
- \`--analyze\` - Analyze before spawning
- \`--threshold <n>\` - Spawn threshold
- \`--topology <type>\` - Preferred topology

## Examples
\`\`\`bash
# Smart spawn with analysis
npx claude-flow automation smart-spawn --analyze

# Set spawn threshold
npx claude-flow automation smart-spawn --threshold 5

# Force topology
npx claude-flow automation smart-spawn --topology hierarchical
\`\`\`
`,
      'workflow-select': `# workflow-select

Automatically select optimal workflow based on task type.

## Usage
\`\`\`bash
npx claude-flow automation workflow-select [options]
\`\`\`

## Options
- \`--task <description>\` - Task description
- \`--constraints <list>\` - Workflow constraints
- \`--preview\` - Preview without executing

## Examples
\`\`\`bash
# Select workflow for task
npx claude-flow automation workflow-select --task "Deploy to production"

# With constraints
npx claude-flow automation workflow-select --constraints "no-downtime,rollback"

# Preview mode
npx claude-flow automation workflow-select --task "Database migration" --preview
\`\`\`
`
    },
    // Additional categories would go here...
  };

  return docs[category]?.[command] || `# ${command}

Command documentation for ${command} in category ${category}.

## Usage
\`\`\`bash
npx claude-flow ${category} ${command} [options]
\`\`\`
`;
}

/**
 * Command categories and their commands with proper typing
 */
export const COMMAND_STRUCTURE: CommandStructure = {
  analysis: ['bottleneck-detect', 'token-usage', 'performance-report'],
  automation: ['auto-agent', 'smart-spawn', 'workflow-select'],
  coordination: ['swarm-init', 'agent-spawn', 'task-orchestrate'],
  github: ['github-swarm', 'repo-analyze', 'pr-enhance', 'issue-triage', 'code-review'],
  hooks: ['pre-task', 'post-task', 'pre-edit', 'post-edit', 'session-end'],
  memory: ['memory-usage', 'memory-persist', 'memory-search'],
  monitoring: ['swarm-monitor', 'agent-metrics', 'real-time-view'],
  optimization: ['topology-optimize', 'parallel-execute', 'cache-manage'],
  training: ['neural-train', 'pattern-learn', 'model-update'],
  workflows: ['workflow-create', 'workflow-execute', 'workflow-export']
};

/**
 * Helper script content with type safety
 */
export const createHelperScript = (name: string): string => {
  const scripts: Record<string, string> = {
    'setup-mcp.sh': `#!/bin/bash
# Setup MCP server for Claude Flow

echo "🚀 Setting up Claude Flow MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: Claude Code CLI not found"
    echo "Please install Claude Code first"
    exit 1
fi

# Add MCP server
echo "📦 Adding Claude Flow MCP server..."
claude mcp add claude-flow npx claude-flow mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__claude-flow__ tools in Claude Code"
`,
    'quick-start.sh': `#!/bin/bash
# Quick start guide for Claude Flow

echo "🚀 Claude Flow Quick Start"
echo "=========================="
echo ""
echo "1. Initialize a swarm:"
echo "   npx claude-flow swarm init --topology hierarchical"
echo ""
echo "2. Spawn agents:"
echo "   npx claude-flow agent spawn --type coder --name \\"API Developer\\""
echo ""
echo "3. Orchestrate tasks:"
echo "   npx claude-flow task orchestrate --task \\"Build REST API\\""
echo ""
echo "4. Monitor progress:"
echo "   npx claude-flow swarm monitor"
echo ""
echo "📚 For more examples, see .claude/commands/"
`,
    'github-setup.sh': `#!/bin/bash
# Setup GitHub integration for Claude Flow

echo "🔗 Setting up GitHub integration..."

# Check for gh CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not found"
    echo "Install from: https://cli.github.com/"
    echo "Continuing without GitHub features..."
else
    echo "✅ GitHub CLI found"
    
    # Check auth status
    if gh auth status &> /dev/null; then
        echo "✅ GitHub authentication active"
    else
        echo "⚠️  Not authenticated with GitHub"
        echo "Run: gh auth login"
    fi
fi

echo ""
echo "📦 GitHub swarm commands available:"
echo "  - npx claude-flow github swarm"
echo "  - npx claude-flow repo analyze"
echo "  - npx claude-flow pr enhance"
echo "  - npx claude-flow issue triage"
`
  };
  
  return scripts[name] || '';
};

/**
 * Wrapper script fallbacks with proper typing
 */
function createWrapperScriptFallback(type: 'unix' | 'windows' | 'powershell'): string {
  if (type === 'unix') {
    // Return the universal ES module compatible wrapper
    return `#!/usr/bin/env node

/**
 * Claude Flow CLI - Universal Wrapper
 * Works in both CommonJS and ES Module projects
 */

// Use dynamic import to work in both CommonJS and ES modules
(async () => {
  const { spawn } = await import('child_process');
  const { resolve } = await import('path');
  const { fileURLToPath } = await import('url');
  
  try {
    // Try to use import.meta.url (ES modules)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = resolve(__filename, '..');
  } catch {
    // Fallback for CommonJS
  }

  // Try multiple strategies to find claude-flow
  const strategies = [
    // 1. Local node_modules
    async () => {
      try {
        const localPath = resolve(process.cwd(), 'node_modules/.bin/claude-flow');
        const { existsSync } = await import('fs');
        if (existsSync(localPath)) {
          return spawn(localPath, process.argv.slice(2), { stdio: 'inherit' });
        }
      } catch {}
    },
    
    // 2. Parent node_modules (monorepo)
    async () => {
      try {
        const parentPath = resolve(process.cwd(), '../node_modules/.bin/claude-flow');
        const { existsSync } = await import('fs');
        if (existsSync(parentPath)) {
          return spawn(parentPath, process.argv.slice(2), { stdio: 'inherit' });
        }
      } catch {}
    },
    
    // 3. NPX with latest alpha version (prioritized over global)
    async () => {
      return spawn('npx', ['claude-flow@2.0.0-alpha.25', ...process.argv.slice(2)], { stdio: 'inherit' });
    }
  ];

  // Try each strategy
  for (const strategy of strategies) {
    try {
      const child = await strategy();
      if (child) {
        child.on('exit', (code) => process.exit(code || 0));
        child.on('error', (err) => {
          if (err.code !== 'ENOENT') {
            console.error('Error:', err);
            process.exit(1);
          }
        });
        return;
      }
    } catch {}
  }
  
  console.error('Could not find claude-flow. Please install it with: npm install claude-flow');
  process.exit(1);
})();`;
  } else if (type === 'windows') {
    return `@echo off
rem Claude Flow wrapper script for Windows

rem Check if package.json exists in current directory
if exist "%~dp0package.json" (
    rem Local development mode
    if exist "%~dp0src\\cli\\simple-cli.js" (
        node "%~dp0src\\cli\\simple-cli.js" %*
    ) else if exist "%~dp0dist\\cli.js" (
        node "%~dp0dist\\cli.js" %*
    ) else (
        echo Error: Could not find Claude Flow CLI files
        exit /b 1
    )
) else (
    rem Production mode - use npx alpha
    npx claude-flow@alpha %*
)`;
  } else if (type === 'powershell') {
    return `# Claude Flow wrapper script for PowerShell

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

if (Test-Path "$scriptPath\\package.json") {
    # Local development mode
    if (Test-Path "$scriptPath\\src\\cli\\simple-cli.js") {
        & node "$scriptPath\\src\\cli\\simple-cli.js" $args
    } elseif (Test-Path "$scriptPath\\dist\\cli.js") {
        & node "$scriptPath\\dist\\cli.js" $args
    } else {
        Write-Error "Could not find Claude Flow CLI files"
        exit 1
    }
} else {
    # Production mode - use npx alpha
    & npx claude-flow@alpha $args
}`;
  }
  return '';
}

/**
 * Fallback functions for when templates can't be loaded
 */
function createEnhancedClaudeMdFallback(): string {
  // Read from the actual template file we created
  try {
    return readFileSync(join(__dirname, 'CLAUDE.md'), 'utf8');
  } catch (error) {
    // If that fails, return a minimal version
    return `# Claude Code Configuration for Claude Flow

## 🚀 IMPORTANT: Claude Flow AI-Driven Development

### Claude Code Handles:
- ✅ **ALL file operations** (Read, Write, Edit, MultiEdit)
- ✅ **ALL code generation** and development tasks
- ✅ **ALL bash commands** and system operations
- ✅ **ALL actual implementation** work
- ✅ **Project navigation** and code analysis

### Claude Flow MCP Tools Handle:
- 🧠 **Coordination only** - Orchestrating Claude Code's actions
- 💾 **Memory management** - Persistent state across sessions
- 🤖 **Neural features** - Cognitive patterns and learning
- 📊 **Performance tracking** - Monitoring and metrics
- 🐝 **Swarm orchestration** - Multi-agent coordination
- 🔗 **GitHub integration** - Advanced repository management

### ⚠️ Key Principle:
**MCP tools DO NOT create content or write code.** They coordinate and enhance Claude Code's native capabilities.

## Quick Start

1. Add MCP server: \`claude mcp add claude-flow npx claude-flow mcp start\`
2. Initialize swarm: \`mcp__claude-flow__swarm_init { topology: "hierarchical" }\`
3. Spawn agents: \`mcp__claude-flow__agent_spawn { type: "coder" }\`
4. Orchestrate: \`mcp__claude-flow__task_orchestrate { task: "Build feature" }\`

See full documentation in \`.claude/commands/\`
`;
  }
}

function createEnhancedSettingsJsonFallback(): string {
  const settings: ClaudeSettings = {
    env: {
      CLAUDE_FLOW_AUTO_COMMIT: "false",
      CLAUDE_FLOW_AUTO_PUSH: "false",
      CLAUDE_FLOW_HOOKS_ENABLED: "true",
      CLAUDE_FLOW_TELEMETRY_ENABLED: "true",
      CLAUDE_FLOW_REMOTE_EXECUTION: "true",
      CLAUDE_FLOW_GITHUB_INTEGRATION: "true"
    },
    permissions: {
      allow: [
        "Bash(npx claude-flow *)",
        "Bash(npm run lint)",
        "Bash(npm run test:*)",
        "Bash(npm test *)",
        "Bash(git status)",
        "Bash(git diff *)",
        "Bash(git log *)",
        "Bash(git add *)",
        "Bash(git commit *)",
        "Bash(git push)",
        "Bash(git config *)",
        "Bash(gh *)",
        "Bash(node *)",
        "Bash(which *)",
        "Bash(pwd)",
        "Bash(ls *)"
      ],
      deny: [
        "Bash(rm -rf /)",
        "Bash(curl * | bash)",
        "Bash(wget * | sh)",
        "Bash(eval *)"
      ]
    },
    enabledMcpjsonServers: [
      "claude-flow",
      "ruv-swarm"
    ],
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: "cat | jq -r '.tool_input.command // \"\"' | xargs -I {} npx claude-flow@alpha hooks pre-command --command \"{}\" --validate-safety true --prepare-resources true"
            }
          ]
        },
        {
          matcher: "Write|Edit|MultiEdit",
          hooks: [
            {
              type: "command",
              command: "cat | jq -r '.tool_input.file_path // .tool_input.path // \"\"' | xargs -I {} npx claude-flow@alpha hooks pre-edit --file \"{}\" --auto-assign-agents true --load-context true"
            }
          ]
        }
      ],
      PostToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: "cat | jq -r '.tool_input.command // \"\"' | xargs -I {} npx claude-flow@alpha hooks post-command --command \"{}\" --track-metrics true --store-results true"
            }
          ]
        },
        {
          matcher: "Write|Edit|MultiEdit",
          hooks: [
            {
              type: "command",
              command: "cat | jq -r '.tool_input.file_path // .tool_input.path // \"\"' | xargs -I {} npx claude-flow@alpha hooks post-edit --file \"{}\" --format true --update-memory true --train-neural true"
            }
          ]
        }
      ],
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: "npx claude-flow@alpha hooks session-end --generate-summary true --persist-state true --export-metrics true"
            }
          ]
        }
      ]
    },
    includeCoAuthoredBy: true
  };

  return JSON.stringify(settings, null, 2);
}