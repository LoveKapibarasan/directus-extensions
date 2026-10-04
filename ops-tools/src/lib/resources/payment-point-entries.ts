import type { ResourceColumn } from '@lib/components/crud/resource-table';

// The points ledger (payments migration 0048): a driver's balance is the sum
// of these rows, so it's listed read-only -- an edited row would change a
// balance with nothing in the ledger saying why. Positive amounts are credit
// earned by exporting energy, negative ones are points spent on a session.
export interface PaymentPointEntry {
  id: number;
  user_id: number;
  checkout_id: number | null;
  amount_cents: number;
  currency: string;
  reason: string;
  created_at: string;
}

export const paymentPointEntryColumns: ResourceColumn<PaymentPointEntry>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'created_at', header: 'common.createdAt' },
  { key: 'user_id', header: 'pointEntries.userIdColumn' },
  { key: 'checkout_id', header: 'pointEntries.checkoutIdColumn' },
  { key: 'amount_cents', header: 'pointEntries.amountCents' },
  { key: 'currency', header: 'pointEntries.currency' },
  {
    key: 'reason',
    header: 'pointEntries.reason',
    render: (r, t) =>
      r.reason === 'export_credit'
        ? t('pointEntries.reasonExportCredit')
        : r.reason === 'session_payment'
          ? t('pointEntries.reasonSessionPayment')
          : r.reason,
  },
];
