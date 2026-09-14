'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentStationReaderSchema, paymentStationReaderFields } from '@lib/resources/payment-station-readers';

export default function EditPaymentStationReaderPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_station_readers"
      id={id}
      schema={paymentStationReaderSchema}
      fields={paymentStationReaderFields}
      basePath="/station-readers"
      title="titles.stationReaders.edit"
    />
  );
}
