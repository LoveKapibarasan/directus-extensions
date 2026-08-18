'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentRfidCardSchema, paymentRfidCardFields } from '@lib/resources/payment-rfid-cards';

export default function EditPaymentRfidCardPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_rfid_cards"
      id={id}
      schema={paymentRfidCardSchema}
      fields={paymentRfidCardFields}
      basePath="/rfid-cards"
      title="Edit RFID Card"
    />
  );
}
