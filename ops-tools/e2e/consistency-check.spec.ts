import { test, expect } from '@playwright/test';
import { login } from './helpers';
import { buildConsistencyReport } from '../src/lib/server/consistency-mapping';
import { consistencyData } from './fixtures/consistency';

test.describe('consistency check', () => {
  test('page loads, shows the nav link, and surfaces a Hasura error gracefully', async ({ page }) => {
    await login(page);

    const nav = page.locator('aside');
    await expect(nav.getByRole('link', { name: 'Consistency Check' })).toBeVisible();
    await nav.getByRole('link', { name: 'Consistency Check' }).click();

    await expect(page.getByRole('heading', { name: 'Consistency Check' })).toBeVisible();
    // No Hasura reachable in this env — the page should report the failure,
    // not crash or hang.
    await expect(page.getByText(/Couldn't run the check/)).toBeVisible({ timeout: 15000 });
  });

  test('lists every mapping, marks the column that disagrees, and filters to problems', async ({ page }) => {
    await page.route('**/api/consistency-check', (route) => route.fulfill({ json: buildConsistencyReport(consistencyData) }));
    await login(page);
    await page.goto('/consistency-check');

    const evses = page.getByTestId('mappings-evse');
    await expect(evses.getByText('Matched on: Evses.evseId = payment_evses.evse_id')).toBeVisible();
    const ok = evses.locator('tr[data-status]').filter({ hasText: 'DE*AIC*E*TMP*0001' });
    await expect(ok.getByText('Consistent')).toBeVisible();
    await expect(ok.getByText('Evses #31')).toBeVisible();
    await expect(ok.getByText('payment_evses #1')).toBeVisible();

    const wrong = evses.locator('tr[data-status]').filter({ hasText: 'DE*AIC*E*TMP*0049' });
    await expect(wrong.getByText('Column mismatch')).toBeVisible();
    const cell = wrong.locator('tr[data-equal="false"]');
    await expect(cell).toHaveCount(1);
    await expect(cell).toContainText('ChargingStations.tenantId (via Evses.stationId) = 2');
    await expect(cell).toContainText('payment_evses.tenant_id = 1');
    await expect(wrong.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/evses/8/edit');

    const missing = evses.locator('tr[data-status]').filter({ hasText: 'DE*AIC*E*TMP*0090' });
    await expect(missing.getByRole('link', { name: 'Create' })).toHaveAttribute(
      'href',
      '/evses/new?evse_id=DE*AIC*E*TMP*0090&ocpp_evse_id=1&station_id=ACE0999999&tenant_id=2',
    );

    await page.getByRole('tab', { name: 'Problems only' }).click();
    await expect(evses.locator('tr[data-status]').filter({ hasText: 'DE*AIC*E*TMP*0001' })).toHaveCount(0);
    await expect(evses.locator('tr[data-status]').filter({ hasText: 'DE*AIC*E*TMP*0049' })).toHaveCount(1);
  });

  test('the create link pre-fills the EVSE form, tenant included', async ({ page }) => {
    await page.route('**/api/graphql', (route) => route.fulfill({ json: { data: {} } }));
    await login(page);
    await page.goto('/evses/new?evse_id=DE%2AAIC%2AE%2ATMP%2A0090&ocpp_evse_id=1&station_id=ACE0999999&tenant_id=2');
    await expect(page.locator('#evse_id')).toHaveValue('DE*AIC*E*TMP*0090');
    await expect(page.locator('#tenant_id')).toHaveValue('2');
  });
});
