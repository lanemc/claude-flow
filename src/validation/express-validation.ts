/**
 * Express.js TypeScript validation middleware
 * Replaces examples/user-api/middleware/validation.js with type safety
 */

import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain, Result } from 'express-validator';
import { ValidationEngine, ValidationSchemaBuilder, BuiltInValidators } from './validation-engine.js';
import { TypedValidationResult } from '../migration/types.js';

// Types for Express validation
export interface ValidationErrorResponse {
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface TypedRequest<T> extends Request {
  validatedBody?: T;
}

// Enhanced error handler with type safety
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors: ValidationErrorResponse = {
      errors: errors.array().map((error: any) => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }))
    };
    return res.status(400).json(formattedErrors);
  }
  next();
};

// Type-safe validation chains
export class ExpressValidationChains {
  // User validation
  static validateUser(): ValidationChain[] {
    return [
      body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .escape(), // Sanitize HTML
      
      body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail()
        .custom(async (email: string) => {
          // Add custom async validation if needed
          // e.g., check if email already exists
          return true;
        }),
      
      body('age')
        .optional()
        .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150')
        .toInt()
    ];
  }

  static validateUserUpdate(): ValidationChain[] {
    return [
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .escape(),
      
      body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
      
      body('age')
        .optional()
        .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150')
        .toInt()
    ];
  }

  // Agent validation
  static validateAgent(): ValidationChain[] {
    const validAgentTypes = ['architect', 'coder', 'analyst', 'tester', 'researcher', 'coordinator'];
    
    return [
      body('type')
        .trim()
        .notEmpty().withMessage('Agent type is required')
        .isIn(validAgentTypes).withMessage(`Agent type must be one of: ${validAgentTypes.join(', ')}`),
      
      body('name')
        .trim()
        .notEmpty().withMessage('Agent name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Agent name must be between 1 and 50 characters')
        .escape(),
      
      body('config')
        .notEmpty().withMessage('Agent configuration is required')
        .isObject().withMessage('Agent configuration must be an object')
        .custom((config: any) => {
          // Validate config structure
          if (typeof config !== 'object' || config === null) {
            throw new Error('Configuration must be a valid object');
          }
          return true;
        })
    ];
  }

  // Configuration validation
  static validateConfig(): ValidationChain[] {
    return [
      body('host')
        .trim()
        .notEmpty().withMessage('Host is required')
        .matches(/^[\w.-]+$/).withMessage('Host must be a valid hostname'),
      
      body('port')
        .notEmpty().withMessage('Port is required')
        .isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1 and 65535')
        .toInt(),
      
      body('ssl')
        .notEmpty().withMessage('SSL setting is required')
        .isBoolean().withMessage('SSL must be a boolean value')
        .toBoolean(),
      
      body('timeout')
        .optional()
        .isInt({ min: 100, max: 30000 }).withMessage('Timeout must be between 100ms and 30s')
        .toInt()
    ];
  }

  // Rollback validation
  static validateRollback(): ValidationChain[] {
    const validPhases = ['sparc-init', 'claude-commands', 'memory-setup', 'coordination-setup', 'executable-creation'];
    
    return [
      body('phase')
        .optional()
        .trim()
        .isIn(validPhases).withMessage(`Phase must be one of: ${validPhases.join(', ')}`),
      
      body('backupId')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Backup ID must be between 1 and 100 characters')
        .matches(/^[\w-]+$/).withMessage('Backup ID must contain only alphanumeric characters and hyphens'),
      
      body('strategy')
        .optional()
        .trim()
        .isIn(['full', 'partial', 'selective']).withMessage('Strategy must be one of: full, partial, selective'),
      
      body('preserveUserData')
        .optional()
        .isBoolean().withMessage('preserveUserData must be a boolean')
        .toBoolean()
    ];
  }
}

// Advanced validation middleware with custom engine integration
export class TypedValidationMiddleware {
  private validationEngine: ValidationEngine;

