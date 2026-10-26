import { Reveal } from './reveal';

/** Kleiner Aufruf unter einem Abschnitt: optionaler Satz plus Button zur Erstanalyse. */
export function SektionCta({ text, button, href = '#kontakt', hinweis, id }: { text?: string; button: string; href?: string; hinweis?: string; id: string }) {
  return (
    <Reveal>
      <div className="scta" data-testid={`cta-${id}`}>
        {text && <p className="scta-text">{text}</p>}
        <a href={href} className="btn btn-primary" data-testid={`link-cta-${id}`}>{button}</a>
        {hinweis && <p className="scta-hinweis">{hinweis}</p>}
      </div>
    </Reveal>
  );
}
