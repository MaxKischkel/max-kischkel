// Seite nach der Terminbuchung: /termin-bestaetigt
// Nicht in Menü oder Footer verlinkt. Den Link in Calendly als Weiterleitung oder in der Bestätigungsmail eintragen.
// Videos: einfach den Loom-Link eintragen (z. B. 'https://www.loom.com/share/abc123...'). null zeigt "Video folgt".

export type Video = { titel: string; dauer: string | null; loom: string | null };

export const terminSeite = {
  meta: {
    title: 'Termin bestätigt | Kischkel Personal',
    description: 'Ihr Termin für die kostenlose Erstanalyse ist gebucht. Hier bereiten Sie sich in wenigen Minuten vor.',
  },
  hero: {
    badge: 'Termin erfolgreich gebucht',
    titel: 'Die Bestätigung finden Sie in Ihrem E-Mail-Postfach.',
    text: 'Schauen Sie sich vorab kurz das Video an. So wissen Sie genau, was Sie im Erstgespräch erwartet, und wir nutzen die gemeinsame Zeit optimal.',
    video: { titel: 'So läuft Ihr Erstgespräch ab', dauer: null, loom: null } as Video,
    vertrauen: ['100+ Projekte', '200+ Stellen besetzt', '80+ zufriedene Kunden'],
  },
  fragen: {
    kicker: 'Kurz erklärt',
    titel: 'Die häufigsten Fragen',
    titelZwei: 'in wenigen Minuten.',
    text: 'Hier beantworten wir die Fragen, die uns vor dem ersten Gespräch am häufigsten gestellt werden.',
    items: [
      { titel: 'Sind Sie nicht einfach eine Agentur?', dauer: null, loom: null },
      { titel: 'Wie schnell bekomme ich die ersten Bewerbungen?', dauer: null, loom: null },
      { titel: 'Für wen eignet sich die Beratung?', dauer: null, loom: null },
      { titel: 'Wie lange dauert die Zusammenarbeit?', dauer: null, loom: null },
    ] as Video[],
  },
  erwartung: {
    kicker: 'Im Erstgespräch',
    titel: 'Das erwartet Sie.',
    punkte: [
      'Wir schauen uns an, wie Sie heute einstellen: Anzeigen, Kanäle, Abläufe und Ihren Auftritt als Arbeitgeber.',
      'Sie erhalten eine ehrliche Einschätzung, wo es hakt und was am meisten bringt.',
      'Gemeinsam klären wir, ob und wie wir Sie unterstützen können.',
      'Das Gespräch ist kostenlos und unverbindlich.',
    ],
  },
  vorbereitung: {
    kicker: 'Vorbereitung',
    titel: 'Eine kleine Aufgabe vor unserem Gespräch.',
    text: 'Nehmen Sie sich fünf Minuten und notieren Sie kurz:',
    punkte: [
      'Welche Stellen sind gerade offen oder werden in den nächsten zwölf Monaten frei?',
      'Über welche Wege suchen Sie heute Mitarbeiter, zum Beispiel Stellenbörsen, Agenturen oder Empfehlungen?',
      'Was hat Sie Recruiting im letzten Jahr ungefähr gekostet, etwa an Agenturprovisionen?',
      'Was ist gerade Ihre größte Baustelle im Recruiting?',
    ],
    hinweis: 'Je konkreter Ihre Antworten, desto mehr nehmen Sie aus dem Gespräch mit.',
  },
  stimmen: {
    kicker: 'Stimmen',
    titel: 'Was unsere Kunden sagen.',
    // Namen aus den Bewertungen (site.ts), die hier gezeigt werden
    namen: ['Ralf Werner', 'Markus Brenner', 'Stefan Lorenz'],
    link: 'Alle Bewertungen ansehen',
  },
  abschluss: {
    titel: 'Sie können den Termin doch nicht wahrnehmen?',
    text: 'Über den Link in Ihrer Bestätigungsmail können Sie ihn jederzeit verschieben oder absagen. Bei Fragen erreichen Sie uns direkt:',
  },
  video: {
    folgt: 'Video folgt',
    laden: 'Video abspielen',
    hinweis: 'Das Video wird von Loom geladen. Dabei werden Daten an Loom in den USA übertragen.',
  },
};
