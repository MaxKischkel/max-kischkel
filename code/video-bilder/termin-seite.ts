// Seite nach der Terminbuchung: /termin-bestaetigt
// Nicht in Menü oder Footer verlinkt. Den Link in Calendly als Weiterleitung oder in der Bestätigungsmail eintragen.
// Videos: einfach den Loom-Link eintragen (z. B. 'https://www.loom.com/share/abc123...'). null zeigt "Video folgt".

// bild: Standbild aus dem Video (liegt unter public/images/loom/), wird vor dem Abspielen gezeigt
export type Video = { titel: string; dauer: string | null; loom: string | null; bild?: string | null };
export type FrageVideo = Video & { punkte: string[] };

export const terminSeite = {
  meta: {
    title: 'Termin bestätigt | Kischkel Personal',
    description: 'Ihr Termin für die kostenlose Erstanalyse ist gebucht. Hier bereiten Sie sich in wenigen Minuten vor.',
  },
  hero: {
    badge: 'Termin erfolgreich gebucht',
    titel: 'Die Bestätigung finden Sie in Ihrem E-Mail-Postfach.',
    text: 'Schauen Sie sich vorab kurz das Video an. So wissen Sie genau, was Sie im Erstgespräch erwartet, und wir nutzen die gemeinsame Zeit optimal.',
    video: { titel: 'So läuft Ihr Erstgespräch ab', dauer: '2 Minuten', loom: 'https://www.loom.com/share/85a2db0b2f4e4107bbbb466efc7f8c05', bild: '/images/loom/85a2db0b2f4e4107bbbb466efc7f8c05.webp' } as Video,
    vertrauen: ['100+ Projekte', '200+ Stellen besetzt', '80+ zufriedene Kunden'],
  },
  fragen: {
    kicker: 'Kurz erklärt',
    titel: 'Die häufigsten Fragen',
    titelZwei: 'in wenigen Minuten.',
    text: 'Hier beantworten wir die Fragen, die uns vor dem ersten Gespräch am häufigsten gestellt werden.',
    items: [
      {
        titel: 'Funktioniert das System auch auf dem Land?', dauer: '1 Minute', loom: 'https://www.loom.com/share/551b69447e9748a097268603107ae653', bild: '/images/loom/551b69447e9748a097268603107ae653.webp',
        punkte: [
          'Ja, auch auf dem Land und bei schwierig zu besetzenden Stellen.',
          'Die meisten Büros, mit denen wir arbeiten, sitzen nicht in der Großstadt.',
          'Ihr Vorteil: Viele Fachkräfte aus der Region pendeln täglich weit und wünschen sich eine Stelle in der Nähe.',
        ],
      },
      {
        titel: 'Wie schnell bekomme ich die ersten Bewerbungen?', dauer: 'Unter 1 Minute', loom: 'https://www.loom.com/share/d0d4b4ac66864b9eac6a02c0cf8603aa', bild: '/images/loom/d0d4b4ac66864b9eac6a02c0cf8603aa.webp',
        punkte: [
          'Erste Bewerbungen über die neuen Kanäle kommen in der Regel nach ein bis zwei Wochen.',
          'Die ersten Maßnahmen starten sofort und wirken direkt.',
          'Wie schnell eine Stelle besetzt ist, hängt von der Position ab: Ein Absolvent ist meist schneller gefunden als ein erfahrener Projektleiter.',
        ],
      },
      {
        titel: 'Über welche Wege kommen die passenden Bewerbungen?', dauer: '1 Minute', loom: 'https://www.loom.com/share/f92cd543a4c242baafc9fa3b265a689b', bild: '/images/loom/f92cd543a4c242baafc9fa3b265a689b.webp',
        punkte: [
          'Eine Anzeige, einmal erstellt und gleichzeitig auf mehreren Portalen ausgespielt, statt nur auf einem.',
          'Dazu gezielte Kanäle: Empfehlungen aus Ihrem Team, Hochschulen in der Nähe und die Ansprache von Fachkräften aus der Region.',
          'Ein Filter sorgt dafür, dass Sie nur Gespräche führen, die sich wirklich lohnen.',
          'Wir richten alles gemeinsam ein, Sie geben nur frei, was zu Ihnen passt.',
        ],
      },
      {
        titel: 'Was beinhalten die Pakete und wie lange dauern sie?', dauer: 'Unter 1 Minute', loom: 'https://www.loom.com/share/55d99d0b1f984383849c1ceca4a9f0bb', bild: '/images/loom/55d99d0b1f984383849c1ceca4a9f0bb.webp',
        punkte: [
          'Recruiting im eigenen Haus: die richtigen Leute ohne Agentur und ohne Provision pro Einstellung.',
          'Das Wissen bleibt dauerhaft bei Ihnen.',
          'Zwei Pakete, jeweils mit drei Monaten Laufzeit.',
        ],
      },
    ] as FrageVideo[],
  },
  foerderung: {
    kicker: 'Förderung',
    titel: 'Der Staat übernimmt',
    titelZwei: 'einen Großteil der Kosten.',
    text: 'Unsere Beratung ist förderfähig. Im Video erklären wir, wie die Förderung abläuft und was Sie selbst noch zahlen.',
    video: { titel: 'Förderung: nur den Eigenanteil zahlen', dauer: '1 Minute', loom: 'https://www.loom.com/share/bcaea310ce4d46208d29f7a739cde72b', bild: '/images/loom/bcaea310ce4d46208d29f7a739cde72b.webp' } as Video,
    punkte: [
      'Die Beratung wird über das BAFA gefördert.',
      'Je nach Standort Ihres Unternehmens übernimmt der Staat 50 oder sogar 80 Prozent des Beratungshonorars.',
      'Sie zahlen nur noch den Eigenanteil.',
      'Den Förderantrag füllen wir gemeinsam mit Ihnen aus.',
    ],
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
    // Welche Bewertungen aus site.ts hier erscheinen (Position in der Liste, ab 0)
    auswahl: [0, 4, 10],
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
