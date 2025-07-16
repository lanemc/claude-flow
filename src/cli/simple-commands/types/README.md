# Claude Flow TypeScript Types

This directory contains comprehensive TypeScript type definitions for the Claude Flow hook system and automation framework.

## 📁 Files Structure

```
types/
├── index.ts           # Main entry point - re-exports all types
├── hooks.types.ts     # Core type definitions (50+ interfaces, 10+ enums)
├── utils.types.ts     # Utility types, type guards, and helper functions
└── README.md          # This documentation
```

## 🚀 Quick Start

```typescript
// Import all types
import { 
  HookConfiguration, 
  AgentConfiguration, 
  HookType, 
  AgentType,
  AllFlags 
} from './types/index.js';

// Or import specific types
import type { HookExecutionResult } from './types/hooks.types.js';

// Use type guards
import { isHookType, TypeUtils } from './types/utils.types.js';
```

## 📋 Core Interfaces

### Hook System Types

```typescript
// Hook configuration
interface HookConfiguration {
  id: string;
  type: HookType;
  enabled: boolean;
  priority: Priority;
  command?: string;
  // ... more properties
}

// Hook execution result
interface HookExecutionResult {
  success: boolean;
  hookId: string;
  hookType: HookType;
  duration: number;
  timestamp: string;
  // ... more properties
}
```

### Agent Configuration

```typescript
interface AgentConfiguration {
  id: string;
  name: string;
  type: AgentType;
  capabilities: string[];
  status: Status;
  swarmId: string;
  spawnedAt: string;
  // ... more properties
}
```

### Automation Workflows

```typescript
interface AutomationWorkflow {
  id: string;
  name: string;
  projectType: ProjectType;
  strategy: Strategy;
  phases: WorkflowPhase[];
  agentRequirements: AgentRequirement[];
  // ... more properties
}
```

## 🏷️ Enums

### HookType
Pre-operation, post-operation, MCP integration, and session hooks:
```typescript
enum HookType {
  PRE_TASK = 'pre-task',
  POST_EDIT = 'post-edit',
  AGENT_SPAWNED = 'agent-spawned',
  SESSION_END = 'session-end',
  // ... 20+ more types
}
```

### AgentType
Various agent specializations:
```typescript
enum AgentType {
  COORDINATOR = 'coordinator',
  TYPESCRIPT_DEVELOPER = 'typescript-developer',
  FRONTEND_DEVELOPER = 'frontend-developer',
  DEVOPS_ENGINEER = 'devops-engineer',
  // ... 25+ more types
}
```

### ComplexityLevel & ProjectType
For automation and workflow selection:
```typescript
enum ComplexityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ENTERPRISE = 'enterprise'
}

enum ProjectType {
  WEB_APP = 'web-app',
  API = 'api',
  DATA_ANALYSIS = 'data-analysis',
  ENTERPRISE = 'enterprise'
}
```

## 🛡️ Type Guards & Utilities

The `utils.types.ts` file provides comprehensive type guards and utility functions:

```typescript
// Type guards
if (isHookType(userInput)) {
  // userInput is now typed as HookType
}

if (isAgentConfiguration(data)) {
  // data is now typed as AgentConfiguration
}

// Utility functions
const hookType = normalizeHookType('pre-command'); // Returns HookType.PRE_BASH
const agentType = getAgentTypeForFileExtension('.ts'); // Returns AgentType.TYPESCRIPT_DEVELOPER
const recommended = getRecommendedAgents(ProjectType.WEB_APP);
```

## 🔧 Flag Types

Comprehensive flag interfaces for CLI operations:

```typescript
// Base flags (help, verbose, etc.)
interface BaseFlags {
  help?: boolean;
  verbose?: boolean;
  'dry-run'?: boolean;
  force?: boolean;
}

// Hook-specific flags
interface HookFlags extends BaseFlags {
  'task-id'?: string;
  'auto-spawn-agents'?: boolean;
  file?: string;
  'validate-safety'?: boolean;
  // ... 30+ more flags
}

// All flags combined
type AllFlags = BaseFlags & HookFlags & AutomationFlags & SwarmFlags;
```

## 💾 Memory & Storage Types

```typescript
interface MemoryEntry<T = unknown> {
  key: string;
  value: T;
  namespace?: string;
  ttl?: number;
  createdAt: string;
  updatedAt: string;
}

interface MemoryStoreConfiguration {
  type: 'sqlite' | 'redis' | 'memory' | 'file';
  connection?: string;
  defaultTTL?: number;
  maxEntries?: number;
}
```

