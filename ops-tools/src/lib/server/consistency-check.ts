import { hasuraQuery } from '@lib/server/hasura';
import { buildConsistencyReport, type ConsistencyData, type ConsistencyReport } from '@lib/server/consistency-mapping';

export type { ConsistencyReport, Mapping, ColumnPair, Entity, Status } from '@lib/server/consistency-mapping';

const QUERY = `
  query {
    ChargingStations { id tenantId ocppConnectionName locationId }
    Evses { id stationId evseId evseTypeId }
    Connectors { id stationId evseId connectorId evseTypeConnectorId tariffId }
    Locations { id name address city postalCode state country }
    Tariffs { id }
    payment_locations { id location_id name address city postal_code state country }
    payment_evses { id evse_id ocpp_evse_id station_id tenant_id location_id }
    payment_stations { id station_id tenant_id state }
    payment_connectors { id connector_id evse_id tariff_id }
    payment_tariffs { id }
  }
`;

export async function runConsistencyCheck(): Promise<ConsistencyReport> {
  return buildConsistencyReport(await hasuraQuery<ConsistencyData>(QUERY));
}
