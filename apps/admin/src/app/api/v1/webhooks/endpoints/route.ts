import { NextRequest, NextResponse } from 'next/server'
import { createEndpoint, listEndpoints } from '@/lib/webhooks'
import { requireScopes } from '@/lib/api-auth'
import { z } from 'zod'
import { tokenBucket } from '@/lib/rate-limit'
import { applyApiSecurityHeaders } from '@/lib/security'
import { logRequest } from '@/lib/logger'

export async function GET(req: NextRequest) {
	const auth = requireScopes(['webhooks:manage'], req)
	if (!auth.ok) return auth.res!
  const res = applyApiSecurityHeaders(NextResponse.json({ items: listEndpoints() }))
  logRequest('info', 'webhooks_list_ok', { path: '/api/v1/webhooks/endpoints', method: 'GET', status: 200 })
  return res
}

export async function POST(req: NextRequest) {
	const auth = requireScopes(['webhooks:manage'], req)
	if (!auth.ok) return auth.res!
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const rate = tokenBucket(`webhooks:endpoints:${ip}`, 30, 60)
  if (!rate.ok) {
    const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    res.headers.set('Retry-After', String(Math.ceil((rate.retryAfterMs ?? 1000) / 1000)))
    logRequest('warn', 'webhooks_rate_limited', { path: '/api/v1/webhooks/endpoints', method: 'POST', status: 429, ip })
    return applyApiSecurityHeaders(res)
  }
  const schema = z.object({
    url: z.string().url(),
    events: z.array(z.string()).default([]),
  })
  const body = schema.parse(await req.json().catch(() => ({})))
  const ep = createEndpoint(body.url, body.events)
  const res = applyApiSecurityHeaders(NextResponse.json({ item: ep }))
  logRequest('info', 'webhook_endpoint_created', { path: '/api/v1/webhooks/endpoints', method: 'POST', status: 200, endpointId: ep.id })
  return res
}


