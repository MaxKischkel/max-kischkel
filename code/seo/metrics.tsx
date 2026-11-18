import { useLayoutEffect, useRef, useState } from 'react';
import { Reveal } from './reveal';
import { TextPlaceholder } from './placeholders';
import { kennzahlenContent as k, type KennzahlConfig } from '@/content/site';

const fmt = (n: number) => n.toLocaleString('de-DE');

function Metric({ m, tone }: { m: KennzahlConfig; tone: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const known = typeof m.wert === 'number' && Number.isFinite(m.wert);
  // Im vorab erzeugten HTML (für Suchmaschinen) stehen die echten Zahlen.
  const [shown, setShown] = useState<number>(known ? (m.wert as number) : 0);

  useLayoutEffect(() => {
    if (!known) return;
    const target = m.wert as number;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { setShown(target); return; }
    const el = ref.current;
    if (!el) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setShown(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [known, m.wert]);

  return (
    <div ref={ref} className="card metric" data-testid={`metric-${m.key}`}>
      <p className={`metric-v ${tone}`}>
        {known ? (
          <>
            <span aria-hidden="true">{fmt(shown)}{m.suffix ?? ''}</span>
            <span className="sr-only">{fmt(m.wert as number)}{m.suffix ?? ''}</span>
          </>
        ) : (
          <span className="metric-ph"><TextPlaceholder>{k.missing}</TextPlaceholder></span>
        )}
      </p>
      <p className="metric-l">{m.label}</p>
    </div>
  );
}

export function Metrics() {
  const tones = ['text-espresso', 'text-espresso', 'text-orange-700', 'text-espresso'];
  return (
    <section id="zahlen" className="section bg-paper" data-testid="section-zahlen">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{k.kicker}</p>
          <h2 className="h2">
            <span className="block">{k.strong}</span>
            <span className="block" style={{ fontWeight: 400 }}>{k.regular}</span>
          </h2>
        </Reveal>
        <Reveal delay={80} className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
          {k.items.map((m, i) => <Metric key={m.key} m={m} tone={tones[i]} />)}
        </Reveal>
        <p className="mt-8 text-center font-sans italic text-greige-600" data-testid="text-stand">
          Stand: {k.stand ?? <TextPlaceholder>{k.standPlaceholder}</TextPlaceholder>}. Interne Auswertung.
        </p>
      </div>
    </section>
  );
}
