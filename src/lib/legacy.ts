// 301s from the old WordPress site (deploy/redirects.json), wired at the DNS
// cutover (ADR-014). Each old path is a small on-demand route under
// src/pages that answers with the 301 from this file, so the trailing-slash
// rule, the wildcard sources and the destinations all behave the same way
// (Astro's config redirects cannot send a wildcard source to a static page,
// and emit exact sources without the trailing slash the old links carry).
import type { APIRoute } from 'astro';
import parked from '../../deploy/redirects.json';

export function legacyRedirect(prefix: string): APIRoute {
  const rule = parked.redirects.find((r) => r.source.startsWith(prefix));
  return () =>
    rule && !parked.doNotDeployYet
      ? new Response(null, { status: rule.permanent ? 301 : 302, headers: { Location: rule.destination } })
      : new Response('Not found', { status: 404 });
}
