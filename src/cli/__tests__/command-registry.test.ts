/**
 * Tests for command-registry.js
 */

import { jest } from '@jest/globals';

// Mock all command modules with simpler typing
const mockFn = () => jest.fn().mockImplementation(() => Promise.resolve());

jest.mock('../simple-commands/init.js', () => ({
  initCommand: mockFn(),
}));

jest.mock('../simple-commands/memory.js', () => ({
  memoryCommand: mockFn(),
}));

jest.mock('../simple-commands/agent.js', () => ({
  agentCommand: mockFn(),
}));

jest.mock('../simple-commands/task.js', () => ({
  taskCommand: mockFn(),
}));

jest.mock('../simple-commands/swarm.js', () => ({
  swarmCommand: mockFn(),
}));

jest.mock('../simple-commands/config', () => ({
  configCommand: mockFn(),
}));

jest.mock('../simple-commands/status', () => ({
  statusCommand: mockFn(),
}));

jest.mock('../simple-commands/mcp.js', () => ({
  mcpCommand: mockFn(),
}));

jest.mock('../simple-commands/monitor.js', () => ({
  monitorCommand: mockFn(),
}));

jest.mock('../simple-commands/start.js', () => ({
  startCommand: mockFn(),
}));

jest.mock('../simple-commands/sparc.js', () => ({
  sparcCommand: mockFn(),
}));

jest.mock('../simple-commands/batch-manager.js', () => ({
  batchManagerCommand: mockFn(),
}));

jest.mock('../commands/ruv-swarm.js', () => ({
  ruvSwarmAction: mockFn(),
}));

jest.mock('../commands/config-integration.js', () => ({
  configIntegrationAction: mockFn(),
}));

import { 
  commandRegistry, 
  registerCoreCommands, 
  executeCommand, 
  hasCommand, 
  showCommandHelp, 
  showAllCommands, 
  listCommands 
} from '../command-registry';

describe('Command Registry', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    commandRegistry.clear();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Basic functionality', () => {
    it('should register core commands', async () => {
      await registerCoreCommands();
      expect(commandRegistry.size).toBeGreaterThan(0);
    });

    it('should check if command exists', async () => {
      await registerCoreCommands();
      expect(hasCommand('init')).toBe(true);
      expect(hasCommand('nonexistent')).toBe(false);
    });

    it('should list all commands', async () => {
      await registerCoreCommands();
      const commands = listCommands();
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should execute a command', async () => {
      await registerCoreCommands();
      await expect(executeCommand('init', [], {})).resolves.not.toThrow();
    });

    it('should show command help', async () => {
      await registerCoreCommands();
      showCommandHelp('init');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should show all commands', async () => {
      await registerCoreCommands();
      showAllCommands();
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle non-existent command gracefully', async () => {
      await registerCoreCommands();
      try {
        await executeCommand('nonexistent', [], {});
      } catch (error: any) {
        expect(error.message).toContain('not found');
      }
    });
  });
});