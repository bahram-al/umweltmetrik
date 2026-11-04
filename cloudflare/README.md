# Contact mail service — deployment still required

The static frontend currently keeps `src/data/contact-config.ts` set to `enabled: false`. The previous live Worker sends only an internal notification and must not be used as the new two-mail service without upgrading it.

The existing account owner must deploy this Worker to `umweltmetrik-contact` in the Cloudflare account serving `alibahramali.workers.dev`. No new domain, DNS changes, SMTP password, browser cookies or frontend API key are required. Existing `RESEND_API_KEY` stays a Worker secret and must never be committed. Its sending domain must be verified in Resend for `info@umweltmetrik.de`.

## Deployment by the Cloudflare account owner

1. Authenticate Wrangler to the correct existing account. Review the existing Worker before deployment and save its current source/settings for rollback.
2. From the repository root run `npx wrangler@4.157.0 deploy --config cloudflare/wrangler.jsonc --keep-vars` in the authenticated account. This adds the `CONTACT_GATEWAY` SQLite Durable Object binding/migration. Preserve the existing `RESEND_API_KEY` secret. The ledger is new and has no old data to migrate. Do not upgrade the account plan or enable paid extras without the owner's approval.
3. Verify `/health` reports `contact-v2` and `configured: true`. This only verifies bindings, not mail delivery.
4. Disable open/click tracking for this sending domain in Resend. From the real site's origin, submit an explicitly identified test with an authorized test recipient and unique UUID. Verify **both** the internal email and visitor acknowledgement in the destination mailboxes, or check provider delivery events. Provider acceptance alone is not inbox delivery.
5. Before enabling public form submission, replace the preview-only contact-form section in the privacy notice with the actual Cloudflare/Resend processing, email confirmation, hashed anti-abuse metadata and retention details. Complete the remaining provider/operator information with the owner.
6. Set `contactConfig.enabled` to `true`, update the site-wide preview banner and any non-sending wording, and deploy the frontend. Run browser success/error/double-click checks. Leave the gate off until these steps are complete.

No automatic external deployment is configured in GitHub Actions. Frontend uploads do not update this Worker.

## Behaviour and limits

- Exactly two plain-text transactional emails in a single Resend batch: internal enquiry to `info@umweltmetrik.de`, acknowledgement to the validated visitor address. Internal `reply_to` is the visitor; acknowledgement `reply_to` is UmweltMetrik. No marketing list or newsletter.
- The acknowledgement never repeats user-supplied message content, company names or links.
- Server validation, bounded streaming body (20 KB), Origin allowlist and honeypot. Origin checks do not authenticate bots; the Durable Object enforces the budgets independently.
- A single Durable Object serializes 4 requests/IP/15 minutes, 1 request/recipient/15 minutes, 15 total/hour, 40 total/day. Two emails per enquiry. These conservative shared limits cap abuse; a determined attacker could still exhaust the budget and temporarily deny legitimate submissions.
- Request UUID + payload digest and Resend batch idempotency prevent repeated sends on page retries/timeouts for up to 24 hours. A pending concurrent retry gets `409`; an altered request under the same UUID is rejected. A new browser page has no stored UUID; distinct submissions can still be treated as new requests.
- Only digests, UUIDs, counters and delivery state are kept in the ledger. Expiry is 24 hours, with cleanup alarms hourly; expired records may physically remain until the next alarm. No raw address, IP, company or message is persisted by our code. Cloudflare and Resend have their own service logs/retention.
- Provider errors, credentials and message contents are not logged or returned to the browser. A timeout is reported as uncertain, not as successful or definitely unsent. Retries reuse the same provider key.
- Resend batch acceptance is not a guarantee that either email reaches an inbox. Delivery/bounce verification remains necessary.

## Local verification

`node --test cloudflare/worker.test.mjs` runs deterministic tests with fake provider responses and in-memory Durable Object storage. It sends no email and does not verify Cloudflare deployment, Resend credentials, DNS/domain verification or inbox delivery.

Wrangler 4.157.0 `deploy --dry-run` compiled this Worker and recognized the Durable Object binding locally. This is packaging evidence, not an authenticated deployment or real Durable Object runtime test.

References: [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/), [Resend batch API](https://resend.com/docs/api-reference/emails/send-batch-emails), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
