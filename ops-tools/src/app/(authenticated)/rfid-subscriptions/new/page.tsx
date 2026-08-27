'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentRfidSubscriptionSchema, paymentRfidSubscriptionFields } from '@lib/resources/payment-rfid-subscriptions';

export default function NewPaymentRfidSubscriptionPage() {
  return (
    <ResourceForm
      resource="payment_rfid_subscriptions"
      schema={paymentRfidSubscriptionSchema}
      fields={paymentRfidSubscriptionFields}
      basePath="/rfid-subscriptions"
      title="titles.rfidSubscriptions.new"
    />
  );
}
