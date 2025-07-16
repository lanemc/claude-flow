/**
 * ViewManager - Dynamic view loading and state management
 * Handles all UI views, transitions, and state persistence
 */

import { EventBus } from './EventBus.js';

// View configuration interface
interface ViewConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: string;
  shortcut?: string;
  toolCount?: number;
  lazy?: boolean;
  preload?: boolean;
  permissions?: string[];
  dependencies?: string[];
  metadata?: Record<string, any>;
}

// Loaded view information
interface LoadedView {
  component: ViewComponent;
  config: ViewConfig;
  element: HTMLElement | null;
  instance: ViewInstance | null;
  loadTime: number;
}

// View component interface
interface ViewComponent {
  element?: HTMLElement | null;
  instance?: ViewInstance | null;
  render: (params: any) => Promise<void> | void;
  destroy?: () => Promise<void> | void;
}

// View instance interface
interface ViewInstance {
  render: (params: any) => Promise<void> | void;
  destroy?: () => Promise<void> | void;
}

// View state information
interface ViewState {
  params: any;
  loadTime: number;
  lastAccess: number;
}

// View history entry
interface ViewHistoryEntry {
  viewId: string;
  timestamp: number;
  params: any;
}

// Memory statistics
interface MemoryStats {
  registeredViews: number;
  loadedViews: number;
  viewStates: number;
  currentView: string | null;
}

