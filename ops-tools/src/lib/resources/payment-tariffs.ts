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
  { key: 'id', header: 'ID' },
  { key: 'currency', header: 'Currency' },
  { key: 'price_kwh', header: 'Price/kWh' },
  { key: 'price_minute', header: 'Price/min' },
  { key: 'tax_rate', header: 'Tax rate' },
  {
    key: 'authorization_amount',
    header: 'Auth. amount (major units)',
  },
  { key: 'payment_fee', header: 'Payment fee' },
  { key: 'stripe_price_id', header: 'Stripe price ID' },
];

export const paymentTariffFields: ResourceFormField[] = [
  { name: 'currency', label: 'Currency (ISO 4217, e.g. EUR)' },
  { name: 'tax_rate', label: 'Tax rate', type: 'number' },
  {
    name: 'authorization_amount',
    label: 'Authorization amount (major units, e.g. 50 = EUR 50 — not cents)',
    type: 'number',
  },
  { name: 'payment_fee', label: 'Payment fee', type: 'number' },
  { name: 'price_kwh', label: 'Price per kWh', type: 'number' },
  { name: 'price_minute', label: 'Price per minute', type: 'number' },
  { name: 'price_session', label: 'Price per session', type: 'number' },
  { name: 'stripe_price_id', label: 'Stripe price ID' },
  { name: 'block_start_minute', label: 'Block start minute', type: 'number' },
  { name: 'block_price_minute', label: 'Block price per minute', type: 'number' },
  { name: 'block_price_limit', label: 'Block price limit', type: 'number' },
];
