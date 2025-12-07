type Consent = {
	userId: string
	marketing: boolean
	dataSharing: boolean
	updatedAt: string
}

const db = new Map<string, Consent>()

export function setConsent(userId: string, marketing: boolean, dataSharing: boolean) {
	db.set(userId, { userId, marketing, dataSharing, updatedAt: new Date().toISOString() })
	return db.get(userId)!
}

export function getConsent(userId: string) {
	return db.get(userId) ?? { userId, marketing: false, dataSharing: false, updatedAt: new Date().toISOString() }
}


