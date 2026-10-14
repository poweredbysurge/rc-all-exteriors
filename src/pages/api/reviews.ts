// GET /api/reviews/ : same-origin proxy to Google Places, so the API key
// never reaches the browser. Cached at the edge for 12 hours. Falls back to
// the last count Ricardo confirmed (business.json), never to "0 reviews".
import type { APIRoute } from 'astro';
import { fetchReviews } from '@/lib/reviews';

export const prerender = false;

export const GET: APIRoute = async () => {
  const data = await fetchReviews();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control':
        data.source === 'live' ? 'public, s-maxage=43200, stale-while-revalidate=86400' : 'public, s-maxage=600',
    },
  });
};
