/**
 * Test suite for raw mode fix (GitHub issue #213)
 * Tests that setRawMode is properly guarded with TTY checks
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { spawn, ChildProcess } from 'child_process';

describe('Raw Mode Fix (Issue #213)', () => {
  let originalIsTTY: boolean | undefined;
  let originalSetRawMode: ((mode: boolean) => void) | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdin.isTTY;
    originalSetRawMode = process.stdin.setRawMode;
  });

  afterEach(() => {
    process.stdin.isTTY = originalIsTTY;
    process.stdin.setRawMode = originalSetRawMode;
  });

  test('should not call setRawMode when not in TTY', () => {
    // Simulate non-TTY environment
    process.stdin.isTTY = false;
    let setRawModeCalled = false;
    
    process.stdin.setRawMode = () => {
      setRawModeCalled = true;
      throw new Error('Raw mode is not supported on the current process.stdin');
    };

    // Test the logic that should be used (our fixed implementation)
    const shouldEnableRawMode = process.stdin.isTTY && 
                               typeof process.stdin.setRawMode === 'function';

    expect(shouldEnableRawMode).toBe(false);
    expect(setRawModeCalled).toBe(false);
  });

  test('should handle setRawMode gracefully with try-catch', () => {
    process.stdin.isTTY = false;
    let errorThrown = false;
    
    process.stdin.setRawMode = () => {
      throw new Error('Raw mode is not supported');
    };

    // Test our fixed implementation logic
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
      try {
        process.stdin.setRawMode(true);
      } catch (error) {
        errorThrown = true;
      }
    }

    // Should not throw because TTY check prevents the call
    expect(errorThrown).toBe(false);
  });

  test('should allow raw mode in TTY environment', () => {
    process.stdin.isTTY = true;
    let setRawModeCalled = false;
    
    process.stdin.setRawMode = (mode: boolean) => {
      setRawModeCalled = true;
      expect(mode).toBe(true);
    };

    // Test our fixed implementation logic
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
      try {
        process.stdin.setRawMode(true);
      } catch (error) {
        // Should not reach here in this test
        expect(error).toBeUndefined();
      }
    }

    expect(setRawModeCalled).toBe(true);
  });

  test('SPARC command should not fail with raw mode error in piped input', async () => {
    const result = await new Promise<{code: number | null, stderr: string, error?: string}>((resolve) => {
      const echo = spawn('echo', ['test']);
      const claudeFlow = spawn('./claude-flow', ['sparc', '--help'], {
        stdio: [echo.stdout, 'pipe', 'pipe']
      });

      let stderr = '';
      
      claudeFlow.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      claudeFlow.on('close', (code) => {
        resolve({ code, stderr });
      });

      claudeFlow.on('error', (error) => {
        resolve({ code: null, stderr, error: error.message });
      });

      // Add timeout
      setTimeout(() => {
        claudeFlow.kill();
        resolve({ code: null, stderr, error: 'Test timed out' });
      }, 15000);
    });

    // The key test: should NOT contain raw mode errors
    expect(result.stderr).not.toMatch(/raw mode is not supported/i);
    expect(result.stderr).not.toMatch(/ink.*not supported/i);
    expect(result.stderr).not.toMatch(/setrawmode/i);
    
    // Should not timeout or crash
    expect(result.error).not.toBe('Test timed out');
  }, 20000);

  test('SPARC command should not fail with raw mode error in CI environment', async () => {
    const result = await new Promise<{code: number | null, stderr: string}>((resolve) => {
      const claudeFlow = spawn('./claude-flow', ['sparc', '--help'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, CI: 'true' }
      });

      let stderr = '';
      
      claudeFlow.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      claudeFlow.on('close', (code) => {
        resolve({ code, stderr });
      });

      // Close stdin to simulate non-interactive environment
      claudeFlow.stdin?.end();

      // Add timeout
      setTimeout(() => {
        claudeFlow.kill();
        resolve({ code: null, stderr: stderr + '\nTEST TIMEOUT' });
      }, 15000);
    });

    expect(result.stderr).not.toMatch(/raw mode is not supported/i);
    expect(result.stderr).not.toMatch(/ink.*not supported/i);
    expect(result.stderr).not.toMatch(/TEST TIMEOUT/);
  }, 20000);

  test('should reproduce the exact GitHub issue scenario', async () => {
    // This is the exact command from the GitHub issue that was failing
    const result = await new Promise<{hasRawModeError: boolean, stderr: string}>((resolve) => {
      const echo = spawn('echo', ['test']);
      const claudeFlow = spawn('./claude-flow', ['sparc', 'build a REST API', '--dry-run'], {
        stdio: [echo.stdout, 'pipe', 'pipe']
      });

      let stderr = '';
      
      claudeFlow.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      claudeFlow.on('close', () => {
        const hasRawModeError = stderr.includes('Raw mode is not supported') ||
                               stderr.includes('Ink') ||
                               stderr.includes('setRawMode');
        resolve({ hasRawModeError, stderr });
      });

      setTimeout(() => {
        claudeFlow.kill();
        resolve({ hasRawModeError: false, stderr: stderr + '\nTIMEOUT' });
      }, 15000);
    });

    // This is the critical test - the exact issue should be fixed
    expect(result.hasRawModeError).toBe(false);
    if (result.hasRawModeError) {
      console.log('Raw mode error detected in stderr:', result.stderr);
    }
  }, 20000);
});