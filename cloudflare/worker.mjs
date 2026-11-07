const ORIGINS = new Set(['https://umweltmetrik.de', 'https://www.umweltmetrik.de']);
const VERSION = 'contact-v2';
const MAX_BODY = 20000;
const DAY = 86400000;
const TTL = DAY;
const RECIPIENT = 'info@umweltmetrik.de';
const FROM = 'UmweltMetrik <info@umweltmetrik.de>';
const SERVICES = {
  '': '-', groundwater: 'Grundwasser & Monitoring', drinking: 'Trinkwasser & Hygiene',
  soil: 'Boden / Altlasten', cooling: 'Kühltürme & Kühlanlagen', wastewater: 'Abwasser & Einleitungen',
  waste: 'Abfall / Haufwerk', surface: 'Oberflächenwasser & Gewässer', field: 'Vor-Ort-Parameter & Feldtechnik',
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reply(status, body, origin = '') {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin' };
  if (ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  if (status === 429) headers['Retry-After'] = '900';
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function boundedJSON(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') throw new Error('FORMAT');
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) throw new Error('SIZE');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('FORMAT');
  let length = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY) { await reader.cancel(); throw new Error('SIZE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export function validate(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object') return null;
  const keys = ['requestId', 'email', 'company', 'phone', 'place', 'service', 'message', 'website', 'lang'];
  if (Object.keys(input).some(key => !keys.includes(key))) return null;
  if (typeof input.requestId !== 'string' || !UUID.test(input.requestId)) return null;
  const limits = { email: 254, company: 160, phone: 60, place: 180, service: 32, message: 10000, website: 300, lang: 2 };
  const result = { requestId: input.requestId };
  for (const [key, limit] of Object.entries(limits)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    if (key !== 'message' && /[\r\n]/.test(value)) return null;
    result[key] = value.trim();
  }
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/.test(result.email)) return null;
  if (result.email.includes('..') || !result.message || !Object.hasOwn(SERVICES, result.service)) return null;
  if (!['de', 'en'].includes(result.lang)) return null;
  return result;
}

export function messages(data) {
  const english = data.lang === 'en';
  // Plain text prevents HTML injection. The acknowledgement contains no submitted content or links.
  return [
    {
      from: FROM, to: [RECIPIENT], reply_to: data.email,
      subject: `Neue Website-Anfrage${data.service ? ' – ' + SERVICES[data.service] : ''}`,
      text: `Neue Anfrage über umweltmetrik.de\n\nE-Mail: ${data.email}\nFirma: ${data.company || '-'}\nTelefon: ${data.phone || '-'}\nEinsatzort / PLZ: ${data.place || '-'}\nLeistungsbereich: ${SERVICES[data.service]}\n\nNachricht:\n${data.message}`,
    },
    {
      from: FROM, to: [data.email], reply_to: RECIPIENT,
      subject: english ? 'We received your enquiry – UmweltMetrik' : 'Ihre Anfrage ist eingegangen – UmweltMetrik',
      text: english
        ? 'Thank you for contacting UmweltMetrik. Your enquiry has been received and will be reviewed.\n\nThis is an automated acknowledgement, not a quotation or confirmation of an appointment.\n\nIf you did not submit an enquiry, you can ignore this email.\n\nUmweltMetrik\ninfo@umweltmetrik.de'
        : 'Vielen Dank für Ihre Nachricht an UmweltMetrik. Ihre Anfrage ist eingegangen und wird geprüft.\n\nDies ist eine automatische Eingangsbestätigung, kein Angebot und keine Terminbestätigung.\n\nFalls Sie keine Anfrage gestellt haben, können Sie diese Nachricht ignorieren.\n\nUmweltMetrik\ninfo@umweltmetrik.de',
    },
  ];
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return reply(200, { version: VERSION, configured: Boolean(env.RESEND_API_KEY && env.CONTACT_GATEWAY) });
    }
    if (!ORIGINS.has(origin)) return reply(403, { code: 'ORIGIN' });
    if (request.method === 'OPTIONS') return reply(204, null, origin);
    if (request.method !== 'POST' || !['/', '/contact'].includes(url.pathname)) return reply(405, { code: 'METHOD' }, origin);
    if (!env.RESEND_API_KEY || !env.CONTACT_GATEWAY) return reply(503, { code: 'UNAVAILABLE' }, origin);
    let input;
    try { input = await boundedJSON(request); }
    catch (error) { return reply(error.message === 'SIZE' ? 413 : 400, { code: 'INVALID' }, origin); }
    const data = validate(input);
    if (!data) return reply(400, { code: 'INVALID' }, origin);
    if (data.website) return reply(200, { accepted: true }, origin);
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip) return reply(503, { code: 'UNAVAILABLE' }, origin);
    const stub = env.CONTACT_GATEWAY.get(env.CONTACT_GATEWAY.idFromName('contact-gateway'));
    try {
      const response = await stub.fetch(new Request('https://contact.internal/', {
        method: 'POST', body: JSON.stringify({ data, ipHash: await digest(ip) }),
      }));
      const body = await response.json();
      return reply(response.status, body, origin);
    } catch { return reply(503, { code: 'UNAVAILABLE' }, origin); }
  },
};

