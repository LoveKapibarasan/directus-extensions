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
  ocpp_reservation_id: number | null;
}

// fee_amount_cents is in CENTS, like payment_checkouts.authorization_amount_cents
// (see ISS-PAY-07).
export const paymentReservationSchema = z.object({
  user_id: z.number(),
  connector_id: z.number(),
  tariff_id: z.number(),
  start_time: z.string().min(1),
  duration_minutes: z.number().int().positive(),
  fee_amount_cents: z.number().int(),
  currency: z.string().length(3, 'ISO 4217 currency code, e.g. EUR'),
  payment_intent_id: z.string().nullable().optional(),
  payment_status: z.enum(['paid', 'payment_failed']).nullable().optional(),
  status: z
    .enum(['pending_payment', 'active', 'used', 'expired', 'cancelled', 'hold_failed'])
    .default('pending_payment'),
  ocpp_reservation_id: z.number().int().nullable().optional(),
});

export const paymentReservationColumns: ResourceColumn<PaymentReservation>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'start_time', header: 'reservations.startTime' },
  { key: 'duration_minutes', header: 'reservations.durationMinutes' },
  { key: 'connector_id', header: 'reservations.connectorIdColumn' },
  { key: 'user_id', header: 'reservations.userIdColumn' },
  { key: 'fee_amount_cents', header: 'reservations.feeAmountCentsColumn' },
  { key: 'status', header: 'reservations.status' },
  { key: 'payment_status', header: 'reservations.paymentStatus' },
  { key: 'created_at', header: 'common.createdAt' },
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
  { name: 'duration_minutes', label: 'reservations.durationMinutes', type: 'number' },
  { name: 'fee_amount_cents', label: 'reservations.feeAmountCentsLabel', type: 'number' },
  { name: 'currency', label: 'reservations.currencyLabel' },
  {
    name: 'status',
    label: 'reservations.status',
    type: 'select',
    options: [
      { labelKey: 'reservations.statusPendingPayment', value: 'pending_payment' },
      { labelKey: 'reservations.statusActive', value: 'active' },
      { labelKey: 'reservations.statusUsed', value: 'used' },
      { labelKey: 'reservations.statusExpired', value: 'expired' },
      { labelKey: 'reservations.statusCancelled', value: 'cancelled' },
      { labelKey: 'reservations.statusHoldFailed', value: 'hold_failed' },
    ],
  },
  {
    name: 'payment_status',
    label: 'reservations.paymentStatus',
    type: 'select',
    options: [
      { labelKey: 'reservations.paymentStatusPaid', value: 'paid' },
      { labelKey: 'reservations.paymentStatusFailed', value: 'payment_failed' },
    ],
  },
  { name: 'payment_intent_id', label: 'reservations.paymentIntentId' },
  { name: 'ocpp_reservation_id', label: 'reservations.ocppReservationId', type: 'number' },
];
