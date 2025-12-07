import { NextResponse } from 'next/server'
import { DATASETS } from '@/lib/insights_catalog'

export async function GET() {
	return NextResponse.json({ items: DATASETS })
}


