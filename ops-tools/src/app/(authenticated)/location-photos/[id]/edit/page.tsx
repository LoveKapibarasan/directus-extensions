'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentLocationPhotoSchema, paymentLocationPhotoFields } from '@lib/resources/payment-location-photos';

export default function EditPaymentLocationPhotoPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_location_photos"
      id={id}
      schema={paymentLocationPhotoSchema}
      fields={paymentLocationPhotoFields}
      basePath="/location-photos"
      title="titles.locationPhotos.edit"
    />
  );
}
