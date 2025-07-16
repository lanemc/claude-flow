/**
 * TypeScript Interfaces for Claude Flow Web UI
 * Comprehensive type definitions for all UI components and systems
 */

// ============================================
// Core Types
// ============================================

export interface BaseComponent {
  element: HTMLElement | null;
  isInitialized: boolean;
  render(params?: Record<string, any>): void | Promise<void>;
  destroy?(): void | Promise<void>;
}

export interface ComponentConfig {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
}

// ============================================
// Event System Types
// ============================================

export type EventHandler<T = any> = (data: T) => void | Promise<void>;

export interface EventSubscription {
  id: string;
  event: string;
  handler: EventHandler;
  once?: boolean;
  priority?: number;
}

export interface EventEmitterConfig {
  maxListeners?: number;
  errorHandler?: (error: Error) => void;
}

export interface IEventBus {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, data?: any): void;
  once(event: string, handler: EventHandler): void;
  removeAllListeners(event?: string): void;
  listenerCount(event: string): number;
}

// ============================================
// View System Types
// ============================================

export interface ViewConfig {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  component: string | ComponentConstructor;
  shortcut?: string;
  toolCount?: number;
  lazy?: boolean;
  preload?: boolean;
  permissions?: string[];
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface ViewState {
  params?: Record<string, any>;
  loadTime?: number;
  lastAccess?: number;
  lastUpdate?: number;
  scrollPosition?: number;
  formData?: Record<string, any>;
  [key: string]: any;
}

export interface LoadedView {
  component: ViewComponent;
  config: ViewConfig;
  element: HTMLElement | null;
  instance: any;
  loadTime: number;
}

export interface ViewComponent extends BaseComponent {
  viewId: string;
  config: ViewConfig;
  eventBus: IEventBus;
  state?: ViewState;
}

export type ComponentConstructor = new (
  container: HTMLElement | null,
  eventBus: IEventBus,
  config: ViewConfig
) => ViewComponent;

// ============================================
// State Management Types
// ============================================

export interface StateData {
  timestamp: number;
  version: string;
  preferences: Record<string, any>;
  viewStates: Record<string, ViewState>;
  toolResults: Record<string, ToolResult>;
  sessionData: Record<string, any>;
  state: Record<string, any>;
}

export interface Preferences {
  theme: 'dark' | 'light' | 'auto';
  autoSave: boolean;
  showTooltips: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast' | 'none';
  defaultView: string;
  keyboardShortcuts: boolean;
  realTimeUpdates: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// ============================================
// MCP Tool Types
// ============================================

export interface MCPToolParam {
  name: string;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  default?: any;
}

export interface MCPTool {
  name: string;
  description: string;
  params: string[] | MCPToolParam[];
  category: ToolCategory;
  lastUsed: number | null;
  usageCount: number;
}

export type ToolCategory = 
  | 'neural'
  | 'memory'
  | 'monitoring'
  | 'workflow'
  | 'github'
  | 'daa'
  | 'system'
  | 'cli';

export interface ToolCategoryData {
  icon: string;
  name: string;
  count: number;
  color: (text: string) => string;
}

export interface ToolResult {
  result: any;
  timestamp: number;
  tool: string;
  params?: Record<string, any>;
  duration?: number;
  error?: string;
}

export interface ToolExecution {
  startTime: number;
  params: Record<string, any>;
  toolName: string;
}

export interface CacheEntry<T = any> {
  result: T;
  timestamp: number;
  ttl: number;
}

// ============================================
// Process Management Types
// ============================================

export interface Process {
  id: string;
  name: string;
  description: string;
  status: ProcessStatus;
  pid: number | null;
  uptime: number;
  cpu: number;
  memory: number;
}

export type ProcessStatus = 'running' | 'stopped' | 'error' | 'starting';

export interface SystemStats {
  uptime: number;
  totalTasks: number;
  completedTasks: number;
  activeAgents: number;
  memoryUsage: number;
  cpuUsage: number;
  toolsAvailable: number;
  enhancedMode: boolean;
}

// ============================================
// Agent & Task Types
// ============================================

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  tasks: number;
  capabilities?: string[];
  lastActive?: number;
}

export type AgentType = 
  | 'researcher'
  | 'coder'
  | 'analyst'
  | 'coordinator'
  | 'tester'
  | 'architect';

export type AgentStatus = 'idle' | 'working' | 'error' | 'offline';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  createdAt: number;
  completedAt?: number;
  dependencies?: string[];
  result?: any;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

// ============================================
// Memory Management Types
// ============================================

export interface MemoryNamespace {
  name: string;
  entries: number;
  size: string;
  lastModified?: number;
}

export interface MemoryStats {
  totalEntries: number;
  totalSize: string;
  namespaces: MemoryNamespace[];
}

export interface MemoryAction {
  action: 'store' | 'retrieve' | 'delete' | 'list' | 'clear';
  key?: string;
  value?: any;
  namespace?: string;
  ttl?: number;
  pattern?: string;
}

// ============================================
// Log System Types
// ============================================

export interface LogEntry {
  time: Date;
  level: LogLevel;
  message: string;
  details?: any;
  source?: string;
}

export type LogLevel = 'debug' | 'info' | 'success' | 'warning' | 'error' | 'tool';

// ============================================
// Component Library Types
// ============================================

export interface ToolPanelConfig extends ComponentConfig {
  title: string;
  description: string;
  closable?: boolean;
  collapsible?: boolean;
}

export interface MetricsChartConfig extends ComponentConfig {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  width?: number;
  height?: number;
  data?: ChartData;
  options?: ChartOptions;
}

export interface ChartData {
  labels?: string[];
  datasets?: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  scales?: any;
  legend?: any;
}

export interface CommandPaletteConfig extends ComponentConfig {
  placeholder?: string;
  commands?: Command[];
  maxResults?: number;
  fuzzySearch?: boolean;
}

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  action: () => void | Promise<void>;
}

