import crypto from 'crypto'

export type Policy = {
	id: string
	orgId: string
	name: string
	allow: Array<{
		resource: 'sales_by_category' | 'weekly_category_trends'
		aggregate: 'sum' | 'count'
		groupBy?: string[]
		region?: string
	}>
}

const policies: Policy[] = [
	{
		id: 'pol_default',
		orgId: 'dev-org',
		name: 'Default Aggregates',
		allow: [
			{ resource: 'sales_by_category', aggregate: 'sum', groupBy: ['category'] },
			{ resource: 'weekly_category_trends', aggregate: 'sum', groupBy: ['category'] },
		],
	},
]

export function listPolicies(orgId?: string) {
	return policies.filter((p) => !orgId || p.orgId === orgId)
}

export function sha256Tokenize(input: string) {
	return crypto.createHash('sha256').update(input).digest('hex')
}

function laplaceNoise(scale: number) {
	// Inverse transform sampling for Laplace(0, b)
	const u = Math.random() - 0.5
	return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u))
}

export function dpAggregate(params: {
	value: number
	epsilon: number // privacy budget
	threshold: number // suppression threshold
	count: number
}) {
	if (params.count < params.threshold) {
		return { ok: false, suppressed: true }
	}
	const scale = 1 / Math.max(0.0001, params.epsilon)
	const noisy = params.value + laplaceNoise(scale)
	return { ok: true, value: Math.max(0, Math.round(noisy)) }
}


