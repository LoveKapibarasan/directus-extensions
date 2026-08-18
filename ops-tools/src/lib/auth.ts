import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/options';

export async function isAuthorized(_req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session;
}
