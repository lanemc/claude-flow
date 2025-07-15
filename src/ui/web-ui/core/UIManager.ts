/**
 * UIManager - Central UI Controller for Claude Flow Web UI
 * Coordinates all views, handles navigation, and manages global state
 */

import { EventBus } from './EventBus.js';
import { MCPIntegrationLayer } from './MCPIntegrationLayer.js';
import { ViewManager } from './ViewManager.js';
import { StateManager } from './StateManager.js';
import { ComponentLibrary } from '../components/ComponentLibrary.js';

// Type definitions for UIManager
export interface ViewConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: string;
  shortcut: string;
  toolCount?: number;
}

export interface NavigationParams {
  [key: string]: any;
}

export interface ViewHistoryEntry {
  viewId: string;
  timestamp: number;
  params: any;
}

export interface SystemStatus {
  uptime: any;
  activeTools: any;
  memoryUsage: any;
  swarmStatus: any;
  toolsAvailable: number;
  viewsRegistered: number;
}

export interface UserPreferences {
  theme?: string;
  responsive?: boolean;
  [key: string]: any;
}

export interface ToolExecutionData {
  tool: string;
  params: any;
}

export interface ViewNavigationData {
  viewId: string;
  params?: NavigationParams;
}

export interface StatePersistData {
  [key: string]: any;
}

export interface ErrorData {
  tool?: string;
  error: Error;
  params?: any;
}

// View category definitions
export const VIEW_CATEGORIES = {
  OVERVIEW: 'overview',
  PROCESSES: 'processes',
  NEURAL: 'neural',
  MEMORY: 'memory',
  MONITORING: 'monitoring',
  WORKFLOW: 'workflow',
  GITHUB: 'github',
  DAA: 'daa',
  SYSTEM: 'system',
  CLI: 'cli',
  HELP: 'help'
} as const;

export type ViewCategoryType = typeof VIEW_CATEGORIES[keyof typeof VIEW_CATEGORIES];

// MCP Tool Categories mapping
export const MCP_TOOL_CATEGORIES = {
  NEURAL: [
    'neural_train', 'neural_predict', 'neural_status', 'neural_patterns',
    'model_load', 'model_save', 'pattern_recognize', 'cognitive_analyze',
    'learning_adapt', 'neural_compress', 'ensemble_create', 'transfer_learn',
    'neural_explain', 'wasm_optimize', 'inference_run'
  ],
  MEMORY: [
    'memory_usage', 'memory_backup', 'memory_restore', 'memory_compress',
    'memory_sync', 'cache_manage', 'state_snapshot', 'context_restore',
    'memory_analytics', 'memory_persist', 'memory_namespace'
  ],
  MONITORING: [
    'performance_report', 'bottleneck_analyze', 'token_usage', 'benchmark_run',
    'metrics_collect', 'trend_analysis', 'cost_analysis', 'quality_assess',
    'error_analysis', 'usage_stats', 'health_check', 'swarm_monitor',
    'agent_metrics'
  ],
  WORKFLOW: [
    'workflow_create', 'workflow_execute', 'automation_setup', 'pipeline_create',
    'scheduler_manage', 'trigger_setup', 'workflow_template', 'batch_process',
    'parallel_execute', 'sparc_mode', 'task_orchestrate'
  ],
  GITHUB: [
    'github_repo_analyze', 'github_pr_manage', 'github_issue_track',
    'github_release_coord', 'github_workflow_auto', 'github_code_review',
    'github_sync_coord', 'github_metrics'
  ],
  DAA: [
    'daa_agent_create', 'daa_capability_match', 'daa_resource_alloc',
    'daa_lifecycle_manage', 'daa_communication', 'daa_consensus',
    'daa_fault_tolerance', 'daa_optimization'
  ],
  SYSTEM: [
    'security_scan', 'backup_create', 'restore_system', 'log_analysis',
    'diagnostic_run', 'config_manage', 'features_detect', 'terminal_execute'
  ]
};

