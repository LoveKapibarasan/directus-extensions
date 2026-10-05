import { test, expect } from '@playwright/test';
import { aggregateSales, salesWindow, type SaleSession } from '../src/lib/server/sales';

// The sales numbers themselves, without a browser: grouping, currencies, the
// fee cap, and the business-day boundary in Europe/Berlin.
function s(over: Partial<SaleSession>): SaleSession {
  return {
    id: 1,
    endedAt: '2026-10-01T10:00:00Z',
    finalPriceCents: 1000,
    kwh: 10,
    exportedKwh: null,
    currency: 'EUR',
    locationId: 1,
    locationName: 'Burgthann',
    operatorId: 7,
    operatorName: 'BEOS',
    ...over,
  };
}

test.describe('sales aggregation', () => {
  test('summary adds sessions up, per currency, and caps the fee at the session price', () => {
    const rows = aggregateSales(
      [s({ finalPriceCents: 1000 }), s({ id: 2, finalPriceCents: 30, kwh: 0.5, exportedKwh: 2 }), s({ id: 3, currency: 'PLN', finalPriceCents: 4000 })],
      'summary',
      50,
    );
    expect(rows).toEqual([
      { key: '', label: null, currency: 'PLN', sessions: 1, revenueCents: 4000, kwh: 10, exportedKwh: 0, platformFeeCents: 50 },
      { key: '', label: null, currency: 'EUR', sessions: 2, revenueCents: 1030, kwh: 10.5, exportedKwh: 2, platformFeeCents: 80 },
    ]);
  });

  test('no configured fee means no fee column, not zero', () => {
    expect(aggregateSales([s({})], 'summary', null)[0].platformFeeCents).toBeNull();
  });

  test('days are Berlin days: 23:30 UTC on 30 Sep is 1 Oct', () => {
    const rows = aggregateSales(
      [s({ endedAt: '2026-09-30T21:30:00Z' }), s({ id: 2, endedAt: '2026-09-30T22:30:00Z' })],
      'day',
      null,
    );
    expect(rows.map((r) => [r.key, r.sessions])).toEqual([
      ['2026-09-30', 1],
      ['2026-10-01', 1],
    ]);
    expect(aggregateSales([s({ endedAt: '2026-09-30T22:30:00Z' })], 'month', null)[0].key).toBe('2026-10');
  });

  test('location and operator views group by id and keep unassigned sessions visible', () => {
    const sessions = [s({}), s({ id: 2, locationId: 2, locationName: 'Techbase', operatorId: 7 }), s({ id: 3, locationId: null, locationName: null, operatorId: null, operatorName: null })];
    expect(aggregateSales(sessions, 'location', null).map((r) => [r.key, r.label, r.sessions])).toEqual([
      ['1', 'Burgthann', 1],
      ['2', 'Techbase', 1],
      ['', null, 1],
    ]);
    expect(aggregateSales(sessions, 'operator', null).map((r) => [r.key, r.label, r.sessions])).toEqual([
      ['7', 'BEOS', 2],
      ['', null, 1],
    ]);
  });

  test('the window runs from local midnight to the local midnight after the last day, across DST', () => {
    // CEST (UTC+2) in October until the 25th, CET (UTC+1) after.
    const w = salesWindow('2026-10-01', '2026-10-31');
    expect(w.start.toISOString()).toBe('2026-09-30T22:00:00.000Z');
    expect(w.end.toISOString()).toBe('2026-10-31T23:00:00.000Z');
  });
});
