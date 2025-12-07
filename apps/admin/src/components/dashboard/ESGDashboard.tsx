'use client'
import React from 'react'

export default function ESGDashboard() {
	const [global, setGlobal] = React.useState<any>(null)
	const [forecast, setForecast] = React.useState<any[]>([])
	const [vendor, setVendor] = React.useState<any>(null)

	React.useEffect(() => {
		fetch('/api/v1/esg/global').then((r) => r.json()).then(setGlobal).catch(() => {})
		fetch('/api/v1/esg/forecast').then((r) => r.json()).then((d) => setForecast(d.points ?? [])).catch(() => {})
		fetch('/api/v1/esg/vendor/vendor_1').then((r) => r.json()).then(setVendor).catch(() => {})
	}, [])

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">ESG Intelligence</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Global</h2>
					<div className="text-sm">
						<div>Today CO₂: {global?.global?.co2_today_kg?.toLocaleString() ?? '-'} kg</div>
						<div>Vendors reporting: {global?.global?.vendors_reporting ?? '-'}</div>
						<div>Avg per order: {global?.global?.avg_co2_per_order_kg ?? '-'} kg</div>
					</div>
				</div>
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Forecast (30d)</h2>
					<div className="text-xs max-h-40 overflow-auto">
						{forecast.slice(0, 12).map((p, i) => (
							<div key={i} className="flex justify-between">
								<span>{p.day}</span>
								<span>{p.co2kg} kg</span>
							</div>
						))}
					</div>
				</div>
				<div className="rounded border p-4">
					<h2 className="font-medium mb-2">Vendor ESG</h2>
					<div className="text-sm">
						<div>ESG Score: {vendor?.esgScore ?? '-'}</div>
						<div>CO₂/order: {vendor?.kpis?.co2_per_order_kg ?? '-'} kg</div>
						<div>Recycled: {vendor?.kpis?.recycled_pct ?? '-'}%</div>
					</div>
				</div>
			</div>
			<div className="rounded border p-4">
				<h2 className="font-medium mb-2">Hotspots</h2>
				<div className="text-sm max-h-48 overflow-auto">
					{(global?.hotspots ?? []).map((h: any, i: number) => (
						<div key={i} className="flex justify-between">
							<span>{h.region} · {h.category}</span>
							<span>{h.co2_kg} kg</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}


