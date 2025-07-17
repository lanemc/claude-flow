// help.ts - Help text for init command

/**
 * Interface for help section structure
 */
interface HelpSection {
  title: string;
  description?: string;
  commands?: Record<string, string>;
  examples?: Record<string, string>;
}

/**
 * Interface for command option structure
 */
interface CommandOption {
  flag: string;
  description: string;
  aliases?: string[];
}

/**
 * Structured help content for the init command
 */
const INIT_HELP_CONTENT = {
  title: 'Initialize Claude Code integration files with Claude Flow v2.0.0',
  usage: 'claude-flow init [options]',
  defaultBehavior: {
    title: '🚀 DEFAULT BEHAVIOR:',
    commands: {
      'claude-flow init': 'Initialize with Claude Flow v2.0.0 enhanced features',
      '': 'Creates CLAUDE.md & .claude/commands for MCP integration'
    }
  },
  standardOptions: {
    title: 'Standard Options:',
    options: [
      { flag: '--force, -f', description: 'Overwrite existing files (also updates .gitignore)' },
      { flag: '--dry-run, -d', description: 'Preview what would be created without making changes' },
      { flag: '--help, -h', description: 'Show this help message' }
    ] as CommandOption[]
  },
  alternativeModes: {
    title: 'Alternative Initialization Modes:',
    options: [
      { flag: '--basic', description: 'Use basic initialization (pre-v2.0.0 behavior)' },
      { flag: '--sparc, -s', description: 'Initialize with SPARC development environment' },
      { flag: '--minimal, -m', description: 'Create minimal configuration files' },
      { flag: '--modes <list>', description: 'Initialize only specific SPARC modes (comma-separated)' },
      { flag: '--skip-mcp', description: 'Skip automatic MCP server setup in Claude Code' }
    ] as CommandOption[]
  },
  advancedOptions: {
    title: 'Advanced Options:',
    options: [
      { flag: '--enhanced, --safe', description: 'Enhanced initialization with validation and rollback' },
      { flag: '--validate', description: 'Run validation checks only' },
      { flag: '--validate-only', description: 'Validate without initializing' },
      { flag: '--rollback', description: 'Rollback previous initialization' },
      { flag: '--list-backups', description: 'List available backups and rollback points' }
    ] as CommandOption[]
  },
  validationRollbackOptions: {
    title: 'Validation & Rollback Options:',
    options: [
      { flag: '--skip-pre-validation', description: 'Skip pre-initialization checks' },
      { flag: '--skip-backup', description: 'Skip backup creation' },
      { flag: '--rollback --full', description: 'Perform full system rollback' },
      { flag: '--rollback --partial --phase <name>', description: 'Rollback specific phase' },
      { flag: '--validate --skip-pre-init', description: 'Skip pre-init validation' },
      { flag: '--validate --skip-config', description: 'Skip configuration validation' },
      { flag: '--validate --skip-mode-test', description: 'Skip SPARC mode testing' }
    ] as CommandOption[]
  },
  examples: {
    claudeFlowV2: {
      title: '🌊 CLAUDE FLOW v2.0.0 (DEFAULT):',
      commands: {
        'claude-flow init': '# ⭐ DEFAULT: Full Claude Flow v2.0.0 setup',
        'claude-flow init --force': '# Overwrite existing configuration',
        'claude-flow init --dry-run': '# Preview what will be created'
      }
    },
    standardInit: {
      title: '🚀 STANDARD INITIALIZATION:',
      commands: {
        'npx claude-flow@latest init --sparc --force': '# ⭐ RECOMMENDED: Optimized setup',
        'npx claude-flow@latest init --sparc': '# Standard SPARC setup',
        'claude-flow init --sparc --force': '# Optimized setup (existing project)',
        'claude-flow init --sparc --modes architect,tdd,code': '# Selective initialization',
        'claude-flow init --dry-run --sparc': '# Preview initialization',
        'claude-flow init --minimal': '# Minimal setup'
      }
    },
    validationRollback: {
      title: '🔄 VALIDATION & ROLLBACK:',
      commands: {
        'claude-flow init --validate': '# Validate existing setup',
        'claude-flow init --rollback --full': '# Full system rollback',
        'claude-flow init --rollback --partial --phase sparc-init': '# Rollback SPARC only',
        'claude-flow init --list-backups': '# Show available backups'
      }
    }
  },
  createdFiles: {
    title: 'What gets created:',
    files: [
      '.claude/settings.json - Claude Code configuration with hooks',
      '.claude/settings.local.json - Pre-approved MCP permissions (no prompts!)',
      '.mcp.json - Project-scoped MCP server configuration',
      'claude-flow.config.json - Claude Flow features and performance settings',
      '.claude/commands/ directory with 20+ Claude Code slash commands',
      'CLAUDE.md with project instructions (v2.0.0 enhanced by default)',
      'memory/ directory for persistent context storage',
      'coordination/ directory for agent orchestration',
      './claude-flow local executable wrapper',
      '.gitignore entries for Claude Flow generated files',
      'Automatic MCP server setup if Claude Code CLI is installed',
      'Pre-configured for TDD, architecture, and code generation'
    ]
  },
  slashCommands: {
    title: 'Claude Code Slash Commands Created:',
    commands: {
      '/sparc': 'Execute SPARC methodology workflows',
      '/sparc-<mode>': 'Run specific SPARC modes (17+ modes)',
      '/claude-flow-help': 'Show all claude-flow commands',
      '/claude-flow-memory': 'Interact with memory system',
      '/claude-flow-swarm': 'Coordinate multi-agent swarms'
    }
  },
  sparcModes: {
    title: 'Available SPARC modes:',
    modes: [
      'architect - System design and architecture',
      'code - Clean, modular implementation',
      'tdd - Test-driven development',
      'debug - Advanced debugging and optimization',
      'security-review - Security analysis and hardening',
      'docs-writer - Documentation creation',
      'integration - System integration',
      'swarm - Multi-agent coordination',
      'spec-pseudocode - Requirements and specifications',
      'devops - Deployment and infrastructure',
      'And 7+ more specialized modes...'
    ]
  },
  learnMore: 'Learn more: https://github.com/ruvnet/claude-code-flow'
} as const;

