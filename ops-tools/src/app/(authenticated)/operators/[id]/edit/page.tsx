'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentOperatorSchema, paymentOperatorFields } from '@lib/resources/payment-operators';

export default function EditPaymentOperatorPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_operators"
      id={id}
      schema={paymentOperatorSchema}
      fields={paymentOperatorFields}
      basePath="/operators"
      title="titles.operators.edit"
    />
  );
}
