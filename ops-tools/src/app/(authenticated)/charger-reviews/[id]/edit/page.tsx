'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentChargerReviewSchema, paymentChargerReviewFields } from '@lib/resources/payment-charger-reviews';

export default function EditPaymentChargerReviewPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_charger_reviews"
      id={id}
      schema={paymentChargerReviewSchema}
      fields={paymentChargerReviewFields}
      basePath="/charger-reviews"
      title="titles.chargerReviews.edit"
    />
  );
}
