import { test, expect, Page } from '@playwright/test';
import { addToCartWithAlertOrFallback } from '../tests/helpers/demoblaze.ts';

// Simple helper to handle the site's alert popups
async function expectAlert(page: Page, matcher: RegExp, action: () => Promise<void>) {
  const msg = await Promise.race<string>([
    new Promise((resolve) => {
      const listener = (d: any) => {
        resolve(d.message());
        d.accept();
        page.off('dialog', listener);
      };
      page.on('dialog', listener);
    }),
    (async () => {
      await action();
      return 'NO_ALERT';
    })(),
  ]);
  expect(msg).toMatch(matcher);
}

// waits for a JS alert triggered by `action()` and returns its message
async function clickAndWaitAlert(page: Page, action: () => Promise<void>, timeout = 10000) {
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog', { timeout }),
    action(),
  ]);
  const msg = dialog.message();
  await dialog.accept();
  return msg;
}


// signUp() will be called once per test suite to create a unique user


async function signUp(page: Page, username: string, password: string) {
  await page.goto('/');

  // 1) Open the Sign up modal (unique nav link)
   await page.getByRole('link', { name: 'Sign up' }).click();

  // 2) Wait for modal to be visible, then scope all locators to that modal
   const modal = page.locator('#signInModal'); // Bootstrap modal id used by Demoblaze
   await expect(modal).toBeVisible();
   await page.waitForTimeout(5000)


  // 3) Fill fields inside modal (avoid global ids if multiple modals existed)
   await modal.locator('#sign-username').fill(username);
   await modal.locator('#sign-password').fill(password);

  // 4) Click the Sign up button inside the modal and assert the alert
    await expectAlert(page, /Sign up successful|This user already exist/i, async () => {
    await modal.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForTimeout(5000)
  });

  // Optionally wait the modal to close
   await expect(modal).toBeHidden({ timeout: 5000 }).catch(() => {});
}

export async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();

  const modal = page.locator('#logInModal');
  await expect(modal).toBeVisible();

  await modal.locator('#loginusername').fill(username);
  await modal.locator('#loginpassword').fill(password);
  await modal.getByRole('button', { name: 'Log in' }).click();
  await modal.getByRole('button', { name: 'Log in' }).click();
  console.log('Clicked login button');
  await expect(page.getByText(new RegExp(`Welcome\\s+${username}`))).toBeVisible();
  await page.waitForTimeout(5000)
}


// robust logout helper
async function logout(page: Page) {
  // If a JS alert is still open (from add-to-cart / login), accept it
  page.once('dialog', d => d.accept().catch(() => {}));

  // Click the nav "Log out" link if visible
  const logoutLink = page.getByRole('link', { name: 'Log out', exact: true });
  if (await logoutLink.isVisible().catch(() => false)) {
    await logoutLink.click();
  }

  // Wait for logged-out UI: “Log in” link reappears
  await expect(page.getByRole('link', { name: 'Log in', exact: true })).toBeVisible();
}



