/**
 * Terminal Emulator for Claude Code Console
 * Provides terminal-like behavior and output formatting
 */

import type {
  OutputType,
  TerminalStats,
  TerminalEntry,
  AnsiColorMap,
  EventCallback,
  ITerminalEmulator
} from './types.js';

export class TerminalEmulator implements ITerminalEmulator {
  private outputElement: HTMLElement;
  private inputElement: HTMLInputElement;
  public history: string[];
  private historyIndex: number;
  private maxHistorySize: number;
  private maxOutputLines: number;
  private currentPrompt: string;
  private isLocked: boolean;
  private commands: string[];
  private ansiColors: AnsiColorMap;
  private eventListeners: Map<string, EventCallback[]>;
  private isUserScrolling?: () => boolean;
  public resumeAutoScroll!: () => void;

  constructor(outputElement: HTMLElement, inputElement: HTMLInputElement) {
    this.outputElement = outputElement;
    this.inputElement = inputElement;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 1000;
    this.maxOutputLines = 1000;
    this.currentPrompt = 'claude-flow>';
    this.isLocked = false;
    this.eventListeners = new Map();
    
    // Command suggestions
    this.commands = [
      'help', 'clear', 'status', 'connect', 'disconnect',
      'claude-flow', 'swarm', 'init', 'config', 'memory',
      'tools', 'agents', 'benchmark', 'sparc'
    ];
    
    // ANSI color codes mapping
    this.ansiColors = {
      '30': '#000000', // Black
      '31': '#ff5555', // Red
      '32': '#50fa7b', // Green
      '33': '#f1fa8c', // Yellow
      '34': '#bd93f9', // Blue
      '35': '#ff79c6', // Magenta
      '36': '#8be9fd', // Cyan
      '37': '#f8f8f2', // White
      '90': '#6272a4', // Bright Black (Gray)
      '91': '#ff6e6e', // Bright Red
      '92': '#69ff94', // Bright Green
      '93': '#ffffa5', // Bright Yellow
      '94': '#d6acff', // Bright Blue
      '95': '#ff92df', // Bright Magenta
      '96': '#a4ffff', // Bright Cyan
      '97': '#ffffff'  // Bright White
    };
    
    this.setupInputHandlers();
    this.setupScrollBehavior();
  }
  
  /**
   * Write output to terminal
   */
  write(content: string, type: OutputType = 'output', timestamp: boolean = true): HTMLElement {
    const entry = this.createOutputEntry(content, type, timestamp);
    this.outputElement.appendChild(entry);
    this.limitOutputLines();
    this.scrollToBottom();
    return entry;
  }
  
  /**
   * Write line to terminal
   */
  writeLine(content: string, type: OutputType = 'output', timestamp: boolean = true): HTMLElement {
    return this.write(content + '\n', type, timestamp);
  }
  
  /**
   * Write command to terminal
   */
  writeCommand(command: string): HTMLElement {
    return this.write(`${this.currentPrompt} ${command}`, 'command', true);
  }
  
  /**
   * Write error message
   */
  writeError(message: string): HTMLElement {
    return this.writeLine(`Error: ${message}`, 'error');
  }
  
  /**
   * Write success message
   */
  writeSuccess(message: string): HTMLElement {
    return this.writeLine(message, 'success');
  }
  
  /**
   * Write warning message
   */
  writeWarning(message: string): HTMLElement {
    return this.writeLine(`Warning: ${message}`, 'warning');
  }
  
  /**
   * Write info message
   */
  writeInfo(message: string): HTMLElement {
    return this.writeLine(message, 'info');
  }
  
  /**
   * Write raw HTML content
   */
  writeHTML(html: string, type: OutputType = 'output'): HTMLElement {
    const entry = document.createElement('div');
    entry.className = 'output-entry';
    entry.innerHTML = html;
    
    if (type) {
      entry.classList.add(`output-${type}`);
    }
    
    this.outputElement.appendChild(entry);
    this.limitOutputLines();
    this.scrollToBottom();
    return entry;
  }
  
