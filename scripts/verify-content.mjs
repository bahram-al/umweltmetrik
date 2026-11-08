import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {qualitySources} from '../src/data/quality-sources.ts';
const data=JSON.parse(fs.readFileSync('src/data/content.json','utf8'));
const old=JSON.parse(fs.readFileSync('src/data/original-pages.json','utf8'));
const hashes=JSON.parse(fs.readFileSync('reference/image-hashes.json','utf8'));
const photos=JSON.parse(fs.readFileSync('src/data/photos.json','utf8'));
const workflowPhotos=JSON.parse(fs.readFileSync('src/data/workflow-photos.json','utf8'));
for(const photo of Object.values(workflowPhotos))for(const folder of ['public','dist'])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(folder+'/images/'+photo.filename)).digest('hex'),photo.sha256,'Supplied workflow photo bytes retained');
const htmlText=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const results=[];
for(const filename of Object.keys(hashes.assets)){
 assert.ok(!fs.existsSync('public/images/'+filename)&&!fs.existsSync('dist/images/'+filename),'AI image excluded from public and build: '+filename);
 results.push('AI original excluded from website: '+filename);
}
assert.equal(Object.keys(photos).length,9);
for(const [id,photo] of Object.entries(photos)){
 for(const folder of ['public','dist'])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(folder+'/images/'+photo.filename)).digest('hex'),photo.sha256);
 assert.ok(!Object.values(hashes.assets).includes(photo.sha256),'Replacement differs from AI originals');
 for(const key of ['author','license','evidence'])assert.ok(photo[key],'Provenance present: '+id+'/'+key);
 for(const lang of ['de','en']){
  const html=fs.readFileSync(lang==='de'?'dist/bildquellen/index.html':'dist/en/image-credits/index.html','utf8');
  assert.ok(html.includes(photo.filename)&&(!photo.sourceUrl||html.includes(photo.sourceUrl.replaceAll('&','&amp;')))&&htmlText(html).includes(photo.author),'Credit for '+id+'/'+lang);
 }
 results.push('Real photograph and bilingual source credit verified: '+id);
}
for(const lang of ['de','en']){
 const prefix=lang==='de'?'dist/':'dist/en/';
 for(const [id,service] of Object.entries(data.SERVICES)){
  const path=prefix+(lang==='de'?'leistungen/':'services/')+id+'/index.html';
  const html=fs.readFileSync(path,'utf8'),rendered=htmlText(html);
  for(const key of ['summary','intro'])assert.ok(rendered.includes(service[key][lang]),`${lang}/${id}/${key}`);
  for(const key of ['scope','params','freq','faq'])for(const row of service[key][lang])for(const cell of row)assert.ok(rendered.includes(cell.replace(/\s+/g,' ')),`${lang}/${id}/${key}: ${cell}`);
  for(const rule of service.rules)assert.ok(rendered.includes(rule[0])&&rendered.includes(rule[1]),`${lang}/${id}/rule`);
  results.push('Full technical content retained: '+lang+'/'+id);
 }
 const homepage=fs.readFileSync(prefix+'index.html','utf8');
 assert.equal((homepage.match(/<img\b/gi)||[]).length,6,'Homepage hero and five supplied workflow photographs: '+lang);
 for(const photo of Object.values(workflowPhotos))assert.ok(homepage.includes('/images/'+photo.filename),'Supplied photograph used in workflow: '+photo.filename+'/'+lang);
 assert.ok(!homepage.includes('home-image-placeholder'),'No workflow placeholders remain: '+lang);
 const credits=fs.readFileSync(prefix+(lang==='de'?'bildquellen/':'image-credits/')+'index.html','utf8');
 assert.ok(credits.includes(workflowPhotos.handover.source.url)&&credits.includes('U.S. Geological Survey'),'USGS credit and supplied link: '+lang);
 assert.ok(homepage.includes('class="landscape-image"')&&homepage.includes('/images/river-landscape.jpg'),'Original hero photograph retained: '+lang);
 const quality=fs.readFileSync(prefix+(lang==='de'?'qualitaet/':'quality/')+'index.html','utf8');
 for(const group of qualitySources)for(const entry of group.entries){
  assert.ok(htmlText(quality).includes(entry.title),'Named quality reference present: '+entry.title+'/'+lang);
  for(const link of entry.links)assert.ok(quality.includes(link.url),'Official source linked: '+entry.title+'/'+lang);
 }
 const laboratories=fs.readFileSync(prefix+(lang==='de'?'labore/':'laboratories/')+'index.html','utf8');
 assert.ok(laboratories.includes('/images/'+workflowPhotos.planning.filename)&&!laboratories.includes('home-image-placeholder'),'Supplied sample-bottle photograph used for laboratories: '+lang);
 const contact=htmlText(fs.readFileSync(prefix+(lang==='de'?'kontakt/':'contact/')+'index.html','utf8'));
 // Validate each original content block independently so accessible field reordering is allowed.
 for(const block of old[lang].contact.matchAll(/<(h[12]|p|label|option|button)\b[^>]*>([\s\S]*?)<\/\1>/g)){
  if (/for="f-name"|class="form-note"/.test(block[0])) continue; // Requested removal and current delivery/privacy copy.
  const value=htmlText(block[2].replace(/[↗→←]/g,''));
  if(value)assert.ok(contact.includes(value),'Contact copy retained: '+lang+': '+value);
 }
 const contactHTML=fs.readFileSync(prefix+(lang==='de'?'kontakt/':'contact/')+'index.html','utf8');
 assert.ok(!/id="f-name"|name="name"/.test(contactHTML),'No contact-person field: '+lang);
 assert.ok(contactHTML.includes('data-contact-endpoint="https://umweltmetrik-contact.alibahramali.workers.dev"'),'Fixed contact endpoint: '+lang);
}
for(const file of ['dist/index.html','dist/ueber-mich/index.html','dist/leistungen/index.html']){const html=fs.readFileSync(file,'utf8');assert.ok(!html.includes('Projekt besprechen'));assert.ok(!html.includes('Bildquelle:'));}
const js=fs.readdirSync('dist/_astro').filter(x=>x.endsWith('.js')).map(x=>fs.readFileSync('dist/_astro/'+x,'utf8')).join('\n');
assert.ok(!/RESEND_API_KEY|Bearer re_/.test(js),'No mail-provider secrets in browser code');
console.log(results.join('\n'));console.log('PASS: nine AI originals excluded; nine real photographs with bilingual credits, all sixteen DE/EN chapters, contact copy with requested field removal, fixed mail endpoint and no mail-provider secrets in the browser.');
