'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentSubscriptionPlanSchema, paymentSubscriptionPlanFields } from '@lib/resources/payment-subscription-plans';

export default function NewPaymentSubscriptionPlanPage() {
  return (
    <ResourceForm
      resource="payment_subscription_plans"
      schema={paymentSubscriptionPlanSchema}
      fields={paymentSubscriptionPlanFields}
      basePath="/subscription-plans"
      title="titles.subscriptionPlans.new"
    />
  );
}
