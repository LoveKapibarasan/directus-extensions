import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';

// Auth-gated proxy in front of Hasura. This is the one place
// HASURA_ADMIN_SECRET is used — it never reaches the browser. Refine's
// dataProvider (see src/lib/providers/data-provider.ts) is pointed at this
// route instead of talking to Hasura directly.
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
