# Contact mail service

The existing `umweltmetrik-contact` Worker was upgraded in the account serving `alibahramali.workers.dev` on 7 November 2026. The frontend is enabled after verifying delivery events and Reply-To for both test messages in Resend. The privacy notice describes the deployed processing and keeps the remaining operator, mailbox-provider and account-specific contractual information explicitly marked as incomplete.

## Prepared update: branded emails (not yet deployed)

The repository now prepares version `contact-v3-branded`: responsive HTML for both transactional messages, plus the existing plain-text alternatives. `email-template.mjs` escapes all submitted fields; the visitor acknowledgement never reflects submitted content. A fixed logo is served at `https://umweltmetrik.de/images/umweltmetrik-mail-logo.png`, without recipient parameters or tracking pixels. Domain-level open/click tracking must remain disabled. Email clients can block remote images; the logo has alt text and message content remains readable.

**Frontend and Worker deploy separately.** The successful-submit screen is published with Pages. These email templates become live only after the authenticated Cloudflare account owner deploys this directory. Local tests use a fake provider and do not send mail. Follow `CODEX-UPDATE-PROMPT.md` for the owner handoff. Preserve the existing Durable Object migration (`contact-v2`), binding, secret, rate limits and idempotency.

The historical verification below describes the earlier plain-text version, not verification of the new HTML templates.

## Verified setup on 7 November 2026

- Existing source/settings/version metadata were backed up outside the repository before deployment; the owner also saved the previous code and settings locally. No secret values belong in this repository or its outputs.
- `CONTACT_GATEWAY` / `ContactGateway` uses a SQLite Durable Object with migration tag `contact-v2`. Existing `RESEND_API_KEY` remains a server-side secret. `/health` returns `contact-v2` and `configured: true` (configuration evidence only).
- Resend shows the sending domain as verified, with sending region Ireland (`eu-west-1`). Its domain configuration offers tracking setup, with no custom tracking subdomain configured. Both messages are plain text without tracking pixels or redirected links. No DNS records or paid plans were changed.
- The first real test failed before any provider request because Workers requires the correct receiver for the native `fetch` function. This was reproduced with workerd/Miniflare; binding fetch to `globalThis` fixed it. A regression test covers the receiver requirement. All 14 contact tests pass; a separate local workerd test with a simulated provider returned one batch call and HTTP 200.
- The corrected test reused the original request UUID and provider idempotency key. Resend accepted one two-message batch at 12:25 UTC. The owner-provided Resend views showed **Delivered** for both the internal enquiry and acknowledgement, with the expected Reply-To in each message detail. This is provider delivery-event evidence, not a claim that a human read either message. No further real submissions are needed for frontend layout or interaction checks.
- Resend's official GDPR documentation says the sending region does not set the storage location: email content and delivery logs are stored in the USA. Its stated standard retention for Free/Pro/Scale is 30 days. Account-specific contracts and mailbox retention remain owner follow-ups, explicitly marked in the privacy draft. See https://resend.com/security/gdpr/ and https://resend.com/legal/dpa.

The following checklist also applies to future upgrades. Existing credentials must be preserved and any new real test recipients must be authorized.

## Deployment by the Cloudflare account owner

1. Authenticate Wrangler to the correct existing account. Review the existing Worker before deployment and save its current source/settings for rollback.
2. From the repository root run `npx wrangler@4.157.0 deploy --config cloudflare/wrangler.jsonc --keep-vars` in the authenticated account. This adds the `CONTACT_GATEWAY` SQLite Durable Object binding/migration. Preserve the existing `RESEND_API_KEY` secret. The ledger is new and has no old data to migrate. Do not upgrade the account plan or enable paid extras without the owner's approval.
3. Verify `/health` reports `contact-v2` and `configured: true`. This only verifies bindings, not mail delivery.
4. Disable open/click tracking for this sending domain in Resend. From the real site's origin, submit an explicitly identified test with an authorized test recipient and unique UUID. Verify **both** the internal email and visitor acknowledgement in the destination mailboxes, or check provider delivery events. Provider acceptance alone is not inbox delivery.
5. Before enabling public form submission, replace the preview-only contact-form section in the privacy notice with the actual Cloudflare/Resend processing, email confirmation, hashed anti-abuse metadata and retention details. Complete the remaining provider/operator information with the owner.
6. Set `contactConfig.enabled` to `true`, update the site-wide preview banner and any non-sending wording, and deploy the frontend. Run browser success/error/double-click checks. Leave the gate off until these steps are complete.

No automatic external deployment is configured in GitHub Actions. Frontend uploads do not update this Worker.

## Behaviour and limits

- Exactly two transactional emails (HTML plus plain-text alternatives after the prepared update) in a single Resend batch: internal enquiry to `info@umweltmetrik.de`, acknowledgement to the validated visitor address. Internal `reply_to` is the visitor; acknowledgement `reply_to` is UmweltMetrik. No marketing list or newsletter.
- The acknowledgement never repeats user-supplied message content, company names or links.
- Server validation, bounded streaming body (20 KB), Origin allowlist and honeypot. Origin checks do not authenticate bots; the Durable Object enforces the budgets independently.
- A single Durable Object serializes 4 requests/IP/15 minutes, 1 request/recipient/15 minutes, 15 total/hour, 40 total/day. Two emails per enquiry. These conservative shared limits cap abuse; a determined attacker could still exhaust the budget and temporarily deny legitimate submissions.
- Request UUID + payload digest and Resend batch idempotency prevent repeated sends on page retries/timeouts for up to 24 hours. A pending concurrent retry gets `409`; an altered request under the same UUID is rejected. A new browser page has no stored UUID; distinct submissions can still be treated as new requests.
- Only digests, UUIDs, counters and delivery state are kept in the ledger. Expiry is 24 hours, with cleanup alarms hourly; expired records may physically remain until the next alarm. No raw address, IP, company or message is persisted by our code. Cloudflare and Resend have their own service logs/retention.
- Provider errors, credentials and message contents are not logged or returned to the browser. A timeout is reported as uncertain, not as successful or definitely unsent. Retries reuse the same provider key.
- Resend batch acceptance is not a guarantee that either email reaches an inbox. Delivery/bounce verification remains necessary.

## Local verification

`node --test cloudflare/worker.test.mjs` runs deterministic tests with fake provider responses and in-memory Durable Object storage. It sends no email and does not verify Cloudflare deployment, Resend credentials, DNS/domain verification or inbox delivery.

Wrangler 4.157.0 `deploy --dry-run` checks packaging locally. An authenticated deployment and a real two-mail delivery test were also completed as recorded above. Node tests alone do not establish compatibility with native Workers APIs.

References: [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/), [Resend batch API](https://resend.com/docs/api-reference/emails/send-batch-emails), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
