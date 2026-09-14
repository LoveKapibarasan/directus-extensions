'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentStationColumns, type PaymentStation } from '@lib/resources/payment-stations';

export default function PaymentStationListPage() {
  return (
    <ResourceList<PaymentStation>
      resource="payment_stations"
      columns={paymentStationColumns}
      basePath="/stations"
      title="nav.stations"
    />
  );
}
