import type { ResourceColumn } from '@lib/components/crud/resource-table';

// Webhook idempotency log written by the payments backend — read-only.
export interface PaymentProcessedStripeEvent {
  id: number;
  stripe_event_id: string;
  event_type: string;
  created_at: string;
}

export const paymentProcessedStripeEventColumns: ResourceColumn<PaymentProcessedStripeEvent>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'stripe_event_id', header: 'processedStripeEvents.stripeEventId' },
  { key: 'event_type', header: 'processedStripeEvents.eventType' },
  { key: 'created_at', header: 'common.createdAt' },
];
