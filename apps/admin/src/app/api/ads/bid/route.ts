import { NextRequest, NextResponse } from 'next/server'
import { runAuction, recordImpression, recordClick, Bid } from '@/lib/ads'

/**
 * Internal endpoint to simulate an auction and optionally record a click.
 * body: { slotId: string, bids: Bid[], click?: { campaignId: string, costMinor: number } }
 */
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const slotId = String(body.slotId || '')
	const bids = (body.bids as Bid[]) ?? []
	const result = runAuction(slotId, bids)
	if (result.winnerCampaignId) {
		recordImpression(result.winnerCampaignId)
		if (body.click?.campaignId === result.winnerCampaignId && body.click?.costMinor) {
			recordClick(body.click.campaignId, Number(body.click.costMinor))
		}
	}
	return NextResponse.json({ result })
}


