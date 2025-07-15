const fs = require('fs');
const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));

// Analyze issues by rule
const issuesByRule = {};
let totalErrors = 0;
let totalWarnings = 0;
let filesWithIssues = 0;

report.forEach(file => {
  if (file.messages && file.messages.length > 0) {
    filesWithIssues++;
    file.messages.forEach(msg => {
      if (!issuesByRule[msg.ruleId]) {
        issuesByRule[msg.ruleId] = { count: 0, severity: msg.severity };
      }
      issuesByRule[msg.ruleId].count++;
      if (msg.severity === 2) totalErrors++;
      else if (msg.severity === 1) totalWarnings++;
    });
  }
});

// Sort by count
const sortedRules = Object.entries(issuesByRule)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 20);

console.log('Total files with issues:', filesWithIssues);
console.log('Total errors:', totalErrors);
console.log('Total warnings:', totalWarnings);
console.log('Total issues:', totalErrors + totalWarnings);
console.log('\nTop 20 issues by rule:');
sortedRules.forEach(([rule, data]) => {
  console.log(`  ${rule}: ${data.count} (${data.severity === 2 ? 'error' : 'warning'})`);
});

// Get file paths for batch fixing
const filePaths = report
  .filter(file => file.messages && file.messages.length > 0)
  .map(file => file.filePath);

console.log('\nFiles to fix:', filePaths.length);