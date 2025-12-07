import { NextRequest, NextResponse } from 'next/server'
import { DATASETS } from '@/lib/insights_catalog'
import { dpAggregate } from '@/lib/cleanroom'
import { recordUsage } from '@/lib/insights_access'
import { z } from 'zod'
import { tokenBucket } from '@/lib/rate-limit'
import { applyApiSecurityHeaders } from '@/lib/security'
import { logRequest } from '@/lib/logger'

/**
 * Dev Insights query endpoint.
 * body: { dataset, filters?, epsilon?, threshold?, clientId? }
 */
export async function POST(req: NextRequest) {
	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
	const rate = tokenBucket(`insights:query:${ip}`, 120, 240)
	if (!rate.ok) {
		const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 })
		res.headers.set('Retry-After', String(Math.ceil((rate.retryAfterMs ?? 1000) / 1000)))
		logRequest('warn', 'insights_rate_limited', { path: '/api/insights/query', method: 'POST', status: 429, ip })
		return applyApiSecurityHeaders(res)
	}
	const schema = z.object({
		dataset: z.string().min(1),
		epsilon: z.number().min(0.1).max(5).optional(),
		threshold: z.number().int().min(1).max(100).optional(),
		clientId: z.string().optional(),
		filters: z.record(z.any()).optional(),
	})
	const body = schema.parse(await req.json().catch(() => ({})))
	const dataset = String(body.dataset || '')
	const ds = DATASETS.find((d) => d.id === dataset)
	if (!ds) {
		logRequest('warn', 'insights_dataset_not_found', { path: '/api/insights/query', method: 'POST', status: 404, dataset })
		return applyApiSecurityHeaders(NextResponse.json({ error: 'not_found' }, { status: 404 }))
	}
	// synthetic data per dataset for dev
	const epsilon = Number(body.epsilon ?? (ds.accessTier === 'public' ? 1.0 : 0.8))
	const threshold = Number(body.threshold ?? 5)
	let rows: any[] = []
	if (dataset === 'retail_sales_summary') {
		const base = [
			{ category: 'sneakers', week: '2025-11-10', amount_minor: 190000, growth_pct: 0.12, rows: 120 },
			{ category: 'tees', week: '2025-11-10', amount_minor: 120000, growth_pct: 0.07, rows: 80 },
			{ category: 'jackets', week: '2025-11-10', amount_minor: 54000, growth_pct: 0.03, rows: 20 },
			{ category: 'hats', week: '2025-11-10', amount_minor: 4000, growth_pct: 0.01, rows: 3 },
		]
		rows = base.map((r) => {
			const agg = dpAggregate({ value: r.amount_minor, epsilon, threshold, count: r.rows })
			return { category: r.category, week: r.week, amount_minor: agg.ok ? agg.value : null, suppressed: !agg.ok, growth_pct: r.growth_pct }
		})
	} else if (dataset === 'product_price_index') {
		rows = [
			{ category: 'sneakers', day: '2025-11-15', ppi: 101.3 },
			{ category: 'tees', day: '2025-11-15', ppi: 99.4 },
		]
	} else if (dataset === 'regional_demand_heatmap') {
		const base = [
			{ geohash: 'r3gx', day: '2025-11-15', orders: 42, rows: 42 },
			{ geohash: 'r3gy', day: '2025-11-15', orders: 3, rows: 3 },
		]
		rows = base.map((r) => {
			const agg = dpAggregate({ value: r.orders, epsilon, threshold, count: r.rows })
			return { geohash: r.geohash, day: r.day, orders: agg.ok ? agg.value : null, suppressed: !agg.ok }
		})
	} else if (dataset === 'carbon_impact_metrics') {
		rows = [
			{ region: 'US', month: '2025-11-01', co2_kg: 1.8 },
			{ region: 'AU', month: '2025-11-01', co2_kg: 2.2 },
		]
	}
	if (body.clientId) recordUsage(String(body.clientId), 1)
	const res = applyApiSecurityHeaders(NextResponse.json({ dataset: ds.id, rows }))
	logRequest('info', 'insights_query_ok', { path: '/api/insights/query', method: 'POST', status: 200, dataset: ds.id, rows: rows.length })
	return res
}


