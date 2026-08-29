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
  reservable: boolean;
}

export const paymentEvseSchema = z.object({
  evse_id: z.string().min(1),
  ocpp_evse_id: z.number(),
  status: z.string().min(1),
  station_id: z.string().min(1),
  tenant_id: z.string().min(1),
  location_id: z.number().nullable().optional(),
  reservable: z.boolean().default(false),
});

export const paymentEvseColumns: ResourceColumn<PaymentEvse>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'evse_id', header: 'evses.evseIdColumn' },
  { key: 'station_id', header: 'evses.stationId' },
  { key: 'status', header: 'evses.status' },
  { key: 'tenant_id', header: 'evses.tenantColumn' },
  {
    key: 'reservable',
    header: 'evses.reservable',
    render: (r, t) => (r.reservable ? t('common.yes') : t('common.no')),
  },
];

export const paymentEvseFields: ResourceFormField[] = [
  { name: 'evse_id', label: 'evses.evseIdLabel' },
  { name: 'ocpp_evse_id', label: 'evses.ocppEvseId', type: 'number' },
  { name: 'status', label: 'evses.status' },
  { name: 'station_id', label: 'evses.stationId' },
  { name: 'tenant_id', label: 'evses.tenantIdLabel' },
  {
    name: 'location_id',
    label: 'evses.location',
    type: 'relation',
    relation: { resource: 'payment_locations', optionLabel: 'name' },
  },
  { name: 'reservable', label: 'evses.reservable', type: 'checkbox' },
];
