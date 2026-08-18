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
  { key: 'id', header: 'ID' },
  { key: 'user_id', header: 'User ID' },
  { key: 'plan_id', header: 'Plan ID' },
  { key: 'status', header: 'Status' },
  {
    key: 'cancel_at_period_end',
    header: 'Cancel at period end',
    render: (r) => (r.cancel_at_period_end ? 'Yes' : 'No'),
  },
];

export const paymentRfidSubscriptionFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'User',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'plan_id',
    label: 'Plan',
    type: 'relation',
    relation: { resource: 'payment_subscription_plans', optionLabel: 'name' },
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['active', 'pending', 'cancelled', 'past_due', 'expired'].map((s) => ({
      label: s,
      value: s,
    })),
  },
  { name: 'cancel_at_period_end', label: 'Cancel at period end', type: 'checkbox' },
  { name: 'current_period_start', label: 'Current period start', type: 'datetime-local' },
  { name: 'current_period_end', label: 'Current period end', type: 'datetime-local' },
  { name: 'stripe_subscription_id', label: 'Stripe subscription ID' },
  { name: 'stripe_checkout_session_id', label: 'Stripe checkout session ID' },
];
