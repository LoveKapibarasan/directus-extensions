import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// Metadata only — the image itself lives in object storage under object_key.
export interface PaymentShopProductPhoto {
  id: number;
  product_id: number;
  object_key: string;
  position: number;
  credit: string | null;
  source_url: string | null;
  created_at: string | null;
}

export const paymentShopProductPhotoSchema = z.object({
  product_id: z.number(),
  object_key: z.string().min(1),
  position: z.number().int().default(0),
  credit: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
});

export const paymentShopProductPhotoColumns: ResourceColumn<PaymentShopProductPhoto>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'product_id', header: 'shopProductPhotos.productIdColumn' },
  { key: 'position', header: 'common.position' },
  { key: 'object_key', header: 'common.objectKey' },
  { key: 'credit', header: 'common.imageCredit' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentShopProductPhotoFields: ResourceFormField[] = [
  {
    name: 'product_id',
    label: 'shopProductPhotos.product',
    type: 'relation',
    relation: { resource: 'payment_shop_products', optionLabel: 'name' },
  },
  { name: 'object_key', label: 'common.objectKey' },
  { name: 'position', label: 'common.position', type: 'number' },
  { name: 'credit', label: 'common.imageCredit' },
  { name: 'source_url', label: 'common.imageSourceUrl' },
];
