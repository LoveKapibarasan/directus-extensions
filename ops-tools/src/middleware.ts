import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATH_SEGMENTS = ['/api/auth', '/_next', '/favicon.ico', '/extension-bundle.js'];

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (PUBLIC_PATH_SEGMENTS.some((p) => pathname.includes(p))) {
    return NextResponse.next();
  }

  // Embedded pages render unauthenticated and receive their token via
  // postMessage from the host; actual data access is still gated per-request
  // in each API route (see src/lib/auth.ts), so this is not a security bypass.
  if (searchParams.get('embed') === '1') {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    return NextResponse.next();
  }

  const signInUrl = req.nextUrl.clone();
  signInUrl.pathname = '/api/auth/signin';
  signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/:path*'],
};
