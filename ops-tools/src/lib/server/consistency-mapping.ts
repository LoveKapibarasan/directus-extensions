// How each citrineos-core row maps onto its payment_* row, column by column.
//
// The report lists every mapping -- matched and consistent ones too -- so an
// operator can see which core row a payment row was paired with, on which key,
// and exactly which column pair disagrees. Pure (no I/O, no path aliases) so a
// Playwright test can import it directly; consistency-check.ts feeds it Hasura.

export type Value = string | number | boolean | null;

export interface CoreChargingStation {
  id: number;
  // Since per-host CitrineOS tenants (#512) one OCPP identity can exist under
  // more than one tenant, so stations are keyed by (tenantId, name).
  tenantId: number | null;
  ocppConnectionName: string | null;
  locationId: number | null;
}
export interface CoreEvse {
  id: number;
  stationId: number | null;
  evseId: string | null;
  evseTypeId: number | null;
}
export interface CoreConnector {
  id: number;
  stationId: number | null;
  evseId: number | null;
  connectorId: number;
  evseTypeConnectorId: number;
  tariffId: number | null;
}
export interface CoreLocation {
  id: number;
  name: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  state: string | null;
  country: string | null;
}
export interface PaymentLocation {
  id: number;
  location_id: string;
  name: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  state: string | null;
  country: string | null;
}
export interface PaymentEvse {
  id: number;
  evse_id: string;
  ocpp_evse_id: number;
  station_id: string;
  tenant_id: string;
  location_id: number | null;
}
export interface PaymentStation {
  id: number;
  station_id: string;
  tenant_id: string;
  state: string;
}
export interface PaymentConnector {
  id: number;
  connector_id: string;
  evse_id: number | null;
  tariff_id: number | null;
}

export interface ConsistencyData {
  ChargingStations: CoreChargingStation[];
  Evses: CoreEvse[];
  Connectors: CoreConnector[];
  Locations: CoreLocation[];
  Tariffs: { id: number }[];
  payment_locations: PaymentLocation[];
  payment_evses: PaymentEvse[];
  payment_connectors: PaymentConnector[];
  payment_tariffs: { id: number }[];
  payment_stations: PaymentStation[];
}

export type Entity = 'station' | 'evse' | 'connector' | 'location';
export type Status = 'match' | 'mismatch' | 'missing_in_payments' | 'missing_in_core';

export interface ColumnPair {
  // Qualified columns, e.g. 'Evses.evseTypeId' and 'payment_evses.ocpp_evse_id'.
  // A derived value names its path: 'ChargingStations.ocppConnectionName (via Evses.stationId)'.
  core: string;
  payment: string;
  coreValue: Value;
  paymentValue: Value;
  equal: boolean;
  // Part of the key the two rows were paired on (equal by construction).
  key?: boolean;
}

export interface Side {
  table: string;
  id: number;
}

export interface Mapping {
  entity: Entity;
  status: Status;
  // What an operator calls the thing: station name, eMI3 EVSE id, location name.
  label: string;
  // The join, spelled out: 'Evses.evseId = payment_evses.evse_id'.
  matchedOn: string;
  core: Side | null;
  payment: Side | null;
  columns: ColumnPair[];
  // Values a create form can be pre-filled with when the payment row is missing.
  prefill?: Record<string, string>;
}

export type CaveatKey =
  | 'consistencyCheck.caveatConnectorNumbering'
  | 'consistencyCheck.caveatTariffIds'
  | 'consistencyCheck.caveatStations'
  | 'consistencyCheck.caveatCountry';

export interface ConsistencyReport {
  mappings: Mapping[];
  summary: Record<Entity, Record<Status, number>>;
  tariffCounts: { core: number; payments: number };
  caveats: CaveatKey[];
}

const text = (v: Value) => (v == null ? '' : String(v).trim().toLowerCase().replace(/\s+/g, ' '));
const same = (a: Value, b: Value) => text(a) === text(b);

function pair(core: string, payment: string, coreValue: Value, paymentValue: Value, equal = same(coreValue, paymentValue)): ColumnPair {
  return { core, payment, coreValue, paymentValue, equal };
}
function keyPair(core: string, payment: string, coreValue: Value, paymentValue: Value): ColumnPair {
  return { core, payment, coreValue, paymentValue, equal: true, key: true };
}
const statusOf = (columns: ColumnPair[]): Status => (columns.every((c) => c.equal) ? 'match' : 'mismatch');

