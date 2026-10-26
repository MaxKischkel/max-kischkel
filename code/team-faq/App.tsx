import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { useLocationProperty } from 'wouter/use-browser-location';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { ConsentProvider } from '@/components/site/consent-context';
import { CookieConsent } from '@/components/site/cookie-consent';
import Home from '@/pages/home';
import Impressum from '@/pages/impressum';
import Datenschutz from '@/pages/datenschutz';
import NotFound from '@/pages/not-found';
import Angebot from '@/pages/angebot';
import Bewertungen from '@/pages/bewertungen';
import Team from '@/pages/team';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function RouteScrollReset() {
  const [location] = useLocation();
  const hash = useLocationProperty(() => window.location.hash, () => '');
  useEffect(() => {
    const repeatAnchor = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank') return;
      const url = new URL(link.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search) {
        if (!url.hash) requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
        else if (url.hash === window.location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView());
      }
    };
    document.addEventListener('click', repeatAnchor);
    return () => document.removeEventListener('click', repeatAnchor);
  }, []);
  useLayoutEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [location, hash]);
  return null;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ConsentProvider>
      <div id="site-shell">
      <RouteScrollReset />
      <a href="#main" className="skip">Zum Inhalt springen</a>
      <Header />
      <main id="main">
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/angebot" component={Angebot} />
            <Route path="/bewertungen" component={Bewertungen} />
            <Route path="/team" component={Team} />
            <Route path="/impressum" component={Impressum} />
            <Route path="/datenschutz" component={Datenschutz} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </main>
      <Footer />
      </div>
      <CookieConsent />
      </ConsentProvider>
    </WouterRouter>
  );
}

export default App;
