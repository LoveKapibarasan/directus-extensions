// Sales over payment_checkouts, the way citrineos-payment counts them for a
// host (services/marketplace/earnings.py): a session is a checkout, what it
// earned is its final_price (cents), and only `captured` sessions count -- a
// released authorisation earned nothing. Sessions fall into the period their
// transaction ended in.
//
// No path aliases here: the aggregation is also exercised by a Playwright test
// that imports this file directly.

export const SALES_VIEWS = ['summary', 'location', 'operator', 'day', 'month'] as const;
export type SalesView = (typeof SALES_VIEWS)[number];

export function isSalesView(value: string): value is SalesView {
  return (SALES_VIEWS as readonly string[]).includes(value);
}

// Days and months are the business's, not UTC's: a session ending at 00:30 in
// Berlin belongs to that day.
export const SALES_TIMEZONE = 'Europe/Berlin';

export interface SaleSession {
  id: number;
  endedAt: string;
  finalPriceCents: number;
  kwh: number | null;
  exportedKwh: number | null;
  currency: string;
  locationId: number | null;
  locationName: string | null;
  operatorId: number | null;
  operatorName: string | null;
}

export interface SalesRow {
  // Grouping key: '' for the summary, a location/operator id, or a date.
  key: string;
  // Display name for locations/operators; null where there is none to show.
  label: string | null;
  // Amounts in different currencies are never added together.
  currency: string;
  sessions: number;
  revenueCents: number;
  kwh: number;
  exportedKwh: number;
  // What the platform keeps: the fixed fee per captured session, capped at the
  // session's price (payment's platform_fee_cents). Null when no fee is set.
  platformFeeCents: number | null;
}

function zonedDate(iso: string, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

/** The UTC instant of 00:00 on `date` (YYYY-MM-DD) in `timeZone`. */
export function zonedMidnight(date: string, timeZone: string = SALES_TIMEZONE): Date {
  const [y, m, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d);
  // The zone's offset at that moment, read back through Intl; done twice so a
  // DST change between the guess and the answer settles.
  let t = guess;
  for (let i = 0; i < 2; i++) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
        .formatToParts(new Date(t))
        .map((p) => [p.type, p.value]),
    );
    const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    t = guess - (asUtc - t);
  }
  return new Date(t);
}

/** [start, end) in UTC for the inclusive local date range from..to. */
export function salesWindow(from: string, to: string, timeZone: string = SALES_TIMEZONE) {
  const [y, m, d] = to.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  return { start: zonedMidnight(from, timeZone), end: zonedMidnight(next, timeZone) };
}

function groupOf(s: SaleSession, view: SalesView, timeZone: string): { key: string; label: string | null } {
  switch (view) {
    case 'summary':
      return { key: '', label: null };
    case 'location':
      return { key: s.locationId == null ? '' : String(s.locationId), label: s.locationName };
    case 'operator':
      return { key: s.operatorId == null ? '' : String(s.operatorId), label: s.operatorName };
    case 'day':
      return { key: zonedDate(s.endedAt, timeZone), label: null };
    case 'month':
      return { key: zonedDate(s.endedAt, timeZone).slice(0, 7), label: null };
  }
}

export function aggregateSales(
  sessions: SaleSession[],
  view: SalesView,
  feeCents: number | null,
  timeZone: string = SALES_TIMEZONE,
): SalesRow[] {
  const rows = new Map<string, SalesRow>();
  for (const s of sessions) {
    const { key, label } = groupOf(s, view, timeZone);
    const id = `${key}\u0000${s.currency}`;
    let row = rows.get(id);
    if (!row) {
      row = {
        key,
        label,
        currency: s.currency,
        sessions: 0,
        revenueCents: 0,
        kwh: 0,
        exportedKwh: 0,
        platformFeeCents: feeCents == null ? null : 0,
      };
      rows.set(id, row);
    }
    row.sessions += 1;
    row.revenueCents += s.finalPriceCents;
    row.kwh += s.kwh ?? 0;
    row.exportedKwh += s.exportedKwh ?? 0;
    if (row.platformFeeCents != null && feeCents != null) {
      row.platformFeeCents += Math.min(feeCents, Math.max(s.finalPriceCents, 0));
    }
  }
  const sorted = [...rows.values()];
  if (view === 'day' || view === 'month') {
    sorted.sort((a, b) => a.key.localeCompare(b.key) || a.currency.localeCompare(b.currency));
  } else {
    sorted.sort((a, b) => b.revenueCents - a.revenueCents || a.currency.localeCompare(b.currency));
  }
  return sorted;
}

