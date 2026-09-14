'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import { paymentProcessedStripeEventColumns, type PaymentProcessedStripeEvent } from '@lib/resources/payment-processed-stripe-events';

export default function PaymentProcessedStripeEventListPage() {
  return (
    <ResourceList<PaymentProcessedStripeEvent>
      resource="payment_processed_stripe_events"
      columns={paymentProcessedStripeEventColumns}
      basePath="/processed-stripe-events"
      title="nav.processedStripeEvents"
      actions={readOnlyActions}
    />
  );
}
