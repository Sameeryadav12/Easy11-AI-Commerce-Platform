import { NextRequest, NextResponse } from 'next/server'
import { decisionStore } from '@/lib/decisions'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function GET(_req: NextRequest) {
	return cors(NextResponse.json({ items: decisionStore.list() }))
}


