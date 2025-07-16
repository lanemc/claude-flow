/**
 * ComponentLibrary - Reusable UI components for Claude Flow Web UI
 * Provides consistent, themeable components across all views
 */

import {
  ComponentLibraryConfig,
  ComponentType,
  ComponentFactory,
  ToolPanelComponent,
  MetricsChartComponent,
  CommandPaletteComponent,
  ProgressBarComponent,
  StatusBadgeComponent,
  LoadingSpinnerComponent,
  MessageComponent,
  InfoPanelComponent,
  ActionButtonComponent,
  ToolGridComponent,
  StatsCardComponent,
  TabContainerComponent,
  ChartData,
  Command,
  UITool,
  Tab,
  StatusType
} from '../types/interfaces.js';

export class ComponentLibrary {
  private components: Map<ComponentType, ComponentFactory>;
  private theme: 'dark' | 'light';
  private isInitialized: boolean;

  constructor() {
    this.components = new Map();
    this.theme = 'dark';
    this.isInitialized = false;
  }

  /**
   * Initialize component library
   */
  initialize(): void {
    this.registerComponents();
    this.addComponentStyles();
    this.isInitialized = true;
    console.log('🎨 Component Library initialized');
  }

  /**
   * Register all reusable components
   */
  private registerComponents(): void {
    this.components.set('ToolPanel', this.createToolPanel.bind(this));
    this.components.set('MetricsChart', this.createMetricsChart.bind(this));
    this.components.set('CommandPalette', this.createCommandPalette.bind(this));
    this.components.set('ProgressBar', this.createProgressBar.bind(this));
    this.components.set('StatusBadge', this.createStatusBadge.bind(this));
    this.components.set('LoadingSpinner', this.createLoadingSpinner.bind(this));
    this.components.set('ErrorMessage', this.createErrorMessage.bind(this));
    this.components.set('SuccessMessage', this.createSuccessMessage.bind(this));
    this.components.set('InfoPanel', this.createInfoPanel.bind(this));
    this.components.set('ActionButton', this.createActionButton.bind(this));
    this.components.set('ToolGrid', this.createToolGrid.bind(this));
    this.components.set('StatsCard', this.createStatsCard.bind(this));
    this.components.set('LogViewer', this.createLogViewer.bind(this));
    this.components.set('FormBuilder', this.createFormBuilder.bind(this));
    this.components.set('TabContainer', this.createTabContainer.bind(this));
  }

