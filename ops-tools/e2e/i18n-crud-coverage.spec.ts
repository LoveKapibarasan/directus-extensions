import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Guards against #18's regression: CRUD screens (not just the nav/shell)
// must be translated too. Switches to Japanese and checks a resource's
// list/new pages render translated column headers and field labels.
test.describe('i18n covers CRUD screens', () => {
  test('Tariffs list and new-record form are translated in Japanese', async ({ page }) => {
    await login(page);

    await page.getByTestId('language-switcher').click();
    await page.getByRole('option', { name: '日本語' }).click();

    await page.goto('/tariffs');
    await expect(page.getByRole('heading', { name: '料金プラン' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '通貨', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '新規作成' })).toBeVisible();

    await page.goto('/tariffs/new');
    await expect(page.getByText('新規料金プラン')).toBeVisible();
    await expect(page.getByText('通貨（ISO 4217、例：EUR）')).toBeVisible();
    await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible();
  });
});
