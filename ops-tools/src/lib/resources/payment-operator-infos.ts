import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentOperatorInfo {
  id: number;
  operator_id: number;
  language_code: string;
  payment_terms_conditions: string | null;
  operator?: { name: string };
}

export const paymentOperatorInfoSchema = z.object({
  operator_id: z.number(),
  language_code: z.string().min(2).max(5),
  payment_terms_conditions: z.string().nullable().optional(),
});

export const paymentOperatorInfoColumns: ResourceColumn<PaymentOperatorInfo>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'operator_id', header: 'operatorInfos.operatorIdColumn' },
  { key: 'language_code', header: 'operatorInfos.languageColumn' },
  { key: 'payment_terms_conditions', header: 'operatorInfos.termsConditions' },
];

export const paymentOperatorInfoFields: ResourceFormField[] = [
  {
    name: 'operator_id',
    label: 'operatorInfos.operatorLabel',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
  { name: 'language_code', label: 'operatorInfos.languageCodeLabel' },
  { name: 'payment_terms_conditions', label: 'operatorInfos.termsConditions' },
];
