'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentUserColumns, type PaymentUser } from '@lib/resources/payment-users';

export default function PaymentUserListPage() {
  return (
    <ResourceList<PaymentUser>
      resource="payment_users"
      columns={paymentUserColumns}
      basePath="/users"
      title="Users"
    />
  );
}
