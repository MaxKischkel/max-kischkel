import { Link } from 'wouter';
import { Logo } from './logo';
import { footerContent } from '@/content/site';
import { CookieSettingsButton } from './consent-context';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <Logo />
        <p className="mt-4 mb-0">{footerContent.tagline}</p>
        <nav aria-label="Rechtliches" className="foot-nav">
          <Link href="/datenschutz" className="foot-link" data-testid="link-datenschutz">Datenschutz</Link>
          <Link href="/impressum" className="foot-link" data-testid="link-impressum">Impressum</Link>
          <CookieSettingsButton />
        </nav>
        <p className="mt-6 mb-0 text-[15px]">{footerContent.copyright}</p>
      </div>
    </footer>
  );
}
