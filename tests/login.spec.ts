import { test, expect, Page } from '@playwright/test';


const EMAIL = process.env.TEST_USER_EMAIL ?? '';
const PASS  = process.env.TEST_USER_PASSWORD ?? '';

async function twoStepLogin(page: Page, email: string, password: string) {
  await page.goto('https://app.sign.plus/login', { waitUntil: 'domcontentloaded' });

  // Step 1: Email (or username)
  const emailField = page.locator('#username, input[name="username"], input[type="email"]');
  await emailField.waitFor({ state: 'visible', timeout: 15000 });
  await emailField.fill(email);

  // Trigger reveal of password (Enter/blur)
  await emailField.press('Enter').catch(() => {});
  await page.keyboard.press('Tab').catch(() => {});

  // If a Next/Continue button exists, click it; otherwise skip
  const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
  if ((await nextBtn.count()) > 0 && await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click();
  }

  // Step 2: Password
  const pwdField = page.locator('#password, input[name="password"], input[type="password"]');
  await pwdField.waitFor({ state: 'visible', timeout: 15000 });
  await pwdField.fill(password);

  // Sign In button (Keycloak / #kc-login)
  const signInBtn = page.getByRole('button', { name: /sign in|log in/i })
                   .or(page.locator('#kc-login, input[type="submit"]'));
  await expect(signInBtn).toBeEnabled({ timeout: 15000 });
  await signInBtn.click();
}

test('Login succeeds with valid credentials', async ({ page, context }) => {
  await twoStepLogin(page, EMAIL, PASS);
  await expect(page).toHaveURL(/app\.sign\.plus\/(home|documents|dashboard)/, { timeout: 30000 });
  await expect(page.getByText(/recently completed/i)).toBeVisible({ timeout: 12000 });

  // Optional: reuse session 
  await context.storageState({ path: 'storageState.json' });
});

test('Login fails with wrong password', async ({ page }) => {
  await twoStepLogin(page, EMAIL, 'WrongPassword123!');
  await expect(page.locator('text=/invalid (username|email) or password/i')).toBeVisible({ timeout: 10000 });
  await expect(page).not.toHaveURL(/app\.sign\.plus\/(home|documents|dashboard)/, { timeout: 8000 });
});

