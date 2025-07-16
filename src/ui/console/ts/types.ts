/**
 * Type definitions for Claude Code Console UI
 * Shared types used across console components
 */

// Memory Interface Types
export interface MemoryEntry {
  key: string;
  value: any;
  namespace: string;
  size: number;
  ttl: number | null;
  created?: Date;
  modified?: Date;
  accessed?: Date;
}

export interface MemoryNamespace {
  name: string;
  count: number;
  children: Map<string, MemoryNamespace>;
}

export interface MemoryAnalytics {
  usage: Map<string, number>;
  history: MemoryHistoryEntry[];
  patterns: Map<string, MemoryPattern>;
}

export interface MemoryHistoryEntry {
  timestamp: number;
  operations: number;
  memory: number;
  action: string;
}

export interface MemoryPattern {
  key: string;
  count: number;
  lastAccess: number;
  frequency: number;
}

export interface MemoryStats {
  totalKeys: number;
  memoryUsage: string;
  compressionRate: string;
  accessFrequency: string;
  usageData: MemoryUsageData[];
  patternData: [string, MemoryPattern][];
}

export interface MemoryUsageData {
  timestamp: number;
  operations: number;
  memory: number;
}

export interface MemoryBackup {
  id: string;
  timestamp: number;
  data: Map<string, any>;
  size: number;
}

export interface MemorySyncStatus {
  status: 'idle' | 'syncing' | 'synchronized' | 'error';
  lastSync: number | null;
}

export interface CompressionResult {
  savedBytes: number;
  compressionRate: number;
}

// Settings Types
export interface ConsoleSettings {
  // Connection settings
  serverUrl: string;
  authToken: string;
  autoConnect: boolean;
  
  // Appearance settings
  theme: 'dark' | 'light' | 'classic' | 'matrix' | 'auto';
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  
  // Behavior settings
  autoScroll: boolean;
  showTimestamps: boolean;
  enableSounds: boolean;
  maxLines: number;
  
  // Claude Flow settings
  defaultMode: AgentMode;
  swarmStrategy: SwarmStrategy;
  coordinationMode: CoordinationMode;
  
  // Advanced settings
  reconnectAttempts: number;
  heartbeatInterval: number;
  commandTimeout: number;
}

export type AgentMode = 
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

export type SwarmStrategy = 
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

export interface ConnectionConfig {
  url: string;
  token: string;
  autoConnect: boolean;
  reconnectAttempts: number;
  heartbeatInterval: number;
  commandTimeout: number;
}

export interface ConnectionStatus {
  connected: boolean;
  connecting: boolean;
  url?: string;
  pendingRequests?: number;
  queuedMessages?: number;
  reconnectAttempts?: number;
}

export interface ClaudeFlowConfig {
  defaultMode: AgentMode;
  swarmStrategy: SwarmStrategy;
  coordinationMode: CoordinationMode;
}

export interface SettingsExportData {
  timestamp: string;
  version: string;
  settings: ConsoleSettings;
}

// Test Types
export interface TestResult {
  passed: boolean;
  message?: string;
}

export interface TestReport {
  timestamp: string;
  passed: string[];
  failed: Array<{name: string; message: string}>;
  warnings: string[];
  tests?: Record<string, string>;
  memoryTools?: string[];
  features?: string[];
}

export interface MemoryManager {
  currentNamespace: string;
  memoryTools: Record<string, MemoryToolInfo>;
  togglePanel(): void;
  switchNamespace(namespace: string): Promise<void>;
  formatSize(bytes: number): string;
  formatTTL(timestamp: number): string;
  truncateValue(value: string): string;
  escapeHtml(text: string): string;
  updateMemoryTable(entries: MemoryEntry[]): void;
  filterMemoryEntries(searchTerm: string): void;
}

export interface MemoryToolInfo {
  name: string;
  icon: string;
  description: string;
  action: () => void;
}

export interface Terminal {
  writeInfo(message: string): void;
  writeSuccess(message: string): void;
  writeError(message: string): void;
  writeLine(message: string): void;
}

// Event Emitter Types
export interface EventEmitter {
  on(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, data?: any): void;
  eventListeners?: Map<string, Array<(...args: any[]) => void>>;
}

// Neural Network Test Types (for test-neural-networks.ts)
export interface NeuralTestReport {
  timestamp: string;
  passed: string[];
  failed: Array<{name: string; message: string}>;
  warnings: string[];
}

export interface NeuralPanel {
  panel: {
    isInitialized: boolean;
    wsClient: any;
  };
  extended: any;
}

// Hook Types for Claude Flow coordination
export interface HookResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface CoordinationNotification {
  message: string;
  timestamp: number;
  agent?: string;
  task?: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: number;
}

export interface WebSocketClient {
  connect(url: string): Promise<void>;
  disconnect(): void;
  send(message: WebSocketMessage): void;
  on(event: string, handler: (data: any) => void): void;
}

// UI Component Types
export interface UIComponent {
  container: HTMLElement | null;
  isVisible: boolean;
  render(): HTMLElement;
  init(): void;
  show(): void;
  hide(): void;
  toggle(): void;
}

// Form Element Types
export interface FormElement extends HTMLElement {
  value: string;
  checked?: boolean;
  type?: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

// Export all types for easy importing
export type {
  EventEmitter as IEventEmitter,
  UIComponent as IUIComponent,
  WebSocketClient as IWebSocketClient,
  Terminal as ITerminal,
  MemoryManager as IMemoryManager
};