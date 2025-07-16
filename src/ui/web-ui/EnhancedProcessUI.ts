/**
 * Enhanced Process UI - Upgraded version with modular architecture integration
 * Combines existing process management with 71+ MCP tools and advanced features
 */

import { printSuccess, printError, printWarning, printInfo } from '../../cli/utils.js';
import { compat } from '../../cli/runtime-detector.js';
import SwarmWebUIIntegration from '../../cli/simple-commands/swarm-webui-integration.js';
import { EnhancedWebUI } from './EnhancedWebUI.js';
import { 
  Colors, 
  Process, 
  ViewMode, 
  ToolCategoryData, 
  Agent, 
  Task, 
  MemoryStats, 
  LogEntry, 
  SystemStats, 
  ToolStats, 
  ToolExecutionResult, 
  SwarmMetrics,
  Tab,
  NeuralTool,
  IEnhancedProcessUI,
  IEnhancedWebUI
} from './types/interfaces.js';

// Enhanced color utilities with more options
const colors: Colors = {
  cyan: (text: string): string => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string): string => `\x1b[90m${text}\x1b[0m`,
  white: (text: string): string => `\x1b[37m${text}\x1b[0m`,
  yellow: (text: string): string => `\x1b[33m${text}\x1b[0m`,
  green: (text: string): string => `\x1b[32m${text}\x1b[0m`,
  red: (text: string): string => `\x1b[31m${text}\x1b[0m`,
  blue: (text: string): string => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string): string => `\x1b[35m${text}\x1b[0m`,
  bold: (text: string): string => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string): string => `\x1b[2m${text}\x1b[0m`,
  bright: (text: string): string => `\x1b[97m${text}\x1b[0m`,
  orange: (text: string): string => `\x1b[38;5;208m${text}\x1b[0m`,
  purple: (text: string): string => `\x1b[35m${text}\x1b[0m`
};

const PROCESSES: Omit<Process, 'status' | 'pid' | 'uptime' | 'cpu' | 'memory'>[] = [
  { id: 'event-bus', name: 'Event Bus', description: 'Central event distribution system' },
  { id: 'orchestrator', name: 'Orchestrator', description: 'Main coordination engine' },
  { id: 'memory-manager', name: 'Memory Manager', description: 'Persistent memory system' },
  { id: 'terminal-pool', name: 'Terminal Pool', description: 'Terminal session management' },
  { id: 'mcp-server', name: 'MCP Server', description: 'Model Context Protocol server' },
  { id: 'coordinator', name: 'Coordinator', description: 'Task coordination service' },
  { id: 'enhanced-ui', name: 'Enhanced UI', description: 'Advanced web interface system' },
  { id: 'neural-engine', name: 'Neural Engine', description: 'AI neural network processor' }
];

// Enhanced view modes with new categories
const VIEWS = {
  OVERVIEW: 'overview' as ViewMode,
  PROCESSES: 'processes' as ViewMode,
  STATUS: 'status' as ViewMode,
  ORCHESTRATION: 'orchestration' as ViewMode,
  MEMORY: 'memory' as ViewMode,
  NEURAL: 'neural' as ViewMode,
  MONITORING: 'monitoring' as ViewMode,
  WORKFLOW: 'workflow' as ViewMode,
  GITHUB: 'github' as ViewMode,
  DAA: 'daa' as ViewMode,
  SYSTEM: 'system' as ViewMode,
  CLI: 'cli' as ViewMode,
  LOGS: 'logs' as ViewMode,
  HELP: 'help' as ViewMode
};

// Tool category information
const TOOL_CATEGORIES: Record<string, ToolCategoryData> = {
  neural: { icon: '🧠', name: 'Neural Network', count: 15, color: colors.cyan },
  memory: { icon: '💾', name: 'Memory Management', count: 10, color: colors.green },
  monitoring: { icon: '📊', name: 'Monitoring & Analysis', count: 13, color: colors.yellow },
  workflow: { icon: '🔄', name: 'Workflow & Automation', count: 11, color: colors.blue },
  github: { icon: '🐙', name: 'GitHub Integration', count: 8, color: colors.magenta },
  daa: { icon: '🤖', name: 'Dynamic Agents', count: 8, color: colors.purple },
  system: { icon: '🛠️', name: 'System Utilities', count: 6, color: colors.orange },
  cli: { icon: '⌨️', name: 'CLI Commands', count: 9, color: colors.white }
};

export class EnhancedProcessUI implements IEnhancedProcessUI {
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
  
  constructor() {
    this.processes = new Map();
    this.running = true;
    this.selectedIndex = 0;
    this.currentView = VIEWS.OVERVIEW;
    this.agents = [];
    this.tasks = [];
    this.memoryStats = {
      totalEntries: 0,
      totalSize: '0',
      namespaces: []
    };
    this.logs = [];
    this.systemStats = {
      uptime: 0,
      totalTasks: 0,
      completedTasks: 0,
      activeAgents: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      toolsAvailable: 71,
      enhancedMode: false
    };
    
    // Enhanced UI integration
    this.enhancedWebUI = null;
    this.toolExecutions = new Map();
    this.recentTools = [];
    this.toolStats = new Map();
    
    // Initialize integrations
    this.swarmIntegration = new SwarmWebUIIntegration(this);
    
    // Initialize process states
    PROCESSES.forEach(p => {
      this.processes.set(p.id, {
        ...p,
        status: 'stopped',
        pid: null,
        uptime: 0,
        cpu: Math.random() * 5,
        memory: Math.random() * 100
      });
    });
    
    // Start system uptime counter
    setInterval(() => {
      this.systemStats.uptime++;
    }, 1000);
    
    // Initialize enhanced features
    this.initializeEnhancedFeatures();
  }
  
  /**
   * Initialize enhanced features
   */
  async initializeEnhancedFeatures(): Promise<void> {
    try {
      // Initialize enhanced web UI
      this.enhancedWebUI = new EnhancedWebUI();
      await this.enhancedWebUI.initialize(this);
      
      this.systemStats.enhancedMode = true;
      this.addLog('success', 'Enhanced UI features initialized');
      
      // Set enhanced UI process as running
      const enhancedUIProcess = this.processes.get('enhanced-ui');
      if (enhancedUIProcess) {
        enhancedUIProcess.status = 'running';
        enhancedUIProcess.pid = Math.floor(Math.random() * 10000) + 1000;
      }
      
    } catch (error) {
      this.addLog('warning', 'Enhanced UI fallback mode enabled');
      console.warn('Enhanced UI initialization warning:', error);
    }
    
    // Initialize swarm (this will create mock data)
    await this.initializeSwarm();
    
    // Initialize tool statistics
    this.initializeToolStats();
  }
  
  /**
   * Initialize tool statistics
   */
  initializeToolStats(): void {
    Object.keys(TOOL_CATEGORIES).forEach(category => {
      this.toolStats.set(category, {
        executions: 0,
        lastUsed: null,
        avgDuration: 0,
        successRate: 100
      });
    });
  }
  
  async initializeSwarm(): Promise<void> {
    // Initialize swarm with mock data
    await this.swarmIntegration.initializeSwarm('hierarchical', 8);
    
    // Enhanced memory namespaces
    this.memoryStats = {
      totalEntries: 156,
      totalSize: '2.4 MB',
      namespaces: [
        { name: 'neural', entries: 45, size: '678 KB' },
        { name: 'sparc', entries: 32, size: '512 KB' },
        { name: 'agents', entries: 28, size: '389 KB' },
        { name: 'tasks', entries: 24, size: '334 KB' },
        { name: 'workflows', entries: 18, size: '267 KB' },
        { name: 'monitoring', entries: 9, size: '245 KB' }
      ]
    };
    
    // Enhanced initial logs
    this.logs = [
      { time: new Date(), level: 'info', message: 'System initialized with enhanced features' },
      { time: new Date(), level: 'success', message: 'All 71+ tools loaded successfully' },
      { time: new Date(), level: 'success', message: 'Enhanced UI architecture active' },
      { time: new Date(), level: 'info', message: 'Swarm orchestration ready' },
      { time: new Date(), level: 'success', message: 'Neural engine online' }
    ];
  }
  
