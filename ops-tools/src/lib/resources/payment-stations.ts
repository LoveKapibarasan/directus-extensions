import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// credential_hash is deliberately absent everywhere below — never fetched,
// listed or editable. Issuing/rotating a station credential goes through the
// payments backend, which returns the credential to the host exactly once.
export interface PaymentStation {
  id: number;
  station_id: string;
  operator_id: number;
  tenant_id: string;
  security_profile: number;
  credential_issued_at: string | null;
  state: string;
  created_at: string;
  payment_methods: string[] | null;
}

export const paymentStationSchema = z.object({
  station_id: z.string().min(1),
  operator_id: z.number(),
  tenant_id: z.string().min(1).max(3),
  security_profile: z.number().int().min(1).max(3).default(2),
  state: z.enum(['provisioned', 'active', 'revoked']).default('provisioned'),
});

export const paymentStationColumns: ResourceColumn<PaymentStation>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'station_id', header: 'stations.stationId' },
  { key: 'operator_id', header: 'stations.operatorIdColumn' },
  { key: 'tenant_id', header: 'stations.tenantId' },
  { key: 'security_profile', header: 'stations.securityProfile' },
  { key: 'state', header: 'stations.state' },
  {
    key: 'payment_methods',
    header: 'stations.paymentMethods',
    render: (r) => (Array.isArray(r.payment_methods) ? r.payment_methods.join(', ') : ''),
  },
  { key: 'credential_issued_at', header: 'stations.credentialIssuedAt' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentStationFields: ResourceFormField[] = [
  { name: 'station_id', label: 'stations.stationIdLabel' },
  {
    name: 'operator_id',
    label: 'stations.operator',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
  { name: 'tenant_id', label: 'stations.tenantIdLabel' },
  { name: 'security_profile', label: 'stations.securityProfileLabel', type: 'number' },
  {
    name: 'state',
    label: 'stations.state',
    type: 'select',
    options: [
      { labelKey: 'stations.stateProvisioned', value: 'provisioned' },
      { labelKey: 'stations.stateActive', value: 'active' },
      { labelKey: 'stations.stateRevoked', value: 'revoked' },
    ],
  },
];
