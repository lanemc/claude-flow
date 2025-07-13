# TypeScript Migration & Build System TODO

## JavaScript to TypeScript Migration

### CLI Core Files
- [ ] `src/cli/simple-cli.js` → `src/cli/simple-cli.ts`
- [ ] `src/cli/command-registry.js` → `src/cli/command-registry.ts`
- [ ] `src/cli/node-compat.js` → `src/cli/node-compat.ts`
- [ ] `src/cli/runtime-detector.js` → `src/cli/runtime-detector.ts`
- [ ] `src/cli/help-text.js` → `src/cli/help-text.ts`
- [ ] `src/cli/utils.js` → `src/cli/utils.ts`
- [ ] `src/cli/create-enhanced-task.js` → `src/cli/create-enhanced-task.ts`

### Simple Commands
- [ ] `src/cli/simple-commands/init/index.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/enhanced-templates.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/claude-md.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/memory-bank-md.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/coordination-md.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/readme-files.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/sparc-modes.js` → `.ts`
- [ ] `src/cli/simple-commands/init/templates/safe-hook-patterns.js` → `.ts`
- [ ] `src/cli/simple-commands/init/executable-wrapper.js` → `.ts`
- [ ] `src/cli/simple-commands/init/sparc-structure.js` → `.ts`
- [ ] `src/cli/simple-commands/init/help.js` → `.ts`
- [ ] `src/cli/simple-commands/init/batch-init.js` → `.ts`
- [ ] `src/cli/simple-commands/init/validation/*.js` → `.ts`
- [ ] `src/cli/simple-commands/init/rollback/*.js` → `.ts`
- [ ] `src/cli/simple-commands/init/sparc/*.js` → `.ts`
- [ ] `src/cli/simple-commands/init/claude-commands/*.js` → `.ts`
- [ ] `src/cli/simple-commands/memory.js` → `.ts`
- [ ] `src/cli/simple-commands/sparc.js` → `.ts`
- [ ] `src/cli/simple-commands/agent.js` → `.ts`
- [ ] `src/cli/simple-commands/task.js` → `.ts`
- [ ] `src/cli/simple-commands/config.js` → `.ts`
- [ ] `src/cli/simple-commands/status.js` → `.ts`
- [ ] `src/cli/simple-commands/mcp.js` → `.ts`
- [ ] `src/cli/simple-commands/monitor.js` → `.ts`
- [ ] `src/cli/simple-commands/start.js` → `.ts`
- [ ] `src/cli/simple-commands/swarm.js` → `.ts`
- [ ] `src/cli/simple-commands/batch-manager.js` → `.ts`
- [ ] `src/cli/simple-commands/github.js` → `.ts`
- [ ] `src/cli/simple-commands/training.js` → `.ts`
- [ ] `src/cli/simple-commands/analysis.js` → `.ts`
- [ ] `src/cli/simple-commands/automation.js` → `.ts`
- [ ] `src/cli/simple-commands/coordination.js` → `.ts`
- [ ] `src/cli/simple-commands/hooks.js` → `.ts`
- [ ] `src/cli/simple-commands/hook-safety.js` → `.ts`
- [ ] `src/cli/simple-commands/hive-mind.js` → `.ts`
- [ ] `src/cli/simple-commands/hive-mind-optimize.js` → `.ts`
- [ ] `src/cli/simple-commands/hive-mind-wizard.js` → `.ts`
- [ ] `src/cli/simple-commands/hive.js` → `.ts`
- [ ] `src/cli/simple-commands/swarm-metrics-integration.js` → `.ts`
- [ ] `src/cli/simple-commands/web-server.js` → `.ts`
- [ ] `src/cli/simple-commands/realtime-update-system.js` → `.ts`
- [ ] `src/cli/simple-commands/process-ui.js` → `.ts`
- [ ] `src/cli/simple-commands/process-ui-enhanced.js` → `.ts`
- [ ] `src/cli/simple-commands/mcp-integration-layer.js` → `.ts`
- [ ] `src/cli/simple-commands/enhanced-ui-views.js` → `.ts`
- [ ] `src/cli/simple-commands/enhanced-webui-complete.js` → `.ts`

### SPARC Modes
- [ ] `src/cli/simple-commands/sparc-modes/*.js` → `.ts` (all files)
- [ ] `src/cli/simple-commands/sparc/*.js` → `.ts` (all files)

### GitHub Commands
- [ ] `src/cli/simple-commands/github/*.js` → `.ts` (all files)

### Hive Mind
- [ ] `src/cli/simple-commands/hive-mind/*.js` → `.ts` (all files)

### API Routes
- [ ] `src/api/routes/analysis.js` → `.ts`

