# A7 exploratory check

## BUG-001: Backpack remains in the cart after problem_user clicks Remove

- **Area:** Inventory removal consistency across button, badge and actual cart.
- **Status:** Reproduced on 2026-10-01; the application defect is not fixed by this submission.
- **Environment:** https://www.saucedemo.com/, Ubuntu 24.04.5, Node 24.21.0, Playwright 1.63.0, Chromium 153.0.8010.12.
- **Account:** `problem_user` / `secret_sauce` (public demo credentials).
- **Suggested severity/priority:** Medium / P2, subject to product triage.

## Reproduction steps

1. Start a new private browser session and log in as `problem_user`.
2. Open the cart, confirm there are no product rows, then return to Products.
3. Find **Sauce Labs Backpack**, price **$29.99**, and click **Add to cart**.
4. Confirm **Remove** and cart badge **1**, then click **Remove**.
5. Observe whether the button resets and badge disappears. The recorded automated investigation allowed up to the configured five-second assertion interval for this transition.
6. Open the cart and inspect its actual product rows.
7. Repeat in another new session. Run the same steps with `standard_user` as a control.

**Expected:** Button returns to **Add to cart**, badge disappears and the cart is empty.

**Actual:** For `problem_user`, **Remove** and badge **1** remained, and the cart retained Backpack at **$29.99**, quantity **1**. The standard-user control removed it correctly.

## Recorded evidence

The check was repeated on 2026-10-01 in two fresh problem-user sessions and one standard-user control session:

| Session | Inventory after Remove | Actual cart | Result |
|---|---|---|---|
| problem_user, attempt 1 | Remove; badge 1 | Backpack, $29.99, quantity 1 | Defect reproduced |
| problem_user, attempt 2 | Remove; badge 1 | Backpack, $29.99, quantity 1 | Defect reproduced |
| standard_user, control | Add to cart; no badge | Empty | Expected behavior |

Two screenshots and a trace were recorded per session and are kept separately from this source submission. The steps and observed results above provide the reproduction details.

## Impact and limits

An unwanted retained item could reach checkout, but that consequence was not exercised. The evidence establishes the observed button/badge transition and retained cart during this bounded check; it does not prove indefinite persistence or an internal root cause. This report covers Backpack removal, not all problem-user behavior. After an application fix, repeat the same steps with both accounts.
