/**
 * Safe Interactive Wrapper - Handles interactive commands in non-interactive environments
 */

import chalk from 'chalk';
import { isInteractive, isRawModeSupported, getEnvironmentType } from './interactive-detector.js';

// Type declarations
interface WrapperOptions {
  silent?: boolean;
}

interface ProgressControl {
  update: (newMessage: string) => void;
  succeed: (finalMessage?: string) => void;
  fail: (errorMessage?: string) => void;
}

interface CommandFlags {
  nonInteractive?: boolean;
  'no-interactive'?: boolean;
  [key: string]: any;
}

/**
 * Wraps an interactive function with safety checks
 * @param {Function} interactiveFn - The interactive function to wrap
 * @param {Function} fallbackFn - The non-interactive fallback function
 * @param {WrapperOptions} options - Options for the wrapper
 * @returns {Function} The wrapped function
 */
export function safeInteractive<T extends any[], R>(
  interactiveFn: (...args: T) => Promise<R> | R,
  fallbackFn?: (...args: T) => Promise<R> | R,
  options: WrapperOptions = {}
): (...args: T) => Promise<R> {
  return async function(...args: T): Promise<R> {
    const flags = (args[args.length - 1] as CommandFlags) || {};
    
    // Check if user explicitly requested non-interactive mode
    if (flags.nonInteractive || flags['no-interactive']) {
      if (fallbackFn) {
        return fallbackFn(...args);
      } else {
        console.log(chalk.yellow('⚠️  Non-interactive mode requested but no fallback available'));
        console.log(chalk.gray('This command requires interactive mode to function properly'));
        process.exit(1);
      }
    }
    
    // Auto-detect if we should use non-interactive mode
    if (!isInteractive() || !isRawModeSupported()) {
      const envType = getEnvironmentType();
      
      if (!options.silent) {
        console.log(chalk.yellow('\n⚠️  Interactive mode not available'));
        console.log(chalk.gray(`Detected environment: ${envType}`));
        
        // Provide specific message based on environment
        if (process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP) {
          console.log(chalk.gray('WSL detected - raw mode may cause process hangs'));
          console.log(chalk.cyan('💡 Tip: Use --no-interactive flag or run in native Linux'));
        } else if (process.platform === 'win32') {
          console.log(chalk.gray('Windows detected - terminal compatibility issues'));
          console.log(chalk.cyan('💡 Tip: Use Windows Terminal or WSL2 for better experience'));
        } else if (process.env.TERM_PROGRAM === 'vscode') {
          console.log(chalk.gray('VS Code terminal detected - limited interactive support'));
          console.log(chalk.cyan('💡 Tip: Use external terminal for full functionality'));
        } else if (!isRawModeSupported()) {
          console.log(chalk.gray('Terminal does not support raw mode'));
        }
        
        console.log();
      }
      
      if (fallbackFn) {
        return fallbackFn(...args);
      } else {
        console.log(chalk.red('❌ This command requires interactive mode'));
        console.log(chalk.gray('Please run in a compatible terminal environment'));
        process.exit(1);
      }
    }
    
    // Try to run the interactive function
    try {
      return await interactiveFn(...args);
    } catch (error: any) {
      // Check if it's a raw mode error
      if (error.message && (
        error.message.includes('setRawMode') ||
        error.message.includes('raw mode') ||
        error.message.includes('stdin') ||
        error.message.includes('TTY')
      )) {
        console.log(chalk.yellow('\n⚠️  Interactive mode failed'));
        console.log(chalk.gray(error.message));
        
        if (fallbackFn) {
          console.log(chalk.cyan('Falling back to non-interactive mode...'));
          return fallbackFn(...args);
        } else {
          console.log(chalk.red('❌ No non-interactive fallback available'));
          process.exit(1);
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Create a non-interactive version of a prompt
 * @param {string} message - The prompt message
 * @param {T} defaultValue - The default value to use
 * @returns {T} The default value
 */
export function nonInteractivePrompt<T>(message: string, defaultValue: T): T {
  console.log(chalk.gray(`📝 ${message}`));
  console.log(chalk.cyan(`   Using default: ${defaultValue}`));
  return defaultValue;
}

/**
 * Create a non-interactive version of a selection
 * @param {string} message - The selection message
 * @param {Array} choices - The available choices
 * @param {T} defaultChoice - The default choice
 * @returns {T} The default choice
 */
export function nonInteractiveSelect<T>(
  message: string,
  choices: Array<T | { name: string; value: T }>,
  defaultChoice: T
): T {
  console.log(chalk.gray(`📋 ${message}`));
  console.log(chalk.gray('   Available choices:'));
  choices.forEach(choice => {
    const isDefault = choice === defaultChoice || (choice as any).value === defaultChoice;
    const displayName = typeof choice === 'object' && 'name' in choice ? choice.name : String(choice);
    console.log(chalk.gray(`   ${isDefault ? '▶' : ' '} ${displayName}`));
  });
  console.log(chalk.cyan(`   Using default: ${defaultChoice}`));
  return defaultChoice;
}

/**
 * Show a non-interactive progress indicator
 * @param {string} message - The progress message
 * @returns {ProgressControl} Progress control object
 */
export function nonInteractiveProgress(message: string): ProgressControl {
  console.log(chalk.gray(`⏳ ${message}...`));
  
  return {
    update: (newMessage: string) => {
      console.log(chalk.gray(`   ${newMessage}`));
    },
    succeed: (finalMessage?: string) => {
      console.log(chalk.green(`✅ ${finalMessage || message}`));
    },
    fail: (errorMessage?: string) => {
      console.log(chalk.red(`❌ ${errorMessage || 'Failed'}`));
    }
  };
}