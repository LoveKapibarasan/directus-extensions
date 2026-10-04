import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';
import { isTimeZone, openingHoursScheduleSchema } from '@lib/resources/opening-hours';

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
  is_private: boolean;
  listed_at: string | null;
  vehicle_size: string | null;
  access_type: string | null;
  has_occupancy_sensor: boolean | null;
  opening_hours_schedule: Record<string, { start: string; end: string }[] | null> | null;
  opening_hours_note: string | null;
  timezone: string | null;
  additional_info: string | null;
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
  is_private: z.boolean().default(false),
  listed_at: z.string().nullable().optional(),
  vehicle_size: z.enum(['small', 'medium', 'large', 'xl']).nullable().optional(),
  access_type: z.enum(['open', 'gated', 'barrier', 'private_driveway']).nullable().optional(),
  has_occupancy_sensor: z.boolean().nullable().optional(),
  opening_hours_schedule: openingHoursScheduleSchema,
  opening_hours_note: z.string().max(255).nullable().optional(),
  timezone: z
    .string()
    .max(64)
    .refine((v) => v === '' || isTimeZone(v), { message: 'An IANA time zone, e.g. Europe/Berlin.' })
    .nullable()
    .optional(),
  additional_info: z.string().max(2000).nullable().optional(),
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
  {
    key: 'is_private',
    header: 'locations.private',
    render: (r, t) => (r.is_private ? t('common.yes') : t('common.no')),
  },
  { key: 'listed_at', header: 'locations.listedAt' },
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
  { name: 'listed_at', label: 'locations.listedAt', type: 'datetime-local' },
  { name: 'is_private', label: 'locations.private', type: 'checkbox' },
  {
    name: 'vehicle_size',
    label: 'locations.vehicleSize',
    type: 'select',
    options: [
      { labelKey: 'locations.vehicleSizeSmall', value: 'small' },
      { labelKey: 'locations.vehicleSizeMedium', value: 'medium' },
      { labelKey: 'locations.vehicleSizeLarge', value: 'large' },
      { labelKey: 'locations.vehicleSizeXl', value: 'xl' },
    ],
  },
  {
    name: 'access_type',
    label: 'locations.accessType',
    type: 'select',
    options: [
      { labelKey: 'locations.accessOpen', value: 'open' },
      { labelKey: 'locations.accessGated', value: 'gated' },
      { labelKey: 'locations.accessBarrier', value: 'barrier' },
      { labelKey: 'locations.accessPrivateDriveway', value: 'private_driveway' },
    ],
  },
  { name: 'has_occupancy_sensor', label: 'locations.hasOccupancySensor', type: 'checkbox' },
  { name: 'opening_hours_schedule', label: 'locations.openingHoursSchedule', type: 'json' },
  { name: 'opening_hours_note', label: 'locations.openingHoursNote' },
  { name: 'timezone', label: 'locations.timezone' },
  { name: 'additional_info', label: 'locations.additionalInfo' },
  {
    name: 'operator_id',
    label: 'locations.operator',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
];
