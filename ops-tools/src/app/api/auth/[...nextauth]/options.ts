import type { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import CredentialsProvider from 'next-auth/providers/credentials';

const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'generic';
const keycloakServerUrl =
  process.env.KEYCLOAK_SERVER_URL || process.env.NEXT_PUBLIC_KEYCLOAK_URL;

const getProvider = () => {
  if (authProvider === 'keycloak') {
    return KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      authorization: {
        url: `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      },
      token: `${keycloakServerUrl}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userinfo: `${keycloakServerUrl}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
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
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
};

export default authOptions;
