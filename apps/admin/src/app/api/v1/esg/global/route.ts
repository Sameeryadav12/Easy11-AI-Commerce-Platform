import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		global: { co2_today_kg: 12840, vendors_reporting: 214, avg_co2_per_order_kg: 1.92 },
		hotspots: [
			{ region: 'US', category: 'sneakers', co2_kg: 4200 },
			{ region: 'EU', category: 'jackets', co2_kg: 3100 },
		],
	})
}


