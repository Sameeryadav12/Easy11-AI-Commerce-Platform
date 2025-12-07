# Chaos Testing

Scenarios
- Kill API pod; verify auto-restart and no 5xx > 1%.
- Remove DB replica; ensure reads route to primary without data loss.
- Add 200ms network latency; observe degradation and alert timings.
- Stop ML service; verify graceful fallback for dependent features.

Schedule
- Monthly chaos experiments in staging; quarterly in prod with approval.

Evidence
- Record metrics, alerts, recovery times; attach to compliance evidence.


