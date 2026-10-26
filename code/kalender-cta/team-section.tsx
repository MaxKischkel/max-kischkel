import { Reveal } from './reveal';
import { teamContent as c, sektionCtas, type TeamMitglied } from '@/content/site';
import { SektionCta } from './sektion-cta';
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
          <img src={m.bild} alt={`${c.bildAlt} ${m.name}`} width={640} height={800} loading="lazy" decoding="async" />
        ) : (
          <div className="tm-ph" data-testid={`team-initialen-${i}`}>
            <span className="tm-initials" aria-hidden="true">{initialen(m)}</span>
          </div>
        )}
        {m.badge && <span className="tm-badge">{m.badge}</span>}
      </div>
      <div className="tm-body">
        <h3 className="tm-name">{m.name}</h3>
        <p className="tm-role">{m.rolle}</p>
      </div>
    </li>
  );
}

/** Team auf der Startseite, direkt über der Deutschlandkarte. */
export function TeamSection() {
  return (
    <section id="team" className="section bg-greige-50" data-testid="section-team">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{c.kicker}</p>
          <h2 className="h2">
            <span className="block">{c.strong}</span>
            <span className="block" style={{ fontWeight: 400 }}>{c.regular}</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <ul className="tm-grid" data-testid="list-team">
            {c.items.map((m, i) => <Mitglied key={m.name} m={m} i={i} />)}
          </ul>
        </Reveal>
        <SektionCta id="team" {...sektionCtas.team} />
      </div>
    </section>
  );
}
