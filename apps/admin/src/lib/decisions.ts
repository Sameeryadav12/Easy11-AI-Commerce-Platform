export type DecisionCard = {
	id: string
	createdAt: string
	actorId: string // 'system' or user id
	action: 'simulate' | 'approve' | 'execute' | 'undo' | 'suggest'
	resource: 'workflow' | 'anomaly' | 'prediction'
	referenceId?: string
	input: Record<string, unknown>
	output?: Record<string, unknown>
	explain?: Record<string, unknown>
	modelVersion?: string
}

class DecisionStore {
	private items: DecisionCard[] = []
	create(card: Omit<DecisionCard, 'id' | 'createdAt'>) {
		const id = 'dc_' + Math.random().toString(36).slice(2, 10)
		const createdAt = new Date().toISOString()
		const full: DecisionCard = { id, createdAt, ...card }
		this.items.unshift(full)
		if (this.items.length > 200) this.items.pop()
		return full
	}
	list(limit = 50) {
		return this.items.slice(0, limit)
	}
}

export const decisionStore = new DecisionStore()


