import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { isAuthorized } from '@/lib/auth';
import { hasuraQuery } from '@/lib/server/hasura';
import {
  aggregateSales,
  isSalesView,
  loadSaleSessions,
  platformFeeCents,
  salesWindow,
  SALES_TIMEZONE,
} from '@/lib/server/sales';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/sales?from=YYYY-MM-DD&to=YYYY-MM-DD&view=summary|location|operator|day|month[&format=xlsx]
export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') ?? '';
  const to = searchParams.get('to') ?? '';
  const view = searchParams.get('view') ?? 'summary';
  if (!DATE.test(from) || !DATE.test(to) || from > to) {
    return NextResponse.json({ error: 'from and to are required (YYYY-MM-DD, from <= to)' }, { status: 400 });
  }
  if (!isSalesView(view)) {
    return NextResponse.json({ error: 'unknown view' }, { status: 400 });
  }

  const { start, end } = salesWindow(from, to);
  const sessions = await loadSaleSessions(hasuraQuery, start, end);
  const fee = platformFeeCents();
  const rows = aggregateSales(sessions, view, fee);

  if (searchParams.get('format') !== 'xlsx') {
    return NextResponse.json({ from, to, view, timeZone: SALES_TIMEZONE, platformFeeCents: fee, rows });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sales');
  sheet.columns = [
    { header: view === 'summary' ? 'Period' : view === 'day' ? 'Day' : view === 'month' ? 'Month' : view === 'location' ? 'Location' : 'Operator', key: 'group', width: 32 },
    { header: 'Currency', key: 'currency' },
    { header: 'Sessions', key: 'sessions' },
    { header: 'Revenue', key: 'revenue', style: { numFmt: '#,##0.00' } },
    { header: 'kWh', key: 'kwh', style: { numFmt: '#,##0.000' } },
    { header: 'Exported kWh', key: 'exportedKwh', style: { numFmt: '#,##0.000' } },
    { header: 'Platform fee', key: 'platformFee', style: { numFmt: '#,##0.00' } },
  ];
  sheet.addRows(
    rows.map((r) => ({
      group: view === 'summary' ? `${from} – ${to}` : (r.label ?? (r.key || '—')),
      currency: r.currency || '—',
      sessions: r.sessions,
      revenue: r.revenueCents / 100,
      kwh: r.kwh,
      exportedKwh: r.exportedKwh,
      platformFee: r.platformFeeCents == null ? null : r.platformFeeCents / 100,
    })),
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as any, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sales_${view}_${from}_${to}.xlsx"`,
    },
  });
}
