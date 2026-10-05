'use client';

import { useSearchParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentLocationSchema, paymentLocationFields } from '@lib/resources/payment-locations';

// location_id (core Locations.id) and name can arrive pre-filled from the
// consistency check report (a core Location with no payment_locations row).
export default function NewPaymentLocationPage() {
  const searchParams = useSearchParams();
  const defaultValues: Record<string, unknown> = {};
  for (const key of ['location_id', 'name']) {
    const value = searchParams.get(key);
    if (value) defaultValues[key] = value;
  }

  return (
    <ResourceForm
      resource="payment_locations"
      schema={paymentLocationSchema}
      fields={paymentLocationFields}
      basePath="/locations"
      title="titles.locations.new"
      defaultValues={defaultValues}
    />
  );
}
