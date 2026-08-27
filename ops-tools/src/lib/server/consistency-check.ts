import { hasuraQuery } from '@lib/server/hasura';

// ─── Core (citrineos-core OCPP schema) shapes ──────────────────────────────

interface CoreChargingStation {
  id: number;
  ocppConnectionName: string | null;
}

interface CoreEvse {
  id: number;
  stationId: number | null;
  evseId: string | null;
  evseTypeId: number | null;
}

interface CoreConnector {
  id: number;
  stationId: number | null;
  evseId: number | null;
  connectorId: number;
  evseTypeConnectorId: number;
  tariffId: number | null;
}

interface CoreLocation {
  id: number;
  name: string | null;
}

// ─── Payments (payment_*) shapes ───────────────────────────────────────────

interface PaymentLocation {
  id: number;
  location_id: string;
  name: string | null;
}

interface PaymentEvse {
  id: number;
  evse_id: string;
  ocpp_evse_id: number;
  station_id: string;
}

interface PaymentConnector {
  id: number;
  connector_id: string;
  evse_id: number | null;
  tariff_id: number | null;
}

// ─── Findings ───────────────────────────────────────────────────────────────

export type Finding =
  | {
      entity: 'evse';
      kind: 'missing_in_payments';
      message: string;
      core: { id: number; evseId: string; evseTypeId: number | null; stationOcppName: string | null };
    }
  | {
      entity: 'evse';
      kind: 'orphaned_in_payments';
      message: string;
      payment: { id: number; evse_id: string; station_id: string };
    }
  | {
      entity: 'evse';
      kind: 'field_mismatch';
      message: string;
      payment: { id: number; evse_id: string };
      field: string;
      paymentValue: string | number | null;
      coreValue: string | number | null;
    }
  | {
      entity: 'location';
      kind: 'missing_in_payments';
      message: string;
      core: { id: number; name: string | null };
    }
  | {
      entity: 'location';
      kind: 'orphaned_in_payments';
      message: string;
      payment: { id: number; location_id: string; name: string | null };
    }
  | {
      entity: 'connector';
      kind: 'unmatched';
      message: string;
      payment: { id: number; connector_id: string };
    }
  | {
      entity: 'connector';
      kind: 'tariff_mismatch';
      message: string;
      payment: { id: number; connector_id: string };
      corePaymentTariffAssigned: boolean;
      paymentSideTariffAssigned: boolean;
    }
  | {
      entity: 'station';
      kind: 'evse_count_mismatch';
      message: string;
      core: { id: number; ocppConnectionName: string | null };
      coreEvseCount: number;
      paymentEvseCount: number;
    };

export interface ConsistencyReport {
  findings: Finding[];
  summary: Record<Finding['entity'], number>;
  tariffCounts: { core: number; payments: number };
  caveats: string[];
}

const QUERY = `
  query {
    ChargingStations { id ocppConnectionName }
    Evses { id stationId evseId evseTypeId }
    Connectors { id stationId evseId connectorId evseTypeConnectorId tariffId }
    Locations { id name }
    Tariffs { id }
    payment_locations { id location_id name }
    payment_evses { id evse_id ocpp_evse_id station_id }
    payment_connectors { id connector_id evse_id tariff_id }
    payment_tariffs { id }
  }
`;

interface QueryResult {
  ChargingStations: CoreChargingStation[];
  Evses: CoreEvse[];
  Connectors: CoreConnector[];
  Locations: CoreLocation[];
  Tariffs: { id: number }[];
  payment_locations: PaymentLocation[];
  payment_evses: PaymentEvse[];
  payment_connectors: PaymentConnector[];
  payment_tariffs: { id: number }[];
}

