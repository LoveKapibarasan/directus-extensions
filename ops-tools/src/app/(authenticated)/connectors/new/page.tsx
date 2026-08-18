'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentConnectorSchema, paymentConnectorFields } from '@lib/resources/payment-connectors';

export default function NewPaymentConnectorPage() {
  return (
    <ResourceForm
      resource="payment_connectors"
      schema={paymentConnectorSchema}
      fields={paymentConnectorFields}
      basePath="/connectors"
      title="New Connector"
    />
  );
}
