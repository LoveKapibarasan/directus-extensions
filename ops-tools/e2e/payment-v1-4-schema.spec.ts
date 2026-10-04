import { test, expect, type Route } from '@playwright/test';
import { login } from './helpers';

// citrineos-payment v1.4 (payments migrations 0045-0050): the points ledger,
// exported energy, and structured opening hours replacing the free-text
// column. Hasura isn't running in this env, so /api/graphql is answered here.
function answer(route: Route, data: unknown) {
  return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data }) });
}

test.describe('payment v1.4 schema', () => {
  test('points ledger is listed read-only with translated reasons', async ({ page }) => {
    await page.route('**/api/graphql', (route) => {
      const { query } = route.request().postDataJSON() as { query: string };
      if (!query.includes('payment_point_entries')) return answer(route, {});
      return answer(route, {
        payment_point_entries: [
          { id: 1, created_at: '2026-10-01T10:00:00Z', user_id: 7, checkout_id: 42, amount_cents: 125, currency: 'EUR', reason: 'export_credit' },
          { id: 2, created_at: '2026-10-02T10:00:00Z', user_id: 7, checkout_id: 43, amount_cents: -125, currency: 'EUR', reason: 'session_payment' },
        ],
        payment_point_entries_aggregate: { aggregate: { count: 2 } },
      });
    });
    await login(page);

    await page.getByRole('link', { name: 'Point Entries' }).click();
    await expect(page).toHaveURL(/\/point-entries$/);
    await expect(page.getByRole('columnheader', { name: 'Amount (cents)' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Export credit' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Spent on a session' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New' })).toHaveCount(0);
  });

  test('location form saves opening hours as a schedule object and rejects what the backend cannot read', async ({ page }) => {
    const mutations: { query: string; variables: Record<string, any> }[] = [];
    await page.route('**/api/graphql', (route) => {
      const body = route.request().postDataJSON() as { query: string; variables: Record<string, any> };
      if (body.query.trim().startsWith('mutation')) {
        mutations.push(body);
        return answer(route, { insert_payment_locations_one: { id: 99 } });
      }
      return answer(route, { payment_operators: [], payment_operators_aggregate: { aggregate: { count: 0 } } });
    });
    await login(page);
    await page.goto('/locations/new');

    await expect(page.getByText('Opening hours (weekly schedule, JSON)')).toBeVisible();
    await page.locator('#location_id').fill('LOC-E2E');
    const schedule = page.locator('#opening_hours_schedule');
    const save = page.getByRole('button', { name: 'Save' });

    await schedule.fill('{"mon": [');
    await save.click();
    await expect(page.getByText('Not valid JSON.')).toBeVisible();

    await schedule.fill('{"mon": [{"start": "18:00", "end": "08:00"}]}');
    await save.click();
    await expect(page.getByText(/start before end/)).toBeVisible();

    await schedule.fill('{"monday": [{"start": "08:00", "end": "18:00"}]}');
    await save.click();
    await expect(page.getByText(/Days are mon, tue/)).toBeVisible();

    await schedule.fill('{"mon": [{"start": "08:00", "end": "18:00"}], "sat": [{"start": "00:00", "end": "24:00"}]}');
    await page.locator('#timezone').fill('Europe/Atlantis');
    await save.click();
    await expect(page.getByText(/An IANA time zone/)).toBeVisible();
    expect(mutations).toHaveLength(0);

    await page.locator('#timezone').fill('Europe/Lisbon');
    await page.locator('#opening_hours_note').fill('Ring the bell');
    await save.click();
    await expect.poll(() => mutations.length).toBe(1);

    const object = mutations[0].variables.object ?? Object.values(mutations[0].variables)[0];
    expect(object.opening_hours_schedule).toEqual({
      mon: [{ start: '08:00', end: '18:00' }],
      sat: [{ start: '00:00', end: '24:00' }],
    });
    expect(object.timezone).toBe('Europe/Lisbon');
    expect(object.opening_hours_note).toBe('Ring the bell');
    expect(object).not.toHaveProperty('opening_hours');
  });
});
