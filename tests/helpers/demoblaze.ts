// helpers/demoblaze.ts
import { Page, expect } from '@playwright/test';
import { APIRequestContext, APIResponse } from '@playwright/test';

// Click "Add to cart" and wait for the alert (preferred),
// otherwise fall back to network + cart verification.
export async function addToCartWithAlertOrFallback(page: Page, productName: string) {
  // Ensure we're on the product page (title is visible)
  await expect(page.locator('#tbodyid .name')).toHaveText(productName, { timeout: 10000 });

  // Make sure the button is on-screen and clickable
  const addBtn = page.getByText('Add to cart', { exact: true });
  await addBtn.scrollIntoViewIfNeeded();
  await expect(addBtn).toBeVisible();
  await expect(addBtn).toBeEnabled();

  // Prepare waits: JavaScript alert + network response to /addtocart
  const waitDialog = page.waitForEvent('dialog', { timeout: 10000 }).catch(() => null);
  const waitAddToCartResponse = page.waitForResponse(
    (r) => r.url().includes('/addtocart') && r.status() === 200,
    { timeout: 10000 }
  ).catch(() => null);

  // Click it
  await addBtn.click({ force: true });

  // First, prefer the dialog if it appears
  const dialog = await waitDialog;
  if (dialog) {
    const msg = dialog.message();
    await dialog.accept();
    expect(msg).toMatch(/Product added/i);
    return;
  }

  // No dialog? Fall back to network + cart assertion
  await waitAddToCartResponse; // may be null if it failed—cart check will tell us
  await page.getByText('Cart').click();
  await expect(page).toHaveURL(/cart\.html/);

  const row = page.locator('#tbodyid tr', { hasText: productName });
  await expect(row).toBeVisible({ timeout: 10000 }); // product present in cart = success

  // API endpoint call
  // ...existing code...
}

// Move interfaces and function export outside of the function above

export interface Entry {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface EntriesResponse {
  Items: Entry[];
  [key: string]: unknown;
}

// filepath: ..\tests\helpers\demoblaze.ts
export async function getEntries(request: APIRequestContext): Promise<any[]> {
  const response = await request.get('https://api.demoblaze.com/entries');
  if (!response.ok()) throw new Error('Failed to fetch entries');
  const data = await response.json();
  return data.Items || [];
}
