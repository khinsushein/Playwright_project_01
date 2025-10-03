import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: 2,                           // auto-rerun flaky due to 5xx/522
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://sign.plus', // fallback if app.* fails
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { baseURL: 'https://app.sign.plus' } },
    { name: 'firefox',  use: { baseURL: 'https://app.fax.plus'  } },
    { name: 'webkit',   use: { baseURL: 'https://scan.plus'     } }, // robust alt for scan/app.*
  ],
};
export default config;
