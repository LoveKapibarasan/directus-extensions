'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentOperatorInfoColumns, type PaymentOperatorInfo } from '@lib/resources/payment-operator-infos';

export default function PaymentOperatorInfoListPage() {
  return (
    <ResourceList<PaymentOperatorInfo>
      resource="payment_operator_infos"
      columns={paymentOperatorInfoColumns}
      basePath="/operator-infos"
      title="Operator Infos"
    />
  );
}
