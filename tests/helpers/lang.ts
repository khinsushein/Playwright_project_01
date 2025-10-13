// tests/helpers/lang.ts
import { BrowserContext, Page, expect } from '@playwright/test';

export async function newEnglishContext(browser: any) {
  const context: BrowserContext = await browser.newContext({
    locale: 'en-US',
    geolocation: { latitude: 40.7128, longitude: -74.0060 }, // US geoloc to bias EN
    permissions: ['geolocation'],
  });

  // Make navigator.languages report EN
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });

  return context;
}

export async function forceEnglishUI(page: Page) {
  // Close Google Translate bubble if it slips through
  await page.locator('div[aria-label*="Google Translate"] button, [aria-label="Close"]').first()
    .click({ timeout: 1000 }).catch(() => {});

  // If the header shows "Français", switch it to English
  const frBtn = page.locator('text=Français, button:has-text("Français"), [aria-label*="Français"]');
  if (await frBtn.first().isVisible().catch(() => false)) {
    await frBtn.first().click();
    await page.locator('text=English, button:has-text("English"), [role="menuitem"]:has-text("English")')
      .first().click();
    // Confirm the header now shows English
    await expect(page.locator('text=English')).toBeVisible({ timeout: 5000 });
  }
}
