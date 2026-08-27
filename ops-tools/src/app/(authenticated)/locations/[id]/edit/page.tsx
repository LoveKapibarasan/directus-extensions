'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentLocationSchema, paymentLocationFields } from '@lib/resources/payment-locations';

export default function EditPaymentLocationPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_locations"
      id={id}
      schema={paymentLocationSchema}
      fields={paymentLocationFields}
      basePath="/locations"
      title="titles.locations.edit"
    />
  );
}
