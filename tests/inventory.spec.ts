import { test, expect } from '../fixtures/test';

test('A3: price low-to-high sorting orders all displayed prices numerically', async ({ authenticatedInventory: inventory }) => {
  await inventory.expectCatalogVisible();
  const before = await inventory.pricesCents();
  expect(before.length).toBeGreaterThan(1);
  const ascending = [...before].sort((left, right) => left - right);

  await inventory.sort.selectOption({ label: 'Price (low to high)' });
  await expect(inventory.sort).toHaveValue('lohi');
  await expect(inventory.products).toHaveCount(before.length);
  await inventory.expectCatalogVisible();
  await expect.poll(() => inventory.pricesCents(), {
    message: 'Every product price is sorted numerically, without losing or duplicating a price',
  }).toEqual(ascending);
});
