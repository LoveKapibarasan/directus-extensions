import type { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import CredentialsProvider from 'next-auth/providers/credentials';
import { parseJwt } from '@/lib/jwt';

const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'generic';
const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
const keycloakServerUrl = process.env.KEYCLOAK_SERVER_URL || keycloakUrl;
const keycloakRealm = process.env.KEYCLOAK_REALM;
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID;
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

/**
 * Refreshes an expired access token using the refresh token.
 */
async function refreshAccessToken(token: any) {
  if (authProvider !== 'keycloak') return token;

  try {
    const url = `${keycloakServerUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: keycloakClientId!,
        client_secret: keycloakClientSecret!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    const accessTokenParsed = parseJwt(refreshedTokens.access_token);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      roles: accessTokenParsed.resource_access?.[keycloakClientId!]?.roles || [],
      tenantId: accessTokenParsed.tenant_id,
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

const getProvider = () => {
  if (authProvider === 'keycloak') {
    return KeycloakProvider({
      clientId: keycloakClientId!,
      clientSecret: keycloakClientSecret!,
      wellKnown: undefined,
      issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
      authorization: {
        url: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/auth`,
      },
      token: `${keycloakServerUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`,
      userinfo: `${keycloakServerUrl}/realms/${keycloakRealm}/protocol/openid-connect/userinfo`,
      jwks_endpoint: `${keycloakServerUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
    });
  }

  return CredentialsProvider({
    id: 'generic',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (
        credentials &&
        credentials.username === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        credentials.password === process.env.ADMIN_PASSWORD
      ) {
        return { id: 'admin', name: 'Admin', email: credentials.username };
      }
      return null;
    },
  });
};

const authOptions: AuthOptions = {
  providers: [getProvider()],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 300000;

        if (authProvider === 'keycloak') {
          token.keycloakLogoutUrl = `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/logout`;
        }

        if (account.access_token) {
          const accessTokenParsed = parseJwt(account.access_token as string);
          token.roles =
            accessTokenParsed.resource_access?.[keycloakClientId!]?.roles || [];
          token.tenantId = accessTokenParsed.tenant_id;
        }
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number) - 60000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;
      (session as any).keycloakLogoutUrl = token.keycloakLogoutUrl;
      (session as any).roles = token.roles;
      (session as any).tenantId = token.tenantId;
      (session as any).error = token.error;
      return session;
    },
  },
};

export default authOptions;
