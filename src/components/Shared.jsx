import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
export function PageIntro({ title, description, eyebrow }) {
 return <section className="page-intro"><div className="container"><span className="eyebrow">{eyebrow || 'UmweltMetrik'}</span><h1>{title}</h1><p>{description}</p></div></section>;
}
export function ContactCTA() {
 const {t}=useLanguage();
 return <section className="final-cta"><div className="container"><div><span className="eyebrow">{t.kontakt.contact}</span><h2>{t.ui.projectCTA}</h2></div><Link className="btn primary" to="/contact">{t.nav.discussYourProject}</Link></div></section>;
}
