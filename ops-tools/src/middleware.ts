import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Server-side authentication middleware.
 *
 * Uses next-auth/jwt getToken() to validate the encrypted session cookie on
 * every matched request before any page renders or server action executes.
 * Unauthenticated requests are redirected to /login. Requests whose token
 * refresh failed (Keycloak session ended) are redirected with an error param.
 *
 * Protected: all routes except /api/auth/**, /_next/**, and static assets.
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (token.error === 'RefreshAccessTokenError') {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    signInUrl.searchParams.set('error', 'SessionExpired');
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon\\.ico|[^/]+\\.[^/]+$).*)',
  ],
};
