import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentOperator {
  id: number;
  name: string;
  stripe_account_id: string;
  account_type: string;
}

export const paymentOperatorSchema = z.object({
  name: z.string().min(1),
  stripe_account_id: z.string().min(1),
  account_type: z.enum(['connected', 'main']),
});

export const paymentOperatorColumns: ResourceColumn<PaymentOperator>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'account_type', header: 'Account type' },
  { key: 'stripe_account_id', header: 'Stripe account ID' },
];

export const paymentOperatorFields: ResourceFormField[] = [
  { name: 'name', label: 'Name' },
  {
    name: 'account_type',
    label: 'Account type',
    type: 'select',
    options: [
      { label: 'connected', value: 'connected' },
      { label: 'main', value: 'main' },
    ],
  },
  { name: 'stripe_account_id', label: 'Stripe account ID' },
];
