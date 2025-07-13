import { getErrorMessage } from '../utils/error-handler';
import { dirname, join, resolve } from 'path';
import { getFilename, getDirname } from './import-meta-shim';
import { existsSync } from 'fs';

const __filename = getFilename();
const __dirname = getDirname();

export function getClaudeFlowRoot(): string {
  // Try multiple strategies to find the root
  const strategies = [
    // Strategy 1: From current file location
    resolve(__dirname, '../..'),
    // Strategy 2: From process.cwd()
    process.cwd(),
    // Strategy 3: From npm global location
    resolve(process.execPath, '../../lib/node_modules/claude-flow'),
    // Strategy 4: From environment variable
    process.env.CLAUDE_FLOW_ROOT || ''
  ];

  for (const path of strategies) {
    if (path && existsSync(join(path, 'package.json'))) {
      try {
        const pkg = require(join(path, 'package.json'));
        if (pkg.name === 'claude-flow') {
          return path;
        }
      } catch {}
    }
  }

  // Fallback to current working directory
  return process.cwd();
}

export function getClaudeFlowBin(): string {
  return join(getClaudeFlowRoot(), 'bin', 'claude-flow');
}

export function resolveProjectPath(relativePath: string): string {
  const root = getClaudeFlowRoot();
  return resolve(root, relativePath);
}