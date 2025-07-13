// CLI-specific type definitions

export interface SpawnCommandFlags {
  tools?: string;
  noPermissions?: boolean;
  config?: string;
  mode?: string;
  parallel?: boolean;
  research?: boolean;
  coverage?: number;
  commit?: string;
  verbose?: boolean;
  dryRun?: boolean;
}

export interface SwarmCommandFlags {
  strategy?: string;
  mode?: string;
  agents?: number;
  timeout?: number;
  memory?: string;
  verbose?: boolean;
  dryRun?: boolean;
  config?: string;
}

export interface StartCommandFlags {
  tools?: string;
  port?: number;
  verbose?: boolean;
  debug?: boolean;
  config?: string;
}

export interface InitCommandFlags {
  template?: string;
  force?: boolean;
  verbose?: boolean;
  skipInstall?: boolean;
}

export interface MemoryCommandFlags {
  namespace?: string;
  format?: 'json' | 'table' | 'markdown';
  limit?: number;
  verbose?: boolean;
}

export interface TaskCommandFlags {
  priority?: string;
  agent?: string;
  timeout?: number;
  verbose?: boolean;
}

export interface CLICommandOptions {
  tools?: string;
  noPermissions?: boolean;
  config?: string;
  mode?: string;
  parallel?: boolean;
  research?: boolean;
  coverage?: number;
  commit?: string;
  verbose?: boolean;
  dryRun?: boolean;
  port?: number;
  debug?: boolean;
  strategy?: string;
  agents?: number;
  timeout?: number;
  memory?: string;
  template?: string;
  force?: boolean;
  skipInstall?: boolean;
  namespace?: string;
  format?: string;
  limit?: number;
  priority?: string;
  agent?: string;
}

// Command handler type
export type CommandHandler = (args: string[], options: CLICommandOptions) => Promise<void> | void;

// Command definition
export interface Command {
  name: string;
  description: string;
  handler: CommandHandler;
  options?: Array<{
    flag: string;
    description: string;
    type?: 'string' | 'number' | 'boolean';
    default?: any;
  }>;
}