'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentCheckoutSchema, paymentCheckoutFields } from '@lib/resources/payment-checkouts';

export default function EditPaymentCheckoutPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_checkouts"
      id={id}
      schema={paymentCheckoutSchema}
      fields={paymentCheckoutFields}
      basePath="/checkouts"
      title="titles.checkouts.edit"
    />
  );
}
