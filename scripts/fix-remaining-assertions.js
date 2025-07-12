#!/usr/bin/env node

/**
 * Script to fix remaining assertion issues in converted test files
 */

import fs from 'fs';
import { glob } from 'glob';

// Additional assertion replacements for edge cases
const ASSERTION_FIXES = {
  // Fix remaining function-based assertions
  'assertThrows\\((.*?)\\)': 'expect($1).toThrow()',
  'assertRejects\\((.*?)\\)': 'expect($1).rejects.toThrow()',
  'assertEquals\\((.*?)\\)': 'expect($1).toBe($2)', // This will need manual review
  'assertExists\\((.*?)\\)': 'expect($1).toBeDefined()',
  
  // Fix Deno environment variables
  'Deno\\.env\\.get\\((.*?)\\)': 'process.env[$1]',
  'Deno\\.env\\.set\\((.*?),\\s*(.*?)\\)': 'process.env[$1] = $2',
  'Deno\\.env\\.delete\\((.*?)\\)': 'delete process.env[$1]',
  
  // Fix Deno file operations (simple cases)
  'Deno\\.readTextFile\\((.*?)\\)': 'fs.readFileSync($1, "utf8")',
  'Deno\\.writeTextFile\\((.*?),\\s*(.*?)\\)': 'fs.writeFileSync($1, $2)',
  'Deno\\.stat\\((.*?)\\)': 'fs.statSync($1)',
  'Deno\\.remove\\((.*?)\\)': 'fs.rmSync($1, { recursive: true, force: true })',
  'Deno\\.mkdir\\((.*?)\\)': 'fs.mkdirSync($1, { recursive: true })',
  
  // Fix test function calls (Deno style to Jest style)
  'Deno\\.test\\((.*?)\\)': 'it($1)',
  
  // Fix spy/mock calls
  '\\.calls\\.length': '.mock.calls.length',
  '\\.calls\\[(\\d+)\\]\\.args': '.mock.calls[$1]',
  '\\.restore\\(\\)': '.mockRestore()',
};

function fixAssertions(filePath) {
  console.log(`Fixing assertions in: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Apply assertion fixes
  Object.entries(ASSERTION_FIXES).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });
  
  // Add missing imports if Jest functions are used
  if (content.includes('expect(') && !content.includes('import') && !content.includes('expect')) {
    content = 'import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";\n' + content;
    changed = true;
  }
  
  // Fix import statements if they're still using Deno patterns
  if (content.includes('import { describe, it') && content.includes('test.utils.ts')) {
    // Ensure we have all necessary Jest imports
    content = content.replace(
      /import\s*\{[^}]*\}\s*from\s*['"]\.\.[^'"]*test\.utils\.ts['"];?/,
      'import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";'
    );
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed: ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes: ${filePath}`);
  }
  
  return changed;
}

async function main() {
  console.log('🔧 Fixing remaining assertion issues...\n');
  
  // Find all test files that might need fixing
  const testFiles = await glob('tests/**/*.{test,spec}.{ts,js}', {
    ignore: ['node_modules/**', 'dist/**', 'bin/**']
  });
  
  console.log(`Found ${testFiles.length} test files to check:\n`);
  
  let fixedCount = 0;
  
  testFiles.forEach(filePath => {
    if (fixAssertions(filePath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Assertion fixes complete!`);
  console.log(`📊 Stats:`);
  console.log(`   - Total files: ${testFiles.length}`);
  console.log(`   - Fixed: ${fixedCount}`);
  console.log(`   - Unchanged: ${testFiles.length - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log(`\n✅ Ready to test with: npm test`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { fixAssertions, ASSERTION_FIXES };