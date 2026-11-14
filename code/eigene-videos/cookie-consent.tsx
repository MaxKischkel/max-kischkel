import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'wouter';
import { X } from 'lucide-react';
import { useConsent } from './consent-context';
import { calendlyLink } from '@/lib/consent';
import './cookie-consent.css';

type Selection = { statistik: boolean; marketing: boolean; extern: boolean };

const ROWS: { key: keyof Selection | 'notwendig'; label: string; text: string }[] = [
  { key: 'notwendig', label: 'Notwendig', text: 'Speichert Ihre Auswahl zu Cookies. Ohne diese Speicherung funktioniert die Einwilligungsverwaltung nicht.' },
  { key: 'statistik', label: 'Statistik', text: 'Google Analytics 4 hilft uns zu verstehen, wie diese Website genutzt wird.' },
  { key: 'marketing', label: 'Marketing', text: 'Das Meta-Pixel misst, wie wirksam unsere Anzeigen auf Facebook und Instagram sind.' },
  { key: 'extern', label: 'Externe Inhalte', text: 'Zeigt den Terminkalender von Calendly direkt im Kontaktbereich an, damit Sie Termine ohne Umweg buchen können.' },
];
const rows = () => ROWS.filter((r) => r.key !== 'extern' || calendlyLink() !== null);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Banner() {
  const { openSettings, save } = useConsent();
  const titleId = useId();
  return (
    <section className="cc-banner" role="region" aria-label="Cookie-Hinweis" aria-labelledby={undefined}>
      <h2 className="cc-title" id={titleId}>Cookies und Datenschutz</h2>
      <p className="cc-text">
        Wir nutzen technisch notwendige Speicherungen, damit diese Website funktioniert. Mit Ihrer Einwilligung setzen wir zusätzlich Dienste für Statistik und Marketing ein{calendlyLink() ? ' und zeigen den Terminkalender von Calendly an' : ''}. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern. Mehr dazu in der{' '}
        <Link href="/datenschutz" className="cc-link">Datenschutzerklärung</Link>.
      </p>
      <div className="cc-actions">
        <button type="button" className="cc-btn" onClick={() => save({ statistik: true, marketing: true, extern: true })}>Alle akzeptieren</button>
        <button type="button" className="cc-btn" onClick={() => save({ statistik: false, marketing: false, extern: false })}>Nur notwendige</button>
      </div>
      <button type="button" className="tlink cc-settings" onClick={(e) => openSettings(e.currentTarget)}>Einstellungen</button>
    </section>
  );
}

function Dialog() {
  const { choice, closeSettings, save } = useConsent();
  const [draft, setDraft] = useState<Selection>(() => ({
    statistik: !!choice?.statistik,
    marketing: !!choice?.marketing,
    extern: !!choice?.extern,
  }));
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(closeSettings);
  closeRef.current = closeSettings;
  const titleId = useId();

  useLayoutEffect(() => {
    const shell = document.getElementById('site-shell');
    const hadInert = shell ? shell.hasAttribute('inert') : false;
    shell?.setAttribute('inert', '');
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (sb > 0) body.style.paddingRight = `${sb}px`;
    return () => {
      if (shell && !hadInert) shell.removeAttribute('inert');
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeRef.current();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="cc-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeSettings(); }}>
      <div
        ref={panelRef}
        className="cc-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="cc-dhead">
          <h2 className="cc-title" id={titleId}>Cookie-Einstellungen</h2>
          <button type="button" className="cc-close" aria-label="Schließen" onClick={closeSettings}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <ul className="cc-rows">
          {rows().map((r) => {
            const necessary = r.key === 'notwendig';
            const on = necessary ? true : draft[r.key as keyof Selection];
            const lid = `${titleId}-${r.key}`;
            return (
              <li className="cc-row" key={r.key}>
                <div className="cc-rowtext">
                  <span className="cc-rowlabel" id={lid}>{r.label}</span>
                  <span className="cc-rowdesc" id={`${lid}-d`}>{r.text}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-labelledby={lid}
                  aria-describedby={`${lid}-d`}
                  disabled={necessary}
                  className="cc-switch"
                  onClick={() => !necessary && setDraft((d) => ({ ...d, [r.key]: !d[r.key as keyof Selection] }))}
                >
                  <span className="cc-track" aria-hidden="true"><span className="cc-thumb" /></span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cc-actions cc-actions-3">
          <button type="button" className="cc-btn" onClick={() => save(draft)}>Auswahl speichern</button>
          <button type="button" className="cc-btn" onClick={() => save({ statistik: true, marketing: true, extern: true })}>Alle akzeptieren</button>
          <button type="button" className="cc-btn" onClick={() => save({ statistik: false, marketing: false, extern: false })}>Nur notwendige</button>
        </div>
        <p className="cc-text cc-foot">
          Mehr dazu in der{' '}
          <Link href="/datenschutz" className="cc-link" onClick={() => closeSettings()}>Datenschutzerklärung</Link>.
        </p>
      </div>
    </div>
  );
}

export function CookieConsent() {
  const { bannerVisible, dialogOpen } = useConsent();
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      {bannerVisible && !dialogOpen ? <Banner /> : null}
      {dialogOpen ? <Dialog /> : null}
    </>,
    document.body,
  );
}

export default CookieConsent;
