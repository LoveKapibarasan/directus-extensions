'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentMeterValueHistoryColumns, type PaymentMeterValueHistory } from '@lib/resources/payment-meter-value-history';

export default function PaymentMeterValueHistoryListPage() {
  return (
    <ResourceList<PaymentMeterValueHistory>
      resource="payment_meter_value_history"
      columns={paymentMeterValueHistoryColumns}
      basePath="/meter-value-history"
      title="Meter Value History"
    />
  );
}
