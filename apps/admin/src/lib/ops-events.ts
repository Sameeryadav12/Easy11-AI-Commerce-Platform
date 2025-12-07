export type OpsEventSeverity = 'info' | 'warn' | 'critical'

export interface OpsEvent {
	service: string
	domain:
		| 'traffic'
		| 'financial'
		| 'security'
		| 'ai'
		| 'infra'
	severity: OpsEventSeverity
	region?: string
	tenant?: string
	message: string
	timestamp: string
	metadata?: Record<string, unknown>
}

/**
 * Minimal ops event emitter scaffold.
 * In Sprint 17 this will forward to Kafka/OTel.
 */
export function emitOpsEvent(event: OpsEvent) {
	// For now, log in a structured way so we can tail in the dev server.
	// Replace with Kafka producer / OTLP exporter later.
	// eslint-disable-next-line no-console
	console.log('[Easy11::OpsEvent]', JSON.stringify(event))
}

export function heartbeat(service: string) {
	emitOpsEvent({
		service,
		domain: 'infra',
		severity: 'info',
		message: 'heartbeat',
		timestamp: new Date().toISOString(),
	})
}


