// utils/consent.ts
import { Page, FrameLocator } from '@playwright/test';

export async function handleTemuConsent(page: Page, prefer: 'accept' | 'continue' | 'refuse' = 'accept') {
  const selectors = {
    accept: 'button:has-text("Tout accepter")',
    continue: 'button:has-text("Continuer sans accepter")',
    refuse: 'button:has-text("Tout refuser")',
    dialog: '[role="dialog"]:has-text("confidentialité"), [aria-modal="true"]',
  };

  // Some CMPs render in an iframe; try both.
  const frames: (Page | FrameLocator)[] = [
    page,
    page.frameLocator('iframe[id*="sp_message_iframe"], iframe[title*="privacy"], iframe[title*="consent"]'),
  ];

  const order = (
    prefer === 'accept' ? ['accept', 'continue', 'refuse'] :
    prefer === 'continue' ? ['continue', 'accept', 'refuse'] :
    ['refuse', 'continue', 'accept']
  ) as Array<'accept' | 'continue' | 'refuse'>;

  for (const ctx of frames) {
    for (const key of order) {
      const btn = (ctx as any).locator(selectors[key]);
      if (await btn.first().isVisible().catch(() => false)) {
        await btn.first().click({ timeout: 3000 }).catch(() => {});
        // Wait for banner/overlay to disappear
        const dlg = (ctx as any).locator(selectors.dialog);
        await dlg.waitFor({ state: 'detached', timeout: 4000 }).catch(() => {});
        // Also ensure no full-page overlay remains
        await page.waitForTimeout(300); // give layout a tick
        return;
      }
    }
  }
}
