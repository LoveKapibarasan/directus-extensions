import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentHostInvite {
  id: number;
  code: string;
  email: string | null;
  note: string | null;
  used_by_user_id: number | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string | null;
}

export const paymentHostInviteSchema = z.object({
  code: z.string().min(1).max(64),
  email: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  used_by_user_id: z.number().nullable().optional(),
  used_at: z.string().nullable().optional(),
  expires_at: z.string().nullable().optional(),
});

export const paymentHostInviteColumns: ResourceColumn<PaymentHostInvite>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'code', header: 'hostInvites.code' },
  { key: 'email', header: 'hostInvites.email' },
  { key: 'note', header: 'hostInvites.note' },
  { key: 'expires_at', header: 'hostInvites.expiresAt' },
  { key: 'used_at', header: 'hostInvites.usedAt' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentHostInviteFields: ResourceFormField[] = [
  { name: 'code', label: 'hostInvites.codeLabel' },
  { name: 'email', label: 'hostInvites.emailLabel' },
  { name: 'note', label: 'hostInvites.note' },
  { name: 'expires_at', label: 'hostInvites.expiresAt', type: 'datetime-local' },
  {
    name: 'used_by_user_id',
    label: 'hostInvites.usedBy',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  { name: 'used_at', label: 'hostInvites.usedAt', type: 'datetime-local' },
];
