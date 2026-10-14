// Host-aware robots.txt. Allow on the production domain only; every preview
// host gets Disallow: /. Never a checked-in static file.
import type { APIRoute } from 'astro';
import { LIVE, isProductionHost } from '@/lib/site';

export const prerender = false;

export const GET: APIRoute = ({ request, url }) => {
  const host = request.headers.get('x-forwarded-host') ?? url.host;
  const body = isProductionHost(host)
    ? ['User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /thank-you/', '', `Sitemap: ${LIVE}/sitemap.xml`, '']
    : ['User-agent: *', 'Disallow: /', ''];
  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
};
