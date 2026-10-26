import { Reveal } from './reveal';
import { herausforderungen as c, sektionCtas } from '@/content/site';
import { SektionCta } from './sektion-cta';

const SPAN = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];

function Tick() {
  return (
    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-orange" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" focusable="false">
        <path d="M2.5 7.5l3 3 6-7" stroke="#211A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Challenges() {
  return (
    <section id="herausforderungen" className="section bg-greige-warm" data-testid="section-herausforderungen">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{c.kicker}</p>
          <h2 className="h2">
            <span className="block">{c.strong}</span>
            <span className="block" style={{ fontWeight: 400 }}>{c.regular}</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-6">
          {c.items.map((it, i) => (
            <Reveal key={it.nr} delay={(i % 2) * 90} className={SPAN[i]}>
              <article className="card chal h-full" data-testid={`card-challenge-${it.nr}`}>
                <p className="chal-nr" aria-hidden="true">{it.nr}</p>
                <h3 className="chal-t">{it.titel}</h3>
                <p>{it.text}</p>
                <hr className="chal-sep" />
                <div className="flex items-start gap-3">
                  <Tick />
                  <p className="!m-0">
                    <span className="block text-[14px] font-bold uppercase tracking-[.12em] text-orange-700">{c.solveLabel}</span>
                    <span className="mt-1 block font-bold text-espresso">{it.loesung}</span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <p className="font-serif text-[clamp(22px,2.6vw,32px)] font-bold leading-tight text-espresso">{c.closing}</p>
        </Reveal>
        <SektionCta id="herausforderungen" {...sektionCtas.herausforderungen} />
      </div>
    </section>
  );
}
