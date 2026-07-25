import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import { hasuraQuery } from '@/lib/hasura';
import { isPaymentTable } from '@/lib/paymentTables';

const FIELDS_QUERY = `
  query ($table: String!) {
    __type(name: $table) {
      fields {
        name
        type { kind name ofType { kind name } }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get('table') || '';
  if (!isPaymentTable(table)) {
    return NextResponse.json({ error: 'unknown table' }, { status: 400 });
  }

  const typeInfo = await hasuraQuery<{ __type: { fields: any[] } }>(FIELDS_QUERY, {
    table,
  });
  // Only scalar columns; this table set has no tracked relationships.
  const scalarFields = typeInfo.__type.fields
    .filter((f) => f.type.kind === 'SCALAR' || f.type.ofType?.kind === 'SCALAR')
    .map((f) => f.name);

  const rowsQuery = `query { ${table}(limit: 200, order_by: { id: desc }) { ${scalarFields.join(' ')} } }`;
  const data = await hasuraQuery<Record<string, any[]>>(rowsQuery);

  return NextResponse.json({ fields: scalarFields, rows: data[table] });
}

// Edits a single column on a single row. `id` (primary key) can never be
// part of `set` — enforced below, not just left to the caller.
export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get('table') || '';
  if (!isPaymentTable(table)) {
    return NextResponse.json({ error: 'unknown table' }, { status: 400 });
  }

  const body = await req.json();
  const { id, field, value } = body as { id: number; field: string; value: string };
  if (!id || !field) {
    return NextResponse.json({ error: 'id and field are required' }, { status: 400 });
  }
  if (field === 'id') {
    return NextResponse.json({ error: 'id is not editable' }, { status: 400 });
  }

  const typeInfo = await hasuraQuery<{ __type: { fields: any[] } }>(FIELDS_QUERY, { table });
  const known = typeInfo.__type.fields.some((f) => f.name === field);
  if (!known) {
    return NextResponse.json({ error: 'unknown field' }, { status: 400 });
  }

  const mutation = `
    mutation ($id: Int!, $set: ${table}_set_input!) {
      update_${table}_by_pk(pk_columns: { id: $id }, _set: $set) {
        id
      }
    }
  `;
  await hasuraQuery(mutation, { id, set: { [field]: value } });

  return NextResponse.json({ ok: true });
}
