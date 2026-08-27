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
  { key: 'id', header: 'common.id' },
  { key: 'location_id', header: 'locations.locationIdColumn' },
  { key: 'name', header: 'locations.name' },
  { key: 'city', header: 'locations.city' },
  { key: 'country', header: 'locations.countryColumn' },
  {
    key: 'is_public',
    header: 'locations.public',
    render: (r, t) => (r.is_public ? t('common.yes') : t('common.no')),
  },
];

export const paymentLocationFields: ResourceFormField[] = [
  { name: 'location_id', label: 'locations.locationIdLabel' },
  { name: 'name', label: 'locations.name' },
  { name: 'address', label: 'locations.address' },
  { name: 'city', label: 'locations.city' },
  { name: 'state', label: 'locations.state' },
  { name: 'postal_code', label: 'locations.postalCode' },
  { name: 'country', label: 'locations.countryLabel' },
  {
    name: 'location',
    label: 'locations.mapPoint',
    type: 'map-point',
    mapPoint: { latitudeField: 'latitude', longitudeField: 'longitude' },
  },
  { name: 'is_public', label: 'locations.public', type: 'checkbox' },
  {
    name: 'operator_id',
    label: 'locations.operator',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
];
