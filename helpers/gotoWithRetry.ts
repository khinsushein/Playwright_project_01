// import { Page, Response, expect } from '@playwright/test';

// export async function gotoWithRetry(page: Page, url: string, attempts = 3) {
//   let lastErr: unknown;
//   for (let i = 1; i <= attempts; i++) {
//     try {
//       const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
//       // If Cloudflare block/timeout, resp can be null or 52x/5xx HTML page
//       if (!resp) throw new Error('No response (possible 522).');
//       const status = resp.status();
//       if (status >= 200 && status < 400) return resp;

//       // Detect Cloudflare error page by status/text
//       const body = await resp.text();
//       if (status === 522 || /cloudflare/i.test(body)) {
//         throw new Error(`Cloudflare ${status} on attempt ${i}`);
//       }
//       // Non-CF 4xx/5xx still retryable for the flow
//       throw new Error(`HTTP ${status} on attempt ${i}`);
//     } catch (e) {
//       lastErr = e;
//       // backoff
//       await new Promise(r => setTimeout(r, i * 1500));
//       // optional: flip to fallback host after first failure
//       if (i === 1) {
//         const alt = url.replace('https://app.sign.plus', 'https://sign.plus')
//                        .replace('https://app.fax.plus',  'https://fax.plus');
//         if (alt !== url) url = alt;
//       }
//     }
//   }
//   throw lastErr;
// }
