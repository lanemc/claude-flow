/**
 * EventBus - Central event communication system for the Web UI
 * Enables loose coupling between components and real-time updates
 */

import {
  EventInfo,
  HandlerInfo,
  EventBusStats
} from '../types/interfaces.js';

export type EventHandler = (data: any, eventInfo?: EventInfo) => void | Promise<void>;

export class EventBus {
  private events: Map<string, HandlerInfo[]>;
  private onceEvents: Map<string, HandlerInfo[]>;
  private wildcardHandlers: Map<string, HandlerInfo[]>;
  private eventHistory: EventInfo[];
  private maxHistorySize: number;
  private isLogging: boolean;

  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
    this.wildcardHandlers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000;
    this.isLogging = true;
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: EventHandler, context: any = null): () => void {
    if (typeof handler !== 'function') {
      throw new Error('Event handler must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const handlerInfo: HandlerInfo = {
      handler,
      context,
      id: this.generateHandlerId()
    };

    const handlers = this.events.get(event);
    if (handlers) {
      handlers.push(handlerInfo);
    }

    if (this.isLogging) {
      console.debug(`📡 EventBus: Subscribed to '${event}'`);
    }

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  /**
   * Subscribe to an event (once only)
   */
  once(event: string, handler: EventHandler, context: any = null): () => void {
    if (typeof handler !== 'function') {
      throw new Error('Event handler must be a function');
    }

    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }

    const handlerInfo: HandlerInfo = {
      handler,
      context,
      id: this.generateHandlerId()
    };

    const handlers = this.onceEvents.get(event);
    if (handlers) {
      handlers.push(handlerInfo);
    }

    if (this.isLogging) {
      console.debug(`📡 EventBus: Subscribed once to '${event}'`);
    }

    // Return unsubscribe function
    return () => this.offOnce(event, handler);
  }

  /**
   * Subscribe to events with wildcard patterns
   */
  onWildcard(pattern: string, handler: EventHandler, context: any = null): () => void {
    if (typeof handler !== 'function') {
      throw new Error('Event handler must be a function');
    }

    if (!this.wildcardHandlers.has(pattern)) {
      this.wildcardHandlers.set(pattern, []);
    }

    const handlerInfo: HandlerInfo = {
      handler,
      context,
      id: this.generateHandlerId(),
      regex: this.createWildcardRegex(pattern)
    };

    const handlers = this.wildcardHandlers.get(pattern);
    if (handlers) {
      handlers.push(handlerInfo);
    }

    if (this.isLogging) {
      console.debug(`📡 EventBus: Subscribed to wildcard pattern '${pattern}'`);
    }

    // Return unsubscribe function
    return () => this.offWildcard(pattern, handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): boolean {
    const handlers = this.events.get(event);
    if (!handlers) return false;

    const index = handlers.findIndex(h => h.handler === handler);
    if (index === -1) return false;

    handlers.splice(index, 1);

    if (handlers.length === 0) {
      this.events.delete(event);
    }

    if (this.isLogging) {
      console.debug(`📡 EventBus: Unsubscribed from '${event}'`);
    }

    return true;
  }

  /**
   * Unsubscribe from a once event
   */
  private offOnce(event: string, handler: EventHandler): boolean {
    const handlers = this.onceEvents.get(event);
    if (!handlers) return false;

    const index = handlers.findIndex(h => h.handler === handler);
    if (index === -1) return false;

    handlers.splice(index, 1);

    if (handlers.length === 0) {
      this.onceEvents.delete(event);
    }

    return true;
  }

  /**
   * Unsubscribe from wildcard pattern
   */
  private offWildcard(pattern: string, handler: EventHandler): boolean {
    const handlers = this.wildcardHandlers.get(pattern);
    if (!handlers) return false;

    const index = handlers.findIndex(h => h.handler === handler);
    if (index === -1) return false;

    handlers.splice(index, 1);

    if (handlers.length === 0) {
      this.wildcardHandlers.delete(pattern);
    }

    return true;
  }

  /**
   * Emit an event
   */
  emit(event: string, data: any = null): number {
    const eventInfo: EventInfo = {
      event,
      data,
      timestamp: Date.now(),
      id: this.generateEventId()
    };

    // Add to history
    this.addToHistory(eventInfo);

    if (this.isLogging) {
      console.debug(`📡 EventBus: Emitting '${event}'`, data);
    }

    let handlersExecuted = 0;

    // Execute regular event handlers
    const handlers = this.events.get(event);
    if (handlers) {
      for (const handlerInfo of [...handlers]) {
        try {
          if (handlerInfo.context) {
            handlerInfo.handler.call(handlerInfo.context, data, eventInfo);
          } else {
            handlerInfo.handler(data, eventInfo);
          }
          handlersExecuted++;
        } catch (error) {
          console.error(`📡 EventBus: Error in handler for '${event}':`, error);
          this.emit('error', { event, error, handlerInfo });
        }
      }
    }

    // Execute once event handlers
    const onceHandlers = this.onceEvents.get(event);
    if (onceHandlers) {
      for (const handlerInfo of [...onceHandlers]) {
        try {
          if (handlerInfo.context) {
            handlerInfo.handler.call(handlerInfo.context, data, eventInfo);
          } else {
            handlerInfo.handler(data, eventInfo);
          }
          handlersExecuted++;
        } catch (error) {
          console.error(`📡 EventBus: Error in once handler for '${event}':`, error);
          this.emit('error', { event, error, handlerInfo });
        }
      }
      // Clear once handlers after execution
      this.onceEvents.delete(event);
    }

    // Execute wildcard handlers
    for (const [pattern, handlers] of Array.from(this.wildcardHandlers)) {
      for (const handlerInfo of handlers) {
        if (handlerInfo.regex && handlerInfo.regex.test(event)) {
          try {
            if (handlerInfo.context) {
              handlerInfo.handler.call(handlerInfo.context, data, eventInfo);
            } else {
              handlerInfo.handler(data, eventInfo);
            }
            handlersExecuted++;
          } catch (error) {
            console.error(`📡 EventBus: Error in wildcard handler for '${pattern}':`, error);
            this.emit('error', { event, error, handlerInfo, pattern });
          }
        }
      }
    }

    return handlersExecuted;
  }

  /**
   * Emit event asynchronously
   */
  async emitAsync(event: string, data: any = null): Promise<number> {
    const eventInfo: EventInfo = {
      event,
      data,
      timestamp: Date.now(),
      id: this.generateEventId()
    };

    // Add to history
    this.addToHistory(eventInfo);

    if (this.isLogging) {
      console.debug(`📡 EventBus: Emitting async '${event}'`, data);
    }

    const promises: Promise<any>[] = [];

    // Execute regular event handlers
    const handlers = this.events.get(event);
    if (handlers) {
      for (const handlerInfo of [...handlers]) {
        const promise = this.executeHandlerAsync(handlerInfo, data, eventInfo);
        promises.push(promise);
      }
    }

    // Execute once event handlers
    const onceHandlers = this.onceEvents.get(event);
    if (onceHandlers) {
      for (const handlerInfo of [...onceHandlers]) {
        const promise = this.executeHandlerAsync(handlerInfo, data, eventInfo);
        promises.push(promise);
      }
      // Clear once handlers after execution
      this.onceEvents.delete(event);
    }

    // Execute wildcard handlers
    for (const [pattern, handlers] of Array.from(this.wildcardHandlers)) {
      for (const handlerInfo of handlers) {
        if (handlerInfo.regex && handlerInfo.regex.test(event)) {
          const promise = this.executeHandlerAsync(handlerInfo, data, eventInfo);
          promises.push(promise);
        }
      }
    }

    const results = await Promise.allSettled(promises);
    
    // Handle any rejections
    const failures = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
    if (failures.length > 0) {
      console.error(`📡 EventBus: ${failures.length} handlers failed for '${event}'`);
      failures.forEach(failure => {
        this.emit('error', { event, error: failure.reason });
      });
    }

    return results.length;
  }

  /**
   * Execute handler asynchronously
   */
  private async executeHandlerAsync(handlerInfo: HandlerInfo, data: any, eventInfo: EventInfo): Promise<any> {
    try {
      let result: any;
      if (handlerInfo.context) {
        result = handlerInfo.handler.call(handlerInfo.context, data, eventInfo);
      } else {
        result = handlerInfo.handler(data, eventInfo);
      }

      // If handler returns a promise, await it
      if (result && typeof result.then === 'function') {
        return await result;
      }

      return result;
    } catch (error) {
      console.error(`📡 EventBus: Error in async handler:`, error);
      throw error;
    }
  }

  /**
   * Wait for an event to be emitted
   */
  waitFor(event: string, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;

      const unsubscribe = this.once(event, (data) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(data);
      });

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          unsubscribe();
          reject(new Error(`Timeout waiting for event '${event}' after ${timeout}ms`));
        }, timeout);
      }
    });
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(event: string | null = null): void {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
      
      // Remove matching wildcard handlers
      for (const [pattern, handlers] of Array.from(this.wildcardHandlers)) {
        if (pattern === event) {
          this.wildcardHandlers.delete(pattern);
        }
      }
    } else {
      this.events.clear();
      this.onceEvents.clear();
      this.wildcardHandlers.clear();
    }

    if (this.isLogging) {
      console.debug(`📡 EventBus: Removed all listeners${event ? ` for '${event}'` : ''}`);
    }
  }

  /**
   * Get event listeners count
   */
  listenerCount(event: string): number {
    const regular = this.events.get(event)?.length || 0;
    const once = this.onceEvents.get(event)?.length || 0;
    
    let wildcard = 0;
    for (const [pattern, handlers] of Array.from(this.wildcardHandlers)) {
      const regex = this.createWildcardRegex(pattern);
      if (regex.test(event)) {
        wildcard += handlers.length;
      }
    }

    return regular + once + wildcard;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    const names = new Set<string>();
    
    for (const event of Array.from(this.events.keys())) {
      names.add(event);
    }
    
    for (const event of Array.from(this.onceEvents.keys())) {
      names.add(event);
    }
    
    return Array.from(names);
  }

  /**
   * Get event history
   */
  getEventHistory(limit: number = 100): EventInfo[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get events by pattern
   */
  getEventsByPattern(pattern: string, limit: number = 100): EventInfo[] {
    const regex = this.createWildcardRegex(pattern);
    return this.eventHistory
      .filter(event => regex.test(event.event))
      .slice(-limit);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Enable/disable logging
   */
  setLogging(enabled: boolean): void {
    this.isLogging = enabled;
  }

  /**
   * Create wildcard regex
   */
  private createWildcardRegex(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    return new RegExp(`^${escaped}$`);
  }

  /**
   * Generate unique handler ID
   */
  private generateHandlerId(): string {
    return `handler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add event to history
   */
  private addToHistory(eventInfo: EventInfo): void {
    this.eventHistory.push(eventInfo);
    
    // Keep history size under control
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get statistics
   */
  getStats(): EventBusStats {
    return {
      regularEvents: this.events.size,
      onceEvents: this.onceEvents.size,
      wildcardPatterns: this.wildcardHandlers.size,
      historySize: this.eventHistory.length,
      totalHandlers: Array.from(this.events.values()).reduce((sum, handlers) => sum + handlers.length, 0) +
                    Array.from(this.onceEvents.values()).reduce((sum, handlers) => sum + handlers.length, 0) +
                    Array.from(this.wildcardHandlers.values()).reduce((sum, handlers) => sum + handlers.length, 0)
    };
  }

  /**
   * Debug information
   */
  debug(): void {
    const stats = this.getStats();
    console.group('📡 EventBus Debug Info');
    console.log('Statistics:', stats);
    console.log('Regular Events:', Array.from(this.events.keys()));
    console.log('Once Events:', Array.from(this.onceEvents.keys()));
    console.log('Wildcard Patterns:', Array.from(this.wildcardHandlers.keys()));
    console.log('Recent History:', this.getEventHistory(10));
    console.groupEnd();
  }
}

export default EventBus;