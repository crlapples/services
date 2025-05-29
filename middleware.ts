// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const requestUrl = request.url;
  requestHeaders.set('x-middleware-request-url', requestUrl);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Get JWT token (no cookies required)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated
  const isLoggedIn = !!token;

  // Protect /account routes
  if (!isLoggedIn && request.nextUrl.pathname.startsWith('/account')) {
    const redirectUrl = new URL('/auth/signin', requestUrl);
    redirectUrl.searchParams.set('callbackUrl', requestUrl);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*'], // Only run middleware for /account routes
};