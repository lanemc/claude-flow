// Validation types for SPARC initialization

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  timestamp?: string;
}

export interface ModeAvailabilityResult extends ValidationResult {
  modes: {
    total: number;
    available: number;
    unavailable: string[];
  };
}

export interface TemplateIntegrityResult extends ValidationResult {
  templates: {
    found: string[];
    missing: string[];
    corrupted: string[];
  };
}

export interface ConsistencyCheck {
  consistent: boolean;
  issues: string[];
}

export interface ConfigConsistencyResult extends ValidationResult {
  consistency: {
    roomodes?: ConsistencyCheck;
    claude?: ConsistencyCheck;
    memory?: ConsistencyCheck;
  };
}

export interface ResourceCheck {
  adequate: boolean;
  available?: number;
  used?: number;
  open?: number;
  limit?: number;
  limits?: Record<string, any>;
}

export interface SystemResourcesResult extends ValidationResult {
  resources: {
    disk?: ResourceCheck;
    memory?: ResourceCheck;
    fileDescriptors?: ResourceCheck;
    processes?: ResourceCheck;
  };
}

export interface HealthCheck {
  healthy: boolean;
  errors?: string[];
  warnings?: string[];
  readWrite?: boolean;
  permissions?: boolean;
  processes?: any[];
  connectivity?: boolean;
  integrations?: Record<string, any>;
}

export interface DiagnosticsResult extends ValidationResult {
  diagnostics: {
    filesystem?: HealthCheck;
    processes?: HealthCheck;
    network?: HealthCheck;
    integration?: HealthCheck;
  };
}

export interface TestResult {
  passed: boolean;
  testName: string;
  duration: number;
  errors?: string[];
  warnings?: string[];
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}

export interface ValidatorConfig {
  workingDir: string;
  skipTests?: string[];
  verbose?: boolean;
  timeout?: number;
}

export interface ModeConfig {
  modes?: Record<string, any>;
  version?: string;
  [key: string]: any;
}