export class ViewManager {
  private eventBus: EventBus;
  private registeredViews: Map<string, ViewConfig>;
  private loadedViews: Map<string, LoadedView>;
  private currentView: string | null;
  private viewStack: ViewHistoryEntry[];
  private viewStates: Map<string, ViewState>;
  private isInitialized: boolean;
  private containerElement: HTMLElement | null;
  private transitionDuration: number;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.registeredViews = new Map();
    this.loadedViews = new Map();
    this.currentView = null;
    this.viewStack = [];
    this.viewStates = new Map();
    this.isInitialized = false;
    this.containerElement = null;
    this.transitionDuration = 300;
  }

  /**
   * Initialize view manager
   */
  async initialize(): Promise<void> {
    try {
      // Create main view container if in browser
      if (typeof document !== 'undefined') {
        this.setupDOMContainer();
      }

      // Setup event handlers
      this.setupEventHandlers();

      this.isInitialized = true;
      this.eventBus.emit('view-manager:initialized');

      console.log('🖼️ View Manager initialized');

    } catch (error) {
      console.error('❌ Failed to initialize View Manager:', error);
      throw error;
    }
  }

  /**
   * Setup DOM container for web environment
   */
  private setupDOMContainer(): void {
    // Create main container
    this.containerElement = document.getElementById('claude-flow-ui') || 
                           document.createElement('div');
    
    if (!this.containerElement.id) {
      this.containerElement.id = 'claude-flow-ui';
      this.containerElement.className = 'claude-flow-main-container';
      document.body.appendChild(this.containerElement);
    }

    // Add CSS for transitions
    this.addTransitionStyles();
  }

  /**
   * Add CSS styles for view transitions
   */
  private addTransitionStyles(): void {
    if (document.getElementById('claude-flow-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'claude-flow-styles';
    styles.textContent = `
      .claude-flow-main-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        background: #1a1a1a;
        color: #ffffff;
      }

      .claude-flow-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        transform: translateX(0);
        transition: all ${this.transitionDuration}ms ease-in-out;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
      }

      .claude-flow-view.entering {
        opacity: 0;
        transform: translateX(50px);
      }

      .claude-flow-view.exiting {
        opacity: 0;
        transform: translateX(-50px);
      }

      .claude-flow-view.hidden {
        display: none;
      }

      .claude-flow-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
      }

      .claude-flow-title {
        font-size: 24px;
        font-weight: bold;
        color: #00d4ff;
      }

      .claude-flow-breadcrumb {
        font-size: 14px;
        color: #888;
      }

      .claude-flow-content {
        flex: 1;
        overflow-y: auto;
      }

      .claude-flow-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        font-size: 18px;
        color: #888;
      }

      .claude-flow-error {
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .claude-flow-main-container {
          padding: 10px;
        }
        
        .claude-flow-view {
          padding: 10px;
        }
        
        .claude-flow-title {
          font-size: 20px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Register a view configuration
   */
  async registerView(viewConfig: Partial<ViewConfig> & { id: string; component: string }): Promise<void> {
    if (!viewConfig.id || !viewConfig.component) {
      throw new Error('View config must have id and component');
    }

    const config: ViewConfig = {
      id: viewConfig.id,
      name: viewConfig.name || viewConfig.id,
      icon: viewConfig.icon || '📄',
      description: viewConfig.description || '',
      component: viewConfig.component,
      shortcut: viewConfig.shortcut,
      toolCount: viewConfig.toolCount || 0,
      lazy: viewConfig.lazy !== false, // Default to lazy loading
      preload: viewConfig.preload || false,
      permissions: viewConfig.permissions || [],
      dependencies: viewConfig.dependencies || [],
      metadata: viewConfig.metadata || {}
    };

    this.registeredViews.set(viewConfig.id, config);

    // Preload if requested
    if (config.preload) {
      await this.preloadView(config.id);
    }

    this.eventBus.emit('view:registered', { viewId: config.id, config });

    console.log(`🖼️ Registered view: ${config.name} (${config.id})`);
  }

  /**
   * Load and display a view
   */
  async loadView(viewId: string, params: any = {}): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ViewManager not initialized');
    }

    const viewConfig = this.registeredViews.get(viewId);
    if (!viewConfig) {
      throw new Error(`View not registered: ${viewId}`);
    }

    try {
      this.eventBus.emit('view:loading', { viewId, params });

      // Check dependencies
      await this.checkDependencies(viewConfig);

      // Load view component if not already loaded
      if (!this.loadedViews.has(viewId)) {
        await this.loadViewComponent(viewId, viewConfig);
      }

      // Hide current view with transition
      if (this.currentView && this.currentView !== viewId) {
        await this.hideCurrentView();
      }

      // Show new view
      await this.showView(viewId, params);

      // Update state
      this.currentView = viewId;
      this.viewStates.set(viewId, {
        params,
        loadTime: Date.now(),
        lastAccess: Date.now()
      });

      this.eventBus.emit('view:loaded', { viewId, params });

      console.log(`🖼️ Loaded view: ${viewConfig.name}`);

    } catch (error) {
      this.eventBus.emit('view:error', { viewId, error: (error as Error).message, params });
      throw error;
    }
  }

  /**
   * Load view component
   */
  private async loadViewComponent(viewId: string, viewConfig: ViewConfig): Promise<void> {
    try {
      let ViewComponent: ViewComponent;

      // Check if we're in a browser environment
      if (typeof document !== 'undefined') {
        // Browser environment - create DOM-based view
        ViewComponent = await this.createDOMView(viewId, viewConfig);
      } else {
        // Node.js environment - create terminal-based view
        ViewComponent = await this.createTerminalView(viewId, viewConfig);
      }

      this.loadedViews.set(viewId, {
        component: ViewComponent,
        config: viewConfig,
        element: ViewComponent.element || null,
        instance: ViewComponent.instance || null,
        loadTime: Date.now()
      });

    } catch (error) {
      console.error(`❌ Failed to load view component ${viewId}:`, error);
      throw error;
    }
  }

  /**
   * Create DOM-based view for browser
   */
  private async createDOMView(viewId: string, viewConfig: ViewConfig): Promise<ViewComponent> {
    const element = document.createElement('div');
    element.className = 'claude-flow-view hidden';
    element.id = `view-${viewId}`;

    // Create view header
    const header = document.createElement('div');
    header.className = 'claude-flow-header';
    
    const titleSection = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'claude-flow-title';
    title.textContent = `${viewConfig.icon} ${viewConfig.name}`;
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'claude-flow-breadcrumb';
    breadcrumb.textContent = viewConfig.description;
    
    titleSection.appendChild(title);
    titleSection.appendChild(breadcrumb);
    header.appendChild(titleSection);

    // Create view content
    const content = document.createElement('div');
    content.className = 'claude-flow-content';
    content.id = `content-${viewId}`;

    element.appendChild(header);
    element.appendChild(content);
    
    if (this.containerElement) {
      this.containerElement.appendChild(element);
    }

    // Create view instance based on component type
    let instance: ViewInstance;
    try {
      // Try to dynamically import the view component
      const module = await this.importViewComponent(viewConfig.component);
      instance = new module.default(content, this.eventBus, viewConfig);
    } catch (error) {
      // Fallback to basic view
      instance = this.createBasicView(content, viewConfig);
    }

    return {
      element,
      instance,
      render: (params: any) => instance.render(params),
      destroy: () => instance.destroy?.()
    };
  }

  /**
   * Create terminal-based view for Node.js
   */
  private async createTerminalView(viewId: string, viewConfig: ViewConfig): Promise<ViewComponent> {
    // For terminal environment, create a text-based view
    let instance: ViewInstance;
    try {
      const module = await this.importViewComponent(viewConfig.component);
      instance = new module.default(null, this.eventBus, viewConfig);
    } catch (error) {
      instance = this.createBasicTerminalView(viewConfig);
    }

    return {
      element: null,
      instance,
      render: (params: any) => instance.render(params),
      destroy: () => instance.destroy?.()
    };
  }

  /**
   * Import view component dynamically
   */
  private async importViewComponent(componentName: string): Promise<any> {
    try {
      // Try to import from views directory
      return await import(`../views/${componentName}.js`);
    } catch (error) {
      console.warn(`Could not import ${componentName}, using fallback`);
      throw error;
    }
  }

  /**
   * Create basic fallback view for browser
   */
  private createBasicView(container: HTMLElement, viewConfig: ViewConfig): ViewInstance {
    return {
      render: (params: any) => {
        container.innerHTML = `
          <div class="claude-flow-loading">
            <div>
              <h2>${viewConfig.name}</h2>
              <p>${viewConfig.description}</p>
              <p>This view is under development.</p>
              ${viewConfig.toolCount ? `<p>Will support ${viewConfig.toolCount} tools.</p>` : ''}
              <pre>${JSON.stringify(params, null, 2)}</pre>
            </div>
          </div>
        `;
      },
      destroy: () => {
        container.innerHTML = '';
      }
    };
  }

  /**
   * Create basic fallback view for terminal
   */
  private createBasicTerminalView(viewConfig: ViewConfig): ViewInstance {
    return {
      render: (params: any) => {
        console.log(`\n📄 ${viewConfig.name}`);
        console.log(`   ${viewConfig.description}`);
        if (viewConfig.toolCount) {
          console.log(`   Tools: ${viewConfig.toolCount}`);
        }
        console.log(`   Params:`, params);
        console.log(`   [This view is under development]\n`);
      },
      destroy: () => {}
    };
  }

  /**
   * Show view with transition
   */
  private async showView(viewId: string, params: any): Promise<void> {
    const loadedView = this.loadedViews.get(viewId);
    if (!loadedView) {
      throw new Error(`View not loaded: ${viewId}`);
    }

    // Render view with parameters
    await loadedView.component.render(params);

    if (loadedView.element) {
      // Browser environment - handle DOM transitions
      loadedView.element.classList.remove('hidden');
      loadedView.element.classList.add('entering');

      // Remove transition class after animation
      setTimeout(() => {
        if (loadedView.element) {
          loadedView.element.classList.remove('entering');
        }
      }, this.transitionDuration);
    }

    this.eventBus.emit('view:shown', { viewId, params });
  }

  /**
   * Hide current view with transition
   */
  private async hideCurrentView(): Promise<void> {
    if (!this.currentView) return;

    const loadedView = this.loadedViews.get(this.currentView);
    if (loadedView?.element) {
      loadedView.element.classList.add('exiting');

      // Hide after transition
      setTimeout(() => {
        if (loadedView.element) {
          loadedView.element.classList.remove('exiting');
          loadedView.element.classList.add('hidden');
        }
      }, this.transitionDuration);
    }

    this.eventBus.emit('view:hidden', { viewId: this.currentView });
  }

  /**
   * Refresh current view
   */
  async refreshView(viewId: string): Promise<void> {
    const viewState = this.viewStates.get(viewId);
    if (viewState) {
      await this.loadView(viewId, viewState.params);
    }
  }

  /**
   * Preload a view
   */
  private async preloadView(viewId: string): Promise<void> {
    const viewConfig = this.registeredViews.get(viewId);
    if (!viewConfig || this.loadedViews.has(viewId)) {
      return;
    }

    await this.loadViewComponent(viewId, viewConfig);
    console.log(`🔄 Preloaded view: ${viewConfig.name}`);
  }

  /**
   * Check view dependencies
   */
  private async checkDependencies(viewConfig: ViewConfig): Promise<void> {
    if (!viewConfig.dependencies || viewConfig.dependencies.length === 0) {
      return;
    }

    for (const dependency of viewConfig.dependencies) {
      if (!this.loadedViews.has(dependency)) {
        await this.preloadView(dependency);
      }
    }
  }

  /**
   * Unload a view
   */
  async unloadView(viewId: string): Promise<void> {
    const loadedView = this.loadedViews.get(viewId);
    if (!loadedView) return;

    // Call destroy method if available
    if (loadedView.component.destroy) {
      await loadedView.component.destroy();
    }

    // Remove DOM element
    if (loadedView.element) {
      loadedView.element.remove();
    }

    // Remove from loaded views
    this.loadedViews.delete(viewId);

    // Clear state
    this.viewStates.delete(viewId);

    this.eventBus.emit('view:unloaded', { viewId });
    console.log(`🗑️ Unloaded view: ${viewId}`);
  }

  /**
   * Get view configuration
   */
  getViewConfig(viewId: string): ViewConfig | undefined {
    return this.registeredViews.get(viewId);
  }

  /**
   * Get all registered views
   */
  getAllViews(): ViewConfig[] {
    return Array.from(this.registeredViews.values());
  }

  /**
   * Get view count
   */
  getViewCount(): number {
    return this.registeredViews.size;
  }

  /**
   * Check if view exists
   */
  hasView(viewId: string): boolean {
    return this.registeredViews.has(viewId);
  }

  /**
   * Get view state
   */
  getViewState(viewId: string): ViewState | undefined {
    return this.viewStates.get(viewId);
  }

  /**
   * Set view state
   */
  setViewState(viewId: string, state: Partial<ViewState>): void {
    const existing = this.viewStates.get(viewId) || {} as ViewState;
    this.viewStates.set(viewId, { ...existing, ...state });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.eventBus.on('view:reload', async (data: { viewId: string }) => {
      await this.refreshView(data.viewId);
    });

    this.eventBus.on('view:unload', async (data: { viewId: string }) => {
      await this.unloadView(data.viewId);
    });

    this.eventBus.on('view:preload', async (data: { viewId: string }) => {
      await this.preloadView(data.viewId);
    });
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): MemoryStats {
    return {
      registeredViews: this.registeredViews.size,
      loadedViews: this.loadedViews.size,
      viewStates: this.viewStates.size,
      currentView: this.currentView
    };
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    // Unload all views
    for (const viewId of this.loadedViews.keys()) {
      await this.unloadView(viewId);
    }

    // Clear all data
    this.registeredViews.clear();
    this.viewStates.clear();
    this.currentView = null;

    this.eventBus.emit('view-manager:shutdown');
  }
}

export default ViewManager;