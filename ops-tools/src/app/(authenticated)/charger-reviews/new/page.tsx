'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentChargerReviewSchema,
  paymentChargerReviewFields,
} from '@lib/resources/payment-charger-reviews';

export default function NewPaymentChargerReviewPage() {
  return (
    <ResourceForm
      resource="payment_charger_reviews"
      schema={paymentChargerReviewSchema}
      fields={paymentChargerReviewFields}
      basePath="/charger-reviews"
      title="titles.chargerReviews.new"
    />
  );
}
