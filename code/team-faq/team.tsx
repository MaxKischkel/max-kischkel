import { useDocMeta } from '@/components/site/use-doc-meta';
import { Reveal } from '@/components/site/reveal';
import { Kontakt } from '@/components/site/kontakt';
import { teamContent as c, type TeamMitglied } from '@/content/site';
import './subpages.css';
import './team.css';

function initialen(m: TeamMitglied) {
  if (m.initialen) return m.initialen;
  return m.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

function Mitglied({ m, i }: { m: TeamMitglied; i: number }) {
  return (
    <li className="tm-card" data-testid={`card-team-${i}`}>
      <div className="tm-photo">
        {m.bild ? (
          <img src={m.bild} alt={`${c.bildAlt} ${m.name}`} width={640} height={800} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
        ) : (
          <div className="tm-ph" data-testid={`team-initialen-${i}`}>
            <span className="tm-initials" aria-hidden="true">{initialen(m)}</span>
          </div>
        )}
        {m.badge && <span className="tm-badge">{m.badge}</span>}
      </div>
      <div className="tm-body">
        <h2 className="tm-name">{m.name}</h2>
        <p className="tm-role">{m.rolle}</p>
      </div>
    </li>
  );
}

export default function Team() {
  useDocMeta(c.meta.title, c.meta.description, true);
  const h = c.hero;
  return (
    <>
      <section className="section-hero bg-paper-image" data-testid="section-team-hero">
        <div className="wrap">
          <Reveal>
            <p className="kicker">{h.kicker}</p>
            <h1 className="h1">
              <strong className="block">{h.strong}</strong>
              <span className="block font-normal">{h.regular}</span>
            </h1>
            <p className="phero-lead">{h.lead}</p>
            <div className="hero-cta">
              <a href={h.button.href} className="btn btn-primary" data-testid="link-team-hero-button">{h.button.label}</a>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="tm-grid" data-testid="list-team">
              {c.items.map((m, i) => <Mitglied key={m.name} m={m} i={i} />)}
            </ul>
          </Reveal>
        </div>
      </section>

      <Kontakt />
    </>
  );
}
