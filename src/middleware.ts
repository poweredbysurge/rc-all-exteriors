// Preview lock, second layer (master prompt section 15). Any host that is not
// the production domain gets X-Robots-Tag: noindex, so a Vercel preview URL
// can never be indexed even if a crawler ignores robots.txt.
// Runs as Vercel edge middleware (astro.config.mjs, middlewareMode: 'edge').
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
