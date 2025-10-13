import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.demoblaze.com/', 
    trace: 'on',
    screenshot: 'on',
    video: 'on', // you asked for videos even on success
  },
  projects: [
    { name: 'chrome', use: { channel: 'chrome' } },
    // { name: 'firefox', use: { browserName: 'firefox' } },
    // { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});








