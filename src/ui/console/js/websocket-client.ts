/**
 * WebSocket Client for Claude Code Console
 * Handles real-time communication with the backend MCP server
 */

import type {
  WebSocketStatus,
  WebSocketMessage,
  WebSocketError,
  WebSocketNotification,
  ConnectionInfo,
  ReconnectionInfo,
  IWebSocketClient,
  CommandResult,
  Tool,
  HealthStatus,
  InitializeParams,
  EventCallback,
  ConsoleEventType
} from './types.js';

interface RequestHandler {
  resolve: (value: any) => void;
  reject: (reason: Error) => void;
}

export class WebSocketClient implements IWebSocketClient {
  private ws: WebSocket | null;
  private url: string;
  private authToken: string;
  public isConnected: boolean;
  private isConnecting: boolean;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private messageQueue: WebSocketMessage[];
  private requestHandlers: Map<number | string, RequestHandler>;
  private eventListeners: Map<string, EventCallback[]>;
  private messageId: number;
  
  // Heartbeat configuration
  private heartbeatInterval: number;
  private heartbeatTimer: ReturnType<typeof setInterval> | null;
  private lastPongReceived: number;
  private connectionTimeout: number;
  
  constructor() {
    this.ws = null;
    this.url = '';
    this.authToken = '';
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.messageQueue = [];
    this.requestHandlers = new Map();
    this.eventListeners = new Map();
    this.messageId = 1;
    
    // Heartbeat configuration
    this.heartbeatInterval = 30000; // 30 seconds
    this.heartbeatTimer = null;
    this.lastPongReceived = Date.now();
    this.connectionTimeout = 10000; // 10 seconds
    
    this.setupEventListeners();
  }
  
