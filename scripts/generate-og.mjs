#!/usr/bin/env node
// Share cards and favicons. Run when a hero photo or the logo changes:
//   node scripts/generate-og.mjs
// One 1200x630 card per page type (home, service, city, default): a real job
// photo under the dark scrim with the white wordmark. JPG is allowed here and
// for favicons only (master prompt section 13).
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = readFileSync(join(root, 'design/tokens.css'), 'utf8');
const token = (name) => tokens.match(new RegExp(`${name}:\\s*([^;]+);`))[1].trim();
const dark = token('--color-surface-contrast');

const cards = {
  home: 'rc-select-01-hero-gbp-cover.jpg',
  service: 'rc-select-02-two-story-front.jpg',
  city: 'rc-select-04-mansard-yard-sign.jpg',
  default: 'rc-select-01-hero-gbp-cover.jpg',
};

mkdirSync(join(root, 'public/og'), { recursive: true });
const logo = await sharp(join(root, 'public/logos/logo-white.svg'), { density: 300 }).resize({ width: 420 }).png().toBuffer();
const scrim = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${dark}" stop-opacity="0.92"/><stop offset="0.55" stop-color="${dark}" stop-opacity="0.7"/><stop offset="1" stop-color="${dark}" stop-opacity="0.35"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`,
);
for (const [name, file] of Object.entries(cards)) {
  await sharp(join(root, 'src/assets/photos', file))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([{ input: scrim }, { input: logo, left: 80, top: 216 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(root, `public/og/${name}.jpg`));
  console.log(`public/og/${name}.jpg`);
}

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
const { writeFileSync } = await import('node:fs');
writeFileSync(join(root, 'public/favicon.svg'), icon.replace(/viewBox="[^"]+"/, `viewBox="${x} ${y - pad} ${vbW} ${vbW}"`));
console.log('favicons written');
