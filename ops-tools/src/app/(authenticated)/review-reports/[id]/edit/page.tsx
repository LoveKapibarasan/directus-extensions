'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentReviewReportSchema, paymentReviewReportFields } from '@lib/resources/payment-review-reports';

export default function EditPaymentReviewReportPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_review_reports"
      id={id}
      schema={paymentReviewReportSchema}
      fields={paymentReviewReportFields}
      basePath="/review-reports"
      title="titles.reviewReports.edit"
    />
  );
}
