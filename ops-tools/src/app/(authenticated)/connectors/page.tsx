'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentConnectorColumns, type PaymentConnector } from '@lib/resources/payment-connectors';

export default function PaymentConnectorListPage() {
  return (
    <ResourceList<PaymentConnector>
      resource="payment_connectors"
      columns={paymentConnectorColumns}
      basePath="/connectors"
      title="nav.connectors"
    />
  );
}
