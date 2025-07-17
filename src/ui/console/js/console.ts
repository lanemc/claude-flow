/**
 * Main Console Application
 * Coordinates all components of the Claude Code Console
 */

import { WebSocketClient } from './websocket-client.js';
import { TerminalEmulator } from './terminal-emulator.js';
import { CommandHandler } from './command-handler.js';
import { SettingsManager } from './settings.js';
import type {
  ConsoleElements,
  ConsoleStats,
  StreamingOutput,
  AgentStatusUpdate,
  SwarmUpdate,
  MemoryUpdate,
  LogMessage,
  ConnectionEstablished,
  WebSocketMessage,
  WebSocketNotification,
  ConnectionConfig,
  IWebSocketClient,
  ITerminalEmulator,
  ICommandHandler,
  ISettingsManager,
  SettingsChangeEvent,
  OutputType
} from './types.js';

// Extend Performance interface for Chrome's memory API
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

class ClaudeCodeConsole {
  private wsClient: IWebSocketClient;
  private terminal: ITerminalEmulator | null;
  private commandHandler: ICommandHandler | null;
  private settings: ISettingsManager;
  private isInitialized: boolean;
  private startTime: number;
  private messageCount: number;
  private activeAgents: number;
  private elements: ConsoleElements;
  private statusInterval: NodeJS.Timeout | null;
  private uptimeInterval: NodeJS.Timeout | null;

  constructor() {
    // Initialize components
    this.wsClient = new WebSocketClient() as IWebSocketClient;
    this.terminal = null;
    this.commandHandler = null;
    this.settings = new SettingsManager() as ISettingsManager;
    
    // State management
    this.isInitialized = false;
    this.startTime = Date.now();
    this.messageCount = 0;
    this.activeAgents = 0;
    
    // DOM elements
    this.elements = {} as ConsoleElements;
    
    // Status update intervals
    this.statusInterval = null;
    this.uptimeInterval = null;
    
    this.setupEventListeners();
  }
  
  /**
   * Initialize the console application
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Show loading overlay
      this.showLoading('Initializing Claude Code Console...');
      
      // Get DOM elements
      this.getDOMElements();
      
      // Initialize terminal emulator
      this.terminal = new TerminalEmulator(
        this.elements.consoleOutput,
        this.elements.consoleInput
      );
      
      // Initialize command handler
      this.commandHandler = new CommandHandler(this.terminal, this.wsClient);
      
      // Initialize settings
      this.settings.init();
      
      // Setup component interactions
      this.setupComponentInteractions();
      
      // Setup UI event handlers
      this.setupUIEventHandlers();
      
      // Apply initial settings
      this.applyInitialSettings();
      
      // Start status updates
      this.startStatusUpdates();
      
      // Hide loading overlay
      this.hideLoading();
      
      // Show welcome message
      this.showWelcomeMessage();
      
      // Auto-connect if enabled
      if (this.settings.get('autoConnect')) {
        await this.autoConnect();
      }
      
      this.isInitialized = true;
      console.log('Claude Code Console initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize console:', error);
      this.showError('Failed to initialize console: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
  
  /**
   * Get DOM elements
   */
  private getDOMElements(): void {
    this.elements = {
      consoleOutput: document.getElementById('consoleOutput')!,
      consoleInput: document.getElementById('consoleInput')! as HTMLInputElement,
      settingsPanel: document.getElementById('settingsPanel')!,
      loadingOverlay: document.getElementById('loadingOverlay')!,
      connectionStatus: document.getElementById('connectionStatus')!,
      statusIndicator: document.getElementById('statusIndicator')!,
      statusText: document.getElementById('statusText')!,
      currentMode: document.getElementById('currentMode')!,
      activeAgents: document.getElementById('activeAgents')!,
      uptime: document.getElementById('uptime')!,
      memoryUsage: document.getElementById('memoryUsage')!,
      messageCount: document.getElementById('messageCount')!,
      timestamp: document.getElementById('timestamp')!,
      clearConsole: document.getElementById('clearConsole')!,
      fullscreenToggle: document.getElementById('fullscreenToggle')!
    };
    
    // Validate required elements
    const required = ['consoleOutput', 'consoleInput', 'loadingOverlay'] as const;
    for (const elementId of required) {
      if (!this.elements[elementId]) {
        throw new Error(`Required element not found: ${elementId}`);
      }
    }
  }
  
