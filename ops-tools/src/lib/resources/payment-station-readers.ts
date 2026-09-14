import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentStationReader {
  id: number;
  reader_id: string;
  station_id: number;
  evse_id: number | null;
  label: string | null;
  created_at: string | null;
}

export const paymentStationReaderSchema = z.object({
  reader_id: z.string().min(1),
  station_id: z.number(),
  evse_id: z.number().nullable().optional(),
  label: z.string().nullable().optional(),
});

export const paymentStationReaderColumns: ResourceColumn<PaymentStationReader>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'reader_id', header: 'stationReaders.readerId' },
  { key: 'station_id', header: 'stationReaders.stationIdColumn' },
  { key: 'evse_id', header: 'stationReaders.evseIdColumn' },
  { key: 'label', header: 'stationReaders.label' },
  { key: 'created_at', header: 'common.createdAt' },
];

export const paymentStationReaderFields: ResourceFormField[] = [
  { name: 'reader_id', label: 'stationReaders.readerIdLabel' },
  {
    name: 'station_id',
    label: 'stationReaders.station',
    type: 'relation',
    relation: { resource: 'payment_stations', optionLabel: 'station_id' },
  },
  {
    name: 'evse_id',
    label: 'stationReaders.evse',
    type: 'relation',
    relation: { resource: 'payment_evses', optionLabel: 'evse_id' },
  },
  { name: 'label', label: 'stationReaders.label' },
];
