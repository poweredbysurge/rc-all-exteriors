#!/usr/bin/env node
// Serves the built static output for local review and for the layout and
// Lighthouse checks. Static files only: /api/lead/ and /api/reviews/ need
// `npm run dev` or a Vercel deployment.
//   node scripts/serve-static.mjs [port]
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(fileURLToPath(new URL('..', import.meta.url)), '.vercel/output/static');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};
const compressible = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);

if (!existsSync(root)) {
  console.error('No build output. Run: npm run build');
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  let file = join(root, path);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) {
      res.writeHead(308, { Location: `${path}/${url.search}` });
      return res.end();
    }
    file = join(file, 'index.html');
  }
  let status = 200;
  if (!existsSync(file)) {
    file = join(root, '404.html');
    status = 404;
    if (!existsSync(file)) {
      res.writeHead(404);
      return res.end('Not found');
    }
  }
  const ext = extname(file);
  let body = readFileSync(file);
  const headers = {
    'Content-Type': types[ext] ?? 'application/octet-stream',
    // Mirrors Vercel: fingerprinted assets are immutable, HTML revalidates.
    'Cache-Control': path.startsWith('/_astro/') || path.startsWith('/fonts/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  };
  if (compressible.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
