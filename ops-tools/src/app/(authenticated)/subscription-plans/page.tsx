'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentSubscriptionPlanColumns, type PaymentSubscriptionPlan } from '@lib/resources/payment-subscription-plans';

export default function PaymentSubscriptionPlanListPage() {
  return (
    <ResourceList<PaymentSubscriptionPlan>
      resource="payment_subscription_plans"
      columns={paymentSubscriptionPlanColumns}
      basePath="/subscription-plans"
      title="Subscription Plans"
    />
  );
}
