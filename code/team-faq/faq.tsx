import { useState } from 'react';
import { Reveal } from './reveal';
import { faqContent as c } from '@/content/site';
import '@/pages/subpages.css';

function FaqList() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  return (
    <div className="faq-list">
      {c.items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div className="faq-item" key={it.q} data-testid={`faq-item-${i}`}>
            <h3>
              <button type="button" id={`faq-b-${i}`} className="faq-btn" aria-expanded={isOpen} aria-controls={`faq-p-${i}`} onClick={() => toggle(i)} data-testid={`button-faq-${i}`}>
                <span>{it.q}</span>
                <span className="faq-plus" aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} aria-hidden={!isOpen} className="faq-panel" data-open={isOpen}>
              <div><p>{it.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Häufige Fragen, genutzt auf der Startseite und der Angebotsseite. */
export function FaqSection() {
  return (
    <section id="faq" className="section bg-greige-50" data-testid="section-faq">
      <div className="wrap">
        <Reveal className="sp-head">
          <p className="kicker" style={{ justifyContent: 'center' }}>{c.kicker}</p>
          <h2 className="h2 sp-h2" style={{ textAlign: 'center' }}>{c.strong}<span>{c.regular}</span></h2>
        </Reveal>
        <FaqList />
      </div>
    </section>
  );
}