  /**
   * Setup component interactions
   */
  private setupComponentInteractions(): void {
    // Terminal -> Command Handler
    this.terminal!.on('command', (command: string) => {
      this.commandHandler!.processCommand(command);
    });
    
    this.terminal!.on('interrupt', () => {
      this.handleInterrupt();
    });
    
    // WebSocket -> Terminal
    this.wsClient.on('connected', () => {
      this.updateConnectionStatus(true, false);
      this.terminal!.writeSuccess('Connected to Claude Code server');
      this.terminal!.setPrompt('claude-flow>');
    });
    
    this.wsClient.on('disconnected', (info: any) => {
      this.updateConnectionStatus(false, false);
      this.terminal!.writeWarning('Disconnected from server');
      this.terminal!.setPrompt('offline>');
      
      if (info && info.code !== 1000) {
        this.terminal!.writeError(`Connection lost: ${info.reason || 'Unknown reason'}`);
      }
    });
    
    this.wsClient.on('reconnecting', (info: any) => {
      this.updateConnectionStatus(false, true);
      this.terminal!.writeInfo(`Reconnecting... (${info.attempt}/5)`);
    });
    
    this.wsClient.on('error', (error: Error) => {
      this.terminal!.writeError(`WebSocket error: ${error.message || 'Unknown error'}`);
    });
    
    this.wsClient.on('message_received', (message: WebSocketMessage) => {
      this.messageCount++;
      this.handleIncomingMessage(message);
    });
    
    this.wsClient.on('notification', (notification: WebSocketNotification) => {
      this.handleNotification(notification);
    });
    
    // Settings -> Application
    this.settings.on('connect_requested', async (config: ConnectionConfig) => {
      await this.connect(config.url, config.token || '');
    });
    
    this.settings.on('disconnect_requested', () => {
      this.disconnect();
    });
    
    this.settings.on('max_lines_changed', (maxLines: number) => {
      this.terminal!.setMaxLines(maxLines);
    });
    
    this.settings.on('setting_changed', ({ key, value }: SettingsChangeEvent) => {
      this.handleSettingChange(key, value);
    });
  }
  
