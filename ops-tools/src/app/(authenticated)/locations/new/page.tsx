'use client';

import { useSearchParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentLocationSchema, paymentLocationFields } from '@lib/resources/payment-locations';

// name can arrive pre-filled from the consistency check report (a core
// Location with no matching payment_locations row). location_id has no
// core equivalent to pre-fill from — it must be entered by hand.
export default function NewPaymentLocationPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const defaultValues: Record<string, unknown> = name ? { name } : {};

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
