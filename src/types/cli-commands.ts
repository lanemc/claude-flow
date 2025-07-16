// CLI Command Types for TypeScript Safety
export interface CommandFlags {
  [key: string]: string | number | boolean | undefined;
  // Common flags
  help?: boolean;
  h?: boolean;
  verbose?: boolean;
  v?: boolean;
  dryRun?: boolean;
  'dry-run'?: boolean;
  d?: boolean;
  config?: string;
  c?: string;
  
  // Agent flags
  name?: string;
  type?: string;
  tools?: string;
  noPermissions?: boolean;
  mode?: string;
  parallel?: boolean;
  research?: boolean;
  coverage?: boolean;
  commit?: boolean;
  
  // Swarm flags
  strategy?: string;
  maxAgents?: number;
  'max-agents'?: number;
  maxDepth?: number;
  'max-depth'?: number;
  timeout?: number;
  review?: boolean;
  coordinator?: boolean;
  monitor?: boolean;
  ui?: boolean;
  background?: boolean;
  persistence?: boolean;
  distributed?: boolean;
  memoryNamespace?: string;
  'memory-namespace'?: string;
}

export interface CommandContext {
  args: string[];
  flags: CommandFlags;
  rawArgs?: string[];
}

export interface Command {
  name: string | (() => string);
  aliases?: string[];
  description?: string;
  action?: (ctx: CommandContext) => Promise<void> | void;
  parse?: (args: string[]) => CommandContext;
}

export interface SwarmStrategy {
  name: 'auto' | 'research' | 'development' | 'analysis';
  description: string;
  agentTypes: string[];
  maxAgents: number;
}

export interface SwarmOptions {
  strategy: string;
  maxAgents: number;
  maxDepth: number;
  research: boolean;
  parallel: boolean;
  memoryNamespace: string;
  timeout: number;
  review: boolean;
  coordinator: boolean;
  config?: string;
  verbose: boolean;
  dryRun: boolean;
  monitor: boolean;
  ui: boolean;
  background: boolean;
  persistence: boolean;
  distributed: boolean;
}

export interface AgentCapability {
  name: string;
  description: string;
  tools: string[];
  permissions: string[];
}

export interface AgentType {
  name: string;
  description: string;
  capabilities: AgentCapability[];
  defaultTools: string[];
}

// CLI Response Types
export interface CLIResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: string[];
}

// Validation Types
export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  validate: (value: any) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
