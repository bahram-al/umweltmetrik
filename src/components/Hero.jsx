import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
export default function Hero() {
 const { t } = useLanguage();
return <>
    <section className="hero">
        <div className="container hero-grid">
            <div>
                <span className="eyebrow">{t.hero.umweltmetrikEnvironmentWaterSoilWaste}</span>
                <h1>{t.hero.reliableSamplingStartsBeforeAnalysis}</h1>
                <p>{t.hero.planningExecutionAndDocumentationOfEnvironmentalSampling}</p>
                <div className="actions"><Link className="btn primary" to="/contact">{t.hero.discussYourProject}</Link><Link className="btn light" to="/services">{t.hero.exploreServices}</Link></div>
            </div>
            <aside className="hero-card" aria-label={t.hero.areasOfExpertise}>
                <span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.hero.technicalExpertise}</span>
                <ul><li>{t.hero.groundwaterSurfaceWaterDrinkingWater}</li><li>{t.hero.soilSoilGasContaminatedSites}</li><li>{t.hero.wasteStockpileSampling}</li><li>{t.hero.monitoringOnSiteMeasurements}</li><li>{t.hero.samplingLocationsFieldDocumentation}</li></ul>
                <div className="metric"><div><b>{t.hero.label15Years}</b><span>{t.hero.fieldProjectExperience}</span></div><div><b>{t.hero.mSc}</b><span>{t.hero.geology}</span></div><div><b>{t.hero.vdi6023A}</b><span>{t.hero.drinkingWaterHygiene}</span></div><div><b>{t.hero.isoIec17025}</b><span>{t.hero.qualityManagementAuditExperience}</span></div></div>
            </aside>
        </div>
    </section>
    <div className="trust"><div className="container trust-row"><span>{t.hero.dinEnIso5667}</span><span>{t.hero.dinEnIso19458}</span><span>{t.hero.vdi6023}</span><span>{t.hero.lagaPn98}</span><span>{t.hero.bbodschv}</span><span>{t.hero.dinEnIsoIec17025}</span></div></div>


</>;
}
