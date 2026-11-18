// Suchmaschinen: Die Website ist freigegeben. true sperrt alle Seiten wieder (noindex).
export const PRELAUNCH_NOINDEX = false;

export const SITE_URL = 'https://kischkel-personal.de';

export const HOME_TITLE = 'Recruiting-Beratung für Ingenieurbüros | BAFA-gefördert | Kischkel Personal';
export const HOME_DESCRIPTION = 'Wir bauen mit Ingenieur- und Planungsbüros das eigene Recruiting auf: Bewerber selbst gewinnen statt teurer Agentur. Bis zu 80 % BAFA-Förderung.';

/** Alle Seiten, die beim Build als fertiges HTML erzeugt werden. index: false = nicht in Google, nicht in der Sitemap. */
export const SEITEN: { pfad: string; datei: string; index: boolean }[] = [
  { pfad: '/', datei: 'index.html', index: true },
  { pfad: '/angebot', datei: 'angebot/index.html', index: true },
  { pfad: '/bewertungen', datei: 'bewertungen/index.html', index: true },
  { pfad: '/impressum', datei: 'impressum/index.html', index: true },
  { pfad: '/datenschutz', datei: 'datenschutz/index.html', index: true },
  { pfad: '/termin-bestaetigt', datei: 'termin-bestaetigt/index.html', index: false },
  { pfad: '/404', datei: '404.html', index: false },
];

const sauber = (path: string) => path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

/** Kanonische Adresse: so, wie der Server sie ausliefert (Unterseiten mit Schrägstrich am Ende). */
export function canonicalUrl(path: string) {
  const p = sauber(path);
  return p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}/`;
}

export function indexierbar(path: string) {
  return !PRELAUNCH_NOINDEX && SEITEN.some((s) => s.index && s.pfad === sauber(path));
}

export function pageMeta(path: string) {
  const clean = sauber(path);
  if (clean === '/') return { title: HOME_TITLE, description: HOME_DESCRIPTION };
  if (clean === '/angebot') return {
    title: 'Angebot: Recruiting-Beratung für Ingenieurbüros | Kischkel Personal',
    description: 'Zwei Beratungspakete für Ingenieur- und Planungsbüros: das 360° Recruiting System und die Arbeitgeber-DNA. Je drei Monate, bis zu 80 % BAFA-gefördert.',
  };
  if (clean === '/bewertungen') return {
    title: 'Bewertungen und Erfahrungen | Kischkel Personal Recruiting-Beratung',
    description: 'Was Kunden über die Recruiting-Beratung von Kischkel Personal sagen: Erfahrungen mit Bewerbergewinnung, Recruiting-Prozessen und Arbeitgebermarke.',
  };
  if (clean === '/impressum') return {
    title: 'Impressum | Kischkel Personal',
    description: 'Impressum von Kischkel Personal, Recruiting-Beratung für Ingenieur- und Planungsbüros, Max Kischkel, Düsseldorf.',
  };
  if (clean === '/datenschutz') return {
    title: 'Datenschutz | Kischkel Personal',
    description: 'Datenschutzerklärung von Kischkel Personal, Recruiting-Beratung aus Düsseldorf.',
  };
  if (clean === '/termin-bestaetigt') return {
    title: 'Termin bestätigt | Kischkel Personal',
    description: 'Ihr Termin für die kostenlose Erstanalyse ist gebucht. Hier bereiten Sie sich in wenigen Minuten vor.',
  };
  return { title: 'Seite nicht gefunden | Kischkel Personal', description: 'Diese Seite existiert nicht.' };
}

/** sitemap.xml für alle indexierbaren Seiten. */
export function sitemapXml(stand: Date) {
  const tag = stand.toISOString().slice(0, 10);
  const urls = SEITEN.filter((s) => s.index && !PRELAUNCH_NOINDEX).map((s) => {
    const prio = s.pfad === '/' ? '1.0' : ['/impressum', '/datenschutz'].includes(s.pfad) ? '0.3' : '0.8';
    return `  <url>\n    <loc>${canonicalUrl(s.pfad)}</loc>\n    <lastmod>${tag}</lastmod>\n    <priority>${prio}</priority>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
