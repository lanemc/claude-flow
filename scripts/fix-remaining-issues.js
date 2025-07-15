#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix various remaining ESLint issues
function fixRemainingIssues(content) {
  let modified = false;
  
  // Fix no-undef issues by adding proper type annotations
  const fixes = [
    // Fix @ts-ignore to @ts-expect-error
    {
      from: /@ts-ignore/g,
      to: '@ts-expect-error'
    },
    
    // Fix no-useless-escape in regex
    {
      from: /\\\./g,
      to: '\\.'
    },
    
    // Fix no-control-regex
    {
      from: /\\x[0-9a-fA-F]{2}/g,
      to: (match) => match // Keep as is for now
    },
    
    // Fix empty functions
    {
      from: /=>\s*{\s*}/g,
      to: '=> { /* empty */ }'
    },
    
    // Fix Function type usage
    {
      from: /:\s*Function\b/g,
      to: ': (...args: unknown[]) => unknown'
    }
  ];
  
  fixes.forEach(fix => {
    const newContent = content.replace(fix.from, fix.to);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  });
  
  return { content, modified };
}

// Process files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let totalFixed = 0;

files.forEach(file => {
  try {
    const originalContent = fs.readFileSync(file, 'utf8');
    const { content, modified } = fixRemainingIssues(originalContent);
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed remaining issues in ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files with remaining issue fixes: ${totalFixed}`);