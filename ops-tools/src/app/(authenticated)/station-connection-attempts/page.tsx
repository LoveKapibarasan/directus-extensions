'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import { paymentStationConnectionAttemptColumns, type PaymentStationConnectionAttempt } from '@lib/resources/payment-station-connection-attempts';

export default function PaymentStationConnectionAttemptListPage() {
  return (
    <ResourceList<PaymentStationConnectionAttempt>
      resource="payment_station_connection_attempts"
      columns={paymentStationConnectionAttemptColumns}
      basePath="/station-connection-attempts"
      title="nav.stationConnectionAttempts"
      actions={readOnlyActions}
    />
  );
}
