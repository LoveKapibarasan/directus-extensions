import { test, expect } from '@playwright/test';
import { login } from './helpers';

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
});
