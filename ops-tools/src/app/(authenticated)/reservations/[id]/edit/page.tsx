'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentReservationSchema, paymentReservationFields } from '@lib/resources/payment-reservations';

export default function EditPaymentReservationPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_reservations"
      id={id}
      schema={paymentReservationSchema}
      fields={paymentReservationFields}
      basePath="/reservations"
      title="titles.reservations.edit"
    />
  );
}
