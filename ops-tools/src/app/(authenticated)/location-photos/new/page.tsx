'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentLocationPhotoSchema,
  paymentLocationPhotoFields,
} from '@lib/resources/payment-location-photos';

export default function NewPaymentLocationPhotoPage() {
  return (
    <ResourceForm
      resource="payment_location_photos"
      schema={paymentLocationPhotoSchema}
      fields={paymentLocationPhotoFields}
      basePath="/location-photos"
      title="titles.locationPhotos.new"
    />
  );
}
