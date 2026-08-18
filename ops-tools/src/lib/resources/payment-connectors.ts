import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentConnector {
  id: number;
  connector_id: string;
  power_type: string;
  max_voltage: number;
  max_amperage: number;
  evse_id: number | null;
  tariff_id: number | null;
}

export const paymentConnectorSchema = z.object({
  connector_id: z.string().min(1),
  power_type: z.string().min(1),
  max_voltage: z.number(),
  max_amperage: z.number(),
  evse_id: z.number().nullable().optional(),
  tariff_id: z.number().nullable().optional(),
});

export const paymentConnectorColumns: ResourceColumn<PaymentConnector>[] = [
  { key: 'id', header: 'ID' },
  { key: 'connector_id', header: 'Connector ID' },
  { key: 'power_type', header: 'Power type' },
  { key: 'max_voltage', header: 'Max voltage' },
  { key: 'max_amperage', header: 'Max amperage' },
];

export const paymentConnectorFields: ResourceFormField[] = [
  { name: 'connector_id', label: 'Connector ID (OCPP id)' },
  { name: 'power_type', label: 'Power type (e.g. AC_3_PHASE, DC)' },
  { name: 'max_voltage', label: 'Max voltage', type: 'number' },
  { name: 'max_amperage', label: 'Max amperage', type: 'number' },
  {
    name: 'evse_id',
    label: 'EVSE',
    type: 'relation',
    relation: { resource: 'payment_evses', optionLabel: 'evse_id' },
  },
  {
    name: 'tariff_id',
    label: 'Tariff',
    type: 'relation',
    relation: { resource: 'payment_tariffs', optionLabel: 'currency' },
  },
];
