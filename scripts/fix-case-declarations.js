#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix no-case-declarations by wrapping case blocks in braces
function fixCaseDeclarations(content) {
  let modified = false;
  
  // Pattern to match case statements that declare variables without braces
  const casePattern = /(\s*case\s+[^:]*:\s*)((?:(?!case|default|break|\})[^])*?)(\s*break;)/gm;
  
  content = content.replace(casePattern, (match, caseStart, caseBody, breakStatement) => {
    // Check if case body contains variable declarations (const, let, var)
    if (caseBody.match(/\b(?:const|let|var)\s+\w+/) && !caseBody.trim().startsWith('{')) {
      modified = true;
      // Wrap the case body in braces
      const indentMatch = caseStart.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      return `${caseStart}{\n${caseBody}${breakStatement}\n${indent}}`;
    }
    return match;
  });
  
  // Also handle case statements without break
  const caseWithoutBreakPattern = /(\s*case\s+[^:]*:\s*)((?:(?!case|default|\})[^])*?)(?=\s*case|\s*default|\s*\})/gm;
  
  content = content.replace(caseWithoutBreakPattern, (match, caseStart, caseBody) => {
    // Check if case body contains variable declarations and doesn't already have braces
    if (caseBody.match(/\b(?:const|let|var)\s+\w+/) && !caseBody.trim().startsWith('{') && !caseBody.trim().endsWith('}')) {
      modified = true;
      const indentMatch = caseStart.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      return `${caseStart}{\n${caseBody}\n${indent}}`;
    }
    return match;
  });
  
  return { content, modified };
}

// Process files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let totalFixed = 0;

files.forEach(file => {
  try {
    const originalContent = fs.readFileSync(file, 'utf8');
    const { content, modified } = fixCaseDeclarations(originalContent);
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed case declarations in ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files with case declaration fixes: ${totalFixed}`);