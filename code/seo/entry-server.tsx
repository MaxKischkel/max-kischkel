import { renderToString } from 'react-dom/server';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

export { renderPageMeta } from '../seo';
export { SEITEN, sitemapXml } from './lib/page-meta';

/** Rendert eine Seite beim Build zu fertigem HTML (wird von prerender.mjs genutzt). */
export function render(path: string) {
  return renderToString(
    <ErrorBoundary>
      <App ssrPath={path} />
    </ErrorBoundary>,
  );
}
