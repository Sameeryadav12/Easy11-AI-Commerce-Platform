# Incident Playbooks

1) Service Outage
- Detect via alerts (5xx > threshold). Page on-call.
- Triage: identify scope; rollback recent deploy if needed.
- Communicate status page update and ETA.
- Postmortem within 48h with action items.

2) PII Breach
- Isolate affected systems and rotate secrets.
- Notify security, legal, and execs. Begin forensics.
- Customer/vendor notification per regulations.
- Update DPA evidence and audit logs.

3) API Overload
- Auto-scale and enforce rate limits. Enable WAF challenge.
- Defer non-critical jobs. Communicate degraded mode.

4) ML Drift
- Trigger retrain pipeline; freeze model if severe.
- Announce in Ops Command Center and update audit trail.


