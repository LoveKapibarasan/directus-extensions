import type { ResourceColumn } from '@lib/components/crud/resource-table';

// Written by the payments backend on every station connection attempt —
// an audit log, so it's listed read-only (no schema/fields).
export interface PaymentStationConnectionAttempt {
  id: number;
  presented_station_id: string;
  station_id: number | null;
  security_profile: number | null;
  outcome: string;
  rejection_reason: string | null;
  occurred_at: string;
}

export const paymentStationConnectionAttemptColumns: ResourceColumn<PaymentStationConnectionAttempt>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'occurred_at', header: 'connectionAttempts.occurredAt' },
  { key: 'presented_station_id', header: 'connectionAttempts.presentedStationId' },
  { key: 'station_id', header: 'connectionAttempts.stationIdColumn' },
  { key: 'security_profile', header: 'connectionAttempts.securityProfile' },
  { key: 'outcome', header: 'connectionAttempts.outcome' },
  { key: 'rejection_reason', header: 'connectionAttempts.rejectionReason' },
];
