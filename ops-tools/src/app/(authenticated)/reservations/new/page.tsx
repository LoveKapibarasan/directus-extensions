'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentReservationSchema, paymentReservationFields } from '@lib/resources/payment-reservations';

export default function NewPaymentReservationPage() {
  return (
    <ResourceForm
      resource="payment_reservations"
      schema={paymentReservationSchema}
      fields={paymentReservationFields}
      basePath="/reservations"
      title="titles.reservations.new"
    />
  );
}
