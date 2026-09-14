'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentStationReaderColumns, type PaymentStationReader } from '@lib/resources/payment-station-readers';

export default function PaymentStationReaderListPage() {
  return (
    <ResourceList<PaymentStationReader>
      resource="payment_station_readers"
      columns={paymentStationReaderColumns}
      basePath="/station-readers"
      title="nav.stationReaders"
    />
  );
}
