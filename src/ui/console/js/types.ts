/**
 * Comprehensive type definitions for Claude Flow Console UI
 * These types are shared across all console UI components
 */

// Re-export relevant types from the main project
export type { 
  AgentType, 
  AgentStatus, 
  TaskType, 
  TaskStatus,
  SwarmMode,
  SwarmStrategy,
  AlertLevel
} from '../../../swarm/types.js';

// ===== WEBSOCKET TYPES =====

export interface WebSocketStatus {
  connected: boolean;
  connecting: boolean;
  url: string;
  reconnectAttempts: number;
  queuedMessages: number;
  pendingRequests: number;
}

export interface WebSocketMessage {
  jsonrpc: '2.0';
  id?: number | string;
  method?: string;
  params?: any;
  result?: any;
  error?: WebSocketError;
}

export interface WebSocketError {
  code: number;
  message: string;
  data?: any;
}

export interface WebSocketNotification {
  method: string;
  params: any;
}

export interface ConnectionInfo {
  code: number;
  reason: string;
}

export interface ReconnectionInfo {
  attempt: number;
  delay: number;
}

// ===== TERMINAL TYPES =====

export type OutputType = 
  | 'output'
  | 'command'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

export interface TerminalStats {
  totalLines: number;
  historySize: number;
  isLocked: boolean;
  currentPrompt: string;
}

export interface TerminalEntry {
  timestamp: string;
  content: string;
  type: string;
}

export interface AnsiColorMap {
  [key: string]: string;
}

// ===== COMMAND TYPES =====

export interface CommandDefinition {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<void>;
}

export interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface ParsedCommand {
  cmd: string;
  args: string[];
}

export type BuiltinCommand = 
  | 'help'
  | 'clear'
  | 'status'
  | 'connect'
  | 'disconnect'
  | 'tools'
  | 'health'
  | 'history'
  | 'export'
  | 'theme'
  | 'version';

export type ClaudeFlowCommand = 
  | 'claude-flow'
  | 'swarm'
  | 'init'
  | 'config'
  | 'memory'
  | 'agents'
  | 'benchmark'
  | 'sparc';

export type SparcModeCommand = 
  | 'coder'
  | 'architect'
  | 'analyst'
  | 'researcher'
  | 'reviewer'
  | 'tester'
  | 'debugger'
  | 'documenter'
  | 'optimizer'
  | 'designer';

// ===== ANALYSIS TOOLS TYPES =====

export interface AnalysisMetrics {
  performance?: PerformanceMetrics;
  tokens?: TokenMetrics;
  health?: HealthMetrics;
  load?: LoadMetrics;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: string;
}

export interface TokenMetrics {
  input: number;
  output: number;
  cached: number;
}

export interface HealthMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  api: number;
  database: number;
}

export interface LoadMetrics {
  oneMin: number;
  fiveMin: number;
  fifteenMin: number;
  thirtyMin: number;
  oneHour: number;
  twentyFourHour: number;
}

export interface Alert {
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: number;
}

export interface AnalysisReport {
  summary: string;
  metrics: any;
  recommendations: string[];
}

export interface BottleneckAnalysis {
  bottlenecks: Bottleneck[];
  recommendations: string[];
}

export interface Bottleneck {
  component: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

export interface TokenUsageAnalysis {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  cost: number;
  efficiency: number;
}

export interface ChartInstance {
  update: (mode?: string) => void;
  resize: () => void;
  destroy: () => void;
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  borderWidth?: number;
}

// ===== MEMORY INTERFACE TYPES =====

export interface MemoryData {
  [key: string]: any;
}

export interface MemoryEntry {
  key: string;
  value: any;
  size: number;
  ttl: number | null;
  namespace: string;
}

export interface MemoryStats {
  totalKeys: number;
  memoryUsage: string;
  compressionRate: string;
  accessFrequency: string;
  usageData: UsageDataPoint[];
  patternData: [string, PatternInfo][];
  savedBytes?: number;
  totalSize?: number;
  compressedSize?: number;
}

export interface UsageDataPoint {
  timestamp: number;
  operations: number;
  memory: number;
}

export interface PatternInfo {
  count: number;
  lastAccess: number;
}

export interface BackupInfo {
  id: string;
  timestamp: number;
  data: Map<string, any>;
  size: number;
}

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'synchronized' | 'error';
  lastSync: number | null;
}

