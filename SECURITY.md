# Scope of this static website

This Astro project builds static HTML, CSS and browser JavaScript. It has no application server, database, authentication, payments or file uploads. The contact form validates in the browser and does not submit or persist data. Hosting may keep its own access logs; that is separate from frontend storage.

Repository and bundle checks were run offline before publication. The built bundle scan reported no critical findings or warnings. These are limited checks, not a security guarantee or an audit of GitHub accounts, the hosting provider or the historical Cloudflare Worker.

## Reviewed scanner reports

- Missing differential authorization tests: not applicable to this build-only static site, which has no authenticated endpoint or tenant boundary.
- Dynamic href expressions: routes come from fixed application maps; source/license links come from committed image and reference data. There is no user-controlled URL input rendered as an href. Original contact markup is committed reference content, not runtime user HTML.
- Dependency lifecycle scripts: disabled by `.npmrc` and explicitly disabled in CI; clean installation and build were tested in that mode.
- GitHub Actions: pinned to commit SHAs resolved from the official actions repositories.
- Dependency release cooldown: not configured. Dependencies remain locked by package-lock.json; future updates should be reviewed rather than blindly updating the lockfile.

The scanner did not classify the Astro package manifest correctly; package.json and package-lock.json are present and were manually checked. No online vulnerability probe, account/MFA review, DNS change or live contact-endpoint test was performed as part of this upload.

The imprint remains empty. The supplied privacy notice is published as an incomplete German draft on both language routes; its hosting section reflects GitHub Pages and the email-provider placeholder remains visible. Controller and email-provider details still need completion. The test banner remains visible. Activating form delivery, analytics, embeds or a backend requires a separate review and implementation.
