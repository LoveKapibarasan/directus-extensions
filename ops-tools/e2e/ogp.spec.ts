import { test, expect } from '@playwright/test';

// What a link-preview crawler gets for a shared ops-tools URL: it has no
// session, so it lands on /login, which carries the OGP tags.
test('a shared link previews with title, description and image', async ({ request, baseURL }) => {
  const first = await request.get('/locations', { maxRedirects: 0 });
  expect(first.status()).toBe(307);
  expect(first.headers()['location']).toContain('/login?callbackUrl=%2Flocations');

  const html = await (await request.get('/login?callbackUrl=%2Flocations')).text();
  const meta = (p: string) => html.match(new RegExp(`<meta (?:property|name)="${p}" content="([^"]*)"`))?.[1];
  expect(meta('og:title')).toBe('CitrineOS Ops Tools');
  expect(meta('og:description')).toContain('operations console');
  expect(meta('og:image')).toBe(`${baseURL}/og.png`);
  expect(meta('og:image:width')).toBe('1200');
  expect(meta('twitter:card')).toBe('summary_large_image');
  expect(meta('robots')).toBe('noindex, nofollow');

  const image = await request.get('/og.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/png');
});

test('a browser still ends up on the sign-in page, keeping where it was going', async ({ page }) => {
  await page.goto('/locations');
  await expect(page).toHaveURL(/\/api\/auth\/signin\?callbackUrl=%2Flocations/);
});
