# Disaster Recovery Plan (Dev Scaffold)

Objectives
- RPO < 15 min, RTO < 30 min for critical services.

Backups
- DB point-in-time backups every 5 min; test restore monthly.
- S3 bucket versioning + cross-region replication.

Failover
- Multi-region: Active in Region A, hot-standby Region B.
- Test DNS failover quarterly; document runbook steps.

Runbook (High-level)
1) Declare incident and form response team (roles in on-call doc).
2) Freeze deploys; capture current status and metrics.
3) If DB outage: promote replica; update application secrets if needed.
4) Shift traffic via global load balancer.
5) Verify health checks and partial functionality before full cutover.
6) Post-incident review; update playbooks and evidence.


