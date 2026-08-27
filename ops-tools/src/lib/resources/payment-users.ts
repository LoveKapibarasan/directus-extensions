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
  { key: 'id', header: 'common.id' },
  { key: 'email', header: 'users.email' },
  { key: 'keycloak_id', header: 'users.keycloakIdColumn' },
  { key: 'stripe_customer_id', header: 'users.stripeCustomerId' },
];

export const paymentUserFields: ResourceFormField[] = [
  { name: 'email', label: 'users.email' },
  { name: 'keycloak_id', label: 'users.keycloakIdLabel' },
  { name: 'stripe_customer_id', label: 'users.stripeCustomerId' },
];
