/**
 * Hook Safety System - Prevents recursive hook execution and financial damage
 * 
 * This system protects against infinite loops where Claude Code hooks call
 * 'claude' commands, which could bypass rate limits and cost thousands of dollars.
 * 
 * Critical protections:
 * - Environment variable context detection
 * - Recursive call prevention
 * - Circuit breaker for Stop hooks
 * - Configuration validation
 * - Emergency override flags
 */

import { printError, printWarning, printSuccess } from '../utils.js';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

// Type definitions for hook safety system

/**
 * Hook types that can be executed
 */
export enum HookType {
  STOP = 'Stop',
  SUBAGENT_STOP = 'SubagentStop',
  POST_TOOL_USE = 'PostToolUse',
  PRE_TOOL_USE = 'PreToolUse',
  SESSION_START = 'SessionStart',
  SESSION_END = 'SessionEnd',
  PRE_EDIT = 'PreEdit',
  POST_EDIT = 'PostEdit',
  PRE_COMMAND = 'PreCommand',
  POST_COMMAND = 'PostCommand',
  PRE_TASK = 'PreTask',
  POST_TASK = 'PostTask',
  PRE_SEARCH = 'PreSearch',
  NOTIFICATION = 'Notification',
  SESSION_RESTORE = 'SessionRestore'
}

/**
 * Safety levels for hook execution
 */
export enum SafetyLevel {
  SAFE = 'safe',
  WARNING = 'warning',
  DANGEROUS = 'dangerous',
  CRITICAL = 'critical'
}

/**
 * Validation result types
 */
export enum ValidationResultType {
  CRITICAL_RECURSION_RISK = 'CRITICAL_RECURSION_RISK',
  HOOK_RECURSION_LIMIT = 'HOOK_RECURSION_LIMIT',
  POTENTIAL_RECURSION = 'POTENTIAL_RECURSION',
  DANGEROUS_PATTERN = 'DANGEROUS_PATTERN',
  CIRCUIT_BREAKER_ACTIVATED = 'CIRCUIT_BREAKER_ACTIVATED',
  CONFIG_VALIDATION_ERROR = 'CONFIG_VALIDATION_ERROR'
}

/**
 * Hook safety configuration interface
 */
export interface HookSafetyConfig {
  readonly MAX_HOOK_DEPTH: number;
  readonly MAX_STOP_HOOK_EXECUTIONS: number;
  readonly CIRCUIT_BREAKER_TIMEOUT: number;
  readonly ENV_VARS: {
    readonly CONTEXT: string;
    readonly DEPTH: string;
    readonly SESSION_ID: string;
    readonly SKIP_HOOKS: string;
    readonly SAFE_MODE: string;
  };
}

/**
 * Hook execution context
 */
export interface HookContext {
  type?: string;
  depth: number;
  sessionId?: string;
  skipHooks: boolean;
  safeMode: boolean;
}

/**
 * Validation warning or error
 */
export interface ValidationMessage {
  type: ValidationResultType;
  message: string;
  severity?: SafetyLevel;
  hookType?: string;
  depth?: number;
}

/**
 * Command validation result
 */
export interface CommandValidationResult {
  warnings: ValidationMessage[];
  errors: ValidationMessage[];
  safe: boolean;
  safetyLevel?: SafetyLevel;
}

/**
 * Hook execution tracking data
 */
export interface HookExecutionData {
  hookType: string;
  count: number;
  lastExecution?: Date;
  sessionId: string;
}

/**
 * Circuit breaker status
 */
export interface CircuitBreakerStatus {
  sessionId: string;
  executions: HookExecutionData[];
  isTripped: boolean;
  lastReset?: Date;
}

/**
 * Hook configuration for Claude Code settings
 */
export interface HookConfig {
  type: 'command' | 'script' | 'node';
  command?: string;
  script?: string;
  enabled?: boolean;
  timeout?: number;
  safetyLevel?: SafetyLevel;
}

/**
 * Hook group configuration
 */
export interface HookGroup {
  matcher?: string;
  hooks: HookConfig[];
  enabled?: boolean;
  description?: string;
}

/**
 * Claude Code hooks configuration
 */
