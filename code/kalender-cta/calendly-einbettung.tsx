import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays } from 'lucide-react';
import { useConsent } from './consent-context';
import { kontaktContent as K } from '@/content/site';
import './termin.css';

const CALENDLY_ORIGIN = 'https://calendly.com';

/**
 * Kostenlose Variante: der Kalender von Calendly direkt auf der Seite.
 * Er lädt erst nach Einwilligung ("Externe Inhalte" oder Klick auf "Kalender anzeigen").
 */
export function CalendlyEinbettung({ link }: { link: string }) {
  const { choice, save } = useConsent();
  const [einmal, setEinmal] = useState(false);
  const [hoehe, setHoehe] = useState<number | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const erlaubt = !!choice?.extern || einmal;

  const src = useMemo(() => {
    const url = new URL(link);
    url.searchParams.set('embed_domain', window.location.host);
    url.searchParams.set('embed_type', 'Inline');
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('primary_color', 'ff6f3a');
    url.searchParams.set('text_color', '211a1a');
    url.searchParams.set('background_color', 'ffffff');
    return url.href;
  }, [link]);

  // Calendly meldet seine Inhaltshöhe, damit im Rahmen nichts abgeschnitten wird.
  useEffect(() => {
    if (!erlaubt) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== CALENDLY_ORIGIN || e.source !== frame.current?.contentWindow) return;
      const d = e.data as { event?: unknown; payload?: { height?: unknown } } | null;
      if (!d || d.event !== 'calendly.page_height') return;
      const h = parseInt(String(d.payload?.height ?? ''), 10);
      if (Number.isFinite(h) && h > 0) setHoehe(Math.min(Math.max(h, 520), 1800));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [erlaubt]);

  const anzeigen = () => {
    // Wer schon eine Cookie-Auswahl getroffen hat, bekommt die Erlaubnis gespeichert. Sonst gilt sie nur für diesen Besuch.
    if (choice) save({ statistik: choice.statistik, marketing: choice.marketing, extern: true });
    else setEinmal(true);
  };

  if (erlaubt) {
    return (
      <div className="tb-embed" data-testid="calendly-einbettung">
        <iframe
          ref={frame}
          src={src}
          title={K.terminEinbettungTitel}
          className="tb-embed-frame"
          style={hoehe ? { height: `${hoehe}px` } : undefined}
          data-testid="calendly-iframe"
        />
        <p className="tb-embed-extern">
          <a href={link} target="_blank" rel="noopener noreferrer">{K.terminExtern}</a>
        </p>
      </div>
    );
  }

  return (
    <div className="tb-zustimmung" data-testid="calendly-zustimmung">
      <span className="tb-zustimmung-icon" aria-hidden="true"><CalendarDays size={28} /></span>
      <h3 className="tb-title">{K.terminTitel}</h3>
      <p className="tb-zustimmung-text">
        {K.terminEinbettungText}{' '}
        <Link href="/datenschutz" className="tb-link">{K.privacyLink}</Link>.
      </p>
      <button type="button" className="btn btn-primary kbtn" onClick={anzeigen} data-testid="button-kalender-anzeigen">
        {K.terminEinbettungButton}
      </button>
      <p className="tb-embed-extern">
        <a href={link} target="_blank" rel="noopener noreferrer">{K.terminExtern}</a>
      </p>
    </div>
  );
}
