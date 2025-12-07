#!/usr/bin/env bash
set -euo pipefail

echo "=== Easy11 Dev Verification (Unix) ==="

token_json=$(curl -sS -X POST http://localhost:3001/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"client_credentials","client_id":"dev-partner","client_secret":"dev-secret","scope":"catalog:read orders:read webhooks:manage insights.read","org_id":"dev-org"}')
token=$(echo "$token_json" | jq -r .access_token 2>/dev/null || true)
if [ -z "${token:-}" ] || [ "$token" = "null" ]; then
  echo "[ERR] Failed to acquire token"
  echo "$token_json"
  exit 1
fi
echo "[OK] Token acquired"

function check() {
  method="$1"; url="$2"; data="${3:-}"
  if [ -n "$data" ]; then
    code=$(curl -sS -o /dev/null -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data")
  else
    code=$(curl -sS -o /dev/null -w "%{http_code}" -X "$method" "$url")
  fi
  if [ "$code" = "200" ]; then
    echo "[OK] $method $url -> $code"
  else
    echo "[ERR] $method $url -> $code"
  fi
}

# REST v1
check GET "http://localhost:3001/api/v1/products"
check GET "http://localhost:3001/api/v1/orders"

# Insights
check GET "http://localhost:3001/api/insights/datasets"
check POST "http://localhost:3001/api/insights/query" '{"dataset":"retail_sales_summary","epsilon":1.0,"threshold":5,"clientId":"verify"}'

# ESG
check GET "http://localhost:3001/api/v1/esg/global"
check GET "http://localhost:3001/api/v1/esg/forecast"

echo "=== Done ==="


