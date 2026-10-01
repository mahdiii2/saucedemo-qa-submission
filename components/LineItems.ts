import { expect, type Locator, type Page } from '@playwright/test';
import type { Product } from '../data/products';
import { parseMoneyCents } from '../helpers/money';

/** Cart and checkout use the same stable line-item attributes. */
export class LineItems {
  readonly rows: Locator;

  constructor(page: Page) {
    this.rows = page.getByTestId('inventory-item');
  }

  async expectProducts(products: readonly Product[]): Promise<void> {
    await expect(this.rows).toHaveCount(products.length);
    for (const product of products) {
      const row = this.rows.filter({
        has: this.rows.page().getByTestId('inventory-item-name').getByText(product.name, { exact: true }),
      });
      await expect(row, `Exactly one row for ${product.name}`).toHaveCount(1);
      await expect(row.getByTestId('inventory-item-name')).toBeVisible();
      await expect(row.getByTestId('inventory-item-price')).toBeVisible();
      await expect(row.getByTestId('item-quantity')).toBeVisible();
      await expect(row.getByTestId('item-quantity')).toHaveText('1');
      await expect
        .poll(async () => parseMoneyCents(await row.getByTestId('inventory-item-price').innerText()), {
          message: `Price in cents for ${product.name}`,
        })
        .toBe(product.priceCents);
    }
  }
}
