'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentCheckoutColumns, type PaymentCheckout } from '@lib/resources/payment-checkouts';

export default function PaymentCheckoutListPage() {
  return (
    <ResourceList<PaymentCheckout>
      resource="payment_checkouts"
      columns={paymentCheckoutColumns}
      basePath="/checkouts"
      title="nav.checkouts"
    />
  );
}
