import crypto from 'crypto'

export type WebhookEndpoint = {
	id: string
	url: string
	secret: string
	active: boolean
	events: string[]
}

export type WebhookDelivery = {
	id: string
	endpointId: string
	event: string
	payload: any
	status: number
	requestId: string
	timestamp: string
}

const endpoints = new Map<string, WebhookEndpoint>()
const deliveries: WebhookDelivery[] = []

export function createEndpoint(url: string, events: string[]) {
	const id = 'wh_' + Math.random().toString(36).slice(2, 10)
	const secret = crypto.randomBytes(16).toString('hex')
	const ep: WebhookEndpoint = { id, url, secret, active: true, events }
	endpoints.set(id, ep)
	return ep
}

export function listEndpoints() {
	return [...endpoints.values()]
}

export function listDeliveries(limit = 50) {
	return deliveries.slice(-limit).reverse()
}

function sign(secret: string, body: string, timestamp: string) {
	const hmac = crypto.createHmac('sha256', secret)
	hmac.update(`${timestamp}.${body}`)
	return hmac.digest('hex')
}

export async function deliver(event: string, payload: any) {
	const ts = Math.floor(Date.now() / 1000).toString()
	const body = JSON.stringify(payload)
	for (const ep of endpoints.values()) {
		if (!ep.active || (ep.events.length && !ep.events.includes(event))) continue
		const signature = sign(ep.secret, body, ts)
		const requestId = 'req_' + Math.random().toString(36).slice(2, 10)
		try {
			const res = await fetch(ep.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Easy11-Event-Id': payload?.id ?? 'evt_' + Date.now(),
					'X-Easy11-Timestamp': ts,
					'X-Easy11-Signature': signature,
					'X-Request-Id': requestId,
				},
				body,
			})
			deliveries.push({
				id: 'dlv_' + Math.random().toString(36).slice(2, 10),
				endpointId: ep.id,
				event,
				payload,
				status: res.status,
				requestId,
				timestamp: new Date().toISOString(),
			})
		} catch {
			deliveries.push({
				id: 'dlv_' + Math.random().toString(36).slice(2, 10),
				endpointId: ep.id,
				event,
				payload,
				status: 599,
				requestId,
				timestamp: new Date().toISOString(),
			})
		}
	}
}