  /**
   * Clear terminal output
   */
  clear(): void {
    this.outputElement.innerHTML = '';
    this.showWelcomeMessage();
  }
  
  /**
   * Show welcome message
   */
  showWelcomeMessage(): void {
    // Check if welcome message already exists (from static HTML)
    const existingWelcome = this.outputElement.querySelector('.welcome-message');
    if (existingWelcome) {
      // Welcome message already exists, don't add another one
      return;
    }

    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = `
      <div class="ascii-art">╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🌊 Claude Flow v2.0.0                                ║
║                                                           ║
║     Welcome to the web-based swarm orchestration         ║
║     Type 'help' for available commands                   ║
║     Use Ctrl+L to clear console                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝</div>
    `;
    this.outputElement.appendChild(welcome);
  }
  
  /**
   * Set prompt text
   */
  setPrompt(prompt: string): void {
    this.currentPrompt = prompt;
    const promptElement = document.getElementById('promptText');
    if (promptElement) {
      promptElement.textContent = prompt;
    }
  }
  
  /**
   * Lock/unlock input
   */
  setLocked(locked: boolean): void {
    this.isLocked = locked;
    this.inputElement.disabled = locked;
    
    if (locked) {
      this.inputElement.placeholder = 'Processing...';
    } else {
      this.inputElement.placeholder = 'Enter command...';
      this.inputElement.focus();
    }
  }
  
  /**
   * Focus input
   */
  focus(): void {
    if (!this.isLocked) {
      this.inputElement.focus();
    }
  }
  
  /**
   * Get current input value
   */
  getInput(): string {
    return this.inputElement.value;
  }
  
  /**
   * Set input value
   */
  setInput(value: string): void {
    this.inputElement.value = value;
  }
  
  /**
   * Clear input
   */
  clearInput(): void {
    this.inputElement.value = '';
  }
  
  /**
   * Add command to history
   */
  addToHistory(command: string): void {
    if (command.trim() && this.history[this.history.length - 1] !== command) {
      this.history.push(command);
      
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    }
    
    this.historyIndex = -1;
  }
  
  /**
   * Navigate command history
   */
  navigateHistory(direction: 'up' | 'down'): void {
    if (this.history.length === 0) return;
    
    if (direction === 'up') {
      if (this.historyIndex === -1) {
        this.historyIndex = this.history.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else if (direction === 'down') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
      } else {
        this.historyIndex = -1;
      }
    }
    
    if (this.historyIndex === -1) {
      this.setInput('');
    } else {
      this.setInput(this.history[this.historyIndex]);
    }
  }
  
  /**
   * Create output entry element
   */
  private createOutputEntry(content: string, type: string, timestamp: boolean): HTMLElement {
    const entry = document.createElement('div');
    entry.className = 'output-entry';
    
    const line = document.createElement('div');
    line.className = 'output-line';
    
    // Add timestamp if enabled
    if (timestamp && this.shouldShowTimestamp()) {
      const timeElement = document.createElement('span');
      timeElement.className = 'output-timestamp';
      timeElement.textContent = this.formatTimestamp(new Date());
      line.appendChild(timeElement);
    }
    
    // Add content
    const contentElement = document.createElement('span');
    contentElement.className = `output-content ${type}`;
    
    // Process ANSI codes if present
    if (typeof content === 'string' && content.includes('\x1b[')) {
      contentElement.innerHTML = this.processAnsiCodes(content);
    } else {
      contentElement.textContent = content;
    }
    
    line.appendChild(contentElement);
    entry.appendChild(line);
    
    return entry;
  }
  