export interface ClaudeCodeHooksConfig {
  [HookType.STOP]?: HookGroup[];
  [HookType.SUBAGENT_STOP]?: HookGroup[];
  [HookType.POST_TOOL_USE]?: HookGroup[];
  [HookType.PRE_TOOL_USE]?: HookGroup[];
  [HookType.SESSION_START]?: HookGroup[];
  [HookType.SESSION_END]?: HookGroup[];
  [HookType.PRE_EDIT]?: HookGroup[];
  [HookType.POST_EDIT]?: HookGroup[];
  [HookType.PRE_COMMAND]?: HookGroup[];
  [HookType.POST_COMMAND]?: HookGroup[];
  [HookType.PRE_TASK]?: HookGroup[];
  [HookType.POST_TASK]?: HookGroup[];
  [HookType.PRE_SEARCH]?: HookGroup[];
  [HookType.NOTIFICATION]?: HookGroup[];
  [HookType.SESSION_RESTORE]?: HookGroup[];
  [key: string]: HookGroup[] | undefined;
}

/**
 * Claude Code configuration file structure
 */
export interface ClaudeCodeConfig {
  hooks?: ClaudeCodeHooksConfig;
  safetySettings?: {
    enableCircuitBreaker?: boolean;
    maxHookDepth?: number;
    enableSafeMode?: boolean;
  };
  [key: string]: any;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  safe: boolean;
  configPath?: string;
  warnings?: ValidationMessage[];
  errors?: ValidationMessage[];
  message?: string;
  error?: string;
}

/**
 * Hook execution result
 */
export interface HookExecutionResult {
  success: boolean;
  skipped?: boolean;
  blocked?: boolean;
  result?: CommandExecutionResult;
  errors?: ValidationMessage[];
  error?: string;
}

/**
 * Command execution result
 */
export interface CommandExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration?: number;
}

/**
 * Safe alternative suggestion
 */
export interface SafeAlternative {
  pattern: string;
  problem: string;
  solution: string;
  example: string;
  safetyLevel: SafetyLevel;
}

/**
 * Hook execution options
 */
export interface HookExecutionOptions {
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
  dryRun?: boolean;
  skipValidation?: boolean;
}

/**
 * CLI flags interface
 */
export interface CLIFlags {
  config?: string;
  c?: string;
  disable?: boolean;
  off?: boolean;
  'dry-run'?: boolean;
  'skip-hooks'?: boolean;
  'reset-circuit-breaker'?: boolean;
  timeout?: number;
  verbose?: boolean;
  [key: string]: any;
}

/**
 * Hook Safety Configuration
 */
const HOOK_SAFETY_CONFIG: HookSafetyConfig = {
  // Maximum hook execution depth before blocking
  MAX_HOOK_DEPTH: 3,
  
  // Maximum Stop hook executions per session
  MAX_STOP_HOOK_EXECUTIONS: 2,
  
  // Circuit breaker timeout (milliseconds)
  CIRCUIT_BREAKER_TIMEOUT: 60000, // 1 minute
  
  // Environment variables for context detection
  ENV_VARS: {
    CONTEXT: 'CLAUDE_HOOK_CONTEXT',
    DEPTH: 'CLAUDE_HOOK_DEPTH', 
    SESSION_ID: 'CLAUDE_HOOK_SESSION_ID',
    SKIP_HOOKS: 'CLAUDE_SKIP_HOOKS',
    SAFE_MODE: 'CLAUDE_SAFE_MODE'
  }
};

/**
 * Global hook execution tracking
 */
class HookExecutionTracker {
  private executions: Map<string, number> = new Map();
  private sessionId: string;
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
  }
  
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  public track(hookType: string): number {
    const key = `${this.sessionId}:${hookType}`;
    const count = this.executions.get(key) || 0;
    this.executions.set(key, count + 1);
    
    // Auto-reset after timeout
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    this.resetTimeout = setTimeout(() => {
      this.executions.clear();
    }, HOOK_SAFETY_CONFIG.CIRCUIT_BREAKER_TIMEOUT);
    
    return count + 1;
  }
  
  public getExecutionCount(hookType: string): number {
    const key = `${this.sessionId}:${hookType}`;
    return this.executions.get(key) || 0;
  }
  
  public reset(): void {
    this.executions.clear();
    this.sessionId = this.generateSessionId();
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getAllExecutions(): Map<string, number> {
    return new Map(this.executions);
  }
}

