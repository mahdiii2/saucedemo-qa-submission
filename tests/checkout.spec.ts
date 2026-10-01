import { test, expect } from '../fixtures/test';
import { selectedProductNames } from '../data/products';
import { customer } from '../data/checkout';

test('A5: checkout preserves inventory prices, adds displayed tax to the subtotal and completes the order', async ({ authenticatedInventory: inventory, cartPage, checkoutPage }) => {
  const products = await inventory.addProducts(selectedProductNames);
  await inventory.header.openCart();
  await cartPage.expectReady();
  await cartPage.checkout();
  await checkoutPage.enterCustomer(customer);
  // These are the items whose subtotal is checked below.
  await checkoutPage.items.expectProducts(products);

  const subtotalCents = products.reduce((sum, product) => sum + product.priceCents, 0);
  await checkoutPage.expectTotalsVisible();
  const totals = await checkoutPage.totals();
  expect(totals.subtotalCents, 'Subtotal matches the captured inventory prices').toBe(subtotalCents);
  // No tax rule was supplied: parse the displayed tax, then verify the addition.
  // This does not independently establish whether the tax rate is correct.
  expect(totals.totalCents, 'Final total equals subtotal plus displayed tax').toBe(subtotalCents + totals.taxCents);

  await checkoutPage.finish();
  await expect(checkoutPage.confirmation, 'Order confirmation is visible').toBeVisible();
  await expect(checkoutPage.confirmation).toHaveText('Thank you for your order!');
});
