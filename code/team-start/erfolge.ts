// Erfolge auf der Deutschlandkarte (Abschnitt "Einsatzgebiet" auf der Startseite).
//
// Diese Liste können Sie selbst pflegen. Jeder Eintrag erscheint als Punkt auf der Karte,
// die Popups werden nacheinander eingeblendet.
//
//   stadt       Name der Stadt
//   lat         Breitengrad, z. B. 48.14
//   lng         Längengrad, z. B. 11.58
//   text        fette erste Zeile im Popup, z. B. "3 Stellen besetzt"
//   untertitel  kleine zweite Zeile, z. B. "IT-Beratung · München"
//
// Die Position auf der Karte wird automatisch aus lat und lng berechnet.
// Koordinaten finden: in Google Maps mit der rechten Maustaste auf den Ort klicken,
// die erste Zahl ist lat, die zweite lng. Einträge außerhalb Deutschlands werden ignoriert.
// Bitte nur echte Ergebnisse eintragen.

export interface Erfolg {
  stadt: string;
  lat: number;
  lng: number;
  text: string;
  untertitel: string;
}

export const erfolge: Erfolg[] = [
  { stadt: 'München', lat: 48.14, lng: 11.58, text: '4 Stellen besetzt', untertitel: 'IT-Beratung · München' },
  { stadt: 'Düsseldorf', lat: 51.23, lng: 6.78, text: '7 Stellen besetzt', untertitel: 'Handwerk · Düsseldorf' },
  { stadt: 'Hamburg', lat: 53.55, lng: 9.99, text: '6 Stellen besetzt', untertitel: 'Produktion · Hamburg' },
  { stadt: 'Berlin', lat: 52.52, lng: 13.40, text: 'Stelle besetzt', untertitel: 'Berlin' },
  { stadt: 'Stuttgart', lat: 48.78, lng: 9.18, text: 'Stelle besetzt', untertitel: 'Stuttgart' },
  { stadt: 'Leipzig', lat: 51.34, lng: 12.37, text: 'Stelle besetzt', untertitel: 'Leipzig' },
];
