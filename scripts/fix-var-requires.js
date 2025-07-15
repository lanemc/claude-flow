#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix @typescript-eslint/no-var-requires by converting to import statements
function fixVarRequires(content) {
  let modified = false;
  
  // Convert require statements to import statements
  const requirePatterns = [
    // const module = require('module-name')
    {
      from: /const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g,
      to: "import $1 from '$2';"
    },
    // const { something } = require('module-name')
    {
      from: /const\s*\{\s*([^}]+)\s*\}\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g,
      to: "import { $1 } from '$2';"
    },
    // let module = require('module-name')
    {
      from: /let\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g,
      to: "import $1 from '$2';"
    },
    // var module = require('module-name')
    {
      from: /var\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\);?/g,
      to: "import $1 from '$2';"
    }
  ];
  
  requirePatterns.forEach(pattern => {
    const newContent = content.replace(pattern.from, pattern.to);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  });
  
  // Handle require() calls in .js files by adding appropriate TypeScript wrappers
  if (modified) {
    // Ensure imports are at the top of the file
    const lines = content.split('\n');
    const imports = [];
    const nonImports = [];
    
    lines.forEach(line => {
      if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
        imports.push(line);
      } else {
        nonImports.push(line);
      }
    });
    
    if (imports.length > 0) {
      content = [...imports, '', ...nonImports].join('\n');
    }
  }
  
  return { content, modified };
}

// Process files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let totalFixed = 0;

files.forEach(file => {
  try {
    const originalContent = fs.readFileSync(file, 'utf8');
    const { content, modified } = fixVarRequires(originalContent);
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Fixed require statements in ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal files with require statement fixes: ${totalFixed}`);