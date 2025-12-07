export type DatasetMeta = {
	id: string
	title: string
	description: string
	updateFrequency: 'daily' | 'weekly' | 'monthly'
	accessTier: 'public' | 'partner' | 'enterprise'
	tags: string[]
	schema: Record<string, string>
}

export const DATASETS: DatasetMeta[] = [
	{
		id: 'retail_sales_summary',
		title: 'Retail Sales Summary',
		description: 'Weekly category-level sales and growth %',
		updateFrequency: 'weekly',
		accessTier: 'public',
		tags: ['sales', 'category', 'growth'],
		schema: { category: 'string', week: 'date', amount_minor: 'number', growth_pct: 'number' },
	},
	{
		id: 'product_price_index',
		title: 'Product Price Index',
		description: 'Normalized price movements per category',
		updateFrequency: 'daily',
		accessTier: 'partner',
		tags: ['price', 'index'],
		schema: { category: 'string', day: 'date', ppi: 'number' },
	},
	{
		id: 'regional_demand_heatmap',
		title: 'Regional Demand Heatmap',
		description: 'Geo grid (>10km) aggregated orders',
		updateFrequency: 'daily',
		accessTier: 'enterprise',
		tags: ['geo', 'demand'],
		schema: { geohash: 'string', day: 'date', orders: 'number' },
	},
	{
		id: 'carbon_impact_metrics',
		title: 'Carbon Impact Metrics',
		description: 'Avg CO2 per delivery by region',
		updateFrequency: 'monthly',
		accessTier: 'enterprise',
		tags: ['sustainability', 'co2'],
		schema: { region: 'string', month: 'date', co2_kg: 'number' },
	},
]


