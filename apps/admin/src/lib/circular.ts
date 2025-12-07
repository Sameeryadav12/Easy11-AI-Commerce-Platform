export type ReturnAssessment = {
	orderId: string
	productId: string
	condition: 'new' | 'like_new' | 'used' | 'damaged'
	category?: string
}

export type Routing = 'resale' | 'recycle' | 'donate' | 'dispose'

export function routeReturn(a: ReturnAssessment): { route: Routing; co2SavedKg: number; note?: string } {
	let route: Routing = 'dispose'
	let saving = 0
	if (a.condition === 'new' || a.condition === 'like_new') {
		route = 'resale'
		saving = 1.2
	} else if (a.condition === 'used') {
		route = a.category === 'apparel' ? 'donate' : 'resale'
		saving = 0.7
	} else if (a.condition === 'damaged') {
		route = 'recycle'
		saving = 0.4
	}
	return { route, co2SavedKg: Number(saving.toFixed(2)) }
}


