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
  { key: 'id', header: 'common.id' },
  { key: 'name', header: 'operators.name' },
  { key: 'account_type', header: 'operators.accountType' },
  { key: 'stripe_account_id', header: 'operators.stripeAccountId' },
];

export const paymentOperatorFields: ResourceFormField[] = [
  { name: 'name', label: 'operators.name' },
  {
    name: 'account_type',
    label: 'operators.accountType',
    type: 'select',
    options: [
      { labelKey: 'operators.accountTypeConnected', value: 'connected' },
      { labelKey: 'operators.accountTypeMain', value: 'main' },
    ],
  },
  { name: 'stripe_account_id', label: 'operators.stripeAccountId' },
];
