import { NextRequest, NextResponse } from 'next/server'
import { computeOutageRisk, publishPrediction } from '@/lib/predictor'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}))
		const services: string[] = body?.services ?? ['customer.web', 'vendor.portal', 'admin.portal']
		const outputs = services.map((s) => {
			// Accept optional metric hints; otherwise use random-ish inputs to simulate drift
			const avgLatencyMs = body?.metrics?.[s]?.latency_ms ?? 120 + Math.random() * 300
			const errorRatePct = body?.metrics?.[s]?.error_rate_pct ?? Math.random() * 8
			const recentCriticals = body?.metrics?.[s]?.recentCriticals ?? (Math.random() < 0.2 ? 1 : 0)
			const pred = computeOutageRisk({
				service: s,
				avgLatencyMs,
				errorRatePct,
				recentCriticals,
			})
			publishPrediction(pred)
			return pred
		})
		return cors(NextResponse.json({ ok: true, predictions: outputs }))
	} catch {
		return cors(NextResponse.json({ ok: false }, { status: 400 }))
	}
}


