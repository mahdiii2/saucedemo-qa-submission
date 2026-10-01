import { expect, type Locator, type Page } from '@playwright/test';

export class Header {
  readonly badge: Locator;

  constructor(private readonly page: Page) {
    this.badge = page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu', exact: true }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.badge).toHaveCount(0);
    } else {
      await expect(this.badge, 'Cart badge is visible').toBeVisible();
      await expect(this.badge).toHaveText(String(count));
    }
  }
}
