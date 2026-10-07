import { useState } from 'react'

const CONTACT_ENDPOINT = 'https://umweltmetrik-contact.alibahramali.workers.dev'

const services = [
  {
    icon: '💧',
    title: 'Grundwasser',
    text: 'Probenahme, Messstellenaufnahme, Grundwasserstände und Monitoring.',
    items: ['Grundwasserprobenahme', 'Vor-Ort-Parameter', 'Stichtagsmessungen', 'Fließrichtung / Grundwassergleichen'],
    tags: ['ISO 5667-11', 'DIN EN ISO 5667-3'],
  },
  {
    icon: '🚰',
    title: 'Trinkwasser',
    text: 'Mikrobiologische und chemische Probenahmen sowie Aufnahme geeigneter Probenahmestellen.',
    items: ['Legionellen', 'Temperaturen & Dokumentation', 'Systemische Untersuchungen', 'Probenahmestellen'],
    tags: ['DIN EN ISO 19458', 'VDI 6023', 'UBA'],
  },
  {
    icon: '🌊',
    title: 'Oberflächenwasser',
    text: 'Probenahmen aus Fließ- und Stillgewässern für umwelttechnische Untersuchungen.',
    items: ['Bäche & Flüsse', 'Seen & Teiche', 'Entnahmetiefe & Standortdaten', 'Vor-Ort-Parameter'],
    tags: ['DIN EN ISO 5667-6', 'ISO 5667-4'],
  },
  {
    icon: '🌱',
    title: 'Boden & Altlasten',
    text: 'Geologische Ansprache, Probenahme und Felddokumentation im Altlastenkontext.',
    items: ['Horizont-/schichtbezogene Proben', 'Bodenansprache', 'Schichtenverzeichnisse', 'Altlastenuntersuchungen'],
    tags: ['BBodSchV', 'KA5'],
  },
  {
    icon: '♻️',
    title: 'Abfall & Haufwerk',
    text: 'Repräsentative Probenahme von festen und stichfesten Materialien.',
    items: ['Haufwerke', 'Mineralische Materialien', 'Hot-Spots', 'Altholz'],
    tags: ['LAGA PN 98', 'DIN 19698'],
  },
  {
    icon: '🧭',
    title: 'Monitoring & Feldtechnik',
    text: 'Planung und Umsetzung wiederkehrender Untersuchungen mit nachvollziehbarer Dokumentation.',
    items: ['Probenahmeplanung', 'Messstellenmanagement', 'Fotodokumentation', 'Laborübergabe & Logistik'],
    tags: ['projektbezogen', 'QM-orientiert'],
  },
]

const processSteps = [
  ['01', 'Auftrag klären', 'Medium, Ziel, Parameter, Ort und projektspezifische Anforderungen.'],
  ['02', 'Probenahme planen', 'Stellen, Verfahren, Gefäße, Konservierung und Messtechnik.'],
  ['03', 'Vor Ort umsetzen', 'Fachgerechte Entnahme und Erfassung relevanter Feldparameter.'],
  ['04', 'Dokumentieren', 'Eindeutige Zuordnung, Randbedingungen, Messwerte und Auffälligkeiten.'],
  ['05', 'Übergeben', 'Probenmanagement, Transportvorbereitung und geordnete Laborübergabe.'],
]

const standards = [
  ['Wasserproben – DIN EN ISO 5667-3:2024-09', 'Konservierung, Handhabung, Transport und Lagerung von Wasserproben.'],
  ['Fließgewässer – DIN EN ISO 5667-6:2016-12', 'Planung und Durchführung der Probenahme aus Flüssen und Bächen; ergänzt durch A11:2022-04.'],
  ['Mikrobiologie – DIN EN ISO 19458:2006-12', 'Probenahme für mikrobiologische Untersuchungen; im Trinkwasserbereich abhängig vom Untersuchungszweck.'],
  ['Trinkwasserhygiene – VDI 6023 Blatt 1:2023-09', 'Hygiene in Trinkwasser-Installationen; Anforderungen an Planung, Ausführung, Betrieb und Instandhaltung.'],
  ['Legionellen – TrinkwV + UBA-Empfehlung', 'Systemische Untersuchungen, repräsentative Probenahmestellen und Untersuchungsablauf nach den jeweils geltenden Vorgaben.'],
  ['Boden – BBodSchV', 'Vorerkundung, repräsentative Probenahme, Bodenansprache und Dokumentation; konkrete Normbezüge ergeben sich aus der Fragestellung.'],
  ['Abfall – LAGA PN 98 / DIN 19698-Reihe', 'Probenahmestrategien für feste und stichfeste Materialien, Haufwerke und Hot-Spots.'],
  ['Badebeckenwasser – DIN 19643-1:2023-06', 'Allgemeine Anforderungen an Aufbereitung, Wasserqualität, Probenahmestellen und Betriebskontrolle.'],
]

