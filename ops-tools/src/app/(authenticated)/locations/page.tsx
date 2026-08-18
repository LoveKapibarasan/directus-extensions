'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentLocationColumns, type PaymentLocation } from '@lib/resources/payment-locations';

export default function PaymentLocationListPage() {
  return (
    <ResourceList<PaymentLocation>
      resource="payment_locations"
      columns={paymentLocationColumns}
      basePath="/locations"
      title="Locations"
    />
  );
}
