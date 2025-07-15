/**
 * Web UI Types and Interfaces
 * Type definitions for Enhanced Web UI system, components, and architecture
 */

// Core UI Architecture Types
export interface UIManagerInterface {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  getState(): UIState;
  setState(state: Partial<UIState>): void;
}

export interface UIState {
  initialized: boolean;
  mode: UIMode;
  activeView: string | null;
  components: Record<string, ComponentState>;
  theme: ThemeSettings;
  user?: UserSettings;
}

export type UIMode = 'full' | 'enhanced' | 'fallback' | 'auto';

export interface ComponentState {
  id: string;
  type: string;
  visible: boolean;
  data: Record<string, unknown>;
  error?: string;
  loading: boolean;
}

// Theme and Styling Types
export interface ThemeSettings {
  name: string;
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontSize: number;
  fontFamily: string;
}

export interface UserSettings {
  id: string;
  name: string;
  email?: string;
  preferences: Record<string, unknown>;
  permissions: string[];
}

// View System Types
export interface ViewDefinition {
  id: string;
  name: string;
  component: string;
  category: ViewCategory;
  icon?: string;
  description?: string;
  requiredPermissions?: string[];
  dependencies?: string[];
  config?: Record<string, unknown>;
}

export enum ViewCategory {
  NEURAL = 'neural',
  MEMORY = 'memory',
  MONITORING = 'monitoring',
  WORKFLOW = 'workflow',
  GITHUB = 'github',
  DAA = 'daa',
  SYSTEM = 'system',
  CLI = 'cli'
}

export interface ViewManager {
  registerView(view: ViewDefinition): void;
  unregisterView(viewId: string): void;
  getView(viewId: string): ViewDefinition | null;
  listViews(category?: ViewCategory): ViewDefinition[];
  activateView(viewId: string): Promise<void>;
  deactivateView(viewId: string): Promise<void>;
}

// Component Library Types
export interface ComponentDefinition {
  name: string;
  type: ComponentType;
  props: Record<string, unknown>;
  children?: ComponentDefinition[];
  events?: Record<string, EventHandler>;
  style?: CSSProperties;
}

export enum ComponentType {
  BUTTON = 'button',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  LABEL = 'label',
  DIV = 'div',
  SPAN = 'span',
  MODAL = 'modal',
  CARD = 'card',
  TABLE = 'table',
  CHART = 'chart',
  TABS = 'tabs',
  ACCORDION = 'accordion',
  TOOLTIP = 'tooltip',
  PROGRESS = 'progress',
  SPINNER = 'spinner',
  ALERT = 'alert',
  BADGE = 'badge',
  AVATAR = 'avatar',
  BREADCRUMB = 'breadcrumb',
  PAGINATION = 'pagination',
  MENU = 'menu',
  SIDEBAR = 'sidebar',
  HEADER = 'header',
  FOOTER = 'footer'
}

export type EventHandler = (event: Event, data?: unknown) => void | Promise<void>;

export interface CSSProperties {
  [key: string]: string | number;
}

// MCP Tool Integration Types
export interface MCPToolCategory {
  name: string;
  count: number;
  tools: string[];
  commands?: string[];
}

export interface ToolCategoriesInfo {
  neural: MCPToolCategory;
  memory: MCPToolCategory;
  monitoring: MCPToolCategory;
  workflow: MCPToolCategory;
  github: MCPToolCategory;
  daa: MCPToolCategory;
  system: MCPToolCategory;
  cli: MCPToolCategory;
}

// Event Bus Types
export interface EventBus {
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  emit(event: string, data?: unknown): void;
  once(event: string, handler: EventHandler): void;
}

export interface UIEvent {
  type: string;
  timestamp: number;
  source: string;
  data?: unknown;
  target?: string;
}

// State Management Types
export interface StateManager {
  getState<T = any>(key: string): T | null;
  setState<T = any>(key: string, value: T): void;
  subscribe(key: string, callback: (value: unknown) => void): () => void;
  clearState(key?: string): void;
  persistState(): Promise<void>;
  restoreState(): Promise<void>;
}

