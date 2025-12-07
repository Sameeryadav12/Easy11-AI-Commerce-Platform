import { NextRequest, NextResponse } from 'next/server'
import { requireScopes } from '@/lib/api-auth'

// Persisted query registry (dev MVP)
// Keys are opaque IDs; values map to handlers that return JSON data.
const registry: Record<
	string,
	(args: { req: NextRequest }) => Promise<{ data: unknown } | { errors: unknown }>
> = {
	getProductsV1: async () => ({
		data: {
			products: [
				{ id: 'p_1', name: 'Sneaker Alpha', status: 'PUBLISHED', priceMinor: 8900, currency: 'USD' },
				{ id: 'p_2', name: 'Tee Beta', status: 'DRAFT', priceMinor: 2900, currency: 'USD' },
			],
		},
	}),
	getOrdersV1: async () => ({
		data: {
			orders: [
				{
					id: 'o_1001',
					status: 'PAID',
					totalMinor: 12900,
					currency: 'USD',
					customer: { emailMasked: 'j***@example.com' },
				},
			],
		},
	}),
}

export async function POST(req: NextRequest) {
	// Enforce token + minimal scope depending on query
	const body = await req.json().catch(() => ({}))
	const id: string | undefined = body?.id
	if (!id || !(id in registry)) {
		return NextResponse.json({ errors: [{ message: 'persisted_query_required_or_unknown' }] }, { status: 400 })
	}
	const needs = id.toLowerCase().includes('product') ? ['catalog:read'] : ['orders:read']
	const auth = requireScopes(needs, req)
	if (!auth.ok) return auth.res!
	// Execute mapped handler
	const result = await registry[id]({ req })
	return NextResponse.json(result)
}

export async function GET() {
	// Disallow ad-hoc GraphQL for production posture; show supported ids
	return NextResponse.json({ persistedQueries: Object.keys(registry) })
}


