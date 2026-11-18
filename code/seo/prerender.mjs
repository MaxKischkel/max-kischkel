// Erzeugt nach dem Build für jede Seite fertiges HTML (Inhalt + Meta-Angaben) und die sitemap.xml,
// damit Suchmaschinen den Inhalt ohne JavaScript sehen. Läuft automatisch über "pnpm run build".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist', 'public');
const serverDir = path.join(root, 'dist', 'server');
const { render, renderPageMeta, SEITEN, sitemapXml } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);

const vorlage = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
if (!vorlage.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> nicht gefunden');

for (const seite of SEITEN) {
  // Unterseiten werden vom Server mit Schrägstrich am Ende ausgeliefert (/bewertungen/), genauso rendern
  const pfad = seite.pfad === '/' || seite.pfad === '/404' ? seite.pfad : `${seite.pfad}/`;
  const app = render(pfad);
  const html = renderPageMeta(vorlage, seite.pfad).replace(
    '<div id="root"></div>',
    `<div id="root" data-vorgerendert="${seite.pfad}">${app}</div>`,
  );
  const ziel = path.join(out, seite.datei);
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, html);
  console.log(`prerender: ${seite.datei} (${Math.round(app.length / 1024)} KB Inhalt)`);
}

fs.writeFileSync(path.join(out, 'sitemap.xml'), sitemapXml(new Date()));
console.log('prerender: sitemap.xml');
fs.rmSync(serverDir, { recursive: true, force: true });