  /**
   * Get component by name
   */
  getComponent<T = any>(name: ComponentType): ComponentFactory<T> {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component not found: ${name}`);
    }
    return component as ComponentFactory<T>;
  }

  /**
   * Create tool panel component
   */
  createToolPanel(config: ComponentLibraryConfig): ToolPanelComponent {
    const panel = document.createElement('div');
    panel.className = 'claude-tool-panel';
    
    const header = document.createElement('div');
    header.className = 'claude-tool-panel-header';
    
    const title = document.createElement('h3');
    title.textContent = config.title || '';
    title.className = 'claude-tool-panel-title';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = config.description || '';
    subtitle.className = 'claude-tool-panel-subtitle';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    
    const content = document.createElement('div');
    content.className = 'claude-tool-panel-content';
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    return {
      element: panel,
      content,
      setTitle: (newTitle: string) => { title.textContent = newTitle; },
      setDescription: (newDesc: string) => { subtitle.textContent = newDesc; },
      clear: () => { content.innerHTML = ''; },
      append: (element: HTMLElement) => { content.appendChild(element); }
    };
  }

  /**
   * Create metrics chart component
   */
  createMetricsChart(config: ComponentLibraryConfig): MetricsChartComponent {
    const container = document.createElement('div');
    container.className = 'claude-metrics-chart';
    
    const title = document.createElement('h4');
    title.textContent = config.title || '';
    title.className = 'claude-chart-title';
    
    const canvas = document.createElement('canvas');
    canvas.width = config.width || 400;
    canvas.height = config.height || 200;
    canvas.className = 'claude-chart-canvas';
    
    const legend = document.createElement('div');
    legend.className = 'claude-chart-legend';
    
    container.appendChild(title);
    container.appendChild(canvas);
    container.appendChild(legend);
    
    return {
      element: container,
      canvas,
      updateData: (data: ChartData[]) => this.updateChart(canvas, data, config),
      setTitle: (newTitle: string) => { title.textContent = newTitle; },
      addLegendItem: (label: string, color: string) => this.addLegendItem(legend, label, color)
    };
  }

  /**
   * Create command palette component
   */
  createCommandPalette(config: ComponentLibraryConfig): CommandPaletteComponent {
    const overlay = document.createElement('div');
    overlay.className = 'claude-command-palette-overlay';
    overlay.style.display = 'none';
    
    const palette = document.createElement('div');
    palette.className = 'claude-command-palette';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a command...';
    input.className = 'claude-command-input';
    
    const results = document.createElement('div');
    results.className = 'claude-command-results';
    
    palette.appendChild(input);
    palette.appendChild(results);
    overlay.appendChild(palette);
    
    return {
      element: overlay,
      input,
      results,
      show: () => { overlay.style.display = 'flex'; input.focus(); },
      hide: () => { overlay.style.display = 'none'; },
      updateResults: (commands: Command[]) => this.updateCommandResults(results, commands),
      onCommand: null
    };
  }

  /**
   * Create progress bar component
   */
  createProgressBar(config: ComponentLibraryConfig): ProgressBarComponent {
    const container = document.createElement('div');
    container.className = 'claude-progress-container';
    
    const label = document.createElement('div');
    label.className = 'claude-progress-label';
    label.textContent = config.label || 'Progress';
    
    const bar = document.createElement('div');
    bar.className = 'claude-progress-bar';
    
    const fill = document.createElement('div');
    fill.className = 'claude-progress-fill';
    fill.style.width = '0%';
    
    const text = document.createElement('div');
    text.className = 'claude-progress-text';
    text.textContent = '0%';
    
    bar.appendChild(fill);
    bar.appendChild(text);
    container.appendChild(label);
    container.appendChild(bar);
    
    return {
      element: container,
      setProgress: (percent: number) => {
        fill.style.width = `${percent}%`;
        text.textContent = `${Math.round(percent)}%`;
      },
      setLabel: (newLabel: string) => { label.textContent = newLabel; }
    };
  }

  /**
   * Create status badge component
   */
  createStatusBadge(status: StatusType, text?: string): StatusBadgeComponent {
    const badge = document.createElement('span');
    badge.className = `claude-status-badge claude-status-${status}`;
    badge.textContent = text || status;
    
    return {
      element: badge,
      setStatus: (newStatus: StatusType) => {
        badge.className = `claude-status-badge claude-status-${newStatus}`;
      },
      setText: (newText: string) => { badge.textContent = newText; }
    };
  }

  /**
   * Create loading spinner component
   */
  createLoadingSpinner(config: ComponentLibraryConfig = {}): LoadingSpinnerComponent {
    const container = document.createElement('div');
    container.className = 'claude-loading-container';
    
    const spinner = document.createElement('div');
    spinner.className = 'claude-loading-spinner';
    
    const message = document.createElement('div');
    message.className = 'claude-loading-message';
    message.textContent = config.message || 'Loading...';
    
    container.appendChild(spinner);
    container.appendChild(message);
    
    return {
      element: container,
      setMessage: (newMessage: string) => { message.textContent = newMessage; },
      show: () => { container.style.display = 'flex'; },
      hide: () => { container.style.display = 'none'; }
    };
  }

  /**
   * Create error message component
   */
  createErrorMessage(message: string, details: string | null = null): MessageComponent {
    const container = document.createElement('div');
    container.className = 'claude-error-message';
    
    const icon = document.createElement('span');
    icon.textContent = '❌';
    icon.className = 'claude-error-icon';
    
    const text = document.createElement('div');
    text.className = 'claude-error-text';
    text.textContent = message;
    
    container.appendChild(icon);
    container.appendChild(text);
    
    if (details) {
      const detailsEl = document.createElement('div');
      detailsEl.className = 'claude-error-details';
      detailsEl.textContent = details;
      container.appendChild(detailsEl);
    }
    
    return {
      element: container,
      setMessage: (newMessage: string) => { text.textContent = newMessage; },
      setDetails: (newDetails: string) => {
        if (newDetails) {
          let detailsEl = container.querySelector('.claude-error-details') as HTMLDivElement;
          if (!detailsEl) {
            detailsEl = document.createElement('div');
            detailsEl.className = 'claude-error-details';
            container.appendChild(detailsEl);
          }
          detailsEl.textContent = newDetails;
        }
      }
    };
  }

  /**
   * Create success message component
   */
  createSuccessMessage(message: string): MessageComponent {
    const container = document.createElement('div');
    container.className = 'claude-success-message';
    
    const icon = document.createElement('span');
    icon.textContent = '✅';
    icon.className = 'claude-success-icon';
    
    const text = document.createElement('div');
    text.className = 'claude-success-text';
    text.textContent = message;
    
    container.appendChild(icon);
    container.appendChild(text);
    
    return {
      element: container,
      setMessage: (newMessage: string) => { text.textContent = newMessage; }
    };
  }

  /**
   * Create info panel component
   */
  createInfoPanel(config: ComponentLibraryConfig): InfoPanelComponent {
    const panel = document.createElement('div');
    panel.className = 'claude-info-panel';
    
    const header = document.createElement('div');
    header.className = 'claude-info-header';
    header.textContent = config.title || '';
    
    const content = document.createElement('div');
    content.className = 'claude-info-content';
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    return {
      element: panel,
      content,
      setTitle: (title: string) => { header.textContent = title; },
      setContent: (html: string) => { content.innerHTML = html; },
      append: (element: HTMLElement) => { content.appendChild(element); },
      clear: () => { content.innerHTML = ''; }
    };
  }

  /**
   * Create action button component
   */
  createActionButton(config: ComponentLibraryConfig): ActionButtonComponent {
    const button = document.createElement('button');
    button.className = `claude-action-button claude-button-${config.type || 'primary'}`;
    button.textContent = config.text || '';
    
    if (config.icon) {
      const icon = document.createElement('span');
      icon.textContent = config.icon;
      icon.className = 'claude-button-icon';
      button.insertBefore(icon, button.firstChild);
    }
    
    if (config.onclick) {
      button.addEventListener('click', config.onclick);
    }
    
    return {
      element: button,
      setText: (text: string) => { 
        button.textContent = text; 
        if (config.icon) {
          const icon = document.createElement('span');
          icon.textContent = config.icon;
          icon.className = 'claude-button-icon';
          button.insertBefore(icon, button.firstChild);
        }
      },
      setDisabled: (disabled: boolean) => { button.disabled = disabled; },
      setLoading: (loading: boolean) => {
        if (loading) {
          button.classList.add('claude-button-loading');
          button.disabled = true;
        } else {
          button.classList.remove('claude-button-loading');
          button.disabled = false;
        }
      }
    };
  }

  /**
   * Create tool grid component
   */
  createToolGrid(tools: UITool[], onToolClick: (tool: UITool) => void): ToolGridComponent {
    const grid = document.createElement('div');
    grid.className = 'claude-tool-grid';
    
    tools.forEach(tool => {
      const card = this.createToolCard(tool, onToolClick);
      grid.appendChild(card);
    });
    
    return {
      element: grid,
      updateTools: (newTools: UITool[]) => {
        grid.innerHTML = '';
        newTools.forEach(tool => {
          const card = this.createToolCard(tool, onToolClick);
          grid.appendChild(card);
        });
      }
    };
  }

  /**
   * Create tool card element
   */
  private createToolCard(tool: UITool, onToolClick: (tool: UITool) => void): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'claude-tool-card';
    
    const icon = document.createElement('div');
    icon.className = 'claude-tool-icon';
    icon.textContent = tool.icon || '🔧';
    
    const name = document.createElement('div');
    name.className = 'claude-tool-name';
    name.textContent = tool.name;
    
    const desc = document.createElement('div');
    desc.className = 'claude-tool-description';
    desc.textContent = tool.description;
    
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(desc);
    
    card.addEventListener('click', () => onToolClick(tool));
    
    return card;
  }

  /**
   * Create stats card component
   */
  createStatsCard(config: ComponentLibraryConfig): StatsCardComponent {
    const card = document.createElement('div');
    card.className = 'claude-stats-card';
    
    const icon = document.createElement('div');
    icon.className = 'claude-stats-icon';
    icon.textContent = config.icon || '';
    
    const content = document.createElement('div');
    content.className = 'claude-stats-content';
    
    const value = document.createElement('div');
    value.className = 'claude-stats-value';
    value.textContent = String(config.text || '');
    
    const label = document.createElement('div');
    label.className = 'claude-stats-label';
    label.textContent = config.label || '';
    
    content.appendChild(value);
    content.appendChild(label);
    card.appendChild(icon);
    card.appendChild(content);
    
    return {
      element: card,
      setValue: (newValue: string | number) => { value.textContent = String(newValue); },
      setLabel: (newLabel: string) => { label.textContent = newLabel; },
      setIcon: (newIcon: string) => { icon.textContent = newIcon; }
    };
  }

  /**
   * Create tab container component
   */
  createTabContainer(tabs: Tab[]): TabContainerComponent {
    const container = document.createElement('div');
    container.className = 'claude-tab-container';
    
    const tabList = document.createElement('div');
    tabList.className = 'claude-tab-list';
    
    const tabContent = document.createElement('div');
    tabContent.className = 'claude-tab-content';
    
    let activeTab = 0;
    
    tabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = `claude-tab-button ${index === 0 ? 'active' : ''}`;
      tabButton.textContent = tab.label;
      
      const tabPane = document.createElement('div');
      tabPane.className = `claude-tab-pane ${index === 0 ? 'active' : ''}`;
      tabPane.innerHTML = tab.content;
      
      tabButton.addEventListener('click', () => {
        // Remove active class from all tabs
        tabList.querySelectorAll('.claude-tab-button').forEach(btn => btn.classList.remove('active'));
        tabContent.querySelectorAll('.claude-tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked tab
        tabButton.classList.add('active');
        tabPane.classList.add('active');
        activeTab = index;
      });
      
      tabList.appendChild(tabButton);
      tabContent.appendChild(tabPane);
    });
    
    container.appendChild(tabList);
    container.appendChild(tabContent);
    
    return {
      element: container,
      setActiveTab: (index: number) => {
        if (index >= 0 && index < tabs.length) {
          const buttons = tabList.children;
          if (buttons[index] && buttons[index] instanceof HTMLButtonElement) {
            buttons[index].click();
          }
        }
      },
      getActiveTab: () => activeTab,
      addTab: (tab: Tab) => {
        // Implementation for adding new tabs dynamically
      }
    };
  }

  /**
   * Create log viewer component (placeholder for now)
   */
  private createLogViewer(config: ComponentLibraryConfig): any {
    const container = document.createElement('div');
    container.className = 'claude-log-viewer';
    container.textContent = 'Log Viewer Component';
    return { element: container };
  }

  /**
   * Create form builder component (placeholder for now)
   */
  private createFormBuilder(config: ComponentLibraryConfig): any {
    const container = document.createElement('div');
    container.className = 'claude-form-builder';
    container.textContent = 'Form Builder Component';
    return { element: container };
  }

  /**
   * Add component styles to document
   */
  private addComponentStyles(): void {
    if (document.getElementById('claude-component-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'claude-component-styles';
    styles.textContent = `
      /* Tool Panel Styles */
      .claude-tool-panel {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 16px;
        margin: 8px 0;
      }

      .claude-tool-panel-header {
        margin-bottom: 12px;
      }

      .claude-tool-panel-title {
        margin: 0 0 4px 0;
        color: #00d4ff;
        font-size: 18px;
      }

      .claude-tool-panel-subtitle {
        margin: 0;
        color: #888;
        font-size: 14px;
      }

      .claude-tool-panel-content {
        color: #fff;
      }

      /* Metrics Chart Styles */
      .claude-metrics-chart {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 16px;
        margin: 8px 0;
      }

      .claude-chart-title {
        margin: 0 0 12px 0;
        color: #00d4ff;
        font-size: 16px;
      }

      .claude-chart-canvas {
        display: block;
        margin: 0 auto;
        background: #1a1a1a;
        border-radius: 4px;
      }

      .claude-chart-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 8px;
        justify-content: center;
      }

