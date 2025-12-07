type Subscriber = (event: string) => void

class OpsBus {
	private subscribers: Set<Subscriber> = new Set()
	private recent: string[] = []
	private maxRecent = 200
	private hooks: Array<(payload: unknown) => void> = []

	push(json: unknown) {
		const payload = JSON.stringify(json)
		// run hooks before storing/broadcasting
		for (const hook of this.hooks) {
			try {
				hook(json)
			} catch {
				// ignore hook errors
			}
		}
		this.recent.push(payload)
		if (this.recent.length > this.maxRecent) this.recent.shift()
		for (const sub of this.subscribers) sub(payload)
	}

	subscribe(cb: Subscriber) {
		this.subscribers.add(cb)
		return () => this.subscribers.delete(cb)
	}

	getRecent() {
		return [...this.recent]
	}

	use(hook: (payload: unknown) => void) {
		this.hooks.push(hook)
	}
}

export const opsBus = new OpsBus()


