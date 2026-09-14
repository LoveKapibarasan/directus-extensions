import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentShopProduct {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  price_cents: number;
  currency: string;
  stock: number | null;
  is_listed: boolean;
  created_at: string | null;
  updated_at: string | null;
  discount_type: string | null;
  discount_value: number | null;
  discount_label: string | null;
  discount_visible: boolean;
}

// Mirrors ck_shop_product_discount: no discount, a 1-100 percent, or a
// cents amount >= 1. price_cents is net, in cents.
export const paymentShopProductSchema = z
  .object({
    sku: z.string().min(1).max(64),
    name: z.string().min(1),
    description: z.string().max(2000).nullable().optional(),
    category: z.string().min(1).default('charger'),
    price_cents: z.number().int().min(0),
    currency: z.string().length(3, 'ISO 4217 currency code, e.g. EUR').default('EUR'),
    stock: z.number().int().min(0).nullable().optional(),
    is_listed: z.boolean().default(false),
    discount_type: z.enum(['percent', 'amount']).nullable().optional(),
    discount_value: z.number().int().nullable().optional(),
    discount_label: z.string().max(64).nullable().optional(),
    discount_visible: z.boolean().default(true),
  })
  .refine(
    (v) =>
      (v.discount_type == null && v.discount_value == null) ||
      (v.discount_type === 'percent' && v.discount_value != null && v.discount_value >= 1 && v.discount_value <= 100) ||
      (v.discount_type === 'amount' && v.discount_value != null && v.discount_value >= 1),
    { path: ['discount_value'], message: 'percent: 1-100, amount: cents >= 1, or leave both empty.' },
  );

export const paymentShopProductColumns: ResourceColumn<PaymentShopProduct>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'sku', header: 'shopProducts.sku' },
  { key: 'name', header: 'shopProducts.name' },
  { key: 'category', header: 'shopProducts.category' },
  { key: 'price_cents', header: 'shopProducts.priceCentsColumn' },
  { key: 'currency', header: 'common.currency' },
  { key: 'stock', header: 'shopProducts.stock' },
  {
    key: 'is_listed',
    header: 'shopProducts.listed',
    render: (r, t) => (r.is_listed ? t('common.yes') : t('common.no')),
  },
];

export const paymentShopProductFields: ResourceFormField[] = [
  { name: 'sku', label: 'shopProducts.sku' },
  { name: 'name', label: 'shopProducts.name' },
  { name: 'description', label: 'shopProducts.description' },
  { name: 'category', label: 'shopProducts.categoryLabel' },
  { name: 'price_cents', label: 'shopProducts.priceCentsLabel', type: 'number' },
  { name: 'currency', label: 'common.currency' },
  { name: 'stock', label: 'shopProducts.stockLabel', type: 'number' },
  { name: 'is_listed', label: 'shopProducts.listed', type: 'checkbox' },
  {
    name: 'discount_type',
    label: 'shopProducts.discountType',
    type: 'select',
    options: [
      { labelKey: 'shopProducts.discountPercent', value: 'percent' },
      { labelKey: 'shopProducts.discountAmount', value: 'amount' },
    ],
  },
  { name: 'discount_value', label: 'shopProducts.discountValue', type: 'number' },
  { name: 'discount_label', label: 'shopProducts.discountLabel' },
  { name: 'discount_visible', label: 'shopProducts.discountVisible', type: 'checkbox' },
];
