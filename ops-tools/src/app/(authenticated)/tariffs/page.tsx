'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentTariffColumns, type PaymentTariff } from '@lib/resources/payment-tariffs';

export default function TariffsPage() {
  return (
    <ResourceList<PaymentTariff>
      resource="payment_tariffs"
      columns={paymentTariffColumns}
      basePath="/tariffs"
      title="nav.tariffs"
    />
  );
}
