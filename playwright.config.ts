import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://www.demoblaze.com',
    viewport: { width: 1366, height: 768 },
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 90_000,
});



// import 'dotenv/config';
// import { defineConfig } from '@playwright/test';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: './env/.env' });



// export default defineConfig({
//   // Helpful defaults
//   timeout: 90_000,
//   expect: { timeout: 10_000 },
//   retries: 1,
//   reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

//   use: {
//     baseURL: 'https://www.temu.com/?lang=en-US', // ← drop ?lang, rely on locale + headers
//     locale: 'en-US',
//     extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
//     // userAgent:  // ← let Chrome supply a real UA automatically
//     viewport: { width: 1366, height: 768 },
//     // Nice-to-haves for debugging
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//   },

//   projects: [
//     {
//       name: 'chrome',
//       use: {
//         channel: 'chrome',
//         launchOptions: {
//           headless: false, // flip to true later if stable
//           args: [
//             '--lang=en-US',
//             '--disable-translate',
//             '--disable-features=Translate,TranslateUI,AutomationControlled',
//           ],
//         },
//       },
//     },
//   ],
// });






