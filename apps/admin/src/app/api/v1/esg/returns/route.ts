import { NextRequest, NextResponse } from 'next/server'
import { routeReturn } from '@/lib/circular'

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	return NextResponse.json({ result: routeReturn(body) })
}


