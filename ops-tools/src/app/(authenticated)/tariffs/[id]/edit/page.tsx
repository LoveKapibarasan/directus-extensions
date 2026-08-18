'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentTariffSchema, paymentTariffFields } from '@lib/resources/payment-tariffs';

export default function EditTariffPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_tariffs"
      id={id}
      schema={paymentTariffSchema}
      fields={paymentTariffFields}
      basePath="/tariffs"
      title="Edit Tariff"
    />
  );
}
