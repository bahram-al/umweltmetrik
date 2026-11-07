// Submission state lives only in this page's memory; reloading restores the form.
export function initContactForm(form, lang) {
  if (!form) return;
  const success = form.parentElement.querySelector('[data-contact-success]');
  let sent = false;
  const requested = new URL(location.href).searchParams.get('service');
  const field = form.querySelector('[name=service]');
  if (requested && field && [...field.options].some(option => option.value === requested)) field.value = requested;
  let sending = false;
  let pending = null;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || sent) return;
    const status = form.querySelector('[role=status]');
    if (!form.reportValidity()) return;
    const announce = text => {
      status.textContent = text;
      status.tabIndex = -1;
      status.focus({ preventScroll: true });
    };
    if (form.dataset.contactEnabled !== 'true') {
      announce(lang === 'de' ? 'Der Mailversand ist noch nicht freigeschaltet. Bitte schreiben Sie direkt an info@umweltmetrik.de.' : 'Email delivery is not enabled yet. Please email info@umweltmetrik.de directly.');
      return;
    }
    const data = { ...Object.fromEntries(new FormData(form)), lang };
    const fingerprint = JSON.stringify(data);
    if (!pending || pending.fingerprint !== fingerprint) pending = { fingerprint, id: crypto.randomUUID() };
    const button = form.querySelector('button[type=submit]');
    const label = button.querySelector('span');
    const originalLabel = label.textContent;
    sending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = lang === 'de' ? 'Wird gesendet …' : 'Sending …';
    status.textContent = '';
    try {
      const response = await fetch(form.dataset.contactEndpoint, {
        method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requestId: pending.id }), signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (response.ok && result.accepted === true) {
        sent = true;
        form.reset(); pending = null;
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      } else if (response.status === 429) {
        announce(lang === 'de' ? 'Es wurden bereits Anfragen übermittelt. Bitte versuchen Sie es später erneut oder schreiben Sie direkt an info@umweltmetrik.de.' : 'Enquiries have already been submitted. Please try again later or email info@umweltmetrik.de directly.');
      } else if (result.code === 'INVALID') {
        announce(lang === 'de' ? 'Bitte prüfen Sie Ihre E-Mail-Adresse und die Länge Ihrer Angaben.' : 'Please check your email address and the length of your entries.');
      } else throw new Error('Delivery not confirmed');
    } catch {
      // Keep the same ID and inputs after uncertainty; a retry cannot duplicate provider sends.
      announce(lang === 'de' ? 'Der Versand konnte nicht bestätigt werden. Ihre Angaben bleiben erhalten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@umweltmetrik.de.' : 'Delivery could not be confirmed. Your entries have been kept. Please try again or email info@umweltmetrik.de directly.');
    } finally {
      sending = false; button.disabled = sent;
      form.removeAttribute('aria-busy'); label.textContent = originalLabel;
    }
  });
}
