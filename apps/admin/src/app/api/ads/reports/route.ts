import { NextResponse } from 'next/server'
import { metrics } from '@/lib/ads'

export async function GET() {
	const rows = Object.entries(metrics).map(([campaignId, m]) => ({
		campaignId,
		...m,
		ctr: m.impressions ? Number((m.clicks / m.impressions).toFixed(4)) : 0,
		cpc_minor: m.clicks ? Math.round(m.spendMinor / m.clicks) : 0,
	}))
	return NextResponse.json({ items: rows })
}


