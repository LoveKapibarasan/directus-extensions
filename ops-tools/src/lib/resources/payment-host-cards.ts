import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// id_token — the UID the card presents at a charger — is never fetched,
// listed or editable here. Without it a card can't be created, so this
// resource is list + edit only; adding/revoking a card for real goes through
// the payments backend, which also updates the host's CitrineOS tenant
// authorization (a raw DB edit here doesn't).
export interface PaymentHostCard {
  id: number;
  operator_id: number;
  label: string | null;
  state: string;
  created_at: string | null;
  revoked_at: string | null;
}

export const paymentHostCardSchema = z.object({
  label: z.string().nullable().optional(),
  state: z.enum(['active', 'revoked']).default('active'),
  revoked_at: z.string().nullable().optional(),
});

export const paymentHostCardColumns: ResourceColumn<PaymentHostCard>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'operator_id', header: 'hostCards.operatorIdColumn' },
  { key: 'label', header: 'hostCards.label' },
  { key: 'state', header: 'hostCards.state' },
  { key: 'created_at', header: 'common.createdAt' },
  { key: 'revoked_at', header: 'hostCards.revokedAt' },
];

export const paymentHostCardFields: ResourceFormField[] = [
  { name: 'label', label: 'hostCards.label' },
  {
    name: 'state',
    label: 'hostCards.state',
    type: 'select',
    options: [
      { labelKey: 'hostCards.stateActive', value: 'active' },
      { labelKey: 'hostCards.stateRevoked', value: 'revoked' },
    ],
  },
  { name: 'revoked_at', label: 'hostCards.revokedAt', type: 'datetime-local' },
];
