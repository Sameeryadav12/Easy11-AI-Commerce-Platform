type Bucket = { tokens: number; lastRefill: number }
const buckets = new Map<string, Bucket>()

export function tokenBucket(key: string, ratePerMin: number, burst = ratePerMin) {
	const now = Date.now()
	const perMs = ratePerMin / 60_000
	let b = buckets.get(key)
	if (!b) {
		b = { tokens: burst, lastRefill: now }
		buckets.set(key, b)
	}
	// refill
	const elapsed = now - b.lastRefill
	const refill = elapsed * perMs
	b.tokens = Math.min(burst, b.tokens + refill)
	b.lastRefill = now
	if (b.tokens >= 1) {
		b.tokens -= 1
		return { ok: true, remaining: Math.floor(b.tokens) }
	}
	return { ok: false, retryAfterMs: Math.ceil((1 - b.tokens) / perMs) }
}


