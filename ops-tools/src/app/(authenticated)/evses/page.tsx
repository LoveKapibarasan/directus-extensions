'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentEvseColumns, type PaymentEvse } from '@lib/resources/payment-evses';

export default function PaymentEvseListPage() {
  return (
    <ResourceList<PaymentEvse>
      resource="payment_evses"
      columns={paymentEvseColumns}
      basePath="/evses"
      title="nav.evses"
    />
  );
}
