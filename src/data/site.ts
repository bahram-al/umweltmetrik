import original from './content.json';
import legacy from './original-pages.json';
export type Lang = 'de' | 'en';
export type Page = 'home' | 'services' | 'knowledge' | 'quality' | 'labs' | 'about' | 'contact' | 'credits' | 'imprint' | 'privacy';
export const order = ['drinking','groundwater','soil','cooling','wastewater','waste','surface','field'] as const;
export type ServiceId = typeof order[number];
export const {SERVICES: services, I: text, SOURCES: sources, LISTED_WORK: listedWork} = original;
export const originalPages = legacy;
export const routes: Record<Page,[string,string]> = {home:['',''],services:['leistungen','services'],knowledge:['fachwissen','knowledge'],quality:['qualitaet','quality'],labs:['labore','laboratories'],about:['ueber-mich','about'],contact:['kontakt','contact'],credits:['bildquellen','image-credits'],imprint:['impressum','legal-notice'],privacy:['datenschutz','privacy']};
export const names: Record<Page,[string,string]> = {home:['Startseite','Home'],services:['Leistungen','Services'],knowledge:['Fachwissen','Knowledge'],quality:['Qualität','Quality'],labs:['Für Labore','For laboratories'],about:['Über mich','About'],contact:['Kontakt','Contact'],credits:['Bildquellen','Image credits'],imprint:['Impressum','Legal notice'],privacy:['Datenschutz','Privacy']};
export const href = (page: Page, lang: Lang, id?: string) => {
 const destination = page === 'knowledge' ? 'services' : page;
 return (lang==='en'?'/en/':'/')+routes[destination][lang==='en'?1:0]+(id?'/'+id:'')+(destination==='home'?'':'/');
};
export const label = (page:Page,lang:Lang) => names[page][lang==='en'?1:0];
