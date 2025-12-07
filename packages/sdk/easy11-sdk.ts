export type Easy11SdkOptions = {
	baseUrl: string
	orgId: string
	clientId: string
	clientSecret: string
	scopes?: string[]
}

export class Easy11SDK {
	private token: string | null = null
	private tokenExpiry = 0
	constructor(private readonly opts: Easy11SdkOptions) {}

	private async ensureToken() {
		const now = Date.now() / 1000
		if (this.token && now < this.tokenExpiry - 60) return
		const res = await fetch(`${this.opts.baseUrl}/api/oauth/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grant_type: 'client_credentials',
				client_id: this.opts.clientId,
				client_secret: this.opts.clientSecret,
				org_id: this.opts.orgId,
				scope: (this.opts.scopes ?? ['catalog:read']).join(' '),
			}),
		})
		if (!res.ok) throw new Error(`Token error: ${res.status}`)
		const json = await res.json()
		this.token = json.access_token
		this.tokenExpiry = Math.floor(Date.now() / 1000) + (json.expires_in ?? 3600)
	}

	private async api(path: string, init?: RequestInit) {
		await this.ensureToken()
		const res = await fetch(`${this.opts.baseUrl}${path}`, {
			...init,
			headers: {
				...(init?.headers || {}),
				Authorization: `Bearer ${this.token}`,
				'X-Org-Id': this.opts.orgId,
			},
		})
		if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
		return res.json()
	}

	// REST
	listProducts() {
		return this.api('/api/v1/products')
	}
	listOrders() {
		return this.api('/api/v1/orders')
	}
	createWebhookEndpoint(url: string, events: string[]) {
		return this.api('/api/v1/webhooks/endpoints', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url, events }),
		})
	}
	listWebhookDeliveries() {
		return this.api('/api/v1/webhooks/deliveries')
	}

	// GraphQL persisted queries
	gql(id: 'getProductsV1' | 'getOrdersV1', variables?: Record<string, unknown>) {
		return this.api('/api/v1/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, variables }),
		})
	}

  // Insights API
  listDatasets() {
    return this.api('/api/insights/datasets')
  }
  queryDataset(dataset: string, opts?: { filters?: any; epsilon?: number; threshold?: number }) {
    return this.api('/api/insights/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset, ...opts, clientId: this.opts.clientId }),
    })
  }
  getTrends() {
    return this.api('/api/insights/trends')
  }
  getSustainability() {
    return this.api('/api/insights/sustainability')
  }
}


