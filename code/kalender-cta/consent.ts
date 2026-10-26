import { tracking } from '@/content/site';

export const CONSENT_KEY = 'kp-consent';
export type ConsentSelection = { statistik: boolean; marketing: boolean; extern: boolean };
export type ConsentChoice = ConsentSelection & { version: 1; datum: string };
export const NECESSARY_ONLY: ConsentSelection = { statistik: false, marketing: false, extern: false };
export const ACCEPT_ALL: ConsentSelection = { statistik: true, marketing: true, extern: true };

export function expiresAt(choice: ConsentChoice) {
  const date = new Date(choice.datum);
  date.setUTCMonth(date.getUTCMonth() + 12);
  return date.getTime();
}

export function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const c = value as Partial<ConsentChoice>;
    if (c.version !== 1 || typeof c.datum !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(c.datum)
      || typeof c.statistik !== 'boolean' || typeof c.marketing !== 'boolean' || typeof c.extern !== 'boolean') return null;
    const created = Date.parse(c.datum);
    if (!Number.isFinite(created) || new Date(created).toISOString() !== c.datum
      || created > Date.now() || expiresAt(c as ConsentChoice) <= Date.now()) return null;
    // A readable but non-writable store cannot safely persist a later withdrawal.
    window.localStorage.setItem(CONSENT_KEY, raw);
    return { version: 1, datum: c.datum, statistik: c.statistik, marketing: c.marketing, extern: c.extern };
  } catch {
    return null;
  }
}

export function storeConsent(selection: ConsentSelection): ConsentChoice | null {
  try {
    const value: ConsentChoice = {
      version: 1, datum: new Date().toISOString(),
      statistik: selection.statistik, marketing: selection.marketing, extern: selection.extern,
    };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    const stored = readConsent();
    return stored?.datum === value.datum
      && stored.statistik === value.statistik && stored.marketing === value.marketing && stored.extern === value.extern ? stored : null;
  } catch {
    try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* Fail closed even when removal is blocked. */ }
    return null;
  }
}

type MetaQueue = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaQueue;
  loaded: boolean;
  version: string;
};
type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: MetaQueue;
  _fbq?: MetaQueue;
};

function gaId() {
  return tracking.ga4Id && /^G-[A-Z0-9]+$/i.test(tracking.ga4Id) ? tracking.ga4Id : null;
}

/** Öffentlicher Calendly-Buchungslink aus site.ts (nur https://calendly.com/...), unabhängig von der Einwilligung. */
export function calendlyLink(): string | null {
  if (!tracking.calendlyUrl) return null;
  try {
    const url = new URL(tracking.calendlyUrl);
    return url.protocol === 'https:' && url.hostname === 'calendly.com' && url.pathname.length > 1 ? url.href : null;
  } catch {
    return null;
  }
}

/** Calendly-Link nur mit Einwilligung in externe Inhalte. */
export function allowedCalendlyUrl(): string | null {
  if (!readConsent()?.extern || !tracking.calendlyUrl) return null;
  try {
    const url = new URL(tracking.calendlyUrl);
    return url.protocol === 'https:' && (url.hostname === 'calendly.com' || url.hostname.endsWith('.calendly.com')) ? url.href : null;
  } catch {
    return null;
  }
}

export function clearConsentCookies(categories: { statistik: boolean; marketing: boolean }) {
  try {
    const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]).filter(name =>
      (categories.statistik && /^(?:_ga(?:_.*)?|_gid)$/.test(name))
      || (categories.marketing && /^(?:_fbp|_fbc)$/.test(name)));
    const parts = window.location.hostname.split('.');
    const domains = new Set(['', window.location.hostname, `.${window.location.hostname}`]);
    for (let i = 1; i < parts.length - 1; i++) {
      domains.add(parts.slice(i).join('.'));
      domains.add(`.${parts.slice(i).join('.')}`);
    }
    const paths = new Set(['/']);
    const segments = window.location.pathname.split('/').filter(Boolean);
    for (let i = 1; i <= segments.length; i++) {
      const path = `/${segments.slice(0, i).join('/')}`;
      paths.add(path);
      paths.add(`${path}/`);
    }
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    }
  } catch {
    // Storage restrictions must never enable an optional service.
  }
}

export function revokeServices(selection: ConsentSelection) {
  const w = window as TrackingWindow;
  const id = gaId();
  if (!selection.statistik && id) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
    w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }
  if (!selection.marketing) w.fbq?.('consent', 'revoke');
  clearConsentCookies({ statistik: !selection.statistik, marketing: !selection.marketing });
}

/** Fail closed: reread persisted consent, never trust an unchecked UI value. */
export function loadConsentedServices() {
  const choice = readConsent();
  if (!choice) return;
  const w = window as TrackingWindow;
  const id = gaId();
  if (choice.statistik && id && !document.getElementById('kp-ga4-script')) {
    w.dataLayer ??= [];
    w.gtag ??= function () { w.dataLayer!.push(arguments); };
    (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
    w.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    w.gtag('js', new Date());
    w.gtag('config', id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.id = 'kp-ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  }
  const pixel = tracking.metaPixelId;
  if (choice.marketing && pixel && /^\d+$/.test(pixel) && !document.getElementById('kp-meta-pixel')) {
    if (!w.fbq) {
      const queue = ((...args: unknown[]) => {
        if (queue.callMethod) queue.callMethod(...args);
        else queue.queue.push(args);
      }) as MetaQueue;
      queue.queue = [];
      queue.push = queue;
      queue.loaded = true;
      queue.version = '2.0';
      w.fbq = queue;
      w._fbq = queue;
    }
    w.fbq('consent', 'grant');
    w.fbq('init', pixel);
    w.fbq('track', 'PageView');
    const script = document.createElement('script');
    script.id = 'kp-meta-pixel';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
  }
}
