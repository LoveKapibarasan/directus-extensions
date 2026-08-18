import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { isAuthorized } from '@/lib/auth';
import { hasuraQuery } from '@/lib/server/hasura';

const QUERY = `
  query ($from: timestamptz!, $to: timestamptz!) {
    Transactions(
      where: { startTime: { _gte: $from, _lte: $to } }
      order_by: { startTime: asc }
    ) {
      id
      stationId
      transactionId
      chargingState
      totalKwh
      totalCost
      startTime
      endTime
      stoppedReason
      isActive
    }
  }
`;

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (!from || !to) {
    return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
  }

  const data = await hasuraQuery<{ Transactions: any[] }>(QUERY, {
    from: `${from}T00:00:00.000Z`,
    to: `${to}T23:59:59.999Z`,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions');
  sheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Station ID', key: 'stationId' },
    { header: 'Transaction ID', key: 'transactionId' },
    { header: 'Charging State', key: 'chargingState' },
    { header: 'Total kWh', key: 'totalKwh' },
    { header: 'Total Cost', key: 'totalCost' },
    { header: 'Start Time', key: 'startTime' },
    { header: 'End Time', key: 'endTime' },
    { header: 'Stopped Reason', key: 'stoppedReason' },
    { header: 'Is Active', key: 'isActive' },
  ];
  sheet.addRows(data.Transactions);

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as any, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="transactions_${from}_${to}.xlsx"`,
    },
  });
}
