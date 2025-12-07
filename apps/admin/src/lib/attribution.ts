export type Impression = { campaignId: string; user: string; ts: number }
export type Click = { campaignId: string; user: string; ts: number }
export type Order = { user: string; ts: number; valueMinor: number }

export type AttributionReport = {
	model: 'last_click' | 'position_based'
	rows: Array<{ campaignId: string; attributedMinor: number }>
}

export function lastClick(impressions: Impression[], clicks: Click[], orders: Order[]): AttributionReport {
	// build latest click per user before order
	const clicksByUser = new Map<string, Click[]>()
	for (const c of clicks) {
		const list = clicksByUser.get(c.user) ?? []
		list.push(c)
		clicksByUser.set(c.user, list)
	}
	for (const list of clicksByUser.values()) list.sort((a, b) => a.ts - b.ts)
	const totals = new Map<string, number>()
	for (const o of orders) {
		const list = clicksByUser.get(o.user) ?? []
		const prev = list.filter((c) => c.ts <= o.ts)
		if (prev.length === 0) continue
		const last = prev[prev.length - 1]
		totals.set(last.campaignId, (totals.get(last.campaignId) ?? 0) + o.valueMinor)
	}
	const rows = [...totals.entries()].map(([campaignId, attributedMinor]) => ({ campaignId, attributedMinor }))
	return { model: 'last_click', rows }
}

export function positionBased(impressions: Impression[], clicks: Click[], orders: Order[]): AttributionReport {
	// 40% first touch, 40% last touch, 20% split among middle
	const allByUser = new Map<string, { events: Array<{ type: 'imp' | 'clk'; id: string; ts: number }> }>()
	for (const i of impressions) {
		const u = allByUser.get(i.user) ?? { events: [] }
		u.events.push({ type: 'imp', id: i.campaignId, ts: i.ts })
		allByUser.set(i.user, u)
	}
	for (const c of clicks) {
		const u = allByUser.get(c.user) ?? { events: [] }
		u.events.push({ type: 'clk', id: c.campaignId, ts: c.ts })
		allByUser.set(c.user, u)
	}
	const totals = new Map<string, number>()
	for (const o of orders) {
		const u = allByUser.get(o.user)
		if (!u) continue
		const path = u.events.filter((e) => e.ts <= o.ts).sort((a, b) => a.ts - b.ts)
		if (path.length === 0) continue
		const first = path[0]
		const last = path[path.length - 1]
		const mids = path.slice(1, -1)
		const firstShare = Math.round(o.valueMinor * 0.4)
		const lastShare = Math.round(o.valueMinor * 0.4)
		const midShareTotal = o.valueMinor - firstShare - lastShare
		const midEach = mids.length > 0 ? Math.round(midShareTotal / mids.length) : 0
		totals.set(first.id, (totals.get(first.id) ?? 0) + firstShare)
		totals.set(last.id, (totals.get(last.id) ?? 0) + lastShare)
		for (const m of mids) totals.set(m.id, (totals.get(m.id) ?? 0) + midEach)
	}
	const rows = [...totals.entries()].map(([campaignId, attributedMinor]) => ({ campaignId, attributedMinor }))
	return { model: 'position_based', rows }
}


