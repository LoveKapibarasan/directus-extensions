'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentRfidSubscriptionColumns, type PaymentRfidSubscription } from '@lib/resources/payment-rfid-subscriptions';

export default function PaymentRfidSubscriptionListPage() {
  return (
    <ResourceList<PaymentRfidSubscription>
      resource="payment_rfid_subscriptions"
      columns={paymentRfidSubscriptionColumns}
      basePath="/rfid-subscriptions"
      title="RFID Subscriptions"
    />
  );
}
