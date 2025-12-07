'use client'
import React from 'react'

export default function DevPortalHome() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Developer/Partner Portal (Dev)</h1>
			<p className="text-sm text-muted-foreground">
				Manage API keys, webhooks, and view logs. In production this runs on its own host
				(dev.easy11.com). In dev, it’s served here for convenience.
			</p>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<a href="/dev/keys" className="rounded-lg border p-4 hover:bg-muted/40">
					<h2 className="font-medium mb-1">API Keys</h2>
					<p className="text-sm text-muted-foreground">Create and view sandbox keys.</p>
				</a>
				<a href="/dev/logs" className="rounded-lg border p-4 hover:bg-muted/40">
					<h2 className="font-medium mb-1">Logs</h2>
					<p className="text-sm text-muted-foreground">Webhook deliveries and API usage.</p>
				</a>
				<a href="/dev/docs" className="rounded-lg border p-4 hover:bg-muted/40">
					<h2 className="font-medium mb-1">Docs</h2>
					<p className="text-sm text-muted-foreground">OpenAPI, GraphQL & SDK quickstarts.</p>
				</a>
			</div>
		</div>
	)
}


