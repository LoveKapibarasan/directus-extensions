import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('language switching', () => {
  test('switches the UI to Japanese and back, and persists across reload', async ({ page }) => {
    await login(page);

    const nav = page.locator('aside');
    await expect(nav.getByRole('link', { name: 'Locations' })).toBeVisible();

    await page.getByTestId('language-switcher').click();
    await page.getByRole('option', { name: '日本語' }).click();

    await expect(nav.getByRole('link', { name: '拠点' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CitrineOS Ops Tools' })).toBeVisible();
    await expect(page.getByText('サイドバーからセクションを選択してください。')).toBeVisible();

    await page.reload();
    await expect(nav.getByRole('link', { name: '拠点' })).toBeVisible();

    await page.getByTestId('language-switcher').click();
    await page.getByRole('option', { name: 'English' }).click();
    await expect(nav.getByRole('link', { name: 'Locations' })).toBeVisible();
  });
});