export interface StateSnapshot {
  timestamp: number;
  version: string;
  data: Record<string, unknown>;
}

// Neural Network View Types
export interface NeuralNetworkViewState {
  models: NeuralModel[];
  selectedModel: string | null;
  training: boolean;
  trainingProgress?: TrainingProgress;
  predictions: Prediction[];
  patterns: Pattern[];
}

export interface NeuralModel {
  id: string;
  name: string;
  type: 'coordination' | 'optimization' | 'prediction';
  status: 'trained' | 'training' | 'idle' | 'error';
  accuracy: number;
  created: string;
  lastTrained?: string;
  parameters: number;
  size: string;
}

export interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  elapsedTime: number;
  estimatedTimeRemaining: number;
}

export interface Prediction {
  id: string;
  modelId: string;
  input: unknown;
  output: unknown;
  confidence: number;
  timestamp: string;
}

export interface Pattern {
  id: string;
  type: string;
  description: string;
  confidence: number;
  occurrences: number;
  lastSeen: string;
}

// GitHub Integration View Types
export interface GitHubIntegrationViewState {
  authenticated: boolean;
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  workflows: GitHubWorkflow[];
  selectedRepo: string | null;
  loading: boolean;
  error: string | null;
}

export interface GitHubUser {
  login: string;
  name: string;
  email?: string;
  avatarUrl: string;
  company?: string;
  location?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  language?: string;
  stars: number;
  forks: number;
  issues: number;
  lastUpdate: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  created: string;
  updated: string;
  draft: boolean;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  created: string;
  updated: string;
  labels: string[];
  assignees: string[];
}

export interface GitHubWorkflow {
  id: number;
  name: string;
  state: 'active' | 'deleted';
  path: string;
  lastRun?: GitHubWorkflowRun;
}

export interface GitHubWorkflowRun {
  id: number;
  status: 'completed' | 'in_progress' | 'queued';
  conclusion?: 'success' | 'failure' | 'cancelled';
  created: string;
  updated: string;
}

