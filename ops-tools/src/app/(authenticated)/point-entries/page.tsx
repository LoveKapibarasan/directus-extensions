'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import { paymentPointEntryColumns, type PaymentPointEntry } from '@lib/resources/payment-point-entries';

export default function PaymentPointEntryListPage() {
  return (
    <ResourceList<PaymentPointEntry>
      resource="payment_point_entries"
      columns={paymentPointEntryColumns}
      basePath="/point-entries"
      title="nav.pointEntries"
      actions={readOnlyActions}
    />
  );
}
