import { test, expect } from '@playwright/test';
import { login } from './helpers';

// CI has no Google Maps credentials configured, so these assert the graceful
// "not configured" fallback rather than an actual rendered map — the map
// components themselves are exercised manually / against a real API key.
test.describe('location map UI', () => {
  test('new location form shows the map picker fallback and manual coordinate inputs', async ({
    page,
  }) => {
    await login(page);
    await page.goto('/locations/new');

    await expect(page.getByText(/Google Maps isn't configured/)).toBeVisible();
    await expect(page.getByPlaceholder('Latitude')).toBeVisible();
    await expect(page.getByPlaceholder('Longitude')).toBeVisible();
  });

  test('locations list has a Table/Map toggle', async ({ page }) => {
    await login(page);
    await page.goto('/locations');

    await expect(page.getByRole('tab', { name: 'Table' })).toBeVisible();
    await page.getByRole('tab', { name: 'Map' }).click();
    // The locations list query retries against Hasura (unreachable in this
    // env) a few times before settling, so give it more than the default
    // timeout to reach the "not configured" fallback.
    await expect(page.getByText(/Google Maps isn't configured/)).toBeVisible({ timeout: 15000 });
  });
});