      /* Command Palette Styles */
      .claude-command-palette-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 20vh;
        z-index: 9999;
      }

      .claude-command-palette {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        width: 600px;
        max-width: 90vw;
        max-height: 60vh;
        overflow: hidden;
      }

      .claude-command-input {
        width: 100%;
        padding: 16px;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 18px;
        outline: none;
        border-bottom: 1px solid #444;
      }

      .claude-command-results {
        max-height: 400px;
        overflow-y: auto;
      }

      /* Progress Bar Styles */
      .claude-progress-container {
        margin: 8px 0;
      }

      .claude-progress-label {
        color: #fff;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .claude-progress-bar {
        position: relative;
        background: #1a1a1a;
        border: 1px solid #444;
        border-radius: 4px;
        height: 24px;
        overflow: hidden;
      }

      .claude-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d4ff, #0099cc);
        transition: width 0.3s ease;
      }

      .claude-progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
      }

      /* Status Badge Styles */
      .claude-status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .claude-status-success {
        background: #22c55e;
        color: white;
      }

      .claude-status-error {
        background: #ef4444;
        color: white;
      }

      .claude-status-warning {
        background: #f59e0b;
        color: white;
      }

      .claude-status-info {
        background: #3b82f6;
        color: white;
      }

      .claude-status-idle {
        background: #6b7280;
        color: white;
      }

      /* Loading Spinner Styles */
      .claude-loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px;
      }

      .claude-loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #444;
        border-top: 3px solid #00d4ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .claude-loading-message {
        margin-top: 12px;
        color: #888;
        font-size: 14px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Message Styles */
      .claude-error-message,
      .claude-success-message {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 6px;
        margin: 8px 0;
      }

      .claude-error-message {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
      }

      .claude-success-message {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
      }

      .claude-error-icon,
      .claude-success-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      /* Tool Grid Styles */
      .claude-tool-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
        margin: 16px 0;
      }

      .claude-tool-card {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .claude-tool-card:hover {
        border-color: #00d4ff;
        transform: translateY(-2px);
      }

      .claude-tool-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .claude-tool-name {
        font-weight: bold;
        color: #fff;
        margin-bottom: 4px;
      }

      .claude-tool-description {
        color: #888;
        font-size: 14px;
      }

      /* Stats Card Styles */
      .claude-stats-card {
        display: flex;
        align-items: center;
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 16px;
        margin: 8px 0;
      }

      .claude-stats-icon {
        font-size: 24px;
        margin-right: 12px;
      }

      .claude-stats-value {
        font-size: 24px;
        font-weight: bold;
        color: #00d4ff;
      }

      .claude-stats-label {
        color: #888;
        font-size: 14px;
      }

      /* Tab Styles */
      .claude-tab-container {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        overflow: hidden;
      }

      .claude-tab-list {
        display: flex;
        background: #1a1a1a;
        border-bottom: 1px solid #444;
      }

      .claude-tab-button {
        background: transparent;
        border: none;
        color: #888;
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .claude-tab-button:hover {
        color: #fff;
      }

      .claude-tab-button.active {
        color: #00d4ff;
        border-bottom-color: #00d4ff;
      }

      .claude-tab-content {
        position: relative;
      }

      .claude-tab-pane {
        display: none;
        padding: 16px;
      }

      .claude-tab-pane.active {
        display: block;
      }

      /* Button Styles */
      .claude-action-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .claude-button-primary {
        background: #00d4ff;
        color: #000;
      }

      .claude-button-primary:hover {
        background: #00b8e6;
      }

      .claude-button-secondary {
        background: #444;
        color: #fff;
      }

      .claude-button-secondary:hover {
        background: #555;
      }

      .claude-button-danger {
        background: #ef4444;
        color: #fff;
      }

      .claude-button-danger:hover {
        background: #dc2626;
      }

      .claude-button-loading {
        opacity: 0.7;
        pointer-events: none;
      }

      /* Info Panel Styles */
      .claude-info-panel {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        margin: 8px 0;
        overflow: hidden;
      }

      .claude-info-header {
        background: #1a1a1a;
        padding: 12px 16px;
        font-weight: bold;
        color: #00d4ff;
        border-bottom: 1px solid #444;
      }

      .claude-info-content {
        padding: 16px;
        color: #fff;
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Update chart with new data
   */
  private updateChart(canvas: HTMLCanvasElement, data: ChartData[], config: ComponentLibraryConfig): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple chart implementation
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    if (config.type === 'line') {
      this.drawLineChart(ctx, data, padding, chartWidth, chartHeight);
    } else if (config.type === 'bar') {
      this.drawBarChart(ctx, data, padding, chartWidth, chartHeight);
    }
  }

  /**
   * Draw line chart
   */
  private drawLineChart(ctx: CanvasRenderingContext2D, data: ChartData[], padding: number, width: number, height: number): void {
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const stepX = width / (data.length - 1);
    
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + (index * stepX);
      const y = padding + height - (point.value / maxValue * height);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }

  /**
   * Draw bar chart
   */
  private drawBarChart(ctx: CanvasRenderingContext2D, data: ChartData[], padding: number, width: number, height: number): void {
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;
    
    ctx.fillStyle = '#00d4ff';
    
    data.forEach((point, index) => {
      const x = padding + (index * (barWidth + barSpacing));
      const barHeight = (point.value / maxValue) * height;
      const y = padding + height - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  }

  /**
   * Add legend item to chart
   */
  private addLegendItem(legend: HTMLDivElement, label: string, color: string): void {
    const item = document.createElement('div');
    item.className = 'claude-chart-legend-item';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '4px';
    
    const colorBox = document.createElement('div');
    colorBox.style.width = '12px';
    colorBox.style.height = '12px';
    colorBox.style.backgroundColor = color;
    colorBox.style.borderRadius = '2px';
    
    const labelText = document.createElement('span');
    labelText.textContent = label;
    labelText.style.fontSize = '12px';
    labelText.style.color = '#888';
    
    item.appendChild(colorBox);
    item.appendChild(labelText);
    legend.appendChild(item);
  }

  /**
   * Update command palette results
   */
  private updateCommandResults(results: HTMLDivElement, commands: Command[]): void {
    results.innerHTML = '';
    
    commands.forEach(command => {
      const item = document.createElement('div');
      item.className = 'claude-command-item';
      item.style.padding = '12px 16px';
      item.style.cursor = 'pointer';
      item.style.borderBottom = '1px solid #444';
      
      const label = document.createElement('div');
      label.textContent = command.label;
      label.style.color = '#fff';
      label.style.marginBottom = '4px';
      
      if (command.description) {
        const desc = document.createElement('div');
        desc.textContent = command.description;
        desc.style.color = '#888';
        desc.style.fontSize = '12px';
        item.appendChild(desc);
      }
      
      item.addEventListener('click', () => command.action());
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#333';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
      });
      
      item.appendChild(label);
      results.appendChild(item);
    });
  }

  /**
   * Set theme
   */
  setTheme(theme: 'dark' | 'light'): void {
    this.theme = theme;
    // Update component styles based on theme
    // This would be more comprehensive in a real implementation
  }
}

export default ComponentLibrary;