import { expect, type Locator, type Page } from '@playwright/test';
import type { Credentials } from '../data/users';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.error = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async expectVisible(): Promise<void> {
    await expect(this.username).toBeVisible();
    await expect(this.password).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.error, 'Login error is visible').toBeVisible();
    await expect(this.error).toHaveText(message);
  }

  async login(credentials: Credentials): Promise<void> {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }
}
