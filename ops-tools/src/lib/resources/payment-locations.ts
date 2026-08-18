import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentLocation {
  id: number;
  location_id: string;
  name: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_public: boolean;
  operator_id: number | null;
}

export const paymentLocationSchema = z.object({
  location_id: z.string().min(1),
  name: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  is_public: z.boolean().default(true),
  operator_id: z.number().nullable().optional(),
});

export const paymentLocationColumns: ResourceColumn<PaymentLocation>[] = [
  { key: 'id', header: 'ID' },
  { key: 'location_id', header: 'Location ID' },
  { key: 'name', header: 'Name' },
  { key: 'city', header: 'City' },
  { key: 'country', header: 'Country' },
  { key: 'is_public', header: 'Public', render: (r) => (r.is_public ? 'Yes' : 'No') },
];

export const paymentLocationFields: ResourceFormField[] = [
  { name: 'location_id', label: 'Location ID (external/OCPP id)' },
  { name: 'name', label: 'Name' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'postal_code', label: 'Postal code' },
  { name: 'country', label: 'Country (ISO alpha-3, e.g. DEU)' },
  { name: 'latitude', label: 'Latitude', type: 'number' },
  { name: 'longitude', label: 'Longitude', type: 'number' },
  { name: 'is_public', label: 'Public', type: 'checkbox' },
  {
    name: 'operator_id',
    label: 'Operator',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
];
