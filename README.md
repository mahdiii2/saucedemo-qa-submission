# SauceDemo QA assignment

Six TypeScript and Playwright tests cover A1–A6 in Chromium. [TEST_PLAN.md](TEST_PLAN.md) lists the scenarios. [BUG_REPORT.md](BUG_REPORT.md) documents the A7 exploratory check.

## Setup and run

Install Node.js 24 with npm. Internet access is required. From the project folder, run:

```bash
npm ci
npx playwright install --with-deps
npm test
npx playwright show-report
```

Linux browser dependency installation may require administrator access. If PowerShell blocks npm scripts, use `npm.cmd` and `npx.cmd` for the same commands.

Other commands:

```bash
npm run test:headed          # Run with a visible browser
npm run typecheck            # Check TypeScript
npm run report               # Open the HTML report
npm test -- --grep "A4:"     # Run one scenario
npm test -- --repeat-each=3   # Run each scenario three times
```

Headed mode needs a display. On Linux CI, use `xvfb-run -a npm run test:headed`.

## Project structure

```text
tests/                  Test scenarios
pages/                  Page interactions
components/             Shared header and item checks
fixtures/               Test setup and page objects
data/                   Accounts, product names and customer data
helpers/                Money parsing
playwright.config.ts    Browser, URL, timeouts and report settings
.github/                CI workflow
```

## How the tests work

- Each test starts in a fresh browser session and checks the blank login page. Tests set up their own login and cart state.
- Cart and checkout tests capture inventory prices before adding products, then check those prices on later pages. Amounts are compared in cents.
- Sorting compares every displayed price with a numerically sorted copy of the original list.
- Locators use roles, text and `data-test` attributes. Playwright assertions handle waiting; there are no fixed sleeps.
- Normal runs use three workers; headed runs use one. Retries are disabled.

## Reports and limitations

The HTML report is saved in `playwright-report/`. Failed tests retain screenshots and traces in `test-results/`. These folders and `node_modules` are excluded from Git. The CI workflow installs dependencies, checks types, runs the suite and saves the results.

- Inventory prices are the baseline for cart and checkout comparisons; the tests do not verify the original catalog pricing.
- No tax rule was supplied. A5 checks the displayed tax format and verifies `total = subtotal + displayed tax`. It does not verify the tax rate or rounding policy.
- Money parsing assumes USD with two decimals. Coverage is limited to Chromium and the standard desktop layout.
- Earlier runs encountered an intermittent logout-menu issue and Windows headed timeouts. These remain unresolved.
