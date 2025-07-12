#!/usr/bin/env node

/**
 * Script to convert Deno imports to Node.js/Jest imports in test files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Conversion mappings
const IMPORT_REPLACEMENTS = {
  // Deno testing imports to Jest
  'import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from "https://deno.land/std@0.220.0/testing/bdd.ts";': 
    'import { describe, it, beforeEach, afterEach, beforeAll, afterAll, expect } from "@jest/globals";',
  
  'import { describe, it, beforeEach } from "https://deno.land/std@0.220.0/testing/bdd.ts";':
    'import { describe, it, beforeEach, expect } from "@jest/globals";',
  
  // Deno assertions to Jest
  'import { assertEquals, assertExists, assertRejects, assertThrows } from "https://deno.land/std@0.220.0/assert/mod.ts";':
    'import { expect } from "@jest/globals";',
  
  'import { assertEquals, assertExists, assertGreater } from "https://deno.land/std@0.220.0/assert/mod.ts";':
    'import { expect } from "@jest/globals";',
  
  // Deno mocking to Jest
  'import { spy, stub, assertSpyCall, assertSpyCalls } from "https://deno.land/std@0.220.0/testing/mock.ts";':
    'import { jest } from "@jest/globals";',
  
  'import { FakeTime } from "https://deno.land/std@0.220.0/testing/time.ts";':
    '// FakeTime equivalent available in test.utils.ts',
};

// Convert test utility imports to use the local version
const TEST_UTILS_REPLACEMENTS = {
  'import {\\s*([^}]+)\\s*} from [\'"]https://deno\\.land/std@0\\.220\\.0/[^\'\"]+[\'"];':
    'import { $1 } from "../test.utils.ts";'
};

// Assertion function replacements
const ASSERTION_REPLACEMENTS = {
  'assertEquals\\((.*?),\\s*(.*?)\\)': 'expect($1).toBe($2)',
  'assertExists\\((.*?)\\)': 'expect($1).toBeDefined()',
  'assertGreater\\((.*?),\\s*(.*?)\\)': 'expect($1).toBeGreaterThan($2)',
  'assertThrows\\(\\(\\)\\s*=>\\s*(.*?)\\)': 'expect(() => $1).toThrow()',
  'assertRejects\\((.*?)\\)': 'expect($1).rejects.toThrow()',
  'assert\\((.*?)\\)': 'expect($1).toBeTruthy()',
};

function convertFile(filePath) {
  console.log(`Converting: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Replace import statements
  Object.entries(IMPORT_REPLACEMENTS).forEach(([oldImport, newImport]) => {
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      changed = true;
    }
  });
  
  // Replace test utility imports with regex
  Object.entries(TEST_UTILS_REPLACEMENTS).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });
  
  // Replace assertion functions
  Object.entries(ASSERTION_REPLACEMENTS).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });
  
  // Replace any remaining Deno URL imports with test utils
  const denoUrlPattern = /import\s*\{[^}]+\}\s*from\s*['"]https:\/\/deno\.land\/std@[^'"]+['"];/g;
  if (denoUrlPattern.test(content)) {
    content = content.replace(denoUrlPattern, 'import { describe, it, beforeEach, afterEach, expect } from "../test.utils.ts";');
    changed = true;
  }
  
  // Write back if changed
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated: ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes: ${filePath}`);
  }
  
  return changed;
}

function main() {
  console.log('🔄 Converting Deno test imports to Node.js/Jest...\n');
  
  // Find all test files
  const testFiles = glob.sync('tests/**/*.{test,spec}.{ts,js}', {
    ignore: ['node_modules/**', 'dist/**', 'bin/**']
  });
  
  console.log(`Found ${testFiles.length} test files to process:\n`);
  
  let convertedCount = 0;
  
  testFiles.forEach(filePath => {
    if (convertFile(filePath)) {
      convertedCount++;
    }
  });
  
  console.log(`\n🎉 Conversion complete!`);
  console.log(`📊 Stats:`);
  console.log(`   - Total files: ${testFiles.length}`);
  console.log(`   - Converted: ${convertedCount}`);
  console.log(`   - Unchanged: ${testFiles.length - convertedCount}`);
  
  if (convertedCount > 0) {
    console.log(`\n✅ Ready to test with: npm test`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertFile, IMPORT_REPLACEMENTS, ASSERTION_REPLACEMENTS };