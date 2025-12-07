export type CarbonInputs = {
	productKgCO2?: number
	quantity?: number
	packagingGrams?: number
	recyclablePct?: number
	shippingKm?: number
	carrier: 'air' | 'sea' | 'road'
	returnLikelihood?: number // 0..1
}

const CARRIER_FACTORS = {
	air: 0.0006, // kg CO2 per km per package (heuristic)
	sea: 0.00003,
	road: 0.00018,
}

export function estimateOrderCO2(input: CarbonInputs) {
	const product = (input.productKgCO2 ?? 1) * (input.quantity ?? 1)
	const packaging = ((input.packagingGrams ?? 100) / 1000) * 1.9 // 1.9 kg/kg packaging heuristic
	const shipping =
		(input.shippingKm ?? 100) *
		(CARRIER_FACTORS[input.carrier] ?? CARRIER_FACTORS.road)
	const recycleSavings = ((input.recyclablePct ?? 0) / 100) * 0.2 * packaging
	const returnsPenalty = (input.returnLikelihood ?? 0.1) * 0.6 * (product + shipping)
	const total = Math.max(0, product + packaging + shipping - recycleSavings + returnsPenalty)
	return Number(total.toFixed(3))
}

export function vendorWeeklyCO2(orders: Array<{ vendorId: string; co2kg: number }>) {
	const agg: Record<string, number> = {}
	for (const o of orders) agg[o.vendorId] = (agg[o.vendorId] ?? 0) + o.co2kg
	return Object.entries(agg).map(([vendorId, total]) => ({ vendorId, co2kg: Number(total.toFixed(2)) }))
}

export function forecastCO2(currentDailyKg: number, horizonDays = 30) {
	// simple linear + seasonality bump heuristic
	const out: Array<{ day: string; co2kg: number }> = []
	let base = currentDailyKg
	for (let i = 0; i < horizonDays; i++) {
		const season = 1 + 0.05 * Math.sin((2 * Math.PI * i) / 7)
		base *= 1.002 // slow drift
		out.push({ day: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10), co2kg: Number((base * season).toFixed(2)) })
	}
	return out
}


