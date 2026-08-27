import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E tests run against the 'generic' auth provider (hardcoded admin
 * credentials, no Keycloak dependency) so they work without any external
 * services. See .env.local.example for what each var configures.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run build && pnpm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_AUTH_PROVIDER: 'generic',
      NEXT_PUBLIC_ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'e2e-test-password',
      NEXTAUTH_URL: baseURL,
      NEXTAUTH_SECRET: 'e2e-test-secret',
      NEXT_PUBLIC_API_URL: 'http://localhost:8090/v1/graphql',
      HASURA_ADMIN_SECRET: 'unused-in-e2e',
    },
  },
});