export interface CompressionResult {
  savedBytes: number;
  compressionRate: number;
}

export interface NamespaceInfo {
  count: number;
  children: Map<string, NamespaceInfo>;
}

// ===== SETTINGS TYPES =====

export interface ConsoleSettings {
  // Connection settings
  serverUrl: string;
  authToken: string;
  autoConnect: boolean;
  
  // Appearance settings
  theme: 'dark' | 'light' | 'classic' | 'matrix';
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  
  // Behavior settings
  autoScroll: boolean;
  showTimestamps: boolean;
  enableSounds: boolean;
  maxLines: number;
  
  // Claude Flow settings
  defaultMode: SparcMode;
  swarmStrategy: SwarmStrategyType;
  coordinationMode: CoordinationMode;
  
  // Advanced settings
  reconnectAttempts: number;
  heartbeatInterval: number;
  commandTimeout: number;
}

export type SparcMode = 
  | 'coder'
  | 'architect'
  | 'analyst'
  | 'researcher'
  | 'reviewer'
  | 'tester'
  | 'debugger'
  | 'documenter'
  | 'optimizer'
  | 'designer';

export type SwarmStrategyType = 
  | 'development'
  | 'research'
  | 'analysis'
  | 'testing'
  | 'optimization'
  | 'maintenance';

export type CoordinationMode = 
  | 'centralized'
  | 'hierarchical'
  | 'distributed'
  | 'mesh'
  | 'hybrid';

export interface SettingsChangeEvent {
  key: string;
  value: any;
}

export interface ConnectionConfig {
  url: string;
  token: string;
  autoConnect: boolean;
  reconnectAttempts: number;
  heartbeatInterval: number;
  commandTimeout: number;
}

export interface ClaudeFlowConfig {
  defaultMode: SparcMode;
  swarmStrategy: SwarmStrategyType;
  coordinationMode: CoordinationMode;
}

// ===== CONSOLE APP TYPES =====

export interface ConsoleElements {
  consoleOutput: HTMLElement;
  consoleInput: HTMLInputElement;
  settingsPanel: HTMLElement;
  loadingOverlay: HTMLElement;
  connectionStatus: HTMLElement;
  statusIndicator: HTMLElement;
  statusText: HTMLElement;
  currentMode: HTMLElement;
  activeAgents: HTMLElement;
  uptime: HTMLElement;
  memoryUsage: HTMLElement;
  messageCount: HTMLElement;
  timestamp: HTMLElement;
  clearConsole: HTMLElement;
  fullscreenToggle: HTMLElement;
}

export interface ConsoleStats {
  initialized: boolean;
  uptime: number;
  messageCount: number;
  activeAgents: number;
  connection: WebSocketStatus;
  terminal: TerminalStats | null;
}

export interface StreamingOutput {
  content: string;
  type?: string;
  streaming?: boolean;
}

export interface AgentStatusUpdate {
  active?: number;
  message?: string;
}

export interface SwarmUpdate {
  message?: string;
}

export interface MemoryUpdate {
  message?: string;
}

export interface LogMessage {
  level: 'error' | 'warn' | 'info';
  message: string;
}

export interface ConnectionEstablished {
  server: string;
  version: string;
}

// ===== TOOL TYPES =====

export interface Tool {
  name: string;
  description?: string;
}

export interface ToolCallParams {
  name: string;
  arguments: Record<string, any>;
}

export interface HealthStatus {
  healthy: boolean;
  error?: string;
  metrics?: Record<string, any>;
}