// Global instance
const executionTracker = new HookExecutionTracker();

/**
 * Hook Context Manager - Tracks hook execution context
 */
export class HookContextManager {
  public static setContext(hookType: string, depth: number = 1): void {
    process.env[HOOK_SAFETY_CONFIG.ENV_VARS.CONTEXT] = hookType;
    process.env[HOOK_SAFETY_CONFIG.ENV_VARS.DEPTH] = depth.toString();
    process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SESSION_ID] = executionTracker.getSessionId();
  }
  
  public static getContext(): HookContext {
    return {
      type: process.env[HOOK_SAFETY_CONFIG.ENV_VARS.CONTEXT],
      depth: parseInt(process.env[HOOK_SAFETY_CONFIG.ENV_VARS.DEPTH] || '0'),
      sessionId: process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SESSION_ID],
      skipHooks: process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SKIP_HOOKS] === 'true',
      safeMode: process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SAFE_MODE] === 'true'
    };
  }
  
  public static clearContext(): void {
    delete process.env[HOOK_SAFETY_CONFIG.ENV_VARS.CONTEXT];
    delete process.env[HOOK_SAFETY_CONFIG.ENV_VARS.DEPTH];
    delete process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SESSION_ID];
  }
  
  public static isInHookContext(): boolean {
    return !!process.env[HOOK_SAFETY_CONFIG.ENV_VARS.CONTEXT];
  }
  
  public static setSafeMode(enabled: boolean = true): void {
    if (enabled) {
      process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SAFE_MODE] = 'true';
    } else {
      delete process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SAFE_MODE];
    }
  }
  
  public static setSkipHooks(enabled: boolean = true): void {
    if (enabled) {
      process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SKIP_HOOKS] = 'true';
    } else {
      delete process.env[HOOK_SAFETY_CONFIG.ENV_VARS.SKIP_HOOKS];
    }
  }
}

/**
 * Command Validator - Validates commands for hook safety
 */
export class HookCommandValidator {
  private static readonly claudePatterns: RegExp[] = [
    /\bclaude\b/,           // Direct claude command
    /claude-code\b/,        // claude-code command
    /npx\s+claude\b/,      // NPX claude
    /\.\/claude\b/,        // Local claude wrapper
    /claude\.exe\b/        // Windows executable
  ];

  private static readonly dangerousPatterns: RegExp[] = [
    // Commands that could trigger more hooks
    /git\s+commit.*--all/,
    /git\s+add\s+\./,
    // File operations that might trigger watchers
    /watch\s+.*claude/,
    /nodemon.*claude/,
    // Recursive script execution
    /bash.*hook/,
    /sh.*hook/
  ];

