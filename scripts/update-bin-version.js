#!/usr/bin/env node

/**
 * Updates the VERSION in bin/claude-flow shell script to match package.json
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Read bin/claude-flow
const binPath = path.join(__dirname, '..', 'bin', 'claude-flow');
let binContent = fs.readFileSync(binPath, 'utf8');

// Update VERSION line
binContent = binContent.replace(
  /^VERSION=".*"$/m,
  `VERSION="${version}"`
);

// Write back
fs.writeFileSync(binPath, binContent);

console.log(`✅ Updated bin/claude-flow VERSION to ${version}`);