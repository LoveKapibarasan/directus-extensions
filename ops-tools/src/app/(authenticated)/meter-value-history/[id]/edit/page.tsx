'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentMeterValueHistorySchema, paymentMeterValueHistoryFields } from '@lib/resources/payment-meter-value-history';

export default function EditPaymentMeterValueHistoryPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_meter_value_history"
      id={id}
      schema={paymentMeterValueHistorySchema}
      fields={paymentMeterValueHistoryFields}
      basePath="/meter-value-history"
      title="Edit Meter Reading"
    />
  );
}
