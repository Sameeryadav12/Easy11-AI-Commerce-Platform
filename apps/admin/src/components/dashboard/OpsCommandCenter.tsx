'use client'
import React from 'react'
import { heartbeat } from '@/lib/ops-events'

export default function OpsCommandCenter() {
	const [events, setEvents] = React.useState<string[]>([])
	const [alerts, setAlerts] = React.useState<any[]>([])
	const [workflows, setWorkflows] = React.useState<any[]>([])
	const [predictions, setPredictions] = React.useState<any[]>([])
	const [decisions, setDecisions] = React.useState<any[]>([])

	React.useEffect(() => {
		const id = setInterval(() => heartbeat('admin.portal'), 5000)
		return () => clearInterval(id)
	}, [])

	React.useEffect(() => {
		const sse = new EventSource('http://localhost:3001/api/ops/stream')
		sse.onmessage = (e) => {
			setEvents((prev) => {
				const next = [...prev, e.data]
				if (next.length > 50) next.shift()
				return next
			})
			try {
				const json = JSON.parse(e.data)
				if (json?.type === 'anomaly') {
					setAlerts((prev) => {
						const next = [...prev, json]
						if (next.length > 50) next.shift()
						return next
					})
				}
				if (json?.type === 'prediction' && json?.model === 'outage_forecaster') {
					setPredictions((prev) => [json, ...prev].slice(0, 20))
				}
				if (json?.type === 'workflow.created') {
					setWorkflows((prev) => [json.item, ...prev].slice(0, 25))
				}
				if (json?.type?.startsWith?.('workflow.')) {
					setWorkflows((prev) =>
						prev.map((w) => (w.id === json.item?.id ? json.item : w)),
					)
				}
				if (json?.type === 'workflow.created' || json?.type?.startsWith?.('workflow.')) {
					// refresh decision cards opportunistically
					fetch('http://localhost:3001/api/ops/decisions')
						.then((r) => r.json())
						.then((d) => setDecisions(d.items ?? []))
						.catch(() => {})
				}
			} catch {
				// ignore parse errors
			}
		}
		return () => sse.close()
	}, [])

	// kick predictions every ~20s
	React.useEffect(() => {
		const id = setInterval(() => {
			fetch('http://localhost:3001/api/ops/predict', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ services: ['customer.web', 'vendor.portal', 'admin.portal'] }),
			}).catch(() => {})
		}, 20000)
		return () => clearInterval(id)
	}, [])

	React.useEffect(() => {
		fetch('http://localhost:3001/api/ops/workflows')
			.then((r) => r.json())
			.then((d) => setWorkflows(d.items ?? []))
			.catch(() => {})
	}, [])

	async function action(id: string, op: 'simulate' | 'approve' | 'undo') {
		await fetch(`http://localhost:3001/api/ops/workflows/${id}/${op}`, {
			method: 'POST',
		}).catch(() => {})
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Ops Command Center</h1>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Realtime</span>
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
						<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
					</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Health Map</h2>
					<p className="text-sm text-muted-foreground">
						Service × region status (placeholder)
					</p>
				</div>
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Incident Timeline</h2>
					<div className="text-sm text-muted-foreground">
						<div className="space-y-1 max-h-40 overflow-auto">
							{alerts
								.slice()
								.reverse()
								.map((a, i) => (
									<div
										key={i}
										className="flex items-center justify-between rounded border p-2"
									>
										<div>
											<div className="font-medium">
												{a.level.toUpperCase()} · {a.service} · {a.metric ?? 'metric'}
											</div>
											<div className="text-xs">{a.reason}</div>
										</div>
										<span
											className={
												'text-xs px-2 py-0.5 rounded ' +
												(a.level === 'critical'
													? 'bg-red-600/10 text-red-600'
													: 'bg-amber-500/10 text-amber-600')
											}
										>
											{a.level}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Decision Cards</h2>
					<div className="text-sm text-muted-foreground space-y-2 max-h-40 overflow-auto">
						{decisions.length === 0 ? (
							<p>No decision cards yet.</p>
						) : (
							decisions.map((d, i) => (
								<div key={i} className="rounded border p-2">
									<div className="flex items-center justify-between">
										<div className="font-medium">
											{d.action} · {d.resource}
										</div>
										<span className="text-xs text-muted-foreground">{d.createdAt}</span>
									</div>
									<div className="text-xs mt-1">
										<input type="checkbox" className="mr-1" readOnly /> inputs: {JSON.stringify(d.input)}
									</div>
									{d.output && (
										<div className="text-xs mt-1">
											output: {JSON.stringify(d.output)}
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Active Alerts</h2>
					<div className="flex flex-wrap gap-2">
						{alerts.slice(-6).map((a, i) => (
							<span
								key={i}
								className={
									'text-xs px-2 py-0.5 rounded border ' +
									(a.level === 'critical'
										? 'border-red-600 text-red-600'
										: 'border-amber-600 text-amber-600')
								}
								title={a.reason}
							>
								{a.service}:{a.metric ?? 'metric'}
							</span>
						))}
					</div>
				</div>
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Predictions (24h)</h2>
					<div className="text-sm text-muted-foreground space-y-2 max-h-44 overflow-auto">
						{predictions.length === 0 ? (
							<p>No predictions yet.</p>
						) : (
							predictions.map((p, i) => (
								<div key={i} className="flex items-center justify-between rounded border p-2">
									<div>
										<div className="font-medium">{p.service}</div>
										<div className="text-xs">risk: {(p.risk * 100).toFixed(0)}%</div>
									</div>
									<div className="text-xs">
										<span className="px-2 py-0.5 rounded border">
											lat {Math.round((p.explain?.latency ?? 0) * 100)}%
										</span>
										<span className="px-2 py-0.5 rounded border ml-2">
											err {Math.round((p.explain?.error_rate ?? 0) * 100)}%
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Approvals Queue</h2>
					<div className="space-y-2">
						{workflows.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No pending workflows.
							</p>
						) : (
							workflows.map((wf) => (
								<div
									key={wf.id}
									className="flex items-center justify-between rounded border p-2"
								>
									<div>
										<div className="font-medium">
											{wf.kind} · {wf.target?.service}
										</div>
										<div className="text-xs text-muted-foreground">
											{wf.reason}
										</div>
										<div className="text-xs">
											status:{' '}
											<span className="font-medium uppercase">{wf.status}</span>
										</div>
									</div>
									<div className="flex gap-2">
										<button
											className="text-xs px-2 py-1 rounded border hover:bg-muted"
											onClick={() => action(wf.id, 'simulate')}
										>
											Simulate
										</button>
										<button
											className="text-xs px-2 py-1 rounded border hover:bg-muted"
											onClick={() => action(wf.id, 'approve')}
										>
											Approve
										</button>
										<button
											className="text-xs px-2 py-1 rounded border hover:bg-muted"
											onClick={() => action(wf.id, 'undo')}
										>
											Undo
										</button>
									</div>
								</div>
							))
						)}
						<div className="mt-2 text-xs text-muted-foreground">
							Events received: {events.length}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


