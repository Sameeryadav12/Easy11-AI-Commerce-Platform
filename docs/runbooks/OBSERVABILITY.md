# Observability

- Logs: Structured JSON via `lib/logger.ts`. Forward to Loki/Elastic in production.
- Metrics: Expose Prometheus-compatible counters/gauges; add labels (service, route, status).
- Traces: Initialize OpenTelemetry SDK in `lib/otel.ts` for API handlers; export to Tempo/Jaeger.
- Alerts: Create Grafana dashboards and alert rules for latency, 5xx, rate limit %, and auth failures.


