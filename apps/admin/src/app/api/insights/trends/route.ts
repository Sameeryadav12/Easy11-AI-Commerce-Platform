import { NextResponse } from 'next/server'

export async function GET() {
	const items = [
		{ category: 'sneakers', yoy_pct: 18.2 },
		{ category: 'jackets', yoy_pct: 9.4 },
		{ category: 'hats', yoy_pct: -3.1 },
	]
	return NextResponse.json({ items })
}