export interface ProgressBarConfig extends ComponentConfig {
  label?: string;
  value?: number;
  max?: number;
  showPercentage?: boolean;
  striped?: boolean;
  animated?: boolean;
}

export interface ActionButtonConfig extends ComponentConfig {
  text: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onclick?: (event: MouseEvent) => void;
}

export interface ToolCardConfig {
  name: string;
  icon?: string;
  description: string;
  category?: ToolCategory;
  onClick?: (tool: ToolCardConfig) => void;
}

export interface StatsCardConfig extends ComponentConfig {
  icon: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export interface TabConfig {
  label: string;
  content: string | HTMLElement;
  icon?: string;
  closable?: boolean;
  disabled?: boolean;
}

// ============================================
// UI Manager Types
// ============================================

export interface UIManagerConfig {
  container?: HTMLElement;
  theme?: 'dark' | 'light' | 'auto';
  enableKeyboardShortcuts?: boolean;
  enableRealTimeUpdates?: boolean;
  autoSaveInterval?: number;
}

export interface ViewCategory {
  id: string;
  name: string;
  icon: string;
  views: string[];
  order?: number;
}

export interface NavigationItem {
  viewId: string;
  label: string;
  icon?: string;
  shortcut?: string;
  category?: string;
  toolCount?: number;
}

// ============================================
// Swarm Integration Types
// ============================================

export interface SwarmMetrics {
  swarmId: string;
  agents: {
    total: number;
    active: number;
    idle: number;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  efficiency: number;
  uptime: number;
}

export interface SwarmConfig {
  topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
  maxAgents: number;
  strategy?: 'balanced' | 'specialized' | 'adaptive';
}

// ============================================
// Enhanced UI Types
// ============================================

export interface EnhancedUIConfig {
  mode: 'full' | 'enhanced' | 'fallback' | 'auto';
  existingUI?: any;
  enableAllFeatures?: boolean;
}

export interface ToolCategoryInfo {
  name: string;
  count: number;
  icon?: string;
  color?: (text: string) => string;
  tools?: string[];
  commands?: string[];
}

export interface ArchitectureInfo {
  version: string;
  totalTools: number;
  categories: number;
  features: string[];
  compatibility: {
    browser: boolean;
    node: boolean;
    terminal: boolean;
    vscode: boolean;
  };
}

// ============================================
// DOM Element Types
// ============================================

export interface ClaudeFlowElement extends HTMLElement {
  claudeFlowComponent?: BaseComponent;
  claudeFlowConfig?: ComponentConfig;
}

// ============================================
// Color Utility Types
// ============================================

export interface ColorUtils {
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
  bright: (text: string) => string;
  orange: (text: string) => string;
  purple: (text: string) => string;
}

// ============================================
// Terminal Types (for compatibility)
// ============================================

export interface TerminalCompat {
  terminal: {
    write(text: string): Promise<void>;
    read(buffer: Uint8Array): Promise<number | null>;
    exit(code: number): void;
    decoder: TextDecoder;
  };
}

// ============================================
// Additional Types for Enhanced UI
// ============================================

export type Colors = ColorUtils;

export type ViewMode = 
  | 'overview'
  | 'processes'
  | 'status'
  | 'orchestration'
  | 'memory'
  | 'neural'
  | 'monitoring'
  | 'workflow'
  | 'github'
  | 'daa'
  | 'system'
  | 'cli'
  | 'logs'
  | 'help'
  | 'neural'
  | 'memory_mgmt'
  | 'monitoring_adv'
  | 'workflow_mgmt'
  | 'github_int'
  | 'daa_control'
  | 'system_utils'
  | 'cli_bridge';

export interface NeuralTool {
  key: string;
  name: string;
  desc: string;
}

export interface ToolStats {
  executions: number;
  lastUsed: number | null;
  avgDuration: number;
  successRate: number;
}

export interface ToolExecutionResult {
  success: boolean;
  tool: string;
  params: Record<string, any>;
  result: any;
  timestamp: number;
}

export interface IEnhancedWebUI {
  uiManager: any | null;
  isInitialized: boolean;
  fallbackMode: boolean;
  originalProcessUI: IEnhancedProcessUI | null;
  
