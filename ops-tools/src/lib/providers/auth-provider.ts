'use client';

import type { AuthProvider } from '@refinedev/core';
import { getSession, signIn, signOut } from 'next-auth/react';

const authProviderName = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'generic';

// Adapted from citrineos-operator-ui's keycloak-auth-provider (same pattern,
// trimmed down — ops-tools doesn't need Hasura role/tenant headers since
// data access goes through /api/graphql with the admin secret server-side,
// not per-user Keycloak JWT claims).
export const authProvider: AuthProvider = {
  login: async ({ redirectTo }) => {
    if (authProviderName === 'keycloak') {
      await signIn('keycloak', { callbackUrl: redirectTo || '/' });
      return { success: true };
    }
    return { success: true, redirectTo: '/api/auth/signin' };
  },

  logout: async ({ redirectTo }) => {
    const session = await getSession();
    const idToken = (session as any)?.idToken;
    const keycloakLogoutUrl = (session as any)?.keycloakLogoutUrl;

    await signOut({ redirect: false });

    if (idToken && keycloakLogoutUrl) {
      const postLogoutUri = `${window.location.origin}${redirectTo || '/'}`;
      const params = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: postLogoutUri,
      });
      window.location.href = `${keycloakLogoutUrl}?${params.toString()}`;
      return { success: true };
    }

    return { success: true, redirectTo: redirectTo || '/' };
  },

  check: async () => {
    const session = await getSession();
    if (!session) {
      return { authenticated: false, logout: true, redirectTo: '/api/auth/signin' };
    }
    if ((session as any).error === 'RefreshAccessTokenError') {
      return { authenticated: false, logout: true, redirectTo: '/api/auth/signin' };
    }
    return { authenticated: true };
  },

  getIdentity: async () => {
    const session = await getSession();
    if (!session?.user) return null;
    return {
      id: (session.user as any).sub || session.user.email || '1',
      name: session.user.name,
      email: session.user.email,
      avatar: session.user.image,
      roles: (session as any).roles || [],
    };
  },

  onError: async (error) => {
    console.error('Auth error:', error);
    if (error?.statusCode === 401) {
      return { logout: true };
    }
    return { error };
  },
};
