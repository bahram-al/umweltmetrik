import { useState } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
export const CONTACT_ENDPOINT = 'https://umweltmetrik-contact.alibahramali.workers.dev';
export default function App() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Contact request failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    } finally { setSending(false); }
  }
  return <>

<header>
    <div className="container nav">
        <a className="brand" href="#top">{t.nav.umweltmetrik}<small>{t.nav.environmentalSamplingMonitoringEngineeringServices}</small></a>
        <nav className="links" aria-label={t.nav.mainNavigation}>
            <a href="#leistungen">{t.nav.services}</a><a href="#qualitaet">{t.nav.qualityStandards}</a><a href="#labore">{t.nav.forLaboratories}</a><a href="#ueber-mich">{t.nav.aboutMe}</a><LanguageSwitcher onSelect={() => setMenuOpen(false)} /><a className="cta" href="#kontakt">{t.nav.discussYourProject}</a>
        </nav>
        <button className="menu" id="menu" aria-label={t.nav.openMenu} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile">{t.nav.symbol9}</button>
    </div>
</header>
<div className={`mobile ${menuOpen ? "open" : ""}`} id="mobile" onClick={(event) => { if (event.target.closest("a")) setMenuOpen(false); }}><a href="#leistungen">{t.nav.services}</a><a href="#qualitaet">{t.nav.qualityStandards}</a><a href="#labore">{t.nav.forLaboratories}</a><a href="#ueber-mich">{t.nav.aboutMe}</a><a href="#kontakt">{t.nav.discussYourProject}</a><LanguageSwitcher onSelect={() => setMenuOpen(false)} /></div>

