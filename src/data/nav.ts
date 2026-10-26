// Site structure: services, cities, navigation, breadcrumbs. One registry so
// header, footer, mobile panel, sitemap and check-integrity agree.
import { allCopyPages, first, plain, section, type Inline } from '@/lib/copy';

export interface Service {
  href: string;
  label: string;
  icon: string;
  group: 'roofing' | 'exteriors';
  serviceType: string;
}

// Order follows the footer on the Gate A artboards. Icons are the names in design/icons.md.
export const services: Service[] = [
  { href: '/roof-replacement/', label: 'Roof Replacement', icon: 'house', group: 'roofing', serviceType: 'Roof Replacement' },
  { href: '/roof-repair/', label: 'Roof Repair', icon: 'droplet', group: 'roofing', serviceType: 'Roof Repair' },
  { href: '/emergency-roof-repair/', label: 'Emergency Roof Repair', icon: 'phone', group: 'roofing', serviceType: 'Emergency Roof Repair' },
  { href: '/storm-damage-roof-repair/', label: 'Storm Damage', icon: 'cloud-lightning', group: 'roofing', serviceType: 'Storm Damage Roof Repair' },
  { href: '/free-roof-inspection/', label: 'Free Roof Inspection', icon: 'clipboard-check', group: 'roofing', serviceType: 'Roof Inspection' },
  { href: '/certainteed-roofing/', label: 'CertainTeed Roofing', icon: 'award', group: 'roofing', serviceType: 'CertainTeed Roof Installation' },
  { href: '/metal-roofing/', label: 'Metal Roofing', icon: 'layers', group: 'roofing', serviceType: 'Metal Roof Installation' },
  { href: '/commercial-roofing/', label: 'Commercial Roofing', icon: 'building-2', group: 'roofing', serviceType: 'Commercial Roofing' },
  { href: '/skylights/', label: 'Skylights', icon: 'sun', group: 'roofing', serviceType: 'Skylight Installation and Repair' },
  { href: '/windows-doors/', label: 'Windows and Doors', icon: 'square', group: 'exteriors', serviceType: 'Window and Door Replacement' },
  { href: '/gutters/', label: 'Gutters', icon: 'droplets', group: 'exteriors', serviceType: 'Gutter Installation' },
  { href: '/siding/', label: 'Siding', icon: 'layout-panel-left', group: 'exteriors', serviceType: 'Siding Installation and Repair' },
];

export const serviceByHref = new Map(services.map((s) => [s.href, s]));

/** The five services the mobile panel lists before "All services" (nav-open-390). */
export const mobileNavServices = [
  '/roof-replacement/',
  '/roof-repair/',
  '/emergency-roof-repair/',
  '/storm-damage-roof-repair/',
  '/free-roof-inspection/',
].map((h) => serviceByHref.get(h)!);

export interface City {
  name: string;
  slug: string;
  href: string | null;
  /** Approximate town centre, public geography, for the schematic service-area map. */
  lat: number;
  lon: number;
}

// Live city pages first, in the order the chips are drawn. A null href is a
// "coming soon" town: plain text, never a link, until its page exists.
export const cities: City[] = [
  { name: 'Fairfax', slug: 'fairfax-va', href: '/service-areas/fairfax-va/', lat: 38.8462, lon: -77.3064 },
  { name: 'Springfield', slug: 'springfield-va', href: '/service-areas/springfield-va/', lat: 38.7893, lon: -77.1872 },
  { name: 'Lorton', slug: 'lorton-va', href: '/service-areas/lorton-va/', lat: 38.7043, lon: -77.2278 },
  { name: 'Alexandria', slug: 'alexandria-va', href: '/service-areas/alexandria-va/', lat: 38.8048, lon: -77.0469 },
  { name: 'Fairfax Station', slug: 'fairfax-station-va', href: null, lat: 38.8007, lon: -77.3255 },
  { name: 'Arlington', slug: 'arlington-va', href: null, lat: 38.8816, lon: -77.091 },
  { name: 'McLean', slug: 'mclean-va', href: null, lat: 38.9339, lon: -77.1773 },
  { name: 'Great Falls', slug: 'great-falls-va', href: null, lat: 38.9982, lon: -77.2883 },
];
export const homeBase = { name: 'Woodbridge', lat: 38.6582, lon: -77.2497 };
export const lakeRidge = { name: 'Lake Ridge', lat: 38.6879, lon: -77.2978 };

