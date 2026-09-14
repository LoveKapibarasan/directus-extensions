'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentStationSchema, paymentStationFields } from '@lib/resources/payment-stations';

export default function EditPaymentStationPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_stations"
      id={id}
      schema={paymentStationSchema}
      fields={paymentStationFields}
      basePath="/stations"
      title="titles.stations.edit"
    />
  );
}
