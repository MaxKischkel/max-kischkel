// ===== Team (Abschnitt auf der Startseite) =====
export interface TeamMitglied {
  name: string;
  rolle: string;
  badge: string | null; // z. B. 'Inhaber'
  bild: string | null; // null zeigt einen Kreis mit Initialen
  initialen?: string; // optional, sonst aus dem Namen gebildet
}
export const teamContent = {
  kicker: 'Das Team',
  strong: 'Menschen hinter',
  regular: 'Kischkel Personal.',
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
