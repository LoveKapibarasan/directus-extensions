'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentReviewReportSchema,
  paymentReviewReportFields,
} from '@lib/resources/payment-review-reports';

export default function NewPaymentReviewReportPage() {
  return (
    <ResourceForm
      resource="payment_review_reports"
      schema={paymentReviewReportSchema}
      fields={paymentReviewReportFields}
      basePath="/review-reports"
      title="titles.reviewReports.new"
    />
  );
}
