import { test, expect } from '../fixtures/test';
import { users } from '../data/users';

test('A1: standard user can log in and view the product inventory', async ({ loginPage, inventoryPage }) => {
  await loginPage.login(users.standard);
  await inventoryPage.expectReady();
  await inventoryPage.expectCatalogVisible();
});

test('A2: locked-out user sees an error and cannot access inventory', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.login(users.lockedOut);
  await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
  await loginPage.expectVisible();
  await expect(page.getByTestId('inventory-list')).toHaveCount(0);

  await inventoryPage.goto();
  await loginPage.expectVisible();
  await expect(page.getByTestId('inventory-list')).toHaveCount(0);
  await loginPage.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
});

test('A6: logout returns to login and blocks direct inventory access', async ({ page, loginPage, authenticatedInventory: inventoryPage }) => {
  await inventoryPage.header.logout();
  await loginPage.expectVisible();
  await expect(page.getByTestId('inventory-list')).toHaveCount(0);

  await inventoryPage.goto();
  await loginPage.expectVisible();
  await expect(page.getByTestId('inventory-list')).toHaveCount(0);
  await loginPage.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
});
