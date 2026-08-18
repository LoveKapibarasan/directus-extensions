// Server-only Hasura client. This is the one place HASURA_ADMIN_SECRET is
// used directly for a fixed, hand-written query (e.g. the transactions
// export). Client-side data fetching (Refine's dataProvider) goes through
// /api/graphql instead, which wraps this same pattern behind an
// authorization check for arbitrary Refine-generated queries.
export async function hasuraQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join('; '));
  }
  return json.data;
}
