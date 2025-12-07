import { NextRequest, NextResponse } from 'next/server'
import { createDevKey, listDevKeys } from '@/lib/dev-keys'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function GET(req: NextRequest) {
	const orgId = req.nextUrl.searchParams.get('orgId') || undefined
	return cors(NextResponse.json({ items: listDevKeys(orgId) }))
}

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	const item = createDevKey({
		orgId: String(body.orgId || 'dev-org'),
		name: String(body.name || 'Dev Key'),
		scopes: (body.scopes as string[]) ?? ['catalog:read'],
	})
	return cors(NextResponse.json({ item }))
}


