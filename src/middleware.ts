import { NextRequest, NextResponse } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';

import type { Session } from '@/lib/auth/auth';

const PUBLIC_ROUTES = ['/', '/signin', '/signup'];
const PUBLIC_ROUTE_PREFIXES = [
  '/api/auth',
  '/accept-invitation',
  '/api/uploadthing',
];
const STATIC_ASSETS = ['/_next', '/favicon.ico', '/images', '/fonts'];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (STATIC_ASSETS.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next();
    }

    if (PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next();
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    const { data: session, error } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      }
    );

    const isAuthenticated = session?.session?.activeOrganizationId;

    if (isPublicRoute) {
      if (isAuthenticated && pathname === '/signin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated || error) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('next', pathname + request.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set(
      'next',
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf|eot)).*)',
  ],
};
