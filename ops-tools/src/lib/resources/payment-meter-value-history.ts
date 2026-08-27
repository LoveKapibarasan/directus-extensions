import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentMeterValueHistory {
  id: number;
  checkout_id: number;
  recorded_at: string;
  kwh: number;
  power_kw: number | null;
}

export const paymentMeterValueHistorySchema = z.object({
  checkout_id: z.number(),
  recorded_at: z.string().min(1),
  kwh: z.number(),
  power_kw: z.number().nullable().optional(),
});

export const paymentMeterValueHistoryColumns: ResourceColumn<PaymentMeterValueHistory>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'checkout_id', header: 'meterValueHistory.checkoutIdColumn' },
  { key: 'recorded_at', header: 'meterValueHistory.recordedAt' },
  { key: 'kwh', header: 'meterValueHistory.kwh' },
  { key: 'power_kw', header: 'meterValueHistory.powerKw' },
];

export const paymentMeterValueHistoryFields: ResourceFormField[] = [
  {
    name: 'checkout_id',
    label: 'meterValueHistory.checkoutLabel',
    type: 'relation',
    relation: { resource: 'payment_checkouts', optionLabel: 'payment_intent_id' },
  },
  { name: 'recorded_at', label: 'meterValueHistory.recordedAt', type: 'datetime-local' },
  { name: 'kwh', label: 'meterValueHistory.kwh', type: 'number' },
  { name: 'power_kw', label: 'meterValueHistory.powerKw', type: 'number' },
];
