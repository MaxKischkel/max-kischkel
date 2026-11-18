import type { Plugin } from 'vite';
import { canonicalUrl, indexierbar, pageMeta } from './src/lib/page-meta';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Schreibt die Meta-Angaben einer Seite in das HTML (Titel, Beschreibung, Robots, Canonical, Open Graph). */
export function renderPageMeta(html: string, path: string) {
  const { title, description } = pageMeta(path);
  const robot = indexierbar(path) ? 'index, follow' : 'noindex, nofollow';
  const url = canonicalUrl(path);
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escape(url)}" />`)
    .replace(
      /<meta (name|property)="([^"]+)" content="[^"]*" \/>/g,
      (tag, attr: string, name: string) => {
        const value = name === 'robots' ? robot :
          name === 'og:url' ? url :
          ['og:title', 'twitter:title'].includes(name) ? title :
          ['description', 'og:description', 'twitter:description'].includes(name) ? description : undefined;
        return value === undefined ? tag : `<meta ${attr}="${name}" content="${escape(value)}" />`;
      },
    );
}

// Im Entwicklungsserver: Meta-Angaben pro Seite. Beim Build erzeugt prerender.mjs
// für jede Seite fertiges HTML mit Inhalt und Meta-Angaben sowie die sitemap.xml.
export function pageMetadataPlugin(): Plugin {
  return {
    name: 'kischkel-page-metadata',
    transformIndexHtml(html, context) {
      const path = (context.originalUrl ?? context.path).split(/[?#]/)[0];
      return renderPageMeta(html, path === '/index.html' ? '/' : path);
    },
  };
}
