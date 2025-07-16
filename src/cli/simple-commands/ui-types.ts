/**
 * Comprehensive TypeScript Interfaces for Claude Flow UI Components
 * 
 * This file defines all TypeScript interfaces for converting JavaScript UI files
 * to TypeScript, covering UI components, event handling, state management,
 * configuration objects, and error handling.
 * 
 * Based on analysis of:
 * - enhanced-ui-views.js
 * - enhanced-webui-complete.js
 * - process-ui.js
 * - process-ui-enhanced.js
 * - start-ui.js
 * - swarm.js
 * - agent.js
 * - task.js
 * - memory.js
 * - config.js
 */

// ============================================================================
// CORE UI INTERFACES
// ============================================================================

/**
 * Color utility interface for terminal styling
 */
export interface IColorUtils {
  cyan: (text: string) => string;
  gray: (text: string) => string;
  white: (text: string) => string;
  yellow: (text: string) => string;
  green: (text: string) => string;
  red: (text: string) => string;
  blue: (text: string) => string;
  magenta: (text: string) => string;
  bold: (text: string) => string;
  dim: (text: string) => string;
}

/**
 * View modes for UI navigation
 */
export type ViewMode = 
  | 'processes'
  | 'status'
  | 'orchestration'
  | 'memory'
  | 'logs'
  | 'help'
  | 'neural'
  | 'analysis'
  | 'workflow'
  | 'github'
  | 'daa'
  | 'system'
  | 'tools';

/**
 * Enhanced view configuration
 */
export interface IEnhancedViews {
  PROCESSES: 'processes';
  STATUS: 'status';
  ORCHESTRATION: 'orchestration';
  MEMORY: 'memory';
  LOGS: 'logs';
  HELP: 'help';
  NEURAL: 'neural';
  ANALYSIS: 'analysis';
  WORKFLOW: 'workflow';
  GITHUB: 'github';
  DAA: 'daa';
  SYSTEM: 'system';
  TOOLS: 'tools';
}

// ============================================================================
// PROCESS MANAGEMENT INTERFACES
// ============================================================================

/**
 * Process status types
 */
export type ProcessStatus = 'running' | 'stopped' | 'error' | 'starting';

/**
 * Process definition interface
 */
export interface IProcessDefinition {
  id: string;
  name: string;
  description: string;
}

/**
 * Enhanced process with runtime information
 */
export interface IProcess extends IProcessDefinition {
  status: ProcessStatus;
  pid: number | null;
  uptime: number;
  cpu: number;
  memory: number;
}

/**
 * Process map type
 */
export type ProcessMap = Map<string, IProcess>;

// ============================================================================
// UI COMPONENT INTERFACES
// ============================================================================

/**
 * Base UI component interface
 */
export interface IBaseUIComponent {
  colors: IColorUtils;
  running: boolean;
  selectedIndex: number;
  currentView: ViewMode;
}

/**
 * Process UI component interface
 */
export interface IProcessUI extends IBaseUIComponent {
  processes: ProcessMap;
  start(): Promise<void>;
  render(): void;
  handleInput(): Promise<void>;
  toggleSelected(): Promise<void>;
  startProcess(id: string): Promise<void>;
  stopProcess(id: string): Promise<void>;
  startAll(): Promise<void>;
  stopAll(): Promise<void>;
  restartAll(): Promise<void>;
  getStatusIcon(status: ProcessStatus): string;
  formatUptime(seconds: number): string;
}

/**
 * Enhanced UI component with multiple views
 */
export interface IEnhancedProcessUI extends IProcessUI {
  agents: IAgent[];
  tasks: ITask[];
  memoryStats: IMemoryStats;
  logs: ILogEntry[];
  systemStats: ISystemStats;
  swarmIntegration: ISwarmWebUIIntegration;
  initializeSwarm(): Promise<void>;
  renderHeader(): void;
  renderProcessView(): void;
  renderStatusView(): void;
  renderOrchestrationView(): void;
  renderMemoryView(): void;
  renderLogsView(): void;
  renderHelpView(): void;
  renderFooter(): void;
  handleViewSpecificInput(input: string): Promise<void>;
  handleProcessInput(input: string): Promise<void>;
  handleOrchestrationInput(input: string): Promise<void>;
  handleMemoryInput(input: string): Promise<void>;
  handleLogsInput(input: string): Promise<void>;
  addLog(level: LogLevel, message: string): void;
  updateSystemStats(): void;
  getHealthBar(): string;
  getUsageBar(value: number, max: number, width?: number): string;
}

