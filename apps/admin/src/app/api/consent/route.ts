import { NextRequest, NextResponse } from 'next/server'
import { getConsent, setConsent } from '@/lib/consent'

export async function GET(req: NextRequest) {
	const userId = req.nextUrl.searchParams.get('userId') || 'demo-user'
	return NextResponse.json({ item: getConsent(userId) })
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const userId = String(body.userId || 'demo-user')
	const marketing = Boolean(body.marketing)
	const dataSharing = Boolean(body.dataSharing)
	return NextResponse.json({ item: setConsent(userId, marketing, dataSharing) })
}


