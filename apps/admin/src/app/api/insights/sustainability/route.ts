import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		items: [
			{ region: 'US', co2_kg: 1.8, on_time_pct: 98.4 },
			{ region: 'AU', co2_kg: 2.2, on_time_pct: 97.1 },
		],
	})
}


