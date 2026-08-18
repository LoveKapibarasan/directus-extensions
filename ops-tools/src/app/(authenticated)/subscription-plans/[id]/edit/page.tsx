'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentSubscriptionPlanSchema, paymentSubscriptionPlanFields } from '@lib/resources/payment-subscription-plans';

export default function EditPaymentSubscriptionPlanPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_subscription_plans"
      id={id}
      schema={paymentSubscriptionPlanSchema}
      fields={paymentSubscriptionPlanFields}
      basePath="/subscription-plans"
      title="Edit Subscription Plan"
    />
  );
}
