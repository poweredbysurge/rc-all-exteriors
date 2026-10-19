#!/usr/bin/env node
// Verification gate, rendered half (master prompt section 21, "Layout").
// Needs the static server:  node scripts/serve-static.mjs  (port 4321)
//   node scripts/check-layout.mjs            every page at every width in the matrix
//   node scripts/check-layout.mjs /gutters/  one page
// Checks: no horizontal overflow, body copy at 18px or more, header fits and
// the nav switches at 900px, 44px tap targets, sticky CTA appears after the
// hero and hides while the form is on screen.
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, '.vercel/output/static');
const base = process.env.BASE_URL || 'http://localhost:4321';
// CHROME_PATH points at the browser; CHROME_ARGS (for example --no-sandbox in a
// container running as root) is split on spaces and passed through.
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTHS = [320, 360, 375, 390, 414, 430, 768, 820, 834, 900, 1024, 1280, 1440, 1744, 1920];

const routes = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name === 'index.html') routes.push('/' + relative(out, dir).replace(/\\/g, '/') + (dir === out ? '' : '/'));
  }
})(out);
const only = process.argv[2];
const targets = (only ? [only] : routes.sort()).map((r) => r.replace(/^\/\//, '/'));

const failures = [];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: process.env.CHROME_ARGS ? process.env.CHROME_ARGS.split(' ') : [] });
const page = await browser.newPage();

for (const route of targets) {
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: width < 900 ? 800 : 900 });
    await page.goto(base + route, { waitUntil: 'load' });
    const result = await page.evaluate((width) => {
      const problems = [];
      const doc = document.documentElement;
      if (doc.scrollWidth > doc.clientWidth) {
        const wide = [...document.querySelectorAll('main *, header *, footer *')].find((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('[aria-hidden="true"]');
        });
        problems.push(`horizontal overflow ${doc.scrollWidth} > ${doc.clientWidth}${wide ? ` at <${wide.tagName.toLowerCase()} class="${String(wide.className).slice(0, 50)}">` : ''}`);
      }
      // Body copy floor: every paragraph in main is 18px or more unless marked data-sm (captions, labels, card blurbs).
      for (const p of document.querySelectorAll('main p')) {
        if (p.closest('[data-sm]') || p.hasAttribute('data-sm') || p.closest('[hidden]')) continue;
        const size = parseFloat(getComputedStyle(p).fontSize);
        if (size < 18) problems.push(`paragraph at ${size}px: "${p.textContent.trim().slice(0, 40)}"`);
      }
      // Nothing below the 16px floor anywhere.
      for (const el of document.querySelectorAll('body *')) {
        if (!el.childNodes.length || el.closest('[hidden]') || el.closest('svg')) continue;
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (own && parseFloat(getComputedStyle(el).fontSize) < 16 && el.getBoundingClientRect().width > 0) {
          problems.push(`text under 16px (${getComputedStyle(el).fontSize}): "${el.textContent.trim().slice(0, 30)}"`);
          break;
        }
      }
      // Header
      const nav = document.querySelector('header nav[aria-label="Primary"]');
      const burger = document.querySelector('header [data-action="menu"]');
      const navVisible = nav && getComputedStyle(nav).display !== 'none';
      const burgerVisible = burger && getComputedStyle(burger).display !== 'none';
      if (width < 900 && (navVisible || !burgerVisible)) problems.push('below 900 the header must show the hamburger, not the nav');
      if (width >= 900 && (!navVisible || burgerVisible)) problems.push('from 900 the header must show the nav, not the hamburger');
      const bar = document.querySelector('[data-header-bar] > div');
      if (bar && bar.scrollWidth > bar.clientWidth + 1) problems.push(`header content overflows its container (${bar.scrollWidth} > ${bar.clientWidth})`);
      // Tap targets
      for (const el of document.querySelectorAll('a[href], button')) {
        const r = el.getBoundingClientRect();
        if (!r.width || el.closest('[hidden]') || el.closest('[inert]') || el.closest('.sr-only')) continue;
        if (getComputedStyle(el).display === 'inline') continue; // links inside running copy
        if (r.height < 43.5) problems.push(`tap target ${Math.round(r.height)}px tall: "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`);
      }
      return [...new Set(problems)].slice(0, 6);
    }, width);
    for (const problem of result) failures.push(`${route} @${width}: ${problem}`);
  }

  // Hero fit (master prompt section 10, ADR-005): on a photo hero the hero's
  // bottom edge is at or above the viewport's and the lead card is inside it,
  // at 1440 by 900 and 1920 by 1080.
  for (const [w, h] of [[1440, 900], [1920, 1080]]) {
    await page.setViewport({ width: w, height: h });
    await page.goto(base + route, { waitUntil: 'load' });
    const fit = await page.evaluate((vh) => {
      const hero = document.querySelector('[data-hero]');
      if (!hero) return [];
      const problems = [];
      const hr = hero.getBoundingClientRect();
      if (hr.bottom > vh + 1) problems.push(`hero bottom at ${Math.round(hr.bottom)}px overruns the ${vh}px viewport`);
      const card = hero.querySelector('[data-lead-card]');
      if (card) {
        const cr = card.getBoundingClientRect();
        if (cr.bottom > vh + 1) problems.push(`lead card bottom at ${Math.round(cr.bottom)}px is below the ${vh}px viewport`);
      }
      return problems;
    }, h);
    for (const problem of fit) failures.push(`${route} @${w}x${h}: ${problem}`);
  }

  // Sticky CTA at 390: hidden over the hero, visible after it, hidden over a form.
  await page.setViewport({ width: 390, height: 800 });
  await page.goto(base + route, { waitUntil: 'load' });
  const sticky = await page.evaluate(async () => {
    const bar = document.querySelector('[data-sticky-cta]');
    if (!bar) return ['no sticky CTA'];
    const wait = () => new Promise((r) => setTimeout(r, 450));
    const shown = () => bar.classList.contains('is-visible');
    const problems = [];
    const hero = document.querySelector('[data-hero]');
    await wait();
    if (hero && shown()) problems.push('sticky CTA is visible over the hero');
    const card = document.querySelector('[data-lead-card]');
    if (card) {
      card.scrollIntoView({ block: 'center', behavior: 'instant' });
      await wait();
      if (shown()) problems.push('sticky CTA is visible while the lead form is on screen');
    }
    const faq = document.querySelector('[data-faq]') ?? document.querySelector('main section:last-of-type');
    if (hero && faq) {
      faq.scrollIntoView({ block: 'center', behavior: 'instant' });
      await wait();
      if (!shown()) problems.push('sticky CTA did not appear after the hero');
    }
    return problems;
  });
  for (const problem of sticky) failures.push(`${route} @390: ${problem}`);
}
await browser.close();

console.log(`${targets.length} page(s) x ${WIDTHS.length} widths checked.`);
if (failures.length) {
  console.error(`\n${failures.length} LAYOUT FAILURE(S)`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('All layout checks passed.');
