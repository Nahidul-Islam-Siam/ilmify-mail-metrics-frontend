import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_MARKER_COOKIE, hasAuthMarker } from '@/features/auth/authMarker';

export function middleware(request: NextRequest) {
  const marker = request.cookies.get(AUTH_MARKER_COOKIE)?.value;
  if (hasAuthMarker(marker)) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/super-admin/:path*'],
};
