'use client'
import React from 'react'

export default function AdsCampaigns() {
	const [slots, setSlots] = React.useState<any[]>([])
	const [campaigns, setCampaigns] = React.useState<any[]>([])
	const [reports, setReports] = React.useState<any[]>([])
	const [form, setForm] = React.useState({
		orgId: 'dev-org',
		vendorId: 'vendor_1',
		name: 'New Campaign',
		type: 'sponsored_product',
		budgetType: 'CPC',
		dailyCapMinor: 5000,
		lifetimeCapMinor: 100000,
		qualityScore: 0.6,
	})

	async function loadAll() {
		const [s, c, r] = await Promise.all([
			fetch('/api/ads/slots').then((r) => r.json()),
			fetch('/api/ads/campaigns').then((r) => r.json()),
			fetch('/api/ads/reports').then((r) => r.json()),
		])
		setSlots(s.items ?? [])
		setCampaigns(c.items ?? [])
		setReports(r.items ?? [])
	}
	React.useEffect(() => {
		loadAll().catch(() => {})
		const id = setInterval(() => {
			fetch('/api/ads/reports')
				.then((r) => r.json())
				.then((d) => setReports(d.items ?? []))
				.catch(() => {})
		}, 6000)
		return () => clearInterval(id)
	}, [])

	async function createCampaign() {
		await fetch('/api/ads/campaigns', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})
		setForm({ ...form, name: 'New Campaign' })
		await loadAll()
	}

	async function simulateAuction() {
		if (slots.length === 0 || campaigns.length === 0) return
		const slotId = slots[0].id
		const bids = campaigns.slice(0, 3).map((c: any) => ({
			campaignId: c.id,
			slotId,
			maxBidMinor: Math.round(50 + Math.random() * 150),
			relevance: 0.5 + Math.random() * 0.5,
		}))
		await fetch('/api/ads/bid', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slotId, bids, click: Math.random() < 0.35 ? { campaignId: bids[0].campaignId, costMinor: bids[0].maxBidMinor } : undefined }),
		})
		await loadAll()
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Retail Media Campaigns</h1>
				<button onClick={simulateAuction} className="px-3 py-1 rounded border hover:bg-muted">Simulate Auction</button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Create Campaign</h2>
					<div className="space-y-2 text-sm">
						<input className="border rounded px-2 py-1 w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
						<div className="grid grid-cols-2 gap-2">
							<select className="border rounded px-2 py-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
								<option value="sponsored_product">Sponsored Product</option>
								<option value="category_banner">Category Banner</option>
								<option value="carousel_slot">Carousel Slot</option>
							</select>
							<select className="border rounded px-2 py-1" value={form.budgetType} onChange={(e) => setForm({ ...form, budgetType: e.target.value as any })}>
								<option value="CPC">CPC</option>
								<option value="CPM">CPM</option>
							</select>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<input className="border rounded px-2 py-1" type="number" value={form.dailyCapMinor} onChange={(e) => setForm({ ...form, dailyCapMinor: Number(e.target.value) })} placeholder="Daily cap (minor)" />
							<input className="border rounded px-2 py-1" type="number" value={form.lifetimeCapMinor} onChange={(e) => setForm({ ...form, lifetimeCapMinor: Number(e.target.value) })} placeholder="Lifetime cap (minor)" />
						</div>
						<div className="grid grid-cols-2 gap-2">
							<input className="border rounded px-2 py-1" type="text" placeholder="Keywords (comma)" onChange={(e) => setForm({ ...form, targeting: { ...(form as any).targeting, keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })} />
							<input className="border rounded px-2 py-1" type="text" placeholder="Category" onChange={(e) => setForm({ ...form, targeting: { ...(form as any).targeting, category: e.target.value || undefined } })} />
						</div>
						<button onClick={createCampaign} className="px-3 py-1 rounded border hover:bg-muted">Create</button>
					</div>
				</div>

				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Inventory</h2>
					<div className="space-y-2 text-sm max-h-48 overflow-auto">
						{slots.map((s) => (
							<div key={s.id} className="rounded border p-2">
								<div className="font-medium">{s.id}</div>
								<div className="text-xs text-muted-foreground">type: {s.type} · pos: {s.position}</div>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-lg border p-4 bg-background/40">
					<h2 className="font-medium mb-2">Campaigns</h2>
					<div className="space-y-2 text-sm max-h-48 overflow-auto">
						{campaigns.map((c) => (
							<div key={c.id} className="rounded border p-2">
								<div className="font-medium">{c.name}</div>
								<div className="text-xs text-muted-foreground">{c.type} · {c.status} · QS {c.qualityScore}</div>
								<div className="text-xs">spend: {(c.spendMinor/100).toFixed(2)}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="rounded-lg border p-4 bg-background/40">
				<h2 className="font-medium mb-2">Reports</h2>
				<div className="text-sm max-h-64 overflow-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b">
								<th className="py-2">Campaign</th>
								<th>Impr</th>
								<th>Clicks</th>
								<th>CTR</th>
								<th>Spend</th>
								<th>CPC</th>
							</tr>
						</thead>
						<tbody>
							{reports.map((r) => (
								<tr key={r.campaignId} className="border-b">
									<td className="py-2">{r.campaignId}</td>
									<td>{r.impressions}</td>
									<td>{r.clicks}</td>
									<td>{(r.ctr * 100).toFixed(2)}%</td>
									<td>${(r.spendMinor/100).toFixed(2)}</td>
									<td>${(r.cpc_minor/100).toFixed(2)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}


