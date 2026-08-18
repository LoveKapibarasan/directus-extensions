import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentSubscriptionPlan {
  id: number;
  name: string;
  locale: string;
  stripe_price_id: string;
  is_active: boolean;
}

export const paymentSubscriptionPlanSchema = z.object({
  name: z.string().min(1),
  locale: z.string().default('en'),
  stripe_price_id: z.string().default(''),
  is_active: z.boolean().default(true),
});

export const paymentSubscriptionPlanColumns: ResourceColumn<PaymentSubscriptionPlan>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'locale', header: 'Locale' },
  { key: 'is_active', header: 'Active', render: (r) => (r.is_active ? 'Yes' : 'No') },
  { key: 'stripe_price_id', header: 'Stripe price ID' },
];

export const paymentSubscriptionPlanFields: ResourceFormField[] = [
  { name: 'name', label: 'Name' },
  { name: 'locale', label: 'Locale (e.g. en, de, ja)' },
  { name: 'stripe_price_id', label: 'Stripe price ID' },
  { name: 'is_active', label: 'Active', type: 'checkbox' },
];