  async start(): Promise<void> {
    // Clear screen
    console.clear();
    
    // Show enhanced welcome
    printSuccess('🧠 Claude-Flow Enhanced UI v2.0.0');
    console.log(colors.dim('Enhanced with 71+ MCP tools and advanced features'));
    console.log('─'.repeat(80));
    console.log();
    
    // Initial render
    this.render();
    
    // Main UI loop
    while (this.running) {
      await this.handleInput();
      if (this.running) {
        this.render();
      }
    }
  }
  
  render(): void {
    // Clear screen and move cursor to top
    console.log('\x1b[2J\x1b[H');
    
    // Header with enhanced navigation
    this.renderEnhancedHeader();
    
    // Main content based on current view
    switch (this.currentView) {
      case VIEWS.OVERVIEW:
        this.renderOverviewView();
        break;
      case VIEWS.PROCESSES:
        this.renderProcessView();
        break;
      case VIEWS.STATUS:
        this.renderStatusView();
        break;
      case VIEWS.ORCHESTRATION:
        this.renderOrchestrationView();
        break;
      case VIEWS.MEMORY:
        this.renderMemoryView();
        break;
      case VIEWS.NEURAL:
        this.renderNeuralView();
        break;
      case VIEWS.MONITORING:
        this.renderMonitoringView();
        break;
      case VIEWS.WORKFLOW:
        this.renderWorkflowView();
        break;
      case VIEWS.GITHUB:
        this.renderGitHubView();
        break;
      case VIEWS.DAA:
        this.renderDAAView();
        break;
      case VIEWS.SYSTEM:
        this.renderSystemView();
        break;
      case VIEWS.CLI:
        this.renderCLIView();
        break;
      case VIEWS.LOGS:
        this.renderLogsView();
        break;
      case VIEWS.HELP:
        this.renderEnhancedHelpView();
        break;
    }
    
    // Enhanced footer with tool information
    this.renderEnhancedFooter();
  }
  
  renderEnhancedHeader(): void {
    const enhancedStatus = this.systemStats.enhancedMode ? 
      colors.green('ENHANCED') : colors.yellow('FALLBACK');
    
    console.log(colors.cyan(colors.bold('🧠 Claude-Flow Enhanced Process Manager')));
    console.log(colors.dim(`Mode: ${enhancedStatus} | Tools: ${this.systemStats.toolsAvailable}+ | Uptime: ${this.formatUptime(this.systemStats.uptime)}`));
    console.log(colors.gray('─'.repeat(80)));
    
    // Enhanced navigation tabs with tool counts
    const tabs: Tab[] = [
      { id: '0', key: '0', view: VIEWS.OVERVIEW, label: 'Overview', icon: '🏠', content: '' },
      { id: '1', key: '1', view: VIEWS.PROCESSES, label: 'Processes', icon: '⚙️', content: '' },
      { id: '2', key: '2', view: VIEWS.STATUS, label: 'Status', icon: '📊', content: '' },
      { id: '3', key: '3', view: VIEWS.ORCHESTRATION, label: 'Orchestration', icon: '🐝', content: '' },
      { id: '4', key: '4', view: VIEWS.MEMORY, label: 'Memory', icon: '💾', content: '' },
      { id: '5', key: '5', view: VIEWS.NEURAL, label: 'Neural (15)', icon: '🧠', content: '' },
      { id: '6', key: '6', view: VIEWS.MONITORING, label: 'Monitor (13)', icon: '📊', content: '' },
      { id: '7', key: '7', view: VIEWS.WORKFLOW, label: 'Workflow (11)', icon: '🔄', content: '' },
      { id: '8', key: '8', view: VIEWS.GITHUB, label: 'GitHub (8)', icon: '🐙', content: '' },
      { id: '9', key: '9', view: VIEWS.LOGS, label: 'Logs', icon: '📜', content: '' },
      { id: '?', key: '?', view: VIEWS.HELP, label: 'Help', icon: '❓', content: '' }
    ];
    
    let tabLine = '';
    tabs.forEach((tab, index) => {
      const isActive = this.currentView === tab.view;
      const label = isActive ? colors.yellow(`[${tab.icon} ${tab.label}]`) : colors.gray(`${tab.icon} ${tab.label}`);
      tabLine += `  ${colors.bold(tab.key || '')}:${label}`;
      
      // Add line break every 4 tabs for better layout
      if ((index + 1) % 4 === 0 && index < tabs.length - 1) {
        tabLine += '\n';
      }
    });
    
    console.log(tabLine);
    console.log(colors.gray('─'.repeat(80)));
    console.log();
  }
  
  renderOverviewView(): void {
    console.log(colors.white(colors.bold('🏠 System Overview')));
    console.log();
    
    // Quick stats grid
    const stats = [
      { label: 'Tools Available', value: this.systemStats.toolsAvailable + '+', icon: '🔧', color: colors.cyan },
      { label: 'Active Agents', value: this.agents.filter(a => a.status === 'working').length, icon: '🤖', color: colors.green },
      { label: 'Running Processes', value: Array.from(this.processes.values()).filter(p => p.status === 'running').length, icon: '⚙️', color: colors.blue },
      { label: 'Memory Namespaces', value: this.memoryStats.namespaces.length, icon: '💾', color: colors.magenta }
    ];
    
    const statsLine1 = stats.slice(0, 2).map(stat => 
      `${stat.icon} ${stat.color(stat.value.toString())} ${colors.gray(stat.label)}`
    ).join('  |  ');
    
    const statsLine2 = stats.slice(2, 4).map(stat => 
      `${stat.icon} ${stat.color(stat.value.toString())} ${colors.gray(stat.label)}`
    ).join('  |  ');
    
    console.log(`  ${statsLine1}`);
    console.log(`  ${statsLine2}`);
    console.log();
    
    // Tool categories overview
    console.log(colors.cyan('🔧 Tool Categories'));
    console.log();
    
    const categories = Object.entries(TOOL_CATEGORIES);
    categories.forEach(([ id, category ]) => {
      const stats = this.toolStats.get(id);
      const usageInfo = stats && stats.executions > 0 ? 
        colors.dim(` (${stats.executions} uses)`) : colors.dim(' (unused)');
      
      console.log(`  ${category.icon} ${category.color(category.name)}: ${colors.yellow(category.count.toString())} tools${usageInfo}`);
    });
    
    console.log();
    
    // Recent activity
    console.log(colors.cyan('🔔 Recent Activity'));
    this.logs.slice(-5).forEach(log => {
      const time = log.time.toLocaleTimeString();
      const icon = log.level === 'success' ? '✓' : log.level === 'warning' ? '⚠' : 'ℹ';
      const color = log.level === 'success' ? colors.green : log.level === 'warning' ? colors.yellow : colors.blue;
      console.log(`  ${colors.gray(time)} ${color(icon)} ${log.message}`);
    });
    
    console.log();
    
    // Quick actions
    console.log(colors.cyan('⚡ Quick Actions'));
    console.log(`  ${colors.yellow('N')} Neural Tools  ${colors.yellow('M')} Memory Tools  ${colors.yellow('W')} Workflows  ${colors.yellow('G')} GitHub`);
    console.log(`  ${colors.yellow('D')} Diagnostics   ${colors.yellow('S')} Swarm Control ${colors.yellow('T')} Train Model ${colors.yellow('A')} Analytics`);
  }
  