export interface InitializeParams {
  protocolVersion: {
    major: number;
    minor: number;
    patch: number;
  };
  clientInfo: {
    name: string;
    version: string;
    [key: string]: any;
  };
  capabilities: {
    logging: { level: string };
    tools: { listChanged: boolean };
    resources: { listChanged: boolean; subscribe: boolean };
    prompts: { listChanged: boolean };
  };
}

// ===== EVENT TYPES =====

export type ConsoleEventType = 
  | 'command'
  | 'interrupt'
  | 'input_change'
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error'
  | 'message_sent'
  | 'message_received'
  | 'message_queued'
  | 'notification'
  | 'session_initialized'
  | 'session_error'
  | 'connect_requested'
  | 'disconnect_requested'
  | 'max_lines_changed'
  | 'setting_changed'
  | 'settings_reset'
  | 'parse_error'
  | 'send_error'
  | 'reconnection_failed';

export interface EventCallback<T = any> {
  (data: T): void;
}

// ===== MEMORY TEST TYPES =====

export interface MemoryTestReport {
  timestamp: string;
  tests: {
    panel: 'passed' | 'failed';
    tools: 'passed' | 'failed';
    namespaces: 'passed' | 'failed';
    operations: 'passed' | 'failed';
  };
  memoryTools: string[];
  features: string[];
}

// ===== COMPONENT INTERFACES =====

export interface IWebSocketClient {
  isConnected: boolean;
  connect(url: string, token?: string): Promise<void>;
  disconnect(): void;
  sendRequest(method: string, params?: any): Promise<any>;
  sendNotification(method: string, params?: any): void;
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
  getStatus(): WebSocketStatus;
  initializeSession(clientInfo?: any): Promise<any>;
  executeCommand(command: string, args?: any): Promise<CommandResult>;
  getAvailableTools(): Promise<Tool[]>;
  getHealthStatus(): Promise<HealthStatus>;
}

export interface ITerminalEmulator {
  write(content: string, type?: OutputType, timestamp?: boolean): HTMLElement;
  writeLine(content: string, type?: OutputType, timestamp?: boolean): HTMLElement;
  writeCommand(command: string): HTMLElement;
  writeError(message: string): HTMLElement;
  writeSuccess(message: string): HTMLElement;
  writeWarning(message: string): HTMLElement;
  writeInfo(message: string): HTMLElement;
  writeHTML(html: string, type?: OutputType): HTMLElement;
  clear(): void;
  showWelcomeMessage(): void;
  setPrompt(prompt: string): void;
  setLocked(locked: boolean): void;
  focus(): void;
  getInput(): string;
  setInput(value: string): void;
  clearInput(): void;
  addToHistory(command: string): void;
  navigateHistory(direction: 'up' | 'down'): void;
  on(event: string, callback: EventCallback): void;
  streamText(text: string, delay?: number): Promise<HTMLElement>;
  setMaxLines(maxLines: number): void;
  getStats(): TerminalStats;
  exportHistory(): TerminalEntry[];
  importHistory(history: TerminalEntry[]): void;
  history: string[];
  resumeAutoScroll(): void;
}

export interface ICommandHandler {
  processCommand(command: string): Promise<void>;
  parseCommand(commandString: string): ParsedCommand;
  getCommandSuggestions(input: string): string[];
  hasCommand(command: string): boolean;
}

export interface ISettingsManager {
  init(): void;
  show(): void;
  hide(): void;
  toggle(): void;
  get(key: string): any;
  set(key: string, value: any): void;
  getAll(): ConsoleSettings;
  setAll(newSettings: Partial<ConsoleSettings>): void;
  resetToDefaults(): void;
  exportSettings(): void;
  importSettings(file: File): Promise<boolean>;
  updateConnectionStatus(status: WebSocketStatus): void;
  getClaudeFlowConfig(): ClaudeFlowConfig;
  getConnectionConfig(): ConnectionConfig;
  on(event: string, callback: EventCallback): void;
}

