import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// ADR-001: Astro + Tailwind on Vercel. Static pages, two on-demand routes
// (/api/lead/, /api/reviews/), host-aware robots.txt, edge middleware for the
// preview noindex header.
export default defineConfig({
  // The production domain. Canonicals, OG and JSON-LD use src/lib/site.ts
  // (LAUNCH / LIVE), not this value; it only feeds Astro internals.
  site: 'https://rcallexteriors.com',
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel({ middlewareMode: 'edge' }),
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  image: {
    // Responsive widths are declared per image; no layout shift helpers needed.
    responsiveStyles: false,
    // Reviewer profile photos (Places API (New)) and the service-area map
    // (Maps Static API) are fetched at build and
    // emitted as local WebP, so the live site makes no request to Google for
    // them (ADR-009; check-integrity forbids external asset requests).
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
