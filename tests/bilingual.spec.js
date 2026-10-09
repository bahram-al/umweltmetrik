import { test, expect } from '@playwright/test';
import { translations } from '../src/i18n/translations.js';
const endpoint = 'https://umweltmetrik-contact.alibahramali.workers.dev';
async function switchTo(page, lang) {
  const desktop = page.locator('.links');
  if (await desktop.isVisible()) await desktop.getByRole('button', { name: lang === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch' }).click();
  else {
    await page.locator('#menu').click();
    await page.locator('#mobile').getByRole('button', { name: lang === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch' }).click();
    await expect(page.locator('#mobile')).toBeHidden();
  }
}
test('German default regardless of browser language; persistence and all copy', async ({ page }) => {
  const errors=[];page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await switchTo(page,'en');
  await expect(page).toHaveTitle(translations.en.seo.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', translations.en.seo.description);
  // Every original translatable phrase must disappear from text and UI attributes.
  const texts = await page.locator('body').innerText();
  for (const section of Object.keys(translations.de)) for (const key of Object.keys(translations.de[section])) {
    const de=translations.de[section][key], en=translations.en[section][key];
    if (de !== en && de.length>12) expect(texts).not.toContain(de);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('heading',{level:1})).toHaveText(translations.en.hero.reliableSamplingStartsBeforeAnalysis);
  await switchTo(page,'de');
  await expect(page).toHaveTitle(translations.de.seo.title);
  await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','de');
  expect(errors).toEqual([]);
});
for (const width of [375,768,1024,1280,1440]) test(`language controls and layout at ${width}px`,async ({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  for(const lang of ['en','de']) {
    await switchTo(page,lang);await expect(page.locator('html')).toHaveAttribute('lang',lang);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width>1100) {
      const brand=await page.locator('.brand').boundingBox(),nav=await page.locator('.links').boundingBox();
      expect(brand.x+brand.width).toBeLessThanOrEqual(nav.x);
    }
  }
});
test('form validation, stable payload, success, errors and switching mid-request',async ({page})=>{
  await page.goto('/#/contact');await switchTo(page,'en');
  await page.locator('#submit-button').click();
  expect(await page.locator('#email').evaluate(el=>el.validationMessage)).toBe(translations.en.form.required);
  await page.locator('#email').fill('invalid');
  await page.locator('#submit-button').click();
  expect(await page.locator('#email').evaluate(el=>el.validationMessage)).toBe(translations.en.form.emailInvalid);
  await page.locator('#email').fill('test@example.com');
  await page.locator('#submit-button').click();
  expect(await page.locator('#message').evaluate(el=>el.validationMessage)).toBe(translations.en.form.required);
  await page.locator('#message').fill('Automated test');
  await page.locator('#service').selectOption('groundwater');
  let payload, finish;
  await page.route(endpoint,async route=>{
    payload=route.request().postDataJSON();await new Promise(resolve=>finish=resolve);
    await route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'});
  });
  await page.locator('#submit-button').click();await expect(page.locator('#submit-button')).toBeDisabled();
  await switchTo(page,'de');await expect(page.locator('#submit-button')).toHaveText(translations.de.form.sending);
  finish();await expect(page.locator('#form-status')).toHaveText(translations.de.form.success);
  expect(Object.keys(payload).sort()).toEqual(['company','email','phone','place','service','message','website'].sort());
  expect(payload.service).toBe('groundwater');await expect(page.locator('#email')).toHaveValue('');
  await switchTo(page,'en');await expect(page.locator('#form-status')).toHaveText(translations.en.form.success);
  await page.unroute(endpoint);await page.route(endpoint,route=>route.fulfill({status:500,body:'{"error":"German backend error"}'}));
  await page.locator('#email').fill('test@example.com');await page.locator('#message').fill('Retain this');
  await page.locator('#submit-button').click();await expect(page.locator('#form-status')).toHaveText(translations.en.form.error);
  await expect(page.locator('#message')).toHaveValue('Retain this');
});

for (const width of [375, 768, 1024, 1280, 1440]) test(`navbar logo and contact layout at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/#/contact');
  for (const lang of ['de', 'en']) {
    if (lang === 'en') await switchTo(page, lang);
    const logo = page.getByRole('img', { name: 'UmweltMetrik', exact: true });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', '/images/UmweltMetrik-Logo.png');
    await expect(page.locator('.brand')).toHaveAttribute('href', '#/');
    await expect.poll(() => logo.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await logo.evaluate(el => getComputedStyle(el).objectFit)).toBe('contain');
    await expect(page.locator('#contact-form [name="name"]')).toHaveCount(0);
    expect(await page.locator('#contact-form :required').evaluateAll(els => els.map(el => el.name).sort())).toEqual(['email', 'message']);
    const company = await page.locator('#company').boundingBox();
    const email = await page.locator('#email').boundingBox();
    const phone = await page.locator('#phone').boundingBox();
    const place = await page.locator('#place').boundingBox();
    const service = await page.locator('#service').boundingBox();
    if (width > 600) {
      expect(Math.abs(company.y - email.y)).toBeLessThan(1);
      expect(email.x).toBeGreaterThan(company.x + company.width);
      expect(Math.abs(place.y - service.y)).toBeLessThan(1);
      expect(phone.width).toBeGreaterThan(company.width * 1.9);
    } else {
      expect(Math.abs(company.x - email.x)).toBeLessThan(1);
      expect(email.y).toBeGreaterThan(company.y + company.height);
      expect(service.y).toBeGreaterThan(place.y + place.height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.locator('.brand').click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(translations.en.hero.reliableSamplingStartsBeforeAnalysis);
});
