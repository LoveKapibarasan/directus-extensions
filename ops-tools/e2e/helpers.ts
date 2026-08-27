import type { Page } from '@playwright/test';

/**
 * Logs in through NextAuth's built-in credentials sign-in page using the
 * 'generic' provider's hardcoded admin account (configured for this test
 * run via playwright.config.ts's webServer env).
 */
export async function login(page: Page) {
  await page.goto('/api/auth/signin');
  await page.getByLabel('Username').fill('admin@example.com');
  await page.getByLabel('Password').fill('e2e-test-password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('/');
}
