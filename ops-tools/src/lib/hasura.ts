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
