'use client';

import { useEffect } from 'react';

// Once per page load -- module scope, so a remount doesn't start a second one.
let started = false;

export function AutoSignIn({
  keycloak,
  callbackUrl,
  fallback,
}: {
  keycloak: boolean;
  callbackUrl: string;
  fallback: string;
}) {
  useEffect(() => {
    if (started) return;
    started = true;
    // Only ever a relative path: anything else would turn this into an open redirect.
    const target = callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/';
    if (keycloak) {
      void (async () => {
        // What next-auth/react's signIn('keycloak') does, posting the CSRF
        // token NextAuth hands out. Nothing else on this page talks to
        // /api/auth (no SessionProvider here), so the token matches the cookie;
        // a second attempt covers a cookie that changed in between anyway.
        for (let attempt = 0; attempt < 3; attempt++) {
          const { csrfToken } = await (await fetch('/api/auth/csrf')).json();
          const res = await fetch('/api/auth/signin/keycloak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
            body: new URLSearchParams({ csrfToken, callbackUrl: target, json: 'true' }),
          });
          const { url } = (await res.json()) as { url?: string };
          if (url && !new URL(url, window.location.href).searchParams.has('csrf')) {
            window.location.href = url;
            return;
          }
        }
        window.location.replace(fallback);
      })();
    } else {
      window.location.replace(fallback);
    }
  }, [keycloak, callbackUrl, fallback]);

  return (
    <p className="p-6 text-sm text-muted-foreground">
      <a href={fallback}>Sign in</a>
    </p>
  );
}
