import { test, expect } from '@playwright/test';
import { translations } from '../src/i18n/translations.js';
const key = 'umweltmetrik-privacy';
const notice = page => page.getByRole('region', { name: /Datenschutz & Browser-Speicher|Privacy & Browser Storage/ });
async function acknowledge(page, language = 'de') {
  await notice(page).getByRole('button', { name: translations[language].privacy.acknowledge }).click();
  await expect(notice(page)).toHaveCount(0);
}
async function settings(page, language = 'de') {
  const button = page.locator('footer').getByRole('button', { name: translations[language].privacy.settings, exact: true });
  await button.click();
  await expect(notice(page)).toBeVisible();
  await expect(notice(page).locator('h2')).toBeFocused();
  await expect(notice(page).locator('details')).toHaveAttribute('open', '');
  return button;
}

test('first visit is informational; browsing never acknowledges; repeat visit and reopening', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(notice(page)).toBeVisible();
  await expect(notice(page).getByRole('button')).toHaveText(translations.de.privacy.acknowledge);
  await expect(notice(page).getByRole('checkbox')).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await page.locator('.links a[href="#/services"]').click();
  await expect(notice(page)).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await page.reload();
  await expect(notice(page)).toBeVisible();
  await acknowledge(page);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual({ version: 1, acknowledged: true });
  await page.locator('.links a[href="#/quality"]').click();
  await expect(notice(page)).toHaveCount(0);
  await page.reload();
  await expect(notice(page)).toHaveCount(0);
  const trigger = await settings(page);
  await expect(notice(page)).toContainText('umweltmetrik-language');
  await expect(notice(page)).toContainText(key);
  await page.keyboard.press('Escape');
  await expect(notice(page)).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await settings(page);
  await acknowledge(page);
  await expect(trigger).toBeFocused();
});

for (const width of [1440, 375]) test(`German/English language persistence and keyboard layout at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 812 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  if (width <= 1100) await page.locator('#menu').click();
  await page.locator(width <= 1100 ? '#mobile' : '.links').getByRole('button', { name: translations.de.language.en }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(notice(page)).toContainText(translations.en.privacy.summary);
  await notice(page).locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(notice(page).locator('details')).toHaveAttribute('open', '');
  await expect(notice(page)).toContainText(translations.en.privacy.storage);
  await expect(notice(page)).toContainText(translations.en.privacy.review);
  const box = await notice(page).boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(notice(page).getByRole('button')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(notice(page)).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(notice(page)).toHaveCount(0);
  const trigger = await settings(page, 'en');
  await page.keyboard.press('Tab');
  await expect(notice(page).locator('summary')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  if (width <= 1100) await page.locator('#menu').click();
  await page.locator(width <= 1100 ? '#mobile' : '.links').getByRole('button', { name: translations.en.language.de }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await settings(page);
});

for (const record of ['broken-json', '{"version":0,"acknowledged":true}', '{"version":1,"acknowledged":false}']) test(`invalid or outdated record displays notice: ${record}`, async ({ page }) => {
  await page.addInitScript(({ key, record }) => localStorage.setItem(key, record), { key, record });
  await page.goto('/');
  await expect(notice(page)).toBeVisible();
  await acknowledge(page);
});

test('storage denied: acknowledgment and language work in memory without page errors', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await acknowledge(page);
  await page.locator('.links').getByRole('button', { name: translations.de.language.en }).click();
  await page.locator('.links a[href="#/contact"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(notice(page)).toHaveCount(0);
  await settings(page, 'en');
  await acknowledge(page, 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(notice(page)).toBeVisible();
  expect(errors).toEqual([]);
});

test('no optional technologies or cookies; contact request occurs only on submission', async ({ page, context }) => {
  const externalRequests = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:5173') externalRequests.push(request.url());
  });
  const endpoint = 'https://umweltmetrik-contact.alibahramali.workers.dev';
  let payload;
  await page.route(endpoint, route => {
    payload = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.goto('/#/contact');
  await expect(notice(page)).toBeVisible();
  await page.locator('#name').fill('Privacy Test');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('Test enquiry');
  expect(externalRequests).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual({ local: [], session: [] });
  await expect(page.locator('script[src]')).toHaveCount(2); // Vite client and same-origin app module.
  for (const src of await page.locator('script[src]').evaluateAll(elements => elements.map(el => el.src))) expect(new URL(src).origin).toBe('http://127.0.0.1:5173');
  // Essential form works without acknowledging the notice.
  await page.locator('#submit-button').click();
  await expect(page.locator('#form-status')).toHaveText(translations.de.form.success);
  expect(payload.name).toBe('Privacy Test');
  expect(externalRequests).toEqual([new URL(endpoint).href]);
  await acknowledge(page);
  await settings(page);
  await acknowledge(page);
  expect(externalRequests).toEqual([new URL(endpoint).href]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([key]);
});

test('Escape does not record acknowledgment and browser-data deletion resets both preferences', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeFocused();
  await notice(page).locator('summary').focus();
  await page.keyboard.press('Escape');
  await expect(notice(page)).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await page.locator('.links a[href="#/services"]').click();
  await expect(notice(page)).toHaveCount(0);
  await page.reload();
  await expect(notice(page)).toBeVisible();
  await acknowledge(page);
  await page.locator('.links').getByRole('button', { name: translations.de.language.en }).click();
  await page.evaluate(key => {
    localStorage.removeItem(key);
    localStorage.removeItem('umweltmetrik-language');
  }, key);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(notice(page)).toBeVisible();
});

test('quota failure when writing storage does not interrupt acknowledgment', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
  });
  await page.goto('/');
  await acknowledge(page);
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
  await settings(page);
  await acknowledge(page);
  await page.reload();
  await expect(notice(page)).toBeVisible();
  expect(errors).toEqual([]);
});
