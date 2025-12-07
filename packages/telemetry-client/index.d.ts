export type TelemetrySeverity = 'info' | 'warn' | 'error' | 'critical';

export interface TelemetryClientConfig {
  serviceName: string;
  environment?: string;
  endpoint?: string;
  useBeacon?: boolean;
  consoleDiagnostics?: boolean;
}

export interface TelemetryActor {
  id?: string;
  role?: string;
  region?: string;
  tenant?: string;
}

export interface TelemetryEventInput {
  name?: string;
  eventType?: string;
  severity?: TelemetrySeverity;
  attributes?: Record<string, unknown>;
  actor?: TelemetryActor;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
}

export interface TelemetryMetricInput {
  name: string;
  value: number;
  unit?: string;
  attributes?: Record<string, unknown>;
}

export interface TelemetryLogInput {
  level?: TelemetrySeverity;
  message: string;
  attributes?: Record<string, unknown>;
}

export declare class TelemetryClient {
  constructor(config?: TelemetryClientConfig);
  trackEvent(event: TelemetryEventInput): Promise<boolean>;
  trackMetric(metric: TelemetryMetricInput): Promise<boolean>;
  trackLog(log: TelemetryLogInput): Promise<boolean>;
}

export declare const createTelemetryClient: (config: TelemetryClientConfig) => TelemetryClient;


