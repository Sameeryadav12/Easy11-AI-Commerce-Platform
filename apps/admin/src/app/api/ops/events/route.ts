import { NextRequest, NextResponse } from 'next/server'
import { opsBus } from '@/lib/ops-bus'
import { AnomalyDetector } from '@/lib/anomaly'
import { suggestWorkflowFromAnomaly, workflowEngine } from '@/lib/workflows'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

const detector = new AnomalyDetector()
opsBus.use((payload) => {
	// try derive numeric events for anomaly detection
	const p = payload as any
	if (typeof p?.value === 'number') {
		const alert = detector.handle({
			service: p.service ?? 'unknown',
			domain: p.domain ?? 'infra',
			region: p.region,
			tenant: p.tenant,
			metric: p.metric ?? 'metric',
			value: p.value,
			timestamp: p.timestamp ?? new Date().toISOString(),
		})
		if (alert) {
			opsBus.push(alert)
			if (alert.level === 'critical') {
				// auto-open a workflow suggestion
				workflowEngine.create(suggestWorkflowFromAnomaly(alert))
			}
		}
	}
})

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json()
		const withTs = { ...data, receivedAt: new Date().toISOString() }
		opsBus.push(withTs)
		return cors(NextResponse.json({ ok: true }))
	} catch (e) {
		return cors(
			NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 }),
		)
	}
}


