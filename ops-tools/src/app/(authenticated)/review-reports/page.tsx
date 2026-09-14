'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentReviewReportColumns, type PaymentReviewReport } from '@lib/resources/payment-review-reports';

export default function PaymentReviewReportListPage() {
  return (
    <ResourceList<PaymentReviewReport>
      resource="payment_review_reports"
      columns={paymentReviewReportColumns}
      basePath="/review-reports"
      title="nav.reviewReports"
    />
  );
}
