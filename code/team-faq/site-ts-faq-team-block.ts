// ===== FAQ: Startseite und Angebot =====
export const faqContent = {
  kicker: 'Häufige Fragen',
  strong: 'Was Unternehmen uns',
  regular: 'am häufigsten fragen.',
  items: [
    { q: 'Wie schnell bekomme ich die ersten Bewerbungen?', a: 'In der Regel gehen die ersten Bewerbungen über Ihre neuen Kanäle nach ein bis zwei Wochen ein. Recruiting wird damit von Anfang an spürbar, nicht erst am Ende der Zusammenarbeit.' },
    { q: 'Sind Sie nicht einfach eine Agentur?', a: 'Nein. Eine Agentur besetzt Ihre Stellen und Sie zahlen jedes Mal neu. Wir bauen Ihr Recruiting im eigenen Haus auf: Prozesse, Kanäle und Know-how bleiben dauerhaft bei Ihnen.' },
    { q: 'Für wen eignet sich die Beratung?', a: 'Für mittelständische Unternehmen, die regelmäßig Personal brauchen, etwa aus Handwerk, Produktion, IT und Dienstleistung. Eine Personalabteilung brauchen Sie nicht, die Prozesse laufen danach mit unter zwei Stunden pro Woche.' },
    { q: 'Wie lange dauert die Zusammenarbeit?', a: 'Beim 360° Recruiting System steht die Basis nach rund zwei Wochen, danach begleiten wir die Umsetzung individuell. Die Arbeitgeber-DNA umfasst ein bis zwei Wochen Beratung und zwei bis drei Wochen Umsetzung. Auf Wunsch begleiten wir Sie auch danach langfristig.' },
    { q: 'Was kostet eine Erstanalyse?', a: 'Nichts. Die Erstanalyse dauert rund 20 Minuten und ist kostenlos und unverbindlich. Darin klären wir, wo in Ihrem Recruiting der größte Hebel liegt.' },
  ],
} as const;

// ===== Team-Seite =====
export interface TeamMitglied {
  name: string;
  rolle: string;
  badge: string | null; // z. B. 'Inhaber'
  bild: string | null; // null zeigt einen Kreis mit Initialen
  initialen?: string; // optional, sonst aus dem Namen gebildet
}
export const teamContent = {
  meta: { title: 'Team | Kischkel Personal', description: 'Die Menschen hinter Kischkel Personal: Beratung, Vertrieb, Recruiting, Marketing und Kundenbetreuung.' },
  hero: {
    kicker: 'Das Team',
    strong: 'Menschen hinter',
    regular: 'Kischkel Personal.',
    lead: 'Beratung, Vertrieb, Recruiting, Marketing und Kundenbetreuung: Gemeinsam sorgen wir dafür, dass Ihr Recruiting im eigenen Haus funktioniert.',
    button: { label: 'Erstanalyse anfragen', href: '#kontakt' },
  },
  bildAlt: 'Porträt von',
  // Ohne Foto (bild: null) erscheint ein runder Kreis mit Initialen.
  items: [
    { name: 'Max Kischkel', rolle: 'Inhaber & Berater', badge: 'Inhaber', bild: '/images/team-max-kischkel.webp' },
    { name: 'Jonas', rolle: 'Vertrieb', badge: null, bild: '/images/team-jonas.webp' },
    { name: 'Charlotte', rolle: 'Recruiting', badge: null, bild: '/images/team-charlotte.webp' },
    { name: 'Nico', rolle: 'Marketing', badge: null, bild: '/images/team-nico.webp' },
    { name: 'Sebastian', rolle: 'Kundenbetreuung', badge: null, bild: '/images/team-sebastian.webp' },
  ] as TeamMitglied[],
};