<main id="top">
    <section className="hero">
        <div className="container hero-grid">
            <div>
                <span className="eyebrow">{t.hero.umweltmetrikEnvironmentWaterSoilWaste}</span>
                <h1>{t.hero.reliableSamplingStartsBeforeAnalysis}</h1>
                <p>{t.hero.planningExecutionAndDocumentationOfEnvironmentalSampling}</p>
                <div className="actions"><a className="btn primary" href="#kontakt">{t.hero.discussYourProject}</a><a className="btn light" href="#leistungen">{t.hero.exploreServices}</a></div>
            </div>
            <aside className="hero-card" aria-label={t.hero.areasOfExpertise}>
                <span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.hero.technicalExpertise}</span>
                <ul><li>{t.hero.groundwaterSurfaceWaterDrinkingWater}</li><li>{t.hero.soilSoilGasContaminatedSites}</li><li>{t.hero.wasteStockpileSampling}</li><li>{t.hero.monitoringOnSiteMeasurements}</li><li>{t.hero.samplingLocationsFieldDocumentation}</li></ul>
                <div className="metric"><div><b>{t.hero.label15Years}</b><span>{t.hero.fieldProjectExperience}</span></div><div><b>{t.hero.mSc}</b><span>{t.hero.geology}</span></div><div><b>{t.hero.vdi6023A}</b><span>{t.hero.drinkingWaterHygiene}</span></div><div><b>{t.hero.isoIec17025}</b><span>{t.hero.qualityManagementAuditExperience}</span></div></div>
            </aside>
        </div>
    </section>
    <div className="trust"><div className="container trust-row"><span>{t.hero.dinEnIso5667}</span><span>{t.hero.dinEnIso19458}</span><span>{t.hero.vdi6023}</span><span>{t.hero.lagaPn98}</span><span>{t.hero.bbodschv}</span><span>{t.hero.dinEnIsoIec17025}</span></div></div>

    <section id="leistungen">
        <div className="container">
            <div className="section-head"><div><span className="eyebrow">{t.nav.services}</span><h2>{t.leistungen.onePointOfContactForFieldwork}</h2></div><p>{t.leistungen.servicesAreDefinedByTheInvestigationObjective}</p></div>
            <div className="grid">
                <article className="card"><div className="icon">{t.leistungen.symbol38}</div><h3>{t.leistungen.groundwater}</h3><p>{t.leistungen.samplingMonitoringWellSurveysGroundwaterLevelsAnd}</p><ul><li>{t.leistungen.groundwaterSampling}</li><li>{t.leistungen.onSiteParameters}</li><li>{t.leistungen.synchronousWaterLevelSurveys}</li><li>{t.leistungen.flowDirectionGroundwaterContours}</li></ul><span className="tag">{t.leistungen.iso566711}</span><span className="tag">{t.leistungen.dinEnIso56673}</span></article>
                <article className="card"><div className="icon">{t.leistungen.symbol47}</div><h3>{t.leistungen.drinkingWater}</h3><p>{t.leistungen.microbiologicalAndChemicalSamplingAndAssessmentOf}</p><ul><li>{t.leistungen.legionella}</li><li>{t.leistungen.temperaturesDocumentation}</li><li>{t.leistungen.systemWideInvestigations}</li><li>{t.leistungen.samplingLocations}</li></ul><span className="tag">{t.hero.dinEnIso19458}</span><span className="tag">{t.hero.vdi6023}</span><span className="tag">{t.leistungen.uba}</span></article>
                <article className="card"><div className="icon">{t.leistungen.symbol55}</div><h3>{t.leistungen.surfaceWater}</h3><p>{t.leistungen.samplingOfFlowingAndStandingWatersFor}</p><ul><li>{t.leistungen.streamsRivers}</li><li>{t.leistungen.lakesPonds}</li><li>{t.leistungen.samplingDepthSiteData}</li><li>{t.leistungen.onSiteParameters}</li></ul><span className="tag">{t.leistungen.dinEnIso56676}</span><span className="tag">{t.leistungen.iso56674}</span></article>
                <article className="card"><div className="icon">{t.leistungen.symbol63}</div><h3>{t.leistungen.soilContaminatedSites}</h3><p>{t.leistungen.geologicalDescriptionSamplingAndFieldDocumentationFor}</p><ul><li>{t.leistungen.horizonAndLayerSpecificSamples}</li><li>{t.leistungen.soilDescription}</li><li>{t.leistungen.boreholeLogs}</li><li>{t.leistungen.contaminatedSiteInvestigations}</li></ul><span className="tag">{t.hero.bbodschv}</span><span className="tag">{t.leistungen.ka5}</span></article>
                <article className="card"><div className="icon">{t.leistungen.symbol71}</div><h3>{t.leistungen.wasteStockpiles}</h3><p>{t.leistungen.representativeSamplingOfSolidAndSemiSolid}</p><ul><li>{t.leistungen.stockpiles}</li><li>{t.leistungen.mineralMaterials}</li><li>{t.leistungen.hotSpots}</li><li>{t.leistungen.wasteWood}</li></ul><span className="tag">{t.hero.lagaPn98}</span><span className="tag">{t.leistungen.din19698}</span></article>
                <article className="card"><div className="icon">{t.leistungen.symbol79}</div><h3>{t.leistungen.monitoringFieldServices}</h3><p>{t.leistungen.planningAndExecutionOfRecurringInvestigationsWith}</p><ul><li>{t.leistungen.samplingPlans}</li><li>{t.leistungen.monitoringWellManagement}</li><li>{t.leistungen.photographicDocumentation}</li><li>{t.leistungen.laboratoryHandoverLogistics}</li></ul><span className="tag">{t.leistungen.projectSpecific}</span><span className="tag">{t.leistungen.qualityFocused}</span></article>
            </div>
        </div>
    </section>

    <section className="dark" id="prozess">
        <div className="container">
            <div className="section-head"><div><span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.prozess.ourApproach}</span><h2>{t.prozess.fromInvestigationObjectivesToReliableSamples}</h2></div><p>{t.prozess.theWebsiteFollowsTheSamePrinciplesAs}</p></div>
            <div className="process"><div className="step"><em>{t.prozess.label01}</em><h3>{t.prozess.defineTheScope}</h3><p>{t.prozess.sampleMediumObjectivesParametersLocationAndProject}</p></div><div className="step"><em>{t.prozess.label02}</em><h3>{t.prozess.planTheSampling}</h3><p>{t.prozess.locationsProceduresContainersPreservationAndMeasurementEquipment}</p></div><div className="step"><em>{t.prozess.label03}</em><h3>{t.prozess.carryOutFieldwork}</h3><p>{t.prozess.properSampleCollectionAndRecordingOfRelevant}</p></div><div className="step"><em>{t.prozess.label04}</em><h3>{t.prozess.documentTheWork}</h3><p>{t.prozess.clearSampleIdentificationSiteConditionsMeasurementsAnd}</p></div><div className="step"><em>{t.prozess.label05}</em><h3>{t.prozess.handOverSamples}</h3><p>{t.prozess.sampleManagementTransportPreparationAndOrderlyLaboratory}</p></div></div>
        </div>
    </section>

    <section className="standards" id="qualitaet">
        <div className="container">
            <div className="section-head"><div><span className="eyebrow">{t.nav.qualityStandards}</span><h2>{t.qualitaet.applyTheRightStandardsToEachProject}</h2></div><p>{t.qualitaet.theStandardsBelowIllustrateRelevantTechnicalReferences}</p></div>
            <div className="standards-grid">
                <div className="standard"><b>{t.qualitaet.waterSamplesDinEnIso56673}</b><small>{t.qualitaet.preservationHandlingTransportAndStorageOfWater}</small></div>
                <div className="standard"><b>{t.qualitaet.flowingWatersDinEnIso56676}</b><small>{t.qualitaet.planningAndExecutionOfSamplingFromRivers}</small></div>
                <div className="standard"><b>{t.qualitaet.microbiologyDinEnIso19458200612}</b><small>{t.qualitaet.samplingForMicrobiologicalAnalysisDrinkingWaterRequirements}</small></div>
                <div className="standard"><b>{t.qualitaet.drinkingWaterHygieneVdi6023Blatt1}</b><small>{t.qualitaet.hygieneInDrinkingWaterInstallationsRequirementsFor}</small></div>
                <div className="standard"><b>{t.qualitaet.legionellaTrinkwvUbaGuidance}</b><small>{t.qualitaet.systemWideInvestigationsRepresentativeSamplingLocationsAnd}</small></div>
                <div className="standard"><b>{t.qualitaet.soilBbodschv}</b><small>{t.qualitaet.preliminaryInvestigationsRepresentativeSamplingSoilDescriptionAnd}</small></div>
                <div className="standard"><b>{t.qualitaet.wasteLagaPn98Din19698Series}</b><small>{t.qualitaet.samplingStrategiesForSolidAndSemiSolid}</small></div>
                <div className="standard"><b>{t.qualitaet.swimmingPoolWaterDin1964312023}</b><small>{t.qualitaet.generalRequirementsForTreatmentWaterQualitySampling}</small></div>
            </div>
            <div className="note"><strong>{t.qualitaet.technicalNote}</strong> {t.qualitaet.thisWebsiteDoesNotMakeBlanketPromises}</div>
        </div>
    </section>

    <section id="labore" className="labs"><div className="container">
        <div className="labs-box"><div><span className="eyebrow">{t.labore.forLaboratoriesEngineeringFirms}</span><h2 style={{"fontSize": "2.5rem", "lineHeight": "1.05", "letterSpacing": "-.035em"}}>{t.labore.additionalFieldCapacityThatFitsYourTechnical}</h2><p style={{"color": "var(--muted)"}}>{t.labore.projectBasedOrOngoingSupportWithSampling}</p><a className="btn primary" href="#kontakt">{t.labore.discussACollaboration}</a></div><div><h3>{t.labore.waysWeCanSupportYou}</h3><ul><li>{t.labore.samplingRounds}</li><li>{t.labore.monitoringCampaigns}</li><li>{t.labore.peakWorkloadSupport}</li><li>{t.labore.holidaySicknessCover}</li><li>{t.labore.regionalFieldAssignments}</li><li>{t.labore.samplingToLaboratorySops}</li><li>{t.labore.onSiteMeasurements}</li><li>{t.labore.monitoringWellSurveys}</li><li>{t.leistungen.photographicDocumentation}</li><li>{t.labore.sampleLogistics}</li></ul></div></div>
    </div></section>

    <section id="ueber-mich"><div className="container about">
        <aside className="profile"><span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.nav.aboutMe}</span><h3></h3><p>{t.ueber_mich.geologistWithAnEngineeringBackgroundAndExtensive}</p><div className="facts"><div><b>{t.ueber_mich.label2011}</b><small>{t.ueber_mich.startOfGeologicalFieldwork}</small></div><div><b>{t.ueber_mich.since2017}</b><small>{t.ueber_mich.focusOnEnvironmentalSampling}</small></div><div><b>{t.ueber_mich.since2022}</b><small>{t.ueber_mich.teamLeadershipProjectResponsibility}</small></div><div><b>{t.ueber_mich.label2Degrees}</b><small>{t.ueber_mich.geologyNaturalResources}</small></div></div></aside>
        <div className="about-text"><span className="eyebrow">{t.ueber_mich.academicProfessionalBackground}</span><h2 style={{"fontSize": "3rem", "lineHeight": "1.04", "letterSpacing": "-.04em"}}>{t.ueber_mich.geoscientificExpertiseMeetsPracticalFieldExperience}</h2><p>{t.ueber_mich.myAcademicBackgroundIncludesA} <strong>{t.ueber_mich.masterOfScienceInGeology}</strong> {t.ueber_mich.specialisingInStratigraphyAndPalaeontologyAndA} <strong>{t.ueber_mich.bachelorSDegreeInNaturalResourcesEngineering}</strong>{t.ueber_mich.bothDegreesAreRecognisedInGermany}</p><p>{t.ueber_mich.myCareerBeganWithGeologicalFieldworkAnd}</p><h3>{t.ueber_mich.selectedQualifications}</h3>
            <div className="qualification"><b>{t.ueber_mich.vdi6023CategoryA}</b><small>{t.ueber_mich.hygieneInDrinkingWaterInstallations}</small></div>
            <div className="qualification"><b>{t.ueber_mich.vdi6022CategoryA}</b><small>{t.ueber_mich.hygieneInVentilationAndAirConditioningSystems}</small></div>
            <div className="qualification"><b>{t.ueber_mich.drinkingWaterSampling}</b><small>{t.ueber_mich.dinEnIso19458DinEnIso}</small></div>
            <div className="qualification"><b>{t.hero.lagaPn98}</b><small>{t.ueber_mich.technicalCompetenceInWasteSampling}</small></div>
            <div className="qualification"><b>{t.hero.dinEnIsoIec17025}</b><small>{t.ueber_mich.internalTechnicalAuditorWithPracticalExperienceIn}</small></div>
            <div className="qualification"><b>{t.ueber_mich.dguvRegel101004}</b><small>{t.ueber_mich.occupationalSafetyAndHealthWhenWorkingIn}</small></div>
        </div></div></section>

    <section id="kontakt" style={{"background": "var(--bg)"}}><div className="container contact">
        <div className="contact-card"><span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.kontakt.contact}</span><h2 style={{"fontSize": "2.6rem", "lineHeight": "1.05"}}>{t.kontakt.startWithATechnicalAssessmentOfYour}</h2><p>{t.kontakt.thisFormRequestsOnlyTheInformationUseful}</p><p><strong></strong><br />{t.kontakt.berlinFieldAssignmentsByArrangement}</p><p><strong>{t.kontakt.email}</strong><br />{t.kontakt.infoUmweltmetrikDe}<br /><br /><strong>{t.kontakt.phone}</strong><br />{t.kontakt.businessPhoneNumber}</p></div>
        <form className="form" id="contact-form" onSubmit={submit} noValidate>
            <div className="field"><label htmlFor="company">{t.kontakt.companyClient}</label><input id="company" name="company" autoComplete="organization" onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <div className="field"><label htmlFor="name">{t.kontakt.contactPerson}</label><input id="name" name="name" autoComplete="name" required onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <div className="field"><label htmlFor="email">{t.kontakt.emailLabel}</label><input id="email" name="email" type="email" autoComplete="email" required onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <div className="field"><label htmlFor="phone">{t.kontakt.phone}</label><input id="phone" name="phone" autoComplete="tel" onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <div className="field"><label htmlFor="place">{t.kontakt.projectLocationPostcode}</label><input id="place" name="place" onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <div className="field"><label htmlFor="service">{t.kontakt.serviceArea}</label><select id="service" name="service"><option value="">{t.kontakt.pleaseSelect}</option><option value="groundwater">{t.leistungen.groundwater}</option><option value="drinking_water">{t.leistungen.drinkingWater}</option><option value="surface_water">{t.leistungen.surfaceWater}</option><option value="soil_contaminated_sites">{t.kontakt.soilContaminatedSites}</option><option value="waste_stockpiles">{t.kontakt.wasteStockpiles}</option><option value="monitoring">{t.kontakt.monitoringOtherFieldServices}</option></select></div>
            <div className="field full"><label htmlFor="message">{t.kontakt.projectInvestigationObjectivePreferredDate}</label><textarea id="message" name="message" required placeholder={t.kontakt.eG6GroundwaterMonitoringWellsMonitoring} onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")}></textarea></div>
            <div className="hp" aria-hidden="true"><label htmlFor="website">{t.kontakt.website}</label><input id="website" name="website" tabIndex="-1" autoComplete="off" onInvalid={(event) => event.target.setCustomValidity(event.target.validity.valueMissing ? t.form.required : t.form.emailInvalid)} onInput={(event) => event.target.setCustomValidity("")} /></div>
            <p id="form-status" className={`form-status ${status ? "show " + (status === "success" ? "ok" : "error") : ""}`} role="status" aria-live="polite">{status && t.form[status]}</p>
            <button className="submit" id="submit-button" type="submit" disabled={sending}>{sending ? t.form.sending : t.form.send}</button>
        </form>
    </div></section>
</main>

<footer><div className="container">
    <div className="footer-grid"><div>
        <strong>{t.nav.umweltmetrik}</strong><br />
        <small>{t.nav.environmentalSamplingMonitoringEngineeringServices}</small></div><div><strong>{t.footer.navigation}</strong><br /><small>{t.nav.services}<br />{t.nav.qualityStandards}<br />{t.nav.aboutMe}<br />{t.kontakt.contact}</small></div><div><strong>{t.footer.legalInformation}</strong><br /><small>{t.footer.legalNotice}<br />{t.footer.privacyPolicy}<br />{t.footer.cookieTrackingSettingsIfRequired}</small></div></div><div className="legal"><span>{t.footer.prototypeStandardsReviewedOn18September2026}</span><span>{t.footer.beforePublicationObtainAFinalLegalAnd}</span></div></div></footer>


</>;
}