// ============================================================================
// ENHANCED UI INTERFACES
// ============================================================================

/**
 * Tool execution result interface
 */
export interface IToolExecutionResult {
  title: string;
  summary: string;
  details?: string[];
}

/**
 * Tool execution interface
 */
export interface IToolExecution {
  result?: IToolExecutionResult;
  success: boolean;
  timestamp: number;
}

/**
 * Tool framework status
 */
export interface IToolFrameworkStatus {
  currentExecutions: number;
  maxConcurrent: number;
  queuedExecutions: number;
  availableTools: number;
  availableWorkflows: number;
}

/**
 * Tool definition interface
 */
export interface ITool {
  key: string;
  tool: string;
  desc: string;
}

/**
 * Tool execution framework interface
 */
export interface IToolExecutionFramework {
  ui: IEnhancedWebUIComplete;
  executeTool(toolName: string, parameters?: Record<string, unknown>): Promise<IToolExecution>;
  executePredefinedWorkflow(workflowName: string): Promise<IToolExecution>;
  executeToolsBatch(tools: Array<{ toolName: string; parameters?: Record<string, unknown> }>, options?: { parallel: boolean }): Promise<{ summary: { successful: number; total: number } }>;
  getStatus(): IToolFrameworkStatus;
  getCategories(): string[];
  getToolsByCategory(category: string): ITool[];
  getPredefinedWorkflows(): Record<string, IWorkflow>;
}

/**
 * Workflow definition interface
 */
export interface IWorkflow {
  name: string;
  description: string;
  steps: IWorkflowStep[];
}

/**
 * Workflow step interface
 */
export interface IWorkflowStep {
  name: string;
  tool: string;
  parameters?: Record<string, unknown>;
  dependsOn?: string[];
}

/**
 * Enhanced UI views interface
 */
export interface IEnhancedUIViews {
  ui: IEnhancedWebUIComplete;
  toolFramework: IToolExecutionFramework;
  selectedIndices: Map<string, number>;
  viewData: Map<string, Record<string, unknown>>;
  refreshIntervals: Map<string, NodeJS.Timeout>;
  
  initializeViewData(): void;
  setupAutoRefresh(): void;
  renderNeuralView(): void;
  renderAnalysisView(): void;
  renderWorkflowView(): void;
  renderGitHubView(): void;
  renderDAAView(): void;
  renderSystemView(): void;
  renderToolsView(): void;
  renderToolGrid(tools: ITool[], colors: IColorUtils, columns?: number): void;
  handleEnhancedInput(key: string, currentView: ViewMode): Promise<boolean>;
  handleNeuralInput(key: string): Promise<boolean>;
  executeQuickTool(toolName: string, parameters?: Record<string, unknown>): Promise<void>;
  displayToolResult(execution: IToolExecution): void;
  promptNeuralTrain(): Promise<void>;
  refreshNeuralData(): Promise<void>;
  refreshAnalysisData(): Promise<void>;
  getColors(): IColorUtils;
  cleanup(): void;
}

/**
 * MCP integration layer interface
 */
export interface IMCPIntegrationLayer {
  ui: IEnhancedWebUIComplete;
  getStatus(): IMCPStatus;
}

/**
 * MCP status interface
 */
export interface IMCPStatus {
  mcpAvailable: boolean;
  totalTools: number;
  activeExecutions: number;
  cacheSize: number;
}

/**
 * Real-time update system interface
 */
export interface IRealtimeUpdateSystem {
  ui: IEnhancedWebUIComplete;
  emit(event: string, data: unknown): void;
  cleanup(): void;
}

