#!/usr/bin/env node
// Verification gate (master prompt section 21), static half. Runs against the
// build output and exits non-zero on any failure, printing what failed and
// where. Silence is the defect.
//
//   node scripts/check-integrity.mjs               preview: open CONFIRM slots are reported
//   node scripts/check-integrity.mjs --production  CONFIRM slots and a non-LIVE host fail too
//
// The rendered half (overflow, computed type size, header fit, sticky CTA) is
// scripts/check-layout.mjs, which needs a browser.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '.vercel/output/static');
const production = process.argv.includes('--production');
const business = JSON.parse(readFileSync(join(root, 'src/data/business.json'), 'utf8'));
const siteTs = readFileSync(join(root, 'src/lib/site.ts'), 'utf8');
const LIVE = siteTs.match(/export const LIVE = '([^']+)'/)[1];
const LAUNCH = siteTs.match(/export const LAUNCH = '([^']+)'/)[1];
const SITE = /export const SITE: string = LIVE/.test(siteTs) ? LIVE : LAUNCH;

if (!existsSync(out)) {
  console.error('No build output. Run: npm run build');
  process.exit(1);
}

const failures = [];
const notes = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
// Lengths of titles and descriptions that come verbatim from the approved copy
// are the copy owner's to change, not the build's. Reported in preview, a
// failure for production.
const copyOwner = [];
const copyFail = (where, msg) => (production ? failures : copyOwner).push(`${where}: ${msg}`);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}
const files = walk(out);
// Search Console verification files (public/google<token>.html) are one line of
// text with no document around them, not pages.
const htmlFiles = files.filter((f) => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(f));
const routeOf = (file) => {
  const rel = '/' + relative(out, file).replace(/\\/g, '/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel === '/index.html' ? '/' : rel;
};

// Kill list, copy section of master prompt section 9. "seamless" is allowed
// only as the product name "seamless gutters" / "seamless aluminum" (copy voice rules).
const KILL = [
  /welcome to/i, /your trusted partner/i, /we pride ourselves/i, /look no further/i, /nestled in/i, /vibrant community/i,
  /hidden gem/i, /\belevate\b/i, /\bseamless(?!\s+(gutters?|aluminum))/i, /\bunlock\b/i, /\bempower/i, /revolutionary/i,
  /game-changing/i, /best-in-class/i, /cutting-edge/i, /state-of-the-art/i, /in today's fast-paced world/i, /we've got you covered/i,
  /\bpremier\b/i, /top-notch/i,
];

const pages = [];
for (const file of htmlFiles) {
  const route = routeOf(file);
  const html = readFileSync(file, 'utf8');
  const doc = parse(html, { blockTextElements: { script: true, style: true } });
  const noindex = /noindex/.test(doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '');
  const page = { route, file, html, doc, noindex };
  pages.push(page);

  // Structure
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length !== 1) fail(route, `${h1s.length} <h1> elements, expected exactly 1`);
  page.h1 = h1s[0]?.text.replace(/\s+/g, ' ').trim() ?? '';
  page.title = doc.querySelector('title')?.text.trim() ?? '';
  page.description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  if (!noindex) {
    if (page.title.length < 50 || page.title.length > 60) copyFail(route, `title is ${page.title.length} chars (50 to 60): "${page.title}"`);
    if (page.description.length < 140 || page.description.length > 160) copyFail(route, `meta description is ${page.description.length} chars (140 to 160)`);
  }
  const need = { canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') };
  for (const prop of ['og:url', 'og:image', 'og:title', 'og:description']) need[prop] = doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content');
  for (const name of ['twitter:card', 'twitter:image']) need[name] = doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content');
  for (const [key, value] of Object.entries(need)) {
    if (!value) fail(route, `missing ${key}`);
    else if (['canonical', 'og:url', 'og:image', 'twitter:image'].includes(key) && !value.startsWith(SITE)) fail(route, `${key} is not on ${SITE}: ${value}`);
  }
  if (need['og:image']) {
    const local = join(out, new URL(need['og:image']).pathname);
    if (!existsSync(local)) fail(route, `og:image file does not exist: ${need['og:image']}`);
  }

  // Heading order: no skipped levels.
  let prev = 0;
  for (const h of doc.querySelectorAll('h1, h2, h3, h4')) {
    const level = Number(h.tagName[1]);
    if (prev && level > prev + 1) fail(route, `heading level skips from h${prev} to h${level}: "${h.text.trim().slice(0, 50)}"`);
    prev = level;
  }

  // JSON-LD
  const faqPages = [];
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.text);
      const nodes = data['@graph'] ?? [data];
      for (const node of nodes) {
        if (node['@type'] === 'FAQPage') faqPages.push(node);
        if (node['@type'] === business.schemaType) {
          if (node.telephone !== business.phone.e164) fail(route, `schema telephone ${node.telephone} is not ${business.phone.e164}`);
          if (node.address?.streetAddress) fail(route, 'schema carries a streetAddress (service-area business)');
          if (!node.areaServed?.length) fail(route, 'schema has no areaServed');
        }
      }
      if (/streetAddress/.test(script.text)) fail(route, 'streetAddress appears in JSON-LD');
    } catch (err) {
      fail(route, `JSON-LD does not parse: ${err.message}`);
    }
  }
  if (faqPages.length > 1) fail(route, `${faqPages.length} FAQPage blocks, expected at most 1`);
  // FAQPage must mirror the visible accordion, in order. Open CONFIRM slots are not text yet.
  const visible = doc.querySelectorAll('[data-faq-question]').map((q) => {
    const row = q.closest('div.border-b') ?? q.parentNode.parentNode.parentNode;
    const answer = row.querySelector('[data-faq-answer]');
    const clone = parse(answer?.innerHTML ?? '');
    for (const c of clone.querySelectorAll('[data-confirm]')) c.remove();
    return { q: q.text.trim(), a: clone.text.replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim() };
  });
  if (visible.length && !faqPages.length && visible.some((v) => v.a)) fail(route, 'visible FAQ has no FAQPage schema');
  if (faqPages.length) {
    const expected = visible.filter((v) => v.a);
    const actual = faqPages[0].mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text }));
    if (expected.length !== actual.length) fail(route, `FAQPage has ${actual.length} entries, the accordion has ${expected.length} with answers`);
    expected.forEach((v, i) => {
      if (!actual[i]) return;
      if (v.q !== actual[i].q) fail(route, `FAQ ${i + 1} question differs between schema and page`);
      if (v.a !== actual[i].a) fail(route, `FAQ ${i + 1} answer differs between schema and page:\n      page:   ${v.a}\n      schema: ${actual[i].a}`);
    });
  }

  // NAP
  const footer = doc.querySelector('footer');
  if (footer && !footer.text.includes(business.phone.display)) fail(route, 'footer does not show the business.json phone number');
  if (footer && !footer.querySelector('[data-dni-skip]')) fail(route, 'footer NAP is missing data-dni-skip');

  // Content
  const body = doc.querySelector('body');
  for (const el of body.querySelectorAll('script, style')) el.remove();
  page.text = body.text.replace(/\s+/g, ' ');
  const main = doc.querySelector('main');
  page.mainText = main ? main.text.replace(/\s+/g, ' ').trim() : '';
  page.words = page.mainText.split(' ').filter(Boolean).length;
  if (/\u2014/.test(html)) fail(route, 'em dash in rendered HTML');
  for (const re of KILL) {
    const hit = (page.text + ' ' + page.title + ' ' + page.description).match(re);
    if (hit) fail(route, `kill-list phrase: "${hit[0]}"`);
  }
  // Customer reviews are verbatim and may shout; our own copy may not.
  const ours = parse(main?.innerHTML ?? '');
  for (const el of ours.querySelectorAll('[data-review-text]')) el.remove();
  if (/!/.test(ours.text.replace(/"[^"]*"/g, ''))) fail(route, 'exclamation point in visible copy');
  page.confirms = doc.querySelectorAll('[data-confirm]').map((el) => el.getAttribute('data-confirm'));
  if (production && page.confirms.length) fail(route, `${page.confirms.length} open CONFIRM slot(s): ${[...new Set(page.confirms)].join(' | ')}`);
  if (/\[CONFIRM/.test(html)) fail(route, 'raw [CONFIRM text leaked into the page');
  if (/12325|Woodlawn/i.test(html)) fail(route, 'street address in markup (service-area business)');

  // Paragraphs below the 18px floor must be explicitly marked as small UI text.
  for (const p of doc.querySelectorAll('main p, main li, main blockquote')) {
    const cls = p.getAttribute('class') ?? '';
    if (/\btext-body-sm\b/.test(cls) && p.getAttribute('data-sm') === undefined && p.tagName === 'P') fail(route, `paragraph set at 16px without data-sm: "${p.text.trim().slice(0, 50)}"`);
  }

  // Images
  for (const img of doc.querySelectorAll('img')) {
    const src = img.getAttribute('src') ?? '';
    for (const attr of ['width', 'height']) if (!img.getAttribute(attr)) fail(route, `<img> without ${attr}: ${src}`);
    if (img.getAttribute('alt') === undefined) fail(route, `<img> without alt: ${src}`);
    const eager = img.getAttribute('fetchpriority') === 'high';
    const inHeader = !!img.closest('header') || !!img.closest('#mobile-nav');
    if (!eager && !inHeader && img.getAttribute('loading') !== 'lazy') fail(route, `below-the-fold <img> is not lazy: ${src}`);
    if (/\.(jpe?g|png)(\?|$)/i.test(src)) fail(route, `JPG or PNG served in an <img>: ${src}`);
  }
  // LCP preload
  const heroImg = doc.querySelector('[data-hero] img[fetchpriority="high"]');
  const preloads = doc.querySelectorAll('link[rel="preload"][as="image"]');
  if (heroImg) {
    if (!preloads.length) fail(route, 'hero image has no LCP preload');
    const sources = heroImg.parentNode.querySelectorAll('source[type="image/avif"]').map((s) => s.getAttribute('srcset'));
    for (const link of preloads) if (!sources.includes(link.getAttribute('imagesrcset'))) fail(route, 'LCP preload does not match the hero <source> srcset');
  } else if (preloads.length) fail(route, 'image preload on a page with no hero image');
  if (doc.querySelectorAll('link[rel="preload"][as="font"]').length < 1) fail(route, 'heading font is not preloaded');

  // External requests
  for (const el of doc.querySelectorAll('link[href], script[src], img[src], source[srcset]')) {
    const url = el.getAttribute('href') ?? el.getAttribute('src') ?? el.getAttribute('srcset') ?? '';
    if (el.tagName === 'LINK' && ['canonical'].includes(el.getAttribute('rel'))) continue;
    if (/^https?:\/\//.test(url) && !url.startsWith(SITE)) fail(route, `external asset request: ${url.slice(0, 80)}`);
  }
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail(route, 'Google Fonts request');
}

// Uniqueness
const indexable = pages.filter((p) => !p.noindex);
for (const key of ['title', 'description', 'h1']) {
  const seen = new Map();
  for (const p of indexable) {
    const value = p[key].toLowerCase();
    if (seen.has(value)) fail(p.route, `duplicate ${key}, same as ${seen.get(value)}`);
    else seen.set(value, p.route);
  }
}
// Keyword lanes: no two pages share the keyword phrase that leads their title.
const lanes = new Map();
for (const p of indexable) {
  const lead = p.title.split('|')[0].trim().toLowerCase();
  if (lanes.has(lead)) fail(p.route, `primary keyword collision in title with ${lanes.get(lead)}: "${lead}"`);
  lanes.set(lead, p.route);
}

// Links
const routes = new Set(pages.map((p) => p.route));
const inlinks = new Map([...routes].map((r) => [r, new Set()]));
for (const p of pages) {
  for (const a of p.doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (href === '#' || href === '') fail(p.route, `dead "#" link: "${a.text.trim().slice(0, 40)}"`);
    else if (href.startsWith('#')) {
      if (!p.doc.querySelector(`[id="${href.slice(1)}"]`)) fail(p.route, `in-page link to a missing id: ${href}`);
    } else if (/^(tel:|mailto:)/.test(href)) {
      if (href.startsWith('tel:') && href !== `tel:${business.phone.e164}`) fail(p.route, `tel link is not the business.json number: ${href}`);
    } else if (/^https?:\/\//.test(href)) {
      /* external */
    } else {
      const path = href.split('#')[0].split('?')[0];
      if (/\.html$/.test(path)) fail(p.route, `link to .html: ${href}`);
      else if (!path.endsWith('/') && !extname(path)) fail(p.route, `link without a trailing slash: ${href}`);
      else if (extname(path) ? !existsSync(join(out, path)) : !routes.has(path)) fail(p.route, `link to a route that does not exist: ${href}`);
      else if (routes.has(path) && path !== p.route) inlinks.get(path).add(p.route);
    }
  }
}

// Inlink table. Chrome links count once per source page.
console.log('\nInlinks (distinct source pages) and word counts');
console.log('route'.padEnd(40), 'inlinks'.padStart(8), 'words'.padStart(7), 'confirm'.padStart(8));
for (const p of [...pages].sort((a, b) => a.route.localeCompare(b.route))) {
  const count = inlinks.get(p.route).size;
  console.log(p.route.padEnd(40), String(count).padStart(8), String(p.words).padStart(7), String(p.confirms.length).padStart(8));
  if (!p.noindex && p.route !== '/' && count < 3) fail(p.route, `only ${count} inbound links, needs 3 or more`);
}

console.log('\nKeyword audit (title lead and H1 per indexable page)');
for (const p of indexable) console.log(' ', p.route.padEnd(38), '|', p.title.split('|')[0].trim().padEnd(46), '|', p.h1);

// Swap test: sibling city pages may share a layout, not their sentences.
const cityPages = pages.filter((p) => /^\/service-areas\/[a-z-]+-va\/$/.test(p.route));
const cityName = (p) => p.h1.match(/in ([A-Za-z ]+), VA/)?.[1] ?? '';
const sentences = (p) => {
  const main = p.doc.querySelector('main');
  const parts = main.querySelectorAll('h1, h2, [data-hero] p, [data-section="Intro"] p, [data-section="Why us"] li, [data-faq-question], [data-faq-answer]');
  return parts.map((el) => el.text.replace(/\s+/g, ' ').trim().replaceAll(cityName(p), '{city}')).filter((s) => s.length > 20);
};
console.log('\nSwap test (share of city-specific copy that still reads true with the names swapped)');
for (let i = 0; i < cityPages.length; i++) {
  for (let j = i + 1; j < cityPages.length; j++) {
    const a = sentences(cityPages[i]);
    const b = new Set(sentences(cityPages[j]));
    const shared = a.filter((s) => b.has(s)).length / (a.length || 1);
    console.log(`  ${cityPages[i].route} vs ${cityPages[j].route}: ${(shared * 100).toFixed(0)}%`);
    if (shared >= 0.8) fail(cityPages[i].route, `fails the swap test against ${cityPages[j].route} (${(shared * 100).toFixed(0)}% shared)`);
  }
}

// Assets
for (const file of files) {
  const rel = '/' + relative(out, file);
  if (/\.(jpe?g|png)$/i.test(file) && !/^\/(og\/|email\/|favicon|apple-touch-icon)/.test(rel)) fail(rel, 'JPG or PNG in the output (only favicons, OG images and email logos may be)');
}
for (const font of ['archivo-expanded-700-latin.woff2', 'manrope-variable-latin.woff2']) {
  if (!existsSync(join(out, 'fonts', font))) fail('/fonts/', `missing self-hosted font ${font}`);
}

// Sitemap matches the indexable routes exactly.
const sitemap = existsSync(join(out, 'sitemap.xml')) ? readFileSync(join(out, 'sitemap.xml'), 'utf8') : '';
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = indexable.filter((p) => !p.route.endsWith('.html')).map((p) => SITE + p.route);
for (const loc of locs) if (!expected.includes(loc)) fail('/sitemap.xml', `lists a URL that is not an indexable page: ${loc}`);
for (const url of expected) if (!locs.includes(url)) fail('/sitemap.xml', `is missing ${url}`);
if (/<lastmod>/.test(sitemap) === false) notes.push('sitemap.xml has no lastmod values (page sources are not committed yet)');

// Source rules
const srcFiles = walk(join(root, 'src')).filter((f) => /\.(astro|ts|css|json)$/.test(f));
for (const file of srcFiles) {
  const rel = relative(root, file);
  const text = readFileSync(file, 'utf8');
  if (/\u2014/.test(text)) fail(rel, 'em dash in source');
  if (/\.(astro)$/.test(file) && /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-zA-Z-])/.test(text.replace(/&#\d+;/g, '').replace(/href="#[a-z-]+"/g, ''))) fail(rel, 'hex color in a component (use a token)');
}
for (const doc of ['STANDARDS.md', 'DESIGN-DEBT.md', 'WORKING-ORDER.md', 'README.md', 'CLAUDE.md']) {
  if (existsSync(join(root, doc)) && /\u2014/.test(readFileSync(join(root, doc), 'utf8'))) fail(doc, 'em dash');
}
try {
  execFileSync('node', [join(root, 'scripts/sync-tokens.mjs'), '--check'], { stdio: 'pipe' });
} catch {
  fail('src/styles/theme.generated.css', 'out of date with design/tokens.css');
}
if (!existsSync(join(root, 'deploy/redirects.json'))) fail('deploy/redirects.json', 'missing');
if (production && SITE !== LIVE) fail('src/lib/site.ts', `SITE is ${SITE}; flip it to LIVE (${LIVE}) for production`);

// Report
const totalConfirms = pages.reduce((n, p) => n + p.confirms.length, 0);
const unique = new Set(pages.flatMap((p) => p.confirms));
console.log(`\n${pages.length} pages, ${indexable.length} indexable. Host: ${SITE}.`);
console.log(`Open CONFIRM slots: ${totalConfirms} across the site, ${unique.size} distinct${production ? '' : ' (reported in preview, a failure with --production)'}.`);
for (const note of notes) console.log(`note: ${note}`);
if (copyOwner.length) {
  console.log(`\nFor the copy owner (${copyOwner.length}): lengths outside the 50 to 60 / 140 to 160 targets, text is verbatim from copy/`);
  for (const c of copyOwner) console.log(`  ! ${c}`);
}
if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nAll integrity checks passed.');
