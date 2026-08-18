'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentOperatorInfoSchema, paymentOperatorInfoFields } from '@lib/resources/payment-operator-infos';

export default function EditPaymentOperatorInfoPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_operator_infos"
      id={id}
      schema={paymentOperatorInfoSchema}
      fields={paymentOperatorInfoFields}
      basePath="/operator-infos"
      title="Edit Operator Info"
    />
  );
}