const SESSIONS_QUERY = `
  query ($start: timestamptz!, $end: timestamptz!) {
    payment_checkouts(
      where: {
        payment_status: { _eq: "captured" }
        transaction_end_time: { _gte: $start, _lt: $end }
      }
    ) {
      id
      final_price
      transaction_kwh
      transaction_exported_kwh
      transaction_end_time
      connector_id
      tariff_id
    }
    payment_connectors { id evse_id }
    payment_evses { id location_id }
    payment_locations { id name location_id operator_id }
    payment_operators { id name }
    payment_tariffs { id currency }
  }
`;

interface SessionsData {
  payment_checkouts: {
    id: number;
    final_price: number | null;
    transaction_kwh: number | null;
    transaction_exported_kwh: number | null;
    transaction_end_time: string;
    connector_id: number | null;
    tariff_id: number | null;
  }[];
  payment_connectors: { id: number; evse_id: number | null }[];
  payment_evses: { id: number; location_id: number | null }[];
  payment_locations: { id: number; name: string | null; location_id: string; operator_id: number | null }[];
  payment_operators: { id: number; name: string }[];
  payment_tariffs: { id: number; currency: string }[];
}

/** Captured sessions that ended in [start, end), joined to location, operator and currency. */
export async function loadSaleSessions(
  query: (q: string, v: Record<string, unknown>) => Promise<SessionsData>,
  start: Date,
  end: Date,
): Promise<SaleSession[]> {
  const data = await query(SESSIONS_QUERY, { start: start.toISOString(), end: end.toISOString() });
  const connectors = new Map(data.payment_connectors.map((c) => [c.id, c]));
  const evses = new Map(data.payment_evses.map((e) => [e.id, e]));
  const locations = new Map(data.payment_locations.map((l) => [l.id, l]));
  const operators = new Map(data.payment_operators.map((o) => [o.id, o]));
  const tariffs = new Map(data.payment_tariffs.map((t) => [t.id, t]));
  return data.payment_checkouts.map((c) => {
    const evseId = c.connector_id == null ? null : connectors.get(c.connector_id)?.evse_id;
    const locationId = evseId == null ? null : (evses.get(evseId)?.location_id ?? null);
    const location = locationId == null ? undefined : locations.get(locationId);
    const operatorId = location?.operator_id ?? null;
    return {
      id: c.id,
      endedAt: c.transaction_end_time,
      finalPriceCents: c.final_price ?? 0,
      kwh: c.transaction_kwh,
      exportedKwh: c.transaction_exported_kwh,
      // '' when the checkout has no tariff: kept as its own row rather than
      // guessed into one of the real currencies.
      currency: (c.tariff_id == null ? undefined : tariffs.get(c.tariff_id)?.currency) ?? '',
      locationId,
      locationName: location ? (location.name ?? location.location_id) : null,
      operatorId,
      operatorName: operatorId == null ? null : (operators.get(operatorId)?.name ?? null),
    };
  });
}

/** STRIPE_PLATFORM_FEE_CENTS, as citrineos-payment is configured; null when unset. */
export function platformFeeCents(): number | null {
  const raw = process.env.STRIPE_PLATFORM_FEE_CENTS;
  if (raw == null || raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}
