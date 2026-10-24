#!/usr/bin/env node
// Share cards and favicons. Run when a hero photo, the logo, the brand strip
// or the review count changes:
//   CHROME_PATH=... node scripts/generate-og.mjs
// One 1200x630 card per page type (home, service, city, default): the real
// hero photo under the dark scrim, the white wordmark, the Google rating, and
// the credential marks from src/data/brands.ts (ADR-011: the card carries the
// same trust cues as the page, not a paragraph of text). Rendered from an HTML
// template in headless Chrome so it uses the site's own fonts and tokens, then
// written as JPG. JPG is allowed here and for favicons only (master prompt
// section 13).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import puppeteer from 'puppeteer-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const theme = readFileSync(join(root, 'src/styles/theme.generated.css'), 'utf8');
const token = (name) => theme.match(new RegExp(`${name}:\\s*([^;]+);`))[1].trim();
const business = JSON.parse(readFileSync(join(root, 'src/data/business.json'), 'utf8'));

// The count rounds down to the nearest ten with a plus, so the card does not
// go stale between regenerations (master prompt section 12: a count is never
// a literal that can drift from the live chip).
const count = business.reviews.fallbackCount;
const countLabel = `${Math.floor(count / 10) * 10}+`;
const rating = business.reviews.fallbackRating.toFixed(1);

const cards = {
  home: { photo: 'rc-colonial-street-hero.jpg', line: 'Roofing and exterior work in Woodbridge, VA' },
  service: { photo: 'rc-two-story-front-walkway.jpg', line: 'Roof replacement and repair, Northern Virginia' },
  city: { photo: 'rc-mansard-shake-front-yard-sign.jpg', line: 'Local roofing, from our Woodbridge base' },
  default: { photo: 'rc-colonial-street-hero.jpg', line: 'Roofing and exteriors, Woodbridge and Northern Virginia' },
};

// Credential marks for the card: the strip's roofing credentials, as white
// marks on the dark scrim. SVGs inline, rasters inverted through CSS.
const brandsDir = join(root, 'src/assets/brands');
const svg = (f, white = false) => {
  let s = readFileSync(join(brandsDir, f), 'utf8');
  if (white) s = s.replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="#FFF"').replace(/fill:\s*#[0-9A-Fa-f]{3,6}/g, 'fill: #FFF');
  return s;
};
const dataUri = (f) => `data:image/png;base64,${readFileSync(join(brandsDir, f)).toString('base64')}`;
const marks = [
  `<img class="mark raster" style="height:30px" src="${dataUri('certainteed.png')}" alt="CertainTeed">`,
  `<span class="mark" style="height:44px">${svg('brava.svg').replace(/fill="#FFF"/g, 'fill="#FFF"')}</span>`,
  `<span class="mark" style="height:44px">${svg('bbb.svg', true)}</span>`,
];

const fontUrl = (f) => pathToFileURL(join(root, 'public/fonts', f)).href;
const html = ({ photo, line }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;font-weight:700;font-stretch:125%;src:url("${fontUrl('archivo-expanded-700-latin.woff2')}") format("woff2")}
@font-face{font-family:Manrope;font-weight:400 800;src:url("${fontUrl('manrope-variable-latin.woff2')}") format("woff2")}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;font-family:Manrope,sans-serif;color:#fff;background:${token('--color-surface-contrast')}}
.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,${token('--color-surface-contrast')}e6 0%,${token('--color-surface-contrast')}a6 50%,${token('--color-surface-contrast')}33 100%)}
.scrim2{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,${token('--color-surface-contrast')}d9 100%)}
.in{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.logo{height:84px;width:auto;align-self:flex-start}
h1{font-family:Archivo,sans-serif;font-weight:700;font-stretch:125%;font-size:50px;line-height:1.06;max-width:860px;letter-spacing:-0.01em}
.chip{display:inline-flex;align-items:center;gap:14px;background:#fff;color:${token('--color-fg')};border-radius:999px;padding:12px 22px;font-size:24px;font-weight:600;width:max-content}
.chip b{font-weight:800}
.stars{display:inline-flex;gap:3px;color:${token('--color-star')}}
.stars svg{width:24px;height:24px;fill:currentColor}
.sub{color:${token('--color-fg-inverse-muted')};font-size:22px;font-weight:500;margin-top:14px}
.bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.marks{display:flex;align-items:center;gap:40px}
.mark{display:inline-flex;align-items:center;opacity:.95}
.mark svg{height:100%;width:auto;display:block}
.raster{filter:brightness(0) invert(1)}
</style></head><body>
<img class="photo" src="${pathToFileURL(join(root, 'src/assets/photos', photo)).href}">
<div class="scrim"></div><div class="scrim2"></div>
<div class="in">
  <img class="logo" src="${pathToFileURL(join(root, 'public/logos/logo-white.svg')).href}" alt="RC All Exteriors">
  <div>
    <h1>${line}</h1>
    <div class="sub">Class A licensed · 10-year workmanship warranty</div>
  </div>
  <div class="bottom">
    <div class="chip"><span>Google</span><span class="stars">${'<svg viewBox="0 0 24 24"><path d="M12 2.3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.3l1.2-6.5L2.5 9.2l6.6-.9z"/></svg>'.repeat(5)}</span><b>${rating}</b><span>${countLabel} reviews</span></div>
    <div class="marks">${marks.join('')}</div>
  </div>
</div>
</body></html>`;

mkdirSync(join(root, 'public/og'), { recursive: true });
// Same browser settings as check-layout: CHROME_PATH, CHROME_ARGS.
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: (process.env.CHROME_ARGS ?? '').split(' ').filter(Boolean) });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
for (const [name, card] of Object.entries(cards)) {
  if (!existsSync(join(root, 'src/assets/photos', card.photo))) throw new Error(`${name}: missing photo ${card.photo}`);
  // Written to disk and opened as a file URL so the photo, logo and fonts
  // (all file URLs) are allowed to load; setContent on about:blank blocks them.
  const tmp = join(root, 'public/og', `.${name}.html`);
  writeFileSync(tmp, html(card));
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))]));
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(join(root, `public/og/${name}.jpg`));
  rmSync(tmp);
  console.log(`public/og/${name}.jpg`);
}
await browser.close();

// Favicons from the blue mark.
const icon = readFileSync(join(root, 'public/logos/icon-blue.svg'), 'utf8');
const [, , , vbW, vbH] = icon.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/);
const mark = await sharp(Buffer.from(icon), { density: 600 }).resize({ width: 400 }).png().toBuffer();
const square = (size, background) =>
  sharp({ create: { width: 512, height: 512, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer()
    .then((buf) => sharp(buf).resize(size, size).png());
await (await square(32, { r: 255, g: 255, b: 255, alpha: 0 })).toFile(join(root, 'public/favicon-32.png'));
await (await square(180, { r: 255, g: 255, b: 255, alpha: 1 })).toFile(join(root, 'public/apple-touch-icon.png'));
const pad = (Number(vbW) - Number(vbH)) / 2;
const [x, y] = icon.match(/viewBox="([\d.]+) ([\d.]+)/).slice(1).map(Number);
writeFileSync(join(root, 'public/favicon.svg'), icon.replace(/viewBox="[^"]+"/, `viewBox="${x} ${y - pad} ${vbW} ${vbW}"`));
console.log('favicons written');
