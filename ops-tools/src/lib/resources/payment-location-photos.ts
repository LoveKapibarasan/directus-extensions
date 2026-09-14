import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// Metadata only — the image itself lives in object storage under s3_key.
export interface PaymentLocationPhoto {
  id: number;
  location_id: number;
  s3_key: string;
  content_type: string;
  position: number;
  created_at: string;
}

export const paymentLocationPhotoSchema = z.object({
  location_id: z.number(),
  s3_key: z.string().min(1),
  content_type: z.string().min(1),
  position: z.number().int().default(0),
});

export const paymentLocationPhotoColumns: ResourceColumn<PaymentLocationPhoto>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'location_id', header: 'locationPhotos.locationIdColumn' },
  { key: 'position', header: 'common.position' },
  { key: 'content_type', header: 'locationPhotos.contentType' },
  { key: 's3_key', header: 'common.objectKey' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentLocationPhotoFields: ResourceFormField[] = [
  {
    name: 'location_id',
    label: 'locationPhotos.location',
    type: 'relation',
    relation: { resource: 'payment_locations', optionLabel: 'name' },
  },
  { name: 's3_key', label: 'common.objectKey' },
  { name: 'content_type', label: 'locationPhotos.contentTypeLabel' },
  { name: 'position', label: 'common.position', type: 'number' },
];
