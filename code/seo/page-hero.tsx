import { Reveal } from './reveal';

export interface PageHeroProps {
  kicker: string;
  strong: string;
  regular: string;
  lead: string;
  button?: { label: string; href: string };
  link?: { label: string; href: string };
  id?: string;
}

export function PageHero({ kicker, strong, regular, lead, button, link, id = 'page-hero' }: PageHeroProps) {
  return (
    <section className="section-hero bg-paper-image" data-testid={`section-${id}`}>
      <div className="wrap">
        <Reveal>
          <h1 className="h1">
            <span className="kicker">{kicker}</span>
            <strong className="block">{strong}</strong>
            <span className="block font-normal">{regular}</span>
          </h1>
          <p className="phero-lead">{lead}</p>
          {(button || link) && (
            <div className="hero-cta">
              {button && <a href={button.href} className="btn btn-primary" data-testid={`link-${id}-button`}>{button.label}</a>}
              {link && <a href={link.href} className="tlink" data-testid={`link-${id}-textlink`}>{link.label}</a>}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
