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
  { key: 'id', header: 'common.id' },
  { key: 'name', header: 'subscriptionPlans.name' },
  { key: 'locale', header: 'subscriptionPlans.localeColumn' },
  {
    key: 'is_active',
    header: 'subscriptionPlans.active',
    render: (r, t) => (r.is_active ? t('common.yes') : t('common.no')),
  },
  { key: 'stripe_price_id', header: 'subscriptionPlans.stripePriceId' },
];

export const paymentSubscriptionPlanFields: ResourceFormField[] = [
  { name: 'name', label: 'subscriptionPlans.name' },
  { name: 'locale', label: 'subscriptionPlans.localeLabel' },
  { name: 'stripe_price_id', label: 'subscriptionPlans.stripePriceId' },
  { name: 'is_active', label: 'subscriptionPlans.active', type: 'checkbox' },
];
