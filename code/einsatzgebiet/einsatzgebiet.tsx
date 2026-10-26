import { useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Reveal } from './reveal';
import { einsatzgebietContent as c } from '@/content/site';
import { BUNDESLAENDER, KARTE_BREITE as W, KARTE_HOEHE as H, projizieren, type BundeslandKey } from '@/content/deutschland-karte';
import './einsatzgebiet.css';

type Tip = { key: string; x: number; y: number; kicker: string; titel: string; v?: 'above' | 'below'; extra?: boolean };

// Grobe Fläche eines Hinweises in Kartenkoordinaten, um Überlappungen zu vermeiden.
function tipBox(t: { x: number; y: number; v?: 'above' | 'below' }) {
  const top = t.v === 'below' ? t.y : t.y - 95;
  return { l: t.x - 130, r: t.x + 130, t: top, b: top + 95 };
}
function overlaps(a: Tip, b: Tip) {
  const p = tipBox(a), q = tipBox(b);
  return p.l < q.r && q.l < p.r && p.t < q.b && q.t < p.b;
}

function MapTip({ tip }: { tip: Tip }) {
  const px = tip.x / W;
  const py = tip.y / H;
  const h = px < 0.22 ? 'start' : px > 0.78 ? 'end' : 'center';
  const v = tip.v ?? (py < 0.14 ? 'below' : 'above');
  return (
    <div className={`eg-tip${tip.extra ? ' eg-tip--extra' : ''}`} data-h={h} data-v={v} style={{ left: `${px * 100}%`, top: `${py * 100}%` }} aria-hidden="true" data-testid={`map-tip-${tip.key}`}>
      <span className="eg-tip-k">{tip.kicker}</span>
      <span className="eg-tip-t">{tip.titel}</span>
    </div>
  );
}

const isMouse = (e: ReactPointerEvent) => e.pointerType === 'mouse';

