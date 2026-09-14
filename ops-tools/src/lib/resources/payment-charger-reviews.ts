import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentChargerReview {
  id: number;
  checkout_id: number;
  evse_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  state: string;
  created_at: string;
  updated_at: string | null;
  comment_deleted_at: string | null;
}

export const paymentChargerReviewSchema = z.object({
  checkout_id: z.number(),
  evse_id: z.number(),
  user_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
  state: z.enum(['visible', 'reported', 'hidden']).default('visible'),
  comment_deleted_at: z.string().nullable().optional(),
});

export const paymentChargerReviewColumns: ResourceColumn<PaymentChargerReview>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'evse_id', header: 'chargerReviews.evseIdColumn' },
  { key: 'user_id', header: 'chargerReviews.userIdColumn' },
  { key: 'rating', header: 'chargerReviews.rating' },
  { key: 'state', header: 'chargerReviews.state' },
  { key: 'comment', header: 'chargerReviews.comment' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentChargerReviewFields: ResourceFormField[] = [
  {
    name: 'checkout_id',
    label: 'chargerReviews.checkout',
    type: 'relation',
    relation: { resource: 'payment_checkouts', optionLabel: 'id' },
  },
  {
    name: 'evse_id',
    label: 'chargerReviews.evse',
    type: 'relation',
    relation: { resource: 'payment_evses', optionLabel: 'evse_id' },
  },
  {
    name: 'user_id',
    label: 'chargerReviews.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  { name: 'rating', label: 'chargerReviews.ratingLabel', type: 'number' },
  { name: 'comment', label: 'chargerReviews.comment' },
  {
    name: 'state',
    label: 'chargerReviews.state',
    type: 'select',
    options: [
      { labelKey: 'chargerReviews.stateVisible', value: 'visible' },
      { labelKey: 'chargerReviews.stateReported', value: 'reported' },
      { labelKey: 'chargerReviews.stateHidden', value: 'hidden' },
    ],
  },
  { name: 'comment_deleted_at', label: 'chargerReviews.commentDeletedAt', type: 'datetime-local' },
];
