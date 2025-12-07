'use client'
import React from 'react'

export default function DevInsightsHome() {
	const [datasets, setDatasets] = React.useState<any[]>([])
	const [rows, setRows] = React.useState<any[]>([])
	const [ds, setDs] = React.useState('retail_sales_summary')
	const [epsilon, setEpsilon] = React.useState(1.0)
	const [threshold, setThreshold] = React.useState(5)

	React.useEffect(() => {
		fetch('/api/insights/datasets')
			.then((r) => r.json())
			.then((d) => setDatasets(d.items ?? []))
			.catch(() => {})
	}, [])

	async function runQuery() {
		const res = await fetch('/api/insights/query', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ dataset: ds, epsilon, threshold, clientId: 'dev-partner' }),
		})
		const json = await res.json()
		setRows(json.rows ?? [])
	}

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Insights (Dev)</h1>
			<div className="grid grid-cols-3 gap-2">
				<select className="border rounded px-2 py-1" value={ds} onChange={(e) => setDs(e.target.value)}>
					{datasets.map((d) => (
						<option key={d.id} value={d.id}>{d.title}</option>
					))}
				</select>
				<input className="border rounded px-2 py-1" type="number" step="0.1" value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} placeholder="epsilon" />
				<input className="border rounded px-2 py-1" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} placeholder="threshold" />
			</div>
			<button onClick={runQuery} className="px-3 py-1 rounded border hover:bg-muted">Run</button>
			<pre className="text-xs rounded border p-3 overflow-auto max-h-[60vh]">{JSON.stringify(rows, null, 2)}</pre>
		</div>
	)
}


