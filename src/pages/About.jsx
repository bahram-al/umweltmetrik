import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
export default function About() {
 const { t } = useLanguage();
return <>
    <section id="ueber-mich"><div className="container about">
        <aside className="profile"><span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.nav.aboutMe}</span><p>{t.ueber_mich.geologistWithAnEngineeringBackgroundAndExtensive}</p><div className="facts"><div><b>{t.ueber_mich.label2011}</b><small>{t.ueber_mich.startOfGeologicalFieldwork}</small></div><div><b>{t.ueber_mich.since2017}</b><small>{t.ueber_mich.focusOnEnvironmentalSampling}</small></div><div><b>{t.ueber_mich.since2022}</b><small>{t.ueber_mich.teamLeadershipProjectResponsibility}</small></div><div><b>{t.ueber_mich.label2Degrees}</b><small>{t.ueber_mich.geologyNaturalResources}</small></div></div></aside>
        <div className="about-text"><span className="eyebrow">{t.ueber_mich.academicProfessionalBackground}</span><h1 style={{"fontSize": "3rem", "lineHeight": "1.04", "letterSpacing": "-.04em"}}>{t.ueber_mich.geoscientificExpertiseMeetsPracticalFieldExperience}</h1><p>{t.ueber_mich.myAcademicBackgroundIncludesA} <strong>{t.ueber_mich.masterOfScienceInGeology}</strong> {t.ueber_mich.specialisingInStratigraphyAndPalaeontologyAndA} <strong>{t.ueber_mich.bachelorSDegreeInNaturalResourcesEngineering}</strong>{t.ueber_mich.bothDegreesAreRecognisedInGermany}</p><p>{t.ueber_mich.myCareerBeganWithGeologicalFieldworkAnd}</p><h3>{t.ueber_mich.selectedQualifications}</h3>
            <div className="qualification"><b>{t.ueber_mich.vdi6023CategoryA}</b><small>{t.ueber_mich.hygieneInDrinkingWaterInstallations}</small></div>
            <div className="qualification"><b>{t.ueber_mich.vdi6022CategoryA}</b><small>{t.ueber_mich.hygieneInVentilationAndAirConditioningSystems}</small></div>
            <div className="qualification"><b>{t.ueber_mich.drinkingWaterSampling}</b><small>{t.ueber_mich.dinEnIso19458DinEnIso}</small></div>
            <div className="qualification"><b>{t.hero.lagaPn98}</b><small>{t.ueber_mich.technicalCompetenceInWasteSampling}</small></div>
            <div className="qualification"><b>{t.hero.dinEnIsoIec17025}</b><small>{t.ueber_mich.internalTechnicalAuditorWithPracticalExperienceIn}</small></div>
            <div className="qualification"><b>{t.ueber_mich.dguvRegel101004}</b><small>{t.ueber_mich.occupationalSafetyAndHealthWhenWorkingIn}</small></div>
        </div></div></section>


</>;
}
