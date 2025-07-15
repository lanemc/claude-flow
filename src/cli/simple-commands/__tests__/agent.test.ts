/**
 * Tests for agent command - Updated for v2.0.0-alpha.49 API
 */

import { jest } from '@jest/globals';
import { agentCommand } from '../agent';

// Mock console output helpers
const mockPrintSuccess = jest.fn();
const mockPrintError = jest.fn();
const mockPrintWarning = jest.fn();

jest.mock('../utils.js', () => ({
  printSuccess: mockPrintSuccess,
  printError: mockPrintError,
  printWarning: mockPrintWarning,
}));

describe('Agent Command', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('spawn subcommand', () => {
    test('should spawn an agent with type', async () => {
      await agentCommand(['spawn', 'researcher'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Spawning researcher agent: agent-' + expect.stringMatching(/\d+/));
      expect(consoleLogSpy).toHaveBeenCalledWith('🤖 Agent would be created with the following configuration:');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Type: researcher');
    });

    test('should spawn agent with custom name', async () => {
      await agentCommand(['spawn', 'coder'], { name: 'CustomCoder' });
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Spawning coder agent: CustomCoder');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Type: coder');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Name: CustomCoder');
    });

    test('should provide orchestrator requirement note', async () => {
      await agentCommand(['spawn', 'researcher'], {});
      
      expect(consoleLogSpy).toHaveBeenCalledWith('📋 Note: Full agent spawning requires orchestrator to be running');
    });

    test('should handle custom agent types gracefully', async () => {
      await agentCommand(['spawn', 'custom-type'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith(expect.stringContaining('custom-type agent'));
    });
  });

  describe('list subcommand', () => {
    test('should show agent list', async () => {
      await agentCommand(['list'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Active agents:');
      expect(consoleLogSpy).toHaveBeenCalledWith('📋 No agents currently active (orchestrator not running)');
    });

    test('should provide creation examples', async () => {
      await agentCommand(['list'], {});
      
      expect(consoleLogSpy).toHaveBeenCalledWith('  claude-flow agent spawn researcher --name "ResearchBot"');
      expect(consoleLogSpy).toHaveBeenCalledWith('  claude-flow agent spawn coder --name "CodeBot"');
      expect(consoleLogSpy).toHaveBeenCalledWith('  claude-flow agent spawn analyst --name "DataBot"');
    });
  });

  describe('terminate subcommand', () => {
    test('should terminate an agent', async () => {
      await agentCommand(['terminate', 'agent-1'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Terminating agent: agent-1');
      expect(consoleLogSpy).toHaveBeenCalledWith('🛑 Agent would be gracefully shut down');
    });

    test('should require agent ID', async () => {
      await agentCommand(['terminate'], {});
      
      expect(mockPrintError).toHaveBeenCalledWith('Usage: agent terminate <agent-id>');
    });
  });

  describe('info subcommand', () => {
    test('should show agent info', async () => {
      await agentCommand(['info', 'agent-1'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Agent information: agent-1');
      expect(consoleLogSpy).toHaveBeenCalledWith('📊 Agent details would include:');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Status, capabilities, current tasks, performance metrics');
    });
    
    test('should require agent ID', async () => {
      await agentCommand(['info'], {});
      
      expect(mockPrintError).toHaveBeenCalledWith('Usage: agent info <agent-id>');
    });
  });

  describe('hierarchy subcommand', () => {
    test('should manage hierarchy creation', async () => {
      await agentCommand(['hierarchy', 'create'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Creating basic agent hierarchy');
      expect(consoleLogSpy).toHaveBeenCalledWith('🏗️  Hierarchy structure would include:');
      expect(consoleLogSpy).toHaveBeenCalledWith('   - Coordinator Agent (manages workflow)');
    });
    
    test('should show hierarchy status', async () => {
      await agentCommand(['hierarchy', 'show'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Current agent hierarchy:');
      expect(consoleLogSpy).toHaveBeenCalledWith('📊 No hierarchy configured (orchestrator not running)');
    });
  });

  describe('provision subcommand', () => {
    test('should provision multiple agents', async () => {
      await agentCommand(['provision', '3'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Provisioning 3 agents...');
      expect(consoleLogSpy).toHaveBeenCalledWith('🚀 Auto-provisioning would create:');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Agent 1: Type=general, Status=provisioning');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Agent 3: Type=general, Status=provisioning');
    });
    
    test('should handle invalid provision count', async () => {
      await agentCommand(['provision', 'invalid'], {});
      
      expect(mockPrintError).toHaveBeenCalledWith('Count must be a positive number');
    });

    test('should require provision count', async () => {
      await agentCommand(['provision'], {});
      
      expect(mockPrintError).toHaveBeenCalledWith('Usage: agent provision <count>');
    });
  });

  describe('network subcommand', () => {
    test('should show network topology', async () => {
      await agentCommand(['network', 'topology'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Agent network topology:');
      expect(consoleLogSpy).toHaveBeenCalledWith('🌐 Network visualization would show agent connections');
    });

    test('should show network metrics', async () => {
      await agentCommand(['network', 'metrics'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Network performance metrics:');
      expect(consoleLogSpy).toHaveBeenCalledWith('📈 Communication latency, throughput, reliability stats');
    });
  });

  describe('ecosystem subcommand', () => {
    test('should show ecosystem status', async () => {
      await agentCommand(['ecosystem', 'status'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Agent ecosystem status:');
      expect(consoleLogSpy).toHaveBeenCalledWith('🌱 Ecosystem health: Not running');
      expect(consoleLogSpy).toHaveBeenCalledWith('   Active Agents: 0');
    });

    test('should optimize ecosystem', async () => {
      await agentCommand(['ecosystem', 'optimize'], {});
      
      expect(mockPrintSuccess).toHaveBeenCalledWith('Optimizing agent ecosystem...');
      expect(consoleLogSpy).toHaveBeenCalledWith('⚡ Optimization would include:');
    });
  });

  describe('help subcommand', () => {
    test('should show help when no arguments', async () => {
      await agentCommand([], {});
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Agent commands:');
      expect(consoleLogSpy).toHaveBeenCalledWith('  spawn <type> [--name <name>]     Create new agent');
      expect(consoleLogSpy).toHaveBeenCalledWith('  list [--verbose]                 List active agents');
    });

    test('should show help for unknown subcommand', async () => {
      await agentCommand(['unknown'], {});
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Agent commands:');
      expect(consoleLogSpy).toHaveBeenCalledWith('Examples:');
    });
  });
});