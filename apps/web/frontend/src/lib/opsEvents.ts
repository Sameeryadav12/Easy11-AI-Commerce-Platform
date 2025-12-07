export type OpsDomain = 'traffic' | 'financial' | 'security' | 'ai' | 'infra'
export type OpsSeverity = 'info' | 'warn' | 'critical'

export function emitOpsEvent(params: {
	service: string
	domain: OpsDomain
	severity: OpsSeverity
	message: string
	metadata?: Record<string, unknown>
}) {
	const eventWithTs = { ...params, timestamp: new Date().toISOString() }
	// eslint-disable-next-line no-console
	console.log('[Easy11::OpsEvent]', JSON.stringify(eventWithTs))
	// best-effort POST to admin ops endpoint
	fetch('http://localhost:3001/api/ops/events', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(eventWithTs),
		mode: 'cors',
	}).catch(() => {})
}

export function startHeartbeat(service: string) {
	const id = setInterval(() => {
		emitOpsEvent({
			service,
			domain: 'infra',
			severity: 'info',
			message: 'heartbeat',
		})
	}, 5000)
	return () => clearInterval(id)
}

export function emitNumericMetric(params: {
	service: string
	domain: OpsDomain
	metric: string
	value: number
	region?: string
	tenant?: string
}) {
	const event = {
		...params,
		severity: 'info' as const,
		message: 'metric',
		timestamp: new Date().toISOString(),
	}
	// eslint-disable-next-line no-console
	console.log('[Easy11::OpsMetric]', JSON.stringify(event))
	fetch('http://localhost:3001/api/ops/events', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(event),
		mode: 'cors',
	}).catch(() => {})
}

export function startMetricProbes(service: string) {
	// latency probe every 6s
	const latencyId = setInterval(() => {
		// rudimentary synthetic latency (ms)
		const base = 120 + Math.random() * 40
		const spike = Math.random() < 0.1 ? 250 + Math.random() * 400 : 0
		emitNumericMetric({
			service,
			domain: 'traffic',
			metric: 'latency_ms',
			value: Math.round(base + spike),
		})
	}, 6000)

	// error rate probe every 8s
	const errorId = setInterval(() => {
		const base = Math.random() * 1.5
		const burst = Math.random() < 0.08 ? Math.random() * 8 : 0
		emitNumericMetric({
			service,
			domain: 'traffic',
			metric: 'error_rate_pct',
			value: parseFloat((base + burst).toFixed(2)),
		})
	}, 8000)

	return () => {
		clearInterval(latencyId)
		clearInterval(errorId)
	}
}


