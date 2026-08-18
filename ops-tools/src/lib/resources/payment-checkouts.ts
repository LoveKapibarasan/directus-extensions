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
  { key: 'id', header: 'ID' },
  { key: 'payment_intent_id', header: 'Payment intent' },
  { key: 'authorization_amount_cents', header: 'Auth. amount (cents)' },
  { key: 'final_price', header: 'Final price' },
  { key: 'payment_status', header: 'Status' },
  { key: 'billing_email', header: 'Billing email' },
];

export const paymentCheckoutFields: ResourceFormField[] = [
  { name: 'billing_email', label: 'Billing email' },
  { name: 'payment_intent_id', label: 'Stripe payment intent ID' },
  {
    name: 'authorization_amount_cents',
    label: 'Authorization amount (CENTS, e.g. 5000 = EUR 50 — not major units)',
    type: 'number',
  },
  { name: 'final_price', label: 'Final price', type: 'number' },
  {
    name: 'payment_status',
    label: 'Payment status',
    type: 'select',
    options: [
      'captured',
      'cancelled_below_threshold',
      'capture_failed',
      'authorization_released',
    ].map((s) => ({ label: s, value: s })),
  },
  { name: 'payment_error', label: 'Payment error' },
  {
    name: 'user_id',
    label: 'User',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'connector_id',
    label: 'Connector',
    type: 'relation',
    relation: { resource: 'payment_connectors', optionLabel: 'connector_id' },
  },
  {
    name: 'tariff_id',
    label: 'Tariff',
    type: 'relation',
    relation: { resource: 'payment_tariffs', optionLabel: 'currency' },
  },
  { name: 'transaction_start_time', label: 'Transaction start', type: 'datetime-local' },
  { name: 'transaction_end_time', label: 'Transaction end', type: 'datetime-local' },
  { name: 'transaction_kwh', label: 'Transaction kWh', type: 'number' },
];
