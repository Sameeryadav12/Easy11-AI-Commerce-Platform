import { NextRequest, NextResponse } from 'next/server'
import { listDeliveries } from '@/lib/webhooks'
import { requireScopes } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
	const auth = requireScopes(['webhooks:manage'], req)
	if (!auth.ok) return auth.res!
	return NextResponse.json({ items: listDeliveries() })
}


