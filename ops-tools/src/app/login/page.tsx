// Where the middleware sends a visitor without a session. It exists so that
// the first page a link-preview crawler sees is rendered with the root layout's
// OGP metadata; NextAuth's built-in sign-in page carries none. Browsers move on
// to that sign-in page at once.
export default async function LoginRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (key === 'callbackUrl' || key === 'error') params.set(key, Array.isArray(value) ? value[0] : (value ?? ''));
  }
  const target = `/api/auth/signin${params.size ? `?${params}` : ''}`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p className="p-6 text-sm text-muted-foreground">
        <a href={target}>Sign in</a>
      </p>
    </>
  );
}
