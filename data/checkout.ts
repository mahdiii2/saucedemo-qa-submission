export interface Customer {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

export const customer: Customer = {
  firstName: 'Alex',
  lastName: 'Tester',
  postalCode: '12345',
};
