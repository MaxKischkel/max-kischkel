import { Star } from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { HeroVideo } from '@/components/site/hero-video';
import { fallstudienContent, heroContent } from '@/content/site';

export function Hero() {
  const refs = heroContent.references;
  return (
    <section id="start" className="section-hero bg-paper-image" data-testid="section-hero">
      <div className="wrap">
        <div className="hero-top">
          <Reveal>
            <p className="kicker">Recruiting-Systeme für Unternehmen</p>
            <h1 className="h1 hero-h1">
              <strong>Ihr Recruiting gehört in Ihre Hand.</strong>
              <br />
              <span className="font-normal">Nicht in die einer Agentur.</span>
            </h1>
            <p className="hero-lead">
              Kischkel Personal baut mit Ihnen ein internes Recruiting-System auf. Mit klaren Prozessen, einem Team, das sie sicher bedient, und einer Arbeitgebermarke, auf die gute Leute reagieren. Danach besetzen Sie Ihre Stellen selbst.
            </p>
            <div className="hero-cta">
              <a href="#kontakt" className="btn btn-primary" data-testid="link-cta-hero">Erstanalyse anfragen</a>
              <a href="#system" className="tlink" data-testid="link-hero-system">So funktioniert das System</a>
              <span className="hero-note">Unverbindlich und persönlich.</span>
            </div>
          </Reveal>
          <HeroVideo />
        </div>
        <div className="hero-references mt-16 md:mt-20">
          <Reveal>
            <p className="kicker">{refs.kicker}</p>
            <div className="ref-grid">
              {fallstudienContent.items.map((f) => (
                <div key={f.id} className="card ref-card" data-testid={`card-ref-${f.id}`}>
                  {f.sterne != null && (
                    <div className="ref-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={18} aria-hidden="true" fill={n <= f.sterne! ? 'currentColor' : 'none'} />
                      ))}
                      <span className="sr-only">{f.sterne} von 5 Sternen</span>
                    </div>
                  )}
                  <p className="ref-result">{f.ergebnis}</p>
                  <div className="ref-person">
                    <span className="ref-avatar" aria-hidden="true">{f.person.initialen}</span>
                    <p className="!m-0 leading-snug">
                      <span className="block font-bold text-espresso">{f.person.name}</span>
                      <span className="block text-[16px]">{f.branche}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ref-all">
              <a href={refs.href} className="tlink" data-testid="link-ref-all">{refs.link}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