/**
 * Enhanced Web UI Complete interface
 */
export interface IEnhancedWebUIComplete extends IEnhancedProcessUI {
  mcpIntegration: IMCPIntegrationLayer | null;
  toolFramework: IToolExecutionFramework | null;
  enhancedViews: IEnhancedUIViews | null;
  realtimeUpdates: IRealtimeUpdateSystem | null;
  inputBuffer: string;
  commandHistory: string[];
  historyIndex: number;
  
  initializeEnhancedUI(): Promise<void>;
  initializeProcesses(): void;
  initializeSystemData(): Promise<void>;
  startSystemMonitoring(): void;
  setupInputHandling(): void;
  showToolCategoriesSummary(): void;
  renderEnhancedHeader(): void;
  renderEnhancedHelpView(): void;
  renderEnhancedFooter(): void;
  handleNavigationInput(key: string): Promise<boolean>;
  handleEnhancedViewInput(key: string): Promise<boolean>;
  handleGlobalCommands(key: string): Promise<boolean>;
  handleOriginalInput(key: string): Promise<void>;
  promptRunTool(): Promise<void>;
  promptRunWorkflow(): Promise<void>;
  promptBatchExecution(): Promise<void>;
  shutdown(): Promise<void>;
}

// ============================================================================
// SWARM INTEGRATION INTERFACES
// ============================================================================

/**
 * Swarm metrics interface
 */
export interface ISwarmMetrics {
  swarmId: string;
  agents: {
    active: number;
    total: number;
  };
  tasks: {
    inProgress: number;
    completed: number;
    total: number;
  };
  efficiency: number;
}

/**
 * Swarm Web UI integration interface
 */
export interface ISwarmWebUIIntegration {
  ui: IEnhancedProcessUI;
  initializeSwarm(topology: string, maxAgents: number): Promise<void>;
  spawnAgent(type: string): Promise<void>;
  createTask(description: string, priority: string): Promise<void>;
  completeTask(taskId: string): Promise<void>;
  getSwarmMetrics(): ISwarmMetrics | null;
}

// ============================================================================
// AGENT INTERFACES
// ============================================================================

/**
 * Agent types
 */
export type AgentType = 'researcher' | 'coder' | 'analyst' | 'coordinator' | 'tester' | 'architect' | 'general';

/**
 * Agent status types
 */
export type AgentStatus = 'working' | 'idle' | 'error' | 'offline';

/**
 * Agent interface
 */
export interface IAgent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  tasks: number;
  capabilities?: string[];
  assignedTo?: string;
}

/**
 * Agent command flags interface
 */
export interface IAgentCommandFlags {
  name?: string;
  [key: string]: unknown;
}

// ============================================================================
// TASK INTERFACES
// ============================================================================

/**
 * Task status types
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

/**
 * Task priority types
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Task types
 */
export type TaskType = 'research' | 'code' | 'analysis' | 'coordination' | 'general' | 'testing';

/**
 * Task interface
 */
export interface ITask {
  id: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  dependencies?: string[];
  progress?: number;
  results?: Record<string, unknown>;
}

/**
 * Task command flags interface
 */
export interface ITaskCommandFlags {
  priority?: string;
  filter?: string;
  verbose?: boolean;
  v?: boolean;
  [key: string]: unknown;
}

// ============================================================================
// MEMORY INTERFACES
// ============================================================================

/**
 * Memory entry interface
 */
export interface IMemoryEntry {
  key: string;
  value: string;
  namespace: string;
  timestamp: number;
}

/**
 * Memory namespace stats interface
 */
export interface IMemoryNamespaceStats {
  name: string;
  entries: number;
  size: string;
}

/**
 * Memory statistics interface
 */
export interface IMemoryStats {
  totalEntries: number;
  totalSize: string;
  namespaces: IMemoryNamespaceStats[];
}

/**
 * Memory store functions interface
 */