export class UIManager {
  private eventBus: EventBus;
  private mcpIntegration: MCPIntegrationLayer;
  private viewManager: ViewManager;
  private stateManager: StateManager;
  private componentLibrary: ComponentLibrary;
  private currentView: ViewCategoryType;
  private viewHistory: ViewHistoryEntry[];
  private shortcuts: Map<string, () => void>;
  private theme: string;
  private isResponsive: boolean;

  constructor() {
    this.eventBus = new EventBus();
    this.mcpIntegration = new MCPIntegrationLayer(this.eventBus);
    this.viewManager = new ViewManager(this.eventBus);
    this.stateManager = new StateManager(this.eventBus);
    this.componentLibrary = new ComponentLibrary();
    
    this.currentView = VIEW_CATEGORIES.OVERVIEW;
    this.viewHistory = [];
    this.shortcuts = new Map();
    this.theme = 'dark';
    this.isResponsive = true;
    
    this.initializeEventHandlers();
    this.setupKeyboardShortcuts();
  }

  /**
   * Initialize the complete UI system
   */
  async initialize(): Promise<void> {
    try {
      // Initialize core systems
      await this.stateManager.initialize();
      await this.mcpIntegration.initialize();
      await this.viewManager.initialize();
      
      // Load user preferences
      await this.loadUserPreferences();
      
      // Register all views
      await this.registerAllViews();
      
      // Set up real-time updates
      this.setupRealTimeUpdates();
      
      // Initialize component library
      this.componentLibrary.initialize();
      
      this.eventBus.emit('ui:initialized');
      console.log('🎨 UI Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize UI Manager:', error);
      throw error;
    }
  }

  /**
   * Register all available views
   */
  async registerAllViews(): Promise<void> {
    const viewConfigs: ViewConfig[] = [
      {
        id: VIEW_CATEGORIES.OVERVIEW,
        name: 'Overview',
        icon: '🏠',
        description: 'System overview and quick actions',
        component: 'OverviewView',
        shortcut: '1'
      },
      {
        id: VIEW_CATEGORIES.PROCESSES,
        name: 'Processes',
        icon: '⚙️',
        description: 'Process management and monitoring',
        component: 'ProcessView',
        shortcut: '2'
      },
      {
        id: VIEW_CATEGORIES.NEURAL,
        name: 'Neural Network',
        icon: '🧠',
        description: 'AI model training and neural operations',
        component: 'NeuralNetworkView',
        shortcut: '3',
        toolCount: MCP_TOOL_CATEGORIES.NEURAL.length
      },
      {
        id: VIEW_CATEGORIES.MEMORY,
        name: 'Memory Bank',
        icon: '💾',
        description: 'Memory management and persistence',
        component: 'MemoryManagementView',
        shortcut: '4',
        toolCount: MCP_TOOL_CATEGORIES.MEMORY.length
      },
      {
        id: VIEW_CATEGORIES.MONITORING,
        name: 'Monitoring',
        icon: '📊',
        description: 'Performance monitoring and analysis',
        component: 'MonitoringView',
        shortcut: '5',
        toolCount: MCP_TOOL_CATEGORIES.MONITORING.length
      },
      {
        id: VIEW_CATEGORIES.WORKFLOW,
        name: 'Workflows',
        icon: '🔄',
        description: 'Automation and workflow management',
        component: 'WorkflowAutomationView',
        shortcut: '6',
        toolCount: MCP_TOOL_CATEGORIES.WORKFLOW.length
      },
      {
        id: VIEW_CATEGORIES.GITHUB,
        name: 'GitHub',
        icon: '🐙',
        description: 'GitHub integration and operations',
        component: 'GitHubIntegrationView',
        shortcut: '7',
        toolCount: MCP_TOOL_CATEGORIES.GITHUB.length
      },
      {
        id: VIEW_CATEGORIES.DAA,
        name: 'Dynamic Agents',
        icon: '🤖',
        description: 'Dynamic agent architecture',
        component: 'DAAView',
        shortcut: '8',
        toolCount: MCP_TOOL_CATEGORIES.DAA.length
      },
      {
        id: VIEW_CATEGORIES.SYSTEM,
        name: 'System',
        icon: '🛠️',
        description: 'System utilities and diagnostics',
        component: 'SystemUtilitiesView',
        shortcut: '9',
        toolCount: MCP_TOOL_CATEGORIES.SYSTEM.length
      },
      {
        id: VIEW_CATEGORIES.CLI,
        name: 'CLI Bridge',
        icon: '⌨️',
        description: 'Command-line interface bridge',
        component: 'CLICommandView',
        shortcut: '0'
      },
      {
        id: VIEW_CATEGORIES.HELP,
        name: 'Help',
        icon: '❓',
        description: 'Documentation and help',
        component: 'HelpView',
        shortcut: '?'
      }
    ];

    for (const config of viewConfigs) {
      await this.viewManager.registerView(config);
    }
  }