  /**
   * Connect to WebSocket server
   */
  async connect(url: string, authToken: string = ''): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      console.warn('Already connected or connecting');
      return;
    }
    
    this.url = url;
    this.authToken = authToken;
    this.isConnecting = true;
    
    try {
      await this.establishConnection();
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }
  
  /**
   * Establish WebSocket connection
   */
  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create WebSocket connection
        this.ws = new WebSocket(this.url);
        
        // Set up connection timeout
        const connectionTimer = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            this.ws.close();
            this.isConnecting = false;
            reject(new Error('Connection timeout'));
          }
        }, this.connectionTimeout);
        
        this.ws.onopen = () => {
          clearTimeout(connectionTimer);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.lastPongReceived = Date.now();
          
          this.emit('connected');
          this.startHeartbeat();
          this.processMessageQueue();
          
          console.log('WebSocket connected to:', this.url);
          resolve();
        };
        
        this.ws.onclose = (event: CloseEvent) => {
          clearTimeout(connectionTimer);
          this.handleDisconnection(event);
        };
        
        this.ws.onerror = (error: Event) => {
          clearTimeout(connectionTimer);
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          
          if (!this.isConnected) {
            reject(error);
          }
        };
        
        this.ws.onmessage = (event: MessageEvent) => {
          this.handleMessage(event);
        };
        
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }
  
  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.stopHeartbeat();
      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.requestHandlers.clear();
    
    this.emit('disconnected');
  }
  
  /**
   * Send a request and wait for response
   */
  async sendRequest(method: string, params: any = {}): Promise<any> {
    const id = this.generateMessageId();
    const request: WebSocketMessage = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    return new Promise((resolve, reject) => {
      // Store request handler
      this.requestHandlers.set(id, { resolve, reject });
      
      // Send request
      this.sendMessage(request);
      
      // Set timeout for request
      setTimeout(() => {
        if (this.requestHandlers.has(id)) {
          this.requestHandlers.delete(id);
          reject(new Error(`Request timeout for method: ${method}`));
        }
      }, 30000); // 30 second timeout
    });
  }
  
  /**
   * Send a notification (no response expected)
   */
  sendNotification(method: string, params: any = {}): void {
    const notification: WebSocketMessage = {
      jsonrpc: '2.0',
      method,
      params
    };
    
    this.sendMessage(notification);
  }
  
  /**
   * Send raw message
   */
  private sendMessage(message: WebSocketMessage): void {
    if (!this.isConnected) {
      // Queue message for later
      this.messageQueue.push(message);
      this.emit('message_queued', message);
      return;
    }
    
    try {
      const messageStr = JSON.stringify(message);
      this.ws!.send(messageStr);
      this.emit('message_sent', message);
    } catch (error) {
      console.error('Failed to send message:', error);
      this.emit('send_error', error);
    }
  }
  
  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle pong response
      if (message.method === 'pong') {
        this.lastPongReceived = Date.now();
        return;
      }
      
      // Handle responses to requests
      if (message.id !== undefined && this.requestHandlers.has(message.id)) {
        const handler = this.requestHandlers.get(message.id)!;
        this.requestHandlers.delete(message.id);
        
        if (message.error) {
          handler.reject(new Error(message.error.message || 'Request failed'));
        } else {
          handler.resolve(message.result);
        }
        return;
      }
      
      // Handle notifications and other messages
      if (message.method) {
        this.emit('notification', message);
        this.emit(`notification_${message.method}`, message.params);
      }
      
      this.emit('message_received', message);
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      this.emit('parse_error', error);
    }
  }
  
  /**
   * Handle disconnection
   */
  private handleDisconnection(event: CloseEvent): void {
    const wasConnected = this.isConnected;
    this.isConnected = false;
    this.isConnecting = false;
    this.stopHeartbeat();
    
    console.log('WebSocket disconnected:', event.code, event.reason);
    
    if (wasConnected) {
      const connectionInfo: ConnectionInfo = { 
        code: event.code, 
        reason: event.reason 
      };
      this.emit('disconnected', connectionInfo);
      
      // Attempt reconnection if not a clean close
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnection();
      }
    }
  }
  
  /**
   * Attempt to reconnect
   */
  private async attemptReconnection(): Promise<void> {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    const reconnectInfo: ReconnectionInfo = { 
      attempt: this.reconnectAttempts, 
      delay 
    };
    this.emit('reconnecting', reconnectInfo);
    
    setTimeout(async () => {
      try {
        await this.establishConnection();
      } catch (error) {
        console.error('Reconnection failed:', error);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.emit('reconnection_failed');
        } else {
          this.attemptReconnection();
        }
      }
    }, delay);
  }
  
  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        // Check if we received a recent pong
        const timeSinceLastPong = Date.now() - this.lastPongReceived;
        
        if (timeSinceLastPong > this.heartbeatInterval * 2) {
          console.warn('Heartbeat timeout - connection may be dead');
          this.ws!.close(1006, 'Heartbeat timeout');
          return;
        }
        
        // Send ping
        this.sendNotification('ping', { timestamp: Date.now() });
      }
    }, this.heartbeatInterval);
  }
  
  /**
   * Stop heartbeat mechanism
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  
  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift()!;
      this.sendMessage(message);
    }
  }
  
  /**
   * Generate unique message ID
   */
  private generateMessageId(): number {
    return this.messageId++;
  }
  
  /**
   * Set up internal event listeners
   */
  private setupEventListeners(): void {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden - reduce heartbeat frequency
        this.heartbeatInterval = 60000; // 1 minute
      } else {
        // Page is visible - restore normal heartbeat
        this.heartbeatInterval = 30000; // 30 seconds
        if (this.isConnected) {
          this.startHeartbeat();
        }
      }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      if (this.isConnected) {
        this.disconnect();
      }
    });
  }
  
  /**
   * Add event listener
   */
  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }
  
  /**
   * Remove event listener
   */
  off(event: string, callback: EventCallback): void {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  /**
   * Emit event
   */
  private emit(event: string, data: any = null): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }
  
  /**
   * Get connection status
   */
  getStatus(): WebSocketStatus {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      url: this.url,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length,
      pendingRequests: this.requestHandlers.size
    };
  }
  
  /**
   * Initialize Claude Code session
   */
  async initializeSession(clientInfo: any = {}): Promise<any> {
    const params: InitializeParams = {
      protocolVersion: { major: 2024, minor: 11, patch: 5 },
      clientInfo: {
        name: 'Claude Flow v2',
        version: '2.0.0',
        ...clientInfo
      },
      capabilities: {
        logging: { level: 'info' },
        tools: { listChanged: true },
        resources: { listChanged: false, subscribe: false },
        prompts: { listChanged: false }
      }
    };
    
    try {
      const result = await this.sendRequest('initialize', params);
      this.emit('session_initialized', result);
      return result;
    } catch (error) {
      this.emit('session_error', error);
      throw error;
    }
  }
  
  /**
   * Execute Claude Flow command
   */
  async executeCommand(command: string, args: any = {}): Promise<CommandResult> {
    try {
      const result = await this.sendRequest('tools/call', {
        name: 'claude-flow/execute',
        arguments: { command, args }
      });
      
      return result;
    } catch (error) {
      console.error('Command execution failed:', error);
      throw error;
    }
  }
  
  /**
   * Get available tools
   */
  async getAvailableTools(): Promise<Tool[]> {
    try {
      const result = await this.sendRequest('tools/list');
      // The server returns { tools: [...] }, so we need to extract the tools array
      return result && result.tools ? result.tools : [];
    } catch (error) {
      console.error('Failed to get tools:', error);
      return []; // Return empty array on error instead of throwing
    }
  }
  
  /**
   * Get server health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    try {
      return await this.sendRequest('tools/call', {
        name: 'system/health'
      });
    } catch (error) {
      console.error('Failed to get health status:', error);
      throw error;
    }
  }
}