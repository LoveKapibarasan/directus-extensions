'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentRfidSubscriptionSchema, paymentRfidSubscriptionFields } from '@lib/resources/payment-rfid-subscriptions';

export default function EditPaymentRfidSubscriptionPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_rfid_subscriptions"
      id={id}
      schema={paymentRfidSubscriptionSchema}
      fields={paymentRfidSubscriptionFields}
      basePath="/rfid-subscriptions"
      title="titles.rfidSubscriptions.edit"
    />
  );
}
