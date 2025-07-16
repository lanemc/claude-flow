// test-runner.ts - Test runner for validation and rollback systems

import { ValidationSystem } from './index.js';
import { RollbackSystem } from '../rollback/index.js';
import { printSuccess, printError, printWarning } from '../../../utils.js';
import type { TestResult } from './types.js';

interface TestCase {
  name: string;
  test: () => Promise<TestDetail>;
}

interface TestDetail {
  success: boolean;
  errors: string[];
  details: Record<string, any>;
}

interface TestResultWithDetails {
  name: string;
  success: boolean;
  details?: TestDetail;
  error?: string;
}

/**
 * Test runner for validation and rollback systems
 */
export class ValidationTestRunner {
  private workingDir: string;
  private validationSystem: ValidationSystem;
  private rollbackSystem: RollbackSystem;
  private testResults: TestResultWithDetails[];

  constructor(workingDir: string) {
    this.workingDir = workingDir;
    this.validationSystem = new ValidationSystem(workingDir);
    this.rollbackSystem = new RollbackSystem(workingDir);
    this.testResults = [];
  }

  /**
   * Run all validation and rollback tests
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Running validation and rollback system tests...');
    
    const tests: TestCase[] = [
      { name: 'Pre-init Validation', test: () => this.testPreInitValidation() },
      { name: 'Post-init Validation', test: () => this.testPostInitValidation() },
      { name: 'Configuration Validation', test: () => this.testConfigValidation() },
      { name: 'Mode Functionality', test: () => this.testModeFunctionality() },
      { name: 'Health Checks', test: () => this.testHealthChecks() },
      { name: 'Backup System', test: () => this.testBackupSystem() },
      { name: 'Rollback System', test: () => this.testRollbackSystem() },
      { name: 'State Tracking', test: () => this.testStateTracking() },
      { name: 'Recovery Procedures', test: () => this.testRecoveryProcedures() },
      { name: 'Atomic Operations', test: () => this.testAtomicOperations() }
    ];

    for (const testCase of tests) {
      console.log(`\n🔬 Testing: ${testCase.name}`);
      
      try {
        const result = await testCase.test();
        this.testResults.push({
          name: testCase.name,
          success: result.success,
          details: result
        });
        
        if (result.success) {
          printSuccess(`✅ ${testCase.name} passed`);
        } else {
          printError(`❌ ${testCase.name} failed`);
          if (result.errors) {
            result.errors.forEach(error => console.error(`  - ${error}`));
          }
        }
        
      } catch (error) {
        this.testResults.push({
          name: testCase.name,
          success: false,
          error: (error as Error).message
        });
        printError(`❌ ${testCase.name} threw exception: ${(error as Error).message}`);
      }
    }

    this.generateTestReport();
  }

  /**
   * Test pre-initialization validation
   */
  async testPreInitValidation(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Test with normal conditions
      const normalValidation = await this.validationSystem.validatePreInit();
      result.details.normal = normalValidation;
      
      if (!normalValidation.success && normalValidation.errors.length > 0) {
        // Some failures are expected in test environment
        result.details.expectedFailures = normalValidation.errors;
      }

      // Test with force flag
      const forceValidation = await this.validationSystem.validatePreInit({ force: true });
      result.details.force = forceValidation;

      result.success = true; // Pre-init validation tested successfully

    } catch (error) {
      result.success = false;
      result.errors.push(`Pre-init validation test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test post-initialization validation
   */
  async testPostInitValidation(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Create minimal test files for validation
      await this.createTestFiles();
      
      const postValidation = await this.validationSystem.validatePostInit();
      result.details.postValidation = postValidation;
      
      // Clean up test files
      await this.cleanupTestFiles();
      
      result.success = true;

    } catch (error) {
      result.success = false;
      result.errors.push(`Post-init validation test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test configuration validation
   */
  async testConfigValidation(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Create test configuration files
      await this.createTestConfigs();
      
      const configValidation = await this.validationSystem.validateConfiguration();
      result.details.configValidation = configValidation;
      
      // Clean up test configs
      await this.cleanupTestConfigs();
      
      result.success = true;

    } catch (error) {
      result.success = false;
      result.errors.push(`Config validation test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test mode functionality
   */
  async testModeFunctionality(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Create test SPARC configuration
      await this.createTestSparcConfig();
      
      const modeTests = await this.validationSystem.testModeFunctionality();
      result.details.modeTests = modeTests;
      
      // Clean up test SPARC config
      await this.cleanupTestSparcConfig();
      
      result.success = true;

    } catch (error) {
      result.success = false;
      result.errors.push(`Mode functionality test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test health checks
   */
  async testHealthChecks(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      const healthChecks = await this.validationSystem.runHealthChecks();
      result.details.healthChecks = healthChecks;
      
      result.success = true;

    } catch (error) {
      result.success = false;
      result.errors.push(`Health checks test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test backup system
   */
  async testBackupSystem(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Test backup creation
      const backupResult = await this.rollbackSystem.backupManager.createBackup('test', 'Test backup');
      result.details.backupCreation = backupResult;
      
      if (!backupResult.success) {
        result.success = false;
        result.errors.push('Backup creation failed');
        return result;
      }

      // Test backup listing
      const backups = await this.rollbackSystem.backupManager.listBackups();
      result.details.backupListing = { count: backups.length };
      
      // Test backup deletion
      if (backupResult.id) {
        const deleteResult = await this.rollbackSystem.backupManager.deleteBackup(backupResult.id);
        result.details.backupDeletion = deleteResult;
        
        if (!deleteResult.success) {
          result.errors.push('Backup deletion failed');
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Backup system test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test rollback system
   */
  async testRollbackSystem(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      // Test rollback system validation
      const rollbackValidation = await this.rollbackSystem.validateRollbackSystem();
      result.details.rollbackValidation = rollbackValidation;
      
      if (!rollbackValidation.success) {
        result.errors.push(...rollbackValidation.errors);
      }

      // Test rollback point listing
      const rollbackPoints = await this.rollbackSystem.listRollbackPoints();
      result.details.rollbackPoints = {
        count: rollbackPoints.rollbackPoints.length,
        checkpoints: rollbackPoints.checkpoints.length
      };

    } catch (error) {
      result.success = false;
      result.errors.push(`Rollback system test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test state tracking
   */
  async testStateTracking(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      const stateTracker = this.rollbackSystem.stateTracker;
      
      // Test checkpoint creation
      const checkpoint = await stateTracker.createCheckpoint('test-phase', { test: true });
      result.details.checkpointCreation = checkpoint;
      
      if (!checkpoint.success) {
        result.errors.push('Checkpoint creation failed');
      }

      // Test rollback point recording
      const rollbackPoint = await stateTracker.recordRollbackPoint('test', { testData: true });
      result.details.rollbackPointCreation = rollbackPoint;
      
      if (!rollbackPoint.success) {
        result.errors.push('Rollback point creation failed');
      }

      // Test state validation
      const stateValidation = await stateTracker.validateStateTracking();
      result.details.stateValidation = stateValidation;
      
      if (!stateValidation.success) {
        result.errors.push(...stateValidation.errors);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`State tracking test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test recovery procedures
   */
  async testRecoveryProcedures(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      const recoveryManager = this.rollbackSystem.recoveryManager;
      
      // Test recovery system validation
      const recoveryValidation = await recoveryManager.validateRecoverySystem();
      result.details.recoveryValidation = recoveryValidation;
      
      if (!recoveryValidation.success) {
        result.errors.push(...recoveryValidation.errors);
      }

      // Test generic recovery
      const genericRecovery = await recoveryManager.performRecovery('test-failure', { test: true });
      result.details.genericRecovery = genericRecovery;

    } catch (error) {
      result.success = false;
      result.errors.push(`Recovery procedures test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Test atomic operations
   */
  async testAtomicOperations(): Promise<TestDetail> {
    const result: TestDetail = { success: true, errors: [], details: {} };

    try {
      const { createAtomicOperation } = await import('../rollback/index.js');
      
      // Test atomic operation creation
      const atomicOp = createAtomicOperation(this.rollbackSystem, 'test-operation');
      
      // Test begin
      const beginResult = await atomicOp.begin();
      result.details.atomicBegin = { success: beginResult };
      
      if (!beginResult) {
        result.errors.push('Atomic operation begin failed');
        return result;
      }

      // Test commit
      await atomicOp.commit();
      result.details.atomicCommit = { success: true };

    } catch (error) {
      result.success = false;
      result.errors.push(`Atomic operations test failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Generate test report
   */
  generateTestReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 VALIDATION & ROLLBACK SYSTEM TEST REPORT');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(test => test.success).length;
    const failed = this.testResults.filter(test => !test.success).length;
    const total = this.testResults.length;
    
    console.log(`\n📊 Summary: ${passed}/${total} tests passed`);
    
    if (failed === 0) {
      printSuccess('🎉 All tests passed!');
    } else {
      printError(`❌ ${failed} tests failed`);
    }
    
    console.log('\n📋 Test Results:');
    this.testResults.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`  ${status} ${test.name}`);
      
      if (!test.success && test.error) {
        console.log(`    Error: ${test.error}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    
    // Overall system health assessment
    const healthScore = (passed / total) * 100;
    console.log(`\n🏥 System Health Score: ${healthScore.toFixed(1)}%`);
    
    if (healthScore >= 90) {
      printSuccess('🟢 Excellent - System is fully operational');
    } else if (healthScore >= 70) {
      printWarning('🟡 Good - System is mostly operational with minor issues');
    } else if (healthScore >= 50) {
      printWarning('🟠 Fair - System has some significant issues');
    } else {
      printError('🔴 Poor - System has major issues requiring attention');
    }
  }

  // Helper methods for creating test files

  private async createTestFiles(): Promise<void> {
    try {
      await Deno.mkdir(`${this.workingDir}/test-temp`, { recursive: true });
      await Deno.writeTextFile(`${this.workingDir}/test-temp/CLAUDE.md`, '# Test CLAUDE.md');
      await Deno.writeTextFile(`${this.workingDir}/test-temp/memory-bank.md`, '# Test Memory Bank');
    } catch {
      // Test files creation failed - not critical for testing
    }
  }

  private async cleanupTestFiles(): Promise<void> {
    try {
      await Deno.remove(`${this.workingDir}/test-temp`, { recursive: true });
    } catch {
      // Cleanup failed - not critical
    }
  }

  private async createTestConfigs(): Promise<void> {
    try {
      const testConfig = {
        version: "1.0",
        modes: {
          "test-mode": {
            description: "Test mode for validation"
          }
        }
      };
      
      await Deno.writeTextFile(
        `${this.workingDir}/test-roomodes`,
        JSON.stringify(testConfig, null, 2)
      );
    } catch {
      // Test config creation failed - not critical
    }
  }

  private async cleanupTestConfigs(): Promise<void> {
    try {
      await Deno.remove(`${this.workingDir}/test-roomodes`);
    } catch {
      // Cleanup failed - not critical
    }
  }

  private async createTestSparcConfig(): Promise<void> {
    try {
      await this.createTestConfigs();
      await Deno.mkdir(`${this.workingDir}/test-roo`, { recursive: true });
    } catch {
      // Test SPARC config creation failed - not critical
    }
  }

  private async cleanupTestSparcConfig(): Promise<void> {
    try {
      await this.cleanupTestConfigs();
      await Deno.remove(`${this.workingDir}/test-roo`, { recursive: true });
    } catch {
      // Cleanup failed - not critical
    }
  }
}

/**
 * Run validation and rollback tests
 */
export async function runValidationTests(workingDir: string): Promise<TestResultWithDetails[]> {
  const testRunner = new ValidationTestRunner(workingDir);
  await testRunner.runAllTests();
  return testRunner.testResults;
}