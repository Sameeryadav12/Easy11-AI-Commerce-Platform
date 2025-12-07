export type Certification =
	| 'FairTrade'
	| 'RainforestAlliance'
	| 'BCorp'
	| 'FSC'
	| 'GOTS'
	| 'OEKO_TEX'
	| 'SA8000'

export type VendorCert = {
	id: string
	vendorId: string
	type: Certification
	validUntil: string
	status: 'pending' | 'verified' | 'expired'
	documentUrl?: string
	uploadedAt: string
}

const certs: VendorCert[] = []

export function listVendorCerts(vendorId?: string) {
	return certs.filter((c) => !vendorId || c.vendorId === vendorId)
}

export function addVendorCert(input: Omit<VendorCert, 'id' | 'status' | 'uploadedAt'> & { status?: VendorCert['status'] }) {
	const item: VendorCert = {
		...input,
		id: 'cert_' + Math.random().toString(36).slice(2, 10),
		status: input.status ?? 'pending',
		uploadedAt: new Date().toISOString(),
	}
	certs.unshift(item)
	return item
}


