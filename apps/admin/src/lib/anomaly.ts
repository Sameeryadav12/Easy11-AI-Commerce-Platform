type NumericMetricEvent = {
	service: string
	domain: 'traffic' | 'financial' | 'security' | 'ai' | 'infra'
	region?: string
	tenant?: string
	metric?: string
	value?: number
	severity?: 'info' | 'warn' | 'critical'
	timestamp: string
	message?: string
}

export type AnomalyAlert = {
	type: 'anomaly'
	level: 'warn' | 'critical'
	reason: string
	service: string
	domain: string
	value?: number
	metric?: string
	correlation?: Record<string, unknown>
	timestamp: string
}

class RollingStat {
	private values: number[] = []
	constructor(private readonly window: number) {}
	push(v: number) {
		this.values.push(v)
		if (this.values.length > this.window) this.values.shift()
	}
	mean() {
		if (this.values.length === 0) return 0
		return this.values.reduce((a, b) => a + b, 0) / this.values.length
	}
	stddev() {
		const m = this.mean()
		const variance =
			this.values.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) /
			(this.values.length || 1)
		return Math.sqrt(variance)
	}
	zscore(v: number) {
		const s = this.stddev()
		if (s === 0) return 0
		return (v - this.mean()) / s
	}
}

export class AnomalyDetector {
	private stats = new Map<string, RollingStat>()
	private readonly windowSize = 24
	private readonly warnZ = 2.5
	private readonly critZ = 3.5

	private key(evt: NumericMetricEvent) {
		return [
			evt.service,
			evt.domain,
			evt.region ?? 'global',
			evt.metric ?? 'latency_ms',
		].join('::')
	}

	handle(evt: NumericMetricEvent): AnomalyAlert | null {
		if (typeof evt.value !== 'number') return null
		const k = this.key(evt)
		if (!this.stats.has(k)) this.stats.set(k, new RollingStat(this.windowSize))
		const stat = this.stats.get(k)!
		const z = stat.zscore(evt.value)
		stat.push(evt.value)
		if (Math.abs(z) >= this.critZ) {
			return {
				type: 'anomaly',
				level: 'critical',
				reason: `z-score ${z.toFixed(2)} on ${evt.metric ?? 'metric'}`,
				service: evt.service,
				domain: evt.domain,
				value: evt.value,
				metric: evt.metric,
				correlation: { z },
				timestamp: new Date().toISOString(),
			}
		}
		if (Math.abs(z) >= this.warnZ) {
			return {
				type: 'anomaly',
				level: 'warn',
				reason: `z-score ${z.toFixed(2)} on ${evt.metric ?? 'metric'}`,
				service: evt.service,
				domain: evt.domain,
				value: evt.value,
				metric: evt.metric,
				correlation: { z },
				timestamp: new Date().toISOString(),
			}
		}
		return null
	}
}


