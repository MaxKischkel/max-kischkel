import { Link } from 'wouter';
import { Check, ClipboardList, Phone, Mail, Sparkles } from 'lucide-react';
import { useDocMeta } from '@/components/site/use-doc-meta';
import { Reveal } from '@/components/site/reveal';
import { FaqSection } from '@/components/site/faq';
import { LoomVideo } from '@/components/site/loom-video';
import { terminSeite as T } from '@/content/termin-seite';
import { bewertungenContent, placeholders } from '@/content/site';
import './subpages.css';
import './termin-bestaetigt.css';

function initialen(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

/** Seite nach der Terminbuchung. Nicht verlinkt, nicht in Suchmaschinen. */
export default function TerminBestaetigt() {
  useDocMeta(T.meta.title, T.meta.description, true);
  const stimmen = T.stimmen.namen
    .map((n) => bewertungenContent.items.find((b) => b.name === n))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const p = placeholders.ansprechpartner;

  return (
    <>
      <section className="tb2-hero" data-testid="section-termin-hero">
        <div className="wrap">
          <Reveal className="tb2-kopf">
            <p className="tb2-badge"><Check size={16} strokeWidth={3} aria-hidden="true" /> {T.hero.badge}</p>
            <h1 className="h2 tb2-h1">{T.hero.titel}</h1>
            <p className="tb2-lead">{T.hero.text}</p>
          </Reveal>
          <Reveal delay={80} className="tb2-video-haupt">
            <LoomVideo video={T.hero.video} gross id="haupt" />
          </Reveal>
          <Reveal delay={120}>
            <ul className="tb2-vertrauen" aria-label="Kischkel Personal in Zahlen">
              {T.hero.vertrauen.map((v) => (
                <li key={v}><Check size={18} strokeWidth={3} aria-hidden="true" /> {v}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="kurz-erklaert" className="section bg-greige-50" data-testid="section-termin-fragen">
        <div className="wrap">
          <Reveal className="tb2-zentriert">
            <p className="kicker">{T.fragen.kicker}</p>
            <h2 className="h2">{T.fragen.titel}<span style={{ display: 'block', fontWeight: 400 }}>{T.fragen.titelZwei}</span></h2>
            <p className="tb2-lead">{T.fragen.text}</p>
          </Reveal>
          <ul className="tb2-videos">
            {T.fragen.items.map((v, i) => (
              <Reveal as="li" key={v.titel} delay={(i % 2) * 80} className="tb2-videokarte">
                <LoomVideo video={v} id={`frage-${i}`} />
                <h3 className="tb2-videotitel">{v.titel}</h3>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-paper" data-testid="section-termin-vorbereitung">
        <div className="wrap tb2-zwei">
          <Reveal className="tb2-karte">
            <span className="tb2-icon" aria-hidden="true"><Sparkles size={24} /></span>
            <p className="kicker">{T.erwartung.kicker}</p>
            <h2 className="tb2-h3">{T.erwartung.titel}</h2>
            <ul className="tb2-liste">
              {T.erwartung.punkte.map((x) => <li key={x}><Check size={18} strokeWidth={3} aria-hidden="true" />{x}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={80} className="tb2-karte tb2-karte-dunkel">
            <span className="tb2-icon" aria-hidden="true"><ClipboardList size={24} /></span>
            <p className="kicker">{T.vorbereitung.kicker}</p>
            <h2 className="tb2-h3">{T.vorbereitung.titel}</h2>
            <p className="tb2-text">{T.vorbereitung.text}</p>
            <ol className="tb2-nummern">
              {T.vorbereitung.punkte.map((x) => <li key={x}>{x}</li>)}
            </ol>
            <p className="tb2-hinweis">{T.vorbereitung.hinweis}</p>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      {stimmen.length > 0 && (
        <section className="section bg-paper" data-testid="section-termin-stimmen">
          <div className="wrap">
            <Reveal className="tb2-zentriert">
              <p className="kicker">{T.stimmen.kicker}</p>
              <h2 className="h2">{T.stimmen.titel}</h2>
            </Reveal>
            <div className="tb2-stimmen">
              {stimmen.map((r, i) => (
                <Reveal key={r.name} delay={i * 80}>
                  <figure className="rv" style={{ marginInline: 0 }}>
                    <span className="rv-q" aria-hidden="true">„</span>
                    <blockquote>{r.text}</blockquote>
                    <hr className="rv-sep" />
                    <div className="rv-who">
                      <span className="rv-av" aria-hidden="true">{initialen(r.name)}</span>
                      <div>
                        <p className="rv-name">{r.name}</p>
                        <p className="rv-role">{[r.rolle, r.unternehmen].filter(Boolean).join(', ')}</p>
                      </div>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className="tb2-zentriert tb2-mehr">
              <Link href="/bewertungen" className="btn btn-secondary">{T.stimmen.link}</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section bg-greige-50" data-testid="section-termin-abschluss">
        <div className="wrap">
          <Reveal className="tb2-abschluss">
            <h2 className="tb2-h3">{T.abschluss.titel}</h2>
            <p className="tb2-text">{T.abschluss.text}</p>
            <p className="tb2-kontakt">
              {p.telefon && <a href={`tel:${p.telefon.replace(/[^\d+]/g, '').replace(/^0/, '+49')}`}><Phone size={18} aria-hidden="true" /> {p.telefon}</a>}
              {p.email && <a href={`mailto:${p.email}`}><Mail size={18} aria-hidden="true" /> {p.email}</a>}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
