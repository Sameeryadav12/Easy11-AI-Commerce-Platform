const defaultEndpoint = 'http://localhost:5000/api/v1/telemetry/events';

const getGlobal = () => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  return {};
};

const safeGlobal = getGlobal();

const generateId = () => {
  if (safeGlobal.crypto?.randomUUID) {
    return safeGlobal.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const nowIso = () => new Date().toISOString();

const clone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value ?? {}));
  } catch {
    return {};
  }
};

class TelemetryClient {
  constructor(config = {}) {
    this.serviceName = config.serviceName || 'unknown-service';
    this.environment = config.environment || process.env.NODE_ENV || 'development';
    this.endpoint = config.endpoint || defaultEndpoint;
    this.consoleDiagnostics = config.consoleDiagnostics ?? true;
    this.useBeacon = config.useBeacon ?? true;
    this.sessionKey = `easy11::session::${this.serviceName}`;
    this.sessionId = this.resolveSessionId();
    this.deviceId = this.resolveDeviceId();
    this.baseAttributes = {
      service: this.serviceName,
      environment: this.environment,
      deviceId: this.deviceId,
      userAgent: safeGlobal.navigator?.userAgent,
      language: safeGlobal.navigator?.language,
      platform: safeGlobal.navigator?.platform,
    };
  }

  resolveSessionId() {
    try {
      if (safeGlobal.sessionStorage) {
        const existing = safeGlobal.sessionStorage.getItem(this.sessionKey);
        if (existing) return existing;
        const id = generateId();
        safeGlobal.sessionStorage.setItem(this.sessionKey, id);
        return id;
      }
    } catch {
      // ignore
    }
    return generateId();
  }

  resolveDeviceId() {
    try {
      if (safeGlobal.localStorage) {
        const key = `${this.sessionKey}-device`;
        const existing = safeGlobal.localStorage.getItem(key);
        if (existing) return existing;
        const id = generateId();
        safeGlobal.localStorage.setItem(key, id);
        return id;
      }
    } catch {
      // ignore
    }
    return generateId();
  }

  trackEvent(event) {
    const payload = {
      kind: 'event',
      timestamp: nowIso(),
      sessionId: this.sessionId,
      serviceName: this.serviceName,
      environment: this.environment,
      name: event?.name || event?.eventType || 'event',
      eventType: event?.eventType || event?.name,
      severity: event?.severity || 'info',
      attributes: {
        ...clone(this.baseAttributes),
        ...clone(event?.attributes),
      },
      actor: event?.actor ? clone(event.actor) : undefined,
      correlationId: event?.correlationId,
      traceId: event?.traceId,
      spanId: event?.spanId,
    };

    return this.dispatch(payload);
  }

  trackMetric(metric) {
    const payload = {
      kind: 'metric',
      timestamp: nowIso(),
      sessionId: this.sessionId,
      serviceName: this.serviceName,
      environment: this.environment,
      name: metric?.name || 'metric',
      value: metric?.value ?? 0,
      unit: metric?.unit,
      attributes: {
        ...clone(this.baseAttributes),
        ...clone(metric?.attributes),
      },
    };

    return this.dispatch(payload);
  }

  trackLog(log) {
    const payload = {
      kind: 'log',
      timestamp: nowIso(),
      sessionId: this.sessionId,
      serviceName: this.serviceName,
      environment: this.environment,
      level: log?.level || 'info',
      message: log?.message || '',
      attributes: {
        ...clone(this.baseAttributes),
        ...clone(log?.attributes),
      },
    };

    return this.dispatch(payload);
  }

  async dispatch(payload) {
    try {
      const body = JSON.stringify(payload);

      if (this.useBeacon && typeof safeGlobal.navigator?.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        const queued = safeGlobal.navigator.sendBeacon(this.endpoint, blob);
        if (queued) {
          return true;
        }
      }

      if (typeof fetch === 'function') {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
          keepalive: true,
        });

        if (!response.ok && this.consoleDiagnostics) {
          console.warn('[Telemetry] Failed to send payload', response.statusText);
        }

        return response.ok;
      }
    } catch (error) {
      if (this.consoleDiagnostics) {
        console.warn('[Telemetry] Dispatch error', error);
      }
    }

    return false;
  }
}

export const createTelemetryClient = (config) => new TelemetryClient(config);
export { TelemetryClient };