  /**
   * Process ANSI escape codes
   */
  private processAnsiCodes(text: string): string {
    // Simple ANSI processing - convert color codes to HTML
    return text
      .replace(/\x1b\[(\d+)m/g, (match, code) => {
        if (code === '0' || code === '00') {
          return '</span>'; // Reset
        }
        
        const color = this.ansiColors[code];
        if (color) {
          return `<span style="color: ${color}">`;
        }
        
        return '';
      })
      .replace(/\x1b\[[\d;]*m/g, '') // Remove other ANSI codes
      + '</span>'; // Ensure we close any open spans
  }
  
  /**
   * Format timestamp
   */
  private formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  /**
   * Check if timestamps should be shown
   */
  private shouldShowTimestamp(): boolean {
    const showTimestamps = localStorage.getItem('console_show_timestamps');
    return showTimestamps !== 'false';
  }
  
  /**
   * Limit output lines
   */
  private limitOutputLines(): void {
    const entries = this.outputElement.querySelectorAll('.output-entry');
    
    if (entries.length > this.maxOutputLines) {
      const excessCount = entries.length - this.maxOutputLines;
      for (let i = 0; i < excessCount; i++) {
        if (entries[i] && !entries[i].classList.contains('welcome-message')) {
          entries[i].remove();
        }
      }
    }
  }
  
  /**
   * Scroll to bottom
   */
  private scrollToBottom(smooth: boolean = false): void {
    if (this.shouldAutoScroll()) {
      if (smooth) {
        this.outputElement.scrollTo({
          top: this.outputElement.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
      }
    }
  }
  
  /**
   * Check if auto-scroll is enabled
   */
  private shouldAutoScroll(): boolean {
    const autoScroll = localStorage.getItem('console_auto_scroll');
    return autoScroll !== 'false';
  }
  
  /**
   * Setup input event handlers
   */
  private setupInputHandlers(): void {
    this.inputElement.addEventListener('keydown', (event) => {
      if (this.isLocked) {
        event.preventDefault();
        return;
      }
      
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          this.handleEnter();
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          this.navigateHistory('up');
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          this.navigateHistory('down');
          break;
          
        case 'Tab':
          event.preventDefault();
          this.handleTab();
          break;
          
        case 'l':
          if (event.ctrlKey) {
            event.preventDefault();
            this.clear();
          }
          break;
          
        case 'c':
          if (event.ctrlKey) {
            event.preventDefault();
            this.handleInterrupt();
          }
          break;
      }
    });
    
    this.inputElement.addEventListener('input', () => {
      if (!this.isLocked) {
        this.handleInput();
      }
    });
  }
  
  /**
   * Handle Enter key
   */
  private handleEnter(): void {
    const command = this.getInput().trim();
    
    if (command) {
      this.addToHistory(command);
      this.writeCommand(command);
      this.clearInput();
      
      // Emit command event
      this.emit('command', command);
    }
  }
  
  /**
   * Handle Tab key (autocomplete)
   */
  private handleTab(): void {
    const input = this.getInput();
    const matches = this.commands.filter(cmd => cmd.startsWith(input));
    
    if (matches.length === 1) {
      this.setInput(matches[0] + ' ');
    } else if (matches.length > 1) {
      this.writeLine(`Available commands: ${matches.join(', ')}`, 'info');
    }
  }
  
  /**
   * Handle input changes
   */
  private handleInput(): void {
    // Could be used for live suggestions in the future
    this.emit('input_change', this.getInput());
  }
  
  /**
   * Handle Ctrl+C interrupt
   */
  private handleInterrupt(): void {
    this.writeLine('^C', 'warning');
    this.clearInput();
    this.emit('interrupt');
  }
  
  /**
   * Setup scroll behavior
   */
  private setupScrollBehavior(): void {
    let isUserScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let lastScrollTop = 0;
    
    this.outputElement.addEventListener('scroll', () => {
      const currentScrollTop = this.outputElement.scrollTop;
      const maxScrollTop = this.outputElement.scrollHeight - this.outputElement.clientHeight;
      
      // Check if user scrolled up (away from bottom)
      if (currentScrollTop < lastScrollTop && currentScrollTop < maxScrollTop - 10) {
        isUserScrolling = true;
        
        // Show scroll indicator if not already visible
        this.showScrollIndicator();
        
        clearTimeout(scrollTimeout);
        // Don't auto-resume scrolling for 3 seconds after user scrolls up
        scrollTimeout = setTimeout(() => {
          // Only resume auto-scroll if user is back near the bottom
          const newScrollTop = this.outputElement.scrollTop;
          const newMaxScrollTop = this.outputElement.scrollHeight - this.outputElement.clientHeight;
          
          if (newScrollTop >= newMaxScrollTop - 50) {
            isUserScrolling = false;
            this.hideScrollIndicator();
          }
        }, 3000);
      }
      // If user scrolled to bottom, resume auto-scrolling immediately
      else if (currentScrollTop >= maxScrollTop - 10) {
        isUserScrolling = false;
        this.hideScrollIndicator();
        clearTimeout(scrollTimeout);
      }
      
      lastScrollTop = currentScrollTop;
    });
    
    // Override shouldAutoScroll to check user scrolling
    const originalShouldAutoScroll = this.shouldAutoScroll.bind(this);
    this.shouldAutoScroll = () => {
      return originalShouldAutoScroll() && !isUserScrolling;
    };
    
    // Store reference for manual scroll control
    this.isUserScrolling = () => isUserScrolling;
    this.resumeAutoScroll = () => {
      isUserScrolling = false;
      this.hideScrollIndicator();
      this.scrollToBottom(true); // Smooth scroll to bottom
    };
  }

  /**
   * Show scroll indicator
   */
  private showScrollIndicator(): void {
    let indicator = document.getElementById('scrollIndicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'scrollIndicator';
      indicator.className = 'scroll-indicator';
      indicator.innerHTML = `
        <span class="scroll-text">Auto-scroll paused</span>
        <button class="scroll-resume-btn" onclick="(window as any).claudeConsole.terminal.resumeAutoScroll()">
          ↓ Resume
        </button>
      `;
      
      // Position it relative to the console container
      const consoleContainer = this.outputElement.closest('.console-container');
      if (consoleContainer) {
        consoleContainer.appendChild(indicator);
      } else {
        document.body.appendChild(indicator);
      }
    }
    
    indicator.style.display = 'flex';
  }

  /**
   * Hide scroll indicator
   */
  private hideScrollIndicator(): void {
    const indicator = document.getElementById('scrollIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }
  
  /**
   * Stream text output with typing effect
   */
  async streamText(text: string, delay: number = 10): Promise<HTMLElement> {
    const entry = this.createOutputEntry('', 'output', true);
    this.outputElement.appendChild(entry);
    
    const contentElement = entry.querySelector('.output-content');
    
    for (let i = 0; i < text.length; i++) {
      contentElement.textContent += text[i];
      this.scrollToBottom();
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return entry;
  }
  
  /**
   * Add event listener
   */
  on(event: string, callback: EventCallback): void {
    
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event).push(callback);
  }
  
  /**
   * Emit event
   */
  private emit(event: string, data?: any): void {
    if (!this.eventListeners.has(event)) {
      return;
    }
    
    this.eventListeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in terminal event listener:', error);
      }
    });
  }
  
  /**
   * Set maximum output lines
   */
  setMaxLines(maxLines: number): void {
    this.maxOutputLines = Math.max(100, Math.min(10000, maxLines));
    this.limitOutputLines();
  }
  
  /**
   * Get terminal statistics
   */
  getStats(): TerminalStats {
    const entries = this.outputElement.querySelectorAll('.output-entry');
    
    return {
      totalLines: entries.length,
      historySize: this.history.length,
      isLocked: this.isLocked,
      currentPrompt: this.currentPrompt
    };
  }
  
  /**
   * Export terminal history
   */
  exportHistory(): TerminalEntry[] {
    const entries = Array.from(this.outputElement.querySelectorAll('.output-entry'));
    
    return entries.map(entry => {
      const timestamp = entry.querySelector('.output-timestamp')?.textContent || '';
      const content = entry.querySelector('.output-content')?.textContent || '';
      const type = entry.querySelector('.output-content')?.className.split(' ').find(c => c.startsWith('output-')) || '';
      
      return { timestamp, content, type };
    });
  }
  
  /**
   * Import terminal history
   */
  importHistory(history: TerminalEntry[]): void {
    this.clear();
    
    history.forEach(({ timestamp, content, type }) => {
      this.write(content, type.replace('output-', '') as OutputType, false);
    });
  }
}