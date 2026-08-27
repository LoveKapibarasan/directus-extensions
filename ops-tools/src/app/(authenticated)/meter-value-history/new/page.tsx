'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentMeterValueHistorySchema, paymentMeterValueHistoryFields } from '@lib/resources/payment-meter-value-history';

export default function NewPaymentMeterValueHistoryPage() {
  return (
    <ResourceForm
      resource="payment_meter_value_history"
      schema={paymentMeterValueHistorySchema}
      fields={paymentMeterValueHistoryFields}
      basePath="/meter-value-history"
      title="titles.meterValueHistory.new"
    />
  );
}
