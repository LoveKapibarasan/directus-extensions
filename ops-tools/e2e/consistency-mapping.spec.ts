import { test, expect } from '@playwright/test';
import { buildConsistencyReport, type Mapping } from '../src/lib/server/consistency-mapping';
import { consistencyData } from './fixtures/consistency';

// The mapping itself, without a browser: which rows pair up, on what, and
// which column of the pair disagrees.
const report = buildConsistencyReport(consistencyData);
const find = (entity: Mapping['entity'], label: string) => {
  const m = report.mappings.find((x) => x.entity === entity && x.label === label);
  if (!m) throw new Error(`no ${entity} mapping '${label}': ${report.mappings.filter((x) => x.entity === entity).map((x) => x.label)}`);
  return m;
};
const bad = (m: Mapping) => m.columns.filter((c) => !c.equal).map((c) => [c.core, c.payment, c.coreValue, c.paymentValue]);

test.describe('consistency mapping', () => {
  test('consistent pairs are listed too, with every compared column', () => {
    const evse = find('evse', 'DE*AIC*E*TMP*0001');
    expect(evse.status).toBe('match');
    expect(evse.core).toEqual({ table: 'Evses', id: 31 });
    expect(evse.payment).toEqual({ table: 'payment_evses', id: 1 });
    expect(evse.matchedOn).toBe('Evses.evseId = payment_evses.evse_id');
    expect(evse.columns.map((c) => c.payment)).toEqual([
      'payment_evses.evse_id',
      'payment_evses.ocpp_evse_id',
      'payment_evses.station_id',
      'payment_evses.tenant_id',
      'payment_locations.location_id (via payment_evses.location_id)',
    ]);
    expect(find('location', 'Beos Burgthann').status).toBe('match');
  });

  test('a mismatch names the column pair and both values', () => {
    expect(bad(find('evse', 'DE*AIC*E*TMP*0049'))).toEqual([
      ['ChargingStations.tenantId (via Evses.stationId)', 'payment_evses.tenant_id', 2, '1'],
    ]);
    // Name and street differ; city/state differ only in case; DE names Germany.
    expect(bad(find('location', 'TechBase Regensburg'))).toEqual([
      ['Locations.name', 'payment_locations.name', 'TechBase', 'TechBase Regensburg'],
      ['Locations.address', 'payment_locations.address', 'Franz-Mayer-Strasse 1', 'Franz-Mayer-Str. 1'],
    ]);
  });

  test('connectors pair through their EVSE; connector_id may be the core id or the OCPP number', () => {
    expect(find('connector', 'DE*AIC*E*TMP*0001 / 16').status).toBe('match');
    expect(find('connector', 'DE*AIC*E*TMP*0049 / 1').columns.find((c) => c.payment === 'payment_connectors.connector_id')?.equal).toBe(true);
    expect(bad(find('connector', 'DE*AIC*E*TMP*0002 / 2'))).toEqual([
      ['Connectors.id | Connectors.evseTypeConnectorId', 'payment_connectors.connector_id', '36 | 1', '2'],
    ]);
    expect(bad(find('connector', 'DE*AIC*E*TMP*0049 / 1'))).toEqual([
      ['Connectors.tariffId is set', 'payment_connectors.tariff_id is set', false, true],
    ]);
    expect(find('connector', 'DE*AIC*E*TMP*0090 / 1').status).toBe('missing_in_payments');
  });

  test('rows on one side only, with what a create form needs', () => {
    expect(find('evse', 'DE*AIC*E*TMP*0090')).toMatchObject({
      status: 'missing_in_payments',
      payment: null,
      prefill: { evse_id: 'DE*AIC*E*TMP*0090', ocpp_evse_id: '1', station_id: 'ACE0999999', tenant_id: '2' },
    });
    expect(find('evse', 'DE*AIC*E*TMP*0777')).toMatchObject({ status: 'missing_in_core', core: null });
    expect(find('location', 'Nowhere yet')).toMatchObject({ status: 'missing_in_payments', prefill: { location_id: '7', name: 'Nowhere yet' } });
    expect(find('location', 'Gone from core').status).toBe('missing_in_core');
  });

  test('stations: EVSE counts per (tenant, identity); registrations must exist in core unless revoked', () => {
    expect(bad(find('station', 'ACE0869125 (tenant 2)'))).toEqual([
      ['count(Evses where stationId)', 'count(payment_evses where tenant_id, station_id)', 2, 1],
    ]);
    expect(find('station', 'ACE0647838 (tenant 1)').status).toBe('match');
    expect(find('station', 'AIC-NEW-1 (tenant 3)').status).toBe('missing_in_core');
    expect(report.mappings.some((m) => m.label.startsWith('AIC-OLD-1'))).toBe(false);
  });

  test('the summary counts every status per entity', () => {
    const total = Object.values(report.summary).reduce((a, s) => a + s.match + s.mismatch + s.missing_in_payments + s.missing_in_core, 0);
    expect(total).toBe(report.mappings.length);
    expect(report.summary.evse).toEqual({ match: 3, mismatch: 1, missing_in_payments: 1, missing_in_core: 1 });
  });
});

test('a core EVSE without an eMI3 id is listed, not skipped', () => {
  const r = buildConsistencyReport({ ...consistencyData, Evses: [...consistencyData.Evses, { id: 99, stationId: 1, evseId: '', evseTypeId: 2 }] });
  const m = r.mappings.find((x) => x.entity === 'evse' && x.label === 'Evses #99');
  expect(m).toMatchObject({ status: 'missing_in_payments', core: { table: 'Evses', id: 99 }, payment: null });
  expect(m?.columns[0]).toMatchObject({ core: 'Evses.evseId', coreValue: '', equal: false });
});
