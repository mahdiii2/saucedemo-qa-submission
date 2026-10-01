import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '../data/checkout';
import { LineItems } from '../components/LineItems';
import { parseMoneyCents } from '../helpers/money';

export interface CheckoutTotals {
  readonly subtotalCents: number;
  readonly taxCents: number;
  readonly totalCents: number;
}

export class CheckoutPage {
  readonly items: LineItems;
  readonly confirmation: Locator;

  constructor(private readonly page: Page) {
    this.items = new LineItems(page);
    this.confirmation = page.getByTestId('complete-header');
  }

  async enterCustomer(customer: Customer): Promise<void> {
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information');
    const firstName = this.page.getByTestId('firstName');
    const lastName = this.page.getByTestId('lastName');
    const postalCode = this.page.getByTestId('postalCode');
    await firstName.fill(customer.firstName);
    await lastName.fill(customer.lastName);
    await postalCode.fill(customer.postalCode);
    await expect(firstName).toHaveValue(customer.firstName);
    await expect(lastName).toHaveValue(customer.lastName);
    await expect(postalCode).toHaveValue(customer.postalCode);
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview');
  }

  async expectTotalsVisible(): Promise<void> {
    for (const testId of ['subtotal-label', 'tax-label', 'total-label']) {
      await expect(this.page.getByTestId(testId), 'Checkout totals are visible').toBeVisible();
    }
  }

  async totals(): Promise<CheckoutTotals> {
    return {
      subtotalCents: parseMoneyCents(await this.page.getByTestId('subtotal-label').innerText()),
      taxCents: parseMoneyCents(await this.page.getByTestId('tax-label').innerText()),
      totalCents: parseMoneyCents(await this.page.getByTestId('total-label').innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
  }
}
