Aktualisiere bitte den bestehenden Cloudflare-Worker für das Kontaktformular von UmweltMetrik auf die neue E-Mail-Gestaltung.

Repository: https://github.com/bahram-al/umweltmetrik
Branch: main
Worker: umweltmetrik-contact
Bestehende URL: https://umweltmetrik-contact.alibahramali.workers.dev
Erwartete neue Health-Version: contact-v3-branded

Die Website ist bereits veröffentlicht. Nach erfolgreichem Versand ersetzt sie das Formular durch eine Bestätigung. Du sollst ausschließlich die vorbereitete Worker-Aktualisierung veröffentlichen, damit die interne Anfrage und die automatische Bestätigung mit UmweltMetrik-Logo, Petrol und Grün verschickt werden. Baue kein neues System.

1. Prüfe das lokale Repository und Git-Änderungen. Sichere vorhandene Änderungen und hole main, ohne fremde Arbeit zu überschreiben. Lies cloudflare/README.md, cloudflare/worker.mjs, cloudflare/email-template.mjs und cloudflare/wrangler.jsonc. Falls noch kein Checkout besteht, klone das oben genannte Repository.
2. Führe `node --test cloudflare/worker.test.mjs` aus. Alle Tests müssen bestehen. Prüfe, dass die neue Logo-Datei unter https://umweltmetrik.de/images/umweltmetrik-mail-logo.png erreichbar ist. Keine echten Anfragen für reine Layouttests senden.
3. Nutze die vorhandene Cloudflare-Anmeldung. Falls nötig, starte `npx wrangler@4.157.0 login` und lass mich selbst im Browser anmelden. Gib niemals API-Schlüssel, Tokens oder geheime Werte aus und speichere sie nicht im Repository.
4. Stelle mit `npx wrangler@4.157.0 whoami` sicher, dass es das Konto des vorhandenen Workers ist. Sichere dessen aktuelle Quelltexte, Versions- und Einstellungsmetadaten außerhalb des Repositorys für einen Rollback. Prüfe die bestehenden Bindings; secret-Werte weder abrufen noch ausgeben. Wenn der Live-Worker neuere, abweichende Änderungen hat, gleiche sie zuerst ab, statt sie zu überschreiben.
5. Prüfe das Paket mit `npx wrangler@4.157.0 deploy --dry-run --config cloudflare/wrangler.jsonc`. Veröffentliche danach aus dem Repository-Root mit `npx wrangler@4.157.0 deploy --config cloudflare/wrangler.jsonc --keep-vars`. Wichtig: `email-template.mjs` wird importiert, also den vollständigen Worker mit Wrangler deployen, nicht nur worker.mjs in einen Online-Editor kopieren.
6. Erhalte RESEND_API_KEY, CONTACT_GATEWAY / ContactGateway, die vorhandene Migration contact-v2, den Durable-Object-Zustand, Absender/Empfänger, Origin-Allowlist, Limits, Reply-To und Idempotenz. Keine DNS-, Tarif- oder Domainänderung; kein neuer Worker; keine Secrets ins Frontend. Kein Öffnungs-/Klicktracking aktivieren. Der Versand bleibt ein Batch mit genau zwei Mails und Textalternativen. Die Bestätigung enthält keine vom Besucher eingegebenen Inhalte.
7. Prüfe /health: version contact-v3-branded, configured true. Das beweist nur die Konfiguration. Für einen echten Zustelltest frage mich nach einer eigenen freigegebenen Testadresse. Weise darauf hin, dass die markierte Testanfrage zusätzlich an info@umweltmetrik.de geht. Prüfe anschließend bei Resend oder in beiden Postfächern die Zustellung, das Logo, das Design und Reply-To. Akzeptanz durch die API allein nicht als Zustellung bezeichnen. Falls der Bestätigungstest fehlschlägt, Ursache beheben oder auf die gesicherte Worker-Version zurückrollen; keine unnötigen mehrfachen Testmails senden.
8. Berichte am Ende knapp, welche Worker-Version jetzt aktiv ist, ob beide Mails zugestellt wurden und welche tatsächlichen Prüfungen noch offen sind. Veröffentliche keine anderen Website-Änderungen.
