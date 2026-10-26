// LAUNCH BLOCK: Keep true while the legal pages are drafts. Set false only
// after completing the launch checklist in replit.md and rebuild the site.
export const PRELAUNCH_NOINDEX = true;
export const HOME_TITLE = 'Kischkel Personal | Internes Recruiting statt Agentur';
export const HOME_DESCRIPTION = 'Kischkel Personal baut mit Ihnen ein internes Recruiting-System auf: klare Prozesse, ein befähigtes Team und eine starke Arbeitgebermarke.';

export function pageMeta(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (clean === '/') return { title: HOME_TITLE, description: HOME_DESCRIPTION };
  if (clean === '/angebot') return {
    title: 'Angebot | Kischkel Personal',
    description: 'Zwei Pakete für Ihr internes Recruiting: das 360° Recruiting System und die Arbeitgeber-DNA. Preis auf Anfrage.',
  };
  if (clean === '/bewertungen') return {
    title: 'Bewertungen | Kischkel Personal',
    description: 'Rückmeldungen von Unternehmen, die mit Kischkel Personal ihr internes Recruiting aufgebaut haben.',
  };
  if (clean === '/impressum') return {
    title: 'Impressum | Kischkel Personal',
    description: 'Impressum von Kischkel Personal, Max Kischkel, Düsseldorf.',
  };
  if (clean === '/datenschutz') return {
    title: 'Datenschutz | Kischkel Personal',
    description: 'Datenschutzerklärung von Kischkel Personal.',
  };
  return { title: 'Seite nicht gefunden | Kischkel Personal', description: 'Diese Seite existiert nicht.' };
}