const qualifications = [
  ['VDI 6023 Kategorie A', 'Hygiene in Trinkwasser-Installationen'],
  ['VDI 6022 Kategorie A', 'Hygiene in der Raumlufttechnik'],
  ['Trinkwasser-Probenahme', 'DIN EN ISO 19458 / DIN EN ISO 5667 – aktualisierte Fachkunde'],
  ['LAGA PN 98', 'Sachkunde Abfallprobenahme'],
  ['DIN EN ISO/IEC 17025', 'Interner Fachauditor und praktische Erfahrung in Qualitätssicherung und Auditbegleitung'],
  ['DGUV Regel 101-004', 'Sicherheit und Gesundheitsschutz bei Arbeiten in kontaminierten Bereichen'],
]

function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <header>
        <div className="container nav">
          <a className="brand" href="#top" onClick={close}>
            UMWELTMETRIK
            <small>Umweltprobenahme · Monitoring · Ingenieurdienstleistungen</small>
          </a>
          <nav className="links" aria-label="Hauptnavigation">
            <a href="#leistungen">Leistungen</a>
            <a href="#qualitaet">Qualität & Regelwerke</a>
            <a href="#labore">Für Labore</a>
            <a href="#ueber-mich">Über mich</a>
            <a className="cta" href="#kontakt">Projekt anfragen</a>
          </nav>
          <button className="menu" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menü öffnen" aria-expanded={open}>
            ☰
          </button>
        </div>
      </header>
      <div className={`mobile${open ? ' open' : ''}`}>
        <a href="#leistungen" onClick={close}>Leistungen</a>
        <a href="#qualitaet" onClick={close}>Qualität & Regelwerke</a>
        <a href="#labore" onClick={close}>Für Labore</a>
        <a href="#ueber-mich" onClick={close}>Über mich</a>
        <a href="#kontakt" onClick={close}>Projekt anfragen</a>
      </div>
    </>
  )
}

