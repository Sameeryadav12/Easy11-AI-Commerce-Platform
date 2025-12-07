import { NextRequest, NextResponse } from 'next/server'
import { requireScopes } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
	const auth = requireScopes(['catalog:read'], req)
	if (!auth.ok) return auth.res!
	const items = [
		{ id: 'p_1', name: 'Sneaker Alpha', status: 'published', price_minor: 8900, currency: 'USD' },
		{ id: 'p_2', name: 'Tee Beta', status: 'draft', price_minor: 2900, currency: 'USD' },
	]
	return NextResponse.json({ items, next_cursor: null })
}


