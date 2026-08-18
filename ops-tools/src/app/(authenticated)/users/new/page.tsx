'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentUserSchema, paymentUserFields } from '@lib/resources/payment-users';

export default function NewPaymentUserPage() {
  return (
    <ResourceForm
      resource="payment_users"
      schema={paymentUserSchema}
      fields={paymentUserFields}
      basePath="/users"
      title="New User"
    />
  );
}
