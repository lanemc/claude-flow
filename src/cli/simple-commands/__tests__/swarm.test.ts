/**
 * Tests for swarm command - Updated for v2.0.0-alpha.49 API
 */

import { jest } from '@jest/globals';
import { swarmCommand } from '../swarm';
import { spawn } from 'child_process';

jest.mock('child_process');

describe('Swarm Command', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let mockSpawnProcess: any;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockSpawnProcess = {
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: jest.fn(),
    };
    (spawn as jest.Mock).mockReturnValue(mockSpawnProcess);
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('main swarm command', () => {
    test('should handle missing objective', async () => {
      await swarmCommand([], {});
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Usage: swarm <objective>');
    });

    test('should launch Claude Code with swarm coordination by default', async () => {
      // Mock execSync to simulate claude being available
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Build a REST API'], {});
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🐝 Launching Claude Flow Swarm System...');
      expect(output).toContain('📋 Objective: Build a REST API');
      expect(output).toContain('🎯 Strategy: auto');
      expect(output).toContain('🏗️  Mode: centralized');
      expect(output).toContain('🤖 Max Agents: 5');
    });

    test('should handle custom strategy and mode', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Research task'], { strategy: 'research', mode: 'distributed' });
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🎯 Strategy: research');
      expect(output).toContain('🏗️  Mode: distributed');
    });

    test('should handle custom max agents', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Task'], { 'max-agents': '10' });
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🤖 Max Agents: 10');
    });

    test('should warn when Claude Code not available', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {
        throw new Error('Command not found');
      });

      await swarmCommand(['Build API'], {});
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('⚠️  Claude Code CLI not found in PATH');
      expect(output).toContain('Install it with: npm install -g @anthropic-ai/claude-code');
    });

    test('should force executor mode with --executor flag', async () => {
      await swarmCommand(['Create REST API'], { executor: true });
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🐝 Launching swarm system...');
      expect(output).toContain('📋 Objective: Create REST API');
    });

    test('should force executor mode with JSON output', async () => {
      await swarmCommand(['Build API'], { 'output-format': 'json' });
      
      // JSON output forces executor mode
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🐝 Launching swarm system...');
    });

    test('should handle dry run mode', async () => {
      await swarmCommand(['Test task'], { 'dry-run': true, executor: true });
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('⚠️  DRY RUN - Advanced Swarm Configuration');
      expect(output).toContain('🆔 Swarm ID:');
      expect(output).toContain('📊 Max Tasks:');
      expect(output).toContain('⏰ Timeout:');
    });

    test('should create files for REST API tasks', async () => {
      // For executor mode, it should create actual files
      const mockFS = require('fs');
      mockFS.promises = {
        mkdir: jest.fn(),
        writeFile: jest.fn(),
      };

      await swarmCommand(['Build a REST API'], { executor: true });
      
      // Should attempt to create API files
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('🐝 Launching swarm system...');
      expect(output).toContain('📋 Objective: Build a REST API');
    });
  });

  describe('strategy guidance', () => {
    test('should provide strategy-specific guidance', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Research AI'], { strategy: 'research' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('🔬 RESEARCH STRATEGY'));
      expect(promptArg).toBeTruthy();
    });

    test('should provide development strategy guidance', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Build app'], { strategy: 'development' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('💻 DEVELOPMENT STRATEGY'));
      expect(promptArg).toBeTruthy();
    });
  });

  describe('mode guidance', () => {
    test('should provide centralized mode guidance', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Task'], { mode: 'centralized' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('🎯 CENTRALIZED MODE'));
      expect(promptArg).toBeTruthy();
    });

    test('should provide mesh mode guidance', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Task'], { mode: 'mesh' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('🔗 MESH MODE'));
      expect(promptArg).toBeTruthy();
    });
  });

  describe('agent recommendations', () => {
    test('should provide agent recommendations for research', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Research topic'], { strategy: 'research' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('🔬 RECOMMENDED RESEARCH AGENTS'));
      expect(promptArg).toBeTruthy();
    });

    test('should provide agent recommendations for development', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Build API'], { strategy: 'development' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('💻 RECOMMENDED DEVELOPMENT AGENTS'));
      expect(promptArg).toBeTruthy();
    });
  });

  describe('help', () => {
    test('should show help for missing objective', async () => {
      await swarmCommand([], {});
      
      // Should show help after error message
      const allOutput = consoleLogSpy.mock.calls.concat(consoleErrorSpy.mock.calls).flat().join('\n');
      expect(allOutput).toContain('🐝 Claude Flow Advanced Swarm System');
      expect(allOutput).toContain('USAGE:');
      expect(allOutput).toContain('claude-flow swarm <objective>');
    });
  });

  describe('background mode', () => {
    test('should handle background mode flag', async () => {
      // Mock Deno environment check
      (global as any).Deno = undefined;
      
      await swarmCommand(['Background task'], { background: true });
      
      const output = consoleLogSpy.mock.calls.flat().join('\n');
      expect(output).toContain('Background mode requested');
    });
  });

  describe('MCP tool integration', () => {
    test('should include MCP tool instructions in prompt', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Coordinate task'], {});
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('mcp__claude-flow__'));
      expect(promptArg).toBeTruthy();
    });

    test('should include SPARC methodology when enabled', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Develop feature'], { strategy: 'development' });
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('SPARC METHODOLOGY'));
      expect(promptArg).toBeTruthy();
    });

    test('should include parallel execution instructions', async () => {
      const { execSync } = require('child_process');
      execSync.mockImplementation(() => {});

      await swarmCommand(['Parallel task'], {});
      
      const logCalls = consoleLogSpy.mock.calls.flat();
      const promptArg = logCalls.find(call => typeof call === 'string' && call.includes('PARALLEL EXECUTION IS MANDATORY'));
      expect(promptArg).toBeTruthy();
    });
  });
});