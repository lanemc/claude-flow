# Deno to Node.js Migration Summary

## Files Modified

### 1. `/src/cli/commands/help.ts`
- **Change**: Replaced `Deno.stdin.read()` with `process.stdin.once('data')`
- **Location**: Line 824

### 2. `/src/cli/commands/monitor.ts`
- **Change**: Replaced `Deno.remove()` with `fs.unlink()`
- **Location**: Line 572

### 3. `/src/cli/commands/start/process-manager.ts`
- **Change**: Replaced `Deno.pid` with `process.pid`
- **Location**: Line 110

### 4. `/src/cli/commands/start/process-ui-simple.ts`
- **Changes**:
  - Replaced `Deno.stdout.write()` with `process.stdout.write()`
  - Replaced `Deno.stdin.read()` with `process.stdin.once('data')` using Promises
  - **Locations**: Lines 50-58, 172-180, 246-248, 372-380

### 5. `/src/cli/commands/start/start-command.ts`
- **Changes**:
  - Replaced `Deno.addSignalListener()` with `process.on()`
  - Replaced `Deno.removeSignalListener()` with `process.off()`
  - Replaced `Deno.pid` with `process.pid`
  - Replaced `Deno.stdin.read()` with Promise-based `process.stdin.once('data')`
  - Replaced `Deno.kill()` with `process.kill()`
  - Replaced `Deno.remove()` with `fs.unlink()`
  - Replaced `Deno.memoryUsage()` with `process.memoryUsage()`
  - Replaced `Deno.mkdir()` with `fs.mkdir()`
  - **Locations**: Lines 136-137, 169, 206-210, 236, 296-297, 312-323, 326, 362, 389, 410-411, 478, 485

### 6. `/src/cli/commands/swarm-new.ts`
- **Changes**:
  - Replaced `Deno.Command()` with `spawn()` from `child_process`
  - Replaced `Deno.readDir()` with `fs.readdir()` with `withFileTypes` option
  - Replaced `entry.isFile` with `entry.isFile()`
  - Replaced `entry.isDirectory` with `entry.isDirectory()`
  - Added import for `spawn` and `execSync` from `child_process`
  - **Locations**: Lines 768-773, 780, 1306-1319, 1356-1364

### 7. `/src/cli/commands/swarm.ts`
- **Changes**:
  - Replaced `Deno.Command()` with `spawn()` from `child_process`
  - Replaced `Deno.mkdir()` with `fs.mkdir()`
  - Replaced `Deno.pid` with `process.pid`
  - Replaced `Deno.chmod()` with `fs.chmod()`
  - Added import for `spawn` and `execSync` from `child_process`
  - **Locations**: Lines 99-108, 161, 203, 309, 345, 377-378, 430, 434-442, 478-485

## Migration Pattern Summary

1. **Process Management**:
   - `Deno.pid` → `process.pid`
   - `Deno.kill(pid, signal)` → `process.kill(pid, signal)`
   - `Deno.addSignalListener()` → `process.on()`
   - `Deno.removeSignalListener()` → `process.off()`

2. **File System Operations**:
   - `Deno.mkdir()` → `fs.mkdir()`
   - `Deno.remove()` → `fs.unlink()`
   - `Deno.chmod()` → `fs.chmod()`
   - `Deno.readDir()` → `fs.readdir()` with `withFileTypes: true`

3. **I/O Operations**:
   - `Deno.stdin.read()` → `process.stdin.once('data')` with Promises
   - `Deno.stdout.write()` → `process.stdout.write()`

4. **Process Execution**:
   - `Deno.Command()` → `spawn()` from `child_process`
   - Command execution patterns updated to use Node.js child process APIs

5. **Memory Usage**:
   - `Deno.memoryUsage()` → `process.memoryUsage()`

## Testing Recommendations

1. Test signal handling for graceful shutdowns
2. Test file system operations, especially directory creation and file removal
3. Test stdin/stdout interactions in interactive modes
4. Test child process spawning and communication
5. Test process existence checking with `process.kill(pid, 0)`