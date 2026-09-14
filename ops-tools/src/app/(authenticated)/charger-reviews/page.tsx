'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentChargerReviewColumns, type PaymentChargerReview } from '@lib/resources/payment-charger-reviews';

export default function PaymentChargerReviewListPage() {
  return (
    <ResourceList<PaymentChargerReview>
      resource="payment_charger_reviews"
      columns={paymentChargerReviewColumns}
      basePath="/charger-reviews"
      title="nav.chargerReviews"
    />
  );
}
