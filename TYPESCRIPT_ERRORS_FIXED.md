# TypeScript Errors Fixed

## Summary of Fixes Applied

### 1. **src/cli/commands/hive-mind/wizard-broken.ts** ✅ FIXED
- **Issue**: Shebang on line 13 instead of line 1
- **Fix**: Moved shebang to first line, fixed import order, renamed to wizard.ts
- **Status**: Complete

### 2. **src/cli/simple-cli.ts** ⚠️ PARTIALLY FIXED
- **Issues Fixed**:
  - Fixed unterminated string literals
  - Fixed switch/case structure for terminal commands
  - Fixed missing closing braces
- **Issues Remaining**: Still has many syntax errors (needs more work)

### 3. **src/swarm/prompt-utils.ts** ✅ FIXED
- **Issue**: Missing fs.statSync call
- **Fix**: Added proper fs.statSync implementation
- **Status**: Complete (but file may have other issues)

### 4. **src/task/commands.ts** ✅ FIXED
- **Issue**: Missing closing braces in switch cases
- **Fix**: Added proper braces and fixed indentation
- **Status**: Complete

### 5. **src/cli/simple-commands/sparc/index.js** ✅ FIXED
- **Issue**: Importing non-existent .js files
- **Fix**: Updated imports to use .ts extensions for TypeScript files
- **Status**: Complete

### 6. **src/cli/commands/index.ts** ✅ FIXED
- **Issue**: Missing closing brace before default case
- **Fix**: Added missing brace
- **Status**: Complete

## Remaining Issues

Based on the latest `tsc` run, there are still significant errors in:
1. **src/cli/simple-cli.ts** - Multiple declaration and syntax errors
2. **src/swarm/prompt-utils.ts** - Multiple syntax errors despite initial fix

## Next Steps

1. Need to do a comprehensive fix of simple-cli.ts
2. Need to review prompt-utils.ts for additional syntax issues
3. Run `tsc` again after fixes to verify all errors are resolved

## Progress
- Initial errors: 200+
- Fixed files: 5
- Partially fixed: 1
- Still needs work: 2 major files

## Detailed Refactoring Plan for Next Session

### 1. **src/cli/simple-cli.ts Refactoring Plan**

#### Issues to Fix:
- Multiple "Declaration or statement expected" errors (lines 258, 323, 406, 441, etc.)
- Missing semicolons and comma errors
- Malformed switch/case statements
- Broken string interpolations

#### Refactoring Strategy:
1. **Extract Switch Cases to Functions**
   ```typescript
   // Instead of massive switch statement, create handler functions
   const handlers = {
     terminal: handleTerminalCommand,
     agent: handleAgentCommand,
     task: handleTaskCommand,
     // etc.
   };
   ```

2. **Fix All Terminal Sub-commands**
   - Lines 258-678: Terminal command has nested switch with broken syntax
   - Extract each sub-command (pool, create, execute, etc.) into separate functions
   - Fix all unterminated template literals

3. **Restructure Main Switch Statement**
   - The main switch (starting around line 200) needs proper case/break structure
   - Ensure all cases have proper closing braces
   - Fix indentation to make structure clear

4. **Fix Specific Syntax Errors**
   - Line 756-759: Fix comma/semicolon issues in object literals
   - Line 911: Fix statement syntax
   - Line 939, 948, 984, etc.: Fix declaration errors

### 2. **src/swarm/prompt-utils.ts Refactoring Plan**

#### Issues to Fix:
- Multiple syntax errors starting at line 155
- Expression and declaration errors throughout
- Malformed object literals and function definitions

#### Refactoring Strategy:
1. **Review Lines 140-190**
   - Check for unclosed braces/brackets
   - Fix any malformed method definitions
   - Ensure proper TypeScript syntax for class methods

2. **Fix Object Literal Issues (Lines 155-230)**
   - Multiple comma and colon errors indicate malformed objects
   - Check for missing quotes in property names
   - Fix any unterminated strings

3. **Fix Async/Promise Syntax (Lines 189-275)**
   - "const" keyword errors suggest syntax issues in async functions
   - Check for proper async/await usage
   - Fix any Promise chain syntax

4. **Complete Class Definition**
   - Ensure the class has proper closing brace
   - Check all method signatures are valid TypeScript

### 3. **Automated Fix Script**

Create a script to help with common issues:
```javascript
// scripts/fix-syntax-errors.js
const fs = require('fs');

function fixCommonIssues(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix common patterns
  content = content
    .replace(/}\s*case\s+/g, '}\nbreak;\n\ncase ') // Add missing breaks
    .replace(/{\s*}\s*}/g, '{ }')  // Fix empty braces
    .replace(/\$\{([^}]+)\n\n\s*\}\}/g, '${$1}'); // Fix broken template literals
    
  fs.writeFileSync(filePath, content);
}
```

### 4. **Testing Strategy**
1. Run `npx tsc --noEmit` after each major fix
2. Focus on one file at a time
3. Use `npx eslint --fix` for automatic formatting
4. Consider using `prettier` for consistent formatting

### 5. **Priority Order**
1. Fix simple-cli.ts first (it has the most errors)
2. Then fix prompt-utils.ts
3. Run full test suite to ensure no regressions
4. Update all imports/exports as needed