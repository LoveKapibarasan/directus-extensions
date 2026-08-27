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
  { key: 'id', header: 'common.id' },
  { key: 'cardholder_name', header: 'rfidCards.cardholderColumn' },
  { key: 'membership_number', header: 'rfidCards.membershipNumberColumn' },
  { key: 'status', header: 'rfidCards.status' },
  { key: 'rfid_uid', header: 'rfidCards.rfidUidColumn' },
];

export const paymentRfidCardFields: ResourceFormField[] = [
  {
    name: 'user_id',
    label: 'rfidCards.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'subscription_id',
    label: 'rfidCards.subscriptionId',
    type: 'number',
  },
  { name: 'cardholder_name', label: 'rfidCards.cardholderNameLabel' },
  { name: 'membership_number', label: 'rfidCards.membershipNumberLabel' },
  { name: 'color_theme', label: 'rfidCards.colorTheme' },
  { name: 'plan_display_name', label: 'rfidCards.planDisplayName' },
  {
    name: 'status',
    label: 'rfidCards.status',
    type: 'select',
    options: [
      { labelKey: 'rfidCards.statusPending', value: 'pending' },
      { labelKey: 'rfidCards.statusActive', value: 'active' },
      { labelKey: 'rfidCards.statusBlocked', value: 'blocked' },
      { labelKey: 'rfidCards.statusExpired', value: 'expired' },
    ],
  },
  { name: 'rfid_uid', label: 'rfidCards.rfidUidLabel' },
  { name: 'delivery_name', label: 'rfidCards.deliveryName' },
  { name: 'delivery_street', label: 'rfidCards.deliveryStreet' },
  { name: 'delivery_address_line2', label: 'rfidCards.deliveryAddressLine2' },
  { name: 'delivery_city', label: 'rfidCards.deliveryCity' },
  { name: 'delivery_postal_code', label: 'rfidCards.deliveryPostalCode' },
  { name: 'delivery_country', label: 'rfidCards.deliveryCountry' },
];
