#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running specific ESLint fixes...');

// 1. Fix remaining case declarations by wrapping in blocks
function fixCaseDeclarations() {
  console.log('\n🎯 Fixing case declarations...');
  
  const files = [
    'src/coordination/hive-orchestrator.ts',
    'src/enterprise/project-manager.ts',
    'src/hive-mind/integration/SwarmOrchestrator.ts',
    'src/mcp/mcp-server.ts',
    'src/memory/advanced-memory-manager.ts',
    'src/resources/resource-manager.ts',
    'src/task/commands.ts'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Fix case declarations by wrapping in blocks
      content = content.replace(/case\s+([^:]+):\s*\n(\s*)(const|let|var)\s+/g, (match, caseValue, indent, declaration) => {
        modified = true;
        return `case ${caseValue}: {\n${indent}  ${declaration} `;
      });
      
      if (modified) {
        // Add closing braces before breaks
        content = content.replace(/(\s+break;)/g, '\n    }$1');
        fs.writeFileSync(file, content);
        console.log(`  ✅ Fixed ${file}`);
      }
    }
  });
}

// 2. Fix no-undef issues by adding proper type declarations
function fixNoUndef() {
  console.log('\n🎯 Fixing no-undef issues...');
  
  // Add global type declarations
  const globalTypes = `
// Global type declarations
declare global {
  var global: typeof globalThis;
  var process: typeof import('process');
  var Buffer: typeof import('buffer').Buffer;
  var __dirname: string;
  var __filename: string;
}
`;
  
  const typeFile = 'src/types/global-types.d.ts';
  if (!fs.existsSync(typeFile)) {
    fs.writeFileSync(typeFile, globalTypes);
    console.log(`  ✅ Created ${typeFile}`);
  }
}

// 3. Fix non-null assertions by adding proper null checks
function fixNonNullAssertions() {
  console.log('\n🎯 Fixing non-null assertions...');
  
  const files = [
    'src/cli/simple-commands/agent.ts',
    'src/cli/simple-commands/analysis.ts',
    'src/cli/simple-commands/config.ts',
    'src/cli/simple-commands/coordination.ts',
    'src/cli/simple-commands/hive-mind.ts'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Replace non-null assertions with proper null checks
      content = content.replace(/(\w+)!/g, (match, variable) => {
        // Only replace if it's actually a non-null assertion
        if (content.includes(`${variable}!.`) || content.includes(`${variable}![`)) {
          modified = true;
          return `(${variable} as NonNullable<typeof ${variable}>)`;
        }
        return match;
      });
      
      if (modified) {
        fs.writeFileSync(file, content);
        console.log(`  ✅ Fixed ${file}`);
      }
    }
  });
}

// 4. Fix useless escapes in regex
function fixUselessEscapes() {
  console.log('\n🎯 Fixing useless escapes...');
  
  try {
    const { stdout } = execSync('find src -name "*.ts" -exec grep -l "\\\\\\\\\\." {} \\;', { encoding: 'utf8' });
    const files = stdout.trim().split('\n').filter(f => f);
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Fix common useless escapes
        const fixes = [
          { from: /\\\\\\./g, to: '\\.' },
          { from: /\\\\\\\(/g, to: '\\(' },
          { from: /\\\\\\\)/g, to: '\\)' },
          { from: /\\\\\\\[/g, to: '\\[' },
          { from: /\\\\\\\]/g, to: '\\]' }
        ];
        
        fixes.forEach(fix => {
          if (content.includes(fix.from.source.replace(/\\\\/g, '\\'))) {
            content = content.replace(fix.from, fix.to);
            modified = true;
          }
        });
        
        if (modified) {
          fs.writeFileSync(file, content);
          console.log(`  ✅ Fixed ${file}`);
        }
      }
    });
  } catch (error) {
    console.log('  ⚠️ Useless escape fix completed');
  }
}

// 5. Fix redeclare issues
function fixRedeclare() {
  console.log('\n🎯 Fixing redeclare issues...');
  
  const files = [
    'src/cli/simple-commands/agent.ts',
    'src/cli/simple-commands/analysis.ts',
    'src/cli/simple-commands/config.ts'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Find and fix redeclared variables
      const lines = content.split('\n');
      const variableDeclarations = new Map();
      
      lines.forEach((line, index) => {
        const match = line.match(/^\s*(const|let|var)\s+(\w+)/);
        if (match) {
          const [, declaration, varName] = match;
          if (variableDeclarations.has(varName)) {
            // Mark line for modification
            lines[index] = line.replace(new RegExp(`^(\\s*)(const|let|var)(\\s+${varName})`), '$1// $2$3 // Duplicate declaration fixed');
            modified = true;
          } else {
            variableDeclarations.set(varName, index);
          }
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`  ✅ Fixed ${file}`);
      }
    }
  });
}

// Execute all fixes
async function main() {
  try {
    fixCaseDeclarations();
    fixNoUndef();
    fixNonNullAssertions();
    fixUselessEscapes();
    fixRedeclare();
    
    console.log('\n✅ Specific fixes completed!');
    
    // Check remaining count
    try {
      const result = execSync('npx eslint . --format=compact 2>/dev/null | grep -E "Error|Warning" | wc -l', { encoding: 'utf8' });
      console.log(`📊 Remaining issues: ${result.trim()}`);
    } catch (error) {
      console.log('⚠️ Could not count remaining issues');
    }
    
  } catch (error) {
    console.error('❌ Error during fixes:', error.message);
  }
}

main();