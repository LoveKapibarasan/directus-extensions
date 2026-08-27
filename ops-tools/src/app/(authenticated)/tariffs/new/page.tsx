'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentTariffSchema, paymentTariffFields } from '@lib/resources/payment-tariffs';

export default function NewTariffPage() {
  return (
    <ResourceForm
      resource="payment_tariffs"
      schema={paymentTariffSchema}
      fields={paymentTariffFields}
      basePath="/tariffs"
      title="titles.tariffs.new"
    />
  );
}
