import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine } from '@/lib/workflows'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function GET() {
	return cors(NextResponse.json({ items: workflowEngine.list() }))
}

export async function POST(req: NextRequest) {
	const payload = await req.json()
	const wf = workflowEngine.create(payload)
	return cors(NextResponse.json({ item: wf }))
}


