// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'https://www.demoblaze.com';

export default defineConfig({
  use: {
    baseURL,                  // <-- enables page.goto('/') everywhere
    trace: 'on',
    video: 'on',
    screenshot: 'on',
  },
reporter: [
  ['list'],
  ['junit', { outputFile: 'results/junit-[project].xml' }],
  ['html',  { open: 'never', outputFolder: 'playwright-report' }],
],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  outputDir: 'test-results',
});










