import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';

// Auth-gated proxy in front of Hasura for Refine's dataProvider (see
// src/lib/providers/data-provider.ts). Forwards the request body as-is,
// since Refine constructs its own queries — this is the one place
// HASURA_ADMIN_SECRET is used for those. It never reaches the browser.
// (Fixed, hand-written server-side queries, e.g. the transactions export,
// use the lower-level src/lib/server/hasura.ts helper directly instead.)
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.text();

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET as string,
    },
    body,
    cache: 'no-store',
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
