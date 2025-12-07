# Requires: PowerShell 5+

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = ""
    )
    try {
        if ($Method -eq "GET") {
            $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -Method GET -TimeoutSec 15
        } else {
            $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -Method POST -Body $Body -ContentType "application/json" -TimeoutSec 15
        }
        Write-Host "[OK] $Method $Url -> $($res.StatusCode)"
    } catch {
        Write-Host "[ERR] $Method $Url -> $($_.Exception.Message)"
    }
}

Write-Host "=== Easy11 Dev Verification ==="

# Admin OAuth token
$tokenRes = Invoke-WebRequest -Uri "http://localhost:3001/api/oauth/token" -UseBasicParsing -Method POST -Body (@{
    grant_type = "client_credentials"
    client_id = "dev-partner"
    client_secret = "dev-secret"
    scope = "catalog:read orders:read webhooks:manage insights.read"
    org_id = "dev-org"
} | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 15
$tokenJson = $tokenRes.Content | ConvertFrom-Json
$token = $tokenJson.access_token
if (-not $token) { Write-Host "[ERR] Failed to get token"; exit 1 }
Write-Host "[OK] Token acquired"

# REST v1 endpoints
Test-Endpoint GET "http://localhost:3001/api/v1/products"
Test-Endpoint GET "http://localhost:3001/api/v1/orders"

# Insights
Test-Endpoint GET "http://localhost:3001/api/insights/datasets"
Test-Endpoint POST "http://localhost:3001/api/insights/query" (@{ dataset="retail_sales_summary"; epsilon=1.0; threshold=5; clientId="verify" } | ConvertTo-Json)

# ESG
Test-Endpoint GET "http://localhost:3001/api/v1/esg/global"
Test-Endpoint GET "http://localhost:3001/api/v1/esg/forecast"

Write-Host "=== Done ==="


