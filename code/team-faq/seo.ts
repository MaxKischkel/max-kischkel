import type { Plugin } from 'vite';
import { pageMeta, PRELAUNCH_NOINDEX } from './src/lib/page-meta';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function renderPageMeta(html: string, path: string) {
  const { title, description } = pageMeta(path);
  const robot = PRELAUNCH_NOINDEX || !['/', '/angebot', '/bewertungen', '/team', '/impressum', '/datenschutz'].includes(path) ? 'noindex, nofollow' : 'index, follow';
  return html.replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`).replace(
    /<meta (name|property)="([^"]+)" content="[^"]*" \/>/g,
    (tag, attr: string, name: string) => {
      const value = name === 'robots' ? robot :
        ['og:title', 'twitter:title'].includes(name) ? title :
        ['description', 'og:description', 'twitter:description'].includes(name) ? description : undefined;
      return value === undefined ? tag : `<meta ${attr}="${name}" content="${escape(value)}" />`;
    },
  );
}

// Serve real per-route metadata before JavaScript runs, including static
// output for legal routes. The global noindex also protects SPA fallbacks.
export function pageMetadataPlugin(): Plugin {
  return {
    name: 'kischkel-page-metadata',
    transformIndexHtml(html, context) {
      const path = (context.originalUrl ?? context.path).split(/[?#]/)[0];
      return renderPageMeta(html, path === '/index.html' ? '/' : path);
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') return;
      const html = String(index.source);
      for (const [fileName, route] of [
        ['angebot/index.html', '/angebot'],
        ['bewertungen/index.html', '/bewertungen'],
        ['team/index.html', '/team'],
        ['impressum/index.html', '/impressum'],
        ['datenschutz/index.html', '/datenschutz'],
        ['404.html', '/404'],
      ]) {
        this.emitFile({ type: 'asset', fileName, source: renderPageMeta(html, route) });
      }
      },
    },
  };
}
