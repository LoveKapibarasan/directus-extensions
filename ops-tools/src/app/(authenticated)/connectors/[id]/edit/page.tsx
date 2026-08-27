'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentConnectorSchema, paymentConnectorFields } from '@lib/resources/payment-connectors';

export default function EditPaymentConnectorPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_connectors"
      id={id}
      schema={paymentConnectorSchema}
      fields={paymentConnectorFields}
      basePath="/connectors"
      title="titles.connectors.edit"
    />
  );
}
