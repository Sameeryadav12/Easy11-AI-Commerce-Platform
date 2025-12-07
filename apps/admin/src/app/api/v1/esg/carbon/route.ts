import { NextRequest, NextResponse } from 'next/server'
import { estimateOrderCO2, forecastCO2, vendorWeeklyCO2 } from '@/lib/esg'

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	if (Array.isArray(body.orders)) {
		// bulk calc with vendor aggregate
		const orders = body.orders.map((o: any) => ({
			vendorId: String(o.vendorId || 'unknown'),
			co2kg: estimateOrderCO2(o.inputs),
		}))
		return NextResponse.json({ orders, vendorWeekly: vendorWeeklyCO2(orders) })
	}
	const co2kg = estimateOrderCO2(body)
	return NextResponse.json({ co2kg })
}

export async function GET() {
	// sample global daily & forecast
	const today = 1200
	return NextResponse.json({ todayKg: today, forecast: forecastCO2(today / 30, 30) })
}


