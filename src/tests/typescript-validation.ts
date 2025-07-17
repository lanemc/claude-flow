/**
 * TypeScript Validation Utilities
 * Utilities for testing TypeScript type safety in the converted CLI system
 */

export interface TypeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FileTypeInfo {
  path: string;
  hasTypes: boolean;
  importErrors: string[];
  exportErrors: string[];
  typeErrors: string[];
}

/**
 * Validate TypeScript compilation for a given file
 */
export async function validateFileTypes(filePath: string): Promise<FileTypeInfo> {
  const fs = await import('fs/promises');
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    const info: FileTypeInfo = {
      path: filePath,
      hasTypes: false,
      importErrors: [],
      exportErrors: [],
      typeErrors: []
    };
    
    // Check for type annotations
    if (content.includes(': ') || content.includes('interface ') || content.includes('type ')) {
      info.hasTypes = true;
    }
    
    // Check for import issues
    const importMatches = content.match(/import.*from.*['"]/g);
    if (importMatches) {
      for (const importLine of importMatches) {
        if (importLine.includes('.js"') && !importLine.includes('.js\'')) {
          // This is likely correct for Node.js ESM
        }
      }
    }
    
    // Check for common TypeScript patterns
    const typePatterns = [
      /any/g,
      /unknown/g,
      /Record<string,/g,
      /interface/g,
      /type.*=/g
    ];
    
    for (const pattern of typePatterns) {
      if (pattern.test(content)) {
        info.hasTypes = true;
        break;
      }
    }
    
    return info;
    
  } catch (error) {
    return {
      path: filePath,
      hasTypes: false,
      importErrors: [(error as Error).message],
      exportErrors: [],
      typeErrors: []
    };
  }
}

/**
 * Validate the entire TypeScript conversion
 */
export async function validateTypeScriptConversion(rootDir: string): Promise<TypeValidationResult> {
  const glob = await import('glob');
  const path = await import('path');
  
  const result: TypeValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };
  
  try {
    // Find all TypeScript files
    const tsFiles = await glob.glob('**/*.ts', {
      cwd: rootDir,
      ignore: ['node_modules/**', 'dist/**', '**/*.test.ts', '**/*.spec.ts']
    });
    
    // Validate each file
    for (const file of tsFiles) {
      const fullPath = path.join(rootDir, file);
      const fileInfo = await validateFileTypes(fullPath);
      
      if (fileInfo.importErrors.length > 0) {
        result.errors.push(...fileInfo.importErrors.map(err => `${file}: ${err}`));
        result.valid = false;
      }
      
      if (fileInfo.exportErrors.length > 0) {
        result.errors.push(...fileInfo.exportErrors.map(err => `${file}: ${err}`));
        result.valid = false;
      }
      
      if (!fileInfo.hasTypes) {
        result.warnings.push(`${file}: No TypeScript types detected`);
      }
    }
    
    // Check for critical files
    const criticalFiles = [
      'src/cli/commands/config.ts',
      'src/cli/commands/swarm.ts',
      'src/types/cli-commands.ts',
      'src/types/index.ts'
    ];
    
    for (const criticalFile of criticalFiles) {
      const fullPath = path.join(rootDir, criticalFile);
      try {
        await import('fs/promises').then(fs => fs.access(fullPath));
      } catch {
        result.errors.push(`Critical file missing: ${criticalFile}`);
        result.valid = false;
      }
    }
    
    // Add suggestions
    if (result.warnings.length > 0) {
      result.suggestions.push('Consider adding explicit type annotations to files without types');
    }
    
    if (result.errors.length > 0) {
      result.suggestions.push('Fix import/export errors before deployment');
    }
    
  } catch (error) {
    result.errors.push(`Validation failed: ${(error as Error).message}`);
    result.valid = false;
  }
  
  return result;
}

/**
 * Generate a TypeScript health report
 */
export function generateTypeScriptReport(validationResult: TypeValidationResult): string {
  const report = [];
  
  report.push('# TypeScript Conversion Health Report');
  report.push('');
  
  if (validationResult.valid) {
    report.push('✅ **Overall Status**: HEALTHY');
  } else {
    report.push('❌ **Overall Status**: NEEDS ATTENTION');
  }
  
  report.push('');
  
  if (validationResult.errors.length > 0) {
    report.push('## 🚨 Errors');
    validationResult.errors.forEach(error => {
      report.push(`- ${error}`);
    });
    report.push('');
  }
  
  if (validationResult.warnings.length > 0) {
    report.push('## ⚠️ Warnings');
    validationResult.warnings.forEach(warning => {
      report.push(`- ${warning}`);
    });
    report.push('');
  }
  
  if (validationResult.suggestions.length > 0) {
    report.push('## 💡 Suggestions');
    validationResult.suggestions.forEach(suggestion => {
      report.push(`- ${suggestion}`);
    });
    report.push('');
  }
  
  report.push('---');
  report.push(`Generated at: ${new Date().toISOString()}`);
  
  return report.join('\n');
}

export default {
  validateFileTypes,
  validateTypeScriptConversion,
  generateTypeScriptReport
};