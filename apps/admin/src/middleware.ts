import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { isRoleAuthorized, type AdminRole } from '@/lib/rbac';

// Simple in-memory rate limiter (dev only). In production, use Redis/Edge KV.
const windowMs = 60_000; // 1 min
const maxRequests = 120; // per IP per window
const ipHits = new Map<string, { count: number; windowStart: number }>();

function rateLimit(ip: string | null | undefined) {
	const key = ip || 'unknown';
	const now = Date.now();
	const cur = ipHits.get(key);
	if (!cur || now - cur.windowStart > windowMs) {
		ipHits.set(key, { count: 1, windowStart: now });
		return { ok: true };
	}
	cur.count += 1;
	if (cur.count > maxRequests) {
		return { ok: false };
	}
	return { ok: true };
}

function applySecurityHeaders(res: NextResponse) {
	res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	res.headers.set('X-Frame-Options', 'DENY');
	res.headers.set('X-Content-Type-Options', 'nosniff');
	res.headers.set('Referrer-Policy', 'no-referrer');
	res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	// Basic CSP - adjust as needed
	res.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:* https://localhost:*",
	);
	return res;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as AdminRole | undefined;

    if (!role) {
      const res = NextResponse.redirect(new URL('/api/auth/signin', req.url));
      return applySecurityHeaders(res);
    }

    if (!isRoleAuthorized(pathname, role)) {
      const res = NextResponse.redirect(new URL('/unauthorized', req.url));
      return applySecurityHeaders(res);
    }

    // Rate limit dashboard accesses by IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.ip;
    const allowed = rateLimit(ip);
    if (!allowed.ok) {
      const res = NextResponse.json({ error: 'rate_limited' }, { status: 429 });
      res.headers.set('Retry-After', String(Math.ceil(windowMs / 1000)));
      return applySecurityHeaders(res);
    }

    const res = NextResponse.next();
    return applySecurityHeaders(res);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*'],
};
