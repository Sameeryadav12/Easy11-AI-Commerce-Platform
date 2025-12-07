import { NextRequest, NextResponse } from 'next/server'
import { lastClick, positionBased, Impression, Click, Order } from '@/lib/attribution'

/**
 * Dev attribution endpoint. body: { impressions, clicks, orders }
 */
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const impressions = (body.impressions as Impression[]) ?? []
	const clicks = (body.clicks as Click[]) ?? []
	const orders = (body.orders as Order[]) ?? []
	const lc = lastClick(impressions, clicks, orders)
	const pb = positionBased(impressions, clicks, orders)
	return NextResponse.json({ last_click: lc, position_based: pb })
}


