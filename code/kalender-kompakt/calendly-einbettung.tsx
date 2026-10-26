import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { CalendarDays, Loader2 } from 'lucide-react';
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
  const [bereit, setBereit] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const erlaubt = !!choice?.extern || einmal;

  const src = useMemo(() => {
    const url = new URL(link);
    url.searchParams.set('embed_domain', window.location.host);
    url.searchParams.set('embed_type', 'Inline');
    url.searchParams.set('hide_gdpr_banner', '1');
    // Name, Dauer und Beschreibung stehen schon über dem Kalender: macht ihn deutlich kompakter
    url.searchParams.set('hide_event_type_details', '1');
    url.searchParams.set('hide_landing_page_details', '1');
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
      if (!d) return;
      if (d.event === 'calendly.event_type_viewed') setBereit(true);
      if (d.event !== 'calendly.page_height') return;
      const h = parseInt(String(d.payload?.height ?? ''), 10);
      if (Number.isFinite(h) && h > 300) { setHoehe(Math.min(h, 1800)); setBereit(true); }
    };
    window.addEventListener('message', onMessage);
    // Falls Calendly keine Meldung schickt, den Ladehinweis spätestens nach 12 Sekunden ausblenden
    const notfall = window.setTimeout(() => setBereit(true), 12_000);
    // Verbindung zu Calendly vorab aufbauen (erst nach Einwilligung)
    const links = ['https://calendly.com', 'https://assets.calendly.com'].map((href) => {
      const l = document.createElement('link');
      l.rel = 'preconnect'; l.href = href; l.crossOrigin = '';
      document.head.append(l);
      return l;
    });
    return () => { window.removeEventListener('message', onMessage); window.clearTimeout(notfall); links.forEach((l) => l.remove()); };
  }, [erlaubt]);

  const anzeigen = () => {
    // Wer schon eine Cookie-Auswahl getroffen hat, bekommt die Erlaubnis gespeichert. Sonst gilt sie nur für diesen Besuch.
    if (choice) save({ statistik: choice.statistik, marketing: choice.marketing, extern: true });
    else setEinmal(true);
  };

  if (erlaubt) {
    return (
      <div className="tb-embed" data-testid="calendly-einbettung">
        <h3 className="tb-title tb-embed-titel">{K.terminTitel}</h3>
        <div className="tb-embed-rahmen">
        {!bereit && (
          <p className="tb-embed-laedt" role="status" data-testid="calendly-laedt">
            <Loader2 size={22} className="tb-spin" aria-hidden="true" /> {K.terminEinbettungLaedt}
          </p>
        )}
        <iframe
          ref={frame}
          src={src}
          title={K.terminEinbettungTitel}
          className="tb-embed-frame"
          style={hoehe ? { height: `${hoehe}px` } : undefined}
          data-testid="calendly-iframe"
        />
        </div>
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
