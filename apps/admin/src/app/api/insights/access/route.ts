import { NextRequest, NextResponse } from 'next/server'
import { approveAccess, getAccess, getUsage } from '@/lib/insights_access'

export async function GET(req: NextRequest) {
	const clientId = req.nextUrl.searchParams.get('clientId') || undefined
	return NextResponse.json({ usage: getUsage(clientId), access: clientId ? getAccess(clientId) : null })
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const clientId = String(body.clientId || '')
	const orgId = String(body.orgId || 'dev-org')
	const tiers = (body.tiers as Array<'public' | 'partner' | 'enterprise'>) ?? ['public']
	const scopes = (body.scopes as string[]) ?? ['insights.read']
	if (!clientId) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
	const item = approveAccess({ clientId, orgId, tiers, scopes })
	return NextResponse.json({ item })
}


