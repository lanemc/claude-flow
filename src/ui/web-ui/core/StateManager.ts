/**
 * StateManager - Global state persistence and management
 * Handles UI state, user preferences, and data persistence
 */

import { EventBus } from './EventBus.js';
import {
  StateData,
  ViewState,
  ToolResult,
  StateStats,
  PreferenceKeys
} from '../types/interfaces.js';

export class StateManager {
  private eventBus: EventBus;
  private state: Map<string, any>;
  private preferences: Map<string, any>;
  private toolResults: Map<string, ToolResult>;
  private viewStates: Map<string, ViewState>;
  private sessionData: Map<string, any>;
  private storageKey: string;
  private isInitialized: boolean;
  private autoSaveInterval: number;
  private autoSaveTimer: NodeJS.Timeout | null;
  private saveTimeout: NodeJS.Timeout | null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.state = new Map();
    this.preferences = new Map();
    this.toolResults = new Map();
    this.viewStates = new Map();
    this.sessionData = new Map();
    this.storageKey = 'claude-flow-ui-state';
    this.isInitialized = false;
    this.autoSaveInterval = 30000; // 30 seconds
    this.autoSaveTimer = null;
    this.saveTimeout = null;
  }

  /**
   * Initialize state manager
   */
  async initialize(): Promise<void> {
    try {
      // Load persisted state
      await this.loadPersistedState();
      
      // Setup auto-save
      this.setupAutoSave();
      
      // Setup event handlers
      this.setupEventHandlers();
      
      this.isInitialized = true;
      this.eventBus.emit('state-manager:initialized');
      
      console.log('💾 State Manager initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize State Manager:', error);
      throw error;
    }
  }

  /**
   * Load persisted state from storage
   */
  private async loadPersistedState(): Promise<void> {
    try {
      let persistedData: StateData | null = null;

      // Try to load from localStorage in browser
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          persistedData = JSON.parse(stored);
        }
      }

      // Try to load from file system in Node.js
      if (!persistedData && typeof process !== 'undefined') {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const stateFile = path.join(process.cwd(), '.claude-flow-state.json');
          
          if (fs.existsSync(stateFile)) {
            const data = fs.readFileSync(stateFile, 'utf8');
            persistedData = JSON.parse(data);
          }
        } catch (error: any) {
          console.warn('Could not load state from file system:', error.message);
        }
      }

      if (persistedData) {
        this.restoreFromData(persistedData);
        console.log('💾 Loaded persisted state');
      } else {
        this.initializeDefaultState();
      }

    } catch (error) {
      console.warn('Could not load persisted state:', error);
      this.initializeDefaultState();
    }
  }

  /**
   * Restore state from persisted data
   */
  private restoreFromData(data: StateData): void {
    if (data.preferences) {
      this.preferences = new Map(Object.entries(data.preferences));
    }
    
    if (data.viewStates) {
      this.viewStates = new Map(Object.entries(data.viewStates));
    }
    
    if (data.toolResults) {
      this.toolResults = new Map(Object.entries(data.toolResults));
    }
    
    if (data.sessionData) {
      this.sessionData = new Map(Object.entries(data.sessionData));
    }
    
    if (data.state) {
      this.state = new Map(Object.entries(data.state));
    }
  }

  /**
   * Initialize default state
   */
  private initializeDefaultState(): void {
    this.preferences.set('theme', 'dark');
    this.preferences.set('autoSave', true);
    this.preferences.set('showTooltips', true);
    this.preferences.set('animationSpeed', 'normal');
    this.preferences.set('defaultView', 'overview');
    this.preferences.set('keyboardShortcuts', true);
    this.preferences.set('realTimeUpdates', true);
    this.preferences.set('logLevel', 'info');
    
    this.state.set('initialized', true);
    this.state.set('version', '2.0.0');
    this.state.set('installDate', Date.now());
    
    console.log('💾 Initialized default state');
  }

  /**
   * Setup auto-save functionality
   */
  private setupAutoSave(): void {
    if (!this.getPreference('autoSave', true)) {
      return;
    }

    this.autoSaveTimer = setInterval(() => {
      this.persistState();
    }, this.autoSaveInterval);
  }

  /**
   * Persist current state
   */
  async persistState(): Promise<void> {
    try {
      const stateData: StateData = {
        timestamp: Date.now(),
        version: '2.0.0',
        preferences: Object.fromEntries(this.preferences),
        viewStates: Object.fromEntries(this.viewStates),
        toolResults: Object.fromEntries(this.toolResults),
        sessionData: Object.fromEntries(this.sessionData),
        state: Object.fromEntries(this.state)
      };

      // Save to localStorage in browser
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(stateData));
      }

      // Save to file system in Node.js
      if (typeof process !== 'undefined') {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const stateFile = path.join(process.cwd(), '.claude-flow-state.json');
          
          fs.writeFileSync(stateFile, JSON.stringify(stateData, null, 2));
        } catch (error: any) {
          console.warn('Could not save state to file system:', error.message);
        }
      }

      this.eventBus.emit('state:persisted', { timestamp: Date.now() });

    } catch (error: any) {
      console.error('Failed to persist state:', error);
      this.eventBus.emit('state:error', { error: error.message });
    }
  }

  /**
   * Get preference value
   */
  getPreference<K extends keyof PreferenceKeys>(key: K): PreferenceKeys[K];
  getPreference<T = any>(key: string, defaultValue?: T): T;
  getPreference(key: string, defaultValue: any = null): any {
    return this.preferences.get(key) ?? defaultValue;
  }

  /**
   * Set preference value
   */
  setPreference<K extends keyof PreferenceKeys>(key: K, value: PreferenceKeys[K]): void;
  setPreference(key: string, value: any): void;
  setPreference(key: string, value: any): void {
    this.preferences.set(key, value);
    this.eventBus.emit('preference:changed', { key, value });
    
    // Auto-save if enabled
    if (this.getPreference('autoSave', true)) {
      this.debouncedSave();
    }
  }

  /**
   * Get multiple preferences
   */
  getPreferences<K extends keyof PreferenceKeys>(keys: K[]): Pick<PreferenceKeys, K>;
  getPreferences(keys: string[]): Record<string, any>;
  getPreferences(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key of keys) {
      result[key] = this.preferences.get(key);
    }
    return result;
  }

  /**
   * Set multiple preferences
   */
  setPreferences(preferences: Partial<PreferenceKeys>): void;
  setPreferences(preferences: Record<string, any>): void;
  setPreferences(preferences: Record<string, any>): void {
    for (const [key, value] of Object.entries(preferences)) {
      this.preferences.set(key, value);
    }
    
    this.eventBus.emit('preferences:changed', preferences);
    
    if (this.getPreference('autoSave', true)) {
      this.debouncedSave();
    }
  }

  /**
   * Get all user preferences
   */
  getUserPreferences(): Record<string, any> {
    return Object.fromEntries(this.preferences);
  }

  /**
   * Get state value
   */
  getState<T = any>(key: string, defaultValue: T | null = null): T | null {
    return this.state.get(key) ?? defaultValue;
  }

  /**
   * Set state value
   */
  setState(key: string, value: any): void {
    this.state.set(key, value);
    this.eventBus.emit('state:changed', { key, value });
    
    if (this.getPreference('autoSave', true)) {
      this.debouncedSave();
    }
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
    const existing = this.viewStates.get(viewId) || {};
    const newState: ViewState = { ...existing, ...state, lastUpdate: Date.now() };
    
    this.viewStates.set(viewId, newState);
    this.eventBus.emit('view-state:changed', { viewId, state: newState });
    
    if (this.getPreference('autoSave', true)) {
      this.debouncedSave();
    }
  }

  /**
   * Clear view state
   */
  clearViewState(viewId: string): void {
    this.viewStates.delete(viewId);
    this.eventBus.emit('view-state:cleared', { viewId });
  }

  /**
   * Get tool result
   */
  getToolResult(toolName: string): ToolResult | undefined {
    return this.toolResults.get(toolName);
  }

  /**
   * Set tool result
   */
  setToolResult(toolName: string, result: any): void {
    const resultData: ToolResult = {
      result,
      timestamp: Date.now(),
      tool: toolName
    };
    
    this.toolResults.set(toolName, resultData);
    this.eventBus.emit('tool-result:stored', { toolName, result });
    
    // Keep only last 100 results to manage memory
    if (this.toolResults.size > 100) {
      const entries = Array.from(this.toolResults.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      
      this.toolResults.clear();
      for (const [key, value] of entries.slice(0, 100)) {
        this.toolResults.set(key, value);
      }
    }
    
    if (this.getPreference('autoSave', true)) {
      this.debouncedSave();
    }
  }

  /**
   * Get recent tool results
   */
  getRecentToolResults(limit: number = 10): Array<{ tool: string } & ToolResult> {
    const results = Array.from(this.toolResults.entries())
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, limit);
    
    return results.map(([tool, data]) => ({
      tool,
      ...data
    }));
  }

  /**
   * Get session data
   */
  getSessionData<T = any>(key: string): T | undefined {
    return this.sessionData.get(key);
  }

  /**
   * Set session data
   */
  setSessionData(key: string, value: any): void {
    this.sessionData.set(key, value);
    this.eventBus.emit('session-data:changed', { key, value });
  }

  /**
   * Clear session data
   */
  clearSessionData(): void {
    this.sessionData.clear();
    this.eventBus.emit('session-data:cleared');
  }

  /**
   * Export state data
   */
  exportState(): StateData {
    return {
      timestamp: Date.now(),
      version: '2.0.0',
      preferences: Object.fromEntries(this.preferences),
      viewStates: Object.fromEntries(this.viewStates),
      toolResults: Object.fromEntries(this.toolResults),
      sessionData: Object.fromEntries(this.sessionData),
      state: Object.fromEntries(this.state)
    };
  }

  /**
   * Import state data
   */
  importState(stateData: StateData): void {
    try {
      this.restoreFromData(stateData);
      this.eventBus.emit('state:imported', { timestamp: Date.now() });
      console.log('💾 State imported successfully');
    } catch (error) {
      console.error('Failed to import state:', error);
      throw error;
    }
  }

  /**
   * Reset to default state
   */
  resetState(): void {
    this.state.clear();
    this.preferences.clear();
    this.viewStates.clear();
    this.toolResults.clear();
    this.sessionData.clear();
    
    this.initializeDefaultState();
    this.persistState();
    
    this.eventBus.emit('state:reset', { timestamp: Date.now() });
    console.log('💾 State reset to defaults');
  }

  /**
   * Clear specific data types
   */
  clearData(types: Array<'preferences' | 'viewStates' | 'toolResults' | 'sessionData'> = []): void {
    if (types.includes('preferences') || types.length === 0) {
      this.preferences.clear();
    }
    
    if (types.includes('viewStates') || types.length === 0) {
      this.viewStates.clear();
    }
    
    if (types.includes('toolResults') || types.length === 0) {
      this.toolResults.clear();
    }
    
    if (types.includes('sessionData') || types.length === 0) {
      this.sessionData.clear();
    }
    
    this.eventBus.emit('data:cleared', { types, timestamp: Date.now() });
  }

  /**
   * Get state statistics
   */
  getStateStats(): StateStats {
    return {
      preferences: this.preferences.size,
      viewStates: this.viewStates.size,
      toolResults: this.toolResults.size,
      sessionData: this.sessionData.size,
      generalState: this.state.size,
      lastSave: this.state.get('lastSave'),
      autoSaveEnabled: this.getPreference('autoSave', true)
    };
  }

  /**
   * Setup debounced save to avoid excessive writes
   */
  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.persistState();
    }, 1000); // Save after 1 second of inactivity
  }

  /**
   * Persist all state immediately
   */
  async persistAllState(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    await this.persistState();
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Listen for shutdown events
    this.eventBus.on('ui:shutdown', async () => {
      await this.persistAllState();
    });
    
    // Listen for preference changes from UI
    this.eventBus.on('ui:preference:set', (data: { key: string; value: any }) => {
      this.setPreference(data.key, data.value);
    });
    
    // Listen for state changes from UI
    this.eventBus.on('ui:state:set', (data: { key: string; value: any }) => {
      this.setState(data.key, data.value);
    });
    
    // Listen for tool results
    this.eventBus.on('tool:executed', (data: { tool: string; result: any }) => {
      this.setToolResult(data.tool, data.result);
    });
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    // Clear auto-save timer
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Final save
    await this.persistAllState();
    
    this.eventBus.emit('state-manager:shutdown');
  }
}

export default StateManager;