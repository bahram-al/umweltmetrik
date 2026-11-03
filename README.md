# UmweltMetrik — Glass-Hauptversion

Statische, zweisprachige Astro-Website für umweltmetrik.de. Diese Version ersetzt die frühere React-/Version-I-Website. Alle früheren Dateien und die komplette Git-Historie bleiben über den Backup-Branch erhalten:

`codex/backup-before-glass-2026-11-03-22-41-56`

## Lokal starten

Node.js >=22.12.0 und npm >=9.6.5; GitHub Actions verwendet Node.js 24.

```sh
npm ci --ignore-scripts
npm run dev
```

Vorschau: http://127.0.0.1:4325/. Bei belegtem Port: `npm run dev -- --port 4333`.

```sh
npm run check
npm run lint
npm run build
npm run verify:content
npm run verify:privacy
```

`dist/` enthält die fertige Website. `src/` enthält Komponenten, Texte und Interaktionen; `public/` enthält lokale Bilder, Schriften, Lizenzdatei, Favicon und die bestehende CNAME.

## Veröffentlichung

Ein Push auf `main` baut und prüft die Website und veröffentlicht anschließend `dist/` über GitHub Pages. Pull Requests werden nur geprüft und nicht veröffentlicht. Domain und DNS werden dabei nicht neu konfiguriert; `umweltmetrik.de` bleibt in `public/CNAME` erhalten.

## Aktueller Funktionsstand

- Glass-Flächen, originales U-Logo, sticky Navigation, vollständige deutsche/englische Inhalte und neun echte Fotografien.
- Homepage-Auswahl mit gleitender Unterstreichung und dunkler/fetter aktiver Beschriftung; auf dem Handy drei Schritte je Reihe.
- Abschnittslinks auf dem Handy mit kurzem Farbsignal ohne dauerhafte Auswahl, aktuelle Kontaktstruktur und keine Scroll-Einblendungen auf dem Handy.
- Bildquellen und Lizenzen sind im Footer verlinkt, Schriften und Fotos werden selbst gehostet.
- Weiterhin Testversion mit roter Hinweisleiste und leeren Impressums-/Datenschutzseiten.
- Das Kontaktformular validiert lokal und versendet nichts. Der zuvor vorhandene Cloudflare-Worker wird von diesem Frontend nicht aufgerufen. Seine bisherige Quelldatei ist im Backup-Branch erhalten; der externe Dienst selbst wird durch diesen Upload nicht geändert.
- Keine Cookies, Browser-Speicherung oder Trackingdienste im Frontend; Verhalten des Hostings ist getrennt davon zu betrachten.

Die Prüfsummen der früheren KI-Bilder bleiben als Ausschlussliste erhalten. Die alten KI-Dateien und die frühere Website sind nicht Teil des neuen Builds; historische Dateien liegen im Backup-Branch. Private Schlüssel, lokale Abhängigkeiten, Browserprofile und Laptop-Sicherungen werden nicht eingecheckt.

Eine Rückkehr zum vorigen Stand ist über den Backup-Branch bzw. einen Revert des Austausch-Commits möglich. Die Git-Historie wurde nicht umgeschrieben.
