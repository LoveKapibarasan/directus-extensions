'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentEvseSchema, paymentEvseFields } from '@lib/resources/payment-evses';

export default function EditPaymentEvsePage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_evses"
      id={id}
      schema={paymentEvseSchema}
      fields={paymentEvseFields}
      basePath="/evses"
      title="Edit EVSE"
    />
  );
}
