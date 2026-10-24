// Preview lock, second layer (master prompt section 15). Any host that is not
// the production domain gets X-Robots-Tag: noindex on the on-demand responses
// (robots.txt, the API), and robots.txt itself disallows on that host, so a
// Vercel preview URL is never indexed. Runs inside the render function, not at
// the edge (ADR-013): edge mode broke POST bodies to /api/lead/ on Vercel.
import { defineMiddleware } from 'astro:middleware';
import { isProductionHost } from '@/lib/site';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  // The URL host, not a header: this also runs at build for prerendered pages,
  // where request headers do not exist.
  const host = context.url.host;
  if (!isProductionHost(host)) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
});