export const liveCities = cities.filter((c) => c.href);
export const soonCities = cities.filter((c) => !c.href);

export const primaryNav = [
  { href: '/services/', label: 'Services', hasMenu: true },
  { href: '/service-areas/', label: 'Service Areas' },
  { href: '/resources/', label: 'Resources' },
  { href: '/reviews/', label: 'Reviews' },
  { href: '/about/', label: 'About' },
];

export const footerAreas = [
  { href: '/', label: 'Woodbridge' },
  { href: '/service-areas/lorton-va/', label: 'Lorton' },
  { href: '/service-areas/fairfax-va/', label: 'Fairfax' },
  { href: '/service-areas/springfield-va/', label: 'Springfield' },
  { href: '/service-areas/alexandria-va/', label: 'Alexandria' },
  { href: '/service-areas/', label: 'All service areas' },
];

export const footerCompany = [
  { href: '/about/', label: 'About' },
  { href: '/reviews/', label: 'Reviews' },
  { href: '/projects/', label: 'Projects' },
  { href: '/warranty/', label: 'Warranty' },
  { href: '/financing/', label: 'Financing' },
  { href: '/contact/', label: 'Contact' },
];

export const legalLinks = [
  { href: '/privacy-policy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/sms-terms/', label: 'SMS Terms' },
];

export interface RouteEntry {
  path: string;
  /** Breadcrumb label. */
  label: string;
  /** Chip and menu label when the breadcrumb label is a full guide title. */
  short?: string;
  kind: 'home' | 'service' | 'offer' | 'city' | 'hub' | 'trust' | 'guide' | 'post' | 'legal' | 'utility';
  /** Files whose last git commit dates the page in sitemap.xml. */
  sources: string[];
  noindex?: boolean;
  /** Parent in the breadcrumb trail. */
  parent?: string;
}

const svc = (s: Service, batch: string): RouteEntry => ({
  path: s.href,
  label: s.label,
  kind: 'service',
  parent: '/services/',
  sources: ['src/pages/[service].astro', `copy/${batch}`],
});

const batchOf: Record<string, string> = {
  '/roof-replacement/': 'batch-1.md',
  '/roof-repair/': 'batch-1.md',
  '/storm-damage-roof-repair/': 'batch-1.md',
  '/emergency-roof-repair/': 'batch-2.md',
  '/windows-doors/': 'batch-3.md',
  '/gutters/': 'batch-3.md',
  '/siding/': 'batch-3.md',
  '/certainteed-roofing/': 'batch-3.md',
  '/metal-roofing/': 'batch-3.md',
  '/commercial-roofing/': 'batch-4.md',
  '/skylights/': 'batch-4.md',
};

// Guides and blog posts register themselves from their copy files (ADR-018):
// any copy page under /guides/ or /blog/ with a [PUBLISHED] date. Newest first;
// the same date keeps copy order. title is the H1, shortTitle the menu label.
export interface Article {
  href: string;
  title: string;
  shortTitle: string;
  summary: Inline[];
  published: string;
  batch: string;
}
const articlesUnder = (prefix: string): Article[] =>
  allCopyPages
    .filter((p) => p.url.startsWith(prefix) && p.url !== prefix && p.published)
    .map((p) => {
      const title = plain(first(section(p, 'Hero'), 'h1')!.inline);
      return { href: p.url, title, shortTitle: p.shortTitle ?? title, summary: p.summary ?? p.metaDescription, published: p.published!, batch: p.batch };
    })
    .sort((a, b) => b.published.localeCompare(a.published));
export const guides = articlesUnder('/guides/');
export const posts = articlesUnder('/blog/');
// The blog switches on with its first post: the /blog/ index, its menu and
// footer link, the hub section and the sitemap entry. Zero posts, none of it.
export const hasBlog = posts.length > 0;

// The Resources group in the mobile menu and the footer.
export const resourceLinks = [
  { href: '/resources/', label: 'All resources' },
  ...guides.map((g) => ({ href: g.href, label: g.shortTitle })),
  ...(hasBlog ? [{ href: '/blog/', label: 'Blog' }] : []),
];