export function Einsatzgebiet() {
  const [landHover, setLandHover] = useState<BundeslandKey | null>(null);
  const [landTap, setLandTap] = useState<BundeslandKey | null>(null);
  const [ortHover, setOrtHover] = useState<number | null>(null);
  const [ortTap, setOrtTap] = useState<number | null>(null);

  const hq = useMemo(() => projizieren(c.firmensitz.lat, c.firmensitz.lon), []);
  const orte = useMemo(() => c.orte.map((o) => ({ ...o, p: projizieren(o.lat, o.lon) })), []);

  const aktivOrt = ortHover ?? ortTap;
  const aktivLand = aktivOrt === null ? (landHover ?? landTap) : null;
  const land = BUNDESLAENDER.find((b) => b.key === aktivLand) ?? null;
  const ortLand = aktivOrt !== null ? orte[aktivOrt]?.bundesland ?? null : null;

  // Bei Interaktion nur einen Hinweis zeigen, sonst Firmensitz und hervorgehobene Orte.
  let tips: Tip[];
  if (aktivOrt !== null && orte[aktivOrt]) {
    const o = orte[aktivOrt];
    tips = [{ key: `ort-${aktivOrt}`, x: o.p.x, y: o.p.y, kicker: o.ergebnis, titel: o.ort }];
  } else if (land) {
    tips = [{ key: `land-${land.key}`, x: land.label.x, y: land.label.y, kicker: c.landKicker, titel: land.name }];
  } else {
    tips = [{ key: 'firmensitz', x: hq.x, y: hq.y, kicker: c.firmensitz.kicker, titel: c.firmensitz.ort, v: 'below' }];
    orte.forEach((o, i) => {
      if (!o.hervorheben || tips.length > 3) return;
      const t: Tip = { key: `ort-${i}`, x: o.p.x, y: o.p.y, kicker: o.ergebnis, titel: o.ort, v: o.p.y / H < 0.14 ? 'below' : 'above', extra: true };
      if (!tips.some((u) => overlaps(u, t))) tips.push(t);
    });
  }

  const reset = () => { setLandTap(null); setOrtTap(null); };
  const kartenText = `Karte von Deutschland mit allen 16 Bundesländern. Markiert ist der Firmensitz in ${c.firmensitz.ort}${
    orte.length ? `, außerdem ${orte.map((o) => `${o.ort} (${o.ergebnis})`).join(', ')}` : ''
  }.`;

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
          {orte.length > 0 && (
            <>
              <h3 className="eg-list-title">{c.orteTitel}</h3>
              <ul className="eg-orte" data-testid="list-orte">
                {orte.map((o, i) => (
                  <li
                    key={`${o.ort}-${i}`}
                    className="eg-ort-item"
                    data-active={aktivOrt === i}
                    onMouseEnter={() => setOrtHover(i)}
                    onMouseLeave={() => setOrtHover(null)}
                  >
                    <span className="eg-ort-name">{o.ort}</span>
                    <span>{o.ergebnis}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className="eg-list-title">{c.laenderTitel}</h3>
          <ul className="eg-chips" data-testid="list-bundeslaender">
            {BUNDESLAENDER.map((b) => (
              <li
                key={b.key}
                className="eg-chip"
                data-active={aktivLand === b.key || ortLand === b.key}
                onMouseEnter={() => setLandHover(b.key)}
                onMouseLeave={() => setLandHover(null)}
              >
                {b.name}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="eg-card">
          <div className="eg-map" data-testid="map-deutschland">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={kartenText} onPointerLeave={() => { setLandHover(null); setOrtHover(null); }}>
              <rect width={W} height={H} fill="transparent" onClick={reset} />
              <g>
                {BUNDESLAENDER.map((b) => (
                  <path
                    key={b.key}
                    d={b.d}
                    className="eg-land"
                    data-land={b.key}
                    data-active={aktivLand === b.key || ortLand === b.key}
                    onPointerEnter={(e) => { if (isMouse(e)) setLandHover(b.key); }}
                    onPointerLeave={(e) => { if (isMouse(e)) setLandHover(null); }}
                    onClick={() => { setOrtTap(null); setLandTap((k) => (k === b.key ? null : b.key)); }}
                  />
                ))}
              </g>
              {land && <path d={land.d} className="eg-land-outline" />}
              {orte.map((o, i) => (
                <g
                  key={`${o.ort}-${i}`}
                  className="eg-ort"
                  data-active={aktivOrt === i}
                  data-testid={`map-ort-${i}`}
                  onPointerEnter={(e) => { if (isMouse(e)) setOrtHover(i); }}
                  onPointerLeave={(e) => { if (isMouse(e)) setOrtHover(null); }}
                  onClick={() => { setLandTap(null); setOrtTap((k) => (k === i ? null : i)); }}
                >
                  <circle cx={o.p.x} cy={o.p.y} r={16} fill="transparent" />
                  <circle cx={o.p.x} cy={o.p.y} r={5} className="eg-pulse" />
                  <circle cx={o.p.x} cy={o.p.y} r={5} className="eg-ort-dot" />
                </g>
              ))}
              <g className="eg-hq" data-testid="map-firmensitz">
                <circle cx={hq.x} cy={hq.y} r={7} className="eg-pulse" />
                <circle cx={hq.x} cy={hq.y} r={7} className="eg-hq-dot" />
              </g>
            </svg>
            {tips.map((t) => <MapTip key={t.key} tip={t} />)}
          </div>
          <div className="eg-legend" aria-hidden="true">
            <span className="eg-legend-item"><span className="eg-legend-hq" />{c.firmensitz.kicker}</span>
            {orte.length > 0 && <span className="eg-legend-item"><span className="eg-legend-ort" />{c.orteTitel}</span>}
            <span className="eg-hint eg-hint-mouse">{c.hinweisMaus}</span>
            <span className="eg-hint eg-hint-touch">{c.hinweisTouch}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
