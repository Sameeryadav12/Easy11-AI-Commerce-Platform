import { NextRequest, NextResponse } from 'next/server'
import { workflowEngine } from '@/lib/workflows'

function cors(res: NextResponse) {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	return res
}

export async function OPTIONS() {
	return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(
	_req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const item = workflowEngine.simulate(params.id)
	return cors(NextResponse.json({ item }))
}


