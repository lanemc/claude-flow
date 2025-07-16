/**
 * Validation Engine TypeScript Tests
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { 
  ValidationEngine, 
  ValidationSchemaBuilder, 
  BuiltInValidators,
  CommonSchemas 
} from '../validation-engine.js';
import type { ValidationSchema, TypedValidationResult } from '../../migration/types.js';

describe('ValidationEngine', () => {
  let engine: ValidationEngine;

  beforeEach(() => {
    engine = new ValidationEngine();
  });

  describe('Schema Registration', () => {
    test('should register and retrieve schemas', () => {
      const schema = CommonSchemas.createUserSchema();
      engine.registerSchema(schema);
      
      const retrieved = engine.getSchema('user');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('user');
      expect(retrieved?.version).toBe('1.0.0');
    });

    test('should return undefined for non-existent schema', () => {
      const retrieved = engine.getSchema('nonexistent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      engine.registerSchema(CommonSchemas.createUserSchema());
    });

    test('should validate valid user data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const result = await engine.validate(userData, 'user');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toEqual(userData);
      expect(result.metadata.schema).toBe('user');
    });

    test('should reject invalid user data', async () => {
      const userData = {
        name: '', // Too short
        email: 'invalid-email', // Invalid format
        age: 200 // Out of range
      };

      const result = await engine.validate(userData, 'user');
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Check specific errors
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('name');
      expect(errorFields).toContain('email');
      expect(errorFields).toContain('age');
    });

    test('should handle missing required fields', async () => {
      const userData = {
        age: 25
        // Missing name and email
      };

      const result = await engine.validate(userData, 'user');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'name')).toBe(true);
      expect(result.errors.some(e => e.field === 'email')).toBe(true);
    });

    test('should handle optional fields correctly', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com'
        // age is optional
      };

      const result = await engine.validate(userData, 'user');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should throw error for unknown schema', async () => {
      const userData = { test: 'data' };
      
      await expect(engine.validate(userData, 'unknown'))
        .rejects.toThrow('Schema not found: unknown');
    });
  });

  describe('Multiple Validation', () => {
    beforeEach(() => {
      engine.registerSchema(CommonSchemas.createUserSchema());
    });

    test('should validate array of valid data', async () => {
      const users = [
        { name: 'User 1', email: 'user1@example.com', age: 25 },
        { name: 'User 2', email: 'user2@example.com', age: 30 }
      ];

      const results = await engine.validateMultiple(users, 'user');
      
      expect(results).toHaveLength(2);
      expect(results.every(r => r.valid)).toBe(true);
    });

    test('should identify invalid items in array', async () => {
      const users = [
        { name: 'Valid User', email: 'valid@example.com', age: 25 },
        { name: '', email: 'invalid-email', age: 200 } // Invalid
      ];

      const results = await engine.validateMultiple(users, 'user');
      
      expect(results).toHaveLength(2);
      expect(results[0].valid).toBe(true);
      expect(results[1].valid).toBe(false);
    });
  });
});

describe('ValidationSchemaBuilder', () => {
  test('should build schema with chained methods', () => {
    interface TestData {
      username: string;
      password: string;
      confirmPassword: string;
    }

    const schema = new ValidationSchemaBuilder<TestData>('test', '1.0.0')
      .required('username', 'Username is required')
      .length('username', 3, 20, 'Username must be 3-20 characters')
      .required('password', 'Password is required')
      .length('password', 8, 100, 'Password must be at least 8 characters')
      .custom('confirmPassword', 
        (value, context) => context?.password === value,
        'Passwords must match'
      )
      .metadata('category', 'authentication')
      .build();

    expect(schema.name).toBe('test');
    expect(schema.version).toBe('1.0.0');
    expect(schema.rules).toHaveLength(5);
    expect(schema.metadata?.category).toBe('authentication');
  });

  test('should support different validation types', () => {
    interface Contact {
      email: string;
      age: number;
      website: string;
    }

    const schema = new ValidationSchemaBuilder<Contact>('contact')
      .email('email', 'Invalid email format')
      .range('age', 0, 120, 'Age must be 0-120')
      .pattern('website', /^https?:\/\//, 'Website must start with http:// or https://')
      .build();

    expect(schema.rules).toHaveLength(3);
    expect(schema.rules[0].type).toBe('format');
    expect(schema.rules[1].type).toBe('range');
    expect(schema.rules[2].type).toBe('format');
  });
});

describe('BuiltInValidators', () => {
  test('required validator should work correctly', () => {
    const validator = BuiltInValidators.required();
    
    expect(validator.validate('value').valid).toBe(true);
    expect(validator.validate('').valid).toBe(false);
    expect(validator.validate(null).valid).toBe(false);
    expect(validator.validate(undefined).valid).toBe(false);
  });

  test('email validator should work correctly', () => {
    const validator = BuiltInValidators.email();
    
    expect(validator.validate('test@example.com').valid).toBe(true);
    expect(validator.validate('user.name+tag@domain.co.uk').valid).toBe(true);
    expect(validator.validate('invalid-email').valid).toBe(false);
    expect(validator.validate('test@').valid).toBe(false);
    expect(validator.validate('@example.com').valid).toBe(false);
    
    // Should allow empty values (optional)
    expect(validator.validate('').valid).toBe(true);
    expect(validator.validate(null).valid).toBe(true);
  });

  test('range validator should work correctly', () => {
    const validator = BuiltInValidators.range(10, 100);
    
    expect(validator.validate(50).valid).toBe(true);
    expect(validator.validate('75').valid).toBe(true);
    expect(validator.validate(10).valid).toBe(true);
    expect(validator.validate(100).valid).toBe(true);
    expect(validator.validate(5).valid).toBe(false);
    expect(validator.validate(150).valid).toBe(false);
    expect(validator.validate('invalid').valid).toBe(false);
    
    // Should allow empty values (optional)
    expect(validator.validate('').valid).toBe(true);
  });

  test('length validator should work correctly', () => {
    const validator = BuiltInValidators.length(2, 10);
    
    expect(validator.validate('hello').valid).toBe(true);
    expect(validator.validate('hi').valid).toBe(true);
    expect(validator.validate('1234567890').valid).toBe(true);
    expect(validator.validate('a').valid).toBe(false);
    expect(validator.validate('12345678901').valid).toBe(false);
    
    // Should allow empty values (optional)
    expect(validator.validate('').valid).toBe(true);
  });

  test('pattern validator should work correctly', () => {
    const validator = BuiltInValidators.pattern(/^[A-Z][a-z]+$/, 'Must start with capital letter');
    
    expect(validator.validate('Hello').valid).toBe(true);
    expect(validator.validate('World').valid).toBe(true);
    expect(validator.validate('hello').valid).toBe(false);
    expect(validator.validate('HELLO').valid).toBe(false);
    expect(validator.validate('123').valid).toBe(false);
    
    // Should allow empty values (optional)
    expect(validator.validate('').valid).toBe(true);
  });

  test('custom validator should work correctly', () => {
    const validator = BuiltInValidators.custom(
      (value, context) => {
        return typeof value === 'string' && value.includes(context?.keyword || '');
      },
      'Value must contain the keyword'
    );
    
    const context = { keyword: 'test' };
    expect(validator.validate('testing', context).valid).toBe(true);
    expect(validator.validate('example', context).valid).toBe(false);
    expect(validator.validate(123, context).valid).toBe(false);
  });
});

describe('CommonSchemas', () => {
  test('user schema should validate correctly', async () => {
    const engine = new ValidationEngine();
    const schema = CommonSchemas.createUserSchema();
    engine.registerSchema(schema);

    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };

    const result = await engine.validate(validUser, 'user');
    expect(result.valid).toBe(true);
  });

  test('config schema should validate correctly', async () => {
    const engine = new ValidationEngine();
    const schema = CommonSchemas.createConfigSchema();
    engine.registerSchema(schema);

    const validConfig = {
      host: 'localhost',
      port: 8080,
      ssl: true,
      timeout: 5000
    };

    const result = await engine.validate(validConfig, 'config');
    expect(result.valid).toBe(true);
  });

  test('agent schema should validate correctly', async () => {
    const engine = new ValidationEngine();
    const schema = CommonSchemas.createAgentSchema();
    engine.registerSchema(schema);

    const validAgent = {
      type: 'coder',
      name: 'CodeAgent',
      config: { language: 'typescript' }
    };

    const result = await engine.validate(validAgent, 'agent');
    expect(result.valid).toBe(true);

    // Test invalid agent type
    const invalidAgent = {
      type: 'invalid-type',
      name: 'TestAgent',
      config: {}
    };

    const invalidResult = await engine.validate(invalidAgent, 'agent');
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors.some(e => e.field === 'type')).toBe(true);
  });
});