// Utility types for handling unknown data and type assertions

export type SafeUnknown = unknown;
export type SafeAny = any;

// Type guards for common scenarios
export function isStringOrUndefined(value: unknown): value is string | undefined {
  return typeof value === 'string' || value === undefined;
}

export function isStringOrNumber(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

export function hasProperty<T extends PropertyKey>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && prop in obj;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function asString(value: unknown, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : defaultValue;
}

export function asNumber(value: unknown, defaultValue: number = 0): number {
  return typeof value === 'number' && !isNaN(value) ? value : defaultValue;
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

// Type assertion helpers
export function assertString(value: unknown, context?: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string${context ? ` for ${context}` : ''}, got ${typeof value}`);
  }
  return value;
}

export function assertNumber(value: unknown, context?: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Expected number${context ? ` for ${context}` : ''}, got ${typeof value}`);
  }
  return value;
}

export function assertObject(value: unknown, context?: string): Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`Expected object${context ? ` for ${context}` : ''}, got ${typeof value}`);
  }
  return value;
}

// Safe property access
export function safeGet<T>(
  obj: unknown,
  path: string[],
  defaultValue?: T
): T | undefined {
  let current = obj;
  for (const key of path) {
    if (!isObject(current) || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  return current as T;
}

// Event data type helpers
export interface SafeEventData {
  [key: string]: unknown;
}

export function parseEventData(data: unknown): SafeEventData {
  return isObject(data) ? data : {};
}

// Metrics interface helpers
export interface MetricsProvider {
  getMetrics(): Promise<Record<string, number>> | Record<string, number>;
}

export function hasGetMetrics(obj: unknown): obj is MetricsProvider {
  return isObject(obj) && 'getMetrics' in obj && typeof obj.getMetrics === 'function';
}

// Common database result types
export interface DatabaseRow {
  [key: string]: unknown;
}

export interface QueryResult {
  rows?: DatabaseRow[];
  changes?: number;
  lastID?: number;
}

// Configuration helpers
export interface ConfigurableComponent {
  configure?(config: Record<string, unknown>): void | Promise<void>;
}

export function isConfigurable(obj: unknown): obj is ConfigurableComponent {
  return isObject(obj) && 'configure' in obj && typeof obj.configure === 'function';
}