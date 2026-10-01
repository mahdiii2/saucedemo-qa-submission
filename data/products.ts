export interface Product {
  readonly name: string;
  readonly priceCents: number;
}

// A4 requires two specific products. Their prices are captured from inventory.
export const selectedProductNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;
