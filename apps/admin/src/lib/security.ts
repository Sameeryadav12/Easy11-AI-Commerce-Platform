import { NextResponse } from 'next/server'

export function applyApiSecurityHeaders(res: NextResponse) {
	res.headers.set('X-Content-Type-Options', 'nosniff')
	res.headers.set('Referrer-Policy', 'no-referrer')
	res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
	return res
}


