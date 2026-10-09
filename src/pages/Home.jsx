import {Link} from 'react-router-dom';
import {useLanguage} from '../i18n/LanguageContext';
import {services} from '../serviceData';
import Hero from '../components/Hero';
import Process from '../components/Process';
import {ContactCTA} from '../components/Shared';

export default function Home() {
    const {t} = useLanguage();
    return <><Hero/>
        <section>
            <div className="container">
                <div className="section-head">
                    <div><span className="eyebrow">{t.nav.services}</span>
                        <h2>{t.leistungen.onePointOfContactForFieldwork}</h2></div>
                    <p>{t.leistungen.servicesAreDefinedByTheInvestigationObjective}</p></div>
                <div className="grid service-overview">{services.map(s => <article className="card" key={s.id}>
                    <h3>{t.leistungen[s.title]}</h3><p>{t.leistungen[s.intro]}</p><Link className="text-link"
                                                                                        to={`/services#${s.id}`}>{t.ui.learnMore}
                    <span aria-hidden="true">→</span></Link></article>)}</div>
            </div>
        </section>
        <Process/>
        <section className="labs">
            <div className="container preview">
                <div><span className="eyebrow">{t.labore.forLaboratoriesEngineeringFirms}</span>
                    <h2>{t.labore.additionalFieldCapacityThatFitsYourTechnical}</h2>
                    <p>{t.labore.projectBasedOrOngoingSupportWithSampling}</p><Link className="text-link"
                                                                                    to="/laboratories">{t.ui.learnMore} →</Link>
                </div>
                <div><span className="eyebrow">{t.nav.aboutMe}</span><h2>{t.ui.aboutPreview}</h2>
                    <p>{t.ueber_mich.geologistWithAnEngineeringBackgroundAndExtensive}</p><Link className="text-link"
                                                                                                to="/about">{t.ui.learnMore} →</Link>
                </div>
            </div>
        </section>
        <ContactCTA/></>;
}
