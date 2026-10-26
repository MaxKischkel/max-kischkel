import { ShieldCheck, Clock, PiggyBank, SlidersHorizontal, Fingerprint, HeartHandshake } from 'lucide-react';
import { useDocMeta } from '@/components/site/use-doc-meta';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { Kontakt } from '@/components/site/kontakt';
import { FaqSection } from '@/components/site/faq';
import { angebotContent as c } from '@/content/site';
import './subpages.css';

const ICONS = { shield: ShieldCheck, clock: Clock, piggybank: PiggyBank, sliders: SlidersHorizontal, fingerprint: Fingerprint, handshake: HeartHandshake } as const;

export default function Angebot() {
  useDocMeta(c.meta.title, c.meta.description, true);
  return (
    <>
      <PageHero {...c.hero} id="angebot-hero" />

      <section id="pakete" className="section bg-paper" data-testid="section-pakete">
        <div className="wrap">
          <Reveal className="sp-head">
            <p className="kicker">{c.pakete.kicker}</p>
            <h2 className="h2 sp-h2">{c.pakete.strong}<span>{c.pakete.regular}</span></h2>
          </Reveal>
          <div className="pk-grid stagger">
            {c.pakete.items.map((p) => (
              <Reveal key={p.id}>
                <article className="pk-card" style={{ height: '100%' }} data-testid={`card-${p.id}`}>
                  <span className="pk-pill">{p.label}</span>
                  <p className="pk-kicker">{p.zeile}</p>
                  <h3 className="pk-title">{p.titel}</h3>
                  <p className="pk-subtitle">{p.unterzeile}</p>
                  <p>{p.text}</p>
                  <p className="pk-lh">{p.listLabel}</p>
                  <ol className="pk-list">
                    {p.punkte.map((x, i) => (
                      <li key={x.titel}>
                        <span className="pk-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        <div><strong>{x.titel}</strong><p>{x.text}</p></div>
                      </li>
                    ))}
                  </ol>
                  <div className="pk-foot">
                    <div className="pk-foot-in">
                      <span className="pk-price">{c.pakete.preis}</span>
                      <a href={c.pakete.button.href} className="btn btn-primary" data-testid={`link-${p.id}-anfragen`}>{c.pakete.button.label}</a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="pk-note">{c.pakete.note}</p>
        </div>
      </section>

      <section className="section bg-greige-warm" data-testid="section-vorteile">
        <div className="wrap">
          <Reveal className="sp-head">
            <p className="kicker">{c.vorteile.kicker}</p>
            <h2 className="h2 sp-h2">{c.vorteile.strong}<span>{c.vorteile.regular}</span></h2>
          </Reveal>
          <div className="res-grid stagger">
            {c.vorteile.items.map((r) => {
              const Icon = ICONS[r.icon];
              return (
                <Reveal key={r.titel}>
                    <div className="res-box" data-testid={`card-vorteil-${r.icon}`}>
                    <span className="res-ico" aria-hidden="true"><Icon size={24} /></span>
                    <h3>{r.titel}</h3>
                    <p>{r.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FaqSection />

      <Kontakt />
    </>
  );
}
