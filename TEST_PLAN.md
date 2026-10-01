# Test plan

Application: https://www.saucedemo.com/. Scope: A1–A6 automated in Chromium; A7 explored with `problem_user`. “Automated” means implemented coverage, not that every historical execution passed.

| ID | Purpose | Risk | Expected result / verification | Automation status |
|---|---|---|---|---|
| A1 | Successful login | Login succeeds without usable products | Standard-user login reaches the inventory page and a nonempty visible product list with visible names and prices | Automated: `tests/auth.spec.ts` |
| A2 | Rejected login | Hidden error or authenticated access after rejection | Visible locked-out error and login form; no inventory; direct inventory navigation is denied visibly | Automated: `tests/auth.spec.ts` |
| A3 | Price sorting | Lexical sorting or missing/changed prices | Every displayed price equals the corresponding value in a numerically sorted copy of the original list; product count and duplicate prices remain intact | Automated: `tests/inventory.spec.ts` |
| A4 | Cart behavior | Wrong products, changed prices, quantities or badge | Capture Backpack/Bike Light inventory prices before adding; visible badge 2; exactly those rows with matching captured prices, quantity 1 and visible fields | Automated: `tests/cart.spec.ts` |
| A5 | Checkout | Changed prices, incorrect subtotal/final-total arithmetic or incomplete order | Independent inventory-price capture and cart setup; overview items match; subtotal equals sum of captured prices; visible tax parses as nonnegative money; final total equals subtotal plus displayed tax; visible completion message | Automated: `tests/checkout.spec.ts`; tax-rate and rounding-policy correctness unverified without a supplied rule |
| A6 | Logout and isolation | Session remains usable or state leaks between tests | Fresh context and verified clean baseline for every test; logout shows login; direct inventory access is denied | Automated: `tests/auth.spec.ts`, `fixtures/test.ts` |
| A7 | Explore removal with problem_user | Inventory button, badge and actual cart disagree | Remove Backpack, observe bounded transition and actual cart; repeat with fresh sessions and compare standard_user | Explored and reported: `BUG_REPORT.md`; manual steps retained |

## Data and assumptions

Public demo accounts are `standard_user`, `locked_out_user` and `problem_user`, password `secret_sauce`. Selected products are Backpack and Bike Light; each test reads their current inventory prices before adding them. Customer data is fictitious: Alex Tester, postal code 12345. No tax rate is assumed: tax is read from checkout for the final-total arithmetic check. A wrong tax amount accompanied by a consistent final total can pass; authoritative tax-rate and rounding rules are needed to verify that missing part of A5. Inventory prices are the consistency baseline, not an independent catalog-pricing oracle. Sorting requires at least two prices, uses DOM order and does not assume a catalog size. Equal-price items need no tie order.

## Execution and evidence

Follow the README setup, then run `npm test`, `npm test -- --repeat-each=3` and `npm run test:headed`. Every test receives a new browser context and verifies blank login fields with no inventory. Authenticated setup only logs in and waits for inventory; each scenario performs its own required actions. There are no shared mutable sessions or retries. Headless execution uses three workers; headed uses one.

Inspect the HTML report, screenshots and traces on failure. CI preserves each stage separately. A7's report records the date, environment and observed results. A previous intermittent A6 hidden-menu failure and historical headed timeouts remain disclosed in README; passing another run does not establish a fix.

Out of scope: additional browsers, mobile layouts, accessibility certification, backend authorization, broader negative checkout cases and real payment processing.
