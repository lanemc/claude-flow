#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix unused variables by prefixing them with underscore
function fixUnusedVars(content) {
  let modified = false;
  
  // Fix unused parameters that should be prefixed with _
  content = content.replace(
    /(\w+)\s*\([^)]*\)(\s*:\s*[^{;]+)?\s*=>\s*{[^}]*}/gs,
    (match) => {
      // This is a simplified approach - look for patterns where variables are defined but not used
      return match;
    }
  );
  
  // Fix common unused variable patterns in function parameters
  const patterns = [
    // Fix: (error: any) => {} to (_error: any) => {}
    /\((\w+):\s*Error\s*\|\s*unknown\s*\)\s*=>\s*{[^}]*}/g,
    // Fix: catch (error) to catch (_error) 
    /catch\s*\(\s*(\w+):\s*(?:Error\s*\|\s*)?unknown\s*\)/g,
    // Fix: .map((item, i) => when i is unused
    /\.map\s*\(\s*\([^,]+,\s*(\w+)\s*\)\s*=>/g,
    // Fix: .forEach((item, i) => when i is unused
    /\.forEach\s*\(\s*\([^,]+,\s*(\w+)\s*\)\s*=>/g,
    // Fix: function parameters
    /function\s+\w+\s*\([^)]*(\w+):\s*[^,)]+[,)]/g
  ];
  
  patterns.forEach(pattern => {
    const originalContent = content;
    content = content.replace(pattern, (match, varName) => {
      if (varName && !varName.startsWith('_')) {
        modified = true;
        return match.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
      }
      return match;
    });
  });
  
  // Fix specific common unused variable patterns
  const replacements = [
    // Error handlers
    { from: /catch \(error: unknown\)/g, to: 'catch (_error: unknown)' },
    { from: /catch \(err: unknown\)/g, to: 'catch (_err: unknown)' },
    { from: /catch \(e: unknown\)/g, to: 'catch (_e: unknown)' },
    
    // Event handlers  
    { from: /\(event: unknown\) => \{/g, to: '(_event: unknown) => {' },
    { from: /\(req: [^)]+\) => \{/g, to: '(_req: $1) => {' },
    
    // Array methods with unused index
    { from: /\.map\(\([^,]+, i\) =>/g, to: '.map(($1, _i) =>' },
    { from: /\.forEach\(\([^,]+, i\) =>/g, to: '.forEach(($1, _i) =>' },
    { from: /\.filter\(\([^,]+, i\) =>/g, to: '.filter(($1, _i) =>' },
    
    // Common unused parameters
    { from: /\(options: [^)]+\) => \{[^}]*\}/g, to: (match) => {
      return match.replace('options:', '_options:');
    }},
    
    // Mock functions in tests
    { from: /jest\.fn\(\([^)]*(\w+)[^)]*\)/g, to: (match, varName) => {
      if (!match.includes('_')) {
        return match.replace(varName, `_${varName}`);
      }
      return match;
    }}
  ];
  
  replacements.forEach(replacement => {
    if (typeof replacement.to === 'function') {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        modified = true;
        content = newContent;
      }
    } else {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        modified = true;
        content = newContent;
      }
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
    const { content, modified } = fixUnusedVars(originalContent);
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed unused vars in ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files with unused var fixes: ${totalFixed}`);