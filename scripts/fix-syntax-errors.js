#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix common TypeScript syntax errors
 */
function fixCommonIssues(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Track changes
  let changes = [];
  
  // Fix switch case blocks that are missing closing braces
  // Pattern: case 'something':\n{ (content) and then case without closing }
  content = content.replace(
    /case\s+['"`]([^'"`]+)['"`]:\s*\n\s*{\s*\n([\s\S]*?)(?=case\s+['"`]|default:|$)/gm,
    (match, caseName, caseContent) => {
      // Check if the content has balanced braces
      let openBraces = (caseContent.match(/{/g) || []).length;
      let closeBraces = (caseContent.match(/}/g) || []).length;
      
      if (openBraces > closeBraces) {
        changes.push(`Fixed missing closing brace for case '${caseName}'`);
        // Add missing closing braces before the next case
        const missingBraces = '}' + '}'.repeat(openBraces - closeBraces - 1);
        return `case '${caseName}':\n{\n${caseContent.trimRight()}\n${missingBraces}\n`;
      }
      return match;
    }
  );
  
  // Fix missing break statements
  content = content.replace(
    /}\s*\n\s*case\s+/g,
    '}\nbreak;\n\ncase '
  );
  
  // Fix broken template literals that span multiple lines incorrectly
  content = content.replace(
    /\$\{([^}]+)\n\s*\n\s*}/g,
    '${$1}'
  );
  
  // Fix object literals with missing commas
  content = content.replace(
    /([^,\s])\s*\n\s*(['"`]?\w+['"`]?\s*:)/g,
    '$1,\n$2'
  );
  
  // Report changes
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${filePath}`);
    changes.forEach(change => console.log(`   - ${change}`));
    return true;
  } else {
    console.log(`ℹ️ No changes needed for ${filePath}`);
    return false;
  }
}

// Main execution
const targetFiles = [
  path.join(__dirname, '../src/cli/simple-cli.ts'),
  path.join(__dirname, '../src/swarm/prompt-utils.ts')
];

console.log('🔧 Fixing common TypeScript syntax errors...\n');

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fixCommonIssues(file);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('\n✅ Syntax fix script completed!');