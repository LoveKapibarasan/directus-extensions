'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentLocationPhotoColumns, type PaymentLocationPhoto } from '@lib/resources/payment-location-photos';

export default function PaymentLocationPhotoListPage() {
  return (
    <ResourceList<PaymentLocationPhoto>
      resource="payment_location_photos"
      columns={paymentLocationPhotoColumns}
      basePath="/location-photos"
      title="nav.locationPhotos"
    />
  );
}
