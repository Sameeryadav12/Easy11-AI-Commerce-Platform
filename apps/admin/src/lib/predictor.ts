import { opsBus } from '@/lib/ops-bus'

export type Prediction = {
	type: 'prediction'
	model: 'outage_forecaster'
	service: string
	horizonHours: number
	risk: number // 0..1
	explain?: Record<string, number>
	timestamp: string
}

/**
 * Simple heuristic outage forecaster:
 * - higher latency and error_rate increase the risk score
 * - recent critical anomalies also increase risk
 */
export function computeOutageRisk(params: {
	service: string
	avgLatencyMs?: number
	errorRatePct?: number
	recentCriticals?: number
}): Prediction {
	const latencyScore = Math.min(1, Math.max(0, ((params.avgLatencyMs ?? 120) - 120) / 600))
	const errorScore = Math.min(1, (params.errorRatePct ?? 0) / 20)
	const critScore = Math.min(1, (params.recentCriticals ?? 0) / 5)
	const risk = Math.max(0, Math.min(1, 0.5 * latencyScore + 0.35 * errorScore + 0.15 * critScore))
	return {
		type: 'prediction',
		model: 'outage_forecaster',
		service: params.service,
		horizonHours: 24,
		risk: Number(risk.toFixed(2)),
		explain: {
			latency: Number(latencyScore.toFixed(2)),
			error_rate: Number(errorScore.toFixed(2)),
			criticals: Number(critScore.toFixed(2)),
		},
		timestamp: new Date().toISOString(),
	}
}

export function publishPrediction(p: Prediction) {
	opsBus.push(p)
}


