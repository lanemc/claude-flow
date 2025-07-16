/**
 * Tests for SPARC Commands TypeScript conversion
 */

import { 
  SparcCommandOptions, 
  SparcCommandResult, 
  isValidSparcMode, 
  isValidSparcPhase, 
  validateSparcCommandOptions,
  getSparcCommands,
  getSparcCommandHelp
} from './commands.js';

// Test type guards
describe('SPARC Commands TypeScript Conversion', () => {
  describe('Type Guards', () => {
    test('isValidSparcMode should validate SPARC modes correctly', () => {
      expect(isValidSparcMode('development')).toBe(true);
      expect(isValidSparcMode('api')).toBe(true);
      expect(isValidSparcMode('invalid')).toBe(false);
    });

    test('isValidSparcPhase should validate SPARC phases correctly', () => {
      expect(isValidSparcPhase('specification')).toBe(true);
      expect(isValidSparcPhase('architecture')).toBe(true);
      expect(isValidSparcPhase('invalid')).toBe(false);
    });
  });

  describe('Option Validation', () => {
    test('validateSparcCommandOptions should pass for valid options', () => {
      const validOptions: SparcCommandOptions = {
        mode: 'development',
        focus: ['specification', 'architecture'],
        qualityGates: {
          testCoverage: 85,
          codeQuality: 80
        }
      };
      
      expect(() => validateSparcCommandOptions(validOptions)).not.toThrow();
    });

    test('validateSparcCommandOptions should throw for invalid mode', () => {
      const invalidOptions: SparcCommandOptions = {
        mode: 'invalid' as any
      };
      
      expect(() => validateSparcCommandOptions(invalidOptions)).toThrow('Invalid SPARC mode');
    });

    test('validateSparcCommandOptions should throw for invalid phase in focus', () => {
      const invalidOptions: SparcCommandOptions = {
        focus: ['invalid'] as any
      };
      
      expect(() => validateSparcCommandOptions(invalidOptions)).toThrow('Invalid SPARC phase in focus');
    });

    test('validateSparcCommandOptions should throw for negative quality gates', () => {
      const invalidOptions: SparcCommandOptions = {
        qualityGates: {
          testCoverage: -10
        }
      };
      
      expect(() => validateSparcCommandOptions(invalidOptions)).toThrow('must be a non-negative number');
    });
  });

  describe('Command Registry', () => {
    test('getSparcCommands should return all available commands', () => {
      const commands = getSparcCommands();
      expect(commands).toContain('dev');
      expect(commands).toContain('api');
      expect(commands).toContain('ui');
      expect(commands).toContain('test');
      expect(commands).toContain('refactor');
      expect(commands).toContain('research');
      expect(commands).toContain('data');
      expect(commands).toContain('security');
      expect(commands).toContain('devops');
      expect(commands).toContain('performance');
    });

    test('getSparcCommandHelp should return help for all commands', () => {
      const commands = getSparcCommands();
      commands.forEach(command => {
        const help = getSparcCommandHelp(command);
        expect(help).toBeDefined();
        expect(help).not.toBe('Unknown command');
      });
    });
  });

  describe('Type Safety', () => {
    test('SparcCommandOptions should extend BaseSparcOptions', () => {
      const options: SparcCommandOptions = {
        verbose: true,
        interactive: false,
        namespace: 'test',
        mode: 'development',
        focus: ['specification'],
        tddCycles: true
      };
      
      // Should compile without issues
      expect(options.verbose).toBe(true);
      expect(options.mode).toBe('development');
    });

    test('SparcCommandResult should have proper structure', () => {
      const result: SparcCommandResult = {
        taskDescription: 'Test task',
        executionTime: 1000,
        phases: [{
          name: 'specification',
          status: 'passed',
          artifacts: {}
        }],
        qualityGates: {
          specification: {
            passed: true,
            reasons: []
          }
        },
        artifacts: {},
        recommendations: [{
          type: 'improvement',
          phase: 'specification',
          message: 'Test recommendation'
        }]
      };
      
      // Should compile without issues
      expect(result.taskDescription).toBe('Test task');
      expect(result.phases[0].name).toBe('specification');
    });
  });
});