import { NextRequest, NextResponse } from 'next/server'
import { dpAggregate, listPolicies } from '@/lib/cleanroom'

/**
 * Dev clean-room query endpoint (aggregated only).
 * body: { orgId, resource, epsilon?, threshold? }
 */
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const orgId = String(body.orgId || 'dev-org')
	const resource = String(body.resource || '')
	const policy = listPolicies(orgId).find((p) => p.allow.find((a) => a.resource === resource))
	if (!policy) {
		return NextResponse.json({ error: 'forbidden_by_policy' }, { status: 403 })
	}
	// synthetic dataset for dev
	const dataset = [
		{ category: 'sneakers', amount: 190000, rows: 120 },
		{ category: 'tees', amount: 120000, rows: 80 },
		{ category: 'jackets', amount: 54000, rows: 20 },
		{ category: 'hats', amount: 4000, rows: 3 }, // should be suppressed by threshold
	]
	const epsilon = Number(body.epsilon ?? 1.0)
	const threshold = Number(body.threshold ?? 5)
	const rows = dataset.map((r) => {
		const agg = dpAggregate({ value: r.amount, epsilon, threshold, count: r.rows })
		return {
			category: r.category,
			suppressed: !agg.ok,
			amount: agg.ok ? agg.value : null,
		}
	})
	return NextResponse.json({ policy: policy.id, rows })
}


