# Publishing and recovery

The `Build and deploy UmweltMetrik Glass` workflow installs the locked dependencies without lifecycle scripts, checks Astro and lint, builds the static website, verifies content and frontend privacy, and deploys `dist/` to the existing GitHub Pages environment. PR runs validate only. Production publishing is limited to `main` or an explicit manual workflow run on `main`.

The existing custom domain `umweltmetrik.de` remains in `public/CNAME`. No registrar, DNS records, mail configuration or external Cloudflare Worker was changed by this replacement.

## Backup before replacement

Original main commit: `9a50620e6a9bfaea0711c1d97f633e2bcea17b02`.

Complete original repository tree on GitHub:

`codex/backup-before-glass-2026-11-03-22-41-56`

A verified Git bundle containing the complete fetched history and all existing refs, plus a tested ZIP of the original tracked files, were also saved locally before replacing files. No history was rewritten and no force push was used.

For rollback, inspect the backup branch or revert the replacement commit and push the revert to `main`. That restores the old deployment workflow and its Version-I files as well as the previous source.

## Validation performed before upload

- Clean public-registry installation with `npm ci --ignore-scripts`; no laptop-specific dependency symlink or cache included.
- Build: 53 static pages. Astro check: zero errors/warnings/hints. ESLint passed.
- Nine real photograph hashes and bilingual credits, all sixteen technical DE/EN chapters, contact copy, removed CTA checks and inactive form delivery verified.
- Static frontend cookie/storage/resource checks passed. Original AI images and older implementations are excluded from the new main tree and build.
- Browser checks against the new checkout's compiled output at desktop 1440×900, tablet 768×1024 and synthetic-touch phone 390×844: Glass styling, real hero image, sliding underline, navigation, service article anchor, required-field validation and local-only submit feedback passed. No page errors or POST requests.
- Single Anti-Slop pass: no errors/warnings, dimension-percentage advisories only. One focused Impeccable source scan returned no findings; source scans are not rendered accessibility audits. Screenshots inspected without a further design change.
- Offline repository/bundle audits reviewed; see SECURITY.md for scope and remaining limitations.

The publication still contains the requested test-version banner, incomplete imprint and privacy drafts and a non-sending contact form. Local browser evidence does not establish real-device/Safari behavior or live email delivery. After pushing, GitHub Actions and the actual HTTPS site must be checked separately.