/**
 * Display the help text for the init command with proper formatting
 */
export function showInitHelp(): void {
  console.log(INIT_HELP_CONTENT.title);
  console.log();
  console.log(`Usage: ${INIT_HELP_CONTENT.usage}`);
  console.log();
  
  // Default behavior section
  console.log(INIT_HELP_CONTENT.defaultBehavior.title);
  Object.entries(INIT_HELP_CONTENT.defaultBehavior.commands).forEach(([cmd, desc]) => {
    if (cmd) {
      console.log(`  ${cmd.padEnd(24)} ${desc}`);
    } else {
      console.log(`  ${' '.repeat(24)} ${desc}`);
    }
  });
  console.log();
  
  // Standard options
  console.log(INIT_HELP_CONTENT.standardOptions.title);
  INIT_HELP_CONTENT.standardOptions.options.forEach(option => {
    console.log(`  ${option.flag.padEnd(24)} ${option.description}`);
  });
  console.log();
  
  // Alternative modes
  console.log(INIT_HELP_CONTENT.alternativeModes.title);
  INIT_HELP_CONTENT.alternativeModes.options.forEach(option => {
    console.log(`  ${option.flag.padEnd(24)} ${option.description}`);
  });
  console.log();
  
  // Advanced options
  console.log(INIT_HELP_CONTENT.advancedOptions.title);
  INIT_HELP_CONTENT.advancedOptions.options.forEach(option => {
    console.log(`  ${option.flag.padEnd(24)} ${option.description}`);
  });
  console.log();
  
  // Validation & rollback options
  console.log(INIT_HELP_CONTENT.validationRollbackOptions.title);
  INIT_HELP_CONTENT.validationRollbackOptions.options.forEach(option => {
    console.log(`  ${option.flag.padEnd(48)} ${option.description}`);
  });
  console.log();
  
  // Examples section
  console.log('Examples:');
  
  Object.values(INIT_HELP_CONTENT.examples).forEach(exampleSection => {
    console.log(exampleSection.title);
    Object.entries(exampleSection.commands).forEach(([cmd, desc]) => {
      console.log(`  ${cmd.padEnd(48)} ${desc}`);
    });
    console.log();
  });
  
  // What gets created
  console.log(INIT_HELP_CONTENT.createdFiles.title);
  INIT_HELP_CONTENT.createdFiles.files.forEach(file => {
    console.log(`  • ${file}`);
  });
  console.log();
  
  // Slash commands
  console.log(INIT_HELP_CONTENT.slashCommands.title);
  Object.entries(INIT_HELP_CONTENT.slashCommands.commands).forEach(([cmd, desc]) => {
    console.log(`  • ${cmd.padEnd(24)} - ${desc}`);
  });
  console.log();
  
  // SPARC modes
  console.log(INIT_HELP_CONTENT.sparcModes.title);
  INIT_HELP_CONTENT.sparcModes.modes.forEach(mode => {
    console.log(`  • ${mode}`);
  });
  console.log();
  
  console.log(INIT_HELP_CONTENT.learnMore);
}

/**
 * Get specific help section (for programmatic access)
 */
export function getHelpSection(sectionName: keyof typeof INIT_HELP_CONTENT): any {
  return INIT_HELP_CONTENT[sectionName];
}

/**
 * Get all available SPARC modes as an array
 */
export function getSparcModes(): string[] {
  return INIT_HELP_CONTENT.sparcModes.modes.map(mode => mode.split(' - ')[0]);
}

/**
 * Get all available command options as an array
 */
export function getAllCommandOptions(): CommandOption[] {
  return [
    ...INIT_HELP_CONTENT.standardOptions.options,
    ...INIT_HELP_CONTENT.alternativeModes.options,
    ...INIT_HELP_CONTENT.advancedOptions.options,
    ...INIT_HELP_CONTENT.validationRollbackOptions.options
  ];
}

/**
 * Validate if a given flag is a valid option
 */
export function isValidFlag(flag: string): boolean {
  const allOptions = getAllCommandOptions();
  return allOptions.some(option => 
    option.flag.includes(flag) || 
    (option.aliases && option.aliases.includes(flag))
  );
}

/**
 * Get help text for a specific flag
 */
export function getFlagHelp(flag: string): string | null {
  const allOptions = getAllCommandOptions();
  const option = allOptions.find(opt => 
    opt.flag.includes(flag) || 
    (opt.aliases && opt.aliases.includes(flag))
  );
  return option ? option.description : null;
}

// Export the structured help content for external use
export { INIT_HELP_CONTENT };