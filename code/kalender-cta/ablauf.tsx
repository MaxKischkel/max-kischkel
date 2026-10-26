import { useEffect, useRef } from 'react';
import { Reveal } from './reveal';
import { ablaufContent, sektionCtas } from '@/content/site';
import { SektionCta } from './sektion-cta';

export function Ablauf() {
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLLIElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!list || !track || !fill) return;
    const marks = Array.from(list.querySelectorAll<HTMLElement>('.abl-mark'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopMq = window.matchMedia('(min-width: 900px)');
    let raf = 0;

    const update = () => {
      raf = 0;
      const lr = list.getBoundingClientRect();
      const c = marks.map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      const desk = desktopMq.matches;
      const first = c[0];
      const last = c[c.length - 1];
      const len = Math.max(1, desk ? last.x - first.x : last.y - first.y);
      track.style.left = `${first.x - lr.left - (desk ? 0 : 1.5)}px`;
      track.style.top = `${first.y - lr.top - (desk ? 1.5 : 0)}px`;
      track.style.width = desk ? `${len}px` : '3px';
      track.style.height = desk ? '3px' : `${len}px`;
      const vh = window.innerHeight;
      let raw: number;
      if (reduce) raw = 1;
      else if (desk) raw = (vh * 0.85 - lr.top) / (lr.height + vh * 0.2);
      else raw = (vh * 0.6 - first.y) / len;
      const p = Math.min(1, Math.max(0, raw));
      fill.style.transform = desk ? `scaleX(${p})` : `scaleY(${p})`;
      marks.forEach((m, i) => {
        const pos = (desk ? c[i].x - first.x : c[i].y - first.y) / len;
        m.dataset.on = String(reduce || raw >= pos - 0.001);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    void document.fonts?.ready.then(schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section id="ablauf" className="section bg-paper" data-testid="section-ablauf">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{ablaufContent.kicker}</p>
          <h2 className="h2">
            <span className="block">{ablaufContent.strong}</span>
            <span className="block font-normal">{ablaufContent.regular}</span>
          </h2>
        </Reveal>
        <ol className="abl-list" ref={listRef}>
          <li role="presentation" className="abl-track" ref={trackRef} aria-hidden="true">
            <div className="abl-fill" ref={fillRef} />
          </li>
          {ablaufContent.steps.map((s, i) => (
            <li key={s.nr} className="abl-item" data-testid={`step-ablauf-${s.nr}`}>
              <span className="abl-mark" aria-hidden="true" data-on="false">{s.nr}</span>
              <Reveal delay={i * 100} className="h-full">
                <article className="abl-card">
                  <h3>{s.titel}</h3>
                  <p>{s.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <SektionCta id="ablauf" {...sektionCtas.ablauf} />
      </div>
    </section>
  );
}