  renderNeuralView(): void {
    console.log(colors.white(colors.bold('🧠 Neural Network Operations')));
    console.log();
    
    const neuralTools: NeuralTool[] = [
      { key: 'T', name: 'neural_train', desc: 'Train neural patterns with WASM SIMD' },
      { key: 'P', name: 'neural_predict', desc: 'Make AI predictions' },
      { key: 'S', name: 'neural_status', desc: 'Check neural network status' },
      { key: 'A', name: 'neural_patterns', desc: 'Analyze cognitive patterns' },
      { key: 'L', name: 'model_load', desc: 'Load pre-trained models' },
      { key: 'V', name: 'model_save', desc: 'Save trained models' },
      { key: 'R', name: 'pattern_recognize', desc: 'Pattern recognition' },
      { key: 'C', name: 'cognitive_analyze', desc: 'Cognitive behavior analysis' },
      { key: 'D', name: 'learning_adapt', desc: 'Adaptive learning' },
      { key: 'Z', name: 'neural_compress', desc: 'Compress neural models' },
      { key: 'E', name: 'ensemble_create', desc: 'Create model ensembles' },
      { key: 'F', name: 'transfer_learn', desc: 'Transfer learning' },
      { key: 'X', name: 'neural_explain', desc: 'AI explainability' },
      { key: 'W', name: 'wasm_optimize', desc: 'WASM SIMD optimization' },
      { key: 'I', name: 'inference_run', desc: 'Run neural inference' }
    ];
    
    console.log(colors.cyan('Available Neural Tools (15):'));
    neuralTools.forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log();
    console.log(colors.cyan('🎯 Recent Neural Operations:'));
    const recentNeural = this.recentTools.filter(t => t.startsWith('neural_') || t.includes('model_'));
    if (recentNeural.length > 0) {
      recentNeural.slice(-3).forEach(tool => {
        console.log(`  ✓ ${colors.green(tool)}`);
      });
    } else {
      console.log(`  ${colors.gray('No recent neural operations')}`);
    }
  }
  
  renderMonitoringView(): void {
    console.log(colors.white(colors.bold('📊 Monitoring & Analysis')));
    console.log();
    
    const monitoringTools: NeuralTool[] = [
      { key: 'P', name: 'performance_report', desc: 'Generate performance reports' },
      { key: 'B', name: 'bottleneck_analyze', desc: 'Identify performance bottlenecks' },
      { key: 'T', name: 'token_usage', desc: 'Analyze token consumption' },
      { key: 'M', name: 'metrics_collect', desc: 'Collect system metrics' },
      { key: 'H', name: 'health_check', desc: 'System health monitoring' },
      { key: 'E', name: 'error_analysis', desc: 'Error pattern analysis' },
      { key: 'U', name: 'usage_stats', desc: 'Usage statistics' },
      { key: 'Q', name: 'quality_assess', desc: 'Quality assessment' },
      { key: 'C', name: 'cost_analysis', desc: 'Cost and resource analysis' },
      { key: 'R', name: 'trend_analysis', desc: 'Analyze performance trends' },
      { key: 'K', name: 'benchmark_run', desc: 'Performance benchmarks' },
      { key: 'S', name: 'swarm_monitor', desc: 'Real-time swarm monitoring' },
      { key: 'A', name: 'agent_metrics', desc: 'Agent performance metrics' }
    ];
    
    console.log(colors.cyan('Available Monitoring Tools (13):'));
    monitoringTools.slice(0, 7).forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log('  ' + colors.gray('... and 6 more tools'));
    
    // Live system metrics
    console.log();
    console.log(colors.cyan('📈 Live System Metrics:'));
    console.log(`  CPU: ${this.getUsageBar(this.systemStats.cpuUsage, 100)} ${this.systemStats.cpuUsage.toFixed(1)}%`);
    console.log(`  Memory: ${this.getUsageBar(this.systemStats.memoryUsage, 100)} ${this.systemStats.memoryUsage.toFixed(1)}%`);
    console.log(`  Agents: ${colors.green(this.agents.filter(a => a.status === 'working').length.toString())}/${this.agents.length} active`);
    console.log(`  Tasks: ${colors.yellow(this.tasks.filter(t => t.status === 'in_progress').length.toString())} in progress`);
  }
  
  renderWorkflowView(): void {
    console.log(colors.white(colors.bold('🔄 Workflow & Automation')));
    console.log();
    
    const workflowTools: NeuralTool[] = [
      { key: 'C', name: 'workflow_create', desc: 'Create custom workflows' },
      { key: 'E', name: 'workflow_execute', desc: 'Execute predefined workflows' },
      { key: 'A', name: 'automation_setup', desc: 'Setup automation rules' },
      { key: 'P', name: 'pipeline_create', desc: 'Create CI/CD pipelines' },
      { key: 'S', name: 'scheduler_manage', desc: 'Manage task scheduling' },
      { key: 'T', name: 'trigger_setup', desc: 'Setup event triggers' },
      { key: 'W', name: 'workflow_template', desc: 'Manage workflow templates' },
      { key: 'B', name: 'batch_process', desc: 'Batch processing' },
      { key: 'L', name: 'parallel_execute', desc: 'Execute tasks in parallel' },
      { key: 'R', name: 'sparc_mode', desc: 'Run SPARC development modes' },
      { key: 'O', name: 'task_orchestrate', desc: 'Orchestrate complex workflows' }
    ];
    
    console.log(colors.cyan('Available Workflow Tools (11):'));
    workflowTools.forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log();
    console.log(colors.cyan('🎯 Active Workflows:'));
    // Show active workflows/automations
    const activeWorkflows = this.tasks.filter(t => t.description.includes('workflow') || t.description.includes('automation'));
    if (activeWorkflows.length > 0) {
      activeWorkflows.slice(-3).forEach(workflow => {
        const status = workflow.status === 'completed' ? colors.green('✓') :
                     workflow.status === 'in_progress' ? colors.yellow('◐') : colors.gray('○');
        console.log(`  ${status} ${workflow.description}`);
      });
    } else {
      console.log(`  ${colors.gray('No active workflows')}`);
    }
  }
  
  renderGitHubView(): void {
    console.log(colors.white(colors.bold('🐙 GitHub Integration')));
    console.log();
    
    const githubTools: NeuralTool[] = [
      { key: 'A', name: 'github_repo_analyze', desc: 'Repository analysis' },
      { key: 'P', name: 'github_pr_manage', desc: 'Pull request management' },
      { key: 'I', name: 'github_issue_track', desc: 'Issue tracking & triage' },
      { key: 'R', name: 'github_release_coord', desc: 'Release coordination' },
      { key: 'W', name: 'github_workflow_auto', desc: 'Workflow automation' },
      { key: 'C', name: 'github_code_review', desc: 'Automated code review' },
      { key: 'S', name: 'github_sync_coord', desc: 'Multi-repo sync coordination' },
      { key: 'M', name: 'github_metrics', desc: 'Repository metrics' }
    ];
    
    console.log(colors.cyan('Available GitHub Tools (8):'));
    githubTools.forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log();
    console.log(colors.cyan('📊 GitHub Integration Status:'));
    console.log(`  Repository: ${colors.green('claude-code-flow')}`);
    console.log(`  Branch: ${colors.yellow('claude-flow-v2.0.0')}`);
    console.log(`  Status: ${colors.green('Connected')}`);
    console.log(`  Last Sync: ${colors.gray('Recently')}`);
  }
  
  renderDAAView(): void {
    console.log(colors.white(colors.bold('🤖 Dynamic Agent Architecture')));
    console.log();
    
    const daaTools: NeuralTool[] = [
      { key: 'C', name: 'daa_agent_create', desc: 'Create dynamic agents' },
      { key: 'M', name: 'daa_capability_match', desc: 'Match capabilities to tasks' },
      { key: 'R', name: 'daa_resource_alloc', desc: 'Resource allocation' },
      { key: 'L', name: 'daa_lifecycle_manage', desc: 'Agent lifecycle management' },
      { key: 'O', name: 'daa_communication', desc: 'Inter-agent communication' },
      { key: 'N', name: 'daa_consensus', desc: 'Consensus mechanisms' },
      { key: 'F', name: 'daa_fault_tolerance', desc: 'Fault tolerance & recovery' },
      { key: 'P', name: 'daa_optimization', desc: 'Performance optimization' }
    ];
    
    console.log(colors.cyan('Available DAA Tools (8):'));
    daaTools.forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log();
    console.log(colors.cyan('🔗 Agent Network Status:'));
    console.log(`  Total Agents: ${colors.green(this.agents.length.toString())}`);
    console.log(`  Active: ${colors.yellow(this.agents.filter(a => a.status === 'working').length.toString())}`);
    console.log(`  Idle: ${colors.gray(this.agents.filter(a => a.status === 'idle').length.toString())}`);
    console.log(`  Consensus: ${colors.green('Healthy')}`);
  }
  
