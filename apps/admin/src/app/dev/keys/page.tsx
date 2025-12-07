'use client'
import React from 'react'

export default function DevKeysPage() {
	const [items, setItems] = React.useState<any[]>([])
	const [name, setName] = React.useState('My Integration')
	const [scopes, setScopes] = React.useState('catalog:read orders:read webhooks:manage')
	const [org, setOrg] = React.useState('dev-org')

	async function load() {
		const res = await fetch('/api/dev/keys')
		const json = await res.json()
		setItems(json.items ?? [])
	}
	React.useEffect(() => {
		load().catch(() => {})
	}, [])

	async function create() {
		await fetch('/api/dev/keys', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, orgId: org, scopes: scopes.split(' ').filter(Boolean) }),
		})
		setName('My Integration')
		await load()
	}

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">API Keys</h1>
			<div className="rounded-lg border p-4 space-y-2">
				<div className="grid grid-cols-3 gap-2">
					<input className="border rounded px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
					<input className="border rounded px-2 py-1" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Org Id" />
					<input className="border rounded px-2 py-1" value={scopes} onChange={(e) => setScopes(e.target.value)} placeholder="Scopes (space-separated)" />
				</div>
				<button onClick={create} className="px-3 py-1 rounded border hover:bg-muted">Create Key</button>
			</div>
			<div className="grid gap-2">
				{items.map((k) => (
					<div key={k.id} className="rounded border p-3 text-sm">
						<div className="font-medium">{k.name}</div>
						<div className="text-xs text-muted-foreground">org: {k.orgId} · created: {k.createdAt}</div>
						<div className="mt-1">client_id: <code>{k.clientId}</code></div>
						<div>client_secret: <code>{k.clientSecret}</code></div>
						<div>scopes: <code>{k.scopes.join(' ')}</code></div>
					</div>
				))}
			</div>
		</div>
	)
}


