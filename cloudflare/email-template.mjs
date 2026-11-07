// Table layout and inline styles also work in clients without modern website CSS.
// Only a fixed, shared first-party logo URL is loaded: no recipient IDs or tracking pixels.
const LOGO = 'https://umweltmetrik.de/images/umweltmetrik-mail-logo.png';
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function layout(lang, title, content, footnote) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHTML(title)}</title></head>
<body style="margin:0;padding:0;background-color:#e6efeb;color:#0d303a;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e6efeb"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border:1px solid #d5dfdb;border-radius:20px">
<tr><td style="padding:32px 28px 26px;border-bottom:1px solid #d5dfdb"><img src="${LOGO}" width="240" height="40" alt="UmweltMetrik" style="display:block;border:0;width:240px;max-width:100%;height:auto"></td></tr>
<tr><td style="padding:32px 28px"><span style="display:block;width:40px;height:4px;background-color:#c8eb65;margin-bottom:22px"></span><h1 style="margin:0 0 22px;font-size:28px;line-height:1.2;letter-spacing:-0.6px;font-weight:600;color:#0d303a">${escapeHTML(title)}</h1>${content}</td></tr>
<tr><td style="padding:22px 28px;background-color:#eff3ed;border-top:1px solid #d5dfdb;border-radius:0 0 20px 20px"><p style="margin:0;font-size:13px;line-height:1.6;color:#4c6268">${footnote}</p></td></tr>
</table><p style="max-width:560px;margin:22px 0 0;font-size:13px;line-height:1.6;color:#4c6268">Umweltprobenahme · Monitoring · Geologische Feldarbeit<br><a href="mailto:info@umweltmetrik.de" style="color:#0d303a;text-decoration:underline">info@umweltmetrik.de</a></p>
</td></tr></table></body></html>`;
}
const paragraph = text => `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#0d303a">${escapeHTML(text)}</p>`;

export function acknowledgementHTML(lang) {
  const en = lang === 'en';
  return layout(en ? 'en' : 'de', en ? 'Your enquiry has arrived.' : 'Ihre Anfrage ist eingegangen.',
    paragraph(en ? 'Thank you for contacting UmweltMetrik. We have received your message and will get back to you.' : 'Vielen Dank für Ihre Nachricht an UmweltMetrik. Wir haben Ihre Anfrage erhalten und melden uns bei Ihnen.') +
    paragraph(en ? 'If you would like to add anything, simply reply to this email.' : 'Falls Sie noch etwas ergänzen möchten, antworten Sie einfach auf diese E-Mail.'),
    en ? 'This is an automated acknowledgement, not a quotation or confirmation of an appointment. If you did not submit an enquiry, you can ignore this email.' : 'Dies ist eine automatische Eingangsbestätigung, kein Angebot und keine Terminbestätigung. Falls Sie keine Anfrage gestellt haben, können Sie diese Nachricht ignorieren.');
}

export function enquiryHTML(data, service) {
  const rows = [['E-Mail', data.email], ['Firma', data.company], ['Telefon', data.phone], ['Einsatzort / PLZ', data.place], ['Leistungsbereich', service]].map(([label, value]) => `<tr><td style="padding:12px 0;border-bottom:1px solid #d5dfdb"><p style="margin:0 0 4px;font-size:12px;line-height:1.5;color:#4c6268">${escapeHTML(label)}</p><p style="margin:0;font-size:16px;line-height:1.5;color:#0d303a;overflow-wrap:anywhere;word-break:break-word">${escapeHTML(value || '–')}</p></td></tr>`).join('');
  return layout('de', 'Neue Website-Anfrage.', paragraph('Eine neue Nachricht über das Kontaktformular ist eingegangen.') +
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table><h2 style="margin:28px 0 12px;font-size:18px;color:#0d303a">Nachricht</h2><p style="margin:0;font-size:16px;line-height:1.65;color:#0d303a;overflow-wrap:anywhere;word-break:break-word">${escapeHTML(data.message).replace(/\r?\n/g, '<br>')}</p>`,
    'Zum Antworten direkt die Antwortfunktion Ihres E-Mail-Programms verwenden. Die Antwort geht an die anfragende Person.');
}
