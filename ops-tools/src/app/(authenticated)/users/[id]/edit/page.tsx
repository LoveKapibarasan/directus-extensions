'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentUserSchema, paymentUserFields } from '@lib/resources/payment-users';

export default function EditPaymentUserPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_users"
      id={id}
      schema={paymentUserSchema}
      fields={paymentUserFields}
      basePath="/users"
      title="titles.users.edit"
    />
  );
}
