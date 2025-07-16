/**
 * TypeScript Validation Engine - Comprehensive type-safe validation system
 */

import { 
  ValidationSchema, 
  ValidationRule, 
  ValidationValidator,
  ValidationRuleResult,
  TypedValidationResult,
  ValidationError,
  ValidationWarning
} from '../migration/types.js';

// Built-in validators
export class BuiltInValidators {
  static required<T>(): ValidationValidator<T> {
    return {
      validate: (value: any): ValidationRuleResult => {
        const valid = value !== undefined && value !== null && value !== '';
        return {
          valid,
          message: valid ? undefined : 'Field is required'
        };
      }
    };
  }

  static email(): ValidationValidator<any> {
    return {
      validate: (value: any): ValidationRuleResult => {
        if (!value) return { valid: true }; // Optional field
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(String(value));
        return {
          valid,
          message: valid ? undefined : 'Must be a valid email address'
        };
      }
    };
  }

  static range(min: number, max: number): ValidationValidator<any> {
    return {
      validate: (value: any): ValidationRuleResult => {
        if (!value) return { valid: true }; // Optional field
        
        const numValue = Number(value);
        const valid = !isNaN(numValue) && numValue >= min && numValue <= max;
        return {
          valid,
          message: valid ? undefined : `Value must be between ${min} and ${max}`
        };
      }
    };
  }

  static stringLength(min: number, max: number): ValidationValidator<any> {
    return {
      validate: (value: any): ValidationRuleResult => {
        if (!value) return { valid: true }; // Optional field
        
        const length = String(value).length;
        const valid = length >= min && length <= max;
        return {
          valid,
          message: valid ? undefined : `Length must be between ${min} and ${max} characters`
        };
      }
    };
  }

  static pattern(regex: RegExp, message?: string): ValidationValidator<any> {
    return {
      validate: (value: any): ValidationRuleResult => {
        if (!value) return { valid: true }; // Optional field
        
        const valid = regex.test(String(value));
        return {
          valid,
          message: valid ? undefined : (message || 'Value does not match required pattern')
        };
      }
    };
  }

  static custom<T>(
    validatorFn: (value: any, context?: T) => boolean,
    message: string
  ): ValidationValidator<T> {
    return {
      validate: (value: any, context?: T): ValidationRuleResult => {
        const valid = validatorFn(value, context);
        return {
          valid,
          message: valid ? undefined : message
        };
      }
    };
  }
}

// Schema builder for type-safe validation
export class ValidationSchemaBuilder<T> {
  private schema: ValidationSchema<T>;

  constructor(name: string, version: string = '1.0.0') {
    this.schema = {
      name,
      version,
      rules: [],
      metadata: {}
    };
  }

  addRule(
    field: keyof T | string,
    type: 'required' | 'format' | 'range' | 'custom',
    validator: ValidationValidator<T>,
    message: string,
    severity: 'error' | 'warning' | 'info' = 'error'
  ): this {
    this.schema.rules.push({
      name: `${String(field)}_${type}`,
      type,
      field,
      validator,
      message,
      severity
    });
    return this;
  }

  required(field: keyof T, message?: string): this {
    return this.addRule(
      field,
      'required',
      BuiltInValidators.required<T>(),
      message || `${String(field)} is required`
    );
  }

  email(field: keyof T, message?: string): this {
    return this.addRule(
      field,
      'format',
      BuiltInValidators.email(),
      message || `${String(field)} must be a valid email`
    );
  }

  range(field: keyof T, min: number, max: number, message?: string): this {
    return this.addRule(
      field,
      'range',
      BuiltInValidators.range(min, max),
      message || `${String(field)} must be between ${min} and ${max}`
    );
  }

  length(field: keyof T, min: number, max: number, message?: string): this {
    return this.addRule(
      field,
      'format',
      BuiltInValidators.stringLength(min, max),
      message || `${String(field)} length must be between ${min} and ${max}`
    );
  }

  pattern(field: keyof T, regex: RegExp, message?: string): this {
    return this.addRule(
      field,
      'format',
      BuiltInValidators.pattern(regex, message),
      message || `${String(field)} format is invalid`
    );
  }

  custom(
    field: keyof T,
    validatorFn: (value: any, context?: T) => boolean,
    message: string,
    severity: 'error' | 'warning' | 'info' = 'error'
  ): this {
    return this.addRule(
      field,
      'custom',
      BuiltInValidators.custom<T>(validatorFn, message),
      message,
      severity
    );
  }

  metadata(key: string, value: any): this {
    this.schema.metadata = this.schema.metadata || {};
    this.schema.metadata[key] = value;
    return this;
  }

  build(): ValidationSchema<T> {
    return { ...this.schema };
  }
}

