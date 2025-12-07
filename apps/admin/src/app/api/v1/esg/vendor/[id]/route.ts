import { NextRequest, NextResponse } from 'next/server'
import { listVendorCerts } from '@/lib/esg_registry'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	const vendorId = params.id
	return NextResponse.json({
		vendorId,
		esgScore: 76,
		certs: listVendorCerts(vendorId),
		kpis: { co2_per_order_kg: 2.1, recycled_pct: 34 },
	})
}


