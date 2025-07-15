/**
 * Unit tests for simple-cli components
 */

import { parseFlags } from '../utils';

describe('Simple CLI Utils', () => {
  describe('parseFlags', () => {
    test('should parse boolean flags correctly', () => {
      const result = parseFlags(['--force', '--verbose']);
      expect(result.flags).toEqual({ force: true, verbose: true });
      expect(result.args).toEqual([]);
    });

    test('should parse value flags correctly', () => {
      const result = parseFlags(['--port', '8080', '--name', 'test']);
      expect(result.flags).toEqual({ port: '8080', name: 'test' });
      expect(result.args).toEqual([]);
    });

    test('should handle mixed flags and arguments', () => {
      const result = parseFlags(['arg1', '--flag', 'value', 'arg2', '--bool']);
      expect(result.flags).toEqual({ flag: 'value', bool: true });
      expect(result.args).toEqual(['arg1', 'arg2']);
    });

    test('should handle flags with equals sign', () => {
      const result = parseFlags(['--port=8080', '--name=test']);
      expect(result.flags).toEqual({ port: '8080', name: 'test' });
      expect(result.args).toEqual([]);
    });

    test('should handle short flags', () => {
      const result = parseFlags(['-p', '8080', '-v']);
      expect(result.flags).toEqual({ p: '8080', v: true });
      expect(result.args).toEqual([]);
    });

    test('should handle double dash to stop flag parsing', () => {
      const result = parseFlags(['--flag', 'value', '--', '--not-a-flag']);
      expect(result.flags).toEqual({ flag: 'value' });
      expect(result.args).toEqual(['--not-a-flag']);
    });

    test('should handle empty input', () => {
      const result = parseFlags([]);
      expect(result.flags).toEqual({});
      expect(result.args).toEqual([]);
    });

    test('should handle only arguments', () => {
      const result = parseFlags(['arg1', 'arg2', 'arg3']);
      expect(result.flags).toEqual({});
      expect(result.args).toEqual(['arg1', 'arg2', 'arg3']);
    });
  });
});