// Main validation engine
export class ValidationEngine {
  private schemas: Map<string, ValidationSchema> = new Map();

  registerSchema<T>(schema: ValidationSchema<T>): void {
    this.schemas.set(schema.name, schema);
  }

  getSchema<T>(name: string): ValidationSchema<T> | undefined {
    return this.schemas.get(name) as ValidationSchema<T>;
  }

  async validate<T>(
    data: T,
    schemaName: string
  ): Promise<TypedValidationResult<T>> {
    const schema = this.getSchema<T>(schemaName);
    
    if (!schema) {
      throw new Error(`Schema not found: ${schemaName}`);
    }

    const result: TypedValidationResult<T> = {
      valid: true,
      data,
      checks: [],
      errors: [],
      warnings: [],
      metadata: {
        timestamp: new Date(),
        schema: schema.name,
        version: schema.version
      }
    };

    // Run all validation rules
    for (const rule of schema.rules) {
      const fieldValue = this.getFieldValue(data, String(rule.field));
      const ruleResult = rule.validator.validate(fieldValue, data);

      // Add to checks
      result.checks.push({
        name: rule.name,
        passed: ruleResult.valid,
        message: ruleResult.message,
        details: ruleResult.details
      });

      // Add to errors/warnings if validation failed
      if (!ruleResult.valid) {
        const error: ValidationError | ValidationWarning = {
          field: String(rule.field),
          message: ruleResult.message || rule.message,
          value: fieldValue,
          rule: rule.name,
          severity: rule.severity
        };

        if (rule.severity === 'error') {
          result.errors.push(error as ValidationError);
          result.valid = false;
        } else {
          result.warnings.push(error as ValidationWarning);
        }
      }
    }

    return result;
  }

  async validateMultiple<T>(
    dataArray: T[],
    schemaName: string
  ): Promise<TypedValidationResult<T>[]> {
    return Promise.all(
      dataArray.map(data => this.validate(data, schemaName))
    );
  }

  private getFieldValue(data: any, field: string): any {
    if (field.includes('.')) {
      // Support nested field access (e.g., 'user.email')
      return field.split('.').reduce((obj, key) => obj?.[key], data);
    }
    return data?.[field];
  }
}

// Predefined schemas for common validation scenarios
export const CommonSchemas = {
  // User validation schema
  createUserSchema(): ValidationSchema<{
    name: string;
    email: string;
    age?: number;
  }> {
    return new ValidationSchemaBuilder<{
      name: string;
      email: string;
      age?: number;
    }>('user', '1.0.0')
      .required('name', 'Name is required')
      .length('name', 2, 100, 'Name must be between 2 and 100 characters')
      .required('email', 'Email is required')
      .email('email', 'Must be a valid email address')
      .range('age', 0, 150, 'Age must be between 0 and 150')
      .build();
  },

  // Configuration validation schema
  createConfigSchema(): ValidationSchema<{
    host: string;
    port: number;
    ssl: boolean;
    timeout?: number;
  }> {
    return new ValidationSchemaBuilder<{
      host: string;
      port: number;
      ssl: boolean;
      timeout?: number;
    }>('config', '1.0.0')
      .required('host', 'Host is required')
      .pattern('host', /^[\w.-]+$/, 'Host must be a valid hostname')
      .required('port', 'Port is required')
      .range('port', 1, 65535, 'Port must be between 1 and 65535')
      .required('ssl', 'SSL setting is required')
      .range('timeout', 100, 30000, 'Timeout must be between 100ms and 30s')
      .build();
  },

  // Agent configuration schema
  createAgentSchema(): ValidationSchema<{
    type: string;
    name: string;
    config: Record<string, any>;
  }> {
    return new ValidationSchemaBuilder<{
      type: string;
      name: string;
      config: Record<string, any>;
    }>('agent', '1.0.0')
      .required('type', 'Agent type is required')
      .custom('type', (value) => {
        const validTypes = ['architect', 'coder', 'analyst', 'tester', 'researcher', 'coordinator'];
        return validTypes.includes(value);
      }, 'Agent type must be one of: architect, coder, analyst, tester, researcher, coordinator')
      .required('name', 'Agent name is required')
      .length('name', 1, 50, 'Agent name must be between 1 and 50 characters')
      .required('config', 'Agent configuration is required')
      .build();
  }
};

// Export a default validation engine instance
export const defaultValidationEngine = new ValidationEngine();

// Register common schemas
defaultValidationEngine.registerSchema(CommonSchemas.createUserSchema());
defaultValidationEngine.registerSchema(CommonSchemas.createConfigSchema());
defaultValidationEngine.registerSchema(CommonSchemas.createAgentSchema());