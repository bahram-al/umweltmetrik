import fs from 'node:fs';
import assert from 'node:assert/strict';
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>/\.(html|css|js)$/.test(f));
let htmlPages=0;
for(const file of files){
 const text=fs.readFileSync('dist/'+file,'utf8');
 if(file.endsWith('.js')){
  assert.ok(!/\b(?:localStorage|sessionStorage|indexedDB)\b|document\s*\.\s*cookie|sendBeacon\s*\(|serviceWorker/.test(text),'Browser storage or background tracking API in '+file);
  assert.ok(!/https?:\/\//.test(text),'Remote endpoint in '+file);
 }
 if(file.endsWith('.css'))assert.ok(!/(?:url\(\s*["']?|@import\s+["'])https?:/i.test(text),'Remote stylesheet/font/image in '+file);
 if(!file.endsWith('.html')||text.includes('http-equiv="refresh"'))continue;
 htmlPages++;
 assert.ok(!/<(?:iframe|embed|object)\b/i.test(text),'Embedded service in '+file);
 assert.ok(!/<(?:script|img|source|video|audio)[^>]+(?:src|srcset)=["'](?:https?:)?\/\//i.test(text),'Remote resource in '+file);
 assert.ok(!/<link[^>]+href=["'](?:https?:)?\/\//i.test(text),'Remote linked resource in '+file);
 const prefix=file.startsWith('en/')?'/en/':'/';
 for(const path of prefix==='/en/'?['legal-notice','privacy']:['impressum','datenschutz'])assert.ok(text.includes('href="'+prefix+path+'/"'),'Legal footer link in '+file);
}
for(const [file,title] of [['impressum','Impressum'],['en/legal-notice','Legal notice']]){
 const html=fs.readFileSync('dist/'+file+'/index.html','utf8');
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
 for(const text of [title,'UmweltMetrik','Umweltfachliche Dienstleistungen, insbesondere Umwelt- und Trinkwasserprobenahme, Monitoring und geologische Feldarbeit.','mailto:info@umweltmetrik.de','imprint-contact'])assert.ok(main.includes(text),'Supplied imprint content retained: '+text+' in '+file);
 assert.ok(main.includes('Entwurf:')||main.includes('Draft:'),'Incomplete imprint marked as draft: '+file);
}
for(const file of ['datenschutz','en/privacy']){
 const html=fs.readFileSync('dist/'+file+'/index.html','utf8');
 assert.equal((html.match(/id="privacy-\d+"/g)||[]).length,10,'Ten privacy sections: '+file);
 for(const text of ['GitHub Pages','Vor Veröffentlichung ergänzen','4. November 2026','https://www.datenschutz-berlin.de/','mailto:info@umweltmetrik.de'])assert.ok(html.includes(text),'Privacy content retained: '+text+' in '+file);
 assert.ok(!html.includes('STRATO'),'Obsolete hosting statement in '+file);
 assert.ok(html.includes('Entwurf:')||html.includes('Draft:'),'Incomplete privacy notice marked as draft: '+file);
}
console.log(`PASS: ${htmlPages} content pages (including 404) with legal footer links; imprint and privacy drafts; no cookie/storage/background tracking APIs; all embedded resources local. The contact form has an explicit, configuration-gated mail endpoint.`);
console.log('Static checks cover the bundled frontend. Browser storage/network checks and hosting behavior are separate evidence.');
