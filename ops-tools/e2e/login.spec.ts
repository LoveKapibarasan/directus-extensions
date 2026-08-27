import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('logs in and lands on the dashboard with the main menu visible', async ({ page }) => {
  await login(page);

  await expect(page.getByRole('heading', { name: 'CitrineOS Ops Tools' })).toBeVisible();
  await expect(page.getByText('Pick a section from the sidebar to get started.')).toBeVisible();

  const nav = page.locator('aside');
  await expect(nav.getByRole('link', { name: 'Locations' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Tariffs' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Export Transactions' })).toBeVisible();
});

test('signs out and is redirected back to sign-in', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: /sign out/i }).click();
  await page.getByRole('button', { name: /sign out/i }).click();

  await page.goto('/');
  await expect(page).toHaveURL(/\/api\/auth\/signin/);
});
