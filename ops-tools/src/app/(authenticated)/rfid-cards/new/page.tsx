'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentRfidCardSchema, paymentRfidCardFields } from '@lib/resources/payment-rfid-cards';

export default function NewPaymentRfidCardPage() {
  return (
    <ResourceForm
      resource="payment_rfid_cards"
      schema={paymentRfidCardSchema}
      fields={paymentRfidCardFields}
      basePath="/rfid-cards"
      title="titles.rfidCards.new"
    />
  );
}
