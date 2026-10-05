import type { ConsistencyData } from '../../src/lib/server/consistency-mapping';

// Shaped after production on 2026-10-05 (v2 core ids), trimmed to the cases
// the report has to tell apart.
export const consistencyData: ConsistencyData = {
  ChargingStations: [
    { id: 1, tenantId: 1, ocppConnectionName: 'ACE0647838', locationId: 5 },
    { id: 2, tenantId: 1, ocppConnectionName: 'ACE0647841', locationId: 5 },
    { id: 3, tenantId: 2, ocppConnectionName: 'ACE0869125', locationId: 6 },
    { id: 4, tenantId: 2, ocppConnectionName: 'ACE0999999', locationId: 6 },
  ],
  Evses: [
    { id: 31, stationId: 1, evseId: 'DE*AIC*E*TMP*0001', evseTypeId: 1 },
    { id: 21, stationId: 2, evseId: 'DE*AIC*E*TMP*0002', evseTypeId: 1 },
    { id: 86, stationId: 3, evseId: 'DE*AIC*E*TMP*0048', evseTypeId: 1 },
    { id: 87, stationId: 3, evseId: 'DE*AIC*E*TMP*0049', evseTypeId: 2 },
    { id: 90, stationId: 4, evseId: 'DE*AIC*E*TMP*0090', evseTypeId: 1 },
  ],
  Connectors: [
    { id: 16, stationId: 1, evseId: 31, connectorId: 1, evseTypeConnectorId: 1, tariffId: 5 },
    { id: 36, stationId: 2, evseId: 21, connectorId: 1, evseTypeConnectorId: 1, tariffId: 11 },
    { id: 72, stationId: 3, evseId: 86, connectorId: 1, evseTypeConnectorId: 1, tariffId: 3 },
    { id: 74, stationId: 3, evseId: 87, connectorId: 2, evseTypeConnectorId: 1, tariffId: null },
    { id: 95, stationId: 4, evseId: 90, connectorId: 1, evseTypeConnectorId: 1, tariffId: 3 },
  ],
  Locations: [
    { id: 5, name: 'TechBase', address: 'Franz-Mayer-Strasse 1', city: 'Regensburg', postalCode: '93053', state: 'Bayern', country: 'Germany' },
    { id: 6, name: 'Beos Burgthann', address: 'Am Breitenstock 18', city: 'Burgthann', postalCode: '90559', state: 'Bayern', country: 'Germany' },
    { id: 7, name: 'Nowhere yet', address: null, city: null, postalCode: null, state: null, country: null },
  ],
  Tariffs: [{ id: 3 }, { id: 5 }, { id: 11 }],
  payment_locations: [
    { id: 1, location_id: '5', name: 'TechBase Regensburg', address: 'Franz-Mayer-Str. 1', city: 'REGENSBURG', postal_code: '93053', state: 'BAYERN', country: 'DE' },
    { id: 5, location_id: '6', name: 'Beos Burgthann', address: 'Am Breitenstock 18', city: 'Burgthann', postal_code: '90559', state: 'Bayern', country: 'DE' },
    { id: 9, location_id: '99', name: 'Gone from core', address: null, city: null, postal_code: null, state: null, country: 'DE' },
  ],
  payment_evses: [
    { id: 1, evse_id: 'DE*AIC*E*TMP*0001', ocpp_evse_id: 1, station_id: 'ACE0647838', tenant_id: '1', location_id: 1 },
    { id: 2, evse_id: 'DE*AIC*E*TMP*0002', ocpp_evse_id: 1, station_id: 'ACE0647841', tenant_id: '1', location_id: 1 },
    { id: 7, evse_id: 'DE*AIC*E*TMP*0048', ocpp_evse_id: 1, station_id: 'ACE0869125', tenant_id: '2', location_id: 5 },
    { id: 8, evse_id: 'DE*AIC*E*TMP*0049', ocpp_evse_id: 2, station_id: 'ACE0869125', tenant_id: '1', location_id: 5 },
    { id: 20, evse_id: 'DE*AIC*E*TMP*0777', ocpp_evse_id: 1, station_id: 'ACE0777777', tenant_id: '2', location_id: 5 },
  ],
  payment_stations: [
    { id: 3, station_id: 'AIC-NEW-1', tenant_id: '3', state: 'provisioned' },
    { id: 4, station_id: 'AIC-OLD-1', tenant_id: '3', state: 'revoked' },
  ],
  payment_connectors: [
    { id: 1, connector_id: '16', evse_id: 1, tariff_id: 2 },
    { id: 2, connector_id: '2', evse_id: 2, tariff_id: 2 },
    { id: 13, connector_id: '72', evse_id: 7, tariff_id: 3 },
    { id: 14, connector_id: '1', evse_id: 8, tariff_id: 3 },
  ],
  payment_tariffs: [{ id: 1 }, { id: 2 }, { id: 3 }],
};
