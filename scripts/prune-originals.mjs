#!/usr/bin/env node
// Astro copies every imported original into the output next to its AVIF and
// WebP derivatives. Nothing references those originals, and no JPG or PNG may
// ship (master prompt section 13), so they are removed after the build.
import { readdirSync, readFileSync, rmSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
for (const out of ['.vercel/output/static', 'dist/client', 'dist'].map((d) => join(root, d))) {
  const assets = join(out, '_astro');
  if (!existsSync(assets)) continue;
  const html = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(html|css|js)$/.test(name)) html.push(readFileSync(full, 'utf8'));
    }
  })(out);
  const all = html.join('\n');
  for (const name of readdirSync(assets)) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue;
    if (all.includes(name)) {
      console.error(`prune-originals: ${name} is referenced by the build and was kept. Route it through the image pipeline.`);
      process.exitCode = 1;
      continue;
    }
    rmSync(join(assets, name));
    console.log(`pruned original ${name}`);
  }
}
