import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentTariff {
  id: number;
  price_kwh: number | null;
  price_minute: number | null;
  price_session: number | null;
  currency: string;
  tax_rate: number;
  // Major currency units (e.g. 50.0 = EUR 50) — NOT the same unit as
  // payment_checkouts.authorization_amount_cents (cents). See ISS-PAY-07.
  authorization_amount: number;
  payment_fee: number;
  stripe_price_id: string | null;
  block_start_minute: number | null;
  block_price_minute: number | null;
  block_price_limit: number | null;
}

export const paymentTariffSchema = z.object({
  currency: z.string().length(3, 'ISO 4217 currency code, e.g. EUR'),
  tax_rate: z.number(),
  authorization_amount: z.number(),
  payment_fee: z.number(),
  price_kwh: z.number().nullable().optional(),
  price_minute: z.number().nullable().optional(),
  price_session: z.number().nullable().optional(),
  stripe_price_id: z.string().nullable().optional(),
  block_start_minute: z.number().nullable().optional(),
  block_price_minute: z.number().nullable().optional(),
  block_price_limit: z.number().nullable().optional(),
});

export const paymentTariffColumns: ResourceColumn<PaymentTariff>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'currency', header: 'tariffs.currencyColumn' },
  { key: 'price_kwh', header: 'tariffs.priceKwhColumn' },
  { key: 'price_minute', header: 'tariffs.priceMinuteColumn' },
  { key: 'tax_rate', header: 'tariffs.taxRate' },
  {
    key: 'authorization_amount',
    header: 'tariffs.authAmountColumn',
  },
  { key: 'payment_fee', header: 'tariffs.paymentFee' },
  { key: 'stripe_price_id', header: 'tariffs.stripePriceId' },
];

export const paymentTariffFields: ResourceFormField[] = [
  { name: 'currency', label: 'tariffs.currencyLabel' },
  { name: 'tax_rate', label: 'tariffs.taxRate', type: 'number' },
  {
    name: 'authorization_amount',
    label: 'tariffs.authAmountLabel',
    type: 'number',
  },
  { name: 'payment_fee', label: 'tariffs.paymentFee', type: 'number' },
  { name: 'price_kwh', label: 'tariffs.priceKwhLabel', type: 'number' },
  { name: 'price_minute', label: 'tariffs.priceMinuteLabel', type: 'number' },
  { name: 'price_session', label: 'tariffs.priceSession', type: 'number' },
  { name: 'stripe_price_id', label: 'tariffs.stripePriceId' },
  { name: 'block_start_minute', label: 'tariffs.blockStartMinute', type: 'number' },
  { name: 'block_price_minute', label: 'tariffs.blockPriceMinute', type: 'number' },
  { name: 'block_price_limit', label: 'tariffs.blockPriceLimit', type: 'number' },
];
