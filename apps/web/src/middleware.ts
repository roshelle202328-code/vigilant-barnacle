import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const PROTECTED_PREFIXES = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for access token in cookies (set by client after login) or Authorization header
  const hasToken =
    request.cookies.has('accessToken') ||
    request.cookies.has('hasAuth') || // fallback cookie set by client
    false;

  // Redirect authenticated users away from auth pages
  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect /dashboard/* routes
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/dashboard/:path*',
  ],
};
