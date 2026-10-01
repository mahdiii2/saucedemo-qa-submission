import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const output = 'ci-evidence/report-ui';
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, [
  'node_modules/@playwright/test/cli.js', 'show-report',
  'ci-evidence/04-core/playwright-report', '--host=127.0.0.1', '--port=9323',
], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '';
let serverError;
server.on('error', error => { serverError = error; });
server.stdout.on('data', data => { serverLog += data; });
server.stderr.on('data', data => { serverLog += data; });
let browser;
try {
  await expect.poll(async () => {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Report server exited ${server.exitCode}`);
    try { return (await fetch('http://127.0.0.1:9323', { signal: AbortSignal.timeout(2000) })).status; }
    catch { return 0; }
  }, { timeout: 30000 }).toBe(200);
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:9323');
  await expect(page.getByText('A1: standard user can log in and view the product inventory', { exact: true })).toBeVisible();
  await page.screenshot({ path: `${output}/report.png`, fullPage: true });
  await writeFile(`${output}/result.json`, JSON.stringify({ reportHttpStatus: 200, coreScenarioRendered: true }, null, 2));
  console.log('HTML report server returned HTTP 200 and rendered the A1 core scenario.');
} finally {
  try { await browser?.close(); }
  finally {
    server.kill();
    await writeFile(`${output}/server.log`, serverLog);
  }
}
