import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// Keyed by (product_id, related_product_id) — no `id` column, which Refine's
// Hasura provider needs to edit or delete a row. So this is list + create.
export const paymentShopProductRelationPrimaryKey = ['product_id', 'related_product_id'];

export interface PaymentShopProductRelation {
  product_id: number;
  related_product_id: number;
  position: number;
}

export const paymentShopProductRelationSchema = z
  .object({
    product_id: z.number(),
    related_product_id: z.number(),
    position: z.number().int().default(0),
  })
  .refine((v) => v.product_id !== v.related_product_id, {
    path: ['related_product_id'],
    message: "A product can't be related to itself.",
  });

export const paymentShopProductRelationColumns: ResourceColumn<PaymentShopProductRelation>[] = [
  { key: 'product_id', header: 'shopProductRelations.productIdColumn' },
  { key: 'related_product_id', header: 'shopProductRelations.relatedProductIdColumn' },
  { key: 'position', header: 'common.position' },
];

export const paymentShopProductRelationFields: ResourceFormField[] = [
  {
    name: 'product_id',
    label: 'shopProductRelations.product',
    type: 'relation',
    relation: { resource: 'payment_shop_products', optionLabel: 'name' },
  },
  {
    name: 'related_product_id',
    label: 'shopProductRelations.relatedProduct',
    type: 'relation',
    relation: { resource: 'payment_shop_products', optionLabel: 'name' },
  },
  { name: 'position', label: 'common.position', type: 'number' },
];
