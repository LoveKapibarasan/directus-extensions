'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentOperatorInfoSchema, paymentOperatorInfoFields } from '@lib/resources/payment-operator-infos';

export default function NewPaymentOperatorInfoPage() {
  return (
    <ResourceForm
      resource="payment_operator_infos"
      schema={paymentOperatorInfoSchema}
      fields={paymentOperatorInfoFields}
      basePath="/operator-infos"
      title="New Operator Info"
    />
  );
}
