export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://umweltmetrik.de',
      'https://www.umweltmetrik.de',
      'https://bahram-al.github.io',
    ]

    const origin = request.headers.get('Origin') || ''
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://umweltmetrik.de',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
    }

    if (!allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: corsHeaders })
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is missing' }), { status: 500, headers: corsHeaders })
    }

    let data
    try {
      data = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders })
    }

    const { email, company, phone, place, service, message, website } = data

    if (website) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders })
    }

    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message are required' }), { status: 400, headers: corsHeaders })
    }

    const subject = `Neue Website-Anfrage${service ? ` - ${service}` : ''}`
    const emailHtml = `
      <h2>Neue Anfrage über umweltmetrik.de</h2>
      <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Firma:</strong> ${escapeHtml(company || '-')}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone || '-')}</p>
      <p><strong>Einsatzort / PLZ:</strong> ${escapeHtml(place || '-')}</p>
      <p><strong>Leistungsbereich:</strong> ${escapeHtml(service || '-')}</p>
      <hr>
      <p><strong>Nachricht:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'UmweltMetrik Website <info@umweltmetrik.de>',
        to: ['info@umweltmetrik.de'],
        reply_to: email,
        subject,
        html: emailHtml,
      }),
    })

    const resendResult = await resendResponse.json()
    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: 'Resend error', details: resendResult }), { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ success: true, id: resendResult.id }), { status: 200, headers: corsHeaders })
  },
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
