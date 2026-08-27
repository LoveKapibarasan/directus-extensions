import { resources } from '@lib/resources';

const HASURA_SOURCE = 'default';
const SCHEMA = 'public';

interface HasuraMetadataTable {
  table: { schema: string; name: string };
}

interface HasuraMetadataSource {
  name: string;
  tables?: HasuraMetadataTable[];
}

function metadataUrlFrom(graphqlUrl: string): string {
  return graphqlUrl.replace(/\/v1\/graphql\/?$/, '/v1/metadata');
}

async function callMetadata(url: string, secret: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': secret },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Hasura metadata API returned ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * ops-tools' payment_* tables live in the same Postgres DB citrineos-operator-ui
 * uses, but Hasura only exposes a table over GraphQL once it's explicitly
 * tracked. A freshly migrated DB (or a new environment) can have the tables
 * present without that tracking step ever having been done in the Hasura
 * console, which surfaces as "field 'payment_x' not found in type:
 * 'query_root'" the first time someone opens the app. Runs once at boot and
 * tracks whatever's missing so that doesn't have to happen by hand.
 */
export async function ensurePaymentTablesTracked(): Promise<void> {
  const graphqlUrl = process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;
  if (!graphqlUrl || !secret) return;

  const metadataUrl = metadataUrlFrom(graphqlUrl);

  try {
    const exported = await callMetadata(metadataUrl, secret, {
      type: 'export_metadata',
      args: {},
    });
    const source: HasuraMetadataSource | undefined = exported?.sources?.find(
      (s: HasuraMetadataSource) => s.name === HASURA_SOURCE,
    );
    const tracked = new Set(
      (source?.tables ?? []).map((t) => `${t.table.schema}.${t.table.name}`),
    );

    const expected = resources.map((r) => r.name as string);
    const missing = expected.filter((name) => !tracked.has(`${SCHEMA}.${name}`));
    if (missing.length === 0) return;

    const result = await callMetadata(metadataUrl, secret, {
      type: 'bulk_keep_going',
      args: missing.map((name) => ({
        type: 'pg_track_table',
        args: { source: HASURA_SOURCE, table: { schema: SCHEMA, name } },
      })),
    });

    missing.forEach((name, i) => {
      const item = result?.[i];
      if (item?.error) {
        console.warn(`[hasura] could not track '${name}': ${item.error}`);
      } else {
        console.log(`[hasura] tracked '${name}' (was missing from Hasura metadata)`);
      }
    });
  } catch (err) {
    console.warn('[hasura] skipped auto-tracking payment_* tables:', err);
  }
}
