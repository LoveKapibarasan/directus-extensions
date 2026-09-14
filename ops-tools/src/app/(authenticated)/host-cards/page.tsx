'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentHostCardColumns, type PaymentHostCard } from '@lib/resources/payment-host-cards';

export default function PaymentHostCardListPage() {
  return (
    <ResourceList<PaymentHostCard>
      resource="payment_host_cards"
      columns={paymentHostCardColumns}
      basePath="/host-cards"
      title="nav.hostCards"
      actions={{ create: false, delete: false }}
    />
  );
}
