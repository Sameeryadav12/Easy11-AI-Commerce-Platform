import { NextResponse } from 'next/server'
import { listSlots } from '@/lib/ads'

export async function GET() {
	return NextResponse.json({ items: listSlots() })
}


