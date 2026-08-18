'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentLocationSchema, paymentLocationFields } from '@lib/resources/payment-locations';

export default function NewPaymentLocationPage() {
  return (
    <ResourceForm
      resource="payment_locations"
      schema={paymentLocationSchema}
      fields={paymentLocationFields}
      basePath="/locations"
      title="New Location"
    />
  );
}
