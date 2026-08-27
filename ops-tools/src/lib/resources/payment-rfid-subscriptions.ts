import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentRfidSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  status: string;
  cancel_at_period_end: boolean;
  current_period_start: string | null;
  current_period_end: string | null;
}

export const paymentRfidSubscriptionSchema = z.object({
  user_id: z.number(),
  plan_id: z.number(),
  stripe_subscription_id: z.string().nullable().optional(),
  stripe_checkout_session_id: z.string().nullable().optional(),
  status: z.enum(['active', 'pending', 'cancelled', 'past_due', 'expired']).default('pending'),
  cancel_at_period_end: z.boolean().default(false),
  current_period_start: z.string().nullable().optional(),
  current_period_end: z.string().nullable().optional(),
});

export const paymentRfidSubscriptionColumns: ResourceColumn<PaymentRfidSubscription>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'user_id', header: 'rfidSubscriptions.userIdColumn' },
  { key: 'plan_id', header: 'rfidSubscriptions.planIdColumn' },
  { key: 'status', header: 'rfidSubscriptions.status' },
  {
    key: 'cancel_at_period_end',
    header: 'rfidSubscriptions.cancelAtPeriodEnd',
    render: (r, t) => (r.cancel_at_period_end ? t('common.yes') : t('common.no')),
  },
];

export const paymentRfidSubscriptionFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'rfidSubscriptions.userLabel',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'plan_id',
    label: 'rfidSubscriptions.planLabel',
    type: 'relation',
    relation: { resource: 'payment_subscription_plans', optionLabel: 'name' },
  },
  {
    name: 'status',
    label: 'rfidSubscriptions.status',
    type: 'select',
    options: [
      { labelKey: 'rfidSubscriptions.statusActive', value: 'active' },
      { labelKey: 'rfidSubscriptions.statusPending', value: 'pending' },
      { labelKey: 'rfidSubscriptions.statusCancelled', value: 'cancelled' },
      { labelKey: 'rfidSubscriptions.statusPastDue', value: 'past_due' },
      { labelKey: 'rfidSubscriptions.statusExpired', value: 'expired' },
    ],
  },
  { name: 'cancel_at_period_end', label: 'rfidSubscriptions.cancelAtPeriodEnd', type: 'checkbox' },
  { name: 'current_period_start', label: 'rfidSubscriptions.currentPeriodStart', type: 'datetime-local' },
  { name: 'current_period_end', label: 'rfidSubscriptions.currentPeriodEnd', type: 'datetime-local' },
  { name: 'stripe_subscription_id', label: 'rfidSubscriptions.stripeSubscriptionId' },
  { name: 'stripe_checkout_session_id', label: 'rfidSubscriptions.stripeCheckoutSessionId' },
];