## ✅ Validation Types

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface SafetyValidationResult {
  safe: boolean;
  level: SafetyLevel;
  warnings: SafetyMessage[];
  errors: SafetyMessage[];
}
```

## 🎯 Usage Examples

### Hook Configuration
```typescript
import { HookConfiguration, HookType, Priority } from './types/index.js';

const hookConfig: HookConfiguration = {
  id: 'pre-edit-formatter',
  type: HookType.PRE_EDIT,
  enabled: true,
  priority: Priority.HIGH,
  command: 'prettier --write',
  safety: {
    enabled: true,
    maxDepth: 3,
    blockedPatterns: ['rm -rf'],
    warningPatterns: ['claude'],
    allowOverride: false
  }
};
```

### Agent Configuration
```typescript
import { AgentConfiguration, AgentType, Status } from './types/index.js';

const agent: AgentConfiguration = {
  id: 'typescript-expert-001',
  name: 'TypeScript Architecture Expert',
  type: AgentType.TYPESCRIPT_DEVELOPER,
  capabilities: ['type-definition', 'interface-design', 'generic-programming'],
  status: Status.ACTIVE,
  swarmId: 'swarm-conversion-294',
  spawnedAt: new Date().toISOString(),
  options: {
    enableLearning: true,
    learningRate: 0.8,
    cognitivePattern: 'analytical',
    enableMemory: true
  }
};
```

### Workflow Definition
```typescript
import { 
  AutomationWorkflow, 
  ProjectType, 
  Strategy, 
  Priority 
} from './types/index.js';

const workflow: AutomationWorkflow = {
  id: 'typescript-conversion',
  name: 'TypeScript Migration Workflow',
  description: 'Convert JavaScript codebase to TypeScript',
  projectType: ProjectType.ENTERPRISE,
  strategy: Strategy.PARALLEL,
  priority: Priority.HIGH,
  phases: [
    {
      id: 'analysis',
      name: 'Code Analysis',
      description: 'Analyze existing JavaScript code',
      order: 1,
      requiredAgents: [AgentType.ANALYST, AgentType.TYPESCRIPT_DEVELOPER],
      tasks: []
    }
    // ... more phases
  ],
  agentRequirements: [
    {
      type: AgentType.TYPESCRIPT_DEVELOPER,
      count: 3,
      reason: 'Core TypeScript conversion work'
    }
  ]
};
```

## 🔄 Type Conversion & Migration

When converting existing JavaScript files to TypeScript:

1. **Import types at the top of files:**
   ```typescript
   import type { HookConfiguration, HookFlags } from '../types/index.js';
   ```

2. **Add type annotations to function parameters:**
   ```typescript
   // Before (JavaScript)
   export async function hooksAction(subArgs, flags) {
   
   // After (TypeScript)
   export async function hooksAction(
     subArgs: string[], 
     flags: HookFlags
   ): Promise<void> {
   ```

3. **Use type guards for runtime validation:**
   ```typescript
   import { isHookType } from '../types/utils.types.js';
   
   if (isHookType(userInput)) {
     // Now userInput is properly typed
   }
   ```

## 🚨 Safety Considerations

The type system includes comprehensive safety types:

- **SafetyLevel**: Different levels of safety validation
- **SafetyValidationResult**: Results of safety checks
- **SafetyMessage**: Structured safety messages with severity
- **HookCircuitBreaker**: Types for preventing infinite loops

## 📚 Best Practices

1. **Always use type guards** when dealing with user input or external data
2. **Prefer strict typing** over `any` or `unknown`
3. **Use utility types** for common operations (PartialDeep, RequiredFields, etc.)
4. **Document complex types** with JSDoc comments
5. **Export types explicitly** for better IDE support

## 🔧 Development Tools

The types are designed to work with:
- **TypeScript Compiler**: Full type checking and inference
- **VS Code**: IntelliSense, auto-completion, and error detection
- **ESLint**: Type-aware linting rules
- **Prettier**: Code formatting (works with .ts files)

## 📝 Contributing

When adding new types:

1. Add the interface/enum to `hooks.types.ts`
2. Create type guards in `utils.types.ts` if needed
3. Export from `index.ts`
4. Update this README with examples
5. Add validation functions if appropriate

## 🐛 Common Issues

### Import/Export Issues
- Use `.js` extensions in import paths (TypeScript requirement)
- Ensure all exports are properly re-exported in `index.ts`

### Type Compatibility
- Use type guards for runtime validation
- Be careful with `unknown` vs `any` - prefer `unknown`
- Use utility types for complex transformations

### Performance
- Large type files may slow TypeScript compilation
- Consider splitting very large interfaces
- Use type aliases for commonly used complex types

---

**Created by:** Claude TypeScript Architect Agent  
**Version:** 1.0.0  
**Last Updated:** TypeScript conversion initiative for issue #298