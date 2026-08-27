'use client';

import { useSearchParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentEvseSchema, paymentEvseFields } from '@lib/resources/payment-evses';

// evse_id / ocpp_evse_id / station_id can arrive pre-filled from the
// consistency check report (a core EVSE with no payment_evses row yet).
export default function NewPaymentEvsePage() {
  const searchParams = useSearchParams();
  const defaultValues: Record<string, unknown> = {};
  const evseId = searchParams.get('evse_id');
  const ocppEvseId = searchParams.get('ocpp_evse_id');
  const stationId = searchParams.get('station_id');
  if (evseId) defaultValues.evse_id = evseId;
  if (ocppEvseId) defaultValues.ocpp_evse_id = Number(ocppEvseId);
  if (stationId) defaultValues.station_id = stationId;

  return (
    <ResourceForm
      resource="payment_evses"
      schema={paymentEvseSchema}
      fields={paymentEvseFields}
      basePath="/evses"
      title="New EVSE"
      defaultValues={defaultValues}
    />
  );
}