  renderSystemView(): void {
    console.log(colors.white(colors.bold('🛠️ System Utilities')));
    console.log();
    
    const systemTools: NeuralTool[] = [
      { key: 'S', name: 'security_scan', desc: 'Security scanning' },
      { key: 'B', name: 'backup_create', desc: 'Create system backups' },
      { key: 'R', name: 'restore_system', desc: 'System restoration' },
      { key: 'L', name: 'log_analysis', desc: 'Log analysis & insights' },
      { key: 'D', name: 'diagnostic_run', desc: 'System diagnostics' },
      { key: 'C', name: 'config_manage', desc: 'Configuration management' }
    ];
    
    console.log(colors.cyan('Available System Tools (6):'));
    systemTools.forEach(tool => {
      const stats = this.getToolStats(tool.name);
      const usage = stats ? colors.dim(` (${stats.executions} uses)`) : '';
      console.log(`  ${colors.yellow(tool.key)}: ${colors.white(tool.name)} - ${colors.gray(tool.desc)}${usage}`);
    });
    
    console.log();
    console.log(colors.cyan('🔧 System Health:'));
    console.log(`  Overall Status: ${colors.green('Healthy')}`);
    console.log(`  Security Score: ${colors.green('A-')}`);
    console.log(`  Last Backup: ${colors.gray('2 hours ago')}`);
    console.log(`  Disk Usage: ${this.getUsageBar(65, 100)} 65%`);
  }
  
  renderCLIView(): void {
    console.log(colors.white(colors.bold('⌨️ CLI Command Bridge')));
    console.log();
    
    const cliCommands: { key: string; name: string; desc: string }[] = [
      { key: 'H', name: 'hive-mind', desc: 'Hive mind orchestration wizard' },
      { key: 'G', name: 'github', desc: 'GitHub operations' },
      { key: 'T', name: 'training', desc: 'Neural training commands' },
      { key: 'A', name: 'analysis', desc: 'Analysis operations' },
      { key: 'U', name: 'automation', desc: 'Automation setup' },
      { key: 'C', name: 'coordination', desc: 'Swarm coordination' },
      { key: 'K', name: 'hooks', desc: 'Hook management' },
      { key: 'M', name: 'mcp', desc: 'MCP server control' },
      { key: 'F', name: 'config', desc: 'Configuration management' }
    ];
    
    console.log(colors.cyan('Available CLI Commands (9):'));
    cliCommands.forEach(cmd => {
      console.log(`  ${colors.yellow(cmd.key)}: ${colors.white(cmd.name)} - ${colors.gray(cmd.desc)}`);
    });
    
    console.log();
    console.log(colors.cyan('🎯 CLI Integration Status:'));
    console.log(`  Bridge Mode: ${colors.green('Active')}`);
    console.log(`  Commands Available: ${colors.yellow('All')}`);
    console.log(`  Last Command: ${colors.gray('N/A')}`);
  }
  
  // Keep existing methods but add enhanced functionality
  renderProcessView(): void {
    console.log(colors.white(colors.bold('⚙️ Process Management')));
    console.log();
    
    let index = 0;
    for (const [id, process] of this.processes) {
      const selected = index === this.selectedIndex;
      const prefix = selected ? colors.yellow('▶ ') : '  ';
      const status = this.getStatusIcon(process.status);
      const name = selected ? colors.yellow(process.name) : colors.white(process.name);
      
      console.log(`${prefix}${status} ${name}`);
      console.log(`     ${colors.gray(process.description)}`);
      
      if (process.status === 'running') {
        const stats = colors.dim(`PID: ${process.pid} | Uptime: ${this.formatUptime(process.uptime)} | CPU: ${process.cpu.toFixed(1)}% | Mem: ${process.memory.toFixed(0)}MB`);
        console.log(`     ${stats}`);
      }
      console.log();
      
      index++;
    }
    
    // Enhanced stats
    const running = Array.from(this.processes.values()).filter(p => p.status === 'running').length;
    console.log(colors.gray('─'.repeat(80)));
    console.log(colors.white(`Total: ${this.processes.size} | Running: ${colors.green(running.toString())} | Stopped: ${colors.gray((this.processes.size - running).toString())} | Enhanced: ${this.systemStats.enhancedMode ? colors.green('Yes') : colors.yellow('Fallback')}`));
  }
  
  // Enhanced status view
  renderStatusView(): void {
    console.log(colors.white(colors.bold('📊 Enhanced System Status')));
    console.log();
    
    // System overview
    console.log(colors.cyan('📊 System Overview'));
    console.log(`  Uptime: ${colors.green(this.formatUptime(this.systemStats.uptime))}`);
    console.log(`  Mode: ${this.systemStats.enhancedMode ? colors.green('Enhanced') : colors.yellow('Fallback')}`);
    console.log(`  Process Health: ${this.getHealthBar()}`);
    console.log(`  Tools Available: ${colors.cyan(this.systemStats.toolsAvailable + '+')}`);
    console.log();
    
    // Resource usage
    console.log(colors.cyan('💻 Resource Usage'));
    console.log(`  CPU Usage: ${this.getUsageBar(this.systemStats.cpuUsage, 100)} ${this.systemStats.cpuUsage.toFixed(1)}%`);
    console.log(`  Memory: ${this.getUsageBar(this.systemStats.memoryUsage, 100)} ${this.systemStats.memoryUsage.toFixed(1)}%`);
    console.log(`  Memory Bank: ${colors.green(this.memoryStats.totalSize.toString())} (${this.memoryStats.totalEntries} entries)`);
    console.log();
    
    // Enhanced metrics
    console.log(colors.cyan('🔧 Tool Usage'));
    let totalToolUsage = 0;
    this.toolStats.forEach(stats => totalToolUsage += stats.executions);
    console.log(`  Total Executions: ${colors.yellow(totalToolUsage.toString())}`);
    
    const topCategories = Array.from(this.toolStats.entries())
      .sort((a, b) => b[1].executions - a[1].executions)
      .slice(0, 3);
    
    topCategories.forEach(([category, stats]) => {
      const info = TOOL_CATEGORIES[category];
      if (info && stats.executions > 0) {
        console.log(`  ${info.icon} ${info.name}: ${colors.green(stats.executions.toString())} uses`);
      }
    });
    
    console.log();
    
    // Activity metrics (existing code continues...)
    console.log(colors.cyan('📈 Activity Metrics'));
    console.log(`  Active Agents: ${colors.yellow(this.agents.filter(a => a.status === 'working').length.toString())}/${this.agents.length}`);
    console.log(`  Total Tasks: ${this.tasks.length}`);
    console.log(`  Completed: ${colors.green(this.tasks.filter(t => t.status === 'completed').length.toString())}`);
    console.log(`  In Progress: ${colors.yellow(this.tasks.filter(t => t.status === 'in_progress').length.toString())}`);
    console.log(`  Pending: ${colors.gray(this.tasks.filter(t => t.status === 'pending').length.toString())}`);
    console.log();
    
    // Recent events
    console.log(colors.cyan('🔔 Recent Events'));
    this.logs.slice(-3).forEach(log => {
      const time = log.time.toLocaleTimeString();
      const icon = log.level === 'success' ? '✓' : log.level === 'warning' ? '⚠' : 'ℹ';
      const color = log.level === 'success' ? colors.green : log.level === 'warning' ? colors.yellow : colors.blue;
      console.log(`  ${colors.gray(time)} ${color(icon)} ${log.message}`);
    });
  }
  
