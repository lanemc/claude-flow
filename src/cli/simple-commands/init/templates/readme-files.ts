// readme-files.ts - README templates for various directories with TypeScript support

import type { TemplateGenerator } from '../../../../types/template.js';

/**
 * Creates README for agents directory
 */
export const createAgentsReadme: TemplateGenerator<void> = (): string => {
  return `# Agent Memory Storage

## Purpose
This directory stores agent-specific memory data, configurations, and persistent state information for individual Claude agents in the orchestration system.

## Structure
Each agent gets its own subdirectory for isolated memory storage:

\`\`\`
memory/agents/
├── agent_001/
│   ├── state.json           # Agent state and configuration
│   ├── knowledge.md         # Agent-specific knowledge base
│   ├── tasks.json          # Completed and active tasks
│   └── calibration.json    # Agent-specific calibrations
├── agent_002/
│   └── ...
└── shared/
    ├── common_knowledge.md  # Shared knowledge across agents
    └── global_config.json  # Global agent configurations
\`\`\`

## Usage Guidelines
1. **Agent Isolation**: Each agent should only read/write to its own directory
2. **Shared Resources**: Use the \`shared/\` directory for cross-agent information
3. **State Persistence**: Update state.json whenever agent status changes
4. **Knowledge Sharing**: Document discoveries in knowledge.md files
5. **Cleanup**: Remove directories for terminated agents periodically

## Last Updated
${new Date().toISOString()}
`;
};

/**
 * Creates README for sessions directory
 */
export const createSessionsReadme: TemplateGenerator<void> = (): string => {
  return `# Session Memory Storage

## Purpose
This directory stores session-based memory data, conversation history, and contextual information for development sessions using the Claude-Flow orchestration system.

## Structure
Sessions are organized by date and session ID for easy retrieval:

\`\`\`
memory/sessions/
├── 2024-01-10/
│   ├── session_001/
│   │   ├── metadata.json        # Session metadata and configuration
│   │   ├── conversation.md      # Full conversation history
│   │   ├── decisions.md         # Key decisions and rationale
│   │   ├── artifacts/           # Generated files and outputs
│   │   └── coordination_state/  # Coordination system snapshots
│   └── ...
└── shared/
    ├── patterns.md              # Common session patterns
    └── templates/               # Session template files
\`\`\`

## Usage Guidelines
1. **Session Isolation**: Each session gets its own directory
2. **Metadata Completeness**: Always fill out session metadata
3. **Conversation Logging**: Document all significant interactions
4. **Artifact Organization**: Structure generated files clearly
5. **State Preservation**: Snapshot coordination state regularly

## Last Updated
${new Date().toISOString()}
`;
};

/**
 * Creates README for commands directory
 */
export const createCommandsReadme: TemplateGenerator<void> = (): string => {
  return `# Claude Code Commands

## Purpose
This directory contains Claude Code slash command definitions and documentation for the Claude-Flow orchestration system.

## Structure
Commands are organized by category:

\`\`\`
.claude/commands/
├── analysis/              # Performance and usage analysis commands
├── automation/            # Workflow automation commands
├── coordination/          # Agent coordination commands
├── github/               # GitHub integration commands
├── hooks/                # System hook commands
├── memory/               # Memory management commands
├── monitoring/           # Real-time monitoring commands
├── optimization/         # Performance optimization commands
├── training/            # Neural training commands
└── workflows/            # Workflow management commands
\`\`\`

## Command Format
Each command file follows this structure:
- **Name**: Command identifier
- **Description**: What the command does
- **Usage**: How to invoke the command
- **Options**: Available parameters
- **Examples**: Common use cases

## Creating New Commands
1. Choose appropriate category directory
2. Create markdown file named after command
3. Follow the standard command template
4. Test command functionality
5. Update category index if needed

## Best Practices
- Keep commands focused on single tasks
- Provide clear examples
- Document all options
- Include error handling guidance
- Test commands before committing

## Last Updated
${new Date().toISOString()}
`;
};

/**
 * Creates README for memory directory
 */
export const createMemoryReadme: TemplateGenerator<void> = (): string => {
  return `# Claude Flow Memory Storage

## Purpose
This directory contains all persistent memory data for the Claude-Flow orchestration system, including agent memories, session data, and system state.

## Directory Structure
\`\`\`
memory/
├── agents/               # Agent-specific memory storage
├── sessions/             # Session-based memory data
├── claude-flow-data.json # Main memory database
├── backups/             # Memory backup files
└── indexes/             # Search indexes for fast retrieval
\`\`\`

## Memory Types
- **Agent Memory**: Individual agent knowledge and state
- **Session Memory**: Conversation history and context
- **System Memory**: Global configuration and preferences
- **Cache Memory**: Frequently accessed data for performance

## Backup Strategy
- Automatic daily backups
- Manual backup before major operations
- Compressed archives for space efficiency
- Rotation policy to manage disk usage

## Privacy & Security
- All data stored locally
- No external synchronization without explicit command
- Sensitive data should be encrypted
- Regular cleanup of expired data

## Maintenance
- Run \`npx claude-flow memory clean\` to remove expired data
- Use \`npx claude-flow memory optimize\` to rebuild indexes
- Check \`npx claude-flow memory stats\` for usage information

## Last Updated
${new Date().toISOString()}
`;
};

/**
 * Creates README for test directory
 */
export const createTestsReadme: TemplateGenerator<void> = (): string => {
  return `# Claude Flow Tests

## Purpose
This directory contains test files for validating Claude-Flow functionality, including unit tests, integration tests, and performance benchmarks.

## Test Structure
\`\`\`
tests/
├── unit/                 # Unit tests for individual components
├── integration/          # Integration tests for system features
├── e2e/                 # End-to-end workflow tests
├── performance/         # Performance benchmarks
├── fixtures/            # Test data and mocks
└── helpers/             # Test utilities and helpers
\`\`\`

## Running Tests
- **All tests**: \`npm test\`
- **Unit tests**: \`npm run test:unit\`
- **Integration tests**: \`npm run test:integration\`
- **E2E tests**: \`npm run test:e2e\`
- **Performance tests**: \`npm run test:performance\`
- **Watch mode**: \`npm run test:watch\`

## Writing Tests
1. Follow existing test patterns
2. Use descriptive test names
3. Include both positive and negative cases
4. Mock external dependencies
5. Keep tests focused and isolated

## Coverage Requirements
- Minimum 80% code coverage
- Critical paths require 95%+ coverage
- New features must include tests
- Bug fixes require regression tests

## CI/CD Integration
- Tests run automatically on pull requests
- Coverage reports generated for review
- Performance benchmarks tracked over time
- Failing tests block merges

## Last Updated
${new Date().toISOString()}
`;
};

/**
 * Creates a generic README template
 */
export const createGenericReadme: TemplateGenerator<{ title: string; description: string }> = (options): string => {
  const { title, description } = options || { title: 'README', description: 'Project documentation' };
  
  return `# ${title}

## Purpose
${description}

## Structure
This directory is organized to support the Claude-Flow orchestration system.

## Usage Guidelines
- Follow project conventions
- Document significant changes
- Keep files organized
- Regular cleanup of obsolete content

## Last Updated
${new Date().toISOString()}
`;
};