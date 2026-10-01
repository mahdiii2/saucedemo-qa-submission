import { test } from '../fixtures/test';
import { selectedProductNames } from '../data/products';

test('A4: adding two selected products shows the exact cart names, prices and quantities', async ({ authenticatedInventory: inventory, cartPage }) => {
  const products = await inventory.addProducts(selectedProductNames);
  await inventory.header.expectCartCount(2);
  await inventory.header.openCart();
  await cartPage.expectReady();
  await cartPage.items.expectProducts(products);
});
