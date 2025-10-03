import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private email: Locator;
  private password: Locator;
  private signIn: Locator;

  constructor(private page: Page) {
    this.email = page.locator('#username, input[name="username"], input[type="email"]');
    this.password = page.locator('#password, input[name="password"], input[type="password"]');
    this.signIn = page.getByRole('button', { name: /sign in|log in/i });
  }

  async goto() {
    await this.page.goto('/login'); 
  }

  async login(email: string, pwd: string) {
    await this.email.waitFor({ state: 'visible', timeout: 15000 });
    await this.email.fill(email);

    // handle Enter/Next step
    await this.page.keyboard.press('Enter').catch(() => {});

    await this.password.waitFor({ state: 'visible', timeout: 15000 });
    await this.password.fill(pwd);

    await expect(this.signIn).toBeEnabled();
    await this.signIn.click();

    // optional: verify landing
    await expect(this.page.getByRole('navigation')).toBeVisible({ timeout: 12000 });
  }
}

