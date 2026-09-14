import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// All *_cents amounts are in CENTS. vat_rate is a percentage (e.g. 19.00).
export interface PaymentShopOrder {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  discount_cents: number;
  currency: string;
  vat_rate: number;
  vat_cents: number;
  total_cents: number;
  ship_name: string;
  ship_street: string;
  ship_postal_code: string;
  ship_city: string;
  ship_country: string;
  payment_intent_id: string | null;
  checkout_session_id: string | null;
  state: string;
  tracking_reference: string | null;
  created_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
}

export const paymentShopOrderSchema = z.object({
  user_id: z.number(),
  product_id: z.number(),
  quantity: z.number().int().positive().default(1),
  unit_price_cents: z.number().int(),
  discount_cents: z.number().int().default(0),
  currency: z.string().length(3, 'ISO 4217 currency code, e.g. EUR').default('EUR'),
  vat_rate: z.number().default(19),
  vat_cents: z.number().int().default(0),
  total_cents: z.number().int().min(0),
  ship_name: z.string().min(1),
  ship_street: z.string().min(1),
  ship_postal_code: z.string().min(1),
  ship_city: z.string().min(1),
  ship_country: z.string().length(2, 'ISO 3166-1 alpha-2, e.g. DE'),
  payment_intent_id: z.string().nullable().optional(),
  checkout_session_id: z.string().nullable().optional(),
  state: z.enum(['pending_payment', 'paid', 'shipped', 'cancelled']).default('pending_payment'),
  tracking_reference: z.string().nullable().optional(),
  paid_at: z.string().nullable().optional(),
  shipped_at: z.string().nullable().optional(),
});

export const paymentShopOrderColumns: ResourceColumn<PaymentShopOrder>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'created_at', header: 'common.createdAt' },
  { key: 'user_id', header: 'shopOrders.userIdColumn' },
  { key: 'product_id', header: 'shopOrders.productIdColumn' },
  { key: 'quantity', header: 'shopOrders.quantity' },
  { key: 'total_cents', header: 'shopOrders.totalCentsColumn' },
  { key: 'currency', header: 'common.currency' },
  { key: 'state', header: 'shopOrders.state' },
  { key: 'tracking_reference', header: 'shopOrders.trackingReference' },
];

export const paymentShopOrderFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'shopOrders.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'product_id',
    label: 'shopOrders.product',
    type: 'relation',
    relation: { resource: 'payment_shop_products', optionLabel: 'name' },
  },
  { name: 'quantity', label: 'shopOrders.quantity', type: 'number' },
  { name: 'unit_price_cents', label: 'shopOrders.unitPriceCents', type: 'number' },
  { name: 'discount_cents', label: 'shopOrders.discountCents', type: 'number' },
  { name: 'currency', label: 'common.currency' },
  { name: 'vat_rate', label: 'shopOrders.vatRate', type: 'number' },
  { name: 'vat_cents', label: 'shopOrders.vatCents', type: 'number' },
  { name: 'total_cents', label: 'shopOrders.totalCentsLabel', type: 'number' },
  {
    name: 'state',
    label: 'shopOrders.state',
    type: 'select',
    options: [
      { labelKey: 'shopOrders.statePendingPayment', value: 'pending_payment' },
      { labelKey: 'shopOrders.statePaid', value: 'paid' },
      { labelKey: 'shopOrders.stateShipped', value: 'shipped' },
      { labelKey: 'shopOrders.stateCancelled', value: 'cancelled' },
    ],
  },
  { name: 'tracking_reference', label: 'shopOrders.trackingReference' },
  { name: 'paid_at', label: 'shopOrders.paidAt', type: 'datetime-local' },
  { name: 'shipped_at', label: 'shopOrders.shippedAt', type: 'datetime-local' },
  { name: 'ship_name', label: 'shopOrders.shipName' },
  { name: 'ship_street', label: 'shopOrders.shipStreet' },
  { name: 'ship_postal_code', label: 'shopOrders.shipPostalCode' },
  { name: 'ship_city', label: 'shopOrders.shipCity' },
  { name: 'ship_country', label: 'shopOrders.shipCountry' },
  { name: 'payment_intent_id', label: 'shopOrders.paymentIntentId' },
  { name: 'checkout_session_id', label: 'shopOrders.checkoutSessionId' },
];