  /**
   * Setup UI event handlers
   */
  private setupUIEventHandlers(): void {
    // Clear console button
    if (this.elements.clearConsole) {
      this.elements.clearConsole.addEventListener('click', () => {
        this.terminal.clear();
      });
    }
    
    // Fullscreen toggle
    if (this.elements.fullscreenToggle) {
      this.elements.fullscreenToggle.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
    
    // Focus input when clicking on output area
    if (this.elements.consoleOutput) {
      this.elements.consoleOutput.addEventListener('click', () => {
        this.terminal.focus();
      });
    }
    
    // Handle window focus
    window.addEventListener('focus', () => {
      this.terminal.focus();
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateTimestamp();
      }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  
  /**
   * Apply initial settings
   */
  private applyInitialSettings(): void {
    const maxLines = this.settings.get('maxLines');
    if (maxLines) {
      this.terminal.setMaxLines(maxLines);
    }
    
    // Update connection status in settings
    this.settings.updateConnectionStatus(this.wsClient.getStatus());
  }
  
  /**
   * Show welcome message
   */
  private showWelcomeMessage(): void {
    this.terminal.showWelcomeMessage();
    this.terminal.writeInfo('Console ready. Type "help" for available commands.');
    
    const config = this.settings.getConnectionConfig();
    if (config.url && !config.autoConnect) {
      this.terminal.writeInfo(`Use "connect" to connect to ${config.url}`);
    }
  }
  
  /**
   * Auto-connect to server
   */
  private async autoConnect(): Promise<void> {
    const config = this.settings.getConnectionConfig();
    
    if (config.url) {
      this.terminal.writeInfo(`Auto-connecting to ${config.url}...`);
      await this.connect(config.url, config.token);
    }
  }
  
  /**
   * Connect to server
   */
  async connect(url: string, token: string = ''): Promise<void> {
    try {
      this.updateConnectionStatus(false, true);
      await this.wsClient.connect(url, token);
      await this.wsClient.initializeSession();
      
      // Update settings with successful connection
      this.settings.set('serverUrl', url);
      if (token) {
        this.settings.set('authToken', token);
      }
      
    } catch (error) {
      this.updateConnectionStatus(false, false);
      this.terminal.writeError(`Connection failed: ${error.message}`);
    }
  }
  
  /**
   * Disconnect from server
   */
  disconnect(): void {
    this.wsClient.disconnect();
    this.updateConnectionStatus(false, false);
  }
  
  /**
   * Update connection status in UI
   */
  private updateConnectionStatus(connected: boolean, connecting: boolean): void {
    const status = this.wsClient.getStatus();
    
    // Update status indicator
    if (this.elements.statusIndicator) {
      this.elements.statusIndicator.className = 'status-indicator ' + 
        (connected ? 'connected' : connecting ? 'connecting' : '');
    }
    
    // Update status text
    if (this.elements.statusText) {
      this.elements.statusText.textContent = 
        connected ? 'Connected' : 
        connecting ? 'Connecting...' : 'Disconnected';
    }
    
    // Update settings panel
    this.settings.updateConnectionStatus(status);
  }
  
  /**
   * Handle incoming messages
   */
  private handleIncomingMessage(message: WebSocketMessage): void {
    // Handle streaming output
    if (message.method === 'output/stream') {
      this.handleStreamingOutput(message.params);
    }
    
    // Handle Claude Flow notifications
    if (message.method && message.method.startsWith('claude-flow/')) {
      this.handleClaudeFlowNotification(message);
    }
  }
  
  /**
   * Handle notifications
   */
  private handleNotification(notification: WebSocketNotification): void {
    const { method, params } = notification;
    
    switch (method) {
      case 'agent/status':
        this.handleAgentStatus(params);
        break;
        
      case 'swarm/update':
        this.handleSwarmUpdate(params);
        break;
        
      case 'memory/update':
        this.handleMemoryUpdate(params);
        break;
        
      case 'log/message':
        this.handleLogMessage(params);
        break;
        
      case 'connection/established':
        this.handleConnectionEstablished(params);
        break;
        
      default:
        console.log('Unhandled notification:', method, params);
    }
  }
  
  /**
   * Handle streaming output
   */
  private handleStreamingOutput(params: StreamingOutput): void {
    if (params && params.content) {
      const type = (params.type || 'output') as OutputType;
      
      if (params.streaming) {
        // Use streaming text effect for long outputs
        this.terminal.streamText(params.content, 10);
      } else {
        this.terminal.write(params.content, type);
      }
    }
  }
  
  /**
   * Handle Claude Flow notifications
   */
  private handleClaudeFlowNotification(message: WebSocketMessage): void {
    const { method, params } = message;
    
    switch (method) {
      case 'claude-flow/started':
        this.terminal.writeSuccess(`Claude Flow started in ${params.mode} mode`);
        break;
        
      case 'claude-flow/stopped':
        this.terminal.writeInfo('Claude Flow stopped');
        break;
        
      case 'claude-flow/error':
        this.terminal.writeError(`Claude Flow error: ${params.message}`);
        break;
        
      default:
        this.terminal.writeInfo(`Claude Flow: ${method} - ${JSON.stringify(params)}`);
    }
  }
  
  /**
   * Handle agent status updates
   */
  private handleAgentStatus(params: AgentStatusUpdate): void {
    if (params.active !== undefined) {
      this.activeAgents = params.active;
    }
    
    if (params.message) {
      this.terminal.writeInfo(`Agent: ${params.message}`);
    }
  }
  
  /**
   * Handle swarm updates
   */
  private handleSwarmUpdate(params: SwarmUpdate): void {
    if (params.message) {
      this.terminal.writeInfo(`Swarm: ${params.message}`);
    }
  }
  
  /**
   * Handle memory updates
   */
  private handleMemoryUpdate(params: MemoryUpdate): void {
    if (params.message) {
      this.terminal.writeInfo(`Memory: ${params.message}`);
    }
  }
  
  /**
   * Handle log messages
   */
  private handleLogMessage(params: LogMessage): void {
    if (params.level && params.message) {
      const type = params.level === 'error' ? 'error' : 
                  params.level === 'warn' ? 'warning' : 'info';
      this.terminal.write(`[${params.level.toUpperCase()}] ${params.message}`, type);
    }
  }

  /**
   * Handle connection established notification
   */
  private handleConnectionEstablished(params: ConnectionEstablished): void {
    // Log connection details without cluttering the terminal
    console.log('Connection established:', params);
    // Optionally show a brief success message
    // this.terminal.writeSuccess(`Connected to ${params.server} v${params.version}`);
  }
  
  /**
   * Handle interrupt (Ctrl+C)
   */
  private handleInterrupt(): void {
    // Could be used to cancel running commands
    this.terminal.writeWarning('Interrupt signal sent');
  }
  
  /**
   * Handle setting changes
   */
  private handleSettingChange(key: string, value: any): void {
    switch (key) {
      case 'theme':
        document.documentElement.setAttribute('data-theme', value);
        break;
        
      case 'fontSize':
        document.documentElement.style.setProperty('--font-size-base', `${value}px`);
        break;
        
      case 'lineHeight':
        document.documentElement.style.setProperty('--line-height', value);
        break;
    }
  }
  
  /**
   * Start status updates
   */
  private startStatusUpdates(): void {
    // Update status every 5 seconds
    this.statusInterval = setInterval(() => {
      this.updateStatus();
    }, 5000);
    
    // Update timestamp every second
    this.uptimeInterval = setInterval(() => {
      this.updateUptime();
      this.updateTimestamp();
    }, 1000);
    
    // Initial update
    this.updateStatus();
    this.updateUptime();
    this.updateTimestamp();
  }
  
  /**
   * Update status bar
   */
  private updateStatus(): void {
    // Update active agents
    if (this.elements.activeAgents) {
      this.elements.activeAgents.textContent = `Agents: ${this.activeAgents}`;
    }
    
    // Update message count
    if (this.elements.messageCount) {
      this.elements.messageCount.textContent = `Messages: ${this.messageCount}`;
    }
    
    // Update memory usage (if available)
    if (this.elements.memoryUsage && performance.memory) {
      const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      this.elements.memoryUsage.textContent = `Memory: ${used}MB`;
    }
  }
  
  /**
   * Update uptime
   */
  private updateUptime(): void {
    if (this.elements.uptime) {
      const uptime = Date.now() - this.startTime;
      const hours = Math.floor(uptime / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
      
      this.elements.uptime.textContent = 
        `Uptime: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  /**
   * Update timestamp
   */
  private updateTimestamp(): void {
    if (this.elements.timestamp) {
      this.elements.timestamp.textContent = new Date().toLocaleTimeString();
    }
  }
  
  /**
   * Toggle fullscreen mode
   */
  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  /**
   * Show loading overlay
   */
  private showLoading(message: string = 'Loading...'): void {
    if (this.elements.loadingOverlay) {
      const loadingText = this.elements.loadingOverlay.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = message;
      }
      this.elements.loadingOverlay.classList.remove('hidden');
    }
  }
  
  /**
   * Hide loading overlay
   */
  private hideLoading(): void {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.add('hidden');
    }
  }
  
  /**
   * Show error message
   */
  private showError(message: string): void {
    this.hideLoading();
    
    if (this.terminal) {
      this.terminal.writeError(message);
    } else {
      // Fallback if terminal isn't initialized
      console.error(message);
      alert(message);
    }
  }
  
  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      if (this.terminal) {
        this.terminal.writeError(`Unhandled error: ${event.reason.message || event.reason}`);
      }
    });
    
    // Handle errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      if (this.terminal) {
        this.terminal.writeError(`Application error: ${event.error.message || event.error}`);
      }
    });
  }
  
  /**
   * Cleanup on shutdown
   */
  private cleanup(): void {
    // Clear intervals
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    
    if (this.uptimeInterval) {
      clearInterval(this.uptimeInterval);
    }
    
    // Disconnect WebSocket
    if (this.wsClient) {
      this.wsClient.disconnect();
    }
  }
  
  /**
   * Get console statistics
   */
  getStats(): ConsoleStats {
    return {
      initialized: this.isInitialized,
      uptime: Date.now() - this.startTime,
      messageCount: this.messageCount,
      activeAgents: this.activeAgents,
      connection: this.wsClient.getStatus(),
      terminal: this.terminal ? this.terminal.getStats() : null
    };
  }
}

// Initialize the console when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const console = new ClaudeCodeConsole();
  
  // Make console globally available for debugging
  (window as any).claudeConsole = console;
  
  // Initialize the application
  await console.init();
});

// Export for module usage
export { ClaudeCodeConsole };