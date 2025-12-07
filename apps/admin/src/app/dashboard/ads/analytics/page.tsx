import React from 'react'

export default async function AdsAnalyticsPage() {
	// server component fetch for simple metrics
	const reportsRes = await fetch('http://localhost:3001/api/ads/reports', { cache: 'no-store' })
	const reports = await reportsRes.json().catch(() => ({ items: [] }))
	const billingRes = await fetch('http://localhost:3001/api/ads/billing', { cache: 'no-store' })
	const billing = await billingRes.json().catch(() => ({ items: [] }))
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Retail Media Analytics</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Top Campaigns by CTR</h2>
					<div className="text-sm space-y-1 max-h-56 overflow-auto">
						{(reports.items ?? [])
							.slice()
							.sort((a: any, b: any) => b.ctr - a.ctr)
							.map((r: any) => (
								<div key={r.campaignId} className="flex justify-between">
									<span>{r.campaignId}</span>
									<span>{(r.ctr * 100).toFixed(2)}%</span>
								</div>
							))}
					</div>
				</div>
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Spend (last {billing.items?.length ?? 0})</h2>
					<div className="text-sm space-y-1 max-h-56 overflow-auto">
						{(billing.items ?? []).map((e: any) => (
							<div key={e.id} className="flex justify-between">
								<span>{e.campaignId}</span>
								<span>${(e.amountMinor/100).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Notes</h2>
					<p className="text-sm text-muted-foreground">
						Connect to BI (Superset) and forecasting (Prophet) in production for charts and predictions.
					</p>
				</div>
			</div>
		</div>
	)
}


