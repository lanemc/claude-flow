/**
 * MCP (Model Context Protocol) Types and Interfaces
 * Type definitions for MCP server, tools, resources, and client communication
 */

// Base MCP Protocol Types
export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface MCPRequest extends MCPMessage {
  method: string;
  params?: any;
}

export interface MCPResponse extends MCPMessage {
  result?: any;
  error?: MCPError;
}

// Server Capabilities and Info
export interface MCPServerCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
}

export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities?: MCPServerCapabilities;
}

// Tool Definitions
export interface MCPToolInputSchema {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: MCPToolInputSchema;
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: MCPContent[];
  isError?: boolean;
}

// Content Types
export type MCPContentType = 'text' | 'image' | 'resource';

export interface MCPTextContent {
  type: 'text';
  text: string;
}

export interface MCPImageContent {
  type: 'image';
  data: string; // base64 encoded
  mimeType: string;
}

export interface MCPResourceContent {
  type: 'resource';
  resource: {
    uri: string;
    text?: string;
    blob?: string;
    mimeType?: string;
  };
}

export type MCPContent = MCPTextContent | MCPImageContent | MCPResourceContent;

// Resource Definitions
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPResourceContents {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

// Swarm and Agent Types
export interface SwarmConfiguration {
  topology: 'hierarchical' | 'mesh' | 'ring' | 'star';
  maxAgents: number;
  strategy: string;
}

export interface SwarmInitResult {
  success: boolean;
  swarmId: string;
  topology: string;
  maxAgents: number;
  strategy: string;
  status: 'initialized' | 'running' | 'stopped' | 'error';
  timestamp: string;
}

export interface AgentSpawnResult {
  success: boolean;
  agentId: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'busy' | 'error';
  capabilities: string[];
  timestamp: string;
}

// Neural Network Types
export interface NeuralTrainingArgs {
  pattern_type: 'coordination' | 'optimization' | 'prediction';
  training_data: string;
  epochs?: number;
}

export interface NeuralTrainingResult {
  success: boolean;
  modelId: string;
  pattern_type: string;
  epochs: number;
  accuracy: number;
  training_time: number;
  status: 'completed' | 'failed' | 'in_progress';
  improvement_rate: 'converged' | 'improving' | 'declining';
  data_source: string;
  timestamp: string;
}

export interface ModelSaveResult {
  success: boolean;
  modelId: string;
  savePath: string;
  modelSize: string;
  version: string;
  saved: boolean;
  timestamp: string;
}

export interface ModelLoadResult {
  success: boolean;
  modelPath: string;
  modelId: string;
  modelType: string;
  version: string;
  parameters: number;
  accuracy: number;
  loaded: boolean;
  timestamp: string;
}

export interface NeuralPredictionResult {
  success: boolean;
  modelId: string;
  input: string;
  prediction: {
    outcome: 'success' | 'optimization_needed' | 'failure';
    confidence: number;
    alternatives: string[];
    recommended_action: string;
  };
  inference_time_ms: number;
  timestamp: string;
}

// Memory System Types
export interface MemoryOperation {
  action: 'store' | 'retrieve' | 'list' | 'delete' | 'search';
  key?: string;
  value?: string;
  namespace?: string;
  ttl?: number;
  limit?: number;
  pattern?: string;
}

export interface MemoryStoreResult {
  success: boolean;
  action: 'store';
  key: string;
  namespace: string;
  stored: boolean;
  size: number;
  id: string;
  timestamp: string;
}

export interface MemoryRetrieveResult {
  success: boolean;
  action: 'retrieve';
  key: string;
  value: any;
  found: boolean;
  namespace: string;
  timestamp: string;
}

export interface MemoryListResult {
  success: boolean;
  action: 'list';
  namespace: string;
  entries: Array<{
    key: string;
    value: any;
    metadata?: any;
    timestamp: string;
  }>;
  count: number;
  timestamp: string;
}

export interface MemorySearchResult {
  success: boolean;
  action: 'search';
  pattern: string;
  namespace: string;
  results: Array<{
    key: string;
    value: any;
    score?: number;
    metadata?: any;
  }>;
  count: number;
  timestamp: string;
}

// Performance and Monitoring Types
export interface PerformanceReport {
  success: boolean;
  timeframe: '24h' | '7d' | '30d';
  format: 'summary' | 'detailed' | 'json';
  metrics: {
    tasks_executed: number;
    success_rate: number;
    avg_execution_time: number;
    agents_spawned: number;
    memory_efficiency: number;
    neural_events: number;
  };
  timestamp: string;
}

// GitHub Integration Types
export interface GitHubRepoAnalysis {
  repo: string;
  analysis_type: 'code_quality' | 'performance' | 'security';
}

export interface GitHubPRManagement {
  repo: string;
  pr_number?: number;
  action: 'review' | 'merge' | 'close';
}

// Workflow and DAA Types
export interface WorkflowCreation {
  name: string;
  steps: Array<{
    name: string;
    type: string;
    config: any;
  }>;
  triggers: Array<{
    type: string;
    condition: any;
  }>;
}

export interface DAAAgentCreation {
  agent_type: string;
  capabilities: string[];
  resources: Record<string, any>;
}

export interface DAACapabilityMatch {
  task_requirements: string[];
  available_agents: Array<{
    id: string;
    type: string;
    capabilities: string[];
  }>;
}

// SPARC Mode Types
export interface SPARCMode {
  mode: 'dev' | 'api' | 'ui' | 'test' | 'refactor';
  task_description: string;
  options?: Record<string, any>;
}

// Tool Execution Result Types
export type MCPToolExecutionResult = 
  | SwarmInitResult
  | AgentSpawnResult
  | NeuralTrainingResult
  | ModelSaveResult
  | ModelLoadResult
  | NeuralPredictionResult
  | MemoryStoreResult
  | MemoryRetrieveResult
  | MemoryListResult
  | MemorySearchResult
  | PerformanceReport
  | PatternRecognitionResult
  | CognitiveAnalysisResult
  | LearningAdaptationResult
  | ModelCompressionResult
  | EnsembleCreationResult
  | TransferLearningResult
  | NeuralExplanationResult
  | { success: boolean; tool: string; message: string; args: any; timestamp: string }
  | { success: false; error: string; timestamp: string };

// Enhanced Memory Store Interface
export interface EnhancedMemoryStore {
  initialize(): Promise<void>;
  store(key: string, value: any, options?: {
    namespace?: string;
    ttl?: number;
    metadata?: any;
  }): Promise<{ size: number; id: string }>;
  retrieve(key: string, options?: {
    namespace?: string;
  }): Promise<any>;
  list(options?: {
    namespace?: string;
    limit?: number;
  }): Promise<Array<{
    key: string;
    value: any;
    metadata?: any;
    timestamp: string;
  }>>;
  delete(key: string, options?: {
    namespace?: string;
  }): Promise<boolean>;
  search(pattern: string, options?: {
    namespace?: string;
    limit?: number;
  }): Promise<Array<{
    key: string;
    value: any;
    score?: number;
    metadata?: any;
  }>>;
  close?(): Promise<void>;
}

// Server Class Interface
export interface ClaudeFlowMCPServerInterface {
  version: string;
  sessionId: string;
  capabilities: MCPServerCapabilities;
  tools: Record<string, MCPTool>;
  resources: Record<string, MCPResource>;
  memoryStore?: EnhancedMemoryStore;

  initializeMemory(): Promise<void>;
  initializeTools(): Record<string, MCPTool>;
  initializeResources(): Record<string, MCPResource>;
  
  handleMessage(message: MCPMessage): Promise<MCPResponse>;
  handleInitialize(id: string | number, params?: any): MCPResponse;
  handleToolsList(id: string | number): MCPResponse;
  handleToolCall(id: string | number, params: { name: string; arguments: Record<string, any> }): Promise<MCPResponse>;
  handleResourcesList(id: string | number): MCPResponse;
  handleResourceRead(id: string | number, params: { uri: string }): Promise<MCPResponse>;
  
  executeTool(name: string, args: Record<string, any>): Promise<MCPToolExecutionResult>;
  readResource(uri: string): Promise<any>;
  
  handleMemoryUsage(args: MemoryOperation): Promise<MemoryStoreResult | MemoryRetrieveResult | MemoryListResult | MemorySearchResult | { success: false; error: string; timestamp: string }>;
  handleMemorySearch(args: { pattern: string; namespace?: string; limit?: number }): Promise<MemorySearchResult | { success: false; error: string; timestamp: string }>;
  
  createErrorResponse(id: string | number, code: number, message: string, data?: any): MCPResponse;
}

// Pattern Recognition Types
export interface PatternRecognitionResult {
  success: boolean;
  data: any[];
  patterns_detected: {
    coordination_patterns: number;
    efficiency_patterns: number;
    success_indicators: number;
  };
  pattern_confidence: number;
  recommendations: string[];
  processing_time_ms: number;
  timestamp: string;
}

// Cognitive Analysis Types
export interface CognitiveAnalysisResult {
  success: boolean;
  behavior: string;
  analysis: {
    behavior_type: string;
    complexity_score: number;
    efficiency_rating: number;
    improvement_potential: number;
  };
  insights: string[];
  neural_feedback: {
    pattern_strength: number;
    learning_rate: number;
    adaptation_score: number;
  };
  timestamp: string;
}

// Learning Adaptation Types
export interface LearningAdaptationResult {
  success: boolean;
  experience: any;
  adaptation_results: {
    model_version: string;
    performance_delta: string;
    training_samples: number;
    accuracy_improvement: string;
    confidence_increase: string;
  };
  learned_patterns: string[];
  next_learning_targets: string[];
  timestamp: string;
}

// Model Compression Types
export interface ModelCompressionResult {
  success: boolean;
  modelId: string;
  compression_ratio: number;
  compressed_model: {
    original_size: string;
    compressed_size: string;
    size_reduction: string;
    accuracy_retention: string;
    inference_speedup: string;
  };
  optimization_details: {
    pruned_connections: number;
    quantization_applied: boolean;
    wasm_optimized: boolean;
  };
  timestamp: string;
}

// Ensemble Creation Types
export interface EnsembleCreationResult {
  success: boolean;
  models: string[];
  ensemble_id: string;
  strategy: string;
  ensemble_metrics: {
    total_models: number;
    combined_accuracy: number;
    inference_time: string;
    memory_usage: string;
    consensus_threshold: number;
  };
  model_weights: number[];
  performance_gain: string;
  timestamp: string;
}

// Transfer Learning Types
export interface TransferLearningResult {
  success: boolean;
  sourceModel: string;
  targetDomain: string;
  transfer_results: {
    adaptation_rate: number;
    knowledge_retention: number;
    domain_fit_score: number;
    training_reduction: string;
  };
  transferred_features: string[];
  new_model_id: string;
  performance_metrics: {
    accuracy: number;
    inference_speed: string;
    memory_efficiency: string;
  };
  timestamp: string;
}

// Neural Explanation Types
export interface NeuralExplanationResult {
  success: boolean;
  modelId: string;
  prediction: any;
  explanation: {
    decision_factors: Array<{
      factor: string;
      importance: number;
    }>;
    feature_importance: Record<string, number>;
    reasoning_path: string[];
  };
  confidence_breakdown: {
    model_certainty: number;
    data_quality: number;
    pattern_match: number;
  };
  timestamp: string;
}

// Resource Content Types
export interface SwarmResourceContent {
  active_swarms: number;
  total_agents: number;
  topologies: string[];
  performance: string;
}

export interface AgentResourceContent {
  total_agents: number;
  types: string[];
  active: number;
  capabilities: number;
}

export interface ModelResourceContent {
  total_models: number;
  wasm_enabled: boolean;
  simd_support: boolean;
  training_active: boolean;
  accuracy_avg: number;
}

export interface PerformanceResourceContent {
  uptime: string;
  token_reduction: string;
  swe_bench_rate: string;
  speed_improvement: string;
  memory_efficiency: string;
}

// MCP Server Integration Interfaces
export interface MCPServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  registerTool(tool: MCPTool): void;
  getHealthStatus(): Promise<{
    healthy: boolean;
    error?: string;
    metrics?: Record<string, number>;
  }>;
  getMetrics(): any;
  getSessions(): any[];
  getSession(sessionId: string): any | undefined;
  terminateSession(sessionId: string): void;
}

