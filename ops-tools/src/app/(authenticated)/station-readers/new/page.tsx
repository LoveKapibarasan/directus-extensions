'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentStationReaderSchema,
  paymentStationReaderFields,
} from '@lib/resources/payment-station-readers';

export default function NewPaymentStationReaderPage() {
  return (
    <ResourceForm
      resource="payment_station_readers"
      schema={paymentStationReaderSchema}
      fields={paymentStationReaderFields}
      basePath="/station-readers"
      title="titles.stationReaders.new"
    />
  );
}
