import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentEvse {
  id: number;
  evse_id: string;
  ocpp_evse_id: number;
  status: string;
  station_id: string;
  tenant_id: string;
  location_id: number | null;
}

export const paymentEvseSchema = z.object({
  evse_id: z.string().min(1),
  ocpp_evse_id: z.number(),
  status: z.string().min(1),
  station_id: z.string().min(1),
  tenant_id: z.string().min(1),
  location_id: z.number().nullable().optional(),
});

export const paymentEvseColumns: ResourceColumn<PaymentEvse>[] = [
  { key: 'id', header: 'ID' },
  { key: 'evse_id', header: 'EVSE ID' },
  { key: 'station_id', header: 'Station ID' },
  { key: 'status', header: 'Status' },
  { key: 'tenant_id', header: 'Tenant' },
];

export const paymentEvseFields: ResourceFormField[] = [
  { name: 'evse_id', label: 'EVSE ID (OCPP id)' },
  { name: 'ocpp_evse_id', label: 'OCPP EVSE numeric ID', type: 'number' },
  { name: 'status', label: 'Status' },
  { name: 'station_id', label: 'Station ID' },
  { name: 'tenant_id', label: 'Tenant ID' },
  {
    name: 'location_id',
    label: 'Location',
    type: 'relation',
    relation: { resource: 'payment_locations', optionLabel: 'name' },
  },
];