  constructor(validationEngine: ValidationEngine) {
    this.validationEngine = validationEngine;
  }

  // Create middleware that validates using custom validation engine
  validateWithSchema<T>(schemaName: string) {
    return async (req: TypedRequest<T>, res: Response, next: NextFunction): Promise<void | Response> => {
      try {
        const result: TypedValidationResult<T> = await this.validationEngine.validate(
          req.body,
          schemaName
        );

        if (!result.valid) {
          const errorResponse: ValidationErrorResponse = {
            errors: [
              ...result.errors.map(error => ({
                field: error.field,
                message: error.message,
                value: error.value
              })),
              ...result.warnings.map(warning => ({
                field: warning.field,
                message: warning.message,
                value: warning.value
              }))
            ]
          };
          return res.status(400).json(errorResponse);
        }

        // Attach validated data to request
        req.validatedBody = result.data;
        next();
      } catch (error) {
        return res.status(500).json({
          errors: [{
            field: 'validation',
            message: `Validation error: ${error instanceof Error ? error.message : String(error)}`
          }]
        });
      }
    };
  }

  // Validate array of items
  validateArrayWithSchema<T>(schemaName: string) {
    return async (req: TypedRequest<T[]>, res: Response, next: NextFunction): Promise<void | Response> => {
      try {
        if (!Array.isArray(req.body)) {
          return res.status(400).json({
            errors: [{
              field: 'body',
              message: 'Request body must be an array'
            }]
          });
        }

        const results = await this.validationEngine.validateMultiple(
          req.body,
          schemaName
        );

        const hasErrors = results.some(result => !result.valid);
        
        if (hasErrors) {
          const allErrors: ValidationErrorResponse = {
            errors: []
          };

          results.forEach((result, index) => {
            if (!result.valid) {
              result.errors.forEach(error => {
                allErrors.errors.push({
                  field: `[${index}].${error.field}`,
                  message: error.message,
                  value: error.value
                });
              });
            }
          });

          return res.status(400).json(allErrors);
        }

        // Attach validated data to request
        req.validatedBody = results.map(result => result.data).filter(Boolean) as T[];
        next();
      } catch (error) {
        return res.status(500).json({
          errors: [{
            field: 'validation',
            message: `Array validation error: ${error instanceof Error ? error.message : String(error)}`
          }]
        });
      }
    };
  }
}

// Export pre-configured validation middleware
export const validationMiddleware = new TypedValidationMiddleware(new ValidationEngine());

// Export validation chain collections
export const ValidationChains = {
  user: [
    ...ExpressValidationChains.validateUser(),
    handleValidationErrors
  ],
  
  userUpdate: [
    ...ExpressValidationChains.validateUserUpdate(),
    handleValidationErrors
  ],
  
  agent: [
    ...ExpressValidationChains.validateAgent(),
    handleValidationErrors
  ],
  
  config: [
    ...ExpressValidationChains.validateConfig(),
    handleValidationErrors
  ],
  
  rollback: [
    ...ExpressValidationChains.validateRollback(),
    handleValidationErrors
  ]
};

// Legacy compatibility exports (for backward compatibility)
export const validateUser = ValidationChains.user;
export const validateUserUpdate = ValidationChains.userUpdate;

// Type definitions for exported interfaces
export interface UserCreateRequest {
  name: string;
  email: string;
  age?: number;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  age?: number;
}

export interface AgentCreateRequest {
  type: 'architect' | 'coder' | 'analyst' | 'tester' | 'researcher' | 'coordinator';
  name: string;
  config: Record<string, any>;
}

export interface ConfigRequest {
  host: string;
  port: number;
  ssl: boolean;
  timeout?: number;
}

export interface RollbackRequest {
  phase?: 'sparc-init' | 'claude-commands' | 'memory-setup' | 'coordination-setup' | 'executable-creation';
  backupId?: string;
  strategy?: 'full' | 'partial' | 'selective';
  preserveUserData?: boolean;
}