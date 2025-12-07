import { NextRequest, NextResponse } from 'next/server'
import { createCampaign, listCampaigns, Campaign } from '@/lib/ads'
import { z } from 'zod'
import { tokenBucket } from '@/lib/rate-limit'
import { applyApiSecurityHeaders } from '@/lib/security'

export async function GET(req: NextRequest) {
	const orgId = req.nextUrl.searchParams.get('orgId') || undefined
  return applyApiSecurityHeaders(NextResponse.json({ items: listCampaigns(orgId) }))
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const rate = tokenBucket(`ads:campaigns:${ip}`, 60, 120)
  if (!rate.ok) {
    const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    res.headers.set('Retry-After', String(Math.ceil((rate.retryAfterMs ?? 1000) / 1000)))
    return applyApiSecurityHeaders(res)
  }
  const schema = z.object({
    orgId: z.string().min(1),
    vendorId: z.string().min(1),
    name: z.string().min(2).max(100),
    type: z.enum(['sponsored_product', 'category_banner', 'carousel_slot']),
    budgetType: z.enum(['CPC', 'CPM']),
    dailyCapMinor: z.number().int().min(0).optional(),
    lifetimeCapMinor: z.number().int().min(0).optional(),
    targeting: z
      .object({
        keywords: z.array(z.string()).optional(),
        category: z.string().optional(),
        region: z.string().optional(),
      })
      .optional(),
    creative: z.object({ title: z.string().optional(), imageUrl: z.string().url().optional() }).optional(),
    qualityScore: z.number().min(0).max(1).optional(),
  })
  const body = schema.parse(await req.json().catch(() => ({})))
	const item = createCampaign({
    orgId: body.orgId,
    vendorId: body.vendorId,
    name: body.name,
    type: body.type,
    budgetType: body.budgetType,
    dailyCapMinor: body.dailyCapMinor ?? 5000,
    lifetimeCapMinor: body.lifetimeCapMinor ?? 100000,
    targeting: body.targeting,
    creative: body.creative,
    qualityScore: body.qualityScore ?? 0.5,
	})
  return applyApiSecurityHeaders(NextResponse.json({ item }))
}