  initialize(existingProcessUI?: IEnhancedProcessUI | null): Promise<boolean>;
  initializeFallbackMode(): Promise<void>;
  createFallbackUI(): void;
  addEnhancedViewsToProcessUI(): void;
  handleEnhancedViews(): void;
  handleEnhancedInput(input: string): Promise<boolean>;
  createStandaloneUI(): void;
  navigateToView(viewId: string, params?: Record<string, any>): Promise<void>;
  executeTool(toolName: string, params?: Record<string, any>): Promise<ToolExecutionResult>;
  getSystemStatus(): Promise<any>;
  integrateWithExistingUI(): void;
  shutdown(): Promise<void>;
}

export interface IEnhancedProcessUI {
  processes: Map<string, Process>;
  running: boolean;
  selectedIndex: number;
  currentView: ViewMode;
  agents: Agent[];
  tasks: Task[];
  memoryStats: MemoryStats;
  logs: LogEntry[];
  systemStats: SystemStats;
  enhancedWebUI: IEnhancedWebUI | null;
  toolExecutions: Map<string, any>;
  recentTools: string[];
  toolStats: Map<string, ToolStats>;
  swarmIntegration: any;
  
  initializeEnhancedFeatures(): Promise<void>;
  initializeToolStats(): void;
  initializeSwarm(): Promise<void>;
  start(): Promise<void>;
  render(): void;
  renderEnhancedHeader(): void;
  renderOverviewView(): void;
  renderProcessView(): void;
  renderStatusView(): void;
  renderOrchestrationView(): void;
  renderMemoryView(): void;
  renderLogsView(): void;
  renderNeuralView(): void;
  renderMonitoringView(): void;
  renderWorkflowView(): void;
  renderGitHubView(): void;
  renderDAAView(): void;
  renderSystemView(): void;
  renderCLIView(): void;
  renderEnhancedHelpView(): void;
  renderEnhancedFooter(): void;
  handleInput(): Promise<void>;
  handleViewSpecificInput(input: string): Promise<void>;
  executeEnhancedTool(toolName: string, params?: Record<string, any>): Promise<ToolExecutionResult>;
  mockToolExecution(toolName: string, params: Record<string, any>): Promise<ToolExecutionResult>;
  updateToolStats(toolName: string, duration: number, success: boolean): void;
  getToolCategory(toolName: string): string | null;
  getToolStats(toolName: string): ToolStats | null;
  handleNeuralInput(input: string): Promise<void>;
  handleMonitoringInput(input: string): Promise<void>;
  handleWorkflowInput(input: string): Promise<void>;
  handleGitHubInput(input: string): Promise<void>;
  handleDAAInput(input: string): Promise<void>;
  handleSystemInput(input: string): Promise<void>;
  handleCLIInput(input: string): Promise<void>;
  handleEnhancedMemoryInput(input: string): Promise<void>;
  getNamespaceIcon(name: string): string;
  updateSystemStats(): void;
  shutdown(): Promise<void>;
  getStatusIcon(status: string): string;
  getHealthBar(): string;
  getUsageBar(value: number, max: number): string;
  formatUptime(seconds: number): string;
  addLog(level: LogEntry['level'], message: string): void;
  handleProcessInput(input: string): Promise<void>;
  handleOrchestrationInput(input: string): Promise<void>;
  handleLogsInput(input: string): Promise<void>;
  toggleSelected(): Promise<void>;
  startProcess(id: string): Promise<void>;
  stopProcess(id: string): Promise<void>;
  startAll(): Promise<void>;
  stopAll(): Promise<void>;
  restartAll(): Promise<void>;
}

export type InitializeEnhancedUIFunction = (options?: {
  mode?: 'auto' | 'full' | 'enhanced' | 'fallback';
  existingUI?: IEnhancedProcessUI | null;
  enableAllFeatures?: boolean;
}) => Promise<IEnhancedWebUI | IEnhancedProcessUI | any>;

export type LaunchTerminalUIFunction = () => Promise<void>;
export type GetTotalToolCountFunction = () => number;
export type GetArchitectureInfoFunction = () => ArchitectureInfo;

// ============================================
// Export Type Guards
// ============================================

export function isViewConfig(obj: any): obj is ViewConfig {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

export function isMCPTool(obj: any): obj is MCPTool {
  return obj && typeof obj.name === 'string' && typeof obj.description === 'string';
}

export function isTask(obj: any): obj is Task {
  return obj && typeof obj.id === 'string' && typeof obj.status === 'string';
}

export function isAgent(obj: any): obj is Agent {
  return obj && typeof obj.id === 'string' && typeof obj.type === 'string';
}

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

// ============================================
// Global Window Extensions
// ============================================

declare global {
  interface Window {
    claudeFlowProcessUI?: any;
    claudeFlowEnhancedUI?: {
      initialize: (options?: EnhancedUIConfig) => Promise<any>;
      launch: () => Promise<void>;
      getInfo: () => ArchitectureInfo;
      toolCategories: Record<ToolCategory, ToolCategoryInfo>;
    };
    claudeFlowEnhanced?: any;
    claudeFlowMCP?: {
      execute: (toolName: string, params: Record<string, any>) => Promise<any>;
    };
    claudeFlowStartTime?: number;
  }
}

// ============================================
// Component Library Types
// ============================================

export interface ComponentLibraryConfig {
  title?: string;
  description?: string;
  label?: string;
  text?: string;
  icon?: string;
  width?: number;
  height?: number;
  type?: 'line' | 'bar' | 'primary' | 'secondary' | 'danger';
  onclick?: (event: MouseEvent) => void;
  message?: string;
  value?: string | number;
}

export interface ToolPanelComponent {
  element: HTMLDivElement;
  content: HTMLDivElement;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  clear: () => void;
  append: (element: HTMLElement) => void;
}

export interface MetricsChartComponent {
  element: HTMLDivElement;
  canvas: HTMLCanvasElement;
  updateData: (data: ChartData[]) => void;
  setTitle: (title: string) => void;
  addLegendItem: (label: string, color: string) => void;
}

export interface CommandPaletteComponent {
  element: HTMLDivElement;
  input: HTMLInputElement;
  results: HTMLDivElement;
  show: () => void;
  hide: () => void;
  updateResults: (commands: Command[]) => void;
  onCommand: ((command: Command) => void) | null;
}

export interface ProgressBarComponent {
  element: HTMLDivElement;
  setProgress: (percent: number) => void;
  setLabel: (label: string) => void;
}

export interface StatusBadgeComponent {
  element: HTMLSpanElement;
  setStatus: (status: StatusType) => void;
  setText: (text: string) => void;
}

export interface LoadingSpinnerComponent {
  element: HTMLDivElement;
  setMessage: (message: string) => void;
  show: () => void;
  hide: () => void;
}

export interface MessageComponent {
  element: HTMLDivElement;
  setMessage: (message: string) => void;
  setDetails?: (details: string) => void;
}

export interface InfoPanelComponent {
  element: HTMLDivElement;
  content: HTMLDivElement;
  setTitle: (title: string) => void;
  setContent: (html: string) => void;
  append: (element: HTMLElement) => void;
  clear: () => void;
}

export interface ActionButtonComponent {
  element: HTMLButtonElement;
  setText: (text: string) => void;
  setDisabled: (disabled: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export interface ToolGridComponent {
  element: HTMLDivElement;
  updateTools: (tools: UITool[]) => void;
}

export interface StatsCardComponent {
  element: HTMLDivElement;
  setValue: (value: string | number) => void;
  setLabel: (label: string) => void;
  setIcon: (icon: string) => void;
}

export interface TabContainerComponent {
  element: HTMLDivElement;
  setActiveTab: (index: number) => void;
  getActiveTab: () => number;
  addTab: (tab: Tab) => void;
}

export interface ChartData {
  value: number;
  label?: string;
}

export interface Command {
  id: string;
  label: string;
  description?: string;
  action: () => void | Promise<void>;
}

export interface UITool {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Tab {
  id: string;
  label: string;
  content: string;
  key?: string;
  view?: ViewMode;
  icon?: string;
}

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'idle';

export type ComponentType = 
  | 'ToolPanel'
  | 'MetricsChart'
  | 'CommandPalette'
  | 'ProgressBar'
  | 'StatusBadge'
  | 'LoadingSpinner'
  | 'ErrorMessage'
  | 'SuccessMessage'
  | 'InfoPanel'
  | 'ActionButton'
  | 'ToolGrid'
  | 'StatsCard'
  | 'LogViewer'
  | 'FormBuilder'
  | 'TabContainer';

export type ComponentFactory<T = any> = (config: ComponentLibraryConfig) => T;

// EventBus specific types
export interface EventInfo {
  event: string;
  data: any;
  timestamp: number;
  id: string;
}

export interface HandlerInfo {
  handler: (data: any, eventInfo?: EventInfo) => void | Promise<void>;
  context: any;
  id: string;
  regex?: RegExp;
}

export interface EventBusStats {
  regularEvents: number;
  onceEvents: number;
  wildcardPatterns: number;
  historySize: number;
  totalHandlers: number;
}

// StateManager specific types
export interface StateStats {
  preferences: number;
  viewStates: number;
  toolResults: number;
  sessionData: number;
  generalState: number;
  lastSave?: number;
  autoSaveEnabled: boolean;
}

export interface PreferenceKeys {
  theme: 'dark' | 'light';
  autoSave: boolean;
  showTooltips: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  defaultView: string;
  keyboardShortcuts: boolean;
  realTimeUpdates: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// ============================================
// Re-export commonly used types
// ============================================

export type {
  EventHandler as Handler,
  ViewConfig as View,
  Task as TaskType,
  Process as ProcessType
};