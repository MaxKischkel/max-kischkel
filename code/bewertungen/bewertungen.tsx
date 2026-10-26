import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Star } from 'lucide-react';
import { useDocMeta } from '@/components/site/use-doc-meta';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { Bracketed } from '@/components/site/bracket';
import { Kontakt } from '@/components/site/kontakt';
import { bewertungenContent as c, type Bewertung } from '@/content/site';
import './subpages.css';

const MQ_TABLET = '(min-width: 640px)';
const MQ_DESKTOP = '(min-width: 1024px)';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

/** Wie viele Bewertungen zuerst sichtbar sind: passend zur Spaltenzahl (1, 2 oder 3). */
function startAnzahl() {
  if (typeof window === 'undefined' || !window.matchMedia) return c.anzeige.desktop;
  if (window.matchMedia(MQ_DESKTOP).matches) return c.anzeige.desktop;
  if (window.matchMedia(MQ_TABLET).matches) return c.anzeige.tablet;
  return c.anzeige.mobil;
}

function useStartAnzahl() {
  const [n, setN] = useState(startAnzahl);
  useEffect(() => {
    if (!window.matchMedia) return;
    const listen = [window.matchMedia(MQ_TABLET), window.matchMedia(MQ_DESKTOP)];
    const update = () => setN(startAnzahl());
    listen.forEach((m) => m.addEventListener('change', update));
    return () => listen.forEach((m) => m.removeEventListener('change', update));
  }, []);
  return n;
}

/**
 * Mauerwerk-Raster: Jede Karte belegt so viele 4-px-Zeilen, wie sie hoch ist.
 * Die Reihenfolge im Code bleibt die Lesereihenfolge, neue Karten hängen sich unten an,
 * ohne dass sich die bereits sichtbaren verschieben.
 */
function useMauerwerk(ref: RefObject<HTMLDivElement | null>, anzahl: number) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid || typeof ResizeObserver === 'undefined') return;
    const zellen = () => Array.from(grid.children) as HTMLElement[];
    const anordnen = () => {
      const cs = getComputedStyle(grid);
      const gap = parseFloat(cs.columnGap) || 24;
      grid.classList.add('rv-mason');
      const zeile = parseFloat(getComputedStyle(grid).gridAutoRows) || 4;
      for (const el of zellen()) {
        const inhalt = (el.firstElementChild as HTMLElement | null) ?? el;
        el.style.gridRowEnd = `span ${Math.max(1, Math.ceil((inhalt.offsetHeight + gap) / zeile))}`;
      }
    };
    anordnen();
    const ro = new ResizeObserver(() => anordnen());
    zellen().forEach((el) => ro.observe((el.firstElementChild as HTMLElement | null) ?? el));
    return () => ro.disconnect();
  }, [ref, anzahl]);
}

function Review({ r, i }: { r: Bewertung; i: number }) {
  const who = [r.rolle, r.unternehmen].filter(Boolean).join(', ');
  const meta = [r.quelle, r.datum].filter(Boolean).join(' · ');
  return (
    <figure className="rv" style={{ marginInline: 0 }} data-testid={`card-bewertung-${i}`} tabIndex={-1}>
      <span className="rv-q" aria-hidden="true">„</span>
      <blockquote>{r.text}</blockquote>
      <hr className="rv-sep" />
      <div className="rv-who">
        {r.bild ? <img src={r.bild} alt="" className="rv-av" width={48} height={48} loading="lazy" /> : <span className="rv-av" aria-hidden="true">{initials(r.name)}</span>}
        <div>
          <p className="rv-name">{r.name}</p>
          {who && <p className="rv-role">{who}</p>}
        </div>
      </div>
      {r.sterne !== null && (
        <p className="rv-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={20} aria-hidden="true" className={n > r.sterne! ? 'off' : ''} fill="currentColor" stroke="none" />
          ))}
          <span className="sr-only-x">{r.sterne} {c.stimmen.sterneSr}</span>
        </p>
      )}
      {meta && <p className="rv-meta">{meta}</p>}
    </figure>
  );
}

export default function Bewertungen() {
  useDocMeta(c.meta.title, c.meta.description, true);
  const start = useStartAnzahl();
  const [alle, setAlle] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const fokusAuf = useRef<number | null>(null);
  const gesamt = c.items.length;
  const sichtbar = alle ? gesamt : Math.min(start, gesamt);
  const anzahl = gesamt > 0 ? sichtbar : c.placeholder.count;
  useMauerwerk(gridRef, anzahl);

  useEffect(() => {
    if (fokusAuf.current === null) return;
    const ziel = gridRef.current?.querySelector<HTMLElement>(`[data-testid="card-bewertung-${fokusAuf.current}"]`);
    fokusAuf.current = null;
    ziel?.focus();
  }, [alle]);

  const mehrZeigen = () => {
    fokusAuf.current = sichtbar;
    setAlle(true);
  };

  return (
    <>
      <PageHero {...c.hero} id="bewertungen-hero" />

      <section id="stimmen" className="section bg-greige-50" data-testid="section-stimmen">
        <div className="wrap">
          <Reveal className="sp-head">
            <p className="kicker">{c.stimmen.kicker}</p>
            <h2 className="h2 sp-h2">{c.stimmen.strong}<span style={{ display: 'block', fontWeight: 400 }}>{c.stimmen.regular}</span></h2>
          </Reveal>
          <div ref={gridRef} id="bewertungen-liste" className="rv-grid" data-testid="bewertungen-liste">
            {gesamt > 0
              ? c.items.slice(0, sichtbar).map((r, i) => <Reveal key={`${r.name}-${i}`} delay={i % 3 * 80}><Review r={r} i={i} /></Reveal>)
              : Array.from({ length: c.placeholder.count }, (_, i) => (
                  <Reveal key={i} delay={i * 80}>
                  <figure className="rv rv-ph" style={{ marginInline: 0 }} data-testid={`card-bewertung-platzhalter-${i}`}>
                    <span className="rv-q" aria-hidden="true">„</span>
                    <blockquote><Bracketed text={c.placeholder.text} /></blockquote>
                    <hr className="rv-sep" />
                    <div className="rv-who">
                      <span className="rv-av rv-av-empty" aria-hidden="true" />
                      <p className="rv-name"><Bracketed text={c.placeholder.person} /></p>
                    </div>
                  </figure>
                  </Reveal>
                ))}
          </div>
          {sichtbar < gesamt && (
            <div className="rv-mehr">
              <p className="rv-zaehler" data-testid="bewertungen-zaehler">
                {c.mehr.zaehler.replace('{n}', String(sichtbar)).replace('{gesamt}', String(gesamt))}
              </p>
              <button type="button" className="btn btn-secondary" onClick={mehrZeigen} aria-controls="bewertungen-liste" data-testid="button-bewertungen-mehr">
                {c.mehr.button}
              </button>
            </div>
          )}
        </div>
      </section>

      <Kontakt />
    </>
  );
}
