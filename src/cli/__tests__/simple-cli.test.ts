/**
 * Tests for simple-cli.ts
 */

import { jest } from '@jest/globals';

type MockFunction = jest.MockedFunction<(...args: any[]) => any>;

// Mock import-meta-shim to avoid import.meta issues
jest.mock('../../utils/import-meta-shim', () => ({
  getFilename: jest.fn(() => '/test/simple-cli.ts')
}));

// Mock node-compat to avoid import.meta issues
jest.mock('../node-compat', () => ({
  args: process.argv.slice(2),
  cwd: () => process.cwd(),
  exit: jest.fn(),
  Deno: {
    args: () => process.argv.slice(2),
    cwd: () => process.cwd(),
  },
  existsSync: jest.fn(() => true),
}));

// Mock the command registry
jest.mock('../command-registry', () => ({
  executeCommand: jest.fn(),
  hasCommand: jest.fn(),
  showCommandHelp: jest.fn(),
  showAllCommands: jest.fn(),
  listCommands: jest.fn(() => [
    { name: 'init', description: 'Initialize a new Claude-Flow project' },
    { name: 'agent', description: 'Manage agents' },
    { name: 'task', description: 'Manage tasks' },
    { name: 'memory', description: 'Manage memory' },
    { name: 'swarm', description: 'Manage swarms' }
  ]),
  commandRegistry: new Map(),
  registerCoreCommands: jest.fn(),
}));

// Import parseFlags separately before other imports
import { parseFlags } from '../utils';

// Import mocked modules
import { executeCommand, hasCommand, showCommandHelp, showAllCommands, listCommands } from '../command-registry';

// Import the main function (defined after mocks to avoid issues)
let main: () => Promise<void>;

describe('Claude-Flow CLI', () => {
  let originalArgv: string[];
  let originalExit: typeof process.exit;
  let consoleLogSpy: ReturnType<typeof jest.spyOn>;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(async () => {
    originalArgv = process.argv;
    originalExit = process.exit;
    process.exit = jest.fn() as any;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.clearAllMocks();
    
    // Reset command registry mocks
    (executeCommand as any).mockReset();
    (hasCommand as any).mockReset();
    (showCommandHelp as any).mockReset();
    (showAllCommands as any).mockReset();
    (listCommands as any).mockReturnValue(['init', 'agent', 'task', 'memory', 'swarm']);
    
    // Import main function after mocks are set up
    const simpleCli = await import('../simple-cli');
    main = simpleCli.main;
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Help output', () => {
    test('should show help when no arguments provided', async () => {
      process.argv = ['node', 'claude-flow'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(false);
      
      // Call main function
      await main();
      
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('Claude-Flow v2.0.0');
      expect(output).toContain('USAGE:');
      expect(output).toContain('claude-flow <command> [options]');
    });

    test('should show help for --help flag', async () => {
      process.argv = ['node', 'claude-flow', '--help'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(false);
      
      await main();
      
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('Claude-Flow v2.0.0');
    });

    test('should show version for --version flag', async () => {
      process.argv = ['node', 'claude-flow', '--version'];
      
      await main();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('2.0.0');
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('Command execution', () => {
    test('should execute valid command', async () => {
      process.argv = ['node', 'claude-flow', 'init', '--sparc'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(true);
      (executeCommand as jest.MockedFunction<any>).mockResolvedValue(undefined);
      
      await main();
      
      expect(hasCommand).toHaveBeenCalledWith('init');
      expect(executeCommand).toHaveBeenCalledWith('init', [], { sparc: true });
    });

    test('should handle command with multiple arguments', async () => {
      process.argv = ['node', 'claude-flow', 'swarm', 'Build a REST API', '--strategy', 'development'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(true);
      (executeCommand as jest.MockedFunction<any>).mockResolvedValue(undefined);
      
      await main();
      
      expect(hasCommand).toHaveBeenCalledWith('swarm');
      expect(executeCommand).toHaveBeenCalledWith(
        'swarm', 
        ['Build a REST API'], 
        { strategy: 'development' }
      );
    });

    test('should show error for unknown command', async () => {
      process.argv = ['node', 'claude-flow', 'invalid-command'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(false);
      
      await main();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown command: invalid-command')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Available commands:')
      );
    });
  });

  describe('Flag parsing', () => {
    test('should parse boolean flags correctly', () => {
      const flags = parseFlags(['--force', '--verbose']);
      expect(flags).toEqual({ force: true, verbose: true });
    });

    test('should parse value flags correctly', () => {
      const flags = parseFlags(['--port', '8080', '--name', 'test']);
      expect(flags).toEqual({ port: '8080', name: 'test' });
    });

    test('should handle mixed flags and arguments', () => {
      const flags = parseFlags(['arg1', '--flag', 'value', 'arg2', '--bool']);
      expect(flags).toEqual({ flag: 'value', bool: true });
    });

    test('should handle flags with equals sign', () => {
      const flags = parseFlags(['--port=8080', '--name=test']);
      expect(flags).toEqual({ port: '8080', name: 'test' });
    });
  });

  describe('Error handling', () => {
    test('should handle command execution errors gracefully', async () => {
      process.argv = ['node', 'claude-flow', 'init'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(true);
      (executeCommand as jest.MockedFunction<any>).mockRejectedValue(new Error('Test error'));
      
      await main();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test error')
      );
    });

    test('should handle missing required arguments', async () => {
      process.argv = ['node', 'claude-flow', 'agent'];
      (hasCommand as jest.MockedFunction<any>).mockReturnValue(true);
      (executeCommand as MockFunction).mockRejectedValue(new Error('Missing required argument'));
      
      await main();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required argument')
      );
    });
  });
});