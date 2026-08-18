import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentUser {
  id: number;
  keycloak_id: string;
  email: string;
  stripe_customer_id: string | null;
}

export const paymentUserSchema = z.object({
  keycloak_id: z.string().min(1),
  email: z.string().email(),
  stripe_customer_id: z.string().nullable().optional(),
});

export const paymentUserColumns: ResourceColumn<PaymentUser>[] = [
  { key: 'id', header: 'ID' },
  { key: 'email', header: 'Email' },
  { key: 'keycloak_id', header: 'Keycloak ID' },
  { key: 'stripe_customer_id', header: 'Stripe customer ID' },
];

export const paymentUserFields: ResourceFormField[] = [
  { name: 'email', label: 'Email' },
  { name: 'keycloak_id', label: 'Keycloak user ID' },
  { name: 'stripe_customer_id', label: 'Stripe customer ID' },
];
