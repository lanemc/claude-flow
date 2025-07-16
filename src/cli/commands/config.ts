#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { ConfigManager } from '../../core/config.js';
import type { CommandContext } from '../cli-core.js';
import type { Config } from '../../utils/types.js';
import { getErrorMessage } from '../../utils/error-handler.js';

// ===== TYPE DEFINITIONS =====

export interface ConfigValidationRule {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  min?: number;
  max?: number;
  enum?: readonly string[];
  pattern?: RegExp;
  description?: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ConfigValidationError[];
  warnings: ConfigValidationWarning[];
}

export interface ConfigValidationError {
  key: string;
  message: string;
  value?: unknown;
}

export interface ConfigValidationWarning {
  key: string;
  message: string;
  value?: unknown;
  suggestion?: string;
}

const CONFIG_VALIDATION_RULES: ConfigValidationRule[] = [
  {
    key: 'orchestrator.maxConcurrentAgents',
    type: 'number',
    min: 1,
    max: 100,
    description: 'Maximum number of concurrent agents'
  },
  {
    key: 'orchestrator.taskQueueSize',
    type: 'number',
    min: 1,
    max: 10000,
    description: 'Maximum task queue size'
  },
  {
    key: 'terminal.poolSize',
    type: 'number',
    min: 1,
    max: 50,
    description: 'Terminal pool size'
  },
  {
    key: 'terminal.type',
    type: 'string',
    enum: ['vscode', 'native', 'auto'] as const,
    description: 'Terminal type'
  },
  {
    key: 'memory.backend',
    type: 'string',
    enum: ['sqlite', 'markdown', 'hybrid'] as const,
    description: 'Memory storage backend'
  },
  {
    key: 'logging.level',
    type: 'string',
    enum: ['debug', 'info', 'warn', 'error'] as const,
    description: 'Logging level'
  }
];

const configManager = ConfigManager.getInstance();

// ===== VALIDATION FUNCTIONS =====

function validateConfigValue(key: string, value: unknown): ConfigValidationResult {
  const errors: ConfigValidationError[] = [];
  const warnings: ConfigValidationWarning[] = [];
  
  const rule = CONFIG_VALIDATION_RULES.find(r => r.key === key);
  if (!rule) {
    warnings.push({
      key,
      message: 'No validation rule found for this key',
      value,
      suggestion: 'Verify this is a valid configuration key'
    });
    return { valid: true, errors, warnings };
  }
  
  // Type validation
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  if (actualType !== rule.type) {
    errors.push({
      key,
      message: `Expected type ${rule.type}, got ${actualType}`,
      value
    });
    return { valid: false, errors, warnings };
  }
  
  // Number validation
  if (rule.type === 'number' && typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      errors.push({
        key,
        message: `Value ${value} is below minimum ${rule.min}`,
        value
      });
    }
    if (rule.max !== undefined && value > rule.max) {
      errors.push({
        key,
        message: `Value ${value} is above maximum ${rule.max}`,
        value
      });
    }
  }
  
  // Enum validation
  if (rule.enum && typeof value === 'string') {
    if (!rule.enum.includes(value)) {
      errors.push({
        key,
        message: `Invalid value '${value}'. Valid options: ${rule.enum.join(', ')}`,
        value
      });
    }
  }
  
  // Pattern validation
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      errors.push({
        key,
        message: `Value '${value}' does not match required pattern`,
        value
      });
    }
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

function parseConfigValue(value: string): unknown {
  // Try to parse as JSON first
  try {
    return JSON.parse(value);
  } catch {
    // If JSON parsing fails, try other conversions
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (value.toLowerCase() === 'null') return null;
    if (value.toLowerCase() === 'undefined') return undefined;
    
    // Try number parsing
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;
    
    // Return as string if all else fails
    return value;
  }
}

export const configCommand = new Command('config')
  .description('Configuration management commands');

// Get command
configCommand
  .command('get')
  .arguments('<key>')
  .description('Get configuration value')
  .action(async (key: string) => {
    try {
      const value = configManager.getValue(key);
      console.log(chalk.green('✓'), `${key}:`, JSON.stringify(value, null, 2));
    } catch (error) {
      console.error(chalk.red('Failed to get configuration:'), (error as Error).message);
      process.exit(1);
    }
  });

// Set command  
configCommand
  .command('set')
  .arguments('<key> <value>')
  .description('Set configuration value')
  .option('--force', 'Skip validation and force set the value')
  .action(async (key: string, value: string, options: { force?: boolean }) => {
    try {
      const parsedValue = parseConfigValue(value);
      
      // Validate unless force flag is used
      if (!options.force) {
        const validation = validateConfigValue(key, parsedValue);
        
        if (!validation.valid) {
          console.error(chalk.red('❌ Validation failed:'));
          validation.errors.forEach(err => {
            console.error(chalk.red('  •'), err.message);
          });
          console.log(chalk.yellow('\nUse --force to skip validation'));
          process.exit(1);
        }
        
        if (validation.warnings.length > 0) {
          console.warn(chalk.yellow('⚠️  Warnings:'));
          validation.warnings.forEach(warn => {
            console.warn(chalk.yellow('  •'), warn.message);
            if (warn.suggestion) {
              console.warn(chalk.gray('    Suggestion:'), warn.suggestion);
            }
          });
          console.log();
        }
      }
      
      await configManager.set(key, parsedValue);
      console.log(chalk.green('✓'), `Configuration updated: ${key} = ${JSON.stringify(parsedValue)}`);
      
      // Show the validation rule if available
      const rule = CONFIG_VALIDATION_RULES.find(r => r.key === key);
      if (rule && rule.description) {
        console.log(chalk.gray('  Description:'), rule.description);
      }
    } catch (error) {
      console.error(chalk.red('Failed to set configuration:'), getErrorMessage(error));
      process.exit(1);
    }
  });