test.describe('Demoblaze e2e', () => {
  const password = 'P@ssw0rd123';
  const username = `e2e_${Date.now()}`; // unique per run

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await signUp(page, username, password);
    await page.waitForTimeout(8000)
    await ctx.close();
  });

  test.setTimeout(60_000); // give the whole flow breathing room

  test('Login → add to cart → place order → receipt → logout', async ({ page }) => {
    await login(page, username, password);

    // Go to home (avoid category race)
    await page.goto('https://www.demoblaze.com/', { waitUntil: 'domcontentloaded' });

    // Category → Product (one click, one wait)
    const laptopsLink = page.getByRole('link', { name: /^Laptops$/, exact: true });
    await laptopsLink.scrollIntoViewIfNeeded();
    await expect(laptopsLink).toBeVisible();
    await laptopsLink.click();

    const productLink = page.getByRole('link', { name: /^Sony vaio i5$/, exact: true });
    await productLink.scrollIntoViewIfNeeded();
    await expect(productLink).toBeVisible({ timeout: 10_000 });
    await Promise.all([
      page.waitForURL(/prod\.html\?idp_/),
      productLink.click(),
    ]);

    // On PDP, confirm product title
    await expect(page.locator('#tbodyid .name')).toHaveText('Sony vaio i5', { timeout: 10_000 });

    // Add to cart → wait for JS alert
    const addBtn = page.getByRole('link', { name: /^Add to cart$/, exact: true });
    await addBtn.scrollIntoViewIfNeeded();
    await expect(addBtn).toBeVisible();
    const [dlg] = await Promise.all([
      page.waitForEvent('dialog', { timeout: 10_000 }),
      addBtn.click({ force: true }),
    ]);
    await expect.soft(dlg.message()).toMatch(/Product added/i);
    await dlg.accept();

    // Open cart and verify item
    await Promise.all([
      page.waitForURL(/cart\.html/),
      page.locator('#cartur').click(),
    ]);
    await expect(page.locator('#tbodyid tr', { hasText: 'Sony vaio i5' })).toBeVisible({ timeout: 10_000 });

    // Place Order → Purchase → receipt
    const placeOrderBtn = page.getByRole('button', { name: /^Place Order$/, exact: true });
    await placeOrderBtn.scrollIntoViewIfNeeded();
    await expect(placeOrderBtn).toBeEnabled();
    await placeOrderBtn.click();

    const orderModal = page.locator('#orderModal');
    await expect(orderModal).toBeVisible({ timeout: 5_000 });

    await orderModal.locator('#name').fill('Ada Lovelace');
    await orderModal.locator('#country').fill('UK');
    await orderModal.locator('#city').fill('London');
    await orderModal.locator('#card').fill('4111111111111111');
    await orderModal.locator('#month').fill('12');
    await orderModal.locator('#year').fill('2030');
    await orderModal.getByRole('button', { name: /^Purchase$/, exact: true }).click();

    const receipt = page.locator('.sweet-alert p');
    await expect(receipt).toBeVisible({ timeout: 5_000 });
    await expect(receipt).toContainText(/Id:\s*\d+/i);
    await expect(receipt).toContainText(/Amount:\s*\d+\s*(USD|\$)/i);
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // Re-open cart (navigate directly; avoids intercepted clicks / no-nav cases)
    await page.goto('https://www.demoblaze.com/cart.html', { waitUntil: 'domcontentloaded' });

    // Logout
    
    const logoutLink = page.getByRole('link', { name: 'Log out', exact: true });
    await expect(logoutLink).toBeVisible({ timeout: 8000 }); // wait up to 10s
    await logoutLink.click();
    });




  test('Negative: login for non-existent user shows an error', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Log in' }).click();

    // Attach dialog listener early
        const dialogPromise = page.waitForEvent('dialog');

    // Fill in login form
    await page.locator('#loginusername').fill('your_created_username');
    await page.locator('#loginpassword').fill('DefinitelyWrong!');

    // Click login button
    await page.getByRole('button', { name: 'Log in' }).click();

    // Wait for and assert the alert
    const dialog = await dialogPromise;
    console.log('⚠️ Alert message:', dialog.message());
    expect(dialog.message()).toMatch(/wrong password|does not exist/i);
    await dialog.accept();
        });



async function clickAndWaitAlert(page: Page, action: () => Promise<void>, timeout = 10000) {
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog', { timeout }),
            action(),
    ]);
        const msg = dialog.message();
        await dialog.accept();
        return msg;
}

test('Negative: login with wrong password – shows an error', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');

  // --- Sign up a fresh user ---
  const username = `e2e_${Date.now()}`;
  const goodPass = 'P@ssw0rd123';

  // Open Sign up modal via NAV link
  await page.getByRole('link', { name: 'Sign up' }).click();
  const signUpModal = page.locator('#signInModal');
  await expect(signUpModal).toBeVisible();

  await signUpModal.locator('#sign-username').fill(username);
  await signUpModal.locator('#sign-password').fill(goodPass);

  const signUpMsg = await clickAndWaitAlert(page, async () => {
    await signUpModal.getByRole('button', { name: 'Sign up', exact: true }).click();
  });
  expect(signUpMsg).toMatch(/sign up successful|this user already exist/i);

  // --- Attempt login with WRONG password ---
  await page.getByRole('link', { name: 'Log in' }).click();
  const loginModal = page.locator('#logInModal');
  await expect(loginModal).toBeVisible();

  await loginModal.locator('#loginusername').fill(username);           // use the created username
  await loginModal.locator('#loginpassword').fill('DefinitelyWrong!'); // wrong password

  const loginMsg = await clickAndWaitAlert(page, async () => {
    await loginModal.getByRole('button', { name: 'Log in', exact: true }).click();
  });
  expect(loginMsg).toMatch(/wrong password/i); // or /(wrong password|does not exist)/i
});

  
  });
