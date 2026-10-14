#!/usr/bin/env node
// Source hygiene for src/assets/photos (master prompt section 13). Run after
// dropping new originals in:
//   node scripts/optimize-images.mjs
// It bakes in EXIF rotation, strips metadata, caps the long edge at 3200px,
// converts stray PNG/HEIC-free formats to JPG and flags filenames that are
// not kebab-case. The build makes the AVIF and WebP derivatives; this only
// keeps the originals sane. It never upscales and never touches design/.
import { readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dir = join(fileURLToPath(new URL('..', import.meta.url)), 'src/assets/photos');
const MAX = 3200;
let problems = 0;

for (const name of readdirSync(dir)) {
  const ext = extname(name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'].includes(ext)) continue;
  const file = join(dir, name);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z]+$/.test(name)) {
    console.error(`rename needed (kebab-case, no spaces): ${name}`);
    problems++;
  }
  const meta = await sharp(file).metadata();
  const rotated = (meta.orientation ?? 1) > 1;
  const tooBig = Math.max(meta.width, meta.height) > MAX;
  const notJpg = !['.jpg', '.jpeg'].includes(ext);
  if (!rotated && !tooBig && !notJpg) continue;
  const before = statSync(file).size;
  const buffer = await sharp(file)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  const target = notJpg ? file.replace(/\.[^.]+$/, '.jpg') : file;
  writeFileSync(target, buffer);
  if (notJpg) renameSync(file, `${file}.replaced`);
  console.log(`${name}: ${rotated ? 'rotation baked in, ' : ''}${tooBig ? `capped at ${MAX}px, ` : ''}${notJpg ? 'converted to JPG, ' : ''}${Math.round(before / 1024)}KB to ${Math.round(buffer.length / 1024)}KB`);
}
if (problems) process.exit(1);
console.log('Photo sources are clean.');
