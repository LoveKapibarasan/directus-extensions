'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentRfidCardColumns, type PaymentRfidCard } from '@lib/resources/payment-rfid-cards';

export default function PaymentRfidCardListPage() {
  return (
    <ResourceList<PaymentRfidCard>
      resource="payment_rfid_cards"
      columns={paymentRfidCardColumns}
      basePath="/rfid-cards"
      title="nav.rfidCards"
    />
  );
}
