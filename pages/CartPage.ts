import { expect, type Page } from '@playwright/test';
import { LineItems } from '../components/LineItems';

export class CartPage {
  readonly items: LineItems;

  constructor(private readonly page: Page) {
    this.items = new LineItems(page);
  }

  async expectReady(): Promise<void> {
    await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
    await expect(this.page.getByTestId('cart-list')).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout', exact: true }).click();
  }
}
