import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../data/users';

interface Fixtures {
  cleanStart: void;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedInventory: InventoryPage;
}

export const test = base.extend<Fixtures>({
  // The built-in page/context is created anew per test. Verify that baseline too.
  cleanStart: [async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.expectVisible();
    await expect(login.username).toHaveValue('');
    await expect(login.password).toHaveValue('');
    await expect(page.getByTestId('inventory-list')).toHaveCount(0);
    await use();
  }, { auto: true }],
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  authenticatedInventory: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectReady();
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