### MCP Files
- [ ] `src/mcp/mcp-server.js` → `.ts`
- [ ] `src/mcp/integrate-wrapper.js` → `.ts`

### Scripts
- [ ] `scripts/update-bin-version.js` → `.ts` or convert to CommonJS

## Module System Fixes

### ES Module to CommonJS Conversion
- [ ] Replace all `import` statements with `require()`
- [ ] Replace all `export` statements with `module.exports`
- [ ] Replace all `export default` with `module.exports`
- [ ] Remove all `import.meta.url` usage
- [ ] Fix all top-level `await` (wrap in async functions or use `.then()`)
- [ ] Update all dynamic imports `import()` to `require()`

### Import Path Fixes
- [ ] Remove `.js` extensions from all imports in JavaScript files
- [ ] Ensure all TypeScript imports don't have extensions
- [ ] Fix circular dependencies if any exist
- [ ] Update path resolution for CommonJS

## Build Configuration

### TypeScript Config Updates
- [ ] Set `"module": "commonjs"` ✅ (already done)
- [ ] Set `"moduleResolution": "node"` ✅ (already done)
- [ ] Add `"allowJs": true"` during migration
- [ ] Add `"checkJs": true"` for type checking JS files
- [ ] Configure `paths` for module aliases if needed
- [ ] Set up `typeRoots` for custom type definitions

### Package.json Updates
- [ ] Remove `"type": "module"` ✅ (already done)
- [ ] Update all script commands to work with CommonJS
- [ ] Add separate build commands for each platform
- [ ] Add test commands for binaries
- [ ] Update dependencies to CommonJS-compatible versions

## Dependency Fixes

### Replace ES Module Dependencies
- [ ] Find CommonJS alternatives for ES-only modules
- [ ] Or use dynamic require() for ES modules
- [ ] Update inquirer to CommonJS version if needed
- [ ] Check all CLI dependencies for compatibility

### Missing Dependencies
- [ ] Add `@types/*` packages for all dependencies
- [ ] Install `cli-progress` (missing in hive-mind task.js)
- [ ] Verify all peer dependencies are installed

## Pkg Binary Issues

### Fix Bytecode Compilation Warnings
- [ ] Identify modules failing bytecode compilation
- [ ] Add `pkg` field to package.json with assets/scripts config
- [ ] Create `.pkgignore` file
- [ ] Test with `--debug` flag to identify issues
- [ ] Consider using `--no-bytecode` for problematic modules

### Binary Testing
- [ ] Test Linux x64 binary
- [ ] Test macOS x64 binary
- [ ] Test macOS ARM64 binary
- [ ] Test Windows x64 binary
- [ ] Test all major commands on each platform
- [ ] Test file path handling (especially Windows backslashes)
- [ ] Test permission requirements (especially Unix execution)

## Type Definitions

### Create Core Types
- [ ] Command interface with handler, description, usage
- [ ] Flag/Option types for CLI arguments
- [ ] Configuration types for all config objects
- [ ] MCP message types
- [ ] Swarm agent types
- [ ] Memory entry types
- [ ] Task and workflow types

### Add JSDoc Comments
- [ ] Document all public functions
- [ ] Add parameter types and descriptions
- [ ] Add return type documentation
- [ ] Include usage examples in comments

## Testing

### Unit Tests
- [ ] Set up Jest with ts-jest
- [ ] Test all command handlers
- [ ] Test utility functions
- [ ] Test configuration loading
- [ ] Test error handling

### Integration Tests
- [ ] Test CLI end-to-end
- [ ] Test MCP server communication
- [ ] Test file operations
- [ ] Test subprocess management
- [ ] Test swarm coordination

### Binary Tests
- [ ] Automated tests for each platform binary
- [ ] Version check test
- [ ] Help command test
- [ ] Init command test
- [ ] Basic workflow test

## CI/CD

### GitHub Actions
- [ ] Build workflow for all platforms
- [ ] Test workflow with matrix strategy
- [ ] Binary upload as artifacts
- [ ] Release workflow for tagged versions
- [ ] Automated npm publish

## Documentation

### Update Docs
- [ ] Update README with build instructions
- [ ] Add TypeScript migration guide
- [ ] Document new build process
- [ ] Add troubleshooting section
- [ ] Update contributor guidelines

## Performance

### Build Optimization
- [ ] Implement incremental builds
- [ ] Add build caching
- [ ] Consider esbuild or swc for faster compilation
- [ ] Optimize binary size with compression
- [ ] Tree-shake unused code

## Error Handling

### Improve Error Messages
- [ ] Add source maps for better stack traces
- [ ] Implement custom error classes
- [ ] Add error codes for common issues
- [ ] Improve CLI error output formatting
- [ ] Add verbose/debug mode support