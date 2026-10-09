import {useEffect, useRef, useState} from 'react';
import {HashRouter, Link, NavLink, Route, Routes, useLocation} from 'react-router-dom';
import {useLanguage} from './i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import PrivacyNotice from './components/PrivacyNotice';
import Home from './pages/Home';
import Services from './pages/Services';
import Quality from './pages/Quality';
import Laboratories from './pages/Laboratories';
import About from './pages/About';
import Contact from './pages/Contact';

export {CONTACT_ENDPOINT} from './pages/Contact';
const navigation = [['/services', 'services'], ['/quality', 'qualityStandards'], ['/laboratories', 'forLaboratories'], ['/about', 'aboutMe']];

function Site() {
    const {t, language} = useLanguage();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef(null);
    const main = useRef(null);
    useEffect(() => {
        const seo = t.routes[location.pathname.slice(1)] || t.seo;
        document.title = seo.title;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.append(meta);
        }
        meta.content = seo.description;
    }, [location.pathname, t, language]);
    useEffect(() => {
        setMenuOpen(false);
        if (location.hash) {
            requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
        } else {
            window.scrollTo({top: 0, behavior: 'instant'});
            main.current?.focus({preventScroll: true});
        }
    }, [location.pathname, location.hash]);
    useEffect(() => {
        if (!menuOpen) return;

        function escape(e) {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                menuButton.current?.focus();
            }
        }

        document.addEventListener('keydown', escape);
        return () => document.removeEventListener('keydown', escape);
    }, [menuOpen]);
    const navLinks = () => navigation.map(([path, key]) => <NavLink key={path} to={path}>{t.nav[key]}</NavLink>);
    return <><a className="skip-link" href="#main-content" onClick={e => {
        e.preventDefault();
        main.current?.focus();
    }}>{t.ui.skip}</a>
        <header>
            <div className="container nav"><Link className="brand" to="/" translate="no"><img className="brand-logo"
                                                                                              src="/images/UmweltMetrik-Logo.png"
                                                                                              alt="UmweltMetrik"/></Link>
                <nav className="links" aria-label={t.nav.mainNavigation}>{navLinks()}<LanguageSwitcher/><NavLink
                    className="btn primary cta" to="/contact">{t.nav.discussYourProject}</NavLink></nav>
                <button ref={menuButton} className="menu" id="menu"
                        aria-label={menuOpen ? t.ui.closeMenu : t.nav.openMenu} aria-expanded={menuOpen}
                        aria-controls="mobile" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
            </div>
            <nav className="mobile" hidden={!menuOpen} id="mobile" aria-label={t.nav.mainNavigation} onClick={e => {
                if (e.target.closest('a')) setMenuOpen(false);
            }}>{navLinks()}<NavLink className="btn primary"
                                    to="/contact">{t.nav.discussYourProject}</NavLink><LanguageSwitcher
                onSelect={() => setMenuOpen(false)}/></nav>
        </header>
        <main ref={main} id="main-content" tabIndex="-1"><Routes><Route path="/" element={<Home/>}/><Route
            path="/services" element={<Services/>}/><Route path="/quality" element={<Quality/>}/><Route
            path="/laboratories" element={<Laboratories/>}/><Route path="/about" element={<About/>}/><Route
            path="/contact" element={<Contact/>}/><Route path="*" element={<section className="container">
            <h1>{t.ui.notFound}</h1><Link to="/">{t.ui.backHome}</Link></section>}/></Routes></main>
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div><strong translate="no">{t.nav.umweltmetrik}</strong>
                        <p>{t.nav.environmentalSamplingMonitoringEngineeringServices}</p></div>
                    <nav aria-label={t.footer.navigation}><Link to="/">{t.ui.home}</Link>{navLinks()}<Link
                        to="/contact">{t.kontakt.contact}</Link></nav>
                </div>
                <PrivacyNotice/>

            </div>
        </footer>
    </>;
}

export default function App() {
    return <HashRouter><Site/></HashRouter>
}