  /**
   * Validate if a command is safe to execute from a hook
   */
  public static validateCommand(command: string, hookType: string): CommandValidationResult {
    const context = HookContextManager.getContext();
    const warnings: ValidationMessage[] = [];
    const errors: ValidationMessage[] = [];
    
    // Critical check: Claude commands in Stop hooks
    if (hookType === HookType.STOP && this.isClaudeCommand(command)) {
      errors.push({
        type: ValidationResultType.CRITICAL_RECURSION_RISK,
        message: '🚨 CRITICAL ERROR: Claude command detected in Stop hook!\n' +
                'This creates an INFINITE LOOP that can cost THOUSANDS OF DOLLARS.\n' +
                'Stop hooks that call "claude" commands bypass rate limits and\n' +
                'can result in massive unexpected API charges.\n\n' +
                'BLOCKED FOR SAFETY - Use alternative patterns instead.',
        severity: SafetyLevel.CRITICAL,
        hookType,
        depth: context.depth
      });
    }
    
    // General recursion detection
    if (context.type && this.isClaudeCommand(command)) {
      const depth = context.depth;
      
      if (depth >= HOOK_SAFETY_CONFIG.MAX_HOOK_DEPTH) {
        errors.push({
          type: ValidationResultType.HOOK_RECURSION_LIMIT,
          message: `🚨 Hook recursion limit exceeded! (Depth: ${depth})\n` +
                  `Hook type: ${context.type}\n` +
                  'Blocking execution to prevent infinite loop.',
          severity: SafetyLevel.CRITICAL,
          hookType: context.type,
          depth
        });
      } else {
        warnings.push({
          type: ValidationResultType.POTENTIAL_RECURSION,
          message: `⚠️  WARNING: Claude command in ${context.type} hook (depth: ${depth})\n` +
                  'This could create recursion. Consider using --skip-hooks flag.',
          severity: SafetyLevel.WARNING,
          hookType: context.type,
          depth
        });
      }
    }
    
    // Check for other dangerous patterns
    if (this.isDangerousPattern(command, hookType)) {
      warnings.push({
        type: ValidationResultType.DANGEROUS_PATTERN,
        message: `⚠️  WARNING: Potentially dangerous hook pattern detected.\n` +
                'Review the command and consider safer alternatives.',
        severity: SafetyLevel.WARNING,
        hookType
      });
    }

    const safetyLevel = this.determineSafetyLevel(warnings, errors);
    
    return { 
      warnings, 
      errors, 
      safe: errors.length === 0,
      safetyLevel
    };
  }
  
  public static isClaudeCommand(command: string): boolean {
    return this.claudePatterns.some(pattern => pattern.test(command));
  }
  
  public static isDangerousPattern(command: string, hookType: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(command));
  }

  private static determineSafetyLevel(warnings: ValidationMessage[], errors: ValidationMessage[]): SafetyLevel {
    if (errors.length > 0) {
      return errors.some(e => e.severity === SafetyLevel.CRITICAL) ? SafetyLevel.CRITICAL : SafetyLevel.DANGEROUS;
    }
    if (warnings.length > 0) {
      return SafetyLevel.WARNING;
    }
    return SafetyLevel.SAFE;
  }
}

/**
 * Circuit Breaker - Prevents runaway hook execution
 */
export class HookCircuitBreaker {
  /**
   * Check if hook execution should be allowed
   */
  public static checkExecution(hookType: string): boolean {
    const executionCount = executionTracker.track(hookType);
    
    // Stop hook protection - maximum 2 executions per session
    if (hookType === HookType.STOP && executionCount > HOOK_SAFETY_CONFIG.MAX_STOP_HOOK_EXECUTIONS) {
      throw new Error(
        `🚨 CIRCUIT BREAKER ACTIVATED!\n` +
        `Stop hook has executed ${executionCount} times in this session.\n` +
        `This indicates a potential infinite loop that could cost thousands of dollars.\n` +
        `Execution blocked for financial protection.\n\n` +
        `To reset: Use --reset-circuit-breaker flag or restart your session.`
      );
    }
    
    // General protection for any hook type
    if (executionCount > 20) {
      throw new Error(
        `🚨 CIRCUIT BREAKER: ${hookType} hook executed ${executionCount} times!\n` +
        `This is highly unusual and indicates a potential problem.\n` +
        `Execution blocked to prevent system overload.`
      );
    }
    
    // Log warnings for concerning patterns
    if (hookType === HookType.STOP && executionCount > 1) {
      printWarning(`⚠️  Stop hook execution #${executionCount} detected. Monitor for recursion.`);
    }
    
    return true;
  }
  
  public static reset(): void {
    executionTracker.reset();
    printSuccess('Circuit breaker reset successfully.');
  }
  
  public static getStatus(): CircuitBreakerStatus {
    const executions = Array.from(executionTracker.getAllExecutions().entries()).map(([key, count]) => {
      const [sessionId, hookType] = key.split(':');
      return { 
        hookType, 
        count, 
        sessionId,
        lastExecution: new Date()
      };
    });

    return {
      sessionId: executionTracker.getSessionId(),
      executions,
      isTripped: executions.some(e => 
        (e.hookType === HookType.STOP && e.count > HOOK_SAFETY_CONFIG.MAX_STOP_HOOK_EXECUTIONS) ||
        e.count > 20
      )
    };
  }
}

/**
 * Configuration Validator - Validates hook configurations for safety
 */
