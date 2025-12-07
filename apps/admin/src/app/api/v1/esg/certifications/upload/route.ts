import { NextRequest, NextResponse } from 'next/server'
import { addVendorCert } from '@/lib/esg_registry'
import { z } from 'zod'
import { tokenBucket } from '@/lib/rate-limit'
import { applyApiSecurityHeaders } from '@/lib/security'

export async function POST(req: NextRequest) {
	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
	const rate = tokenBucket(`esg:cert:upload:${ip}`, 20, 40)
	if (!rate.ok) {
		const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 })
		res.headers.set('Retry-After', String(Math.ceil((rate.retryAfterMs ?? 1000) / 1000)))
		return applyApiSecurityHeaders(res)
	}
	const schema = z.object({
		vendorId: z.string().min(1),
		type: z.enum(['FairTrade','RainforestAlliance','BCorp','FSC','GOTS','OEKO_TEX','SA8000']).default('GOTS'),
		validUntil: z.string().optional(),
		documentUrl: z.string().url().optional(),
	})
	const body = schema.parse(await req.json().catch(() => ({})))
	const item = addVendorCert({
		vendorId: body.vendorId,
		type: body.type as any,
		validUntil: body.validUntil || new Date(Date.now() + 31536000000).toISOString(),
		documentUrl: body.documentUrl,
	})
	return applyApiSecurityHeaders(NextResponse.json({ item }))
}


