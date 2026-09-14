'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentStationSchema, paymentStationFields } from '@lib/resources/payment-stations';

export default function NewPaymentStationPage() {
  return (
    <ResourceForm
      resource="payment_stations"
      schema={paymentStationSchema}
      fields={paymentStationFields}
      basePath="/stations"
      title="titles.stations.new"
    />
  );
}
