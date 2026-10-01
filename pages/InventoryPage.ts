import { expect, type Locator, type Page } from '@playwright/test';
import type { Product } from '../data/products';
import { Header } from '../components/Header';
import { parseMoneyCents } from '../helpers/money';

export class InventoryPage {
  readonly header: Header;
  readonly title: Locator;
  readonly products: Locator;
  readonly sort: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.title = page.getByTestId('title');
    this.products = page.getByTestId('inventory-item');
    this.sort = page.getByTestId('product-sort-container');
  }

  product(name: string): Locator {
    return this.products.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html', { waitUntil: 'domcontentloaded' });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.title).toHaveText('Products');
    await expect(this.page.getByTestId('inventory-list')).toBeVisible();
    await expect(this.products.first()).toBeVisible();
  }

  async expectCatalogVisible(): Promise<void> {
    for (const row of await this.products.all()) {
      await expect(row.getByTestId('inventory-item-name'), 'Inventory product names are visible').toBeVisible();
      await expect(row.getByTestId('inventory-item-price'), 'Inventory prices are visible').toBeVisible();
    }
  }

  /** Capture each inventory price before adding, for later cart/checkout checks. */
  async addProducts(names: readonly string[]): Promise<Product[]> {
    const products: Product[] = [];
    for (const name of names) {
      const row = this.product(name);
      await expect(row, `Exactly one inventory product named ${name}`).toHaveCount(1);
      const price = row.getByTestId('inventory-item-price');
      await expect(price).toBeVisible();
      const priceCents = parseMoneyCents(await price.innerText());
      await row.getByRole('button', { name: 'Add to cart', exact: true }).click();
      await expect(row.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
      products.push({ name, priceCents });
    }
    return products;
  }

  async pricesCents(): Promise<number[]> {
    return (await this.products.getByTestId('inventory-item-price').allTextContents()).map(parseMoneyCents);
  }
}
