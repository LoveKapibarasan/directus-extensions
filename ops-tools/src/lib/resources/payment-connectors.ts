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
  { key: 'id', header: 'common.id' },
  { key: 'connector_id', header: 'connectors.connectorIdColumn' },
  { key: 'power_type', header: 'connectors.powerTypeColumn' },
  { key: 'max_voltage', header: 'connectors.maxVoltage' },
  { key: 'max_amperage', header: 'connectors.maxAmperage' },
];

export const paymentConnectorFields: ResourceFormField[] = [
  { name: 'connector_id', label: 'connectors.connectorIdLabel' },
  { name: 'power_type', label: 'connectors.powerTypeLabel' },
  { name: 'max_voltage', label: 'connectors.maxVoltage', type: 'number' },
  { name: 'max_amperage', label: 'connectors.maxAmperage', type: 'number' },
  {
    name: 'evse_id',
    label: 'connectors.evse',
    type: 'relation',
    relation: { resource: 'payment_evses', optionLabel: 'evse_id' },
  },
  {
    name: 'tariff_id',
    label: 'connectors.tariff',
    type: 'relation',
    relation: { resource: 'payment_tariffs', optionLabel: 'currency' },
  },
];
