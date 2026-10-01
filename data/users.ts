export interface Credentials {
  readonly username: string;
  readonly password: string;
}

// Public demo credentials supplied in the assignment / displayed by SauceDemo.
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
} as const satisfies Record<string, Credentials>;
