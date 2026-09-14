'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentReservationColumns, type PaymentReservation } from '@lib/resources/payment-reservations';

export default function PaymentReservationListPage() {
  return (
    <ResourceList<PaymentReservation>
      resource="payment_reservations"
      columns={paymentReservationColumns}
      basePath="/reservations"
      title="nav.reservations"
    />
  );
}