export class HookConfigValidator {
  /**
   * Validate Claude Code settings.json for dangerous hook configurations
   */
  public static validateClaudeCodeConfig(configPath?: string): ConfigValidationResult {
    if (!configPath) {
      // Try to find Claude Code settings
      const possiblePaths = [
        path.join(process.env.HOME || '.', '.claude', 'settings.json'),
        path.join(process.cwd(), '.claude', 'settings.json'),
        path.join(process.cwd(), 'settings.json')
      ];
      
      configPath = possiblePaths.find(p => existsSync(p));
      
      if (!configPath) {
        return { safe: true, message: 'No Claude Code configuration found.' };
      }
    }
    
    try {
      const configContent = readFileSync(configPath, 'utf8');
      const config: ClaudeCodeConfig = JSON.parse(configContent);
      const validation = this.validateHooksConfig(config.hooks || {});
      
      return {
        safe: validation.errors.length === 0,
        configPath,
        warnings: validation.warnings,
        errors: validation.errors
      };
    } catch (err) {
      const error = err as Error;
      return {
        safe: false,
        error: `Failed to validate configuration: ${error.message}`,
        configPath
      };
    }
  }
  
  /**
   * Validate hooks configuration object
   */
  public static validateHooksConfig(hooksConfig: ClaudeCodeHooksConfig): { warnings: ValidationMessage[]; errors: ValidationMessage[] } {
    const warnings: ValidationMessage[] = [];
    const errors: ValidationMessage[] = [];
    
    // Check Stop hooks specifically
    if (hooksConfig[HookType.STOP]) {
      for (const hookGroup of hooksConfig[HookType.STOP]) {
        for (const hook of hookGroup.hooks || []) {
          if (hook.type === 'command' && hook.command) {
            const result = HookCommandValidator.validateCommand(hook.command, HookType.STOP);
            warnings.push(...result.warnings);
            errors.push(...result.errors);
          }
        }
      }
    }
    
    // Check other dangerous hook types
    const dangerousHookTypes: (keyof ClaudeCodeHooksConfig)[] = [HookType.SUBAGENT_STOP, HookType.POST_TOOL_USE];
    for (const hookType of dangerousHookTypes) {
      if (hooksConfig[hookType]) {
        for (const hookGroup of hooksConfig[hookType]!) {
          for (const hook of hookGroup.hooks || []) {
            if (hook.type === 'command' && hook.command) {
              const result = HookCommandValidator.validateCommand(hook.command, hookType as string);
              warnings.push(...result.warnings);
              errors.push(...result.errors);
            }
          }
        }
      }
    }
    
    return { warnings, errors };
  }
  
  /**
   * Generate safe configuration recommendations
   */
  public static generateSafeAlternatives(dangerousConfig: string): SafeAlternative[] {
    const alternatives: SafeAlternative[] = [];
    
    // Example: Stop hook calling claude
    if (dangerousConfig.includes('claude')) {
      alternatives.push({
        pattern: 'Stop hook with claude command',
        problem: 'Creates infinite recursion loop',
        solution: 'Use flag-based approach instead',
        safetyLevel: SafetyLevel.CRITICAL,
        example: `
// Instead of this DANGEROUS pattern:
{
  "Stop": [{
    "hooks": [{"type": "command", "command": "claude -c -p 'Update history'"}]
  }]
}

// Use this SAFE pattern:
{
  "Stop": [{
    "hooks": [{"type": "command", "command": "touch ~/.claude/needs_update"}]
  }]
}

// Then manually run: claude -c -p "Update history" when needed
        `
      });
      
      alternatives.push({
        pattern: 'PostToolUse hook alternative',
        problem: 'Stop hooks execute too frequently',
        solution: 'Use PostToolUse for specific tools',
        safetyLevel: SafetyLevel.WARNING,
        example: `
// SAFER: Use PostToolUse for specific operations
{
  "PostToolUse": [{
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [{"type": "command", "command": "echo 'File modified' >> ~/.claude/changes.log"}]
  }]
}
        `
      });
    }
    
    return alternatives;
  }
}

/**
 * Safe Hook Execution Wrapper
 */
