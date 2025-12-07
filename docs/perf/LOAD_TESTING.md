# Load & Performance Testing

Targets
- 10,000 req/min sustained, p95 < 300 ms on core endpoints.

Tools
- k6 for HTTP load; Locust for user journeys.

Scripts
- See `scripts/k6/load_test_insights.js` for a sample hitting Insights API.

Process
- Run soak tests overnight; capture latency distribution and error budget.
- Record baselines per commit tag; gate deployments on perf regressions.


