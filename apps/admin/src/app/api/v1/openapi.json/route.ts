import { NextResponse } from 'next/server'

export async function GET() {
	// Minimal OpenAPI 3.1 scaffold; extend as endpoints are added
	const doc = {
		openapi: '3.1.0',
		info: { title: 'Easy11 Public API', version: '1.0.0' },
		paths: {
			'/v1/products': {
				get: {
					summary: 'List products',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'q', in: 'query', schema: { type: 'string' } },
						{ name: 'limit', in: 'query', schema: { type: 'integer' } },
						{ name: 'cursor', in: 'query', schema: { type: 'string' } },
					],
					responses: { '200': { description: 'OK' } },
				},
			},
			'/v1/orders': {
				get: {
					summary: 'List orders (PII masked by default)',
					security: [{ bearerAuth: [] }],
					responses: { '200': { description: 'OK' } },
				},
			},
			'/v1/webhooks/endpoints': {
				post: {
					summary: 'Create webhook endpoint',
					security: [{ bearerAuth: [] }],
					requestBody: { required: true },
					responses: { '200': { description: 'OK' } },
				},
			},
		},
		components: {
			securitySchemes: {
				bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			},
		},
	}
	return NextResponse.json(doc)
}


