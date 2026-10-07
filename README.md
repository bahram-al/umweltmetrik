# UmweltMetrik bilingual React website

Run npm ci, npm run dev, npm run build, npm run preview and npm test.

Six React Router HashRouter pages: /, /services, /quality, /laboratories, /about and /contact. Public URLs use #/services, with service anchors such as #/services#soil. Hash routing supports refresh on GitHub Pages without rewrites. Each route updates its title and description; independent search indexing of hash routes is not guaranteed.

German remains default. LanguageContext stores explicit selections under umweltmetrik-language. Changing language preserves route, form values and scroll. Translations and route metadata are centralized in src/i18n/translations.js. Shared services are defined in src/serviceData.js.

The contact endpoint remains https://umweltmetrik-contact.alibahramali.workers.dev. JSON fields remain company, name, email, phone, place, service, message and website. Stable service values, honeypot, JSON POST, validation, loading, success reset and error retention are preserved. Reply-To and Resend remain backend responsibilities. No frontend API keys are added.

The existing GitHub Actions workflow, Vite configuration, public/CNAME, Cloudflare Worker and DNS configuration are unchanged. Build output includes CNAME. No deployment was performed.

Production build and 12 Playwright tests pass. All routes are checked in both languages at 1440/1024/768/390px, including metadata, reload, active navigation, overflow, mobile menu, keyboard Escape, persistence, scroll and anchors. Contact tests verify payload and success/error handling using intercepted responses; they do not send real email or establish live Worker/Resend delivery. A remote GitHub Actions run was not performed. Tests use /usr/bin/chromium as configured in playwright.config.js.

The supplied prototype/legal review notice remains. The unconfigured phone placeholder is omitted from rendered contact details.
