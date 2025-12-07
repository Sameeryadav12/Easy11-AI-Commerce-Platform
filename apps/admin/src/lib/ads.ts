export type AdType = 'sponsored_product' | 'category_banner' | 'carousel_slot'
export type BudgetType = 'CPC' | 'CPM'

export type AdSlot = {
	id: string
	type: AdType
	position: number
	keywords?: string[]
	category?: string
	region?: string
}

export type Campaign = {
	id: string
	orgId: string
	vendorId: string
	name: string
	type: AdType
	status: 'draft' | 'active' | 'paused' | 'completed'
	budgetType: BudgetType
	dailyCapMinor: number
	lifetimeCapMinor: number
	spendMinor: number
	targeting?: {
		keywords?: string[]
		category?: string
		region?: string
		segment?: string
	}
	creative?: {
		title?: string
		imageUrl?: string
	}
	qualityScore: number // 0..1
	createdAt: string
	updatedAt: string
}

export type Bid = {
	campaignId: string
	slotId: string
	maxBidMinor: number // CPC bid minor units (e.g., cents)
	relevance: number // 0..1 derived from targeting match
}

const slots: AdSlot[] = [
	{ id: 'slot_home_1', type: 'carousel_slot', position: 1 },
	{ id: 'slot_search_top', type: 'sponsored_product', position: 1, keywords: [] },
	{ id: 'slot_category_banner', type: 'category_banner', position: 1, category: 'sneakers' },
]

const campaigns = new Map<string, Campaign>()

export function listSlots() {
	return slots
}

export function listCampaigns(orgId?: string) {
	return [...campaigns.values()].filter((c) => !orgId || c.orgId === orgId)
}

export function createCampaign(input: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'spendMinor'>) {
	const id = 'ad_' + Math.random().toString(36).slice(2, 10)
	const now = new Date().toISOString()
	const item: Campaign = {
		...input,
		id,
		status: 'active',
		spendMinor: 0,
		createdAt: now,
		updatedAt: now,
	}
	campaigns.set(id, item)
	return item
}

export type AuctionResult = {
	slotId: string
	winnerCampaignId?: string
	clearingPriceMinor?: number
	scoreBoard: Array<{ campaignId: string; score: number; bidMinor: number }>
}

/**
 * Second-price auction with quality weighting:
 * score = (bid * relevanceWeight) * (0.7 + 0.3 * qualityScore)
 * winner pays second-highest effective bid (rounded up).
 */
export function runAuction(slotId: string, bids: Bid[]): AuctionResult {
	const quality = (c: Campaign) => 0.7 + 0.3 * (c.qualityScore ?? 0)
	const board = bids
		.map((b) => {
			const c = campaigns.get(b.campaignId)
			if (!c) return null
			const score = b.maxBidMinor * (b.relevance || 0.5) * quality(c)
			return { campaignId: b.campaignId, score, bidMinor: b.maxBidMinor }
		})
		.filter(Boolean) as Array<{ campaignId: string; score: number; bidMinor: number }>
	board.sort((a, b) => b.score - a.score)
	if (board.length === 0) return { slotId, scoreBoard: [] }
	const winner = board[0]
	const second = board[1]
	const clearing = second ? Math.ceil(second.bidMinor) : Math.ceil(winner.bidMinor / 2)
	return {
		slotId,
		winnerCampaignId: winner.campaignId,
		clearingPriceMinor: clearing,
		scoreBoard: board,
	}
}

export const metrics: Record<
	string,
	{ impressions: number; clicks: number; spendMinor: number; roi?: number }
> = {}

export function recordImpression(campaignId: string) {
	if (!metrics[campaignId]) metrics[campaignId] = { impressions: 0, clicks: 0, spendMinor: 0 }
	metrics[campaignId].impressions += 1
}
export function recordClick(campaignId: string, costMinor: number) {
	if (!metrics[campaignId]) metrics[campaignId] = { impressions: 0, clicks: 0, spendMinor: 0 }
	metrics[campaignId].clicks += 1
	metrics[campaignId].spendMinor += costMinor
	const c = campaigns.get(campaignId)
	if (c) {
		c.spendMinor += costMinor
		c.updatedAt = new Date().toISOString()
	}
}