function ContactForm() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    setSending(true)
    setStatus({ type: '', message: '' })

    const payload = Object.fromEntries(new FormData(form).entries())

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || 'Die Anfrage konnte nicht gesendet werden.')
      }

      form.reset()
      setStatus({ type: 'ok', message: 'Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.' })
    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', message: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@umweltmetrik.de.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="company">Firma / Auftraggeber</label>
        <input id="company" name="company" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="name">Ansprechpartner *</label>
        <input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">E-Mail *</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="place">Einsatzort / PLZ</label>
        <input id="place" name="place" />
      </div>
      <div className="field">
        <label htmlFor="service">Leistungsbereich</label>
        <select id="service" name="service" defaultValue="">
          <option value="">Bitte wählen</option>
          <option>Grundwasser</option>
          <option>Trinkwasser</option>
          <option>Oberflächenwasser</option>
          <option>Boden / Altlasten</option>
          <option>Abfall / Haufwerk</option>
          <option>Monitoring / sonstige Feldleistung</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="message">Projekt / Untersuchungsziel / gewünschter Termin *</label>
        <textarea id="message" name="message" required placeholder="z. B. 6 Grundwassermessstellen, Monitoring, gewünschter Termin, Labor bereits festgelegt …" />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex="-1" autoComplete="off" />
      </div>
      {status.message && <p className={`form-status show ${status.type}`} role="status" aria-live="polite">{status.message}</p>}
      <button className="submit" type="submit" disabled={sending}>{sending ? 'Wird gesendet …' : 'Anfrage senden →'}</button>
    </form>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">UmweltMetrik · Umwelt · Wasser · Boden · Abfall</span>
              <h1>Fachgerechte Probenahme beginnt vor der Analyse.</h1>
              <p>Planung, Durchführung und Dokumentation von Umweltprobenahmen und Monitoringprojekten – mit geowissenschaftlichem Hintergrund, langjähriger Felderfahrung und konsequenter Orientierung an den jeweils einschlägigen Regelwerken.</p>
              <div className="actions">
                <a className="btn primary" href="#kontakt">Projekt anfragen →</a>
                <a className="btn light" href="#leistungen">Leistungen ansehen</a>
              </div>
            </div>
            <aside className="hero-card" aria-label="Schwerpunkte">
              <span className="eyebrow accent-eyebrow">Fachliche Schwerpunkte</span>
              <ul>
                <li>Grund-, Oberflächen- & Trinkwasser</li>
                <li>Boden, Bodenluft & Altlasten</li>
                <li>Abfall- & Haufwerksprobenahme</li>
                <li>Monitoring & Vor-Ort-Messungen</li>
                <li>Probenahmestellen & Felddokumentation</li>
              </ul>
              <div className="metric">
                <div><b>15+ Jahre</b><span>Feld- und Projekterfahrung</span></div>
                <div><b>M.Sc.</b><span>Geologie</span></div>
                <div><b>VDI 6023 A</b><span>Trinkwasserhygiene</span></div>
                <div><b>ISO/IEC 17025</b><span>QM- & Auditerfahrung</span></div>
              </div>
            </aside>
          </div>
        </section>

        <div className="trust">
          <div className="container trust-row">
            <span>DIN EN ISO 5667</span><span>DIN EN ISO 19458</span><span>VDI 6023</span><span>LAGA PN 98</span><span>BBodSchV</span><span>DIN EN ISO/IEC 17025</span>
          </div>
        </div>

        <section id="leistungen">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow">Leistungen</span><h2>Ein Ansprechpartner für die Arbeit im Feld.</h2></div>
              <p>Die Leistung wird nicht über eine starre Normenliste definiert, sondern über Untersuchungsziel, Medium, Probenahmesituation und die Anforderungen des jeweiligen Projekts. Regelwerke werden dort zugeordnet, wo sie fachlich tatsächlich einschlägig sind.</p>
            </div>
            <div className="grid">
              {services.map((service) => (
                <article className="card" key={service.title}>
                  <div className="icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  {service.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dark" id="prozess">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow accent-eyebrow">Arbeitsweise</span><h2>Vom Untersuchungsziel zur belastbaren Probe.</h2></div>
              <p>Die Nutzerführung der Website folgt demselben Prinzip wie die fachliche Arbeit: erst Ziel und Randbedingungen klären, dann Verfahren und Dokumentation festlegen.</p>
            </div>
            <div className="process">
              {processSteps.map(([number, title, text]) => (
                <div className="step" key={number}><em>{number}</em><h3>{title}</h3><p>{text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="standards" id="qualitaet">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow">Qualität & Regelwerke</span><h2>Normen richtig zuordnen statt nur aufzählen.</h2></div>
              <p>Die folgenden Regelwerke sind Beispiele für fachlich relevante Bezüge. Welche Anforderungen im konkreten Projekt gelten, hängt vom Untersuchungszweck, Rechtsbereich, Medium, Auftrag und ggf. den Vorgaben der beauftragenden Untersuchungsstelle ab.</p>
            </div>
            <div className="standards-grid">
              {standards.map(([title, text]) => <div className="standard" key={title}><b>{title}</b><small>{text}</small></div>)}
            </div>
            <div className="note"><strong>Fachlicher Hinweis:</strong> Die Website verspricht keine pauschale „Probenahme nach Norm X“. Vor jedem Projekt wird geprüft, welches Regelwerk für den konkreten Untersuchungszweck einschlägig ist. Bei gesetzlich geregelten Trinkwasseruntersuchungen erfolgt die Probenahme im Rahmen des Auftrags der zugelassenen Untersuchungsstelle.</div>
          </div>
        </section>

        <section id="labore" className="labs">
          <div className="container">
            <div className="labs-box">
              <div>
                <span className="eyebrow">Für Laboratorien & Ingenieurbüros</span>
                <h2 className="labs-title">Zusätzliche Kapazität im Außendienst – fachlich integrierbar.</h2>
                <p className="muted">Projektbezogene oder regelmäßige Unterstützung bei Probenahmen, Monitoring und Felddokumentation. Arbeitsanweisungen, Formblätter, Probengefäße, Konservierung, Transport und QM-Anforderungen können projektspezifisch abgestimmt werden.</p>
                <a className="btn primary" href="#kontakt">Zusammenarbeit anfragen</a>
              </div>
              <div>
                <h3>Mögliche Einsatzformen</h3>
                <ul><li>Probenahmetouren</li><li>Monitoringkampagnen</li><li>Auftragsspitzen</li><li>Urlaubs-/Krankheitsvertretung</li><li>Regionale Außendiensteinsätze</li><li>Probenahme nach Labor-SOP</li><li>Vor-Ort-Messungen</li><li>Messstellenaufnahme</li><li>Fotodokumentation</li><li>Probenlogistik</li></ul>
              </div>
            </div>
          </div>
        </section>

        <section id="ueber-mich">
          <div className="container about">
            <aside className="profile">
              <span className="eyebrow accent-eyebrow">Über mich</span>
              <p>Geologe mit ingenieurwissenschaftlichem Hintergrund und langjähriger Erfahrung in geologischer Feldarbeit, Umweltprobenahme, Monitoring und Qualitätssicherung.</p>
              <div className="facts">
                <div><b>2011</b><small>Beginn geologischer Feldarbeit</small></div>
                <div><b>seit 2017</b><small>Schwerpunkt Umweltprobenahme</small></div>
                <div><b>seit 2022</b><small>Leitungs- & Projektverantwortung</small></div>
                <div><b>2 Abschlüsse</b><small>Geologie & Natürliche Ressourcen</small></div>
              </div>
            </aside>
            <div className="about-text">
              <span className="eyebrow">Akademischer & beruflicher Hintergrund</span>
              <h2 className="about-title">Geowissenschaftliche Tiefe trifft praktische Felderfahrung.</h2>
              <p>Meine akademische Grundlage bilden ein <strong>Master of Science in Geologie</strong> mit Schwerpunkt Stratigraphie und Paläontologie sowie ein <strong>Bachelorabschluss im Ingenieurwesen für Natürliche Ressourcen</strong>. Beide Abschlüsse sind in Deutschland anerkannt.</p>
              <p>Die berufliche Laufbahn begann mit geologischen Feldarbeiten und seismischen Erkundungsprojekten. Später folgten die Leitung und Koordination von Bohrteams und großflächigen Erkundungsarbeiten. Seit 2017 liegt mein Schwerpunkt in der Umweltprobenahme und Altlastenbearbeitung; seit 2022 zusätzlich in der fachlichen und personellen Leitung sowie der Planung komplexer Probenahme- und Monitoringprojekte.</p>
              <h3>Ausgewählte Qualifikationen</h3>
              {qualifications.map(([title, text]) => <div className="qualification" key={title}><b>{title}</b><small>{text}</small></div>)}
            </div>
          </div>
        </section>

        <section id="kontakt" className="contact-section">
          <div className="container contact">
            <div className="contact-card">
              <span className="eyebrow accent-eyebrow">Kontakt</span>
              <h2 className="contact-title">Projekt technisch vorqualifizieren.</h2>
              <p>Das Formular fragt nur Informationen ab, die für eine erste Einschätzung wirklich hilfreich sind. Für sensible Projektunterlagen sollte später ein datenschutzkonformer Upload eingerichtet werden.</p>
              <p>Berlin · Einsätze nach Vereinbarung</p>
              <p><strong>E-Mail</strong><br />info@umweltmetrik.de<br /><br /><strong>Telefon</strong><br />[geschäftliche Telefonnummer]</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div><strong>UMWELTMETRIK</strong><br /><small>Umweltprobenahme · Monitoring · Ingenieurdienstleistungen</small></div>
            <div><strong>Navigation</strong><br /><small>Leistungen<br />Qualität & Regelwerke<br />Über mich<br />Kontakt</small></div>
            <div><strong>Rechtliches</strong><br /><small>Impressum<br />Datenschutz<br />Cookie-/Tracking-Einstellungen (falls erforderlich)</small></div>
          </div>
          <div className="legal"><span>Prototyp · Regelwerksstand geprüft am 18.09.2026</span><span>Vor Veröffentlichung: Impressum, Datenschutz, Firmenbezeichnung und Leistungsformulierungen final rechtlich/fachlich prüfen.</span></div>
        </div>
      </footer>
    </>
  )
}
