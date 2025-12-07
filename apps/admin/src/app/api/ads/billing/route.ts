import { NextRequest, NextResponse } from 'next/server'
import { listSpend, recordSpend } from '@/lib/ads_billing'

export async function GET(req: NextRequest) {
	const orgId = req.nextUrl.searchParams.get('orgId') || undefined
	return NextResponse.json({ items: listSpend(orgId) })
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const orgId = String(body.orgId || 'dev-org')
	const campaignId = String(body.campaignId || '')
	const amountMinor = Number(body.amountMinor || 0)
	const currency = String(body.currency || 'USD')
	if (!campaignId || amountMinor <= 0) {
		return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
	}
	const item = recordSpend(orgId, campaignId, amountMinor, currency, body.note)
	return NextResponse.json({ item })
}