export async function runConsistencyCheck(): Promise<ConsistencyReport> {
  const data = await hasuraQuery<QueryResult>(QUERY);
  const findings: Finding[] = [];

  const stationById = new Map(data.ChargingStations.map((s) => [s.id, s]));

  // ─── EVSEs: match on evse_id (payments) ↔ evseId (core, eMI3 id) ─────────
  const coreEvseByEvseId = new Map(
    data.Evses.filter((e) => e.evseId != null).map((e) => [e.evseId as string, e]),
  );
  const paymentEvseByEvseId = new Map(data.payment_evses.map((e) => [e.evse_id, e]));

  for (const core of data.Evses) {
    if (core.evseId == null) continue;
    const match = paymentEvseByEvseId.get(core.evseId);
    const station = core.stationId != null ? stationById.get(core.stationId) : undefined;

    if (!match) {
      findings.push({
        entity: 'evse',
        kind: 'missing_in_payments',
        message: `Core EVSE '${core.evseId}' has no matching payment_evses row.`,
        core: {
          id: core.id,
          evseId: core.evseId,
          evseTypeId: core.evseTypeId,
          stationOcppName: station?.ocppConnectionName ?? null,
        },
      });
      continue;
    }

    if (core.evseTypeId != null && match.ocpp_evse_id !== core.evseTypeId) {
      findings.push({
        entity: 'evse',
        kind: 'field_mismatch',
        message: `payment_evses.ocpp_evse_id (${match.ocpp_evse_id}) doesn't match core Evse.evseTypeId (${core.evseTypeId}) for '${core.evseId}'.`,
        payment: { id: match.id, evse_id: match.evse_id },
        field: 'ocpp_evse_id',
        paymentValue: match.ocpp_evse_id,
        coreValue: core.evseTypeId,
      });
    }

    const coreStationName = station?.ocppConnectionName ?? null;
    if (coreStationName != null && match.station_id !== coreStationName) {
      findings.push({
        entity: 'evse',
        kind: 'field_mismatch',
        message: `payment_evses.station_id ('${match.station_id}') doesn't match core ChargingStation.ocppConnectionName ('${coreStationName}') for '${core.evseId}'.`,
        payment: { id: match.id, evse_id: match.evse_id },
        field: 'station_id',
        paymentValue: match.station_id,
        coreValue: coreStationName,
      });
    }
  }

  for (const payment of data.payment_evses) {
    if (!coreEvseByEvseId.has(payment.evse_id)) {
      findings.push({
        entity: 'evse',
        kind: 'orphaned_in_payments',
        message: `payment_evses '${payment.evse_id}' has no matching core Evse.`,
        payment: { id: payment.id, evse_id: payment.evse_id, station_id: payment.station_id },
      });
    }
  }

  // ─── Locations: best-effort match by name (core Location has no external
  // string id to key off — see caveats below) ────────────────────────────
  const normalize = (s: string | null) => (s ?? '').trim().toLowerCase();
  const paymentLocationByName = new Map(data.payment_locations.map((l) => [normalize(l.name), l]));
  const coreLocationNames = new Set(data.Locations.map((l) => normalize(l.name)));

  for (const core of data.Locations) {
    if (!paymentLocationByName.has(normalize(core.name))) {
      findings.push({
        entity: 'location',
        kind: 'missing_in_payments',
        message: `Core Location '${core.name ?? core.id}' has no payment_locations row with a matching name.`,
        core: { id: core.id, name: core.name },
      });
    }
  }
  for (const payment of data.payment_locations) {
    if (!coreLocationNames.has(normalize(payment.name))) {
      findings.push({
        entity: 'location',
        kind: 'orphaned_in_payments',
        message: `payment_locations '${payment.name ?? payment.location_id}' has no core Location with a matching name.`,
        payment: { id: payment.id, location_id: payment.location_id, name: payment.name },
      });
    }
  }

  // ─── Connectors: payment_connectors.connector_id is a string; core has two
  // integer numbering schemes (connectorId = OCPP1.6, evseTypeConnectorId =
  // OCPP2.0.1). Try both — see the caveat in the issue about which one is
  // authoritative. ─────────────────────────────────────────────────────────
  const paymentConnectorByCoreKey = new Map<string, PaymentConnector>();
  for (const p of data.payment_connectors) {
    paymentConnectorByCoreKey.set(p.connector_id, p);
  }
  const matchedPaymentConnectorIds = new Set<number>();

  for (const core of data.Connectors) {
    const byEvseTypeConnectorId = paymentConnectorByCoreKey.get(String(core.evseTypeConnectorId));
    const byConnectorId = paymentConnectorByCoreKey.get(String(core.connectorId));
    const match = byEvseTypeConnectorId ?? byConnectorId;

    if (match) {
      matchedPaymentConnectorIds.add(match.id);
      const coreHasTariff = core.tariffId != null;
      const paymentHasTariff = match.tariff_id != null;
      if (coreHasTariff !== paymentHasTariff) {
        findings.push({
          entity: 'connector',
          kind: 'tariff_mismatch',
          message: `Connector '${match.connector_id}': core ${coreHasTariff ? 'has' : 'has no'} tariff assigned, payment_connectors ${paymentHasTariff ? 'has' : 'has no'} tariff assigned.`,
          payment: { id: match.id, connector_id: match.connector_id },
          corePaymentTariffAssigned: coreHasTariff,
          paymentSideTariffAssigned: paymentHasTariff,
        });
      }
    }
  }

  for (const payment of data.payment_connectors) {
    if (!matchedPaymentConnectorIds.has(payment.id)) {
      findings.push({
        entity: 'connector',
        kind: 'unmatched',
        message: `payment_connectors '${payment.connector_id}' doesn't match any core Connector's connectorId or evseTypeConnectorId.`,
        payment: { id: payment.id, connector_id: payment.connector_id },
      });
    }
  }

  // ─── ChargingStations: rollup of core Evse count vs payment_evses linked
  // via station_id (there's no dedicated payment_charging_stations table) ──
  const coreEvseCountByStation = new Map<number, number>();
  for (const e of data.Evses) {
    if (e.stationId == null) continue;
    coreEvseCountByStation.set(e.stationId, (coreEvseCountByStation.get(e.stationId) ?? 0) + 1);
  }
  const paymentEvseCountByStationName = new Map<string, number>();
  for (const e of data.payment_evses) {
    paymentEvseCountByStationName.set(
      e.station_id,
      (paymentEvseCountByStationName.get(e.station_id) ?? 0) + 1,
    );
  }

  for (const station of data.ChargingStations) {
    const coreCount = coreEvseCountByStation.get(station.id) ?? 0;
    const paymentCount =
      station.ocppConnectionName != null
        ? (paymentEvseCountByStationName.get(station.ocppConnectionName) ?? 0)
        : 0;
    if (coreCount !== paymentCount) {
      findings.push({
        entity: 'station',
        kind: 'evse_count_mismatch',
        message: `ChargingStation '${station.ocppConnectionName ?? station.id}' has ${coreCount} core EVSE(s) but ${paymentCount} payment_evses row(s).`,
        core: { id: station.id, ocppConnectionName: station.ocppConnectionName },
        coreEvseCount: coreCount,
        paymentEvseCount: paymentCount,
      });
    }
  }

  const summary: Record<Finding['entity'], number> = {
    evse: 0,
    location: 0,
    connector: 0,
    station: 0,
  };
  for (const f of findings) summary[f.entity]++;

  return {
    findings,
    summary,
    tariffCounts: { core: data.Tariffs.length, payments: data.payment_tariffs.length },
    caveats: [
      "Locations are matched by name only — core Location rows have no external/OCPP string id, so this can miss real matches (renamed locations) or false-match unrelated ones with the same name.",
      "Connector matching tries both core numbering schemes (OCPP1.6 connectorId and OCPP2.0.1 evseTypeConnectorId) since it's unclear which payment_connectors.connector_id is meant to track — verify matches before relying on them.",
      "payment_tariffs has no column referencing core Tariff — tariff consistency can only be checked indirectly, at the connector level (whether a tariff is assigned on both sides), not per-tariff.",
    ],
  };
}