// payment_locations.country is an ISO 3166 alpha-2 code ('DE'), core's is
// whatever the operator typed ('Germany'): equal if the code names the country.
function sameCountry(core: string | null, payment: string | null): boolean {
  if (same(core, payment)) return true;
  if (!core || !payment || !/^[a-z]{2}$/i.test(payment.trim())) return false;
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(payment.trim().toUpperCase());
    return same(name ?? null, core);
  } catch {
    return false;
  }
}

export function buildConsistencyReport(data: ConsistencyData): ConsistencyReport {
  const mappings: Mapping[] = [];
  const stationById = new Map(data.ChargingStations.map((s) => [s.id, s]));
  const coreLocationById = new Map(data.Locations.map((l) => [String(l.id), l]));
  const paymentLocationById = new Map(data.payment_locations.map((l) => [l.id, l]));
  const stationKey = (tenant: Value, name: Value) => `${tenant ?? ''}:${name ?? ''}`;

  // ─── Locations: payment_locations.location_id holds core Locations.id ────
  const paymentLocationByCoreId = new Map(data.payment_locations.map((l) => [l.location_id, l]));
  for (const core of data.Locations) {
    const p = paymentLocationByCoreId.get(String(core.id));
    if (!p) {
      mappings.push({
        entity: 'location',
        status: 'missing_in_payments',
        label: core.name ?? String(core.id),
        matchedOn: 'Locations.id = payment_locations.location_id',
        core: { table: 'Locations', id: core.id },
        payment: null,
        columns: [],
        prefill: { location_id: String(core.id), ...(core.name ? { name: core.name } : {}) },
      });
      continue;
    }
    const columns = [
      keyPair('Locations.id', 'payment_locations.location_id', core.id, p.location_id),
      pair('Locations.name', 'payment_locations.name', core.name, p.name),
      pair('Locations.address', 'payment_locations.address', core.address, p.address),
      pair('Locations.city', 'payment_locations.city', core.city, p.city),
      pair('Locations.postalCode', 'payment_locations.postal_code', core.postalCode, p.postal_code),
      pair('Locations.state', 'payment_locations.state', core.state, p.state),
      pair('Locations.country', 'payment_locations.country', core.country, p.country, sameCountry(core.country, p.country)),
    ];
    mappings.push({
      entity: 'location',
      status: statusOf(columns),
      label: p.name ?? core.name ?? p.location_id,
      matchedOn: 'Locations.id = payment_locations.location_id',
      core: { table: 'Locations', id: core.id },
      payment: { table: 'payment_locations', id: p.id },
      columns,
    });
  }
  for (const p of data.payment_locations) {
    if (coreLocationById.has(p.location_id)) continue;
    mappings.push({
      entity: 'location',
      status: 'missing_in_core',
      label: p.name ?? p.location_id,
      matchedOn: 'Locations.id = payment_locations.location_id',
      core: null,
      payment: { table: 'payment_locations', id: p.id },
      columns: [pair('Locations.id', 'payment_locations.location_id', null, p.location_id, false)],
    });
  }

  // ─── EVSEs: Evses.evseId (eMI3) = payment_evses.evse_id ──────────────────
  const paymentEvseByEvseId = new Map(data.payment_evses.map((e) => [e.evse_id, e]));
  const coreEvseByEvseId = new Map(data.Evses.filter((e) => !!e.evseId).map((e) => [e.evseId as string, e]));
  for (const core of data.Evses) {
    if (!core.evseId) {
      // No eMI3 id: nothing a payment_evses row could be paired on. Listed so
      // the row isn't silently left out.
      mappings.push({
        entity: 'evse',
        status: 'missing_in_payments',
        label: `Evses #${core.id}`,
        matchedOn: 'Evses.evseId = payment_evses.evse_id',
        core: { table: 'Evses', id: core.id },
        payment: null,
        columns: [pair('Evses.evseId', 'payment_evses.evse_id', core.evseId, null, false)],
      });
      continue;
    }
    const station = core.stationId != null ? stationById.get(core.stationId) : undefined;
    const p = paymentEvseByEvseId.get(core.evseId);
    if (!p) {
      mappings.push({
        entity: 'evse',
        status: 'missing_in_payments',
        label: core.evseId,
        matchedOn: 'Evses.evseId = payment_evses.evse_id',
        core: { table: 'Evses', id: core.id },
        payment: null,
        columns: [],
        prefill: {
          evse_id: core.evseId,
          ...(core.evseTypeId != null ? { ocpp_evse_id: String(core.evseTypeId) } : {}),
          ...(station?.ocppConnectionName ? { station_id: station.ocppConnectionName } : {}),
          ...(station?.tenantId != null ? { tenant_id: String(station.tenantId) } : {}),
        },
      });
      continue;
    }
    const pLocation = p.location_id != null ? paymentLocationById.get(p.location_id) : undefined;
    const columns = [
      keyPair('Evses.evseId', 'payment_evses.evse_id', core.evseId, p.evse_id),
      pair('Evses.evseTypeId', 'payment_evses.ocpp_evse_id', core.evseTypeId, p.ocpp_evse_id),
      pair(
        'ChargingStations.ocppConnectionName (via Evses.stationId)',
        'payment_evses.station_id',
        station?.ocppConnectionName ?? null,
        p.station_id,
      ),
      pair('ChargingStations.tenantId (via Evses.stationId)', 'payment_evses.tenant_id', station?.tenantId ?? null, p.tenant_id),
      pair(
        'ChargingStations.locationId (via Evses.stationId)',
        'payment_locations.location_id (via payment_evses.location_id)',
        station?.locationId ?? null,
        pLocation?.location_id ?? null,
      ),
    ];
    mappings.push({
      entity: 'evse',
      status: statusOf(columns),
      label: core.evseId,
      matchedOn: 'Evses.evseId = payment_evses.evse_id',
      core: { table: 'Evses', id: core.id },
      payment: { table: 'payment_evses', id: p.id },
      columns,
    });
  }
  for (const p of data.payment_evses) {
    if (coreEvseByEvseId.has(p.evse_id)) continue;
    mappings.push({
      entity: 'evse',
      status: 'missing_in_core',
      label: p.evse_id,
      matchedOn: 'Evses.evseId = payment_evses.evse_id',
      core: null,
      payment: { table: 'payment_evses', id: p.id },
      columns: [pair('Evses.evseId', 'payment_evses.evse_id', null, p.evse_id, false)],
    });
  }

  // ─── Connectors: paired through their EVSE, so a number only has to be
  // unique within one EVSE. payment_connectors.connector_id is core
  // Connectors.id in older rows and the OCPP connector number in rows the
  // marketplace creates; either counts as agreeing. ─────────────────────────
  const paymentEvseById = new Map(data.payment_evses.map((e) => [e.id, e]));
  const coreConnectorsByEvse = new Map<number, CoreConnector[]>();
  for (const c of data.Connectors) {
    if (c.evseId == null) continue;
    coreConnectorsByEvse.set(c.evseId, [...(coreConnectorsByEvse.get(c.evseId) ?? []), c]);
  }
  const pairedCore = new Set<number>();
  for (const p of data.payment_connectors) {
    const pEvse = p.evse_id != null ? paymentEvseById.get(p.evse_id) : undefined;
    const coreEvse = pEvse ? coreEvseByEvseId.get(pEvse.evse_id) : undefined;
    const candidates = (coreEvse ? coreConnectorsByEvse.get(coreEvse.id) : undefined) ?? [];
    const label = `${pEvse?.evse_id ?? `payment_evses #${p.evse_id ?? '?'}`} / ${p.connector_id}`;
    const matchedOn = 'payment_connectors.evse_id → payment_evses.evse_id = Evses.evseId → Connectors.evseId';
    if (!coreEvse || candidates.length === 0) {
      mappings.push({
        entity: 'connector',
        status: 'missing_in_core',
        label,
        matchedOn,
        core: null,
        payment: { table: 'payment_connectors', id: p.id },
        columns: [pair('Evses.evseId', 'payment_evses.evse_id (via payment_connectors.evse_id)', null, pEvse?.evse_id ?? null, false)],
      });
      continue;
    }
    const byNumber = (c: CoreConnector) => same(c.id, p.connector_id) || same(c.evseTypeConnectorId, p.connector_id);
    // One connector on the EVSE is the pair even when the number disagrees --
    // that disagreement is exactly what the row has to show.
    const core = candidates.find(byNumber) ?? (candidates.length === 1 ? candidates[0] : undefined);
    if (!core) {
      mappings.push({
        entity: 'connector',
        status: 'missing_in_core',
        label,
        matchedOn,
        core: null,
        payment: { table: 'payment_connectors', id: p.id },
        columns: [
          pair(
            `Connectors.id / evseTypeConnectorId on Evses #${coreEvse.id}`,
            'payment_connectors.connector_id',
            candidates.map((c) => `${c.id} / ${c.evseTypeConnectorId}`).join(', '),
            p.connector_id,
            false,
          ),
        ],
      });
      continue;
    }
    pairedCore.add(core.id);
    const columns = [
      keyPair('Evses.evseId (via Connectors.evseId)', 'payment_evses.evse_id (via payment_connectors.evse_id)', coreEvse.evseId, pEvse!.evse_id),
      pair('Connectors.id | Connectors.evseTypeConnectorId', 'payment_connectors.connector_id', `${core.id} | ${core.evseTypeConnectorId}`, p.connector_id, byNumber(core)),
      pair('Connectors.tariffId is set', 'payment_connectors.tariff_id is set', core.tariffId != null, p.tariff_id != null),
    ];
    mappings.push({
      entity: 'connector',
      status: statusOf(columns),
      label,
      matchedOn,
      core: { table: 'Connectors', id: core.id },
      payment: { table: 'payment_connectors', id: p.id },
      columns,
    });
  }
  for (const core of data.Connectors) {
    if (pairedCore.has(core.id)) continue;
    const evse = data.Evses.find((e) => e.id === core.evseId);
    mappings.push({
      entity: 'connector',
      status: 'missing_in_payments',
      label: `${evse?.evseId || `Evses #${core.evseId ?? '?'}`} / ${core.evseTypeConnectorId}`,
      matchedOn: 'payment_connectors.evse_id → payment_evses.evse_id = Evses.evseId → Connectors.evseId',
      core: { table: 'Connectors', id: core.id },
      payment: null,
      columns: [],
    });
  }

  // ─── Stations: (tenantId, ocppConnectionName) = (tenant_id, station_id).
  // payment_stations only has the stations registered through the
  // marketplace; the EVSE count is compared for every station. ─────────────
  const coreEvseCount = new Map<number, number>();
  for (const e of data.Evses) {
    if (e.stationId != null) coreEvseCount.set(e.stationId, (coreEvseCount.get(e.stationId) ?? 0) + 1);
  }
  const paymentEvseCount = new Map<string, number>();
  for (const e of data.payment_evses) {
    const k = stationKey(e.tenant_id, e.station_id);
    paymentEvseCount.set(k, (paymentEvseCount.get(k) ?? 0) + 1);
  }
  const registered = new Map(
    data.payment_stations.filter((s) => s.state !== 'revoked').map((s) => [stationKey(s.tenant_id, s.station_id), s]),
  );
  const coreStationKeys = new Set<string>();
  for (const s of data.ChargingStations) {
    if (!s.ocppConnectionName) continue;
    const k = stationKey(s.tenantId, s.ocppConnectionName);
    coreStationKeys.add(k);
    const reg = registered.get(k);
    const columns = [
      keyPair('ChargingStations.tenantId, ocppConnectionName', 'payment_evses / payment_stations (tenant_id, station_id)', `${s.tenantId}, ${s.ocppConnectionName}`, `${s.tenantId}, ${s.ocppConnectionName}`),
      pair('count(Evses where stationId)', 'count(payment_evses where tenant_id, station_id)', coreEvseCount.get(s.id) ?? 0, paymentEvseCount.get(k) ?? 0),
      pair('ChargingStations row', 'payment_stations.state', 'present', reg ? reg.state : null, true),
    ];
    mappings.push({
      entity: 'station',
      status: statusOf(columns),
      label: `${s.ocppConnectionName} (tenant ${s.tenantId ?? '?'})`,
      matchedOn: '(ChargingStations.tenantId, ocppConnectionName) = (tenant_id, station_id)',
      core: { table: 'ChargingStations', id: s.id },
      payment: reg ? { table: 'payment_stations', id: reg.id } : null,
      columns,
    });
  }
  for (const [k, reg] of registered) {
    if (coreStationKeys.has(k)) continue;
    const elsewhere = data.ChargingStations.filter((s) => s.ocppConnectionName === reg.station_id).map((s) => s.tenantId);
    mappings.push({
      entity: 'station',
      status: 'missing_in_core',
      label: `${reg.station_id} (tenant ${reg.tenant_id})`,
      matchedOn: '(ChargingStations.tenantId, ocppConnectionName) = (tenant_id, station_id)',
      core: null,
      payment: { table: 'payment_stations', id: reg.id },
      columns: [
        pair('ChargingStations.tenantId', 'payment_stations.tenant_id', elsewhere.length ? elsewhere.join(', ') : null, reg.tenant_id, false),
      ],
    });
  }

  const empty = (): Record<Status, number> => ({ match: 0, mismatch: 0, missing_in_payments: 0, missing_in_core: 0 });
  const summary: Record<Entity, Record<Status, number>> = { station: empty(), evse: empty(), connector: empty(), location: empty() };
  for (const m of mappings) summary[m.entity][m.status]++;

  return {
    mappings,
    summary,
    tariffCounts: { core: data.Tariffs.length, payments: data.payment_tariffs.length },
    caveats: [
      'consistencyCheck.caveatConnectorNumbering',
      'consistencyCheck.caveatTariffIds',
      'consistencyCheck.caveatStations',
      'consistencyCheck.caveatCountry',
    ],
  };
}