// List command
configCommand
  .command('list')
  .description('List all configuration values')
  .option('--json', 'Output as JSON')
  .action(async (options: any) => {
    try {
      const config = await configManager.getAll();
      
      if (options.json) {
        console.log(JSON.stringify(config, null, 2));
      } else {
        console.log(chalk.cyan.bold('Configuration:'));
        console.log('─'.repeat(40));
        for (const [key, value] of Object.entries(config)) {
          console.log(`${chalk.yellow(key)}: ${JSON.stringify(value)}`);
        }
      }
    } catch (error) {
      console.error(chalk.red('Failed to list configuration:'), (error as Error).message);
      process.exit(1);
    }
  });

// Validate command
configCommand
  .command('validate')
  .description('Validate current configuration')
  .option('--key <key>', 'Validate specific configuration key')
  .action(async (options: { key?: string }) => {
    try {
      const config = await configManager.getAll();
      let totalErrors = 0;
      let totalWarnings = 0;
      
      if (options.key) {
        // Validate specific key
        const value = configManager.getValue(options.key);
        const validation = validateConfigValue(options.key, value);
        
        console.log(chalk.cyan(`Validating: ${options.key}`));
        console.log(chalk.gray(`Value: ${JSON.stringify(value)}`));
        
        if (validation.valid) {
          console.log(chalk.green('✓ Valid'));
        } else {
          console.log(chalk.red('✗ Invalid'));
          validation.errors.forEach(err => {
            console.error(chalk.red('  Error:'), err.message);
          });
        }
        
        validation.warnings.forEach(warn => {
          console.warn(chalk.yellow('  Warning:'), warn.message);
          if (warn.suggestion) {
            console.warn(chalk.gray('    Suggestion:'), warn.suggestion);
          }
        });
      } else {
        // Validate all configuration
        console.log(chalk.cyan('🔍 Validating configuration...\n'));
        
        for (const rule of CONFIG_VALIDATION_RULES) {
          const value = getNestedValue(config, rule.key);
          if (value !== undefined) {
            const validation = validateConfigValue(rule.key, value);
            
            if (validation.valid) {
              console.log(chalk.green('✓'), rule.key, chalk.gray(`(${JSON.stringify(value)})`));
            } else {
              console.log(chalk.red('✗'), rule.key, chalk.gray(`(${JSON.stringify(value)})`));
              validation.errors.forEach(err => {
                console.error(chalk.red('    Error:'), err.message);
                totalErrors++;
              });
            }
            
            validation.warnings.forEach(warn => {
              console.warn(chalk.yellow('    Warning:'), warn.message);
              totalWarnings++;
            });
          }
        }
        
        console.log();
        if (totalErrors === 0 && totalWarnings === 0) {
          console.log(chalk.green('🎉 Configuration is valid!'));
        } else {
          if (totalErrors > 0) {
            console.log(chalk.red(`❌ Found ${totalErrors} error(s)`));
          }
          if (totalWarnings > 0) {
            console.log(chalk.yellow(`⚠️  Found ${totalWarnings} warning(s)`));
          }
        }
      }
    } catch (error) {
      console.error(chalk.red('Failed to validate configuration:'), getErrorMessage(error));
      process.exit(1);
    }
  });

// Reset command
configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .option('--force', 'Skip confirmation')
  .action(async (options: { force?: boolean }) => {
    try {
      if (!options.force) {
        console.log(chalk.yellow('This will reset all configuration to defaults.'));
        console.log(chalk.yellow('Use --force to confirm this action.'));
        return;
      }
      
      await configManager.reset();
      console.log(chalk.green('✓'), 'Configuration reset to defaults');
    } catch (error) {
      console.error(chalk.red('Failed to reset configuration:'), getErrorMessage(error));
      process.exit(1);
    }
  });

// Schema command
configCommand
  .command('schema')
  .description('Show configuration schema and validation rules')
  .action(() => {
    console.log(chalk.cyan('📋 Configuration Schema\n'));
    
    CONFIG_VALIDATION_RULES.forEach(rule => {
      console.log(chalk.yellow(rule.key));
      console.log(chalk.gray(`  Type: ${rule.type}`));
      if (rule.description) {
        console.log(chalk.gray(`  Description: ${rule.description}`));
      }
      if (rule.min !== undefined) {
        console.log(chalk.gray(`  Minimum: ${rule.min}`));
      }
      if (rule.max !== undefined) {
        console.log(chalk.gray(`  Maximum: ${rule.max}`));
      }
      if (rule.enum) {
        console.log(chalk.gray(`  Valid values: ${rule.enum.join(', ')}`));
      }
      if (rule.required) {
        console.log(chalk.red('  Required: true'));
      }
      console.log();
    });
  });

// Helper function to get nested values
function getNestedValue(obj: any, path: string): unknown {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export default configCommand;