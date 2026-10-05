import { test, expect } from '@playwright/test';
import { login } from './helpers';

// The page against a stubbed /api/sales (Hasura isn't running in this env);
// the numbers themselves are covered by sales-aggregation.spec.ts.
const ROWS: Record<string, unknown[]> = {
  summary: [{ key: '', label: null, currency: 'EUR', sessions: 3, revenueCents: 4250, kwh: 31.5, exportedKwh: 0, platformFeeCents: 150 }],
  location: [
    { key: '1', label: 'Burgthann', currency: 'EUR', sessions: 2, revenueCents: 3000, kwh: 20, exportedKwh: 0, platformFeeCents: 100 },
    { key: '', label: null, currency: 'EUR', sessions: 1, revenueCents: 1250, kwh: 11.5, exportedKwh: 0, platformFeeCents: 50 },
  ],
  operator: [{ key: '7', label: 'BEOS', currency: 'EUR', sessions: 3, revenueCents: 4250, kwh: 31.5, exportedKwh: 0, platformFeeCents: 150 }],
  day: [{ key: '2026-10-01', label: null, currency: 'EUR', sessions: 3, revenueCents: 4250, kwh: 31.5, exportedKwh: 0, platformFeeCents: 150 }],
  month: [{ key: '2026-10', label: null, currency: 'EUR', sessions: 3, revenueCents: 4250, kwh: 31.5, exportedKwh: 0, platformFeeCents: 150 }],
};

test('sales: every view can be switched to, and the Excel download follows the view', async ({ page }) => {
  const requested: URL[] = [];
  await page.route('**/api/sales?*', (route) => {
    const url = new URL(route.request().url());
    requested.push(url);
    if (url.searchParams.get('format') === 'xlsx') {
      return route.fulfill({
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: 'xlsx',
      });
    }
    return route.fulfill({ json: { rows: ROWS[url.searchParams.get('view') ?? 'summary'] } });
  });
  await login(page);

  await page.locator('aside').getByRole('link', { name: 'Sales' }).click();
  await expect(page).toHaveURL(/\/sales$/);
  await expect(page.getByRole('cell', { name: '€42.50' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '€1.50' })).toBeVisible();

  await page.getByRole('tab', { name: 'By location' }).click();
  await expect(page.getByRole('columnheader', { name: 'Location' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Burgthann' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '(none)' })).toBeVisible();

  await page.getByRole('tab', { name: 'By operator' }).click();
  await expect(page.getByRole('cell', { name: 'BEOS' })).toBeVisible();
  await page.getByRole('tab', { name: 'By day' }).click();
  await expect(page.getByRole('cell', { name: '2026-10-01' })).toBeVisible();
  await page.getByRole('tab', { name: 'By month' }).click();
  await expect(page.getByRole('cell', { name: '2026-10', exact: true })).toBeVisible();

  await page.locator('#from').fill('2026-09-01');
  await page.locator('#to').fill('2026-09-30');
  await expect.poll(() => requested.at(-1)?.search).toContain('from=2026-09-01&to=2026-09-30&view=month');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Excel' }).click();
  expect((await download).suggestedFilename()).toBe('sales_month_2026-09-01_2026-09-30.xlsx');
  expect(requested.at(-1)?.searchParams.get('format')).toBe('xlsx');
});

test('sales: an API error is shown, not an empty table', async ({ page }) => {
  await page.route('**/api/sales?*', (route) => route.fulfill({ status: 500, json: { error: 'Hasura unreachable' } }));
  await login(page);
  await page.goto('/sales');
  await expect(page.getByText('Hasura unreachable')).toBeVisible();
});

test('sales: the chart view shows figures for the total and bars per group and metric', async ({ page }) => {
  await page.route('**/api/sales?*', (route) => {
    const view = new URL(route.request().url()).searchParams.get('view') ?? 'summary';
    return route.fulfill({ json: { rows: ROWS[view] } });
  });
  await login(page);
  await page.goto('/sales');
  await page.getByRole('tab', { name: 'Chart' }).click();

  const figures = page.getByTestId('sales-figures');
  await expect(figures.getByText('€42.50')).toBeVisible();
  await expect(figures.getByText('31.5')).toBeVisible();

  await page.getByRole('tab', { name: 'By location' }).click();
  const chart = page.getByTestId('sales-chart');
  await expect(chart.locator('.recharts-bar-rectangle')).toHaveCount(2);
  await expect(chart.getByText('Burgthann')).toBeVisible();

  await page.getByRole('tab', { name: 'By day' }).click();
  await page.getByRole('tab', { name: 'Sessions' }).click();
  await expect(chart.locator('.recharts-bar-rectangle')).toHaveCount(1);
  await expect(chart.getByText('2026-10-01')).toBeVisible();

  await page.getByRole('tab', { name: 'Table' }).click();
  await expect(page.getByRole('cell', { name: '2026-10-01' })).toBeVisible();
});
