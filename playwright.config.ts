import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['github'],
    ['junit', { outputFile: 'results/junit.xml' }],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://www.demoblaze.com/', 
    trace: 'on',
    screenshot: 'on',
    video: 'on', // you asked for videos even on success
  },
  projects: [
    { name: 'chrome', use: { channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});