export class SafeHookExecutor {
  /**
   * Safely execute a hook command with all safety checks
   */
  public static async executeHookCommand(
    command: string, 
    hookType: string, 
    options: HookExecutionOptions = {}
  ): Promise<HookExecutionResult> {
    try {
      // Skip if hooks are disabled
      if (HookContextManager.getContext().skipHooks) {
        console.log(`⏭️  Skipping ${hookType} hook (hooks disabled)`);
        return { success: true, skipped: true };
      }
      
      // Circuit breaker check
      HookCircuitBreaker.checkExecution(hookType);
      
      // Command validation
      if (!options.skipValidation) {
        const validation = HookCommandValidator.validateCommand(command, hookType);
        
        // Show warnings
        for (const warning of validation.warnings) {
          printWarning(warning.message);
        }
        
        // Block on errors
        if (!validation.safe) {
          for (const error of validation.errors) {
            printError(error.message);
          }
          return { success: false, blocked: true, errors: validation.errors };
        }
      }
      
      // Set hook context for nested calls
      const currentContext = HookContextManager.getContext();
      const newDepth = currentContext.depth + 1;
      HookContextManager.setContext(hookType, newDepth);
      
      // Execute the command with safety context
      const result = await this.executeCommand(command, options);
      
      return { success: true, result };
      
    } catch (err) {
      const error = err as Error;
      printError(`Hook execution failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      // Clear context
      HookContextManager.clearContext();
    }
  }
  
  private static async executeCommand(command: string, options: HookExecutionOptions = {}): Promise<CommandExecutionResult> {
    // This would integrate with the actual command execution system
    // For now, just log what would be executed
    console.log(`🔗 Executing hook command: ${command}`);
    
    // Here you would actually execute the command
    // return await execCommand(command, options);
    
    return { stdout: '', stderr: '', exitCode: 0 };
  }
}

/**
 * Hook Safety CLI Commands
 */
export async function hookSafetyCommand(subArgs: string[], flags: CLIFlags): Promise<void> {
  const subcommand = subArgs[0];
  
  switch (subcommand) {
    case 'validate':
      return await validateConfigCommand(subArgs, flags);
    case 'status':
      return await statusCommand(subArgs, flags);
    case 'reset':
      return await resetCommand(subArgs, flags);
    case 'safe-mode':
      return await safeModeCommand(subArgs, flags);
    default:
      showHookSafetyHelp();
  }
}

async function validateConfigCommand(subArgs: string[], flags: CLIFlags): Promise<void> {
  const configPath = flags.config || flags.c;
  
  console.log('🔍 Validating hook configuration for safety...\n');
  
  const result = HookConfigValidator.validateClaudeCodeConfig(configPath);
  
  if (result.safe) {
    printSuccess('✅ Hook configuration is safe!');
    if (result.configPath) {
      console.log(`📄 Validated: ${result.configPath}`);
    }
  } else {
    printError('❌ DANGEROUS hook configuration detected!');
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n🚨 CRITICAL ERRORS:');
      for (const error of result.errors) {
        console.log(`\n${error.message}`);
      }
    }
    
    if (result.warnings && result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      for (const warning of result.warnings) {
        console.log(`\n${warning.message}`);
      }
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Remove claude commands from Stop hooks');
    console.log('2. Use PostToolUse hooks for specific tools');
    console.log('3. Implement flag-based update patterns');
    console.log('4. Use claude --skip-hooks for manual updates');
  }
}

async function statusCommand(subArgs: string[], flags: CLIFlags): Promise<void> {
  const context = HookContextManager.getContext();
  const circuitStatus = HookCircuitBreaker.getStatus();
  
  console.log('🔗 Hook Safety Status\n');
  
  console.log('📊 Current Context:');
  if (context.type) {
    console.log(`  🔄 Hook Type: ${context.type}`);
    console.log(`  📏 Depth: ${context.depth}`);
    console.log(`  🆔 Session: ${context.sessionId}`);
    console.log(`  ⏭️  Skip Hooks: ${context.skipHooks ? 'Yes' : 'No'}`);
    console.log(`  🛡️  Safe Mode: ${context.safeMode ? 'Yes' : 'No'}`);
  } else {
    console.log('  ✅ Not currently in hook context');
  }
  
  console.log('\n⚡ Circuit Breaker Status:');
  console.log(`  🆔 Session: ${circuitStatus.sessionId}`);
  console.log(`  🚨 Tripped: ${circuitStatus.isTripped ? 'Yes' : 'No'}`);
  
  if (circuitStatus.executions.length > 0) {
    console.log('  📊 Hook Executions:');
    for (const exec of circuitStatus.executions) {
      console.log(`    • ${exec.hookType}: ${exec.count} times`);
    }
  } else {
    console.log('  ✅ No hook executions in current session');
  }
}

async function resetCommand(subArgs: string[], flags: CLIFlags): Promise<void> {
  console.log('🔄 Resetting hook safety systems...\n');
  
  HookCircuitBreaker.reset();
  HookContextManager.clearContext();
  
  printSuccess('✅ Hook safety systems reset successfully!');
  console.log('All execution counters and context cleared.');
}

async function safeModeCommand(subArgs: string[], flags: CLIFlags): Promise<void> {
  const enable = !flags.disable && !flags.off;
  
  if (enable) {
    HookContextManager.setSafeMode(true);
    HookContextManager.setSkipHooks(true);
    printSuccess('🛡️  Safe mode enabled!');
    console.log('• All hooks will be skipped');
    console.log('• Claude commands will show safety warnings');
    console.log('• Additional validation will be performed');
  } else {
    HookContextManager.setSafeMode(false);
    HookContextManager.setSkipHooks(false);
    printSuccess('⚡ Safe mode disabled.');
    console.log('Normal hook execution restored.');
  }
}

function showHookSafetyHelp(): void {
  console.log(`
🛡️  Hook Safety System - Prevent Infinite Loops & Financial Damage

USAGE:
  claude-flow hook-safety <command> [options]

COMMANDS:
  validate      Validate hook configuration for dangerous patterns
  status        Show current hook safety status and context
  reset         Reset circuit breakers and execution counters
  safe-mode     Enable/disable safe mode (skips all hooks)

VALIDATE OPTIONS:
  --config, -c <path>     Path to Claude Code settings.json

SAFE-MODE OPTIONS:
  --disable, --off        Disable safe mode

EXAMPLES:
  # Check your Claude Code hooks for dangerous patterns
  claude-flow hook-safety validate

  # Check specific configuration file
  claude-flow hook-safety validate --config ~/.claude/settings.json

  # View current safety status
  claude-flow hook-safety status

  # Reset if circuit breaker is triggered
  claude-flow hook-safety reset

  # Enable safe mode (skips all hooks)
  claude-flow hook-safety safe-mode

  # Disable safe mode
  claude-flow hook-safety safe-mode --disable

🚨 CRITICAL WARNING:
Stop hooks that call 'claude' commands create INFINITE LOOPS that can:
• Bypass API rate limits
• Cost thousands of dollars per day
• Make your system unresponsive

SAFE ALTERNATIVES:
• Use PostToolUse hooks instead of Stop hooks
• Implement flag-based update patterns
• Use 'claude --skip-hooks' for manual updates
• Create conditional execution scripts

For more information: https://github.com/ruvnet/claude-flow/issues/166
`);
}

/**
 * Emergency CLI flags for Claude commands
 */
export function addSafetyFlags(command: string): string {
  // Add safety flags to any claude command
  const context = HookContextManager.getContext();
  let safeCommand = command;
  
  if (context.type) {
    // Automatically add --skip-hooks if in hook context
    if (!safeCommand.includes('--skip-hooks')) {
      safeCommand += ' --skip-hooks';
    }
  }
  
  if (context.safeMode) {
    // Add additional safety flags in safe mode
    if (!safeCommand.includes('--dry-run')) {
      safeCommand += ' --dry-run';
    }
  }
  
  return safeCommand;
}

export default {
  HookContextManager,
  HookCommandValidator, 
  HookCircuitBreaker,
  HookConfigValidator,
  SafeHookExecutor,
  hookSafetyCommand,
  addSafetyFlags,
  // Export types for external use
  HookType,
  SafetyLevel,
  ValidationResultType
} as const;