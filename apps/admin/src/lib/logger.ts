type LogLevel = 'info' | 'warn' | 'error'

export function logEvent(level: LogLevel, message: string, fields?: Record<string, unknown>) {
	const entry = {
		ts: new Date().toISOString(),
		level,
		msg: message,
		...fields,
	}
	// eslint-disable-next-line no-console
	console.log(JSON.stringify(entry))
}

export function logRequest(level: LogLevel, message: string, fields: Record<string, unknown> & { path: string; method: string; status?: number }) {
	logEvent(level, message, fields)
}


