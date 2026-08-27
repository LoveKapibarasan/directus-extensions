import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';

// Auth-gated so GOOGLE_MAPS_API_KEY (unrestricted-by-referrer keys would be
// abusable) never reaches the client bundle directly — the map components
// fetch it from here instead of reading a NEXT_PUBLIC_* env var.
export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    apiKey: process.env.GOOGLE_MAPS_API_KEY ?? null,
    mapId: process.env.GOOGLE_MAPS_LOCATION_PICKER_MAP_ID ?? null,
  });
}
