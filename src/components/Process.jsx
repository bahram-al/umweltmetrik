import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
export default function Process() {
 const { t } = useLanguage();
return <>
    <section className="dark" id="prozess">
        <div className="container">
            <div className="section-head"><div><span className="eyebrow" style={{"color": "#8dd1cb"}}>{t.prozess.ourApproach}</span><h2>{t.prozess.fromInvestigationObjectivesToReliableSamples}</h2></div><p>{t.prozess.theWebsiteFollowsTheSamePrinciplesAs}</p></div>
            <div className="process"><div className="step"><em>{t.prozess.label01}</em><h3>{t.prozess.defineTheScope}</h3><p>{t.prozess.sampleMediumObjectivesParametersLocationAndProject}</p></div><div className="step"><em>{t.prozess.label02}</em><h3>{t.prozess.planTheSampling}</h3><p>{t.prozess.locationsProceduresContainersPreservationAndMeasurementEquipment}</p></div><div className="step"><em>{t.prozess.label03}</em><h3>{t.prozess.carryOutFieldwork}</h3><p>{t.prozess.properSampleCollectionAndRecordingOfRelevant}</p></div><div className="step"><em>{t.prozess.label04}</em><h3>{t.prozess.documentTheWork}</h3><p>{t.prozess.clearSampleIdentificationSiteConditionsMeasurementsAnd}</p></div><div className="step"><em>{t.prozess.label05}</em><h3>{t.prozess.handOverSamples}</h3><p>{t.prozess.sampleManagementTransportPreparationAndOrderlyLaboratory}</p></div></div>
        </div>
    </section>


</>;
}
