'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentOperatorColumns, type PaymentOperator } from '@lib/resources/payment-operators';

export default function PaymentOperatorListPage() {
  return (
    <ResourceList<PaymentOperator>
      resource="payment_operators"
      columns={paymentOperatorColumns}
      basePath="/operators"
      title="nav.operators"
    />
  );
}
