import { test, expect } from '@playwright/test';

test.describe('authentication guard', () => {
  test('redirects an unauthenticated visitor to sign-in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/api\/auth\/signin/);
  });

  test('redirects an unauthenticated visitor away from a protected sub-page', async ({ page }) => {
    await page.goto('/locations');
    await expect(page).toHaveURL(/\/api\/auth\/signin/);
  });
});
