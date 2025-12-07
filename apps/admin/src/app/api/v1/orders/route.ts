import { NextRequest, NextResponse } from 'next/server'
import { requireScopes } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
	const auth = requireScopes(['orders:read'], req)
	if (!auth.ok) return auth.res!
	// PII masked by default
	const items = [
		{
			id: 'o_1001',
			status: 'paid',
			total_minor: 12900,
			currency: 'USD',
			shipping: { city: 'S********', country: 'US' },
			customer: { email_masked: 'j***@example.com' },
			created_at: '2025-11-12T10:30:00Z',
		},
	]
	return NextResponse.json({ items, next_cursor: null })
}


