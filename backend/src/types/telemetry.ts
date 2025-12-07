export type TelemetryKind = 'event' | 'metric' | 'log';

export interface TelemetryActor {
  id?: string;
  role?: string;
  region?: string;
  tenant?: string;
}

export interface TelemetryPayload {
  kind: TelemetryKind;
  timestamp: string;
  sessionId?: string;
  serviceName: string;
  environment?: string;
  name: string;
  eventType?: string;
  severity?: string;
  value?: number;
  unit?: string;
  level?: string;
  attributes?: Record<string, unknown>;
  actor?: TelemetryActor;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
}