  /**
   * Navigate to a specific view
   */
  async navigateToView(viewId: ViewCategoryType, params: NavigationParams = {}): Promise<void> {
    if (!this.viewManager.hasView(viewId)) {
      throw new Error(`View not found: ${viewId}`);
    }

    // Store current view in history
    if (this.currentView && this.currentView !== viewId) {
      this.viewHistory.push({
        viewId: this.currentView,
        timestamp: Date.now(),
        params: this.stateManager.getViewState(this.currentView)
      });
    }

    // Update current view
    this.currentView = viewId;
    
    // Load view with parameters
    await this.viewManager.loadView(viewId, params);
    
    // Update browser history if available
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ viewId, params }, '', `#${viewId}`);
    }
    
    // Update state
    await this.stateManager.setViewState(viewId, params);
    
    // Emit navigation event
    this.eventBus.emit('ui:navigation', { viewId, params });
  }

  /**
   * Go back to previous view
   */
  async goBack(): Promise<void> {
    if (this.viewHistory.length === 0) return;
    
    const previousView = this.viewHistory.pop()!;
    await this.navigateToView(previousView.viewId, previousView.params);
  }

  /**
   * Execute MCP tool with UI integration
   */
  async executeMCPTool(toolName: string, params: any = {}): Promise<any> {
    try {
      // Show loading indicator
      this.eventBus.emit('ui:loading', { tool: toolName, params });
      
      // Execute tool through MCP integration layer
      const result = await this.mcpIntegration.executeTool(toolName, params);
      
      // Handle result based on tool type
      await this.handleToolResult(toolName, result, params);
      
      // Hide loading indicator
      this.eventBus.emit('ui:loading:complete', { tool: toolName, result });
      
      return result;
      
    } catch (error) {
      this.eventBus.emit('ui:error', { tool: toolName, error, params });
      throw error;
    }
  }

  /**
   * Handle tool execution results
   */
  async handleToolResult(toolName: string, result: any, originalParams: any): Promise<void> {
    // Update relevant views with new data
    const category = this.getToolCategory(toolName);
    
    if (category) {
      this.eventBus.emit(`view:${category}:update`, {
        tool: toolName,
        result,
        params: originalParams
      });
    }
    
    // Store result in state for persistence
    await this.stateManager.setToolResult(toolName, result);
    
    // Log execution
    this.eventBus.emit('ui:log', {
      level: 'info',
      message: `Executed ${toolName}`,
      data: { result, params: originalParams }
    });
  }

  /**
   * Get tool category for a given tool name
   */
  getToolCategory(toolName: string): string | null {
    for (const [category, tools] of Object.entries(MCP_TOOL_CATEGORIES)) {
      if (tools.includes(toolName)) {
        return category.toLowerCase();
      }
    }
    return null;
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts(): void {
    // View navigation shortcuts
    Object.values(VIEW_CATEGORIES).forEach((viewId, index) => {
      const key = (index + 1).toString();
      this.shortcuts.set(key, () => this.navigateToView(viewId));
    });

    // Global shortcuts
    this.shortcuts.set('ctrl+k', () => this.showCommandPalette());
    this.shortcuts.set('ctrl+/', () => this.navigateToView(VIEW_CATEGORIES.HELP));
    this.shortcuts.set('ctrl+1', () => this.navigateToView(VIEW_CATEGORIES.OVERVIEW));
    this.shortcuts.set('escape', () => this.hideAllOverlays());
    this.shortcuts.set('ctrl+shift+p', () => this.showCommandPalette());
    this.shortcuts.set('ctrl+b', () => this.goBack());
    this.shortcuts.set('ctrl+r', () => this.refreshCurrentView());
    this.shortcuts.set('ctrl+t', () => this.toggleTheme());
    
    // Setup event listener for keyboard events
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        const key = this.getKeyString(event);
        const handler = this.shortcuts.get(key);
        if (handler) {
          event.preventDefault();
          handler();
        }
      });
    }
  }

  /**
   * Get key string from keyboard event
   */
  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    if (event.metaKey) parts.push('meta');
    
    if (event.key.length === 1) {
      parts.push(event.key.toLowerCase());
    } else {
      parts.push(event.key.toLowerCase());
    }
    
    return parts.join('+');
  }

  /**
   * Show command palette
   */
  showCommandPalette(): void {
    this.eventBus.emit('ui:command-palette:show');
  }

  /**
   * Hide all overlays
   */
  hideAllOverlays(): void {
    this.eventBus.emit('ui:overlays:hide');
  }

  /**
   * Refresh current view
   */
  async refreshCurrentView(): Promise<void> {
    await this.viewManager.refreshView(this.currentView);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.eventBus.emit('ui:theme:changed', this.theme);
  }

  /**
   * Setup real-time updates
   */
  setupRealTimeUpdates(): void {
    // Update every 5 seconds for live data
    setInterval(() => {
      this.eventBus.emit('ui:real-time:update');
    }, 5000);
    
    // Setup MCP tool result streaming
    this.mcpIntegration.on('tool:result', (result) => {
      this.eventBus.emit('ui:real-time:tool-result', result);
    });
  }

  /**
   * Initialize event handlers
   */
  private initializeEventHandlers(): void {
    // Handle tool execution requests
    this.eventBus.on('tool:execute', async (data: ToolExecutionData) => {
      await this.executeMCPTool(data.tool, data.params);
    });
    
    // Handle view navigation requests
    this.eventBus.on('view:navigate', async (data: ViewNavigationData) => {
      await this.navigateToView(data.viewId, data.params);
    });
    
    // Handle state persistence
    this.eventBus.on('state:persist', async (data: StatePersistData) => {
      await this.stateManager.persistState(data);
    });
    
    // Handle errors
    this.eventBus.on('ui:error', (error: ErrorData) => {
      console.error('UI Error:', error);
      // Could show error toast/notification here
    });
  }

  /**
   * Load user preferences
   */
  private async loadUserPreferences(): Promise<void> {
    const preferences: UserPreferences | null = await this.stateManager.getUserPreferences();
    if (preferences) {
      this.theme = preferences.theme || 'dark';
      this.isResponsive = preferences.responsive !== false;
    }
  }

  /**
   * Get system status for overview
   */
  async getSystemStatus(): Promise<SystemStatus> {
    const status: SystemStatus = {
      uptime: await this.mcpIntegration.getSystemUptime(),
      activeTools: await this.mcpIntegration.getActiveTools(),
      memoryUsage: await this.mcpIntegration.getMemoryUsage(),
      swarmStatus: await this.mcpIntegration.getSwarmStatus(),
      toolsAvailable: Object.values(MCP_TOOL_CATEGORIES).flat().length,
      viewsRegistered: this.viewManager.getViewCount()
    };
    
    return status;
  }

  /**
   * Shutdown UI Manager
   */
  async shutdown(): Promise<void> {
    await this.stateManager.persistAllState();
    await this.mcpIntegration.shutdown();
    this.eventBus.emit('ui:shutdown');
  }
}

export default UIManager;