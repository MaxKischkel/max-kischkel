import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Reveal } from './reveal';
import { einsatzgebietContent as c } from '@/content/site';
import { erfolge as erfolgeDaten, type Erfolg } from '@/content/erfolge';
import { BUNDESLAENDER, KARTE_BREITE as W, KARTE_HOEHE as H, projizieren, type BundeslandKey } from '@/content/deutschland-karte';
import './einsatzgebiet.css';

// Zeitsteuerung der Erfolgs-Popups
const TAKT_MS = 3000; // alle 3 Sekunden wird der nächste Eintrag hervorgehoben
const SICHTBAR_MS = 2500; // so lange bleibt ein Popup stehen
const AUS_MS = 400; // Dauer des Ausblendens, passend zu eg-pop-out in der CSS
const START_MS = 600; // erste Hervorhebung, nachdem die Karte sichtbar wurde
const ABSTAND_PX = 14; // Abstand zwischen Punkt und Popup
const MOBIL = '(max-width: 767px)';

// Grober Rahmen um Deutschland. Einträge außerhalb werden nicht gezeigt.
const inDeutschland = (e: Erfolg) =>
  Number.isFinite(e.lat) && Number.isFinite(e.lng) && e.lat > 47 && e.lat < 55.2 && e.lng > 5.5 && e.lng < 15.3;

type Quelle = 'auto' | 'nutzer';
type Pop = { id: number; idx: number; quelle: Quelle; weg: boolean };

/** Hält höchstens `max` sichtbare Popups. Zuerst fallen die ältesten automatischen weg. */
function begrenzen(list: Pop[], max: number, behalten?: number) {
  const aktiv = list.filter((p) => !p.weg);
  let zuViel = aktiv.length - Math.max(0, max);
  if (zuViel <= 0) return list;
  const opfer = new Set<number>();
  for (const p of [...aktiv.filter((x) => x.quelle === 'auto'), ...aktiv.filter((x) => x.quelle === 'nutzer')]) {
    if (zuViel <= 0) break;
    if (p.id === behalten) continue;
    opfer.add(p.id);
    zuViel--;
  }
  return list.map((p) => (opfer.has(p.id) ? { ...p, weg: true } : p));
}

function useMedia(query: string) {
  const [treffer, setTreffer] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setTreffer(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return treffer;
}

type Tip = { key: string; x: number; y: number; kicker: string; titel: string };

function LandTip({ tip }: { tip: Tip }) {
  const px = tip.x / W;
  const py = tip.y / H;
  const h = px < 0.22 ? 'start' : px > 0.78 ? 'end' : 'center';
  const v = py < 0.14 ? 'below' : 'above';
  return (
    <div className="eg-tip" data-h={h} data-v={v} style={{ left: `${px * 100}%`, top: `${py * 100}%` }} aria-hidden="true" data-testid={`map-tip-${tip.key}`}>
      <span className="eg-tip-k">{tip.kicker}</span>
      <span className="eg-tip-t">{tip.titel}</span>
    </div>
  );
}

/** Popup neben einem Punkt. Die Lage wird gemessen, damit es nie über den Kartenrand ragt. */
function ErfolgPopup({ e, pop, karte }: { e: Erfolg & { p: { x: number; y: number } }; pop: Pop; karte: { w: number; h: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lage, setLage] = useState<{ left: number; top: number; seite: 'rechts' | 'links' } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !karte.w) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const px = (e.p.x / W) * karte.w;
    const py = (e.p.y / H) * karte.h;
    let seite: 'rechts' | 'links' = 'rechts';
    let left = px + ABSTAND_PX;
    if (left + w > karte.w) {
      seite = 'links';
      left = px - ABSTAND_PX - w;
    }
    left = Math.max(0, Math.min(left, karte.w - w));
    const top = Math.max(0, Math.min(py - h / 2, karte.h - h));
    setLage({ left, top, seite });
  }, [e, karte.w, karte.h]);
  return (
    <div
      ref={ref}
      className="eg-pop"
      data-weg={pop.weg}
      data-quelle={pop.quelle}
      data-seite={lage?.seite}
      style={lage ? { left: lage.left, top: lage.top } : { left: 0, top: 0, visibility: 'hidden' }}
      aria-hidden="true"
      data-testid={`map-popup-${pop.idx}`}
    >
      <span className="eg-pop-t">{e.text}</span>
      <span className="eg-pop-u">{e.untertitel}</span>
    </div>
  );
}

