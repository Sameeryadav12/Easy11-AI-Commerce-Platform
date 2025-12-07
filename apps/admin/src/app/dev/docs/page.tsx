'use client'
import React from 'react'

export default function DevDocsPage() {
	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Developer Docs</h1>
			<ul className="list-disc pl-5 text-sm">
				<li>
					OpenAPI JSON:{' '}
					<a className="underline" href="/api/v1/openapi.json" target="_blank">
						/api/v1/openapi.json
					</a>
				</li>
				<li>
					GraphQL persisted IDs: <code>GET /api/v1/graphql</code>
				</li>
				<li>
					TypeScript SDK: <code>packages/sdk/easy11-sdk.ts</code>
				</li>
				<li>
					Postman collection: <code>docs/apis/Easy11.postman_collection.json</code>
				</li>
			</ul>
			<div className="rounded border p-3 text-sm">
				<h2 className="font-medium mb-2">Quickstart (TS SDK)</h2>
				<pre className="whitespace-pre-wrap text-xs">
{`import { Easy11SDK } from '../../packages/sdk/easy11-sdk'
const sdk = new Easy11SDK({
  baseUrl: 'http://localhost:3001',
  orgId: 'dev-org',
  clientId: 'dev-partner',
  clientSecret: 'dev-secret',
  scopes: ['catalog:read','orders:read','webhooks:manage']
})
const products = await sdk.listProducts()
console.log(products)`}
				</pre>
			</div>
		</div>
	)
}