// One Durable Object serializes the global budget, duplicate checks and recipient/IP limits.
// It stores only hashes, counters and delivery state, never form content or raw addresses/IPs.
export class ContactGateway {
  constructor(state, env) { this.state = state; this.env = env; this.fetcher = globalThis.fetch.bind(globalThis); this.now = Date.now; }

  async fetch(request) {
    let raw;
    try { raw = await request.json(); } catch { return reply(400, { code: 'INVALID' }); }
    const data = validate(raw?.data);
    const ipHash = raw?.ipHash;
    if (!data || typeof ipHash !== 'string' || !/^[a-f0-9]{64}$/.test(ipHash)) return reply(400, { code: 'INVALID' });
    const now = this.now();
    const hash = await digest(JSON.stringify(messages(data)));
    const emailHash = await digest(data.email.toLowerCase());
    const reservation = await this.state.blockConcurrencyWhile(async () => {
      const ledger = await this.state.storage.get('ledger') || { requests: {}, limits: {} };
      this.prune(ledger, now);
      const previous = ledger.requests[data.requestId];
      if (previous) {
        if (previous.hash !== hash) return { status: 409, code: 'CONFLICT' };
        if (previous.state === 'accepted') return { status: 200, accepted: true };
        if (previous.state === 'pending' && now - previous.attempt < 20000) return { status: 409, code: 'PROCESSING' };
        previous.state = 'pending'; previous.attempt = now;
      } else {
        const limits = [
          [`ip:${ipHash}`, 900000, 4], [`email:${emailHash}`, 900000, 1],
          ['global-hour', 3600000, 15], ['global-day', DAY, 40],
        ];
        if (limits.some(([key, period, max]) => ledger.limits[key]?.start > now - period && ledger.limits[key].count >= max)) return { status: 429, code: 'LIMIT' };
        for (const [key, period] of limits) {
          if (!ledger.limits[key] || ledger.limits[key].start <= now - period) ledger.limits[key] = { start: now, count: 0, expires: now + period };
          ledger.limits[key].count++;
        }
        ledger.requests[data.requestId] = { hash, state: 'pending', attempt: now, expires: now + TTL };
      }
      await this.state.storage.put('ledger', ledger);
      await this.state.storage.setAlarm(now + 3600000);
      return { send: true };
    });
    if (!reservation.send) {
      const { status, ...body } = reservation;
      return reply(status, body);
    }
    let accepted = false;
    let code = 'DELIVERY_UNCERTAIN';
    try {
      const response = await this.fetcher('https://api.resend.com/emails/batch', {
        method: 'POST', signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${this.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `umweltmetrik/contact/${data.requestId}` },
        body: JSON.stringify(messages(data)),
      });
      const result = await response.json();
      accepted = response.ok && result.data?.length === 2 && result.data.every(item => typeof item.id === 'string');
      if (!response.ok && response.status < 500 && response.status !== 409) code = 'DELIVERY_REJECTED';
    } catch { /* A timeout can follow an accepted send. Reuse the provider idempotency key on retry. */ }
    await this.state.blockConcurrencyWhile(async () => {
      const ledger = await this.state.storage.get('ledger');
      if (ledger?.requests[data.requestId]) {
        ledger.requests[data.requestId].state = accepted ? 'accepted' : 'uncertain';
        await this.state.storage.put('ledger', ledger);
      }
    });
    return accepted ? reply(200, { accepted: true }) : reply(503, { code });
  }

  prune(ledger, now) {
    for (const [key, value] of Object.entries(ledger.requests)) if (value.expires <= now) delete ledger.requests[key];
    for (const [key, value] of Object.entries(ledger.limits)) if (value.expires <= now) delete ledger.limits[key];
  }

  async alarm() {
    await this.state.blockConcurrencyWhile(async () => {
      const ledger = await this.state.storage.get('ledger');
      if (!ledger) return;
      this.prune(ledger, this.now());
      if (Object.keys(ledger.requests).length || Object.keys(ledger.limits).length) {
        await this.state.storage.put('ledger', ledger);
        await this.state.storage.setAlarm(this.now() + 3600000);
      } else await this.state.storage.delete('ledger');
    });
  }
}
