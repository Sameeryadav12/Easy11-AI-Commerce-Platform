import { NextRequest, NextResponse } from 'next/server'
import { issueToken } from '@/lib/api-auth'
import { z } from 'zod'
import { tokenBucket } from '@/lib/rate-limit'
import { applyApiSecurityHeaders } from '@/lib/security'
import { logRequest } from '@/lib/logger'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: NextRequest) {
	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
	const rate = tokenBucket(`oauth:token:${ip}`, 60, 120)
	if (!rate.ok) {
		const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 })
		res.headers.set('Retry-After', String(Math.ceil((rate.retryAfterMs ?? 1000) / 1000)))
		logRequest('warn', 'oauth_rate_limited', { path: '/api/oauth/token', method: 'POST', status: 429, ip })
		return applyApiSecurityHeaders(res)
	}
	const schema = z.object({
		grant_type: z.string().min(4),
		client_id: z.string().min(2),
		client_secret: z.string().min(4),
		scope: z.string().optional(),
		org_id: z.string().optional(),
		partner_id: z.string().optional(),
	})
	const body = schema.parse(await req.json().catch(() => ({})))
	// dev-friendly: accept either client_credentials or password for sandbox
	const { grant_type, client_id, client_secret, scope, org_id, partner_id } = body || {}
	const scopes = String(body.scope || '').split(' ').filter(Boolean)
	const token = issueToken({
		sub: body.client_id,
		orgId: body.org_id || 'dev-org',
		partnerId: body.partner_id,
		scopes: scopes.length ? scopes : ['catalog:read'],
		ttlSeconds: 3600,
	})
	const response = applyApiSecurityHeaders(NextResponse.json({
			access_token: token,
			token_type: 'bearer',
			expires_in: 3600,
			scope: scopes.join(' '),
		}))
	logRequest('info', 'oauth_token_issued', { path: '/api/oauth/token', method: 'POST', status: 200, client_id: body.client_id })
	return cors(response)
}


