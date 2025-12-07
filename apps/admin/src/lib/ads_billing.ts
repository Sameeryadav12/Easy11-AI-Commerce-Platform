export type SpendEntry = {
	id: string
	orgId: string
	campaignId: string
	amountMinor: number
	currency: string
	timestamp: string
	note?: string
}

const ledger: SpendEntry[] = []

export function recordSpend(orgId: string, campaignId: string, amountMinor: number, currency = 'USD', note?: string) {
	const entry: SpendEntry = {
		id: 'sp_' + Math.random().toString(36).slice(2, 10),
		orgId,
		campaignId,
		amountMinor,
		currency,
		timestamp: new Date().toISOString(),
		note,
	}
	ledger.push(entry)
	return entry
}

export function listSpend(orgId?: string) {
	return ledger.filter((e) => !orgId || e.orgId === orgId).slice(-200).reverse()
}


