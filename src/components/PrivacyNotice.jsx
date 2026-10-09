import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const PRIVACY_STORAGE_KEY = 'umweltmetrik-privacy';
const NOTICE_VERSION = 1;
function isAcknowledged() {
  try {
    const record = JSON.parse(localStorage.getItem(PRIVACY_STORAGE_KEY));
    return record?.version === NOTICE_VERSION && record?.acknowledged === true;
  } catch { return false; }
}

// Informational only: no optional technologies exist in the audited frontend.
export default function PrivacyNotice() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(() => !isAcknowledged());
  const [height, setHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const panel = useRef(null);
  const title = useRef(null);
  const trigger = useRef(null);
  const reopened = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (reopened.current) title.current?.focus({ preventScroll: true });
    setHeight(panel.current?.offsetHeight || 0);
    const observer = new ResizeObserver(() => setHeight(panel.current?.offsetHeight || 0));
    observer.observe(panel.current);
    return () => observer.disconnect();
  }, [open]);

  function close(acknowledge = false) {
    if (acknowledge) {
      try {
        localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify({ version: NOTICE_VERSION, acknowledged: true }));
      } catch { /* In-memory state still dismisses the notice for this visit. */ }
    }
    const hadFocus = panel.current?.contains(document.activeElement);
    setOpen(false);
    if (reopened.current) trigger.current?.focus({ preventScroll: true });
    else if (hadFocus) document.getElementById('main-content')?.focus({ preventScroll: true });
  }

  return <>
    <button className="privacy-settings" ref={trigger} type="button" aria-controls="privacy-notice" aria-expanded={open}
      onClick={() => {
        reopened.current = true;
        setExpanded(true);
        setOpen(true);
        title.current?.focus({ preventScroll: true });
      }}>{t.privacy.settings}</button>
    {open && <>
      {/* Reserve scrolling space so the fixed notice cannot hide the footer. */}
      <div aria-hidden="true" style={{ height: height + 24 }} />
      <div id="privacy-notice" className="privacy-notice" ref={panel} role="region" aria-labelledby="privacy-title" aria-describedby="privacy-summary"
        onKeyDown={event => {
          if (event.key === 'Escape') { event.stopPropagation(); close(); }
        }}>
        <div className="privacy-copy">
          <h2 id="privacy-title" ref={title} tabIndex={-1}>{t.privacy.title}</h2>
          <p id="privacy-summary">{t.privacy.summary}</p>
          <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
            <summary>{t.privacy.settings}</summary>
            <p>{t.privacy.storage}</p>
            <p>{t.privacy.control}</p>
            <p>{t.privacy.contact}</p>
            <p>{t.privacy.review}</p>
          </details>
        </div>
        <button type="button" className="btn primary" onClick={() => close(true)}>{t.privacy.acknowledge}</button>
      </div>
    </>}
  </>;
}