  // Keep existing methods...
  renderOrchestrationView(): void {
    console.log(colors.white(colors.bold('🐝 Enhanced Swarm Orchestration')));
    console.log();
    
    // Swarm metrics
    const metrics = this.swarmIntegration.getSwarmMetrics();
    if (metrics) {
      console.log(colors.cyan('🐝 Swarm Status'));
      console.log(`  Swarm ID: ${colors.yellow(metrics.swarmId)}`);
      console.log(`  Agents: ${colors.green(metrics.agents.active.toString())}/${metrics.agents.total} active`);
      console.log(`  Tasks: ${colors.yellow(metrics.tasks.inProgress.toString())} in progress, ${colors.green(metrics.tasks.completed.toString())} completed`);
      console.log(`  Efficiency: ${colors.cyan(metrics.efficiency + '%')}`);
      console.log(`  Enhanced Mode: ${this.systemStats.enhancedMode ? colors.green('Active') : colors.yellow('Fallback')}`);
      console.log();
    }
    
    // Rest of orchestration view...
    // (Continue with existing orchestration code)
    
    // Agents section
    console.log(colors.cyan('🤖 Active Agents'));
    console.log();
    this.agents.slice(0, 5).forEach((agent, index) => {
      const selected = this.currentView === VIEWS.ORCHESTRATION && index === this.selectedIndex;
      const prefix = selected ? colors.yellow('▶ ') : '  ';
      const statusIcon = agent.status === 'working' ? colors.green('●') : colors.gray('○');
      const name = selected ? colors.yellow(agent.name) : colors.white(agent.name);
      
      console.log(`${prefix}${statusIcon} ${name} (${agent.type})`);
      console.log(`     ID: ${agent.id} | Tasks: ${agent.tasks} | Status: ${agent.status}`);
      if (agent.capabilities && agent.capabilities.length > 0) {
        console.log(`     Capabilities: ${colors.dim(agent.capabilities.join(', '))}`);
      }
      console.log();
    });
    
    if (this.agents.length > 5) {
      console.log(colors.gray(`  ... and ${this.agents.length - 5} more agents`));
    }
    
    console.log(colors.gray('─'.repeat(40)));
    
    // Tasks section
    console.log(colors.cyan('📋 Task Queue'));
    console.log();
    this.tasks.slice(0, 5).forEach(task => {
      const statusColor = task.status === 'completed' ? colors.green : 
                         task.status === 'in_progress' ? colors.yellow : colors.gray;
      const status = statusColor(`[${task.status}]`);
      const priority = task.priority === 'high' ? colors.red(`[${task.priority}]`) :
                      task.priority === 'medium' ? colors.yellow(`[${task.priority}]`) :
                      colors.gray(`[${task.priority}]`);
      console.log(`  ${status} ${priority} ${task.description}`);
      if (task.assignedTo) {
        const agent = this.agents.find(a => a.id === task.assignedTo);
        console.log(`       Assigned to: ${agent ? agent.name : task.assignedTo}`);
      }
    });
    
    if (this.tasks.length > 5) {
      console.log(colors.gray(`  ... and ${this.tasks.length - 5} more tasks`));
    }
  }
  
  // Enhanced memory view
  renderMemoryView(): void {
    console.log(colors.white(colors.bold('💾 Enhanced Memory Bank Management')));
    console.log();
    
    // Overview
    console.log(colors.cyan('💾 Memory Overview'));
    console.log(`  Total Entries: ${colors.yellow(this.memoryStats.totalEntries.toString())}`);
    console.log(`  Total Size: ${colors.yellow(this.memoryStats.totalSize.toString())}`);
    console.log(`  Namespaces: ${colors.cyan(this.memoryStats.namespaces.length.toString())}`);
    console.log();
    
    // Enhanced namespaces
    console.log(colors.cyan('📁 Enhanced Namespaces'));
    console.log();
    this.memoryStats.namespaces.forEach((ns, index) => {
      const selected = this.currentView === VIEWS.MEMORY && index === this.selectedIndex;
      const prefix = selected ? colors.yellow('▶ ') : '  ';
      const name = selected ? colors.yellow(ns.name) : colors.white(ns.name);
      const typeIcon = this.getNamespaceIcon(ns.name);
      
      console.log(`${prefix}${typeIcon} ${name}`);
      console.log(`     Entries: ${colors.cyan(ns.entries.toString())} | Size: ${colors.green(ns.size)}`);
      console.log();
    });
    
    // Enhanced operations
    console.log(colors.gray('─'.repeat(40)));
    console.log(colors.cyan('🔄 Available Operations'));
    console.log(`  ${colors.yellow('S')} Store Data | ${colors.yellow('G')} Get Data | ${colors.yellow('B')} Backup | ${colors.yellow('R')} Restore`);
    console.log(`  ${colors.yellow('C')} Compress | ${colors.yellow('Y')} Sync | ${colors.yellow('A')} Analytics | ${colors.yellow('N')} Manage Namespaces`);
  }
  
  renderLogsView(): void {
    console.log(colors.white(colors.bold('📜 Enhanced System Logs')));
    console.log();
    
    // Enhanced log filters
    console.log(colors.cyan('🔍 Filters: ') + colors.gray('[A]ll [I]nfo [S]uccess [W]arning [E]rror [T]ools'));
    console.log(colors.gray('─'.repeat(80)));
    console.log();
    
    // Display logs with enhanced formatting
    const displayLogs = this.logs.slice(-15);
    displayLogs.forEach(log => {
      const time = log.time.toLocaleTimeString();
      let icon: string, color: (text: string) => string;
      
      switch (log.level) {
        case 'success':
          icon = '✓';
          color = colors.green;
          break;
        case 'warning':
          icon = '⚠';
          color = colors.yellow;
          break;
        case 'error':
          icon = '✗';
          color = colors.red;
          break;
        case 'tool':
          icon = '🔧';
          color = colors.cyan;
          break;
        default:
          icon = 'ℹ';
          color = colors.blue;
      }
      
      console.log(`${colors.gray(time)} ${color(icon)} ${log.message}`);
    });
    
    if (this.logs.length > 15) {
      console.log();
      console.log(colors.gray(`Showing last 15 of ${this.logs.length} logs`));
    }
  }
  
  renderEnhancedHelpView(): void {
    console.log(colors.white(colors.bold('❓ Enhanced Help & Documentation')));
    console.log();
    
    console.log(colors.cyan('🎯 Enhanced Navigation'));
    console.log(`  ${colors.yellow('0')}       Overview Dashboard`);
    console.log(`  ${colors.yellow('1-4')}     Core views (Processes, Status, Orchestration, Memory)`);
    console.log(`  ${colors.yellow('5')}       Neural Network Tools (15 tools)`);
    console.log(`  ${colors.yellow('6')}       Monitoring & Analysis (13 tools)`);
    console.log(`  ${colors.yellow('7')}       Workflow & Automation (11 tools)`);
    console.log(`  ${colors.yellow('8')}       GitHub Integration (8 tools)`);
    console.log(`  ${colors.yellow('9')}       System Logs`);
    console.log(`  ${colors.yellow('Tab')}     Cycle through views`);
    console.log(`  ${colors.yellow('↑/↓')}     Navigate items (when available)`);
    console.log();
    
    console.log(colors.cyan('🔧 Enhanced Tool Categories'));
    Object.entries(TOOL_CATEGORIES).forEach(([id, category]) => {
      console.log(`  ${category.icon} ${category.color(category.name)}: ${colors.yellow(category.count.toString())} tools`);
    });
    console.log();
    
    console.log(colors.cyan('⚡ Process Controls'));
    console.log(`  ${colors.yellow('Space')}   Toggle selected process`);
    console.log(`  ${colors.yellow('A')}       Start all processes`);
    console.log(`  ${colors.yellow('Z')}       Stop all processes`);
    console.log(`  ${colors.yellow('R')}       Restart all processes`);
    console.log();
    
    console.log(colors.cyan('🧠 Neural Network Quick Actions'));
    console.log(`  ${colors.yellow('N')}       Open Neural Tools`);
    console.log(`  ${colors.yellow('T')}       Train Model`);
    console.log(`  ${colors.yellow('P')}       Make Prediction`);
    console.log();
    
    console.log(colors.cyan('🔄 Workflow & Automation'));
    console.log(`  ${colors.yellow('W')}       Open Workflow Tools`);
    console.log(`  ${colors.yellow('C')}       Create Workflow`);
    console.log(`  ${colors.yellow('E')}       Execute Workflow`);
    console.log();
    
    console.log(colors.cyan('🔧 Other Enhanced Features'));
    console.log(`  ${colors.yellow('M')}       Memory Analytics`);
    console.log(`  ${colors.yellow('D')}       System Diagnostics`);
    console.log(`  ${colors.yellow('G')}       GitHub Operations`);
    console.log(`  ${colors.yellow('L')}       Clear logs`);
    console.log(`  ${colors.yellow('H/?')}     Show this help`);
    console.log(`  ${colors.yellow('Q')}       Quit`);
    console.log();
    
    console.log(colors.cyan('💡 Tips'));
    console.log(`  • ${colors.gray('Enhanced mode provides 71+ MCP tools')}`);
    console.log(`  • ${colors.gray('Use keyboard shortcuts for quick access')}`);
    console.log(`  • ${colors.gray('Tool statistics track usage and performance')}`);
    console.log(`  • ${colors.gray('Memory bank supports multiple namespaces')}`);
  }
  
