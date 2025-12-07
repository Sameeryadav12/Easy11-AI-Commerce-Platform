type Access = {
	clientId: string
	orgId: string
	tiers: Array<'public' | 'partner' | 'enterprise'>
	scopes: string[]
	approvedAt: string
}

const accessStore = new Map<string, Access>()
const usage = new Map<string, number>() // clientId -> count

export function approveAccess(input: { clientId: string; orgId: string; tiers: Access['tiers']; scopes: string[] }) {
	const a: Access = { ...input, approvedAt: new Date().toISOString() }
	accessStore.set(input.clientId, a)
	return a
}

export function getAccess(clientId: string) {
	return accessStore.get(clientId)
}

export function recordUsage(clientId: string, amount = 1) {
	usage.set(clientId, (usage.get(clientId) ?? 0) + amount)
	return usage.get(clientId) ?? 0
}

export function getUsage(clientId?: string) {
	if (!clientId) return [...usage.entries()].map(([id, count]) => ({ clientId: id, count }))
	return [{ clientId, count: usage.get(clientId) ?? 0 }]
}


