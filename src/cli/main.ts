#!/usr/bin/env node
// import { getErrorMessage } from '../utils/error-handler';
/**
 * Claude-Flow CLI - Main entry point for Node.js
 */

import { CLI, VERSION } from "./cli-core";
import { setupCommands } from "./commands/index";
import { getFilename } from "../utils/import-meta-shim";

async function main() {
  const cli = new CLI("claude-flow", "Advanced AI Agent Orchestration System");
  
  // Setup all commands
  setupCommands(cli);
  
  // Run the CLI (args default to process.argv.slice(2) in Node.js version)
  await cli.run();
}

// Check if this module is being run directly (Node.js equivalent of import.meta.main)
const __filename = getFilename();
const isMainModule = process.argv[1] === __filename || process.argv[1].endsWith('/main.js');

if (isMainModule) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}