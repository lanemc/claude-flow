#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common type replacements for 'any'
const typeReplacements = {
  // Function parameters and returns
  'callback: any': 'callback: (...args: unknown[]) => unknown',
  'handler: any': 'handler: (...args: unknown[]) => void',
  'fn: any': 'fn: (...args: unknown[]) => unknown',
  
  // Common data structures
  'data: any': 'data: Record<string, unknown>',
  'config: any': 'config: Record<string, unknown>',
  'options: any': 'options: Record<string, unknown>',
  'params: any': 'params: Record<string, unknown>',
  'metadata: any': 'metadata: Record<string, unknown>',
  'context: any': 'context: Record<string, unknown>',
  'state: any': 'state: Record<string, unknown>',
  'payload: any': 'payload: Record<string, unknown>',
  
  // Arrays
  'items: any[]': 'items: unknown[]',
  'results: any[]': 'results: unknown[]',
  'values: any[]': 'values: unknown[]',
  
  // Event and error types
  'error: any': 'error: Error | unknown',
  'event: any': 'event: Event | Record<string, unknown>',
  'response: any': 'response: Response | Record<string, unknown>',
  'request: any': 'request: Request | Record<string, unknown>',
  
  // Return types
  ': any {': ': unknown {',
  '): any': '): unknown',
  '> any': '> unknown',
  
  // Generic any usage
  '<any>': '<unknown>',
  'as any': 'as unknown',
  ': any;': ': unknown;',
  ': any,': ': unknown,',
  ': any)': ': unknown)',
  
  // Catch blocks
  'catch (error: any)': 'catch (error: unknown)',
  'catch (e: any)': 'catch (e: unknown)',
  'catch (err: any)': 'catch (err: unknown)',
};

// Process files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let totalFixed = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let fileFixed = 0;
    
    // Apply replacements
    Object.entries(typeReplacements).forEach(([search, replace]) => {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replace);
        fileFixed += matches.length;
      }
    });
    
    // Fix any[] arrays more broadly
    content = content.replace(/:\s*any\[\]/g, ': unknown[]');
    
    // Fix function return types
    content = content.replace(/\):\s*any\s*{/g, '): unknown {');
    content = content.replace(/=>\s*any/g, '=> unknown');
    
    // Fix generic type parameters
    content = content.replace(/<any,/g, '<unknown,');
    content = content.replace(/,\s*any>/g, ', unknown>');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`Fixed ${fileFixed} 'any' types in ${path.relative(process.cwd(), file)}`);
      totalFixed += fileFixed;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log(`\nTotal 'any' types fixed: ${totalFixed}`);