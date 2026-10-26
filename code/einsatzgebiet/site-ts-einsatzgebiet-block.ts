// ===== Einsatzgebiet: interaktive Deutschlandkarte =====
export interface EinsatzOrt {
  ort: string; // z. B. 'Köln'
  bundesland: BundeslandKey; // Kürzel, z. B. 'NW'
  lat: number; // Breitengrad des Ortes, z. B. 50.9375
  lon: number; // Längengrad des Ortes, z. B. 6.9603
  ergebnis: string; // z. B. '3 Stellen besetzt'
  hervorheben?: boolean; // Hinweis dauerhaft auf der Karte zeigen (höchstens 3 Orte)
}
export const einsatzgebietContent = {
  kicker: 'Einsatzgebiet',
  strong: 'Von Düsseldorf aus.',
  regular: 'Für Unternehmen in ganz Deutschland.',
  text: 'Wir unterstützen Unternehmen in allen 16 Bundesländern dabei, offene Stellen mit eigenem Recruiting zu besetzen: vom Handwerk über die Produktion bis zur IT-Beratung.',
  fakten: [
    { wert: '16', label: 'Bundesländer im Einsatzgebiet' },
    { wert: 'NRW', label: 'Firmensitz in Düsseldorf' },
  ],
  firmensitz: { kicker: 'Firmensitz', ort: 'Düsseldorf', lat: 51.2277, lon: 6.7735 },
  laenderTitel: 'Bundesländer',
  orteTitel: 'Besetzte Stellen',
  landKicker: 'Bundesland',
  hinweisMaus: 'Fahren Sie mit der Maus über ein Bundesland.',
  hinweisTouch: 'Tippen Sie auf ein Bundesland.',
  // Nur echte, vom Inhaber gelieferte Orte eintragen. Leer lassen, bis Daten vorliegen.
  orte: [] as EinsatzOrt[],
};
