// middleware.ts - Emergency minimal version
import { NextResponse } from 'next/server';

export default function middleware() {
  // Temporarily allow all requests to debug the issue
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
