#!/usr/bin/env node
// Prints each built page's surface sequence (w white, t tint, D dark) and its
// photo count, so the rhythm rules in master prompt section 5 can be read off
// in one screen. A report, not a gate (ADR-006).
//   npm run build && node scripts/audit-rhythm.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)), '.vercel/output/static');
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name === 'index.html' ? [join(d, e.name)] : []));

for (const file of walk(root).sort()) {
  const html = readFileSync(file, 'utf8');
  const route = file.replace(root, '').replace(/index\.html$/, '');
  const bands = [...html.matchAll(/<(section|div)[^>]*data-(section|hero)="?([^" >]*)"?[^>]*class="([^"]*)"/g)].map((m) =>
    /bg-surface-contrast/.test(m[4]) ? 'D' : /bg-surface-muted|bg-surface-subtle/.test(m[4]) ? 't' : /bg-surface\b/.test(m[4]) ? 'w' : '?',
  );
  const photos = (html.match(/<picture>/g) ?? []).length;
  const seq = bands.join('');
  const flags = [];
  if (/DD/.test(seq)) flags.push('dark bands touching');
  if (/D[wt]D/.test(seq)) flags.push('one light band between darks');
  if (/[wt]{4,}/.test(seq)) flags.push('four or more light bands in a row');
  console.log(route.padEnd(36), 'photos', String(photos).padStart(2), '|', seq.padEnd(14), flags.join('; '));
}
