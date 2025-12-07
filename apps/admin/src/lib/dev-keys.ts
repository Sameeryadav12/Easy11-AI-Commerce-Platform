import crypto from 'crypto'

export type DevKey = {
	id: string
	orgId: string
	name: string
	clientId: string
	clientSecret: string
	scopes: string[]
	createdAt: string
}

const store: DevKey[] = []

export function createDevKey(input: { orgId: string; name: string; scopes: string[] }) {
	const now = new Date().toISOString()
	const key: DevKey = {
		id: 'key_' + Math.random().toString(36).slice(2, 10),
		orgId: input.orgId,
		name: input.name,
		clientId: 'pk_' + crypto.randomBytes(8).toString('hex'),
		clientSecret: 'sk_' + crypto.randomBytes(16).toString('hex'),
		scopes: input.scopes,
		createdAt: now,
	}
	store.unshift(key)
	return key
}

export function listDevKeys(orgId?: string) {
	return store.filter((k) => !orgId || k.orgId === orgId)
}