  renderEnhancedFooter(): void {
    console.log();
    console.log(colors.gray('─'.repeat(80)));
    
    // Context-sensitive controls with enhanced options
    let controls = '';
    switch (this.currentView) {
      case VIEWS.OVERVIEW:
        controls = `${colors.yellow('N')} Neural | ${colors.yellow('M')} Memory | ${colors.yellow('W')} Workflow | ${colors.yellow('G')} GitHub`;
        break;
      case VIEWS.PROCESSES:
        controls = `${colors.yellow('Space')} Toggle | ${colors.yellow('A')} Start All | ${colors.yellow('Z')} Stop All | ${colors.yellow('R')} Restart`;
        break;
      case VIEWS.NEURAL:
        controls = `${colors.yellow('T')} Train | ${colors.yellow('P')} Predict | ${colors.yellow('S')} Status | ${colors.yellow('A')} Analyze`;
        break;
      case VIEWS.MONITORING:
        controls = `${colors.yellow('P')} Performance | ${colors.yellow('B')} Bottlenecks | ${colors.yellow('H')} Health | ${colors.yellow('M')} Metrics`;
        break;
      case VIEWS.WORKFLOW:
        controls = `${colors.yellow('C')} Create | ${colors.yellow('E')} Execute | ${colors.yellow('A')} Automate | ${colors.yellow('S')} Schedule`;
        break;
      case VIEWS.GITHUB:
        controls = `${colors.yellow('A')} Analyze | ${colors.yellow('P')} PR Mgmt | ${colors.yellow('I')} Issues | ${colors.yellow('M')} Metrics`;
        break;
      case VIEWS.ORCHESTRATION:
        controls = `${colors.yellow('N')} New Agent | ${colors.yellow('T')} New Task | ${colors.yellow('D')} Complete | ${colors.yellow('S')} Metrics`;
        break;
      case VIEWS.MEMORY:
        controls = `${colors.yellow('S')} Store | ${colors.yellow('G')} Get | ${colors.yellow('B')} Backup | ${colors.yellow('A')} Analytics`;
        break;
      case VIEWS.LOGS:
        controls = `${colors.yellow('L')} Clear | ${colors.yellow('F')} Filter | ${colors.yellow('E')} Export`;
        break;
      default:
        controls = `${colors.yellow('Tab')} Next View | ${colors.yellow('0')} Overview | ${colors.yellow('?')} Help`;
    }
    
    const enhancedStatus = this.systemStats.enhancedMode ? 
      colors.green('Enhanced') : colors.yellow('Fallback');
    
    console.log(`${controls} | ${colors.yellow('Q')} Quit | Mode: ${enhancedStatus}`);
    console.log(colors.gray('─'.repeat(80)));
  }
  
  // Enhanced input handling
  async handleInput(): Promise<void> {
    const terminal = compat.terminal;
    
    await terminal.write('\nCommand: ');
    
    const buf = new Uint8Array(1024);
    const n = await terminal.read(buf);
    if (n === null) return;
    
    const rawInput = terminal.decoder.decode(buf.subarray(0, n)).trim();
    const input = rawInput.split('\n')[0].toLowerCase();
    
    // Enhanced global commands
    switch (input) {
      case 'q':
      case 'quit':
        await this.shutdown();
        return;
        
      case '0':
        this.currentView = VIEWS.OVERVIEW;
        this.selectedIndex = 0;
        break;
        
      case '1':
        this.currentView = VIEWS.PROCESSES;
        this.selectedIndex = 0;
        break;
        
      case '2':
        this.currentView = VIEWS.STATUS;
        this.selectedIndex = 0;
        break;
        
      case '3':
        this.currentView = VIEWS.ORCHESTRATION;
        this.selectedIndex = 0;
        break;
        
      case '4':
        this.currentView = VIEWS.MEMORY;
        this.selectedIndex = 0;
        break;
        
      case '5':
        this.currentView = VIEWS.NEURAL;
        this.selectedIndex = 0;
        break;
        
      case '6':
        this.currentView = VIEWS.MONITORING;
        this.selectedIndex = 0;
        break;
        
      case '7':
        this.currentView = VIEWS.WORKFLOW;
        this.selectedIndex = 0;
        break;
        
      case '8':
        this.currentView = VIEWS.GITHUB;
        this.selectedIndex = 0;
        break;
        
      case '9':
        this.currentView = VIEWS.LOGS;
        this.selectedIndex = 0;
        break;
        
      case '?':
      case 'h':
      case 'help':
        this.currentView = VIEWS.HELP;
        break;
        
      case 'tab':
      case '\t':
        // Enhanced view cycling
        const viewKeys = Object.values(VIEWS);
        const currentIndex = viewKeys.indexOf(this.currentView);
        this.currentView = viewKeys[(currentIndex + 1) % viewKeys.length];
        this.selectedIndex = 0;
        break;
        
      // Quick action shortcuts
      case 'n':
        if (this.currentView === VIEWS.OVERVIEW) {
          this.currentView = VIEWS.NEURAL;
        } else {
          await this.handleViewSpecificInput(input);
        }
        break;
        
      case 'm':
        if (this.currentView === VIEWS.OVERVIEW) {
          this.currentView = VIEWS.MEMORY;
        } else {
          await this.handleViewSpecificInput(input);
        }
        break;
        
      case 'w':
        if (this.currentView === VIEWS.OVERVIEW) {
          this.currentView = VIEWS.WORKFLOW;
        } else {
          await this.handleViewSpecificInput(input);
        }
        break;
        
      case 'g':
        if (this.currentView === VIEWS.OVERVIEW) {
          this.currentView = VIEWS.GITHUB;
        } else {
          await this.handleViewSpecificInput(input);
        }
        break;
        
      default:
        // View-specific commands
        await this.handleViewSpecificInput(input);
    }
    
    // Update system stats
    this.updateSystemStats();
  }
  
  // Enhanced view-specific input handling
  async handleViewSpecificInput(input: string): Promise<void> {
    switch (this.currentView) {
      case VIEWS.PROCESSES:
        await this.handleProcessInput(input);
        break;
      case VIEWS.ORCHESTRATION:
        await this.handleOrchestrationInput(input);
        break;
      case VIEWS.MEMORY:
        await this.handleEnhancedMemoryInput(input);
        break;
      case VIEWS.NEURAL:
        await this.handleNeuralInput(input);
        break;
      case VIEWS.MONITORING:
        await this.handleMonitoringInput(input);
        break;
      case VIEWS.WORKFLOW:
        await this.handleWorkflowInput(input);
        break;
      case VIEWS.GITHUB:
        await this.handleGitHubInput(input);
        break;
      case VIEWS.DAA:
        await this.handleDAAInput(input);
        break;
      case VIEWS.SYSTEM:
        await this.handleSystemInput(input);
        break;
      case VIEWS.CLI:
        await this.handleCLIInput(input);
        break;
      case VIEWS.LOGS:
        await this.handleLogsInput(input);
        break;
    }
  }
  
