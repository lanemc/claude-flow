/**
 * Process UI - Simple process management UI in TypeScript
 * Converted from JavaScript with proper type definitions
 */

import { printSuccess, printError, printWarning, printInfo } from '../utils.js';
import { Deno, cwd, exit, existsSync } from '../node-compat.js';
import * as process from 'process';

// Type definitions for UI functionality
interface ProcessDefinition {
  id: string;
  name: string;
  description: string;
}

interface ProcessState extends ProcessDefinition {
  status: 'stopped' | 'starting' | 'running' | 'error';
  pid: number | null;
  uptime: number;
  cpu: number;
  memory: number;
}

interface ColorFunctions {
  cyan: (text: string) => string;
  gray: (text: string) => string;
  white: (text: string) => string;
  yellow: (text: string) => string;
  green: (text: string) => string;
  red: (text: string) => string;
}

// Simple color utilities
const colors: ColorFunctions = {
  cyan: (text: string): string => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string): string => `\x1b[90m${text}\x1b[0m`,
  white: (text: string): string => `\x1b[37m${text}\x1b[0m`,
  yellow: (text: string): string => `\x1b[33m${text}\x1b[0m`,
  green: (text: string): string => `\x1b[32m${text}\x1b[0m`,
  red: (text: string): string => `\x1b[31m${text}\x1b[0m`
};

const PROCESSES: ProcessDefinition[] = [
  { id: 'event-bus', name: 'Event Bus', description: 'Central event distribution system' },
  { id: 'orchestrator', name: 'Orchestrator', description: 'Main coordination engine' },
  { id: 'memory-manager', name: 'Memory Manager', description: 'Persistent memory system' },
  { id: 'terminal-pool', name: 'Terminal Pool', description: 'Terminal session management' },
  { id: 'mcp-server', name: 'MCP Server', description: 'Model Context Protocol server' },
  { id: 'coordinator', name: 'Coordinator', description: 'Task coordination service' }
];

export class ProcessUI {
  private processes: Map<string, ProcessState>;
  private running: boolean;
  private selectedIndex: number;

  constructor() {
    this.processes = new Map<string, ProcessState>();
    this.running = true;
    this.selectedIndex = 0;
    
    // Initialize process states
    PROCESSES.forEach((p: ProcessDefinition) => {
      this.processes.set(p.id, {
        ...p,
        status: 'stopped',
        pid: null,
        uptime: 0,
        cpu: 0,
        memory: 0
      });
    });
  }
  
  async start(): Promise<void> {
    // Clear screen
    console.clear();
    
    // Show welcome
    printSuccess('🧠 Claude-Flow Process Management UI v1.0.43');
    console.log('─'.repeat(60));
    console.log();
    
    // Initial render
    this.render();
    
    // Main UI loop
    while (this.running) {
      await this.handleInput();
      if (this.running) {
        // Only re-render if still running
        this.render();
      }
    }
  }
  
  private render(): void {
    // Clear screen and move cursor to top
    console.log('\x1b[2J\x1b[H');
    
    // Header
    console.log(colors.cyan('🧠 Claude-Flow Process Manager'));
    console.log(colors.gray('─'.repeat(60)));
    console.log();
    
    // Process list
    console.log(colors.white('Processes:'));
    console.log();
    
    let index = 0;
    for (const [id, processInfo] of Array.from(this.processes.entries())) {
      const selected = index === this.selectedIndex;
      const prefix = selected ? colors.yellow('▶ ') : '  ';
      const status = this.getStatusIcon(processInfo.status);
      const name = selected ? colors.yellow(processInfo.name) : colors.white(processInfo.name);
      
      console.log(`${prefix}[${index + 1}] ${status} ${name}`);
      console.log(`     ${colors.gray(processInfo.description)}`);
      
      if (processInfo.status === 'running') {
        console.log(`     ${colors.gray(`PID: ${processInfo.pid} | Uptime: ${this.formatUptime(processInfo.uptime)}`)}`);
      }
      console.log();
      
      index++;
    }
    
    // Controls
    console.log(colors.gray('─'.repeat(60)));
    console.log(colors.white('Controls:'));
    console.log(`  ${colors.yellow('1-6')} Select process   ${colors.yellow('Space/Enter')} Toggle selected`);
    console.log(`  ${colors.yellow('A')} Start all         ${colors.yellow('Z')} Stop all`);
    console.log(`  ${colors.yellow('R')} Restart all       ${colors.yellow('Q')} Quit`);
    console.log();
    console.log(colors.gray('─'.repeat(60)));
  }
  
