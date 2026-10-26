// /guides/ is not a page: the Resources hub is the one index (ADR-018). The
// guides themselves stay at /guides/<slug>/.
import type { APIRoute } from 'astro';
export const prerender = false;
export const ALL: APIRoute = () => new Response(null, { status: 301, headers: { Location: '/resources/' } });
