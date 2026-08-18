'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentCheckoutSchema, paymentCheckoutFields } from '@lib/resources/payment-checkouts';

export default function NewPaymentCheckoutPage() {
  return (
    <ResourceForm
      resource="payment_checkouts"
      schema={paymentCheckoutSchema}
      fields={paymentCheckoutFields}
      basePath="/checkouts"
      title="New Checkout"
    />
  );
}
