// JSON-LD builders. Every value comes from business.json, the reviews proxy or
// the parsed copy. Nothing is typed in here, so schema cannot drift from the
// page (master prompt section 15).
import business from '@/data/business.json';
import { rebase } from '@/lib/site';
import { plain, type FaqBlock } from '@/lib/copy';
import type { ReviewsData } from '@/lib/reviews';
import { liveCount } from '@/lib/render';

const BUSINESS_ID = () => `${rebase('/')}#business`;

export function businessSchema(reviews: ReviewsData, image: string) {
  const sameAs = Object.values(business.profiles).filter((v): v is string => !!v);
  return {
    '@type': business.schemaType,
    '@id': BUSINESS_ID(),
    name: business.name,
    legalName: business.legalName,
    url: rebase('/'),
    telephone: business.phone.e164,
    email: business.email,
    image,
    logo: rebase('/logos/logo-full-color.svg'),
    // Service-area business: locality and region only, never a street address.
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
    },
    areaServed: business.areaServed.map((name) => ({
      '@type': 'City',
      name: `${name}, ${business.address.addressRegion}`,
    })),
    openingHoursSpecification: business.hours.spec.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    ...(sameAs.length ? { sameAs } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.rating,
      reviewCount: reviews.count,
      bestRating: 5,
    },
  };
}

export function breadcrumbSchema(trail: { label: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: rebase(item.href),
    })),
  };
}

export function serviceSchema(opts: {
  path: string;
  name: string;
  serviceType: string;
  description: string;
  areaServed?: string[];
  free?: boolean;
}) {
  return {
    '@type': 'Service',
    '@id': `${rebase(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: rebase(opts.path),
    provider: { '@id': BUSINESS_ID() },
    areaServed: (opts.areaServed ?? business.areaServed).map((name) => ({
      '@type': 'City',
      name: `${name}, ${business.address.addressRegion}`,
    })),
    ...(opts.free ? { offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' } } : {}),
  };
}

/**
 * FAQPage from the same blocks the accordion renders. An answer that is still
 * an unfilled CONFIRM slot has no text yet, so it is left out of the schema
 * until Ricardo answers; the visible row shows the placeholder.
 */
export function faqSchema(faqs: FaqBlock[]) {
  const entries = faqs
    .map((f) => ({ q: f.q, a: liveCount(plain(f.a)) }))
    .filter((f) => f.a.length > 0);
  if (!entries.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function pageSchema(type: string, opts: { path: string; name: string; description: string }) {
  return {
    '@type': type,
    '@id': `${rebase(opts.path)}#webpage`,
    url: rebase(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { '@type': 'WebSite', '@id': `${rebase('/')}#website`, name: business.name, url: rebase('/') },
    about: { '@id': BUSINESS_ID() },
  };
}

export function itemListSchema(items: { name: string; href: string }[]) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: rebase(item.href),
    })),
  };
}

// One Person node for the owner, defined on About and referenced by guides (ADR-018).
export const PERSON_ID = () => `${rebase('/about/')}#person`;

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID(),
    url: rebase('/about/'),
    name: business.owner,
    jobTitle: 'Owner',
    worksFor: { '@id': BUSINESS_ID() },
  };
}

/** Article for a guide: headline, the owner as author, the business as publisher. */
export function articleSchema(opts: { path: string; headline: string; description: string; published: string; modified: string | null; images: string[] }) {
  return {
    '@type': 'Article',
    '@id': `${rebase(opts.path)}#article`,
    mainEntityOfPage: rebase(opts.path),
    headline: opts.headline,
    description: opts.description,
    image: opts.images,
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    author: { '@type': 'Person', '@id': PERSON_ID(), name: business.owner, url: rebase('/about/') },
    publisher: { '@id': BUSINESS_ID(), name: business.name },
  };
}
