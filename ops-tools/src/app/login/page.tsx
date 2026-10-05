import { AutoSignIn } from './auto-sign-in';

// Where the middleware sends a visitor without a session. Rendered with the
// root layout's OGP metadata, so a link-preview crawler sees those tags rather
// than NextAuth's bare sign-in page.
//
// With Keycloak the browser goes straight to Keycloak from here: whoever is
// already signed in to Operator UI (same realm, same `internal` client) comes
// straight back without a password, instead of stopping at NextAuth's
// "Sign in with Keycloak" page first.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const callbackUrl = first(params.callbackUrl) || '/';
  const error = first(params.error);
  const fallback = `/api/auth/signin?${new URLSearchParams({
    callbackUrl,
    ...(error ? { error } : {}),
  })}`;
  // Read per request on the server: the image is built without the deployment's
  // NEXT_PUBLIC_* values, so the client bundle can't be asked.
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'generic';
  return <AutoSignIn keycloak={provider === 'keycloak'} callbackUrl={callbackUrl} fallback={fallback} />;
}
