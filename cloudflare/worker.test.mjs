import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { ContactGateway, messages, validate } from './worker.mjs';

const origin = 'https://umweltmetrik.de';
const input = (overrides = {}) => ({
  requestId: crypto.randomUUID(), email: 'visitor@example.com', company: '', phone: '', place: '',
  service: 'groundwater', message: 'Anfrage zu einer Grundwasserprobenahme.', website: '', lang: 'de', ...overrides,
});
const req = (body, headers = {}, method = 'POST', path = '/') => new Request('https://worker.example'+path, {
  method, headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
  ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
});

function setup() {
  const values = new Map();
  let queue = Promise.resolve();
  const storage = {
    async get(key) { return structuredClone(values.get(key)); },
    async put(key, value) { values.set(key, structuredClone(value)); },
    async delete(key) { values.delete(key); },
    async setAlarm(at) { this.alarmAt = at; },
  };
  const state = { storage, blockConcurrencyWhile(fn) { const operation = queue.then(fn); queue = operation.catch(() => {}); return operation; } };
  const calls = [];
  const env = { RESEND_API_KEY: 'unit-test-secret-not-a-real-key' };
  const gateway = new ContactGateway(state, env);
  gateway.fetcher = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ data: [{ id: 'internal-test-id' }, { id: 'confirmation-test-id' }] });
  };
  env.CONTACT_GATEWAY = { idFromName: name => name, get: () => gateway };
  return { gateway, env, calls, storage, values };
}

