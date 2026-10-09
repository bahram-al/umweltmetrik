import {Link} from 'react-router-dom';
import {useLanguage} from '../i18n/LanguageContext';
import {useState} from 'react';

export const CONTACT_ENDPOINT = 'https://umweltmetrik-contact.alibahramali.workers.dev';
export default function Contact() {
    const {t} = useLanguage();
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null);

    async function submit(event) {
        event.preventDefault();
        if (sending) return;
        const form = event.currentTarget;
        setStatus(null);
        if (!form.reportValidity()) return;
        const payload = Object.fromEntries(new FormData(form).entries());
        setSending(true);
        try {
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Contact request failed');
            form.reset();
            setStatus('success');
        } catch {
            setStatus('error');
        } finally {
            setSending(false);
        }
    }

    return <>
        <section id="kontakt" style={{"background": "var(--bg)"}}>
            <div className="container contact">
                <div className="contact-card"><span className="eyebrow"
                                                    style={{"color": "#8dd1cb"}}>{t.kontakt.contact}</span><h1 style={{
                    "fontSize": "2.6rem",
                    "lineHeight": "1.05"
                }}>{t.kontakt.startWithATechnicalAssessmentOfYour}</h1>
                    <p>{t.kontakt.thisFormRequestsOnlyTheInformationUseful}</p><p>
                        <strong></strong><br/>{t.kontakt.berlinFieldAssignmentsByArrangement}</p><p><a
                        href="mailto:info@umweltmetrik.de">{t.kontakt.infoUmweltmetrikDe}</a></p></div>
                <form aria-busy={sending} className="form" id="contact-form" onSubmit={submit} noValidate>
                    <h2 className="form-group">{t.ui.contactDetails}</h2>
                    <div className="field"><label htmlFor="company">{t.kontakt.companyClient} <span
                        className="optional">({t.ui.optional})</span></label><input id="company" name="company"
                                                                                    autoComplete="organization"
                                                                                    onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                                                                                    onInput={(event) => event.target.setCustomValidity("")}/>
                    </div>
                    <div className="field"><label htmlFor="email">{t.kontakt.emailLabel}</label><input id="email"
                                                                                                       name="email"
                                                                                                       type="email"
                                                                                                       autoComplete="email"
                                                                                                       required
                                                                                                       onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                                                                                                       onInput={(event) => event.target.setCustomValidity("")}/>
                    </div>
                    <div className="field full"><label htmlFor="phone">{t.kontakt.phone} <span
                        className="optional">({t.ui.optional})</span></label><input id="phone" name="phone"
                                                                                    autoComplete="tel"
                                                                                    onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                                                                                    onInput={(event) => event.target.setCustomValidity("")}/>
                    </div>
                    <h2 className="form-group">{t.ui.projectDetails}</h2>
                    <div className="field"><label htmlFor="place">{t.kontakt.projectLocationPostcode} <span
                        className="optional">({t.ui.optional})</span></label><input id="place" name="place"
                                                                                    onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                                                                                    onInput={(event) => event.target.setCustomValidity("")}/>
                    </div>
                    <div className="field"><label htmlFor="service">{t.kontakt.serviceArea} <span
                        className="optional">({t.ui.optional})</span></label><select id="service" name="service">
                        <option value="">{t.kontakt.pleaseSelect}</option>
                        <option value="groundwater">{t.leistungen.groundwater}</option>
                        <option value="drinking_water">{t.leistungen.drinkingWater}</option>
                        <option value="surface_water">{t.leistungen.surfaceWater}</option>
                        <option value="soil_contaminated_sites">{t.kontakt.soilContaminatedSites}</option>
                        <option value="waste_stockpiles">{t.kontakt.wasteStockpiles}</option>
                        <option value="monitoring">{t.kontakt.monitoringOtherFieldServices}</option>
                    </select></div>
                    <div className="field full"><label
                        htmlFor="message">{t.kontakt.projectInvestigationObjectivePreferredDate}</label><textarea
                        id="message" name="message" required
                        placeholder={t.kontakt.eG6GroundwaterMonitoringWellsMonitoring}
                        onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                        onInput={(event) => event.target.setCustomValidity("")}></textarea></div>
                    <div className="hp" aria-hidden="true"><label htmlFor="website">{t.kontakt.website}</label><input
                        id="website" name="website" tabIndex="-1" autoComplete="off"
                        onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)}
                        onInput={(event) => event.target.setCustomValidity("")}/></div>
                    <p id="form-status"
                       className={`form-status ${status ? "show " + (status === "success" ? "ok" : "error") : ""}`}
                       role={status === "error" ? "alert" : "status"} aria-live="polite">{status && t.form[status]}</p>
                    <button className="submit" id="submit-button" type="submit"
                            disabled={sending}>{sending ? t.form.sending : t.form.send}</button>
                </form>
            </div>
        </section>

    </>;
}
