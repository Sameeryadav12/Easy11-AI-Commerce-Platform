import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

type TokenPayload = {
	sub: string
	org_id: string
	partner_id?: string
	scopes: string[]
	iat: number
	exp: number
}

const JWT_SECRET = process.env.EASY11_PARTNER_JWT_SECRET || 'dev-secret-change-me'

export function issueToken(input: {
	sub: string
	orgId: string
	partnerId?: string
	scopes: string[]
	ttlSeconds?: number
}) {
	const now = Math.floor(Date.now() / 1000)
	const payload: TokenPayload = {
		sub: input.sub,
		org_id: input.orgId,
		partner_id: input.partnerId,
		scopes: input.scopes,
		iat: now,
		exp: now + (input.ttlSeconds ?? 3600),
	}
	return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' })
}

export function verifyToken(token: string): TokenPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as TokenPayload
	} catch {
		return null
	}
}

export function requireScopes(required: string[], req: NextRequest) {
	const auth = req.headers.get('authorization') || ''
	const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : ''
	const parsed = token ? verifyToken(token) : null
	if (!parsed) {
		return { ok: false, res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) }
	}
	const hasAll = required.every((s) => parsed.scopes.includes(s))
	if (!hasAll) {
		return { ok: false, res: NextResponse.json({ error: 'forbidden' }, { status: 403 }) }
	}
	// optional org header check
	const headerOrg = req.headers.get('x-org-id') || undefined
	if (headerOrg && headerOrg !== parsed.org_id) {
		return { ok: false, res: NextResponse.json({ error: 'tenant_mismatch' }, { status: 403 }) }
	}
	return { ok: true, payload: parsed }
}


