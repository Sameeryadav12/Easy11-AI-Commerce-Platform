# CI/CD Security Checklist (Dev to Prod)

SAST
- Enable ESLint with security rules; add CodeQL or Semgrep in PR checks.
- Block merge on high-severity findings.

DAST
- OWASP ZAP nightly against dev/stage; block releases on critical vulns.

Dependency Scanning
- Dependabot + Snyk (or Renovate) with auto-PRs and policies.

Container/Image Scanning
- Trivy scan Docker images on build; fail on HIGH/CRITICAL.

Artifact Signing
- Use Sigstore Cosign to sign images and artifacts; verify at deploy.

Secrets
- Detect secrets in PRs (gitleaks); block merges until revoked.

Deployment Gates
- Require human approval for production and emergency rollback plan.


