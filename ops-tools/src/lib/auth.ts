import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { decode } from 'next-auth/jwt';
import authOptions from '@/app/api/auth/[...nextauth]/options';

// Accepts either a normal NextAuth session cookie (standalone use) or a
// short-lived Bearer handoff token minted by Operator-UI's
// /api/extensions/token endpoint and delivered via postMessage (embedded use).
export async function isAuthorized(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (session) return true;

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length);
    try {
      const decoded = await decode({
        token,
        secret: process.env.NEXTAUTH_SECRET as string,
      });
      return decoded?.purpose === 'extension-handoff';
    } catch {
      return false;
    }
  }
  return false;
}
