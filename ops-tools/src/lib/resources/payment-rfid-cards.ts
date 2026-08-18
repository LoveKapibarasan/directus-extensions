import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentRfidCard {
  id: number;
  subscription_id: number;
  user_id: number;
  membership_number: string | null;
  cardholder_name: string;
  color_theme: string;
  plan_display_name: string;
  status: string;
  rfid_uid: string | null;
  delivery_name: string;
  delivery_street: string;
  delivery_address_line2: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_country: string;
}

export const paymentRfidCardSchema = z.object({
  subscription_id: z.number(),
  user_id: z.number(),
  membership_number: z.string().nullable().optional(),
  cardholder_name: z.string().min(1),
  color_theme: z.string().default('green'),
  plan_display_name: z.string().min(1),
  status: z.enum(['pending', 'active', 'blocked', 'expired']).default('pending'),
  rfid_uid: z.string().nullable().optional(),
  delivery_name: z.string().min(1),
  delivery_street: z.string().min(1),
  delivery_address_line2: z.string().default(''),
  delivery_city: z.string().min(1),
  delivery_postal_code: z.string().min(1),
  delivery_country: z.string().default('DE'),
});

export const paymentRfidCardColumns: ResourceColumn<PaymentRfidCard>[] = [
  { key: 'id', header: 'ID' },
  { key: 'cardholder_name', header: 'Cardholder' },
  { key: 'membership_number', header: 'Membership #' },
  { key: 'status', header: 'Status' },
  { key: 'rfid_uid', header: 'RFID UID' },
];

export const paymentRfidCardFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'User',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'subscription_id',
    label: 'RFID Subscription ID',
    type: 'number',
  },
  { name: 'cardholder_name', label: 'Cardholder name' },
  { name: 'membership_number', label: 'Membership number (e.g. AC-000001)' },
  { name: 'color_theme', label: 'Color theme' },
  { name: 'plan_display_name', label: 'Plan display name' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['pending', 'active', 'blocked', 'expired'].map((s) => ({ label: s, value: s })),
  },
  { name: 'rfid_uid', label: 'RFID UID (physical card)' },
  { name: 'delivery_name', label: 'Delivery: name' },
  { name: 'delivery_street', label: 'Delivery: street' },
  { name: 'delivery_address_line2', label: 'Delivery: address line 2' },
  { name: 'delivery_city', label: 'Delivery: city' },
  { name: 'delivery_postal_code', label: 'Delivery: postal code' },
  { name: 'delivery_country', label: 'Delivery: country' },
];