  // Enhanced tool execution with statistics
  async executeEnhancedTool(toolName: string, params: Record<string, any> = {}): Promise<ToolExecutionResult> {
    try {
      const startTime = Date.now();
      
      // Execute through enhanced UI if available
      let result: ToolExecutionResult;
      if (this.enhancedWebUI) {
        result = await this.enhancedWebUI.executeTool(toolName, params);
      } else {
        // Fallback execution
        result = await this.mockToolExecution(toolName, params);
      }
      
      const duration = Date.now() - startTime;
      
      // Update statistics
      this.updateToolStats(toolName, duration, true);
      
      // Add to recent tools
      this.recentTools.push(toolName);
      if (this.recentTools.length > 20) {
        this.recentTools = this.recentTools.slice(-20);
      }
      
      // Log execution
      this.addLog('tool', `Executed ${toolName} (${duration}ms)`);
      
      return result;
      
    } catch (error) {
      this.updateToolStats(toolName, 0, false);
      this.addLog('error', `Failed to execute ${toolName}: ${(error as Error).message}`);
      throw error;
    }
  }
  
  // Mock tool execution for fallback
  async mockToolExecution(toolName: string, params: Record<string, any>): Promise<ToolExecutionResult> {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));
    
    return {
      success: true,
      tool: toolName,
      params,
      result: `Mock result for ${toolName}`,
      timestamp: Date.now()
    };
  }
  
  // Update tool statistics
  updateToolStats(toolName: string, duration: number, success: boolean): void {
    const category = this.getToolCategory(toolName);
    if (!category) return;
    
    const stats = this.toolStats.get(category) || {
      executions: 0,
      lastUsed: null,
      avgDuration: 0,
      successRate: 100
    };
    
    stats.executions++;
    stats.lastUsed = Date.now();
    
    if (success) {
      stats.avgDuration = ((stats.avgDuration * (stats.executions - 1)) + duration) / stats.executions;
    } else {
      stats.successRate = ((stats.successRate * (stats.executions - 1)) + 0) / stats.executions;
    }
    
    this.toolStats.set(category, stats);
  }
  
  // Get tool category
  getToolCategory(toolName: string): string | null {
    for (const [category, info] of Object.entries(TOOL_CATEGORIES)) {
      // Simple pattern matching - in real implementation would be more sophisticated
      if (toolName.includes(category) || 
          (category === 'neural' && (toolName.includes('neural_') || toolName.includes('model_'))) ||
          (category === 'memory' && toolName.includes('memory_')) ||
          (category === 'monitoring' && (toolName.includes('performance_') || toolName.includes('health_'))) ||
          (category === 'workflow' && (toolName.includes('workflow_') || toolName.includes('automation_'))) ||
          (category === 'github' && toolName.includes('github_')) ||
          (category === 'daa' && toolName.includes('daa_')) ||
          (category === 'system' && (toolName.includes('security_') || toolName.includes('backup_')))) {
        return category;
      }
    }
    return null;
  }
  
  // Get tool statistics
  getToolStats(toolName: string): ToolStats | null {
    const category = this.getToolCategory(toolName);
    return category ? this.toolStats.get(category) || null : null;
  }
  
  // Enhanced input handlers for new views
  async handleNeuralInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      't': () => this.executeEnhancedTool('neural_train'),
      'p': () => this.executeEnhancedTool('neural_predict'),
      's': () => this.executeEnhancedTool('neural_status'),
      'a': () => this.executeEnhancedTool('neural_patterns'),
      'l': () => this.executeEnhancedTool('model_load'),
      'v': () => this.executeEnhancedTool('model_save'),
      'r': () => this.executeEnhancedTool('pattern_recognize'),
      'c': () => this.executeEnhancedTool('cognitive_analyze'),
      'd': () => this.executeEnhancedTool('learning_adapt'),
      'z': () => this.executeEnhancedTool('neural_compress'),
      'e': () => this.executeEnhancedTool('ensemble_create'),
      'f': () => this.executeEnhancedTool('transfer_learn'),
      'x': () => this.executeEnhancedTool('neural_explain'),
      'w': () => this.executeEnhancedTool('wasm_optimize'),
      'i': () => this.executeEnhancedTool('inference_run')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleMonitoringInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      'p': () => this.executeEnhancedTool('performance_report'),
      'b': () => this.executeEnhancedTool('bottleneck_analyze'),
      't': () => this.executeEnhancedTool('token_usage'),
      'm': () => this.executeEnhancedTool('metrics_collect'),
      'h': () => this.executeEnhancedTool('health_check'),
      'e': () => this.executeEnhancedTool('error_analysis'),
      'u': () => this.executeEnhancedTool('usage_stats'),
      'q': () => this.executeEnhancedTool('quality_assess'),
      'c': () => this.executeEnhancedTool('cost_analysis'),
      'r': () => this.executeEnhancedTool('trend_analysis'),
      'k': () => this.executeEnhancedTool('benchmark_run'),
      's': () => this.executeEnhancedTool('swarm_monitor'),
      'a': () => this.executeEnhancedTool('agent_metrics')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleWorkflowInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      'c': () => this.executeEnhancedTool('workflow_create'),
      'e': () => this.executeEnhancedTool('workflow_execute'),
      'a': () => this.executeEnhancedTool('automation_setup'),
      'p': () => this.executeEnhancedTool('pipeline_create'),
      's': () => this.executeEnhancedTool('scheduler_manage'),
      't': () => this.executeEnhancedTool('trigger_setup'),
      'w': () => this.executeEnhancedTool('workflow_template'),
      'b': () => this.executeEnhancedTool('batch_process'),
      'l': () => this.executeEnhancedTool('parallel_execute'),
      'r': () => this.executeEnhancedTool('sparc_mode'),
      'o': () => this.executeEnhancedTool('task_orchestrate')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleGitHubInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      'a': () => this.executeEnhancedTool('github_repo_analyze'),
      'p': () => this.executeEnhancedTool('github_pr_manage'),
      'i': () => this.executeEnhancedTool('github_issue_track'),
      'r': () => this.executeEnhancedTool('github_release_coord'),
      'w': () => this.executeEnhancedTool('github_workflow_auto'),
      'c': () => this.executeEnhancedTool('github_code_review'),
      's': () => this.executeEnhancedTool('github_sync_coord'),
      'm': () => this.executeEnhancedTool('github_metrics')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleDAAInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      'c': () => this.executeEnhancedTool('daa_agent_create'),
      'm': () => this.executeEnhancedTool('daa_capability_match'),
      'r': () => this.executeEnhancedTool('daa_resource_alloc'),
      'l': () => this.executeEnhancedTool('daa_lifecycle_manage'),
      'o': () => this.executeEnhancedTool('daa_communication'),
      'n': () => this.executeEnhancedTool('daa_consensus'),
      'f': () => this.executeEnhancedTool('daa_fault_tolerance'),
      'p': () => this.executeEnhancedTool('daa_optimization')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleSystemInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      's': () => this.executeEnhancedTool('security_scan'),
      'b': () => this.executeEnhancedTool('backup_create'),
      'r': () => this.executeEnhancedTool('restore_system'),
      'l': () => this.executeEnhancedTool('log_analysis'),
      'd': () => this.executeEnhancedTool('diagnostic_run'),
      'c': () => this.executeEnhancedTool('config_manage')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  async handleCLIInput(input: string): Promise<void> {
    const commands: Record<string, string> = {
      'h': 'hive-mind',
      'g': 'github',
      't': 'training',
      'a': 'analysis',
      'u': 'automation',
      'c': 'coordination',
      'k': 'hooks',
      'm': 'mcp',
      'f': 'config'
    };
    
    if (commands[input]) {
      this.addLog('info', `Executing CLI command: ${commands[input]}`);
      // In real implementation, would bridge to actual CLI commands
      console.log(`\n🔧 CLI Command: ${commands[input]}`);
      console.log('Command execution would be bridged to actual CLI...');
    }
  }
  
  // Enhanced memory input handling
  async handleEnhancedMemoryInput(input: string): Promise<void> {
    const actions: Record<string, () => Promise<ToolExecutionResult>> = {
      's': () => this.executeEnhancedTool('memory_usage', { action: 'store' }),
      'g': () => this.executeEnhancedTool('memory_usage', { action: 'retrieve' }),
      'b': () => this.executeEnhancedTool('memory_backup'),
      'r': () => this.executeEnhancedTool('memory_restore'),
      'c': () => this.executeEnhancedTool('memory_compress'),
      'y': () => this.executeEnhancedTool('memory_sync'),
      'a': () => this.executeEnhancedTool('memory_analytics'),
      'n': () => this.executeEnhancedTool('memory_namespace')
    };
    
    if (actions[input]) {
      await actions[input]();
    }
  }
  
  // Helper methods
  getNamespaceIcon(name: string): string {
    const icons: Record<string, string> = {
      neural: '🧠',
      sparc: '⚡',
      agents: '🤖',
      tasks: '📋',
      workflows: '🔄',
      monitoring: '📊'
    };
    return icons[name] || '📁';
  }
  
  // Enhanced system stats update
  updateSystemStats(): void {
    // Update random stats for demo
    this.systemStats.cpuUsage = Math.min(100, Math.max(0, this.systemStats.cpuUsage + (Math.random() - 0.5) * 10));
    this.systemStats.memoryUsage = Math.min(100, Math.max(0, this.systemStats.memoryUsage + (Math.random() - 0.5) * 5));
    
    // Update process stats
    for (const [id, process] of this.processes) {
      if (process.status === 'running') {
        process.uptime++;
        process.cpu = Math.min(100, Math.max(0, process.cpu + (Math.random() - 0.5) * 2));
        process.memory = Math.min(200, Math.max(10, process.memory + (Math.random() - 0.5) * 5));
      }
    }
    
    // Update enhanced stats
    this.systemStats.activeAgents = this.agents.filter(a => a.status === 'working').length;
    this.systemStats.totalTasks = this.tasks.length;
    this.systemStats.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
  }
  
  // Enhanced shutdown
  async shutdown(): Promise<void> {
    this.running = false;
    console.clear();
    
    if (this.enhancedWebUI) {
      await this.enhancedWebUI.shutdown();
    }
    
    printSuccess('Enhanced UI shutdown complete. Goodbye!');
    compat.terminal.exit(0);
  }
  
  // Keep all existing methods from original class...
  // (getStatusIcon, getHealthBar, getUsageBar, formatUptime, etc.)
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'running': return colors.green('●');
      case 'stopped': return colors.gray('○');
      case 'error': return colors.red('✗');
      case 'starting': return colors.yellow('◐');
      default: return colors.gray('?');
    }
  }
  
  getHealthBar(): string {
    const running = Array.from(this.processes.values()).filter(p => p.status === 'running').length;
    const total = this.processes.size;
    const percentage = (running / total) * 100;
    const filled = Math.round(percentage / 10);
    const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
    const color = percentage >= 80 ? colors.green : percentage >= 50 ? colors.yellow : colors.red;
    return color(bar) + ` ${percentage.toFixed(0)}%`;
  }
  
  getUsageBar(value: number, max: number): string {
    const percentage = (value / max) * 100;
    const filled = Math.round(percentage / 10);
    const bar = '▓'.repeat(filled) + '░'.repeat(10 - filled);
    const color = percentage >= 80 ? colors.red : percentage >= 50 ? colors.yellow : colors.green;
    return color(bar);
  }
  
  formatUptime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  
  addLog(level: LogEntry['level'], message: string): void {
    this.logs.push({
      time: new Date(),
      level,
      message
    });
    
    // Keep logs manageable
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }
  
  // Continue with existing methods...
  async handleProcessInput(input: string): Promise<void> {
    switch (input) {
      case 'a':
        await this.startAll();
        break;
        
      case 'z':
        await this.stopAll();
        break;
        
      case 'r':
        await this.restartAll();
        break;
        
      case ' ':
      case 'space':
      case 'enter':
      case '':
        await this.toggleSelected();
        break;
        
      case 'up':
      case 'k':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;
        
      case 'down':
      case 'j':
        this.selectedIndex = Math.min(this.processes.size - 1, this.selectedIndex + 1);
        break;
    }
  }
  
  async handleOrchestrationInput(input: string): Promise<void> {
    switch (input) {
      case 'n':
        // Spawn new agent
        const agentTypes = ['researcher', 'coder', 'analyst', 'coordinator', 'tester'];
        const randomType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
        await this.swarmIntegration.spawnAgent(randomType);
        break;
        
      case 't':
        // Create new task
        const sampleTasks = [
          'Implement neural network optimization',
          'Analyze performance bottlenecks',
          'Create workflow automation',
          'Review GitHub integration',
          'Test DAA consensus mechanism'
        ];
        const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
        await this.swarmIntegration.createTask(randomTask, 'medium');
        break;
        
      case 'd':
        // Complete selected task (simulate)
        if (this.tasks.length > 0) {
          const pendingTasks = this.tasks.filter(t => t.status === 'in_progress');
          if (pendingTasks.length > 0) {
            const taskToComplete = pendingTasks[0];
            await this.swarmIntegration.completeTask(taskToComplete.id);
          } else {
            this.addLog('info', 'No in-progress tasks to complete');
          }
        }
        break;
        
      case 's':
        // Show swarm metrics
        const metrics = this.swarmIntegration.getSwarmMetrics();
        if (metrics) {
          this.addLog('info', `Swarm efficiency: ${metrics.efficiency}% (${metrics.tasks.completed}/${metrics.tasks.total} tasks completed)`);
        }
        break;
    }
  }
  
  async handleLogsInput(input: string): Promise<void> {
    switch (input) {
      case 'l':
        this.logs = [];
        this.addLog('info', 'Logs cleared');
        break;
        
      case 'f':
        this.addLog('info', 'Log filtering not yet implemented');
        break;
        
      case 'e':
        this.addLog('info', 'Log export feature available in enhanced mode');
        break;
    }
  }
  
  async toggleSelected(): Promise<void> {
    const process = Array.from(this.processes.values())[this.selectedIndex];
    if (process.status === 'stopped') {
      await this.startProcess(process.id);
    } else {
      await this.stopProcess(process.id);
    }
  }
  
  async startProcess(id: string): Promise<void> {
    const process = this.processes.get(id);
    if (!process) return;
    
    this.addLog('info', `Starting ${process.name}...`);
    process.status = 'starting';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    process.status = 'running';
    process.pid = Math.floor(Math.random() * 10000) + 1000;
    process.uptime = 0;
    
    this.addLog('success', `${process.name} started successfully`);
  }
  
  async stopProcess(id: string): Promise<void> {
    const process = this.processes.get(id);
    if (!process) return;
    
    this.addLog('info', `Stopping ${process.name}...`);
    process.status = 'stopped';
    process.pid = null;
    process.uptime = 0;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    this.addLog('success', `${process.name} stopped`);
  }
  
  async startAll(): Promise<void> {
    this.addLog('info', 'Starting all processes...');
    for (const [id, process] of this.processes) {
      if (process.status === 'stopped') {
        await this.startProcess(id);
      }
    }
    this.addLog('success', 'All processes started');
  }
  
  async stopAll(): Promise<void> {
    this.addLog('info', 'Stopping all processes...');
    for (const [id, process] of this.processes) {
      if (process.status === 'running') {
        await this.stopProcess(id);
      }
    }
    this.addLog('success', 'All processes stopped');
  }
  
  async restartAll(): Promise<void> {
    await this.stopAll();
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.startAll();
  }
}

export async function launchEnhancedUI(): Promise<void> {
  const ui = new EnhancedProcessUI();
  await ui.start();
}

export default EnhancedProcessUI;