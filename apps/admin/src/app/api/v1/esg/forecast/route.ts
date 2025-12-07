import { NextResponse } from 'next/server'
import { forecastCO2 } from '@/lib/esg'

export async function GET() {
	const points = forecastCO2(50, 30)
	return NextResponse.json({ points })
}


