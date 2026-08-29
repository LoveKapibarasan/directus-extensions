import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentReservation {
  id: number;
  user_id: number;
  connector_id: number;
  tariff_id: number;
  start_time: string;
  duration_minutes: number;
  fee_amount_cents: number;
  currency: string;
  payment_intent_id: string | null;
  payment_status: string | null;
  status: string;
  created_at: string;
}

export const paymentReservationSchema = z.object({
  user_id: z.number(),
  connector_id: z.number(),
  tariff_id: z.number(),
  start_time: z.string().min(1),
  duration_minutes: z.number(),
  fee_amount_cents: z.number(),
  currency: z.string().min(1),
  payment_intent_id: z.string().nullable().optional(),
  payment_status: z.string().nullable().optional(),
  status: z.enum(['pending_payment', 'active', 'expired', 'cancelled']),
});

export const paymentReservationColumns: ResourceColumn<PaymentReservation>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'start_time', header: 'reservations.startTime' },
  { key: 'duration_minutes', header: 'reservations.durationMinutesColumn' },
  { key: 'fee_amount_cents', header: 'reservations.feeAmountCentsColumn' },
  { key: 'status', header: 'reservations.statusColumn' },
];

export const paymentReservationFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'reservations.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'connector_id',
    label: 'reservations.connector',
    type: 'relation',
    relation: { resource: 'payment_connectors', optionLabel: 'connector_id' },
  },
  {
    name: 'tariff_id',
    label: 'reservations.tariff',
    type: 'relation',
    relation: { resource: 'payment_tariffs', optionLabel: 'currency' },
  },
  { name: 'start_time', label: 'reservations.startTime', type: 'datetime-local' },
  { name: 'duration_minutes', label: 'reservations.durationMinutesLabel', type: 'number' },
  { name: 'fee_amount_cents', label: 'reservations.feeAmountCentsLabel', type: 'number' },
  { name: 'currency', label: 'reservations.currency' },
  { name: 'payment_intent_id', label: 'reservations.paymentIntentIdLabel' },
  { name: 'payment_status', label: 'reservations.paymentStatusLabel' },
  {
    name: 'status',
    label: 'reservations.statusLabel',
    type: 'select',
    options: [
      { labelKey: 'reservations.statusPendingPayment', value: 'pending_payment' },
      { labelKey: 'reservations.statusActive', value: 'active' },
      { labelKey: 'reservations.statusExpired', value: 'expired' },
      { labelKey: 'reservations.statusCancelled', value: 'cancelled' },
    ],
  },
];
