import { NextRequest } from 'next/server'
import { opsBus } from '@/lib/ops-bus'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder()
			// Send recent events first
			for (const item of opsBus.getRecent()) {
				controller.enqueue(encoder.encode(`data: ${item}\n\n`))
			}
			// Subscribe to future events
			const unsub = opsBus.subscribe((payload) => {
				controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
			})
			// Cleanup
			// @ts-expect-error close not typed
			controller.signal?.addEventListener?.('abort', () => unsub())
		},
		cancel() {},
	})

	const headers = new Headers({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache, no-transform',
		Connection: 'keep-alive',
		'Access-Control-Allow-Origin': '*',
	})

	return new Response(stream, { headers })
}


