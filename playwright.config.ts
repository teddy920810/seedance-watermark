import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'line',
  use: {
    baseURL: 'http://127.0.0.1:4323',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx astro dev --host 127.0.0.1 --port 4323',
    url: 'http://127.0.0.1:4323',
    // Never reuse another checkout's dev server; similarly named projects may run in parallel.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      SITE_URL: 'http://127.0.0.1:4323',
      // Astro 7 otherwise auto-backgrounds dev servers in detected agent environments,
      // which makes Playwright think its managed web server exited early.
      ASTRO_DEV_BACKGROUND: '1',
    },
  },
});