const isMouse = (e: ReactPointerEvent) => e.pointerType === 'mouse';
const fokusSichtbar = (el: Element) => {
  try { return el.matches(':focus-visible'); } catch { return true; }
};

export function Einsatzgebiet() {
  const [landHover, setLandHover] = useState<BundeslandKey | null>(null);
  const [landTap, setLandTap] = useState<BundeslandKey | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [fokusIdx, setFokusIdx] = useState<number | null>(null);
  const [tapIdx, setTapIdx] = useState<number | null>(null);

  const reduziert = useMedia('(prefers-reduced-motion: reduce)');
  const mobil = useMedia(MOBIL);
  const maxPops = mobil ? 1 : 2;

  const hq = useMemo(() => projizieren(c.firmensitz.lat, c.firmensitz.lon), []);
  const liste = useMemo(() => {
    const ok = erfolgeDaten.filter(inDeutschland);
    if (import.meta.env.DEV && ok.length !== erfolgeDaten.length) console.warn('erfolge.ts: Einträge außerhalb Deutschlands werden ignoriert.');
    return ok.map((e) => ({ ...e, p: projizieren(e.lat, e.lng) }));
  }, []);

  const aktivLand = landHover ?? landTap;
  const land = BUNDESLAENDER.find((b) => b.key === aktivLand) ?? null;

  // Kartengröße in Pixeln, für die Lage der Popups
  const mapRef = useRef<HTMLDivElement>(null);
  const [karte, setKarte] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const messen = () => setKarte({ w: el.clientWidth, h: el.clientHeight });
    messen();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', messen);
      return () => window.removeEventListener('resize', messen);
    }
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animation erst, wenn die Karte im sichtbaren Bereich ist
  const [imBild, setImBild] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setImBild(true); return; }
    const io = new IntersectionObserver(([e]) => setImBild(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [tabSichtbar, setTabSichtbar] = useState(true);
  useEffect(() => {
    const on = () => setTabSichtbar(!document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  // Popups
  const [pops, setPops] = useState<Pop[]>([]);
  const seq = useRef(0);
  const maxRef = useRef(maxPops);
  useEffect(() => {
    maxRef.current = maxPops;
    setPops((prev) => begrenzen(prev, maxPops));
  }, [maxPops]);

  const zeigen = useCallback((idx: number, quelle: Quelle) => {
    setPops((prev) => {
      const da = prev.find((p) => p.idx === idx && !p.weg);
      if (da) return quelle === 'nutzer' && da.quelle === 'auto' ? prev.map((p) => (p === da ? { ...p, quelle } : p)) : prev;
      const id = ++seq.current;
      return begrenzen([...prev, { id, idx, quelle, weg: false }], maxRef.current, id);
    });
  }, []);
  const verstecken = useCallback((idx: number) => {
    setPops((prev) => prev.map((p) => (p.idx === idx && p.quelle === 'nutzer' && !p.weg ? { ...p, weg: true } : p)));
  }, []);

  // Zeitgeber: automatische Popups nach SICHTBAR_MS ausblenden, ausgeblendete nach AUS_MS entfernen
  const zeit = useRef({ aus: new Set<number>(), raus: new Set<number>(), handles: new Set<number>() });
  useEffect(() => {
    const t = zeit.current;
    const plane = (ms: number, fn: () => void) => {
      const h = window.setTimeout(() => { t.handles.delete(h); fn(); }, ms);
      t.handles.add(h);
    };
    for (const p of pops) {
      if (p.quelle === 'auto' && !p.weg && !t.aus.has(p.id)) {
        t.aus.add(p.id);
        plane(SICHTBAR_MS, () => setPops((ps) => ps.map((x) => (x.id === p.id && x.quelle === 'auto' && !x.weg ? { ...x, weg: true } : x))));
      }
      if (p.weg && !t.raus.has(p.id)) {
        t.raus.add(p.id);
        plane(reduziert ? 0 : AUS_MS, () => {
          t.aus.delete(p.id);
          t.raus.delete(p.id);
          setPops((ps) => ps.filter((x) => x.id !== p.id));
        });
      }
    }
  }, [pops, reduziert]);
  useEffect(() => {
    const t = zeit.current;
    return () => {
      t.handles.forEach((h) => window.clearTimeout(h));
      t.handles.clear();
      t.aus.clear();
      t.raus.clear();
    };
  }, []);

  const cursor = useRef(-1); // zuletzt hervorgehobener Eintrag

  // Popups, die der Nutzer per Maus, Tastatur oder Antippen hält
  const gehalten = useMemo(() => [...new Set([tapIdx, fokusIdx, hoverIdx].filter((x): x is number => x !== null))], [tapIdx, fokusIdx, hoverIdx]);
  const vorher = useRef<number[]>([]);
  useEffect(() => {
    for (const i of vorher.current) if (!gehalten.includes(i)) verstecken(i);
    for (const i of gehalten) zeigen(i, 'nutzer');
    // Danach geht der Ablauf mit dem nächsten Eintrag weiter
    if (gehalten.length) cursor.current = gehalten[gehalten.length - 1];
    vorher.current = gehalten;
  }, [gehalten, zeigen, verstecken]);

  // Ein aktives Bundesland zählt mit: Platz für dessen Hinweis schaffen
  useEffect(() => {
    if (aktivLand) setPops((prev) => begrenzen(prev, maxRef.current - 1));
  }, [aktivLand]);

  // Antippen außerhalb der Karte schließt ein festgehaltenes Popup
  useEffect(() => {
    if (tapIdx === null) return;
    const weg = (e: PointerEvent) => { if (!mapRef.current?.contains(e.target as Node)) setTapIdx(null); };
    document.addEventListener('pointerdown', weg);
    return () => document.removeEventListener('pointerdown', weg);
  }, [tapIdx]);

  // Automatischer Ablauf: nacheinander, alle TAKT_MS
  const pausiert = reduziert || !imBild || !tabSichtbar || liste.length === 0 || gehalten.length > 0 || aktivLand !== null;
  useEffect(() => {
    if (pausiert) return;
    let iv = 0;
    const tick = () => {
      cursor.current = (cursor.current + 1) % liste.length;
      zeigen(cursor.current, 'auto');
    };
    const start = window.setTimeout(() => { tick(); iv = window.setInterval(tick, TAKT_MS); }, START_MS);
    return () => { window.clearTimeout(start); window.clearInterval(iv); };
  }, [pausiert, liste.length, zeigen]);

  const aktivePunkte = new Set(pops.filter((p) => !p.weg).map((p) => p.idx));
  const reset = () => { setLandTap(null); setTapIdx(null); };
  const kartenText = `Karte von Deutschland mit allen 16 Bundesländern. Markiert ist der Firmensitz in ${c.firmensitz.ort}.`;

  return (
    <section id="einsatzgebiet" className="section bg-einsatz on-dark" data-testid="section-einsatzgebiet">
      <div className="wrap eg-grid">
        <Reveal className="eg-intro">
          <p className="kicker">{c.kicker}</p>
          <h2 className="h2">
            <span className="block">{c.strong}</span>
            <span className="block font-normal text-espresso-100">{c.regular}</span>
          </h2>
          <p className="eg-lead">{c.text}</p>
          <div className="eg-facts">
            {c.fakten.map((f) => (
              <div key={f.label} className="eg-fact">
                <p className="eg-fact-v">{f.wert}</p>
                <p className="eg-fact-l">{f.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={60} className="eg-lists">
          <h3 className="eg-list-title">{c.laenderTitel}</h3>
          <ul className="eg-chips" data-testid="list-bundeslaender">
            {BUNDESLAENDER.map((b) => (
              <li
                key={b.key}
                className="eg-chip"
                data-active={aktivLand === b.key}
                onMouseEnter={() => setLandHover(b.key)}
                onMouseLeave={() => setLandHover(null)}
              >
                {b.name}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="eg-card">
          <div className="eg-map" ref={mapRef} data-testid="map-deutschland" data-animiert={!pausiert}>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={kartenText} onPointerLeave={() => setLandHover(null)}>
              <rect width={W} height={H} fill="transparent" onClick={reset} />
              <g>
                {BUNDESLAENDER.map((b) => (
                  <path
                    key={b.key}
                    d={b.d}
                    className="eg-land"
                    data-land={b.key}
                    data-active={aktivLand === b.key}
                    onPointerEnter={(e) => { if (isMouse(e)) setLandHover(b.key); }}
                    onPointerLeave={(e) => { if (isMouse(e)) setLandHover(null); }}
                    onClick={() => { setTapIdx(null); setLandTap((k) => (k === b.key ? null : b.key)); }}
                  />
                ))}
              </g>
              {land && <path d={land.d} className="eg-land-outline" />}
            </svg>

            <div className="eg-overlay">
              <span className="eg-hq" style={{ left: `${(hq.x / W) * 100}%`, top: `${(hq.y / H) * 100}%` }} aria-hidden="true" data-testid="map-firmensitz" />
              {liste.map((e, i) => (
                <button
                  key={`${e.stadt}-${i}`}
                  type="button"
                  className="eg-punkt"
                  data-aktiv={aktivePunkte.has(i)}
                  style={{ left: `${(e.p.x / W) * 100}%`, top: `${(e.p.y / H) * 100}%`, ['--verz' as string]: `${(i * 0.7) % 2.8}s` }}
                  aria-label={`${e.stadt}: ${e.text}, ${e.untertitel}`}
                  data-testid={`map-punkt-${i}`}
                  onPointerEnter={(ev) => { if (isMouse(ev)) setHoverIdx(i); }}
                  onPointerLeave={(ev) => { if (isMouse(ev)) setHoverIdx((h) => (h === i ? null : h)); }}
                  onFocus={(ev) => { if (fokusSichtbar(ev.currentTarget)) setFokusIdx(i); }}
                  onBlur={() => setFokusIdx((f) => (f === i ? null : f))}
                  onClick={() => { setLandTap(null); setTapIdx((t) => (t === i ? null : i)); }}
                >
                  <span className="eg-punkt-ring" aria-hidden="true" />
                  <span className="eg-punkt-dot" aria-hidden="true" />
                </button>
              ))}
              {pops.map((p) => liste[p.idx] && <ErfolgPopup key={p.id} e={liste[p.idx]} pop={p} karte={karte} />)}
            </div>
            {land && <LandTip tip={{ key: `land-${land.key}`, x: land.label.x, y: land.label.y, kicker: c.landKicker, titel: land.name }} />}
          </div>
          <div className="eg-legend" aria-hidden="true">
            <span className="eg-legend-item"><span className="eg-legend-hq" />{c.firmensitz.kicker}</span>
            {liste.length > 0 && <span className="eg-legend-item"><span className="eg-legend-ort" />{c.erfolgeTitel}</span>}
            <span className="eg-hint eg-hint-mouse">{c.hinweisMaus}</span>
            <span className="eg-hint eg-hint-touch">{c.hinweisTouch}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