export interface IMemoryStoreFunctions {
  loadMemory(): Promise<Record<string, IMemoryEntry[]>>;
  saveMemory(data: Record<string, IMemoryEntry[]>): Promise<void>;
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Terminal configuration interface
 */
export interface ITerminalConfig {
  poolSize: number;
  recycleAfter: number;
  healthCheckInterval: number;
  type: string;
}

/**
 * Orchestrator configuration interface
 */
export interface IOrchestratorConfig {
  maxConcurrentTasks: number;
  taskTimeout: number;
  defaultPriority: number;
}

/**
 * Memory configuration interface
 */
export interface IMemoryConfig {
  backend: string;
  path: string;
  cacheSize: number;
  indexing: boolean;
}

/**
 * Agent resource limits interface
 */
export interface IAgentResourceLimits {
  memory: string;
  cpu: string;
}

/**
 * Agent configuration interface
 */
export interface IAgentConfig {
  maxAgents: number;
  defaultCapabilities: string[];
  resourceLimits: IAgentResourceLimits;
}

/**
 * MCP configuration interface
 */
export interface IMCPConfig {
  port: number;
  host: string;
  timeout: number;
}

/**
 * Logging configuration interface
 */
export interface ILoggingConfig {
  level: string;
  file: string;
  maxSize: string;
  maxFiles: number;
}

/**
 * Main configuration interface
 */
export interface IClaudeFlowConfig {
  version: string;
  terminal: ITerminalConfig;
  orchestrator: IOrchestratorConfig;
  memory: IMemoryConfig;
  agents: IAgentConfig;
  mcp: IMCPConfig;
  logging: ILoggingConfig;
}

/**
 * Configuration command flags interface
 */
export interface IConfigCommandFlags {
  force?: boolean;
  format?: string;
  [key: string]: unknown;
}

// ============================================================================
// SWARM COMMAND INTERFACES
// ============================================================================

/**
 * Swarm strategy types
 */
export type SwarmStrategy = 'auto' | 'research' | 'development' | 'analysis' | 'testing' | 'optimization' | 'maintenance';

/**
 * Swarm coordination modes
 */
export type SwarmMode = 'centralized' | 'distributed' | 'hierarchical' | 'mesh' | 'hybrid';

/**
 * Swarm command flags interface
 */
export interface ISwarmCommandFlags {
  strategy?: SwarmStrategy;
  mode?: SwarmMode;
  'max-agents'?: number;
  timeout?: number;
  'task-timeout-minutes'?: number;
  parallel?: boolean;
  distributed?: boolean;
  monitor?: boolean;
  ui?: boolean;
  background?: boolean;
  review?: boolean;
  testing?: boolean;
  encryption?: boolean;
  verbose?: boolean;
  'dry-run'?: boolean;
  executor?: boolean;
  'output-format'?: 'json' | 'text';
  'output-file'?: string;
  'no-interactive'?: boolean;
  'no-auto-permissions'?: boolean;
  analysis?: boolean;
  'read-only'?: boolean;
  'quality-threshold'?: number;
  'memory-namespace'?: string;
  'agent-selection'?: string;
  'task-scheduling'?: string;
  'load-balancing'?: string;
  'fault-tolerance'?: string;
  sparc?: boolean;
  'dangerously-skip-permissions'?: boolean;
  [key: string]: unknown;
}

// ============================================================================
// LOGGING INTERFACES
// ============================================================================

/**
 * Log levels
 */
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

/**
 * Log entry interface
 */
export interface ILogEntry {
  time: Date;
  level: LogLevel;
  message: string;
}

/**
 * System statistics interface
 */
export interface ISystemStats {
  uptime: number;
  totalTasks: number;
  completedTasks: number;
  activeAgents: number;
  memoryUsage: number;
  cpuUsage: number;
}

// ============================================================================
// INPUT HANDLING INTERFACES
// ============================================================================

/**
 * Input handler interface
 */
export interface IInputHandler {
  handleInput(): Promise<void>;
  handleNavigationInput?(key: string): Promise<boolean>;
  handleViewSpecificInput?(input: string): Promise<void>;
  handleGlobalCommands?(key: string): Promise<boolean>;
}

/**
 * Key mapping interface
 */
export interface IKeyMapping {
  [key: string]: ViewMode | (() => Promise<void>) | (() => void);
}

// ============================================================================
// ERROR HANDLING INTERFACES
// ============================================================================

/**
 * Base error interface
 */
export interface IClaudeFlowError {
  code: string;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

/**
 * UI error interface
 */
export interface IUIError extends IClaudeFlowError {
  component: string;
  view?: ViewMode;
  action?: string;
}

/**
 * Process error interface
 */
export interface IProcessError extends IClaudeFlowError {
  processId: string;
  operation: string;
}

/**
 * Configuration error interface
 */
export interface IConfigError extends IClaudeFlowError {
  configKey?: string;
  validationErrors?: string[];
}

/**
 * Memory error interface
 */
export interface IMemoryError extends IClaudeFlowError {
  namespace?: string;
  operation: 'store' | 'query' | 'export' | 'import' | 'clear';
}

/**
 * Task error interface
 */
export interface ITaskError extends IClaudeFlowError {
  taskId?: string;
  taskType?: TaskType;
  operation: 'create' | 'execute' | 'cancel' | 'update';
}

/**
 * Agent error interface
 */
export interface IAgentError extends IClaudeFlowError {
  agentId?: string;
  agentType?: AgentType;
  operation: 'spawn' | 'terminate' | 'assign' | 'communicate';
}

/**
 * Swarm error interface
 */
export interface ISwarmError extends IClaudeFlowError {
  swarmId?: string;
  strategy?: SwarmStrategy;
  mode?: SwarmMode;
  operation: 'initialize' | 'execute' | 'coordinate' | 'monitor';
}

/**
 * Error handler interface
 */
export interface IErrorHandler {
  handleError(error: IClaudeFlowError): void;
  logError(error: IClaudeFlowError): void;
  formatError(error: IClaudeFlowError): string;
  createError<T extends IClaudeFlowError>(
    type: new () => T,
    code: string,
    message: string,
    context?: Record<string, unknown>
  ): T;
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

/**
 * File utilities interface
 */
export interface IFileUtils {
  readJsonFile<T = unknown>(path: string, defaultValue?: T): Promise<T>;
  writeJsonFile<T = unknown>(path: string, data: T): Promise<void>;
  fileExists(path: string): Promise<boolean>;
}

/**
 * Terminal compatibility interface
 */
export interface ITerminalCompat {
  write(data: string): Promise<void>;
  read(buffer: Uint8Array): Promise<number | null>;
  decoder: TextDecoder;
  exit(code: number): void;
}

/**
 * Runtime compatibility interface
 */
export interface IRuntimeCompat {
  terminal: ITerminalCompat;
}

/**
 * Argument parser interface
 */
export interface IArgumentParser {
  parseArgs(args: string[]): { args: string[]; flags: Record<string, unknown> };
  parseQuotedString(input: string): string;
  getFlag(args: string[], flagName: string): string | null;
}

// ============================================================================
// COMMAND INTERFACES
// ============================================================================

/**
 * Command context interface
 */
export interface ICommandContext {
  args: string[];
  flags: Record<string, unknown>;
  command: string;
}

/**
 * Command handler interface
 */
export interface ICommandHandler {
  (subArgs: string[], flags: Record<string, unknown>): Promise<void>;
}

/**
 * Command registry interface
 */
export interface ICommandRegistry {
  register(command: string, handler: ICommandHandler): void;
  execute(command: string, subArgs: string[], flags: Record<string, unknown>): Promise<void>;
  getCommands(): string[];
  getHelp(command?: string): string;
}

// ============================================================================
// WEB SERVER INTERFACES
// ============================================================================

/**
 * Web server interface
 */
export interface IClaudeCodeWebServer {
  port: number;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): { running: boolean; port: number; uptime: number };
}

/**
 * Launch UI arguments interface
 */
export interface ILaunchUIArgs {
  port?: number;
  terminal?: boolean;
  web?: boolean;
}

// ============================================================================
// EXPORT ALL INTERFACES
// ============================================================================

// Export types (no need to re-export, they're already exported above)
// Removed problematic export block that was causing conflicts