  private getStatusIcon(status: ProcessState['status']): string {
    switch (status) {
      case 'running': return colors.green('●');
      case 'stopped': return colors.gray('○');
      case 'error': return colors.red('✗');
      case 'starting': return colors.yellow('◐');
      default: return colors.gray('?');
    }
  }
  
  private formatUptime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  }
  
  private async handleInput(): Promise<void> {
    // Simple input reading
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    
    await Deno.stdout.write(encoder.encode('\nCommand: '));
    
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    if (n === null) return;
    
    const rawInput = decoder.decode(buf.subarray(0, n)).trim();
    // Take only the first line if multiple lines were read
    const input = rawInput.split('\n')[0].toLowerCase();
    
    // Handle commands
    switch (input) {
      case 'q':
      case 'quit':
        this.running = false;
        console.clear();
        printSuccess('Goodbye!');
        Deno.exit(0);  // Exit immediately
        break;
        
      case 'a':
        await this.startAll();
        break;
        
      case 'z':
        await this.stopAll();
        break;
        
      case 'r':
        await this.restartAll();
        break;
        
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        const index = parseInt(input) - 1;
        if (index >= 0 && index < PROCESSES.length) {
          this.selectedIndex = index;
          await this.toggleSelected();
        }
        break;
        
      case ' ':
      case 'enter':
      case '':
        await this.toggleSelected();
        break;
        
      default:
        if (input) {
          console.log(colors.yellow(`Unknown command: ${input}`));
          await new Promise<void>(resolve => setTimeout(resolve, 1000));
        }
    }
  }
  
  private async toggleSelected(): Promise<void> {
    const process = Array.from(this.processes.values())[this.selectedIndex];
    if (process.status === 'stopped') {
      await this.startProcess(process.id);
    } else {
      await this.stopProcess(process.id);
    }
  }
  
  private async startProcess(id: string): Promise<void> {
    const process = this.processes.get(id);
    if (!process) return;
    
    console.log(colors.yellow(`Starting ${process.name}...`));
    process.status = 'starting';
    
    // Simulate startup
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    process.status = 'running';
    process.pid = Math.floor(Math.random() * 10000) + 1000;
    process.uptime = 0;
    
    console.log(colors.green(`✓ ${process.name} started`));
    
    // Start uptime counter
    const interval = setInterval(() => {
      if (process.status === 'running') {
        process.uptime++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  
  private async stopProcess(id: string): Promise<void> {
    const process = this.processes.get(id);
    if (!process) return;
    
    console.log(colors.yellow(`Stopping ${process.name}...`));
    process.status = 'stopped';
    process.pid = null;
    process.uptime = 0;
    
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    console.log(colors.green(`✓ ${process.name} stopped`));
  }
  
  private async startAll(): Promise<void> {
    console.log(colors.yellow('Starting all processes...'));
    for (const [id, processInfo] of Array.from(this.processes.entries())) {
      if (processInfo.status === 'stopped') {
        await this.startProcess(id);
      }
    }
    console.log(colors.green('✓ All processes started'));
  }
  
  private async stopAll(): Promise<void> {
    console.log(colors.yellow('Stopping all processes...'));
    for (const [id, processInfo] of Array.from(this.processes.entries())) {
      if (processInfo.status === 'running') {
        await this.stopProcess(id);
      }
    }
    console.log(colors.green('✓ All processes stopped'));
  }
  
  private async restartAll(): Promise<void> {
    await this.stopAll();
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    await this.startAll();
  }
}

export async function launchProcessUI(): Promise<void> {
  const ui = new ProcessUI();
  await ui.start();
}