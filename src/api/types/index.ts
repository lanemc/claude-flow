/**
 * API Types and Interfaces
 * Type definitions for Express.js routes, request/response objects, and middleware
 */

import { Request, Response, NextFunction } from 'express';

// Base API Response Interface
export interface APIResponse<T = any> {
  success: boolean;
  timestamp: number;
  data?: T;
  error?: string;
  message?: string;
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  responseTime: number[];
  throughput: number[];
  errorRate: number;
  startTime: number;
  requestCount: number;
  errorCount: number;
}

// Metrics Store Interface
export interface MetricsStore {
  performance: PerformanceEntry[];
  tokens: TokenEntry[];
  errors: ErrorEntry[];
  health: HealthEntry[];
  load: LoadEntry[];
  costs: CostEntry[];
}

// Individual Entry Interfaces
export interface PerformanceEntry {
  timestamp: number;
  responseTime: number;
  statusCode: number;
  method: string;
  url: string;
}

export interface TokenEntry {
  timestamp: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  cost: number;
}

export interface ErrorEntry {
  timestamp: number;
  code: number;
  message: string;
  count: number;
}

export interface HealthEntry {
  timestamp: number;
  component: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface LoadEntry {
  timestamp: number;
  oneMin: number;
  fiveMin: number;
  fifteenMin: number;
  current: number;
}

export interface CostEntry {
  timestamp: number;
  compute: number;
  storage: number;
  network: number;
  tokens: number;
}

// Performance Report Interface
export interface PerformanceReport {
  timestamp: number;
  summary: string;
  metrics: {
    averageResponseTime: number;
    throughput: number;
    errorRate: number;
    uptime: string;
    totalRequests: number;
    totalErrors: number;
  };
  recommendations: string[];
  trends: {
    responseTime: number[];
    throughput: number[];
    errorRate: number[];
  };
}

// Bottleneck Analysis Interface
export interface Bottleneck {
  component: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
  value: number;
  threshold: number;
}

export interface BottleneckAnalysis {
  timestamp: number;
  bottlenecks: Bottleneck[];
  recommendations: string[];
  summary: string;
  impact: {
    score: number;
    level: 'low' | 'medium' | 'critical';
  };
}

// Token Usage Interface
export interface TokenUsage {
  timestamp: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  cost: number;
  efficiency: {
    cacheHitRate: number;
    inputOutputRatio: number;
    costPerToken: number;
  };
  trends: {
    daily: number[];
    hourly: number[];
  };
  recommendations: string[];
}

// Benchmark Results Interface
export interface BenchmarkResult {
  name: string;
  score: number;
  unit: string;
  baseline: number;
}

export interface BenchmarkReport {
  timestamp: number;
  benchmarks: Record<string, BenchmarkResult>;
  summary: string;
  score: number;
  comparisons: Array<{
    name: string;
    current: number;
    baseline: number;
    improvement: string;
  }>;
}

// System Metrics Interface
export interface SystemMetrics {
  timestamp: number;
  metrics: {
    system: {
      platform: string;
      architecture: string;
      uptime: number;
      loadAverage: number[];
    };
    memory: {
      total: number;
      free: number;
      usage: number;
    };
    cpu: {
      count: number;
      model: string;
      usage: number;
    };
    network: {
      interfaces: number;
      hostname: string;
    };
  };
  summary: string;
  alerts: Array<{
    type: 'warning' | 'critical';
    message: string;
    value: number;
  }>;
}

// Health Check Interface
export interface HealthCheck {
  timestamp: number;
  health: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    api: number;
    database: number;
  };
  summary: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  alerts: Array<{
    component: string;
    score: number;
    severity: 'warning' | 'critical';
    message: string;
  }>;
}

// Load Monitoring Interface
export interface LoadMonitor {
  timestamp: number;
  load: {
    oneMin: number;
    fiveMin: number;
    fifteenMin: number;
    thirtyMin: number;
    oneHour: number;
    twentyFourHour: number;
    current: number;
    peak: number;
    average: number;
  };
  summary: string;
  alerts: Array<{
    type: 'warning' | 'critical';
    message: string;
    value: number;
  }>;
  predictions: {
    nextHour: number;
    nextDay: number;
    nextWeek: number;
  };
}

// API Route Handler Types
export type APIRouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export interface APIRouteOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  middleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
  validation?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

// Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
  session?: {
    id: string;
    startTime: number;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: number;
}

export interface MetricsUpdateMessage extends WebSocketMessage {
  type: 'metrics_update';
  payload: {
    performance: {
      responseTime: number;
      throughput: number;
      errorRate: number;
      uptime: string;
    };
    tokens: TokenUsage;
    health: HealthCheck['health'];
    load: LoadMonitor['load'];
  };
}

// Error Types
export interface APIError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class ValidationError extends Error implements APIError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error implements APIError {
  statusCode = 404;
  code = 'NOT_FOUND';
  
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends Error implements APIError {
  statusCode = 500;
  code = 'INTERNAL_SERVER_ERROR';
  
  constructor(message: string = 'Internal server error', public details?: any) {
    super(message);
    this.name = 'InternalServerError';
  }
}

// Utility Types
export type Awaitable<T> = T | Promise<T>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Analysis Tool Response Types
export type AnalysisToolResponse<T = any> = APIResponse<T>;

export interface TrendAnalysis {
  timestamp: number;
  trends: {
    performance: {
      trend: 'improving' | 'declining' | 'stable';
      change: string;
      prediction: string;
    };
    usage: {
      trend: 'increasing' | 'decreasing' | 'stable';
      change: string;
      prediction: string;
    };
    errors: {
      trend: 'increasing' | 'decreasing' | 'stable';
      change: string;
      prediction: string;
    };
  };
  predictions: {
    nextWeek: string;
    nextMonth: string;
    nextQuarter: string;
  };
  summary: string;
  insights: string[];
}

export interface CostAnalysis {
  timestamp: number;
  costs: {
    current: {
      compute: number;
      storage: number;
      network: number;
      tokens: number;
    };
    previous: {
      compute: number;
      storage: number;
      network: number;
      tokens: number;
    };
    change: {
      compute: string;
      storage: string;
      network: string;
      tokens: string;
    };
  };
  summary: string;
  optimization: string[];
  forecast: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
}

export interface QualityAssessment {
  timestamp: number;
  quality: {
    performance: number;
    reliability: number;
    security: number;
    maintainability: number;
    scalability: number;
    documentation: number;
  };
  summary: string;
  score: number;
  recommendations: string[];
}

export interface ErrorAnalysis {
  timestamp: number;
  errors: {
    total: number;
    types: {
      '4xx': number;
      '5xx': number;
    };
    common: Array<{
      code: number;
      count: number;
      message: string;
    }>;
  };
  summary: string;
  patterns: string[];
  resolution: string[];
}

export interface UsageStatistics {
  timestamp: number;
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    topFeatures: Array<{
      name: string;
      usage: number;
    }>;
  };
  summary: string;
  insights: string[];
  trends: {
    users: number[];
    sessions: number[];
  };
}

export interface CapacityPlanning {
  timestamp: number;
  capacity: {
    current: {
      cpu: number;
      memory: number;
      storage: number;
      network: number;
    };
    projected: {
      cpu: number;
      memory: number;
      storage: number;
      network: number;
    };
    timeToLimit: {
      cpu: string;
      memory: string;
      storage: string;
      network: string;
    };
  };
  summary: string;
  recommendations: string[];
  timeline: {
    immediate: string;
    '1month': string;
    '2months': string;
    '3months': string;
    '6months': string;
  };
}