test('valid request creates exactly two fixed-purpose mails without an Ansprechpartner', async () => {
  const { env, calls, storage } = setup();
  const body = input({ message: '<script>user content</script>\nProject details' });
  const response = await worker.fetch(req(body), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { accepted: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails/batch');
  const mails = JSON.parse(calls[0].options.body);
  assert.equal(mails.length, 2);
  assert.deepEqual(mails[0].to, ['info@umweltmetrik.de']);
  assert.equal(mails[0].reply_to, body.email);
  assert.ok(mails[0].text.includes(body.message));
  assert.deepEqual(mails[1].to, [body.email]);
  assert.equal(mails[1].reply_to, 'info@umweltmetrik.de');
  assert.ok(!mails[1].text.includes(body.message));
  assert.ok(mails.every(mail => !mail.html && mail.from === 'UmweltMetrik <info@umweltmetrik.de>'));
  const persisted = JSON.stringify(await storage.get('ledger'));
  for (const privateValue of [body.email, body.message, '192.0.2.1']) assert.ok(!persisted.includes(privateValue));
});

test('duplicate IDs return accepted without a second provider call; changed payload is rejected', async () => {
  const { env, calls } = setup();
  const body = input();
  assert.equal((await worker.fetch(req(body), env)).status, 200);
  assert.equal((await worker.fetch(req(body), env)).status, 200);
  assert.equal((await worker.fetch(req({ ...body, message: 'Changed content' }), env)).status, 409);
  assert.equal(calls.length, 1);
});

test('timeout retains the same provider idempotency key and permits a safe retry', async () => {
  const { env, gateway } = setup();
  const keys = [];
  gateway.fetcher = async (_url, options) => {
    keys.push(options.headers['Idempotency-Key']);
    if (keys.length === 1) throw new Error('timeout after possible provider acceptance');
    return Response.json({ data: [{ id: 'one' }, { id: 'two' }] });
  };
  const body = input();
  assert.equal((await worker.fetch(req(body), env)).status, 503);
  assert.equal((await worker.fetch(req(body), env)).status, 200);
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
});

test('concurrent duplicate submission cannot dispatch twice', async () => {
  const { env, gateway } = setup();
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  let count = 0;
  gateway.fetcher = async () => { count++; await waiting; return Response.json({ data: [{ id: 'one' }, { id: 'two' }] }); };
  const body = input();
  const first = worker.fetch(req(body), env);
  while (!count) await new Promise(resolve => setTimeout(resolve, 1));
  assert.equal((await worker.fetch(req(body), env)).status, 409);
  release();
  assert.equal((await first).status, 200);
  assert.equal(count, 1);
});

test('recipient limit applies across IPs; IP limit applies across recipients', async () => {
  const { env, calls } = setup();
  assert.equal((await worker.fetch(req(input()), env)).status, 200);
  assert.equal((await worker.fetch(req(input(), { 'CF-Connecting-IP': '192.0.2.2' }), env)).status, 429);
  for (let n = 1; n <= 3; n++) assert.equal((await worker.fetch(req(input({ email: `visitor${n}@example.com` })), env)).status, 200);
  assert.equal((await worker.fetch(req(input({ email: 'visitor5@example.com' })), env)).status, 429);
  assert.equal(calls.length, 4);
});

test('global hourly budget is serialized even across distinct visitors', async () => {
  const { env, calls } = setup();
  const responses = await Promise.all(Array.from({ length: 20 }, (_, n) => worker.fetch(req(input({ email: `visitor${n}@example.com` }), { 'CF-Connecting-IP': `192.0.2.${n+1}` }), env)));
  assert.equal(responses.filter(r => r.status === 200).length, 15);
  assert.equal(responses.filter(r => r.status === 429).length, 5);
  assert.equal(calls.length, 15);
});

test('global daily budget remains across hourly windows', async () => {
  const { env, gateway, calls } = setup();
  const base = Date.now();
  for (let n = 0; n < 40; n++) {
    gateway.now = () => base + Math.floor(n / 14) * 3600001;
    assert.equal((await worker.fetch(req(input({ email: `visitor${n}@example.com` }), { 'CF-Connecting-IP': `192.0.2.${n+1}` }), env)).status, 200);
  }
  assert.equal((await worker.fetch(req(input({ email: 'over-budget@example.com' }), { 'CF-Connecting-IP': '192.0.2.99' }), env)).status, 429);
  assert.equal(calls.length, 40);
});

test('provider rejection or partial/malformed success never claims successful delivery or leaks provider errors', async () => {
  for (const providerResponse of [Response.json({ error: 'sensitive-provider-details' }, { status: 401 }), Response.json({ data: [{ id: 'only-one' }] }), new Response('bad-json')]) {
    const { env, gateway } = setup();
    gateway.fetcher = async () => providerResponse;
    const response = await worker.fetch(req(input()), env);
    assert.equal(response.status, 503);
    const text = await response.text();
    assert.ok(!text.includes('sensitive-provider-details') && !text.includes('accepted'));
  }
});

test('origin checks, request format, schema, required fields and length limits reject without sending', async () => {
  const { env, calls } = setup();
  assert.equal((await worker.fetch(req(input(), { Origin: 'https://attacker.example' }), env)).status, 403);
  assert.equal((await worker.fetch(req(input(), { 'Content-Type': 'text/plain' }), env)).status, 400);
  assert.equal((await worker.fetch(req(input({ message: 'a'.repeat(21000) })), env)).status, 413);
  for (const body of [input({ email: 'x@example.com\r\nBcc: victim@example.com' }), input({ email: 'not-email' }), input({ message: '' }), input({ name: 'No longer collected' }), input({ service: 'unknown' }), input({ requestId: 'invalid' }), input({ lang: 'xx' }), input({ company: {} })]) {
    assert.equal((await worker.fetch(req(body), env)).status, 400);
  }
  assert.equal(calls.length, 0);
});

test('missing credentials/state fail closed; honeypot does not send; preflight never submits', async () => {
  const { env, calls } = setup();
  assert.equal((await worker.fetch(req(input()), {})).status, 503);
  assert.equal((await worker.fetch(req(input()), { RESEND_API_KEY: 'fake' })).status, 503);
  assert.equal((await worker.fetch(req(input({ website: 'spam' })), env)).status, 200);
  assert.equal((await worker.fetch(req(null, {}, 'OPTIONS'), env)).status, 204);
  assert.equal((await worker.fetch(req(null, {}, 'GET'), env)).status, 405);
  assert.equal(calls.length, 0);
});

test('privacy metadata expires after 24 hours; health reports configuration, not email deliverability', async () => {
  const { env, gateway, values } = setup();
  const now = Date.now(); gateway.now = () => now;
  assert.equal((await worker.fetch(req(input()), env)).status, 200);
  assert.ok(values.has('ledger'));
  gateway.now = () => now + 86400001;
  await gateway.alarm();
  assert.equal(values.size, 0);
  const health = await worker.fetch(new Request('https://worker.example/health'), env);
  assert.deepEqual(await health.json(), { version: 'contact-v2', configured: true });
});

test('English acknowledgement stays fixed and does not reflect attacker-controlled content', () => {
  const mails = messages(validate(input({ lang: 'en', company: '<a href="https://attacker.example">click</a>', message: 'https://attacker.example' })));
  assert.ok(mails[1].subject.startsWith('We received'));
  assert.ok(!mails[1].text.includes('attacker.example'));
});

test('internal binding also rejects malformed/unvalidated payloads before dispatch', async () => {
  const { gateway, calls } = setup();
  for (const body of ['broken JSON', JSON.stringify({data:input(),ipHash:'raw-ip'}), JSON.stringify({data:input({email:'bad'}),ipHash:'a'.repeat(64)})]) {
    const response=await gateway.fetch(new Request('https://contact.internal/',{method:'POST',body}));
    assert.equal(response.status,400);
  }
  assert.equal(calls.length,0);
});
