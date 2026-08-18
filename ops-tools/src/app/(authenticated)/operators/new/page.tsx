'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentOperatorSchema, paymentOperatorFields } from '@lib/resources/payment-operators';

export default function NewPaymentOperatorPage() {
  return (
    <ResourceForm
      resource="payment_operators"
      schema={paymentOperatorSchema}
      fields={paymentOperatorFields}
      basePath="/operators"
      title="New Operator"
    />
  );
}
