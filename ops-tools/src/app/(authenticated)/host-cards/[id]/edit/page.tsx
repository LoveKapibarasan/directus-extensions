'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentHostCardSchema, paymentHostCardFields } from '@lib/resources/payment-host-cards';

export default function EditPaymentHostCardPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_host_cards"
      id={id}
      schema={paymentHostCardSchema}
      fields={paymentHostCardFields}
      basePath="/host-cards"
      title="titles.hostCards.edit"
    />
  );
}
