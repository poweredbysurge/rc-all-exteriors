import business from '@/data/business.json';

// LAUNCH is the host the build is reviewed on. LIVE is the production domain.
// Canonical, og:url, og:image and every JSON-LD URL go through rebase(), so
// cutover is the one line below: change SITE from LAUNCH to LIVE.
// `npm run check:production` fails while SITE is not LIVE.
export const LAUNCH = 'https://rc-all-exteriors.vercel.app';
export const LIVE = 'https://rcallexteriors.com';
export const SITE: string = LIVE;

// Hosts that may be indexed. Everything else gets Disallow: / in robots.txt
// and an X-Robots-Tag: noindex header from the middleware.
export const PRODUCTION_HOSTS = ['rcallexteriors.com', 'www.rcallexteriors.com'];

export function isProductionHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return PRODUCTION_HOSTS.includes(host.toLowerCase().replace(/:\d+$/, ''));
}

/** Absolute URL on the active host for a site path. Paths always carry a trailing slash. */
export function rebase(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return SITE + (path.startsWith('/') ? path : `/${path}`);
}

export const PHONE = business.phone.display;
export const TEL = `tel:${business.phone.e164}`;
export const MAILTO = `mailto:${business.email}`;

/** Consent copy version stored with every submission (master prompt section 10). */
export const CONSENT_TEXT_VERSION = 'sms-consent-2026-10-v1';
export const CONSENT_TEXT = `Yes, I'd like to receive text messages from ${business.name} about my inquiry, including appointment confirmations and quote updates. Message frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe. Consent is not a condition of purchase. See our Privacy Policy and SMS Terms.`;

export const LEAD_SCHEMA_VERSION = '1.0';
