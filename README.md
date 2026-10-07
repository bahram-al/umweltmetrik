# UmweltMetrik bilingual React site

The supplied single-file HTML site has been converted to React without duplicating the page. Its original layout, CSS, section anchors, content and contact payload fields are retained.

## Run and build

- `npm ci`
- `npm run dev`
- `npm run build`
- `npm run preview`

Deploy the contents of `dist/` to the existing static host. The build copies the existing CNAME. Serve the built files, rather than the source index.html. No deployment has been performed.

## Files

Modified: `index.html` (React entry with German SEO defaults).
Added: `src/App.jsx` (existing layout and contact submission), `src/main.jsx`, `src/styles.css` (original CSS plus compact selector and navigation spacing), `src/LanguageSwitcher.jsx`, `src/i18n/LanguageContext.jsx`, `src/i18n/translations.js`, `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore`, `playwright.config.js`, `tests/bilingual.spec.js`, and this README.

German is the default regardless of browser locale. Explicit language selections are saved as `umweltmetrik-language`; storage failures do not prevent switching. HTML language, title, description, validation and status messages follow the selected language. Language selection closes the mobile menu. Contact fields retain entered values during language changes.

The endpoint remains `https://umweltmetrik-contact.alibahramali.workers.dev`; fields remain company, name, email, phone, place, service, message and website. The service field now uses stable internal values. No frontend API keys were added.

## Verification

`npm test` uses Chromium at `/usr/bin/chromium`; adjust the executablePath in playwright.config.js for another machine. Tests cover default German, English switching, persistence, switching back, translated copy/SEO, form validation, contact payload, success/error handling, language changes during a request, and mobile/tablet/desktop layouts at 375/768/1024/1280/1440px.

Contact tests intercept the unchanged endpoint and simulate Worker responses. They do not send real email, and do not establish live Worker email-delivery or backend acceptance of the new service identifiers; the Worker source was not supplied. Existing legal placeholders, phone placeholder and prototype notice remain translated as supplied.