// City pages after the launch three live in their own batch.
const cityBatch: Record<string, string> = { 'alexandria-va': 'batch-6.md' };

export const routes: RouteEntry[] = [
  { path: '/', label: 'Home', kind: 'home', sources: ['src/pages/index.astro', 'copy/batch-1.md'] },
  ...services
    .filter((s) => s.href !== '/free-roof-inspection/')
    .map((s) => svc(s, batchOf[s.href])),
  {
    path: '/free-roof-inspection/',
    label: 'Free Roof Inspection',
    kind: 'offer',
    sources: ['src/pages/free-roof-inspection.astro', 'copy/batch-1.md'],
  },
  { path: '/services/', label: 'Services', kind: 'hub', sources: ['src/pages/services.astro', 'copy/batch-4.md'] },
  {
    path: '/service-areas/',
    label: 'Service Areas',
    kind: 'hub',
    sources: ['src/pages/service-areas/index.astro', 'copy/batch-4.md'],
  },
  ...liveCities.map(
    (c): RouteEntry => ({
      path: c.href!,
      label: c.name,
      kind: 'city',
      parent: '/service-areas/',
      sources: ['src/pages/service-areas/[city].astro', `copy/${cityBatch[c.slug] ?? 'batch-5.md'}`],
    }),
  ),
  { path: '/warranty/', label: 'Warranty', kind: 'trust', sources: ['src/pages/warranty.astro', 'copy/batch-2.md'] },
  { path: '/financing/', label: 'Financing', kind: 'trust', sources: ['src/pages/financing.astro', 'copy/batch-2.md'] },
  { path: '/about/', label: 'About', kind: 'trust', sources: ['src/pages/about.astro', 'copy/batch-2.md'] },
  { path: '/contact/', label: 'Contact', kind: 'trust', sources: ['src/pages/contact.astro', 'copy/batch-2.md'] },
  { path: '/reviews/', label: 'Reviews', kind: 'trust', sources: ['src/pages/reviews.astro', 'copy/batch-4.md'] },
  { path: '/projects/', label: 'Projects', kind: 'trust', sources: ['src/pages/projects/index.astro', 'copy/batch-5.md'] },
  { path: '/resources/', label: 'Resources', kind: 'hub', sources: ['src/pages/resources.astro', 'copy/guides-1.md'] },
  ...guides.map((g): RouteEntry => ({ path: g.href, label: g.title, short: g.shortTitle, kind: 'guide', parent: '/resources/', sources: ['src/pages/guides/[slug].astro', `copy/${g.batch}`] })),
  ...(hasBlog ? [{ path: '/blog/', label: 'Blog', kind: 'hub' as const, parent: '/resources/', sources: ['src/pages/blog/[...index].astro'] }] : []),
  ...posts.map((p): RouteEntry => ({ path: p.href, label: p.title, short: p.shortTitle, kind: 'post', parent: '/blog/', sources: ['src/pages/blog/[slug].astro', `copy/${p.batch}`] })),
  { path: '/privacy-policy/', label: 'Privacy Policy', kind: 'legal', sources: ['src/pages/privacy-policy.astro'] },
  { path: '/terms/', label: 'Terms', kind: 'legal', sources: ['src/pages/terms.astro'] },
  { path: '/sms-terms/', label: 'SMS Terms', kind: 'legal', sources: ['src/pages/sms-terms.astro'] },
  {
    path: '/thank-you/',
    label: 'Thank you',
    kind: 'utility',
    noindex: true,
    sources: ['src/pages/thank-you.astro'],
  },
];

export const routeByPath = new Map(routes.map((r) => [r.path, r]));
/** The label for a chip or menu link to a route: short for guides and posts. */
export const chipLabel = (path: string) => {
  const r = routeByPath.get(path)!;
  return r.short ?? r.label;
};

export function breadcrumbsFor(path: string): { label: string; href: string; short?: string }[] {
  const trail: { label: string; href: string; short?: string }[] = [];
  let entry = routeByPath.get(path);
  while (entry) {
    trail.unshift({ label: entry.label, href: entry.path, short: entry.short });
    entry = entry.parent ? routeByPath.get(entry.parent) : undefined;
  }
  if (path !== '/') trail.unshift({ label: 'Home', href: '/' });
  return trail;
}
