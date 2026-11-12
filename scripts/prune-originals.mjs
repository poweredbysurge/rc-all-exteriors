#!/usr/bin/env node
// Astro copies every imported original into the output next to its AVIF and
// WebP derivatives. Nothing references those originals, and no JPG or PNG may
// ship (master prompt section 13), so they are removed after the build.
import { readdirSync, readFileSync, rmSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const webpSources = new Set(readdirSync(join(root, 'src/assets/photos')).filter((n) => n.endsWith('.webp')));
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
    // A WebP original (the guide illustrations, ADR-023 addendum) is copied
    // the same way: name.hash.webp, beside its name.hash_xxx derivatives. It
    // goes when nothing references it; a derivative is always referenced.
    const webpOriginal = /^(.+)\.[\w-]{8}\.webp$/.exec(name);
    if (webpOriginal && webpSources.has(`${webpOriginal[1]}.webp`)) {
      if (!all.includes(name)) {
        rmSync(join(assets, name));
        console.log(`pruned original ${name}`);
      }
      continue;
    }
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
