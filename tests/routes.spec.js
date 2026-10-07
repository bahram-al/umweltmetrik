import {test,expect} from '@playwright/test';
import {translations} from '../src/i18n/translations.js';
const routes=['/','/services','/quality','/laboratories','/about','/contact'];
for(const width of [1440,1024,768,390]) test(`all routes and languages at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 for(const language of ['de','en']){
  if(language==='en'){
   if(width<=1100)await page.locator('#menu').click();
   await page.locator(width<=1100?'#mobile':'.links').getByRole('button',{name:translations.de.language.en}).click();
  }
  for(const path of routes){
   await page.goto('/#'+path);
   await expect(page.locator('html')).toHaveAttribute('lang',language);
   await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
   const seo=translations[language].routes[path.slice(1)] || translations[language].seo;
   await expect(page).toHaveTitle(seo.title);
   await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',seo.description);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const text=await page.locator('main').innerText();expect(text).not.toContain('undefined');
   const other=language==='en'?'de':'en';
   for(const section of ['nav','hero','leistungen','qualitaet','labore','ueber_mich','kontakt'])for(const [key,value] of Object.entries(translations[other][section])){
    if(value!==translations[language][section][key] && value.length>24)expect(text).not.toContain(value);
   }
   await page.reload();await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
   if(path!=='/' && path!=='/contact'){
    if(width<=1100)await page.locator('#menu').click();
    await expect(page.locator(width<=1100?'#mobile':'.links').locator(`a[href="#${path}"]`)).toHaveAttribute('aria-current','page');
    if(width<=1100){await page.keyboard.press('Escape');await expect(page.locator('#mobile')).toBeHidden();}
   }
  }
 }
 expect(errors).toEqual([]);
});
test('route navigation closes mobile menu and language preserves route and scroll',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('#menu').click();
 await page.locator('#mobile a[href="#/services"]').click();await expect(page).toHaveURL(/#\/services$/);await expect(page.locator('#mobile')).toBeHidden();
 await page.evaluate(()=>window.scrollTo(0,600));await page.locator('#menu').click();const before=await page.evaluate(()=>scrollY);
 await page.locator('#mobile').getByRole('button',{name:translations.de.language.en}).click();await expect(page).toHaveURL(/#\/services$/);expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(100);
 await page.goto('/#/services#soil');await expect(page.locator('#soil')).toBeInViewport();
});