// Workflow Automation View Types
export interface WorkflowAutomationViewState {
  workflows: WorkflowDefinition[];
  selectedWorkflow: string | null;
  running: WorkflowExecution[];
  templates: WorkflowTemplate[];
  triggers: TriggerDefinition[];
  schedules: ScheduleDefinition[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  triggers: string[];
  enabled: boolean;
  created: string;
  lastRun?: string;
  stats: WorkflowStats;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'parallel';
  config: Record<string, unknown>;
  dependencies?: string[];
  timeout?: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started: string;
  ended?: string;
  currentStep?: string;
  progress: number;
  logs: LogEntry[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: unknown;
  description?: string;
}

export interface TriggerDefinition {
  id: string;
  name: string;
  type: 'webhook' | 'schedule' | 'event' | 'manual';
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface ScheduleDefinition {
  id: string;
  name: string;
  cron: string;
  timezone: string;
  enabled: boolean;
  nextRun: string;
  lastRun?: string;
}

export interface WorkflowStats {
  totalRuns: number;
  successRate: number;
  averageDuration: number;
  lastSuccess?: string;
  lastFailure?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: unknown;
}

// DAA (Dynamic Agent Architecture) View Types
export interface DAAViewState {
  agents: DAAAgent[];
  capabilities: Capability[];
  resources: ResourceAllocation[];
  communications: Communication[];
  consensus: ConsensusState[];
  performance: AgentPerformance[];
}

export interface DAAAgent {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'error' | 'offline';
  capabilities: string[];
  load: number;
  resources: ResourceUsage;
  created: string;
  lastActivity: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  type: string;
  requirements: string[];
  agents: string[];
}

export interface ResourceAllocation {
  agentId: string;
  resourceType: string;
  allocated: number;
  used: number;
  available: number;
  efficiency: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
}

export interface Communication {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'notification';
  message: unknown;
  timestamp: string;
  status: 'sent' | 'delivered' | 'processed' | 'failed';
}

export interface ConsensusState {
  id: string;
  proposal: unknown;
  participants: string[];
  votes: Record<string, 'agree' | 'disagree' | 'abstain'>;
  status: 'pending' | 'accepted' | 'rejected' | 'timeout';
  created: string;
  deadline: string;
}

export interface AgentPerformance {
  agentId: string;
  metrics: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    uptime: number;
  };
  trends: {
    performance: number[];
    load: number[];
    errors: number[];
  };
}

// Architecture and Compatibility Types
export interface ArchitectureInfo {
  version: string;
  totalTools: number;
  categories: number;
  features: string[];
  compatibility: CompatibilityInfo;
}

export interface CompatibilityInfo {
  browser: boolean;
  node: boolean;
  terminal: boolean;
  vscode: boolean;
}

// Initialization Options
export interface UIInitializationOptions {
  mode?: UIMode;
  existingUI?: unknown;
  enableAllFeatures?: boolean;
  theme?: Partial<ThemeSettings>;
  user?: UserSettings;
  config?: Record<string, unknown>;
}

// Enhanced Process UI Types
export interface ProcessUIOptions {
  title?: string;
  width?: number;
  height?: number;
  fullscreen?: boolean;
  debug?: boolean;
  enableMouse?: boolean;
  enableKeyboard?: boolean;
}

export interface ProcessUIComponent {
  render(): string;
  update(data: Record<string, unknown>): void;
  destroy(): void;
  getState(): unknown;
}

// Auto-initialization Types
export interface WindowClaudeFlowUI {
  initialize: (options?: UIInitializationOptions) => Promise<UIManagerInterface>;
  launch: () => Promise<unknown>;
  getInfo: () => ArchitectureInfo;
  toolCategories: ToolCategoriesInfo;
}

declare global {
  interface Window {
    claudeFlowEnhancedUI?: WindowClaudeFlowUI;
    claudeFlowProcessUI?: unknown;
    claudeFlowEnhanced?: UIManagerInterface;
  }
}

// Module Export Types
export interface ModuleExports {
  initializeEnhancedUI: (options?: UIInitializationOptions) => Promise<UIManagerInterface>;
  launchTerminalUI: () => Promise<unknown>;
  getArchitectureInfo: () => ArchitectureInfo;
  TOOL_CATEGORIES_INFO: ToolCategoriesInfo;
  getTotalToolCount: () => number;
}

// Error Types
export interface UIError extends Error {
  code?: string;
  component?: string;
  recoverable?: boolean;
}

export class UIInitializationError extends Error implements UIError {
  code = 'UI_INIT_ERROR';
  
  constructor(message: string, public component?: string) {
    super(message);
    this.name = 'UIInitializationError';
  }
}

export class ComponentError extends Error implements UIError {
  code = 'COMPONENT_ERROR';
  recoverable = true;
  
  constructor(message: string, public component: string) {
    super(message);
    this.name = 'ComponentError';
  }
}

export class ViewError extends Error implements UIError {
  code = 'VIEW_ERROR';
  recoverable = true;
  
  constructor(message: string, public component?: string) {
    super(message);
    this.name = 'ViewError';
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Runtime Environment Detection
export interface Environment {
  isBrowser: boolean;
  isNode: boolean;
  isTerminal: boolean;
  isVSCode: boolean;
  supportsWebGL: boolean;
  supportsCanvas: boolean;
  supportsLocalStorage: boolean;
  supportsWebSockets: boolean;
}

// Performance Monitoring
export interface PerformanceMetrics {
  initTime: number;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
  componentCount: number;
  eventCount: number;
}

export interface PerformanceMonitor {
  start(operation: string): void;
  end(operation: string): number;
  getMetrics(): PerformanceMetrics;
  reset(): void;
}

// Configuration Management
export interface Configuration {
  version: string;
  debug: boolean;
  performance: {
    enableMonitoring: boolean;
    maxRenderTime: number;
    maxUpdateTime: number;
  };
  features: {
    enableExperimentalFeatures: boolean;
    enableBetaFeatures: boolean;
  };
  ui: {
    theme: ThemeSettings;
    animations: boolean;
    transitions: boolean;
  };
  api: {
    endpoints: Record<string, string>;
    timeout: number;
    retries: number;
  };
}