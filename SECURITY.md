# Scope of this static website

The deployed Astro frontend builds static HTML, CSS and browser JavaScript. It has no authentication, payments or file uploads. Contact delivery is still disabled by configuration; the page makes no submission until explicitly enabled. Hosting may keep its own access logs; that is separate from frontend storage.

The repository now also contains a separate, not-yet-deployed Cloudflare Worker in `cloudflare/`. This new backend uses a single SQLite Durable Object to serialize rate budgets and request/delivery deduplication; it would call Resend to send two transactional plain-text emails. Raw form content, addresses and IPs are not persisted by our Worker code. Hashed identifiers/counters/UUIDs expire after 24 hours and are cleaned by hourly alarms; provider logs and Cloudflare storage backups have separate retention. The provider key stays server-side. Public deployment and real delivery are blocked on the Cloudflare account owner's access; no authenticated Cloudflare/Resend or mailbox delivery verification has been performed.

Deterministic Node tests cover dual message routing, no reflected user content in acknowledgements, retry idempotency, concurrent duplicate requests, recipient/IP/global limits, server validation and size limits, provider rejection/malformed/partial results, missing bindings and metadata expiry. Browser checks exercise the disabled path and mocked request states. Neither constitutes a real Cloudflare runtime or inbox test. Setup/activation gates and residual limitations are in `cloudflare/README.md`.

Repository and bundle checks were run offline before publication. The built bundle scan reported no critical findings or warnings. These are limited checks, not a security guarantee or an audit of GitHub accounts, the hosting provider or the historical Cloudflare Worker.

## Reviewed scanner reports

- Missing differential authorization tests: not applicable to this build-only static site, which has no authenticated endpoint or tenant boundary.
- Dynamic href expressions: routes come from fixed application maps; source/license links come from committed image and reference data. There is no user-controlled URL input rendered as an href. Original contact markup is committed reference content, not runtime user HTML.
- Dependency lifecycle scripts: disabled by `.npmrc` and explicitly disabled in CI; clean installation and build were tested in that mode.
- GitHub Actions: pinned to commit SHAs resolved from the official actions repositories.
- Dependency release cooldown: not configured. Dependencies remain locked by package-lock.json; future updates should be reviewed rather than blindly updating the lockfile.
- Contact frontend payload spread (`AUTHZ-05`): this is the sender's own public form data, not a privileged database write. Both Worker entry points validate a strict field allowlist. The destination/from/subject are server-controlled, and unknown fields, including the removed `name`, are rejected in tests. The scanner's critical label does not describe an exploitable mass-assignment path here.
- Internal request JSON (`INJECT-13`): the Durable Object is reached only through a Worker binding. It now repeats the strict schema validation and checks the IP digest before dispatch; malformed direct binding requests are covered by tests.
- The generic scanner misses tests located in `cloudflare/worker.test.mjs` and does not understand the static-frontend plus separate not-deployed Worker architecture. It still reports missing differential account/tenant tests; there are no authenticated users or tenants here. Abuse boundaries are tested separately.

The scanner did not classify the Astro package manifest correctly; package.json and package-lock.json are present and were manually checked. No online vulnerability probe, account/MFA review, DNS change or live contact-endpoint test was performed as part of this upload.

The supplied imprint is published as a German draft on both language routes; full operator details and a serviceable postal address remain to be added. The supplied privacy notice remains an incomplete German draft and accurately describes the currently disabled form. Before activation, its contact section must be updated for Cloudflare/Resend and hashed anti-abuse metadata. Controller and email-provider details still need completion. The test banner remains visible. No external mail was sent during this implementation.

Contact-change validation: 13 fake-provider/state tests passed; Astro check and lint passed; 53 static routes built; content/privacy checks passed. Focused Anti-Slop and Impeccable source detectors reported no findings for Contact.astro. Desktop/tablet/mobile browser tests confirmed field removal, disabled-path no-network behaviour, mocked success/error/rate-limit flows, same-ID retries and double-submit prevention. The offline bundle audit reported 0 critical findings and 0 warnings; repo heuristics were reviewed above. None of these checks verifies the existing external Worker, actual account setup or mail delivery.
