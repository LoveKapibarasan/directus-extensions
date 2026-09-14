import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentReviewReport {
  id: number;
  review_id: number;
  reporter_id: number;
  reason: string;
  detail: string | null;
  created_at: string;
}

export const paymentReviewReportSchema = z.object({
  review_id: z.number(),
  reporter_id: z.number(),
  reason: z.enum(['untrue', 'abusive', 'personal_information', 'not_about_this_charger', 'spam']),
  detail: z.string().max(2000).nullable().optional(),
});

export const paymentReviewReportColumns: ResourceColumn<PaymentReviewReport>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'review_id', header: 'reviewReports.reviewIdColumn' },
  { key: 'reporter_id', header: 'reviewReports.reporterIdColumn' },
  { key: 'reason', header: 'reviewReports.reason' },
  { key: 'detail', header: 'reviewReports.detail' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentReviewReportFields: ResourceFormField[] = [
  {
    name: 'review_id',
    label: 'reviewReports.review',
    type: 'relation',
    relation: { resource: 'payment_charger_reviews', optionLabel: 'id' },
  },
  {
    name: 'reporter_id',
    label: 'reviewReports.reporter',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  {
    name: 'reason',
    label: 'reviewReports.reason',
    type: 'select',
    options: [
      { labelKey: 'reviewReports.reasonUntrue', value: 'untrue' },
      { labelKey: 'reviewReports.reasonAbusive', value: 'abusive' },
      { labelKey: 'reviewReports.reasonPersonalInformation', value: 'personal_information' },
      { labelKey: 'reviewReports.reasonNotAboutThisCharger', value: 'not_about_this_charger' },
      { labelKey: 'reviewReports.reasonSpam', value: 'spam' },
    ],
  },
  { name: 'detail', label: 'reviewReports.detail' },
];
