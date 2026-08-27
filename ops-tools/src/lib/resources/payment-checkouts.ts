import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentCheckout {
  id: number;
  payment_intent_id: string | null;
  authorization_amount_cents: number | null;
  connector_id: number | null;
  tariff_id: number | null;
  user_id: number | null;
  transaction_start_time: string | null;
  transaction_end_time: string | null;
  transaction_kwh: number | null;
  final_price: number | null;
  payment_status: string | null;
  payment_error: string | null;
  billing_email: string | null;
}

// Note: authorization_amount_cents is in CENTS — a different unit from
// payment_tariffs.authorization_amount (major currency units, e.g. 50.0 =
// EUR 50). Do not confuse the two (past 100x bug, ISS-PAY-07).
export const paymentCheckoutSchema = z.object({
  payment_intent_id: z.string().nullable().optional(),
  authorization_amount_cents: z.number().nullable().optional(),
  connector_id: z.number().nullable().optional(),
  tariff_id: z.number().nullable().optional(),
  user_id: z.number().nullable().optional(),
  transaction_start_time: z.string().nullable().optional(),
  transaction_end_time: z.string().nullable().optional(),
  transaction_kwh: z.number().nullable().optional(),
  final_price: z.number().nullable().optional(),
  payment_status: z
    .enum(['captured', 'cancelled_below_threshold', 'capture_failed', 'authorization_released'])
    .nullable()
    .optional(),
  payment_error: z.string().nullable().optional(),
  billing_email: z.string().nullable().optional(),
});

export const paymentCheckoutColumns: ResourceColumn<PaymentCheckout>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'payment_intent_id', header: 'checkouts.paymentIntentColumn' },
  { key: 'authorization_amount_cents', header: 'checkouts.authAmountCentsColumn' },
  { key: 'final_price', header: 'checkouts.finalPrice' },
  { key: 'payment_status', header: 'checkouts.statusColumn' },
  { key: 'billing_email', header: 'checkouts.billingEmail' },
];

export const paymentCheckoutFields: ResourceFormField[] = [
  { name: 'billing_email', label: 'checkouts.billingEmail' },
  { name: 'payment_intent_id', label: 'checkouts.paymentIntentIdLabel' },
  {
    name: 'authorization_amount_cents',
    label: 'checkouts.authAmountCentsLabel',
    type: 'number',
  },
  { name: 'final_price', label: 'checkouts.finalPrice', type: 'number' },
  {
    name: 'payment_status',
    label: 'checkouts.paymentStatusLabel',
    type: 'select',
    options: [
      { labelKey: 'checkouts.statusCaptured', value: 'captured' },
      { labelKey: 'checkouts.statusCancelledBelowThreshold', value: 'cancelled_below_threshold' },
      { labelKey: 'checkouts.statusCaptureFailed', value: 'capture_failed' },
      { labelKey: 'checkouts.statusAuthorizationReleased', value: 'authorization_released' },
    ],
  },
  { name: 'payment_error', label: 'checkouts.paymentError' },
  {
    name: 'user_id',
    label: 'checkouts.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'connector_id',
    label: 'checkouts.connector',
    type: 'relation',
    relation: { resource: 'payment_connectors', optionLabel: 'connector_id' },
  },
  {
    name: 'tariff_id',
    label: 'checkouts.tariff',
    type: 'relation',
    relation: { resource: 'payment_tariffs', optionLabel: 'currency' },
  },
  { name: 'transaction_start_time', label: 'checkouts.transactionStart', type: 'datetime-local' },
  { name: 'transaction_end_time', label: 'checkouts.transactionEnd', type: 'datetime-local' },
  { name: 'transaction_kwh', label: 'checkouts.transactionKwh', type: 'number' },
];