export interface IAnalysisTools {
  ws: WebSocket | null;
  charts: Record<string, ChartInstance>;
  currentTab: string;
  isConnected: boolean;
  metricsCache: Map<string, any>;
  updateInterval: number | null;
  switchTab(tabName: string): void;
  executeTool(toolName: string): Promise<void>;
  exportData(type: string, format: string): void;
  refreshSection(section: string): void;
  destroy(): void;
}

export interface IMemoryInterface {
  container: HTMLElement | null;
  currentNamespace: string;
  memoryData: Map<string, any>;
  searchFilters: Record<string, any>;
  analytics: {
    usage: Map<string, any>;
    history: any[];
    patterns: Map<string, any>;
  };
  render(): HTMLElement;
}

// ===== UTILITY TYPES =====

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// ===== CONSTANTS =====

export const CONSOLE_CONSTANTS = {
  // WebSocket
  DEFAULT_WS_URL: 'ws://localhost:3000/ws',
  HEARTBEAT_INTERVAL: 30000,
  CONNECTION_TIMEOUT: 10000,
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  
  // Terminal
  MAX_HISTORY_SIZE: 1000,
  MAX_OUTPUT_LINES: 1000,
  DEFAULT_PROMPT: 'claude-flow>',
  
  // Settings
  DEFAULT_FONT_SIZE: 14,
  DEFAULT_LINE_HEIGHT: 1.4,
  DEFAULT_MAX_LINES: 1000,
  
  // Analysis
  METRICS_UPDATE_INTERVAL: 5000,
  MAX_CHART_DATA_POINTS: 20,
  
  // Memory
  DEFAULT_NAMESPACE: 'global',
  MEMORY_MONITORING_INTERVAL: 30000,
} as const;

// ===== TYPE GUARDS =====

export function isWebSocketMessage(obj: any): obj is WebSocketMessage {
  return obj && obj.jsonrpc === '2.0';
}

export function isWebSocketError(obj: any): obj is WebSocketError {
  return obj && typeof obj.code === 'number' && typeof obj.message === 'string';
}

export function isAlert(obj: any): obj is Alert {
  return obj && typeof obj.severity === 'string' && typeof obj.title === 'string';
}

export function isMemoryEntry(obj: any): obj is MemoryEntry {
  return obj && typeof obj.key === 'string' && 'value' in obj;
}

export function isHealthStatus(obj: any): obj is HealthStatus {
  return obj && typeof obj.healthy === 'boolean';
}

// ===== ADDITIONAL MEMORY TYPES =====

export interface MemoryBackup {
  id: string;
  timestamp: number;
  data: Map<string, any>;
  size: number;
  namespace: string;
  compressed: boolean;
}

export interface MemorySyncStatus {
  status: 'idle' | 'syncing' | 'synchronized' | 'error';
  lastSync: number | null;
  pendingChanges: number;
  conflicts: any[];
}

export interface MemoryCompressionResult {
  savedBytes: number;
  compressionRate: number;
  originalSize: number;
  compressedSize: number;
}

export interface MemoryNamespace {
  count: number;
  children?: Map<string, MemoryNamespace>;
}

export interface MemorySearchFilter {
  field: string;
  operator: string;
  value: string;
}

export interface MemoryUsageData {
  timestamp: number;
  operations: number;
  memory: number;
}

export interface MemoryPatternData {
  pattern: string;
  count: number;
  lastAccess: number;
}

export type TimeframeType = '1h' | '24h' | '7d' | '30d';

export type ValueType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | 'undefined';

// ===== ADDITIONAL SETTINGS TYPES =====

export type ThemeType = 'dark' | 'light' | 'classic' | 'matrix';
export type DefaultModeType = 'coder' | 'architect' | 'analyst' | 'researcher' | 'reviewer' | 'tester' | 'debugger' | 'documenter' | 'optimizer' | 'designer';

export interface ConnectionStatus {
  connected: boolean;
  connecting?: boolean;
  url?: string;
  reconnectAttempts?: number;
  queuedMessages?: number;
  pendingRequests?: number;
}

export interface SettingChangeEvent {
  key: keyof ConsoleSettings;
  value: any;
}