export interface MCPLifecycleManager {
  start(): Promise<void>;
  stop(): Promise<void>;
  getState(): string;
  isHealthy(): Promise<boolean>;
  registerHealthCheck(name: string, check: () => Promise<boolean>): void;
  unregisterHealthCheck(name: string): void;
  restart(): Promise<void>;
}

export interface MCPPerformanceMonitor {
  start(): void;
  stop(): void;
  recordMetrics(metrics: any): void;
  getMetrics(): any;
  getAlerts(): any[];
  addAlertRule(rule: any): void;
  removeAlertRule(ruleId: string): void;
}

export interface MCPOrchestrationConfig {
  enabledIntegrations: {
    orchestrator: boolean;
    swarm: boolean;
    agents: boolean;
    resources: boolean;
    memory: boolean;
    monitoring: boolean;
    terminals: boolean;
  };
  autoStart: boolean;
  healthCheckInterval: number;
  reconnectAttempts: number;
  reconnectDelay: number;
  enableMetrics: boolean;
  enableAlerts: boolean;
}

export interface OrchestrationComponents {
  orchestrator?: any;
  swarmCoordinator?: any;
  agentManager?: any;
  resourceManager?: any;
  memoryManager?: any;
  messageBus?: any;
  monitor?: any;
  eventBus?: any;
  terminalManager?: any;
}

export interface MCPOrchestrationIntegration {
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): Map<string, any>;
  isHealthy(): boolean;
  getServer(): MCPServer | undefined;
  getLifecycleManager(): MCPLifecycleManager | undefined;
  getPerformanceMonitor(): MCPPerformanceMonitor | undefined;
}

export interface MCPProtocolManager {
  negotiate(clientVersion: any): Promise<any>;
  validateRequest(request: any): boolean;
  getVersion(): any;
  isCompatible(version: any): boolean;
}