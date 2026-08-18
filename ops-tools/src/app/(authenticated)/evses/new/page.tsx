'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentEvseSchema, paymentEvseFields } from '@lib/resources/payment-evses';

export default function NewPaymentEvsePage() {
  return (
    <ResourceForm
      resource="payment_evses"
      schema={paymentEvseSchema}
      fields={paymentEvseFields}
      basePath="/evses"
      title="New EVSE"
    />
  );
}
